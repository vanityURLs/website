locals {
  protected_paths = [
    "*/_stats",
    "*/_stats/*",
    "*/_tests",
    "*/_tests/*",
    "_tests",
    "_tests/*",
  ]

  public_pages = [
    "/",
    "/index",
    "/lookup",
    "/privacy",
    "/terms",
    "/abuse",
    "/security",
    "/404",
    "/expired",
    "/disabled",
    "/maintenance",
    "/security.txt",
    "/.well-known/security.txt",
    "/robots.txt",
    "/favicon.svg",
  ]

  static_extensions = [
    ".css",
    ".ico",
    ".js",
    ".png",
    ".svg",
    ".txt",
    ".webmanifest",
    ".woff",
  ]

  rate_limit_expression = join(" and\n", concat([
    "http.host eq \"${var.apex_hostname}\"",
    "not cf.client.bot",
    "not starts_with(http.request.uri.path, \"/_stats\")",
    "not starts_with(http.request.uri.path, \"/_tests\")",
    "not starts_with(http.request.uri.path, \"/_analytics\")",
    "not http.request.uri.path in {${join(" ", formatlist("\"%s\"", local.public_pages))}}",
  ], [
    for extension in local.static_extensions :
    "not lower(http.request.uri.path) contains \"${extension}\""
  ]))

  scanner_probe_expression = <<-EOT
    http.host eq "${var.apex_hostname}" and (
      ends_with(lower(http.request.uri.path), ".php") or
      lower(http.request.uri.path) contains "/wp-content/" or
      lower(http.request.uri.path) contains "/wp-includes/" or
      lower(http.request.uri.path) contains "/wp-admin/" or
      lower(http.request.uri.path) contains "/wp-" or
      lower(http.request.uri.path) contains "wp-login.php" or
      lower(http.request.uri.path) contains "xmlrpc.php" or
      lower(http.request.uri.path) contains ".env" or
      lower(http.request.uri.path) contains "phpinfo" or
      lower(http.request.uri.path) contains "/vendor/" or
      lower(http.request.uri.path) contains "/.git" or
      lower(http.request.uri.path) contains "/cgi-bin/"
    )
  EOT

  unexpected_methods_expression = <<-EOT
    http.host eq "${var.apex_hostname}" and
    not http.request.method in {"GET" "HEAD" "OPTIONS"} and
    not (
      http.request.method eq "POST" and
      http.request.uri.path in {"/lookup/resolve" "/_analytics/lookup"}
    )
  EOT

  suspicious_clients_expression = <<-EOT
    http.host eq "${var.apex_hostname}" and
    not cf.client.bot and
    not starts_with(http.request.uri.path, "/_stats") and
    not starts_with(http.request.uri.path, "/_tests") and
    (
      lower(http.user_agent) contains "curl" or
      lower(http.user_agent) contains "wget" or
      lower(http.user_agent) contains "python-requests" or
      lower(http.user_agent) contains "go-http-client" or
      lower(http.user_agent) contains "httpclient"
    )
  EOT

  ai_crawler_expression = <<-EOT
    http.host eq "${var.apex_hostname}" and
    http.request.uri.path ne "/robots.txt" and (
      lower(http.user_agent) contains "applebot" or
      lower(http.user_agent) contains "archive.org_bot" or
      lower(http.user_agent) contains "arquivo-web-crawler" or
      lower(http.user_agent) contains "bingbot" or
      lower(http.user_agent) contains "chatgpt-user" or
      lower(http.user_agent) contains "duckassistbot" or
      lower(http.user_agent) contains "googlebot" or
      lower(http.user_agent) contains "manus-user" or
      lower(http.user_agent) contains "meta-externalfetcher" or
      lower(http.user_agent) contains "mistralai-user" or
      lower(http.user_agent) contains "oai-searchbot" or
      lower(http.user_agent) contains "perplexity-user" or
      lower(http.user_agent) contains "perplexitybot" or
      lower(http.user_agent) contains "proratainc" or
      lower(http.user_agent) contains "terracotta"
    )
  EOT

  custom_waf_rules = concat([
    {
      action      = "block"
      description = "Block scanner probes"
      enabled     = true
      expression  = local.scanner_probe_expression
    },
    {
      action      = "block"
      description = "Block unexpected methods"
      enabled     = true
      expression  = local.unexpected_methods_expression
    },
    {
      action      = "managed_challenge"
      description = "Challenge suspicious clients"
      enabled     = true
      expression  = local.suspicious_clients_expression
    },
  ], var.enable_ai_crawler_block_rule ? [
    {
      action      = "block"
      description = "Block unwanted AI crawlers"
      enabled     = true
      expression  = local.ai_crawler_expression
    },
  ] : [])
}

resource "cloudflare_zero_trust_access_application" "vanityurls_private_paths" {
  account_id       = var.cloudflare_account_id
  domain           = "${var.apex_hostname}/*/_stats"
  name             = var.worker_name
  type             = "self_hosted"
  session_duration = "24h"

  destinations = [
    for path in local.protected_paths : {
      type = "public"
      uri = "${var.apex_hostname}/${path}"
    }
  ]

  policies = [{
    name       = "Allow maintainers"
    precedence = 1
    decision   = "allow"

    include = [{
      email = {
        email = var.maintainer_emails
      }
    }]
  }]
}
    }
  }]
}

resource "cloudflare_ruleset" "redirect_www_to_apex" {
  zone_id = var.cloudflare_zone_id
  name    = "vanityURLs redirect rules"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules = [{
    action      = "redirect"
    description = "Redirect www to apex"
    enabled     = true
    expression  = "http.host eq \"www.${var.apex_hostname}\""

    action_parameters = {
      from_value = {
        status_code = 301
        target_url = {
          expression = "concat(\"https://${var.apex_hostname}\", http.request.uri.path)"
        }
        preserve_query_string = true
      }
    }
  }]
}

resource "cloudflare_ruleset" "custom_waf" {
  zone_id = var.cloudflare_zone_id
  name    = "vanityURLs custom WAF rules"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  rules = local.custom_waf_rules
}

resource "cloudflare_ruleset" "rate_limit_short_link_candidates" {
  zone_id = var.cloudflare_zone_id
  name    = "vanityURLs rate limiting"
  kind    = "zone"
  phase   = "http_ratelimit"

  rules = [{
    action      = "block"
    description = "Rate limit short-link candidates"
    enabled     = true
    expression  = local.rate_limit_expression

    ratelimit = {
      characteristics     = ["ip.src"]
      period              = 10
      requests_per_period = 20
      mitigation_timeout  = 10
    }
  }]
}
