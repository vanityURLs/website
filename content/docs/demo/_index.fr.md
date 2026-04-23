---
title: "Démo"
description: "v8s.link est l'implémentation de référence de vanityURLs — explorez chaque fichier pour déboguer votre propre instance."
nav_order: 30
---

La meilleure façon de comprendre vanityURLs est d'examiner un déploiement réel. **[v8s.link](https://github.com/vanityURLs/v8s.link)** est l'implémentation officielle de référence, maintenue par l'équipe vanityURLs et déployée sur [v8s.link](https://v8s.link).

{{< callout type="note" title="Délibérément public" >}}
Le dépôt v8s.link est public pour que vous puissiez le comparer à votre propre configuration quand quelque chose ne fonctionne pas. Chaque fichier est annoté ici avec des explications.
{{< /callout >}}

## Ce que v8s.link démontre

{{< cards cols="2" >}}
{{< card title="Vrai vanityURLs.conf" icon="cog" href="/fr/docs/demo/configuration/" >}}
Voyez exactement à quoi ressemble un fichier de configuration en production, avec chaque variable expliquée.
{{< /card >}}
{{< card title="Les deux types de fichiers" icon="docs" href="/fr/docs/demo/links/" >}}
Les vrais static.lnk et dynamic.lnk en production, dont une redirection splat fonctionnelle.
{{< /card >}}
{{< card title="Configuration DNS" icon="globe" href="/fr/docs/demo/dns/" >}}
La configuration DNS complète de v8s.link et vanityurls.link, avec chaque enregistrement expliqué.
{{< /card >}}
{{< card title="Structure du dépôt" icon="database" href="/fr/docs/demo/repository/" >}}
Chaque fichier et dossier du dépôt, son rôle, et ce que vous devez garder ou modifier.
{{< /card >}}
{{< /cards >}}

## Essayez une redirection en direct

| URL courte | Destination | Type |
|------------|-------------|------|
| [v8s.link/git](https://v8s.link/git) | github.com/vanityURLs/v8s.link | statique, 301 |
| [v8s.link/github](https://v8s.link/github) | github.com/vanityURLs/ | statique, 301 |
| [v8s.link/linkedin](https://v8s.link/linkedin) | linkedin.com/in/bhdicaire/ | statique, 301 |
| [v8s.link/github/vanityURLs](https://v8s.link/github/vanityURLs) | github.com/vanityURLs/vanityURLs | splat, 302 |

## Ce qui est à jour et ce qui est obsolète

| Fichier / fonctionnalité | État | Notes |
|--------------------------|------|-------|
| `vanityURLs.conf` | ✅ Bonne référence | Toutes les variables documentées ; mettez à jour `REPO_DIR` |
| `static.lnk` — liens principaux | ✅ Bonne référence | `/git`, `/github`, `/blog`, `/linkedin` sont de bons modèles |
| `static.lnk` — `/ALM`, `/VVa`, `/HHU` | ⚠️ Obsolète | Entrées de test, peu utiles pour les nouveaux utilisateurs |
| `dynamic.lnk` — redirection splat | ✅ Excellent exemple | Le pattern `/github/*` est le meilleur usage de dynamic.lnk |
| `build/_headers` | ✅ Correct | En-têtes de sécurité minimaux mais corrects |
| `Makefile` | ✅ Bonne référence | Montre clairement le flux `make setup` |
| `scripts/validateURL` | ⚠️ Non documenté | Voir la [référence validateURL](/fr/docs/commands/validate/) |

## Ce que les nouveaux utilisateurs doivent ajouter

{{< details title="Liste de contrôle pour les nouveaux utilisateurs" open="true" >}}
- [ ] Modifier `vanityURLs.conf` — définir `REPO_DIR`, `MY_DOMAIN`, `MY_PAGE`, `SHORTCODE_LENGTH`
- [ ] Remplacer la redirection racine : `/ → https://VOTRE-SITE.com`
- [ ] Mettre à jour les liens sociaux : `/linkedin`, `/github`, `/x`
- [ ] Supprimer les entrées factices : `/blog https://blog.example/`, `/mail`, `/slack`
- [ ] Mettre à jour le splat de `dynamic.lnk` vers votre organisation GitHub
- [ ] Vérifier le DNS : CNAME/ALIAS pointant vers `VOTRE-PROJET.pages.dev`
- [ ] Confirmer que `build/_headers` utilise votre domaine et votre URL Pages
- [ ] Pousser et vérifier que le build Cloudflare Pages réussit
- [ ] Exécuter `lnk validate --live` pour confirmer que toutes les destinations sont accessibles
{{< /details >}}
