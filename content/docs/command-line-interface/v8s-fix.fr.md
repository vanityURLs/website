---
aside: false
title: "v8s-fix"
description: "Réparer les dérives de maintenance sûres dans custom/public signalées par npm run doctor."
weight: 30
---

`v8s-fix` est la commande de maintenance du dépôt pour `custom/public/`. Elle répare les dérives corrigibles signalées par `npm run doctor`, surtout les pages produit copiées ou les assets partagés `v8s-*` qui devraient maintenant venir de `defaults/public/`.

Utilisez-la après une mise à jour lorsque doctor recommande un groupe de correction. Ce n'est pas un remplacement pour la revue des pages custom, et elle ne devrait pas servir à écraser un design volontairement propre à l'instance.

## Avant de la lancer

Lancez doctor d'abord :

```bash
npm run doctor
```

Lancez ensuite le groupe de correction étroit recommandé par doctor. Préférez `--dry-run` avant d'appliquer un changement :

```bash
./scripts/v8s-fix --assets --dry-run
./scripts/v8s-fix --assets
```

Après coup, révisez le diff :

```bash
git status --short
git diff
```

## Groupes de correction

| Commande                            | Utilisez-la quand                                                                                                     |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `./scripts/v8s-fix --assets`        | Retirer les shadows `custom/public/v8s-*` obsolètes afin que les defaults fournissent le CSS et le JavaScript runtime |
| `./scripts/v8s-fix --head-assets`   | Rafraîchir les références de favicon, icône d'app et thème dans le HTML custom                                        |
| `./scripts/v8s-fix --product-pages` | Synchroniser les pages produit de dashboard ou QA qui doivent rester vanilla                                          |
| `./scripts/v8s-fix --languages`     | Retirer de `custom/public/` les répertoires de langues copiés mais non supportés                                      |
| `./scripts/v8s-fix --branding`      | Réappliquer la marque configurée au HTML public custom copié                                                          |
| `./scripts/v8s-fix --all`           | Appliquer tous les groupes de maintenance non destructifs                                                             |
| `./scripts/v8s-fix --public`        | Recréer `custom/public/` depuis les defaults, puis appliquer la marque et l'élagage des langues                       |

`--public` est volontairement large. Utilisez-le seulement lorsque vous voulez reconstruire les pages publiques copiées depuis les defaults produit actuels. Il peut remplacer des modifications locales sous `custom/public/`.

## Surcharges volontaires

Si doctor signale un fichier qui est volontairement différent, documentez cette décision dans `custom/v8s-custom-overrides.json` au lieu de lancer une correction qui effacerait le travail custom.

Par exemple :

```json
{
  "schema_version": "1.0",
  "doctor": {
    "ignore": [
      {
        "path": "custom/public/404.html",
        "codes": ["html-head-assets-stale"],
        "reason": "L'instance utilise volontairement une page 404 custom qui ressemble à l'accueil."
      }
    ]
  }
}
```

Gardez les règles d'ignore étroites. Utilisez des chemins exacts pour les fichiers uniques, `custom/public/fr/**` pour un répertoire, et `codes` ou `fixes` afin que doctor continue de signaler les dérives sans rapport.

## Place dans les mises à jour

`npm run update` ou `npm run upgrade` rafraîchit les fichiers possédés par le produit comme `defaults/`, `scripts/` et les manifests de package. La commande ne réécrit pas aveuglément `custom/public/`, parce que ces fichiers peuvent contenir une marque ou du HTML custom volontaire.

`npm run doctor` identifie les dérives de maintenance après la mise à jour. `v8s-fix` applique seulement le groupe de maintenance que vous sélectionnez, puis laisse la revue finale à Git.
