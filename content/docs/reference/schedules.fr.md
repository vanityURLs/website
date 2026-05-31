---
aside: false
title: "Liens planifiés"
description: "Configurer des liens exacts sensibles au temps avec des horaires inline dans v8s-links.txt et le registre v8s.json génère."
weight: 110
aliases:
  - /docs/schedules/

---

Les liens planifiés permettent à un slug stable de pointer ailleurs pendant certaines plages horaires. Gardez la cible normale sur la ligne du lien dans `v8s-links.txt`, puis ajoutez des directives `@schedule` indentées sous cette ligne.

Pour les cas d'usage et la logique de décision, lisez [Quand les liens planifiés sont utiles](/fr/blog/when-scheduled-links-are-useful/).

Les planifications s'appliquent actuellement aux liens exacts. Les liens splat restent bases sur le chemin.

## Forme inline

```txt
hangout|https://discord.gg/personal|permanent|Hangout|Community hangout|community|team||
  @schedule timezone=America/Toronto
  @schedule rule=work days=mon,tue,wed,thu,fri from=09:00 to=17:00 target=https://zoom.us/j/work
```

La cible de la ligne du lien est la cible de repli. Les règles d'horaire choisissent seulement une cible temporaire pendant les fenêtres correspondantes.

## Forme compacte

```txt
contact|https://www.youtube.com/watch?v=dQw4w9WgXcQ|permanent|Contact|Scheduled contact example|contact,schedule|owner||
  @schedule timezone=America/New_York
  @schedule 9to5=https://www.youtube.com/watch?v=UbxUSsFXYo4
```

## Forme JSON héritée

Le build lit encore `custom/v8s-schedules.json` pendant la série 3.x pour compatibilité avec les instances existantes et la commande actuelle `lnk schedule`. Les nouveaux horaires écrits à la main devraient vivre inline dans `v8s-links.txt`.

Les règles sont verifiees dans l'ordre. La première règle active gagne. Si aucune règle ne correspond, le Worker utilise la cible normale de `v8s-links.txt`.

Les fenêtres sont inclusives a `from` et exclusives a `to`. Les fenêtres qui passent minuit sont supportées.
