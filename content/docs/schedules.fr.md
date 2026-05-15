---
title: "Liens planifies"
description: "Configurer des liens exacts sensibles au temps avec v8s-schedules.json et le registre v8s.json genere."
---

Les liens planifies permettent a un slug stable de pointer ailleurs pendant certaines plages horaires. Gardez le lien normal dans `v8s-links.txt`, puis ajoutez les regles dans `v8s-schedules.json`.

Les planifications s'appliquent actuellement aux liens exacts. Les liens splat restent bases sur le chemin.

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
