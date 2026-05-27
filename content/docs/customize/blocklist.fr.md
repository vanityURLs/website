---
aside: false
title: "Politique et blocklist"
description: "Configurer la politique allow/block de l'instance pour URLs cibles, chaînes de shorteners, malware, schémas risqués et choix locaux."
weight: 60
aliases:
  - /docs/blocklist/

---

Utilisez la personnalisation de politique et blocklist lorsque votre instance a besoin de décisions locales de confiance et sécurité au-delà des defaults produit.

Pour le raisonnement confiance et sécurité, lisez [Protéger la réputation d'un domaine court](/fr/blog/protecting-the-reputation-of-a-short-link-domain/). Pour la sélection des fichiers source, catégories, feeds générés, artefacts runtime et comportement des champs, lisez la [référence politique et blocklist](/fr/docs/reference/policy-blocklist/).

{{% steps %}}

### Décider si une politique locale est nécessaire

Commencez avec la politique par défaut sauf si vous avez une raison concrète de la remplacer. Les raisons courantes incluent :

- autoriser un domaine contrôlé par l'opérateur qu'un feed généré bloque
- bloquer une famille de destinations risquée avant une campagne publique
- répondre à un signalement d'abus
- importer des liens depuis un autre raccourcisseur
- changer le propriétaire, l'audience ou le but de l'instance

### Créer le fichier de politique custom

Créez `custom/v8s-policies.json` lorsque l'instance a besoin de ses propres règles :

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

`custom/v8s-policies.json` remplace la politique source par défaut. Il ne fusionne pas par-dessus `defaults/v8s-policies.json`.

### Garder les règles allow étroites

Utilisez `allow_domains` seulement pour des domaines de confiance contrôlés par l'opérateur. Préférez autoriser un hostname précis plutôt qu'un domaine enregistrable entier lorsqu'un seul sous-domaine est nécessaire.

Les règles allow peuvent surcharger les blocages de domaines générés et locaux. Elles ne surchargent pas les URLs mal formées, protocoles refusés ou URLs avec identifiants.

### Valider avant le déploiement

Lancez la validation après chaque changement de politique :

```bash
npm run check
```

Le validateur compare les liens configurés à la blocklist runtime générée. Corrigez les liens rejetés avant de déployer au lieu de contourner la politique.

### Réviser après incident

Révisez la politique après un signalement d'abus, un changement de destination à fort volume, une mise à jour de feed généré ou une nouvelle campagne publique.

Lancez les mises à jour optionnelles de politique générée seulement lorsque vous êtes prêt à relire les résultats :

```bash
npm run generate:blocklist
```

{{% /steps %}}
