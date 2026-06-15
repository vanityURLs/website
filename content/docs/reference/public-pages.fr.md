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
Les pages publiques par défaut partagent des assets produit comme `/v8s-style.css` et `/v8s-script.js`. Le CSS et le JavaScript des defaults produit utilisent le préfixe `v8s-` afin que les assets d'instance comme `/script.js`, `/style.css`, `/brand-pages.css` ou `/operator-tools.js` puissent coexister sans remplacer les defaults livres.
{{< /callout >}}

{{< callout type="info" title="Le HTML custom utilise une CSP compatible" >}}
Le HTML produit par défaut garde la CSP stricte du produit. Les fichiers HTML venant de `custom/public/` reçoivent un profil compatible séparé, sandboxé, qui autorise les scripts et styles inline custom sans inclure `allow-same-origin`. La page reste sur le même hôte visible, mais ne devient pas un pair same-origin entièrement fiable des pages intégrées.
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

`npm run doctor` avertit lorsque des fichiers publics copiés semblent désynchronisés des defaults produit. Lorsqu'un fichier appartient volontairement à l'instance, documentez ce choix dans `custom/v8s-custom-overrides.json` au lieu de copier plus de defaults seulement pour faire disparaître l'avertissement :

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

Pendant le build, vanityURLs écrit `build/v8s-custom-assets.json` avec les chemins publics finaux qui viennent de `custom/public/`. Le Worker utilise ce manifeste pour appliquer le profil HTML custom même lorsqu'une page anglaise custom est copiée vers la racine, par exemple `custom/public/en/index.html` qui devient `/index.html`.

Seuls les documents HTML custom reçoivent le profil sandboxé. Le CSS, le JavaScript, les images, les polices et les manifests référencés sont servis comme assets normaux, tandis que la CSP de la page HTML contrôle ce qu'elle peut charger.

Le profil HTML custom autorise :

- le CSS et JavaScript custom du même hôte, comme `/style.css`, `/script.js`, ou des noms propres à l'instance
- les `<script>` et `<style>` inline pour les pages custom copiées ou écrites à la main
- les formulaires, popups, sortie de sandbox pour popups et téléchargements
- les appels lookup publics depuis l'origine opaque sandboxée vers `POST /lookup/resolve`
- les beacons analytics lookup vers `POST /_analytics/lookup`

Comme le sandbox n'inclut pas `allow-same-origin`, le JavaScript custom ne devrait pas dépendre de la lecture des cookies de l'hôte, du `localStorage` de l'hôte, ou d'APIs same-origin protégées. Les liens ordinaires comme `<a href="/test">` et la navigation JavaScript comme `window.location.href = "/test"` passent toujours par le Worker et peuvent rediriger normalement.

Surchargez la CSP dans `custom/public/_headers` seulement lorsque l'instance accepte volontairement une politique différente. Si vous le faites, gardez `frame-ancestors 'none'`, `base-uri 'self'` et les headers de sécurité du fichier par défaut sauf raison précise de les changer. Évitez de retirer le sandbox pour du HTML custom arbitraire sauf si vous voulez intentionnellement que ces pages soient des pairs entièrement fiables des pages produit.

## SRI au build

Générer les hashes SRI après l'overlay custom final est la façon compatible d'ajouter l'intégrité aux assets du redirecteur. Le build doit copier les defaults, appliquer `custom/public/`, hasher les fichiers finaux dans `build/`, puis écrire les attributs `integrity` correspondants dans le HTML final.

Les risques sont surtout opérationnels :

- Si le hash est généré avant l'overlay custom, tout asset remplacé échouera au chargement dans le navigateur
- Si les références HTML ne sont pas réécrites partout de façon cohérente, une page localisée ou une page de statut peut épingler le mauvais hash
- Si un opérateur modifie des fichiers bâtis après le hash, SRI bloquera volontairement cet asset
- Si Cloudflare réécrit les octets ou URLs des scripts, SRI peut échouer, ce qui explique pourquoi les fonctions de réécriture restent off par défaut

Ces échecs sont bruyants et généralement sûrs : le navigateur bloque le script ou la feuille de style qui ne correspond pas au lieu d'exécuter des octets changés. Traitez le SRI au build comme intéressant lorsque le build possède le HTML et les assets finaux de bout en bout.
