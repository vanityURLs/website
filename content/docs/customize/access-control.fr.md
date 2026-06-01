---
aside: false
title: "Contrôle d'accès"
description: "Configurer Cloudflare Access pour les chemins opérationnels privés de vanityURLs."
weight: 20
aliases:
  - /docs/access-control/
---

Utilisez Cloudflare Access pour protéger les chemins opérationnels de vanityURLs tout en gardant les redirections publiques ouvertes. Suivez cette page lorsque vous êtes prêt à sécuriser `/_stats`, les pages stats localisées comme `/fr/_stats/` et `/_tests`.

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

Pour la phase 1, utilisez le [code à usage unique](#stocker-laudience-access) sauf si un fournisseur est déjà prêt. Pour la stratégie de fournisseur, lisez [Choisir un fournisseur d'identité](/fr/blog/choosing-identity-provider/).

| Option                                                                                                   | Utilisez-le quand                                                                                   |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [GitHub](../cf-access-not-configured.fr.png)                                                             | Les mainteneurs utilisent déjà GitHub et vous voulez des sélecteurs d'utilisateur ou d'organisation |
| [Google](https://developers.cloudflare.com/cloudflare-one/integrations/identity-providers/one-time-pin/) | Les mainteneurs utilisent déjà Gmail ou Google Workspace                                            |
| [IdP corporatif](/fr/blog/choosing-identity-provider/)                                                   | Votre organisation gère déjà les identités de travail et le départ des employés                     |

Si vous activez plusieurs fournisseurs, les utilisateurs en choisissent un sur la page de connexion Cloudflare Access. La politique réussit lorsque le fournisseur choisi retourne une identité qui correspond à la politique.

### Créer l'application Access

Dans Cloudflare, ouvrez **Zero Trust** > **Access Controls** > **Applications**, puis :

1. Créez une application
2. Sélectionnez **Self-hosted and private**
3. Continuez avec **Self-hosted and private**
4. Configurez les destinations avec _votre_ domaine court ← remplacez `v8s.link` par _votre_ domaine court partout

| Sous-domaine | Domaine    | Chemin       |
| ------------ | ---------- | ------------ |
|              | `v8s.link` | `_stats`     |
|              | `v8s.link` | `_stats/*`   |
|              | `v8s.link` | `*/_stats`   |
|              | `v8s.link` | `*/_stats/*` |
|              | `v8s.link` | `_tests`     |
|              | `v8s.link` | `_tests/*`   |

Cloudflare Access accepte les wildcards dans le champ chemin. Les entrées `*/_stats` couvrent les chemins de tableau de bord localisés comme `/fr/_stats/` tout en laissant les liens courts publics hors Access.

Utilisez une seule application Access pour les opérations privées vanityURLs. Les chemins de redirection publics doivent rester hors Access pour que les visiteurs puissent suivre les liens courts sans connexion.

Réglages recommandés :

| Réglage                 | Valeur                                                                            |
| ----------------------- | --------------------------------------------------------------------------------- |
| Type d'application      | Self-hosted                                                                       |
| Nom de l'application    | Votre nom de Worker, par exemple `v8s-link`                                       |
| Durée de session        | `24 hours`                                                                        |
| Fournisseurs d'identité | Code à usage unique pour la phase 1, ou les fournisseurs que vous avez configurés |
| Browser rendering       | Off                                                                               |

### Créer la politique Access

Commencez avec une politique d'autorisation simple :

| Champ             | Valeur                               |
| ----------------- | ------------------------------------ |
| Nom de politique  | `Allow maintainers`                  |
| Action            | `Allow`                              |
| Sélecteur Include | `Emails`                             |
| Valeur Include    | Vos adresses courriel de mainteneurs |
| Durée de session  | `24 hours`                           |

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
4. Visitez un chemin stats localisé, par exemple `/fr/_stats/`
5. Visitez `/_tests` depuis un profil de navigateur déconnecté ou privé
6. Confirmez que Cloudflare Access apparaît avant le tableau de bord ou la page de test
7. Connectez-vous avec une identité autorisée et confirmez que la page charge

Lancez les vérifications locales avant de pousser des changements de configuration :

```bash
npm run check
```

Après le déploiement, répétez le test de navigateur déconnecté contre le vrai domaine court.

Pour information : Cloudflare Access n'est pas la seule couche qui limite l'accès aux fichiers opérationnels. Pour le tableau complet des gardes, lisez [Sécurité runtime](/fr/docs/reference/runtime-security/). Pour la revue continue, lisez [Exploiter Cloudflare Access pour un domaine de liens courts](/fr/blog/operating-cloudflare-access-for-a-short-link-domain/).

Gardez l'accès contrôle sur `/_stats`, les chemins stats localisés comme `/fr/_stats/` et `/_tests`, les entrées de fichiers runtime dans `_headers` et le garde Worker des fichiers runtime actifs, sauf si vous avez une **raison délibérée de divulgation publique**. C'est une note de conception, pas une activité de configuration séparée.

{{% /steps %}}
