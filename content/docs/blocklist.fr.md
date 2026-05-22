---
aside: false
title: "Politique et blocklist"
description: "Politique source et blocklist runtime generee pour les URLs cibles, chaines de shorteners, malware, schemas risques et choix locaux."
---

vanityURLs edite la politique source comme `v8s-policies.json` et deploie la politique runtime comme `build/v8s-blocklist.json`.

La politique source est choisie avant le build :

- `defaults/v8s-policies.json` est la politique source upstream
- `custom/v8s-policies.json` remplace la politique source par defaut pour une instance
- Les anciens fichiers source `v8s-blocklist.json` peuvent encore etre reconnus pour migration, mais les nouvelles instances devraient utiliser `v8s-policies.json`

`custom/v8s-policies.json` ne fusionne pas par-dessus la politique par defaut. Quand une instance possede sa politique, elle possede le remplacement.

Le but est de proteger la reputation du domaine court contre phishing, malware, chaines de redirection, et formes d'URL risquees.

## Protections par defaut

- Protocoles non HTTP(S)
- Identifiants dans les URLs
- Cibles localhost, `.localhost`, et `.local`
- Plages IP privees, loopback, reservees, multicast, et documentation
- Shorteners publics utilises pour cacher la destination finale
- Exemples locaux de domaines de phishing
- Extensions de telechargement a haut risque comme `.exe`, `.scr`, `.bat`, `.cmd`, `.msi`, `.ps1`, `.vbs`, et `.jar`

Le runtime bloque aussi les probes de scanners courantes avant la recherche de lien.

## Categories et sources generees

`defaults/v8s-blocklist-categories.json` definit les categories et severites utilisees par la politique source et les donnees generees. Les categories expliquent pourquoi un element est bloque; les severites decrivent le risque.

Les feeds generes reduisent les risques evidents, mais peuvent avoir des faux positifs. Relisez les changements avant release et gardez les `allow_domains` etroits.

## Configurer la politique d'instance

Creez `custom/v8s-policies.json` pour les regles propres a l'instance :

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

Validez apres chaque changement :

```bash
npm run check
```

Le validateur compare les liens configures a la blocklist runtime generee. Corrigez les liens rejetes avant de deployer.

## Artefact runtime

Generez les donnees machine optionnelles avec :

```bash
npm run generate:blocklist
```

Le build ecrit l'artefact runtime ici :

```text
build/v8s-blocklist.json
```

Ce fichier est consomme par le Worker et bloque en acces public direct sous `/v8s-blocklist.json`. C'est une sortie generee, pas un fichier a editer a la main.
