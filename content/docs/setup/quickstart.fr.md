---
title: "Démarrage rapide"
description: "Lancer un redirecteur vanityURLs simple sur votre propre domaine court, puis le personnalisér une fois le premier déploiement fonctionnel."
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

Assurez-vous que votre compte GitHub est configuré pour [SSH](/fr/docs/setup/) ou [HTTPS](/fr/docs/reference/glossary/#idempotent) avant de pousser votre propre dépôt.

Créez un nouveau dépôt GitHub public ou privé pour votre redirecteur avant l'étape finale de push. Ne l'initialisez pas avec un README, une licence ou un `.gitignore`; l'instance locale fournira le contenu initial.

### Cloner le code vanityURLs

Vous pouvez utiliser n'importe quel nom de répertoire au lieu de `v8s-link`. Choisissez un nom qui restera clair si vous l'alignez ensuite avec votre dépôt GitHub et le nom du Worker.

```bash
git clone https://github.com/vanityURLs/code.git v8s-link
cd v8s-link
```

### Détacher le clone du projet upstream

Lancez le helper de détachement avant de créer votre propre historique Git. Il retire les métadonnées upstream utiles au développement de vanityURLs, mais inutiles pour votre instance personnelle :

```bash
npm run detach
```

### Confirmer les outils requis

```bash
which npm node git jq
```

Si une commande manque, installez-la avant de continuer. `jq` est seulement requis lorsque vous installez le [helper local](/fr/docs/command-line-interface/local-helper/) plus loin dans ce démarrage rapide.

### Installer les dépendances

```bash
npm install
```

### Configurer _votre_ instance

Lancez l'installateur :

```bash
npm run setup
```

Pour la phase 1, concentrez-vous sur ces réponses.

| Question                                                           | Réponse exemple                   | Conseil                                                                                                                                                                                                   |
| ------------------------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domaine court                                                      | `v8s.link`                        | Le domaine qui servira vos liens courts                                                                                                                                                                   |
| Nom du Worker                                                      | `v8s-link`                        | Nom du projet Cloudflare Worker. Les lettres minuscules, chiffres et traits d'union fonctionnent le mieux                                                                                                 |
| Étiquette propriétaire                                             | `bhd`                             | Étiquette qui identifie la personne ou l'équipe qui a fait le changement. Consultez [Étiquettes de propriétaire pour l'historique des liens courts](/en/blog/owner-labels-for-short-link-change-history/) |
| Configurer les analytics maintenant ?                              | `N`                               | Restez désactive pour l'instant. Consultez [Analytics](/fr/docs/customize/analytics/) pendant la personnalisation                                                                                         |
| Domaine d'équipe Cloudflare Access                                 | `vanityurls.cloudflareaccess.com` | Valeur de `CF_ACCESS_TEAM_DOMAIN`; trouvez-la dans **Zero Trust** > **Settings** sous **Team domain**                                                                                                     |
| Langues supportées                                                 | `en,de,es,fr,it`                  | Codes ISO séparés par des virgules pour toutes les langues supportées. L'anglais (`en`) est la [langue principale et de fallback](/fr/docs/reference/i18n/)                                               |
| Fuseau horaire de l'opérateur                                      | `America/Toronto`                 | Utilisez un [nom de fuseau IANA](/fr/docs/reference/timezones/), pas un décalage numérique. vanityURLs gère automatiquement l'heure avancée pour les liens planifiés et les horodatages opérateur         |
| Configurer la juridiction et les pages liées ?                     | `N`                               | Restez désactive pour l'instant. Consultez [Juridiction](/fr/docs/customize/jurisdiction/) pendant la personnalisation                                                                                    |
| Nom légal de l'opérateur                                           | `Benoît H. Dicaire`               | Utilisez le nom légal de l'opérateur. Consultez [Juridiction](/fr/docs/customize/jurisdiction/) pendant la personnalisation                                                                               |
| Réviser les courriels de contact publics pour les pages générées ? | `Y`                               | Révisez les [adresses publiques de signalement](/fr/docs/v8s-link/) une fois, puis mettez à jour manuellement `/custom/v8s-site-config.json`                                                              |
| Configurer la marque maintenant ?                                  | `N`                               | Restez désactive pour l'instant. Consultez [Marque](/fr/docs/reference/brand/) pendant la personnalisation                                                                                                |

