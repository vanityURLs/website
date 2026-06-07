output "access_application_id" {
  description = "Cloudflare Access application ID for the protected vanityURLs paths."
  value       = cloudflare_zero_trust_access_application.vanityurls_private_paths.id
}

output "access_application_aud" {
  description = "Access application audience tag to store as CF_ACCESS_AUD in the Worker."
  value       = cloudflare_zero_trust_access_application.vanityurls_private_paths.aud
}
