---
title: "Démarrage rapide"
description: "Lancer un redirecteur vanityURLs simple sur votre propre domaine court, puis le personnaliser une fois le premier déploiement fonctionnel."
weight: 20
aside: false
aliases:
  - /docs/quickstart/

---
Allons-y. Avez-vous les prérequis de [Configuration](/fr/docs/setup/) ? Pas de stress; cette page peut attendre avec une patience presque suspecte.

Un installateur {{< dfn id="idempotent" text="idempotent" >}} peut être relancé sans exiger un nouveau clone. Utilisez des réponses simples pendant le démarrage rapide; `npm run setup` lit votre configuration existante, affiche vos réponses précédentes comme valeurs par défaut et met à jour les mêmes fichiers générés. Consultez la [définition du glossaire](/fr/docs/reference/glossary/#idempotent).

Les mainteneurs ont insisté pour que les étapes ci-dessous utilisent des valeurs pertinentes au lieu d'une pile de placeholders `example.com` qui laisse tout le monde perplexe et en besoin d'un verre. Nous avons donc créé une instance démo nommée [v8s.link](/fr/docs/v8s-link/) pour démontrer ce qui fonctionne sans ambiguïté.

{{% steps %}}

### Ouvrir votre terminal

Ouvrez un terminal et allez dans le répertoire où vous gardez votre code source. Par exemple :

```bash
cd ~/code
```

Utilisez la structure locale qui fonctionne déjà pour vous. L'important est que l'instance vanityURLs vive dans un répertoire que vous retrouverez facilement.

### Confirmer l'authentification GitHub

Assurez-vous que votre compte GitHub est configuré pour [SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) ou [HTTPS](https://docs.github.com/get-started/getting-started-with-git/caching-your-github-credentials-in-git) avant de pousser votre propre dépôt.

Créez un nouveau dépôt GitHub public ou privé pour votre redirecteur avant l'étape finale de push. Ne l'initialisez pas avec un README, une licence ou un `.gitignore`; l'instance locale fournira le contenu initial.

### Cloner le code vanityURLs

```bash
git clone https://github.com/vanityURLs/code.git v8s-link
cd v8s-link
```

Vous pouvez utiliser n'importe quel nom de répertoire au lieu de `v8s-link`. Choisissez un nom qui restera clair si vous l'alignez ensuite avec votre dépôt GitHub et le nom du Worker.

### Détacher le clone du projet upstream

Lancez le helper de détachement avant de créer votre propre historique Git. Il retire les métadonnées upstream utiles au développement de vanityURLs, mais inutiles pour votre instance personnelle :

```bash
npm run detach
```

### Confirmer les outils requis

```bash
which npm node git jq
```

Si une commande manque, installez-la avant de continuer. `jq` est requis lorsque vous installez le [helper local](/fr/docs/command-line-interface/local-helper/) plus loin dans ce démarrage rapide.

### Installer les dépendances

```bash
npm install
```

### Configurer une instance simple

Lancez l'installateur :

```bash
npm run setup
```

Pour la phase 1, concentrez-vous sur ces réponses. L'installateur pose aussi des questions sur l'opérateur, la confiance et le contexte légal; utilisez des valeurs simples et consultez [Juridiction](/fr/docs/customize/jurisdiction/) pour le tableau de décision complet.

| Question | Réponse exemple | Comment répondre |
| --- | --- | --- |
| Domaine court | `v8s.link` | Le domaine qui servira vos liens courts |
| Nom du Worker | `v8s-link` | Nom du projet Cloudflare Worker. Les lettres minuscules, chiffres et traits d'union fonctionnent le mieux |
| Étiquette propriétaire | `team` | Étiquette qui identifie la personne ou l'équipe qui a fait le changement. Consultez [Étiquettes de propriétaire pour l'historique des liens courts](/en/blog/owner-labels-for-short-link-change-history/) |
| Longueur des slugs aléatoires | `3` | Nombre de caractères par défaut lorsque `lnk` génère un slug. Vous pouvez le remplacer par commande ou par tag plus tard. Voir [Choisir des slugs aléatoires lisibles](/fr/blog/choosing-readable-random-slugs/) |
| Fournisseur d'analytics | `disabled` | Restez désactivé pour la phase 1. Consultez [Analytics](/fr/docs/customize/analytics/) pendant la personnalisation |
| Domaine d'équipe Cloudflare Access | `vanityurls.cloudflareaccess.com` | Valeur de `CF_ACCESS_TEAM_DOMAIN`; trouvez-la dans **Zero Trust** > **Settings** sous **Team domain** |
| Langues supportées | `de,en,es,fr,it` | Codes ISO séparés par des virgules. L'anglais (`en`) est la langue principale et de fallback lorsqu'une page localisée n'est pas disponible. Voir [Langues](/fr/docs/reference/i18n/) |
| Configurer maintenant les pages juridiction, confidentialité, conditions et sécurité ? | `N` | Restez désactivé pour la phase 1. Consultez [Juridiction](/fr/docs/customize/jurisdiction/) pendant la personnalisation |
| Nom légal de l'opérateur | `Benoît H. Dicaire` | Nom simple de l'opérateur pour la phase 1. Consultez [Juridiction](/fr/docs/customize/jurisdiction/) pendant la personnalisation |
| Domaine de l'opérateur pour les courriels de contact | `vanityurls.link` | Domaine utilisé pour les adresses de contact par défaut comme `abuse@vanityurls.link` et `security@vanityurls.link` |
| Contact Trust & Safety | `abuse@vanityurls.link` | Courriel utilisé pour les rapports d'abus et de confiance |
| Contact sécurité | `security@vanityurls.link` | Courriel publié pour les rapports de sécurité et `security.txt` |
| Configurer la marque maintenant ? | `N` | Restez désactivé pour la phase 1. Consultez [Marque](/fr/docs/customize/brand/) pendant la personnalisation |

Certains défauts sont dérivés de vos réponses précédentes afin que l'installateur ne repose pas la même idée deux fois. Setup ignore aussi les questions liées lorsque vous désactivez une section, comme les analytics ou les pages légales complètes.

### Installer les helpers locaux

```bash
npm run local-install
```

Le script d'installation copie les outils locaux au chemin attendu sur votre poste. Le module shell `v8s` vous permet d'ouvrir un lien court connu depuis votre terminal au lieu de passer au navigateur. L'interface en ligne de commande `lnk` vous permet de gérer le contenu de `v8s-links.txt` et `v8s-schedules.json` sans éditeur texte. Consultez [Helper local](/fr/docs/command-line-interface/local-helper/) et [LNK](/fr/docs/command-line-interface/lnk/) pour plus d'information.

### Créer votre premier commit

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
```

### Pousser vers votre dépôt GitHub

Utilisez l'URL du dépôt GitHub que vous avez créé pour votre instance :

```bash
git remote add origin git@github.com:vanityURLs/v8s.link.git
git push -u origin main
```

ou

```bash
git remote add origin https://github.com/vanityURLs/v8s.link.git
git push -u origin main
```

### Connecter le dépôt à Workers & Pages

Dans Cloudflare, ouvrez **Build** > **Compute** > **Workers & Pages** depuis le menu principal du compte, puis :

1. Créez une application avec le nom du Worker dans `wrangler.toml`, comme `v8s-link`. La console Cloudflare ne renomme pas les Workers après création, alors consultez [Wrangler Without Shooting Yourself in the Foot](/en/blog/wrangler/#pick-one-name-and-reuse-it) pour comprendre pourquoi ce nom devrait correspondre à votre répertoire local et à votre dépôt GitHub
2. Continuez avec GitHub
3. Sélectionnez votre dépôt de redirecteur
4. Confirmez que Cloudflare utilise le nom de projet écrit par setup dans `wrangler.toml`
5. Laissez les champs **Build** et **Deploy** tels quels afin que `wrangler.toml` reste l'autorité
6. Désélectionnez les builds pour les branches non production, sauf si vous voulez déployer chaque branche

### Configurer le contrôle d'accès

Protégez `/_stats` et `/_tests` avec Cloudflare Access avant de traiter l'instance comme production. Pour la phase 1, utilisez un code à usage unique avec des adresses courriel approuvées. Vous pourrez passer à GitHub, Google ou un autre fournisseur d'identité plus tard.

Suivez [Contrôle d'accès](/fr/docs/customize/access-control/) pour créer l'application Zero Trust, configurer la politique et copier le **Application Audience (AUD) Tag**.

Dans votre terminal local, stockez l'audience Access comme secret Worker :

```bash
npx wrangler secret put CF_ACCESS_AUD --config wrangler.toml
```

La commande setup écrit déjà le domaine d'équipe Access dans `wrangler.toml`. Confirmez qu'il correspond au domaine Team de Cloudflare Zero Trust :

```toml
[vars]
CF_ACCESS_TEAM_DOMAIN = "<team>.cloudflareaccess.com"
```

### Configurer la protection réseau

Configurez les contrôles de zone Cloudflare qui protègent le domaine court avant que le trafic atteigne le Worker. Pour le démarrage rapide, gardez seulement la base :

1. Confirmez que le domaine court utilise le record Worker Custom Domain proxifié dans **DNS**
2. Établissez la base HTTPS dans **SSL/TLS**, incluant Full strict, Always Use HTTPS, TLS 1.3 et une version TLS minimale de 1.2 ou plus stricte
3. Activez les contrôles de sécurité simples dans **Security**, comme Bot Fight Mode, Browser Integrity Check, les règles gérées Cloudflare et `security.txt`
4. Ajoutez des règles WAF pour les probes de scanners, les méthodes HTTP inattendues, les clients suspects, les crawlers IA non désirés et les échecs répétés de liens courts
5. Gardez la mise en cache conservatrice afin que les décisions de redirection restent dans le Worker

Suivez [Protection réseau](/fr/docs/customize/network-protection/) pour les menus Cloudflare exacts, les valeurs recommandées et les exemples d'expressions WAF. Le trafic bloqué par Cloudflare n'atteint pas les analytics vanityURLs; consultez ces événements dans Cloudflare Security Events.

### Optionnel : tester localement

Avant de pousser le commit Access et protection réseau, vous pouvez lancer le Worker localement :

```bash
npm run dev
```

Wrangler démarre un serveur de développement local afin que vous puissiez vérifier la page d'accueil, les pages générées et les redirections de base avant que Cloudflare déploie depuis GitHub.

### Valider et pousser

```bash
npm run check
git add .
git commit -m "configure Cloudflare Access and network protection"
git push
```

Cloudflare devrait déployer depuis GitHub après le push.

### Tester le déploiement

Ouvrez la page d'accueil, `/expand/`, `/404.html`, `/expired.html`, `/disabled.html` et `/maintenance.html`.

Si `custom/v8s-links.txt` n'existe pas, setup le crée depuis `defaults/v8s-links.txt`, puis adapte les liens de départ `home`, `status` et `docs` à votre domaine court et à votre étiquette propriétaire.

| Slug | Lien long |
| --- | --- |
| `home` | `https://<short-domain>` |
| `status` | `https://status.<short-domain>` |
| `docs` | `https://vanityURLs.link/en/docs/` |

Testez au moins un lien initial, comme `https://<short-domain>/docs`, et confirmez qu'il redirige vers le lien long indiqué dans le tableau.

Testez ensuite `/_stats` et `/_tests` depuis un profil de navigateur déconnecté ou privé. Vous devriez voir Cloudflare Access avant le tableau de bord protégé ou la page de test.

{{% /steps %}}
