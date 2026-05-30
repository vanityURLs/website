---
aside: false
title: "Liens planifiés"
description: "Configurer des liens exacts sensibles au temps avec v8s-schedules.json et le registre v8s.json génère."
weight: 110
aliases:
  - /docs/schedules/

---

Les liens planifiés permettent à un slug stable de pointer ailleurs pendant certaines plages horaires. Gardez le lien normal dans `v8s-links.txt`, puis ajoutez les règles dans `v8s-schedules.json`.

Pour les cas d'usage et la logique de décision, lisez [Quand les liens planifiés sont utiles](/fr/blog/when-scheduled-links-are-useful/).

Les planifications s'appliquent actuellement aux liens exacts. Les liens splat restent bases sur le chemin.

Pour les changements courants, utilisez la CLI Node au lieu de modifier le JSON à la main :

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

La CLI écrit `custom/v8s-schedules.json` par défaut. Définissez `V8S_SCHEDULES_FILE` ou passez `--file` pour utiliser un autre chemin.

Utilisez `schedule default` seulement après que le slug a déjà au moins une règle. Une planification avec une cible par défaut mais aucune règle active est invalide au build.

## Forme compacte

```json
{
  "hangout": {
    "timezone": "America/Toronto",
    "9to5": "https://zoom.us/j/work",
    "default": "https://discord.gg/personal"
  }
}
```

## Forme complété

```json
{
  "hangout": {
    "rules": [
      {
        "label": "work",
        "timezone": "America/Toronto",
        "days": ["mon", "tue", "wed", "thu", "fri"],
        "from": "09:00",
        "to": "17:00",
        "target": "https://zoom.us/j/work"
      }
    ]
  }
}
```

Les règles sont verifiees dans l'ordre. La première règle active gagne. Si aucune règle ne correspond, le Worker utilise la cible normale de `v8s-links.txt`, ou la cible `default` de la planification si elle existe.

Les fenêtres sont inclusives a `from` et exclusives a `to`. Les fenêtres qui passent minuit sont supportées.

Vous avez seulement besoin de modifier `v8s-schedules.json` à la main pour les restructurations avancees, les edits de masse, ou les changements de code review plus clairs directement en JSON.
