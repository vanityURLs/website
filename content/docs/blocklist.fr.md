---
title: "Politique blocklist"
description: "Politique anti-abus par defaut et custom pour URLs cibles, chaines de raccourcisseurs, malware, schemas risqués et overrides locaux."
---

vanityURLs utilise `defaults/v8s-blocklist.json` comme politique anti-abus upstream. La politique propre a l'instance vit dans `custom/v8s-blocklist.json` et surcharge les defaults.

L'objectif est de proteger la reputation d'un domaine court en reduisant phishing, malware, chaines de redirection, et formes d'URL risquees.

Un redirecteur est une infrastructure puissante. N'utilisez pas une instance vanityURLs pour cacher des destinations malveillantes, contourner des systemes de confiance, blanchir une chaine d'autres raccourcisseurs, dissimuler des liens affiliés ou de tracking sans divulgation, ou envoyer les gens vers du contenu qu'ils ne pouvaient pas raisonnablement attendre. Un domaine court gagne la confiance lentement et peut la perdre tres vite.

## Protections par defaut

- Protocoles non HTTP(S)
- Identifiants integres dans les URLs
- Cibles localhost, `.localhost`, et `.local`
- Reseaux prives, loopback, reserves, multicast, et IPs de documentation
- Raccourcisseurs publics connus utilises pour les chaines
- Exemples locaux de domaines leurres de phishing
- Extensions executables a haut risque comme `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, et `.jar`

Le runtime bloque aussi les probes de scanners courantes avant la resolution de lien court, afin que les chemins PHP ou WordPress ne deviennent pas des misses ordinaires dans les analytics.

## Configurer la politique locale

Creez `custom/v8s-blocklist.json` pour les regles propres a l'instance. Le build le fusionne par-dessus `defaults/v8s-blocklist.json`.

```json
{
  "allow_domains": [
    "example.com",
    "docs.example.com"
  ],
  "block_domains": [
    "untrusted-example.test"
  ],
  "block_keywords": [
    "credential-harvest",
    "wallet-drain"
  ],
  "block_extensions": [
    ".exe",
    ".scr"
  ]
}
```

Lancez la validation apres un changement de politique :

```bash
npm run check
```

Le validateur compare les liens configures a la blocklist fusionnee. Corrigez les liens rejetes avant le deploiement au lieu de contourner la politique.

## Overrides et revue

`allow_domains` peut contourner des blocs de domaines generes ou locaux pour des domaines fiables controles par le proprietaire. Il ne contourne pas les URLs mal formees, protocoles interdits, ou URLs avec identifiants.

Les regles keyword comparent hostname, chemin et query string apres conversion en minuscules. Gardez-les specifiques pour eviter les faux positifs.

Revoyez la blocklist quand :

- vous ajoutez une destination a fort volume
- vous ajoutez des liens soumis par utilisateurs ou tiers
- vous recevez un rapport d'abus
- vous changez le proprietaire, l'audience, ou l'objectif de l'instance
- vous importez des liens depuis un autre raccourcisseur

Gardez les allow rules locales etroites. Preferez autoriser un hostname precis controle par le proprietaire plutot qu'un domaine entier quand un seul sous-domaine suffit.

## Blocklist generee

Generez les donnees machine optionnelles avec :

```bash
npm run generate:blocklist
```

Le fichier genere est fait pour CI ou deploiement, pas pour l'edition manuelle. Revisez les grands changements de flux upstream avant de les promouvoir dans les defaults.