Certains défauts sont dérivés de vos réponses précédentes afin que l'installateur ne repose pas la même idée deux fois. Setup ignore aussi les questions liées lorsque vous désactivez une section, comme les analytics ou les pages légales complètes.

L'installateur écrit `links.random_slug_length` à `3` lorsque la valeur est absente. Modifiez `custom/v8s-site-config.json` plus tard si vous voulez un autre défaut.

### Installer les helpers locaux

```bash
npm run local-install
```

Cette commande installe les raccourcis optionnels du poste. Utilisez [Helper local](/fr/docs/command-line-interface/local-helper/) pour le raccourci en lecture seule `v8s`, et [LNK](/fr/docs/command-line-interface/lnk/) lorsque vous voulez gérer les liens et horaires depuis le terminal.

Si vous avez déjà installe le helper local pour une autre instance, votre shell peut déjà exporter `V8S_REPO`. La commande source `./scripts/lnk` préfère maintenant le dépôt depuis lequel elle s'execute, mais les clones plus anciens peuvent encore être touches par une valeur d'environnement perimee. Si `./scripts/lnk list` affiche les liens d'une autre instance, lancez :

```bash
unset V8S_REPO
./scripts/lnk list
```

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

{{< callout type="warning" title="Protéger les pages opérationnelles privées" >}}
L'accès au [Dashboard](https://v8s.link/en/_stats/) et à la [matrice de test](https://v8s.link/en/_tests/) doit être protégé par [Cloudflare Access](https://www.cloudflare.com/products/access/), une solution Zero Trust Network Access (ZTNA).
{{< /callout >}}

Ouvrez [Contrôle d'accès](../customize/access-control/) dans un autre onglet et complétéz les activités de cette page. Assurez-vous d'avoir copie le **Application Audience (AUD) Tag** dans votre gestionnaire de mots de passe.

### Configurer la protection réseau

Le trafic bloque par Cloudflare n'atteint pas votre instance vanityURLs, ce qui réduit les tracas et le bruit dans le Worker. Le volume d'événements non sollicites peut surprendre. Consultez les requêtes bloquées dans Cloudflare Security Events, pas dans Workers, parce que ces requêtes sont arrétées avant l'execution du Worker.

Ouvrez [Protection réseau](/fr/docs/customize/network-protection/) dans un autre onglet et complétéz les activités de cette page. Revenez ici lorsque ces réglages sont en place.

### _Optionnel:_ tester localement

Avant de valider l'instance, vous pouvez lancer le Worker localement avec `npm run dev`. Wrangler démarre un serveur de développement local afin que vous puissiez vérifier la page d'accueil, les pages générées et les redirections de base avant que Cloudflare déploie depuis GitHub.

### Valider et pousser

```bash
npm run check
git status --short
```

Si la validation a modifié des fichiers générés ou si vous avez encore des changements locaux de setup à publier :

```bash
git add .
git commit -m "chore: finish initial instance setup"
git push
```

Si ce n'est pas votre premier push et que `git status --short` est vide, il n'y a rien de nouveau à committer. Cloudflare déploiera depuis GitHub après le prochain push qui modifie le dépôt.

### Tester le déploiement

Ouvrez la page d'accueil, `/lookup/`, `/404.html`, `/expired.html`, `/disabled.html` et `/maintenance.html`.

Si `custom/v8s-links.txt` n'existe pas, setup le crée depuis `defaults/v8s-links.txt`, puis adapte les liens de départ `home`, `contact` et `docs` à votre domaine court et à votre étiquette propriétaire.

| Slug      | Lien long                                     |
| --------- | --------------------------------------------- |
| `home`    | `https://<short-domain>`                      |
| `contact` | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| `docs`    | `https://www.vanityurls.link/en/docs/`        |

Testez au moins un lien initial, comme `https://<short-domain>/docs`, et confirmez qu'il redirige vers le lien long indiqué dans le tableau. Testez `https://<short-domain>/contact` lorsque vous voulez voir l'horaire de départ remplacer cette cible pendant la fenêtre 9 à 5 configurée.

Testez ensuite `/en/_stats/`, un autre chemin stats localisé comme `/fr/_stats/`, et `/en/_tests/` depuis un profil de navigateur déconnecté ou privé. Vous devriez voir Cloudflare Access avant le tableau de bord protégé ou la page de test. L'ancien chemin `/_stats` redirige vers `/en/_stats/`, et l'ancien chemin `/_tests` redirige vers `/en/_tests/`.

{{% /steps %}}
