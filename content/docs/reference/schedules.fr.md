---
aside: false
title: "Liens planifies"
description: "Configurer des liens exacts sensibles au temps avec v8s-schedules.json et le registre v8s.json genere."
weight: 70
aliases:
  - /docs/schedules/

---

Les liens planifies permettent a un slug stable de pointer ailleurs pendant certaines plages horaires. Gardez le lien normal dans `v8s-links.txt`, puis ajoutez les regles dans `v8s-schedules.json`.

Pour les cas d'usage et la logique de decision, lisez [Quand les liens planifies sont utiles](/fr/blog/when-scheduled-links-are-useful/).

Les planifications s'appliquent actuellement aux liens exacts. Les liens splat restent bases sur le chemin.

Pour les changements courants, utilisez la CLI Node au lieu de modifier le JSON a la main :

```bash
./scripts/lnk schedule add hangout https://zoom.us/j/work --label work --days mon,tue,wed,thu,fri --from 09:00 --to 17:00 --timezone America/Toronto --default https://discord.gg/personal
./scripts/lnk schedule list hangout
```

La CLI ecrit `custom/v8s-schedules.json` par defaut. Definissez `V8S_SCHEDULES_FILE` ou passez `--file` pour utiliser un autre chemin.

Utilisez `schedule default` seulement apres que le slug a deja au moins une regle. Une planification avec une cible par defaut mais aucune regle active est invalide au build.

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

## Forme complete

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

Les regles sont verifiees dans l'ordre. La premiere regle active gagne. Si aucune regle ne correspond, le Worker utilise la cible normale de `v8s-links.txt`, ou la cible `default` de la planification si elle existe.

Les fenetres sont inclusives a `from` et exclusives a `to`. Les fenetres qui passent minuit sont supportees.

Vous avez seulement besoin de modifier `v8s-schedules.json` a la main pour les restructurations avancees, les edits de masse, ou les changements de code review plus clairs directement en JSON.
