---
aside: false
title: "Marque"
description: "Configurer les valeurs de marque d'instance et utiliser le site dedie aux normes de marque."
weight: 12
aliases:
  - /docs/brand/
  - /fr/docs/brand/
  - /docs/customize/brand/
  - /fr/docs/customize/brand/
---

Les normes de marque vanityURLs vivent maintenant sur [brand.vanityurls.link](https://brand.vanityurls.link/fr/). Utilisez ce site pour les regles de logo, couleurs, typographie, badges, interface produit et assets.

La marque contrôle le wordmark public et la courte ligne sous les pages publiques générées. Ces valeurs vivent dans `custom/v8s-site-config.json` et sont appliquées au build, donc une instance de marque normale n'a pas besoin de copier les pages par défaut dans `custom/public/`.

Vous pouvez personnalisér pendant `npm run setup` ou en mettant à jour manuellement les fichiers dans `custom/`.

Si `operator.operator_domain` est défini dans `custom/v8s-site-config.json`, les pages générées lient le nom légal de l'opérateur dans le slogan vers ce domaine. Par exemple, `Un service de liens courts pour les projets de Example Inc.` peut lier `Example Inc.` vers `https://example.com`.

## Questions de setup

| Question de setup                                                         | Quand elle apparaît                    | Recommandation phase 1                                                                 | Personnalisation ultérieure                                                                                         | Ce que cela contrôle                                                                           |
| ------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Configure branding now?                                                   | Toujours                               | Utilisez `Y` lorsque vous voulez des valeurs de wordmark et de slogan gérées par setup | Utilisez `N` lorsque vous maintenez déjà la config de marque à la main                                              | Détermine si setup pose les questions de marque maintenant                                     |
| Add a slogan line under the domain name on your pages...?                 | Lorsque la marque est activée          | Utilisez `Y` lorsque vous voulez une courte ligne sous le wordmark du domaine          | Utilisez `N` lorsque le wordmark du domaine doit rester seul                                                        | Détermine si les pages générées incluent une courte ligne sous le wordmark du domaine bicolore |
| Brand slogan `[language]`                                                 | Lorsque la ligne de slogan est activée | Utilisez les valeurs localisées générées lorsqu'elles conviennent                      | Gardez chaque slogan assez durable pour apparaître sur les pages confiance, confidentialité, conditions et sécurité | Texte localisé affiché sous le wordmark du domaine bicolore sur les pages publiques générées   |
| Copy full default web pages to custom/public for manual template editing? | Lorsque la marque est activée          | Utilisez `N` sauf si vous prévoyez modifier les templates HTML par défaut              | Utilisez `Y` seulement lorsque vous voulez vraiment des surcharges complètes sous `custom/public/`                  | Détermine si setup copie les pages publiques modifiables dans `custom/public/`                 |
| Black wordmark portion                                                    | Lorsque la marque est activée          | Préfixe du domaine, comme `v8s.`                                                       | Utilisez la portion qui doit apparaître dans la couleur de marque sombre                                            | Première partie du wordmark de la page d'accueil et des pages publiques                        |
| Green wordmark portion                                                    | Lorsque la marque est activée          | Suffixe du domaine, comme `link`                                                       | Utilisez la portion qui doit apparaître en teal vanityURLs                                                          | Deuxième partie du wordmark de la page d'accueil et des pages publiques                        |

Vous pouvez relancer `npm run setup` plus tard. L'installateur lit les valeurs de marque existantes et les propose comme défauts, donc vous pouvez commencer avec la séparation générée et raffiner les assets plus tard.

Les slogans localisés sont stockes dans `custom/v8s-site-config.json` sous `branding.slogan`. Les instances existantes qui ont encore un seul slogan texte continuent de fonctionner; setup écrit la map localisée lors des nouveaux passages de branding.

## Surcharges d'assets d'instance

Placez les assets de marque propres à l'instance sous `custom/public/` pour qu'ils remplacent les assets publics par défaut pendant le build. Les badges redirigés vivent aussi dans les répertoires publics localisés.

{{< filetree/container >}}
{{< filetree/folder name="custom" >}}
{{< filetree/folder name="public" annotation="surcharges d'assets publics propres à l'instance" >}}
{{< filetree/file name="v8s-logo.svg" >}}
{{< filetree/file name="favicon.svg" >}}
{{< filetree/file name="site.webmanifest" >}}
{{< filetree/file name="apple-touch-icon.png" >}}
{{< filetree/file name="icon-192.png" >}}
{{< filetree/file name="icon-512.png" >}}
{{< filetree/folder name="fr" annotation="surcharges de badges localisés" >}}
{{< filetree/file name="v8s-redirected.svg" >}}
{{< filetree/file name="v8s-redirected-dark.svg" >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/folder >}}
{{< /filetree/container >}}

## Marque au build et pages copiées

Par défaut, setup enregistre le wordmark, les slogans localisés et le domaine de marque dans `custom/v8s-site-config.json`. Pendant `npm run build`, vanityURLs copie `defaults/public/` dans `build/` et applique ces valeurs de marque à cet endroit. Les pages non modifiées restent donc dans `defaults/`, où les mises à jour upstream peuvent les rafraîchir.

Copiez les pages complètes dans `custom/public/` seulement lorsque vous voulez modifier les templates HTML à la main. Dans ce mode, `npm run setup` peut copier `defaults/public/` vers `custom/public/`, remplacer le wordmark `Vanity` + `URLs` par les portions noire et verte configurées, mettre à jour les libellés et liens de marque, puis retirer les langues non supportées.

L'installateur enregistre ces choix dans `custom/v8s-site-config.json` pour que les executions repétées restent prévisibles. Si `custom/public/` contient dejà des fichiers et n'est pas marque comme gere par setup, setup refuse de le remplacer sauf avec `--force`.

Lorsque vous utilisez `custom/public/`, gardez `i18n.supported_languages` aligné avec les pages localisées que vous supportez vraiment. Voir [Internationalisation](/fr/docs/reference/i18n/) pour les règles de répertoires de langue.

## Normes visuelles

Pour les couleurs, fichiers de badges localises, notes de typographie, regles d'interface produit et chemins d'assets, utilisez [brand.vanityurls.link](https://brand.vanityurls.link/fr/).

Pour le recit de personnalisation, lisez [Habiller votre domaine court](/fr/blog/branding-your-short-link-domain/).
