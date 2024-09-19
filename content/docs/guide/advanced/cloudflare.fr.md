---
title: Cloudflare Worker
linkTitle: Cloudflare
---
The secret sauce are two plain text files:
  * `build/_redirects` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/redirects)
  * `build/_headers` based on this [Cloudflare documentation](https://developers.Cloudflare.com/pages/platform/headers/)

```mermaid
sequenceDiagram
    participant local repository
    participant github repository
    participant Cloudflare
    participant v8s-link.pages.dev
    local repository->>github repository: git push
    Cloudflare-->>github repository: git clone
    Note right of github repository: CI/CD    
    Cloudflare->>v8s-link.pages.dev: copy files
```

## Questions or Feedback?

{{< cards >}}
  {{< card link="https://github.com/orgs/vanityURLs/discussions" title="Discussions" icon="template">}}
  {{< card link="https://github.com/vanityURLs/vanityURLs/issues" title="Issues" icon="server">}}
{{< /cards >}}