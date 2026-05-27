---
aside: false
title: "Contrôle d'accès"
description: "Configurer Cloudflare Access pour les chemins opérationnels privés de vanityURLs."
weight: 20
aliases:
  - /docs/access-control/

---

Utilisez Cloudflare Access pour protéger les chemins opérationnels de vanityURLs tout en gardant les redirections publiques ouvertes. Suivez cette page lorsque vous êtes prêt à sécuriser `/_stats` et `/_tests`.

Le Worker valide l'en-tête `Cf-Access-Jwt-Assertion` sur ces chemins; consultez [Stocker l'audience Access](#stocker-laudience-access) ci-dessous. Si le secret est absent ou invalide, le chemin protégé échoue fermé.

![le chemin protégé échoue fermé](../cf-access-not-configured.fr.png)

Ne commitez pas d'information sensible comme les audiences Access, les secrets client IdP, les jetons de service, les secrets client OAuth ou les captures d'écran qui contiennent ces valeurs.

{{% steps %}}

### Trouver le domaine Team

Dans Cloudflare, ouvrez **Zero Trust** > **Settings**, puis copiez le **Team domain**.

L'installateur le conserve dans `wrangler.toml` pendant `npm run setup` :

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "vanityurls.cloudflareaccess.com"
```

Cette valeur n'est pas un secret, mais elle doit correspondre au compte Cloudflare qui possède l'application Access.

### Choisir le fournisseur d'identité

Pour la phase 1, utilisez le [code à usage unique](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) sauf si un fournisseur est déjà prêt. Pour la stratégie de fournisseur, lisez [Choisir un fournisseur d'identité](/fr/blog/choosing-identity-provider/).

| Option | Utilisez-le quand |
|---|---|
| [GitHub](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/github/) | Les mainteneurs utilisent déjà GitHub et vous voulez des sélecteurs d'utilisateur ou d'organisation |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/google/) | Les mainteneurs utilisent déjà Gmail ou Google Workspace |
| [IdP corporatif](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/) | Votre organisation gère déjà les identités de travail et le départ des employés |

Si vous activez plusieurs fournisseurs, les utilisateurs en choisissent un sur la page de connexion Cloudflare Access. La politique réussit lorsque le fournisseur choisi retourne une identité qui correspond à la politique.

### Créer l'application Access

Dans Cloudflare, ouvrez **Zero Trust** > **Access Controls** > **Applications**, puis :

1. Créez une application
2. Sélectionnez **Self-hosted and private**
3. Continuez avec **Self-hosted and private**
4. Configurez les destinations avec *votre* domaine court ← remplacez `v8s.link` par *votre* domaine court partout

| Sous-domaine | Domaine | Chemin |
|---|---|---|
| | `v8s.link` | `_stats` |
| | `v8s.link` | `_stats/*` |
| | `v8s.link` | `_tests` |
| | `v8s.link` | `_tests/*` |

Utilisez une seule application Access pour les opérations privées vanityURLs. Les chemins de redirection publics doivent rester hors Access pour que les visiteurs puissent suivre les liens courts sans connexion.

Réglages recommandés :

| Réglage | Valeur |
|---|---|
| Type d'application | Self-hosted |
| Nom de l'application | Votre nom de Worker, par exemple `v8s-link` |
| Durée de session | `24 hours` |
| Fournisseurs d'identité | Code à usage unique pour la phase 1, ou les fournisseurs que vous avez configurés |
| Browser rendering | Off |

### Créer la politique Access

Commencez avec une politique d'autorisation simple :

| Champ | Valeur |
|---|---|
| Nom de politique | `Allow maintainers` |
| Action | `Allow` |
| Sélecteur Include | `Emails` |
| Valeur Include | Vos adresses courriel de mainteneurs |
| Durée de session | `24 hours` |

Utilisez le testeur de politique avant de sauvegarder. Testez une adresse courriel autorisée et une adresse qui devrait être refusée.

Pour une équipe plus grande, préférez un groupe maintenu ou un sélecteur IdP à une longue liste d'adresses individuelles.

### Stocker l'audience Access

Après la création de l'application, ouvrez **Additional settings** et copiez le **Application Audience (AUD) Tag**.

Stockez-le comme secret Worker :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

### Valider la protection

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

### Connaître les autres gardes de fichiers

Cloudflare Access n'est pas la seule couche qui limite l'accès aux fichiers opérationnels. Pour la revue continue, lisez [Exploiter Cloudflare Access pour un domaine de liens courts](/fr/blog/operating-cloudflare-access-for-a-short-link-domain/).

Gardez l'accès contrôlé sur `/_stats` et `/_tests`, les entrées de fichiers runtime dans `_headers` et le garde Worker des fichiers runtime activés, sauf si vous avez une **raison délibérée de divulgation publique**.

| Contrôle | Chemins | Ce qu'il fait |
|---|---|---|
| Garde Worker des assets runtime privés | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Retourne `404` pour les requêtes publiques directes |
| Fallback statique `_headers` | `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json`, `/_stats/*`, `/expand/*` | Ajoute des en-têtes no-cache et no-index si des assets statiques sont servis directement |
| API stats protégée | `/_stats/api/v8s.json` | Expose le registre généré seulement à travers la surface stats protégée |
| Validation des slugs réservés | `/_stats`, `/api`, `/_worker`, `/v8s.json`, `/v8s-blocklist.json`, `/v8s-site-config.json` | Empêche la création de liens courts sous les chemins opérationnels réservés |

{{% /steps %}}
