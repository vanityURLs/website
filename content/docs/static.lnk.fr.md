---
title: "static.lnk"
description: "Votre liste de redirections permanentes."
nav_order: 8
---

`static.lnk` contient vos redirections **permanentes** — profils sociaux, portfolio, pages de projets.

```
# Profils
/github     https://github.com/votrenom          301
/linkedin   https://linkedin.com/in/votrenom     301

# Projets
/appli      https://appli.example.com            301

# Racine (toujours en dernier)
/           https://votrenom.example.com         301
```

Ajoutez des liens avec le script `lnk` :

```bash
lnk add /github https://github.com/votrenom
```
