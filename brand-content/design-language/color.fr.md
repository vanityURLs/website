---
title: "Couleur"
heading: "Tokens de couleur principaux et regles d'usage pour les surfaces vanityURLs"
type: brand
weight: 10
---

- Utilisez le teal comme accent, pas comme interface entiere.
- Gardez les couleurs de statut semantiques et distinctes du teal de marque.
- Preservez le contraste des badges sur les surfaces claires et sombres.
- Associez les accents de marque aux gris neutres, au blanc et aux surfaces encre foncee afin que les pages ne deviennent pas des compositions uniquement teal.
- Testez les combinaisons de couleurs selon les exigences de contraste WCAG avant publication.

## Palette principale

| Token           | Valeur                                                                                  | Usage                                                                 |
| --------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Encre           | <span class="brand-color-token" style="--brand-color-token: #111827;"></span> `#111827` | Texte principal, badges sur surface claire, interface a forte emphase |
| Papier          | <span class="brand-color-token" style="--brand-color-token: #FFFFFF;"></span> `#FFFFFF` | Fond de page principal et texte de badge sur surface sombre           |
| Teal vanityURLs | <span class="brand-color-token" style="--brand-color-token: #0F766E;"></span> `#0F766E` | Emphase de marque, liens, etats selectionnes, accents principaux      |
| Teal swoop      | <span class="brand-color-token" style="--brand-color-token: #14B8A6;"></span> `#14B8A6` | Accent secondaire et detail de mouvement ou d'illustration            |
| Texte discret   | <span class="brand-color-token" style="--brand-color-token: #6B7280;"></span> `#6B7280` | Descriptions secondaires et aide contextuelle                         |
| Ligne           | <span class="brand-color-token" style="--brand-color-token: #E5E7EB;"></span> `#E5E7EB` | Bordures et separateurs                                               |
| Surface sombre  | <span class="brand-color-token" style="--brand-color-token: #111827;"></span> `#111827` | Surfaces de documentation sombres, panneaux proches du code, badges   |

## Echelle Tailwind

Le site web etend Tailwind avec une echelle teal `brand`. Utilisez ces valeurs lors de la conception de nouvelles surfaces afin que les accents correspondent a l'implementation du site.

| Token       | Valeur                                                                                  |
| ----------- | --------------------------------------------------------------------------------------- |
| `brand-50`  | <span class="brand-color-token" style="--brand-color-token: #f0fdfa;"></span> `#f0fdfa` |
| `brand-100` | <span class="brand-color-token" style="--brand-color-token: #ccfbf1;"></span> `#ccfbf1` |
| `brand-200` | <span class="brand-color-token" style="--brand-color-token: #99f6e4;"></span> `#99f6e4` |
| `brand-300` | <span class="brand-color-token" style="--brand-color-token: #5eead4;"></span> `#5eead4` |
| `brand-400` | <span class="brand-color-token" style="--brand-color-token: #2dd4bf;"></span> `#2dd4bf` |
| `brand-500` | <span class="brand-color-token" style="--brand-color-token: #14b8a6;"></span> `#14b8a6` |
| `brand-600` | <span class="brand-color-token" style="--brand-color-token: #0d9488;"></span> `#0d9488` |
| `brand-700` | <span class="brand-color-token" style="--brand-color-token: #0f766e;"></span> `#0f766e` |
| `brand-800` | <span class="brand-color-token" style="--brand-color-token: #115e59;"></span> `#115e59` |
| `brand-900` | <span class="brand-color-token" style="--brand-color-token: #134e4a;"></span> `#134e4a` |
