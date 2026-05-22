---
aside: false
title: "Contrôle d'accès"
description: "Configurer Cloudflare Access, les fournisseurs d'identité, les politiques et les secrets Worker pour les chemins opérationnels privés de vanityURLs."
---

vanityURLs garde les redirections publiques ouvertes et protège les chemins opérationnels avec Cloudflare Access. Les chemins protégés exposent l'inventaire des liens, les diagnostics runtime et les surfaces de test; ils doivent donc exiger une authentification avant que le Worker les serve.

Utilisez cette page comme configuration de référence pour :

- `/_stats`
- `/_stats/*`
- `/_tests`
- `/_tests/*`

Le Worker valide l'en-tête `Cf-Access-Jwt-Assertion` sur les chemins protégés. Si Cloudflare Access n'est pas configuré ou si le jeton est absent, ces chemins échouent fermés.

## Autres contrôles d'accès

Cloudflare Access protège les pages opérationnelles, mais ce n'est pas le seul contrôle qui limite l'accès aux fichiers.

| Contrôle | Chemins | Ce qu'il fait |
| :--- | :--- | :--- |
| Garde Worker des assets runtime privés | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Retourne `404` avec `no-store` et `X-Robots-Tag: noindex, nofollow` pour les requêtes publiques directes |
| Fallback statique `_headers` | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/_stats/*`, `/expand/*` | Ajoute des en-têtes no-cache et no-index lorsque des assets statiques sont servis directement |
| API stats protégée | `/_stats/api/v8s.json` | Expose le registre généré seulement à travers la surface stats protégée, avec en-têtes de téléchargement et no-index |
| Validation des slugs réservés | `/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Empêche la création de liens courts sous les chemins opérationnels et runtime réservés |

Ces contrôles sont superposés. Gardez Cloudflare Access sur `/_stats` et `/_tests`, gardez la garde Worker des fichiers runtime activée, et conservez les entrées `_headers` des fichiers runtime sauf si vous avez une raison délibérée de divulgation publique.

## Décider d'abord

Avant de créer l'application Access, décidez qui doit être autorisé :

| Décision | Recommandation phase 1 | Personnalisation ultérieure |
| :--- | :--- | :--- |
| Méthode d'authentification | Code à usage unique avec courriels nommés | GitHub, Google, Okta, Entra ID ou autre fournisseur géré par compte |
| Sélecteur de politique | Adresses courriel | Adresses courriel, groupes, organisation GitHub ou sélecteurs pays |
| Durée de session | 24 heures | Plus courte pour les équipes sensibles, plus longue pour les instances personnelles à faible risque |
| MFA | Suivre le réglage global Zero Trust | Exiger le MFA directement dans la politique lorsque l'IdP le supporte |
| Stockage des secrets | Secrets Cloudflare plus gestionnaire de mots de passe | Même modèle, avec notes de rotation et documentation du propriétaire |

Pour les compromis entre fournisseurs d'identité, lisez [Choisir un fournisseur d'identité](/blog/choosing-identity-provider/). Pour la phase 1, le code à usage unique suffit généralement parce qu'il protège les chemins privés sans créer d'abord des identifiants GitHub, Google ou workforce IdP.

## Domaine d'équipe

Trouvez le domaine d'équipe Cloudflare Access dans **Zero Trust** > **Settings**. Il ressemble à :

```text
<team>.cloudflareaccess.com
```

L'installateur écrit cette valeur dans `wrangler.toml` sous `CF_ACCESS_TEAM_DOMAIN` :

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

Cette valeur n'est pas un secret, mais elle doit quand même correspondre au compte Cloudflare qui possède l'application Access.

## Fournisseurs d'identité

Cloudflare Access peut authentifier les mainteneurs avec un code à usage unique, GitHub, Google, Okta, Entra ID ou plusieurs fournisseurs en même temps. Configurez les fournisseurs dans **Zero Trust** > **Integrations** > **Identity providers**.

Options courantes :

| Fournisseur | Quand il convient | Notes |
| :--- | :--- | :--- |
| [Code à usage unique](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) | Instances personnelles, petites équipes, configuration phase 1 | Cloudflare envoie un code par courriel aux utilisateurs approuvés; aucun IdP externe n'est requis |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) | Les mainteneurs utilisent déjà GitHub | Les politiques Access peuvent utiliser des utilisateurs précis, des adresses courriel ou l'appartenance à une organisation GitHub |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/) | Les utilisateurs ont déjà des comptes Gmail ou Google Workspace | Stockez les secrets client OAuth hors du dépôt |
| IdP corporatif | Les organisations gèrent déjà les identités workforce | Utilisez le processus existant d'arrivée, de mouvement et de départ au lieu de maintenir une liste séparée |

Si plusieurs fournisseurs d'identité sont activés, les utilisateurs choisissent un fournisseur sur la page de connexion Cloudflare Access. La politique Access est satisfaite lorsque le fournisseur sélectionné retourne une identité qui correspond à la politique, comme un courriel, un groupe ou une appartenance d'organisation autorisé.

## Créer l'application Access

Dans Cloudflare, ouvrez **Zero Trust** > **Access Controls** > **Applications**, puis créez une application **Self-hosted and private**.

Configurez les destinations avec *votre* domaine court :

| Sous-domaine | Domaine | Chemin |
| :--- | :--- | :--- |
| | `v8s.link` | `_stats` |
| | `v8s.link` | `_stats/*` |
| | `v8s.link` | `_tests` |
| | `v8s.link` | `_tests/*` |

Utilisez une seule application Access pour les opérations privées vanityURLs. Les chemins de redirection publics doivent rester hors Access afin que les visiteurs puissent suivre les liens courts sans se connecter.

Réglages recommandés :

| Réglage | Recommandation |
| :--- | :--- |
| Type d'application | Self-hosted |
| Hostnames publics | `v8s.link/_stats`, `v8s.link/_stats/*`, `v8s.link/_tests`, `v8s.link/_tests/*` |
| Durée de session | 24 heures |
| Fournisseurs d'identité | Code à usage unique pour la phase 1, ou fournisseurs gérés par compte comme GitHub, Google, Okta ou Entra ID |
| Browser rendering | Off |

Remplacez `v8s.link` par *votre* domaine court partout.

## Créer la politique Access

Commencez avec une politique d'autorisation simple :

| Champ | Valeur |
| :--- | :--- |
| Nom de politique | `Allow maintainers` |
| Action | `Allow` |
| Sélecteur Include | `Emails` |
| Valeur Include | Vos adresses courriel de mainteneurs |
| Durée de session | `24 hours` |

Utilisez le testeur de politique avant de sauvegarder. Testez au moins une adresse courriel autorisée et une adresse qui devrait être refusée.

Pour une équipe plus grande, préférez un groupe maintenu ou un sélecteur de fournisseur d'identité à une longue liste d'adresses individuelles. Cela intègre la revue d'accès au processus normal de départ d'équipe.

## Stocker l'audience Access

Après la création de l'application, ouvrez **Additional settings** et copiez le **Application Audience (AUD) Tag**.

Stockez-le comme secret Worker :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

Ne commitez pas les audiences Access, secrets client IdP, jetons de service, secrets client OAuth ou captures d'écran qui contiennent ces valeurs. Gardez-les dans Cloudflare et dans votre gestionnaire de mots de passe.

## Valider la protection

Avant la release :

1. Utilisez le testeur de politique Cloudflare pour confirmer qu'une identité autorisée réussit
2. Utilisez le testeur de politique pour confirmer qu'une identité refusée échoue
3. Visitez `/_stats` depuis un profil de navigateur déconnecté ou privé
4. Visitez `/_tests` depuis un profil de navigateur déconnecté ou privé
5. Confirmez que Cloudflare Access apparaît avant le tableau de bord ou la page de test
6. Connectez-vous avec une identité autorisée et confirmez que la page charge

Lancez les vérifications locales avant de pousser des changements de configuration :

```bash
npm run check
```

Après le déploiement, répétez le test de navigateur déconnecté contre le vrai domaine court.

## Notes d'opération

Révisez les réglages Access quand :

- un mainteneur arrive ou quitte
- le domaine court passe à un nouveau compte Cloudflare
- le domaine d'équipe Access change
- vous passez du code à usage unique à GitHub, Google ou un autre IdP
- une capture d'écran, un journal ou un dépôt expose accidentellement des valeurs de configuration Access

Le trafic bloqué par Cloudflare Access n'atteint jamais le Worker. Révisez ces décisions dans les journaux Cloudflare Access ou Security Events, pas dans Umami ou Fathom.
