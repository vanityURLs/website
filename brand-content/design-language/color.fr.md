---
title: "Couleur"
heading: "Tokens de couleur principaux et regles d'usage pour les surfaces"
type: brand
weight: 10
---

- Utilisez le teal comme accent, pas comme interface entiere.
- Gardez les couleurs de statut semantiques et distinctes du teal de marque.
- Preservez le contraste des badges sur les surfaces claires et sombres.
- Associez les accents de marque aux gris neutres, au blanc et aux surfaces encre foncee afin que les pages ne deviennent pas des compositions uniquement teal.
- Testez les combinaisons de couleurs selon les exigences de contraste WCAG avant publication.

La palette vanityURLs suit la meme intention que la [fondation couleur de Red Hat](https://ux.redhat.com/foundations/color/) : la couleur sert l'expression de marque, la hierarchie, les etats et l'accessibilite. Traitez la palette comme un ensemble de decisions nommees, pas comme une reserve decorative interchangeable.

## Principes d'usage

- Utilisez des noms semantiques dans l'implementation lorsqu'une couleur decrit un role : texte, surface, bordure, lien, selection, succes, avertissement, danger et desactive.
- Utilisez les valeurs de palette fixes seulement au niveau des tokens ou dans les notes de production d'assets.
- Evitez le noir pur dans les grandes surfaces d'interface. Utilisez le token encre pour le texte sombre et les panneaux sombres.
- Reservez les teals plus lumineux aux accents, illustrations, anneaux de focus, details hover et etats actifs.
- N'utilisez pas le teal de marque pour les erreurs, dangers ou etats d'abus. Ces etats ont besoin de couleurs semantiques propres.
- Verifiez les combinaisons en themes clair et sombre avant publication, surtout les badges, liens, anneaux de focus et graphiques.

## Palette principale

<table class="brand-color-table">
  <colgroup>
    <col class="brand-color-table-token">
    <col class="brand-color-table-value">
    <col class="brand-color-table-use">
  </colgroup>
  <thead>
    <tr>
      <th>Token</th>
      <th>Valeur</th>
      <th>Usage</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Encre</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span>#111827</span></td>
      <td>Texte principal, badges sur surface claire, interface a forte emphase</td>
    </tr>
    <tr>
      <td>Papier</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-paper"></span>#FFFFFF</span></td>
      <td>Fond de page principal et texte de badge sur surface sombre</td>
    </tr>
    <tr>
      <td>Teal vanityURLs</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span>#0F766E</span></td>
      <td>Emphase de marque, liens, etats selectionnes, accents principaux</td>
    </tr>
    <tr>
      <td>Teal swoop</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span>#14B8A6</span></td>
      <td>Accent secondaire et detail de mouvement ou d'illustration</td>
    </tr>
    <tr>
      <td>Texte discret</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-muted"></span>#6B7280</span></td>
      <td>Descriptions secondaires et aide contextuelle</td>
    </tr>
    <tr>
      <td>Ligne</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-line"></span>#E5E7EB</span></td>
      <td>Bordures et separateurs</td>
    </tr>
    <tr>
      <td>Surface sombre</td>
      <td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-ink"></span>#111827</span></td>
      <td>Surfaces de documentation sombres, panneaux proches du code, badges</td>
    </tr>
  </tbody>
</table>

## Correspondance semantique

| Role             | Token prefere                                  | Recommandation                                                                                               |
| ---------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Canvas de page   | Papier                                         | Utilisez pour les surfaces de lecture normales et les pages publiques generees.                              |
| Texte principal  | Encre                                          | Utilisez pour les titres, le texte courant, les libelles et les valeurs importantes.                         |
| Texte secondaire | Texte discret                                  | Utilisez pour l'aide, les metadonnees et les descriptions de tableau.                                        |
| Bordures         | Ligne                                          | Utilisez pour les separateurs, bordures de tableau, contours de carte et regles discretes.                   |
| Liens            | Teal vanityURLs                                | Utilisez pour les liens inline et la navigation selectionnee. Gardez un souligne ou un autre indice visible. |
| Focus            | Teal vanityURLs ou anneau semantique contraste | Rendez le focus visible sur la surface voisine.                                                              |
| Surfaces sombres | Surface sombre avec texte Papier               | Utilisez avec retenue pour panneaux proches du code, apercus de badge et moments de marque contrastes.       |

## Couleurs de statut

Les couleurs de statut doivent communiquer le sens avant la marque. Un lien bloque, une redirection expiree, un avertissement d'abus, un etat de maintenance ou une note de securite doivent rester comprehensibles meme si la couleur est ignoree.

- Associez chaque couleur de statut a du texte, une icone ou un libelle clair.
- Gardez succes, avertissement, danger et information visuellement distincts du teal de marque.
- Utilisez des bordures ou fonds discrets pour les avis de faible severite; renforcez le traitement seulement lorsque l'etat change la prochaine action.
- Testez les couleurs de statut dans les deux themes et pres des liens.

## Echelle Tailwind

Le site web etend Tailwind avec une echelle teal `brand`. Utilisez ces valeurs lors de la conception de nouvelles surfaces afin que les accents correspondent a l'implementation du site.

<table class="brand-color-table">
  <colgroup>
    <col class="brand-color-table-token">
    <col class="brand-color-table-value-wide">
  </colgroup>
  <thead>
    <tr>
      <th>Token</th>
      <th>Valeur</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>brand-50</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-50"></span>#f0fdfa</span></td></tr>
    <tr><td>brand-100</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-100"></span>#ccfbf1</span></td></tr>
    <tr><td>brand-200</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-200"></span>#99f6e4</span></td></tr>
    <tr><td>brand-300</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-300"></span>#5eead4</span></td></tr>
    <tr><td>brand-400</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-400"></span>#2dd4bf</span></td></tr>
    <tr><td>brand-500</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-500"></span>#14b8a6</span></td></tr>
    <tr><td>brand-600</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-600"></span>#0d9488</span></td></tr>
    <tr><td>brand-700</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-700"></span>#0f766e</span></td></tr>
    <tr><td>brand-800</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-800"></span>#115e59</span></td></tr>
    <tr><td>brand-900</td><td><span class="brand-color-value"><span class="brand-color-token-swatch brand-color-brand-900"></span>#134e4a</span></td></tr>
  </tbody>
</table>
