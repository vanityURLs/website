---
title: Administration
linkTitle: admin
prev: /docs/install
next: /docs/how
---
Vous pouvez utiliser les `scripts Bash` suivants pour accélérer la création d'URLs

| Nom | Description |
| ---- | ----------- |
| `scripts/lnk` | Génère un ID pour une nouvelle URL, soit aléatoire, soit personnalisé |

Ce que fait le script `scripts/lnk` :

1. Génère un ID spécifique ou unique pour une nouvelle URL
2. Ajoute le lien au dépôt git local
3.  Committe le changement avec une description adéquate dans le dépôt git local
4. Pousse le changement sur GitHub

Cloudflare détectera le changement et lancera un déploiement 😄

## Exigences

Notez que pour utiliser les scripts mentionnés ci-dessus, vous aurez besoin d'un
fichier `~/.vanityURLs.conf` sur votre machine avec vos valeurs spécifiques,
par exemple le chemin vers le dépôt sur votre machine, votre petit domaine, etc. Un modèle pour ce fichier peut
être trouvé [ici](../vanityURLs.conf).

