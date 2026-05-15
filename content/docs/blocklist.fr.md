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

## Categories et sources generees

`defaults/v8s-blocklist-categories.json` definit les libelles de categorie et severite utilises par les regles locales et la politique generee. Les categories expliquent pourquoi un element est bloque; les severites decrivent le risque pour la securite des visiteurs et la reputation du domaine court.

Les defaults actuels incluent :

| Categorie | Usage |
|---|---|
| `phishing` | Vol d'identifiants, fausses pages de connexion, leurres wallet-draining, et usurpation de marque |
| `malware` | Distribution de malware, exploit delivery, hebergement de payload, et infrastructure command-and-control |
| `shortener-loop` | Raccourcisseurs publics qui peuvent cacher la destination finale ou creer des chaines |
| `scanner-probe` | Chemins de scanners automatises qui ne doivent jamais resoudre comme liens courts |
| `temporary-file-host`, `disposable`, `adult`, `gambling`, `social`, `custom` | Categories propres a l'instance pour blocs a risque eleve ou choisis par le proprietaire |

La politique generee utilise des flux open source reputes configures dans `defaults/v8s-blocklist.json` :

| Source | Categorie | Severite | Objectif |
|---|---|---|---|
| `urlhaus_malware` | `malware` | `high` | Importe des domaines malware depuis abuse.ch URLhaus |
| `url_shorteners` | `shortener-loop` | `medium` | Importe des domaines de raccourcisseurs publics depuis la liste PeterDaveHello `url-shorteners` |

Les flux generes reduisent le risque d'abus evident, mais ils peuvent avoir des faux positifs. Revoyez les changements upstream avant de les promouvoir dans une release, et gardez les entrees `allow_domains` etroites quand vous contournez volontairement un bloc genere pour un hostname controle par le proprietaire.

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

Utilisez `generated_sources` dans `custom/v8s-blocklist.json` quand une instance doit desactiver une source par defaut ou ajouter une autre source au meme format de domaines ligne par ligne :

```json
{
  "generated_sources": {
    "url_shorteners": {
      "enabled": false
    }
  }
}
```

Chaque source generee active doit avoir une categorie, une severite, une URL, et une raison claire de faire confiance a l'upstream. Un redirecteur attire les scanners meme quand personne n'a annonce le domaine; la qualite des sources compte donc beaucoup : des sources bruyantes peuvent casser des liens legitimes, tandis qu'une absence de sources anti-abus evidentes peut bruler la reputation rapidement.
