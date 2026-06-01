---
title: "Fuseaux horaires"
description: "Choisir les valeurs de fuseau horaire acceptées par setup et les horaires de liens vanityURLs."
weight: 55
---

vanityURLs accepte les noms de fuseaux horaires IANA, ainsi que `UTC`. N'entrez pas de décalage numérique comme `-4`, `-5` ou `GMT-0400`; un décalage ne décrit pas les changements d'heure avancée.

Utilisez le fuseau basé sur un lieu qui correspond à l'opérateur ou au lien planifié. Par exemple, l'heure de l'Est devrait généralement être `America/Toronto` ou `America/New_York`. La base de fuseaux horaires JavaScript `Intl` gère le passage entre EST et EDT.

## Choix courants

| Région                  | Choix                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UTC                     | `UTC`                                                                                                                                                      |
| Canada                  | `America/Toronto`, `America/Montreal`, `America/Halifax`, `America/Winnipeg`, `America/Regina`, `America/Edmonton`, `America/Vancouver`                    |
| États-Unis              | `America/New_York`, `America/Chicago`, `America/Denver`, `America/Phoenix`, `America/Los_Angeles`, `America/Anchorage`, `Pacific/Honolulu`                 |
| Europe                  | `Europe/London`, `Europe/Dublin`, `Europe/Paris`, `Europe/Berlin`, `Europe/Rome`, `Europe/Madrid`, `Europe/Amsterdam`, `Europe/Stockholm`, `Europe/Zurich` |
| Amérique latine         | `America/Mexico_City`, `America/Bogota`, `America/Lima`, `America/Santiago`, `America/Argentina/Buenos_Aires`, `America/Sao_Paulo`                         |
| Afrique et Moyen-Orient | `Africa/Casablanca`, `Africa/Johannesburg`, `Africa/Cairo`, `Asia/Jerusalem`, `Asia/Dubai`, `Asia/Riyadh`                                                  |
| Asie                    | `Asia/Kolkata`, `Asia/Bangkok`, `Asia/Singapore`, `Asia/Hong_Kong`, `Asia/Shanghai`, `Asia/Tokyo`, `Asia/Seoul`                                            |
| Océanie                 | `Australia/Perth`, `Australia/Adelaide`, `Australia/Brisbane`, `Australia/Sydney`, `Pacific/Auckland`                                                      |

## Liste locale complète

La liste exacte vient du runtime JavaScript utilisé par setup, le build, le Worker et le navigateur. Pour afficher la liste complète supportée par votre runtime Node.js local :

```bash
node -e 'console.log(["UTC", ...Intl.supportedValuesOf("timeZone")].join("\n"))'
```

Si setup refuse un fuseau horaire, choisissez une valeur dans la sortie de cette commande. Gardez `UTC` seulement lorsque vous voulez intentionnellement que les horodatages générés et les horaires par défaut utilisent le temps universel coordonné.

Pour le raisonnement opérationnel derrière la question de setup, lisez [Le fuseau horaire de l'opérateur n'est pas seulement une question de setup](/fr/blog/operator-timezone-is-not-just-a-setup-question/).
