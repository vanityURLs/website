---
aside: false
title: "Pages publiques et pages de statut"
description: "Personnaliser le HTML public, les assets partagés, les pages de statut et la sécurité des pages custom sous custom/public/."
weight: 41
aliases:
  - /fr/docs/reference/status-pages/
  - /fr/docs/customize/public-pages/
  - /fr/docs/customize/status-pages/
---

Utilisez `custom/public/` lorsqu'une instance doit remplacer des pages publiques générées, ajouter des assets publics ou personnaliser les pages de statut des liens. Utilisez [Surcharges custom](/fr/docs/reference/custom-overrides/) pour la carte plus large des fichiers de configuration.

## Carte des surcharges publiques

{{< callout type="warning" title="Évitez de remplacer les assets publics partagés trop facilement" >}}
Les pages publiques par défaut partagent des assets produit comme `/style.css` et `/script.js`. Si vous ajoutez du JavaScript ou du CSS pour des pages custom, utilisez des noms propres à l'instance, comme `/custom-home.css`, `/brand-pages.css` ou `/operator-tools.js`, au lieu de remplacer `style.css` ou `script.js` trop facilement. Remplacer des fichiers partagés affecte toutes les pages par défaut que vous n'avez pas encore surchargées.
{{< /callout >}}

{{< callout type="warning" title="Les pages custom doivent respecter la CSP" >}}
Les pages par défaut utilisent du JavaScript et du CSS externes afin que la Content Security Policy livrée puisse omettre `'unsafe-inline'`. Si une page custom utilise `<script>` inline, `<style>` inline, des attributs d'événement comme `onclick`, ou des attributs `style=""`, déplacez ce code vers des fichiers custom externes ou livrez une surcharge CSP volontaire dans `custom/public/_headers` pour l'instance concernée.
{{< /callout >}}

| Surcharge                            | Chemin                                                                                                              | Détails                                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Assets de marque et badges redirigés | `custom/public/v8s-logo.svg`, `custom/public/favicon.svg`, `custom/public/{language}/v8s-redirected.svg`            | [Marque](/fr/docs/reference/brand/)                                                                                                  |
| Pied de page et pages légales        | `custom/public/privacy.html`, `custom/public/terms.html`, `custom/public/abuse.html`, `custom/public/security.html` | [Pied de page et pages](/fr/docs/customize/footer-pages/)                                                                            |
| Pages publiques localisées           | `custom/public/fr/index.html`, `custom/public/es/404.html`, et chemins de langue similaires                         | [Internationalisation](/fr/docs/reference/i18n/)                                                                                     |
| Page de consultation                 | `custom/public/lookup/index.html`                                                                                   | [Format des liens](/fr/docs/reference/link-format/)                                                                                  |
| Shell du tableau admin               | `custom/public/_stats/index.html`                                                                                   | [Lire le tableau admin vanityURLs](/fr/blog/reading-your-admin-dashboard/) et [Contrôle d'accès](/fr/docs/customize/access-control/) |
| Headers                              | `custom/public/_headers`                                                                                            | [Approche sécurité du runtime](/fr/docs/reference/runtime-security/)                                                                 |

## Pages de statut

Le Worker sert des fichiers précis pour les états de lien et de routage. Pour créer des pages de statut custom, placez les fichiers à ces chemins exacts :

| Fichier                          | Utilisé pour                              | Statut |
| -------------------------------- | ----------------------------------------- | ------ |
| `custom/public/404.html`         | Liens courts inconnus et pages manquantes | 404    |
| `custom/public/disabled.html`    | Liens désactivés                          | 403    |
| `custom/public/expired.html`     | Liens expirés                             | 410    |
| `custom/public/maintenance.html` | Liens temporairement indisponibles        | 503    |

Les versions localisées utilisent le [code langue](/fr/docs/reference/i18n/#langues-supportees) comme premier segment de répertoire, par exemple `custom/public/fr/404.html`. Vous devez seulement ajouter les pages localisées que vous supportez vraiment. Si une page localisée manque, le Worker peut revenir à la page par défaut pour l'état demandé.

Seul `404.html` a des placeholders runtime. Si vous le remplacez, incluez ces placeholders où vous voulez afficher le contexte runtime :

```html
<!-- {{SLUG_MESSAGE}} -->
<!-- {{REFERENCE_LINE}} -->
```

`{{SLUG_MESSAGE}}` est remplacé par un message sécuritaire au sujet du slug demandé. `{{REFERENCE_LINE}}` est remplacé par une référence de corrélation utile pour le support et la revue des logs.

`disabled.html`, `expired.html` et `maintenance.html` sont servis comme pages d'état statiques. Ils ne demandent pas de placeholders runtime.

## Ignorer doctor volontairement

`npm run doctor` avertit lorsque des fichiers publics copiés semblent désynchronisés des defaults produit. Lorsqu'un fichier appartient volontairement à l'instance, documentez ce choix dans `custom/v8s-maintenance.json` au lieu de copier plus de defaults seulement pour faire disparaître l'avertissement :

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "path": "custom/public/404.html",
        "codes": ["html-head-assets-stale"],
        "reason": "L'instance utilise volontairement une page 404 custom qui ressemble à l'accueil."
      }
    ]
  }
}
```

Utilisez des chemins exacts pour les fichiers uniques, ou `custom/public/fr/**` pour un répertoire. Gardez les ignores étroits avec `codes` ou `fixes` afin que doctor continue de signaler les dérives sans rapport.

## Sécurité des pages custom

La CSP par défaut protège aussi les pages custom sauf si `custom/public/_headers` la modifie. C'est volontaire : une page de statut custom peut sinon devenir l'endroit le plus facile où ajouter accidentellement du HTML vulnérable au XSS.

Préférez ces patterns :

- Placez le CSS custom dans un fichier comme `custom/public/brand-pages.css` et liez-le avec `<link rel="stylesheet" href="/brand-pages.css">`
- Placez le JavaScript custom dans un fichier comme `custom/public/operator-tools.js` et chargez-le avec `<script src="/operator-tools.js" defer></script>`
- Remplacez `onclick`, `onload` et les attributs similaires par des event listeners dans le script externe
- Remplacez les attributs `style=""` par des classes du stylesheet custom

Assouplissez la CSP dans `custom/public/_headers` seulement lorsque l'instance accepte volontairement cette politique plus faible. Si vous le faites, gardez `frame-ancestors 'none'`, `object-src 'none'`, `base-uri 'self'` et les headers de sécurité du fichier par défaut sauf raison précise de les changer.

## SRI au build

Générer les hashes SRI après l'overlay custom final est la façon compatible d'ajouter l'intégrité aux assets du redirecteur. Le build doit copier les defaults, appliquer `custom/public/`, hasher les fichiers finaux dans `build/`, puis écrire les attributs `integrity` correspondants dans le HTML final.

Les risques sont surtout opérationnels :

- Si le hash est généré avant l'overlay custom, tout asset remplacé échouera au chargement dans le navigateur
- Si les références HTML ne sont pas réécrites partout de façon cohérente, une page localisée ou une page de statut peut épingler le mauvais hash
- Si un opérateur modifie des fichiers bâtis après le hash, SRI bloquera volontairement cet asset
- Si Cloudflare réécrit les octets ou URLs des scripts, SRI peut échouer, ce qui explique pourquoi les fonctions de réécriture restent off par défaut

Ces échecs sont bruyants et généralement sûrs : le navigateur bloque le script ou la feuille de style qui ne correspond pas au lieu d'exécuter des octets changés. Traitez le SRI au build comme intéressant lorsque le build possède le HTML et les assets finaux de bout en bout.
