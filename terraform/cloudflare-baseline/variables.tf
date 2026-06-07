variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the zone and Zero Trust team."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the short-link domain."
  type        = string
}

variable "apex_hostname" {
  description = "Short-link apex hostname, such as v8s.link."
  type        = string
}

variable "worker_name" {
  description = "Worker or application label used for the Access application name."
  type        = string
}

variable "maintainer_emails" {
  description = "Email addresses allowed to open protected vanityURLs paths."
  type        = list(string)
}

variable "enable_ai_crawler_block_rule" {
  description = "Whether to create the optional static user-agent AI crawler fallback rule. Prefer Cloudflare AI Crawl Control for default crawler blocking."
  type        = bool
  default     = false
}
