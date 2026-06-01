---
aside: false
title: "Aide-mémoire"
description: "Une référence compacte pour exploiter, personnaliser et diagnostiquer une instance vanityURLs."
weight: 15
aliases:
  - /docs/cheatsheet/
---

Utilisez cet aide-mémoire lorsque vous connaissez déjà le produit et voulez retrouver rapidement la bonne action. La page est conçue pour l'écran et pour l'export PDF depuis le navigateur.

<div class="cheatsheet-grid">
  <section class="cheatsheet-card">
    <h2>Workflow quotidien</h2>
    <table>
      <thead>
        <tr>
          <th>Besoin</th>
          <th>Action / fichier</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Installer</td>
          <td><code>npm install</code></td>
          <td>À lancer après checkout ou changement de dépendances.</td>
        </tr>
        <tr>
          <td>Démarrer localement</td>
          <td><code>npm run dev</code></td>
          <td>Lance le Worker avec Wrangler pour les tests locaux.</td>
        </tr>
        <tr>
          <td>Valider</td>
          <td><code>npm run check</code></td>
          <td>Construit et vérifie les artefacts runtime avant déploiement.</td>
        </tr>
        <tr>
          <td>Déployer</td>
          <td><code>git push</code></td>
          <td>GitHub et Cloudflare publient le Worker automatiquement.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Dépôts</h2>
    <table>
      <thead>
        <tr>
          <th>Surface</th>
          <th>Dépôt</th>
          <th>Déploie vers</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Redirecteur</td>
          <td><code>vanityURLs/code</code></td>
          <td><code>https://VanityURLs.link</code></td>
        </tr>
        <tr>
          <td>Documentation</td>
          <td><code>vanityURLs/website</code></td>
          <td><code>https://www.VanityURLs.link</code></td>
        </tr>
        <tr>
          <td>Sorties générées</td>
          <td><code>build/</code>, <code>src/</code></td>
          <td>Ne pas modifier directement.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Fichiers clés</h2>
    <table>
      <thead>
        <tr>
          <th>Fichier</th>
          <th>Utilisation</th>
          <th>Responsable</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><code>custom/v8s-links.txt</code></td>
          <td>Liste des redirections éditée à la main.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>custom/v8s-site-config.json</code></td>
          <td>Marque, contacts, langues, fuseau horaire.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>custom/v8s-policies.json</code></td>
          <td>Domaines permis, domaines bloqués, politique de mots-clés.</td>
          <td>Instance</td>
        </tr>
        <tr>
          <td><code>defaults/</code></td>
          <td>Baseline produit copiée ou fusionnée par le build.</td>
          <td>Produit</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Format d'un lien</h2>
    <table>
      <thead>
        <tr>
          <th>Champ</th>
          <th>Exemple</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Slug</td>
          <td><code>docs</code></td>
          <td>Segment public. Gardez-le lisible et durable.</td>
        </tr>
        <tr>
          <td>Cible</td>
          <td><code>https://example.com/docs</code></td>
          <td>URL de destination après contrôles de politique.</td>
        </tr>
        <tr>
          <td>État</td>
          <td><code>active</code></td>
          <td>Détermine si la redirection doit résoudre.</td>
        </tr>
        <tr>
          <td>Métadonnées</td>
          <td><code>title</code>, <code>owner</code>, <code>notes</code></td>
          <td>Aide la revue, l'audit, le tableau de bord et le transfert.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Horaires</h2>
    <table>
      <thead>
        <tr>
          <th>Besoin</th>
          <th>Syntaxe</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cible temporaire</td>
          <td><code>@schedule</code></td>
          <td>Indentez les blocs sous la ligne du lien.</td>
        </tr>
        <tr>
          <td>Fuseau horaire</td>
          <td><code>America/Toronto</code></td>
          <td>Utilisez les noms IANA acceptés par le runtime.</td>
        </tr>
        <tr>
          <td>Liens exacts</td>
          <td><code>/launch</code></td>
          <td>Les horaires s'appliquent aux liens exacts, pas aux namespaces splat.</td>
        </tr>
        <tr>
          <td>Repli</td>
          <td>Cible de la ligne</td>
          <td>La cible normale reste utilisée hors des fenêtres horaires.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Comportement</h2>
    <table>
      <thead>
        <tr>
          <th>Entrée</th>
          <th>Comportement</th>
          <th>À vérifier</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Slug actif connu</td>
          <td>Redirige vers la cible.</td>
          <td>Confirmez la cible et la politique.</td>
        </tr>
        <tr>
          <td>Slug inactif ou expiré</td>
          <td>Affiche la page de statut correspondante.</td>
          <td>Revoyez l'état, les dates et le registre généré.</td>
        </tr>
        <tr>
          <td>Destination bloquée</td>
          <td>Ne redirige pas.</td>
          <td>Vérifiez la politique source et la blocklist générée.</td>
        </tr>
        <tr>
          <td>Chemin inconnu</td>
          <td>Retourne le comportement introuvable.</td>
          <td>Vérifiez le slug et les routes générées.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Personnaliser</h2>
    <table>
      <thead>
        <tr>
          <th>Objectif</th>
          <th>Utiliser</th>
          <th>Éviter</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Changer les liens</td>
          <td><code>custom/v8s-links.txt</code></td>
          <td>Modifier <code>build/v8s.json</code>.</td>
        </tr>
        <tr>
          <td>Marquer les pages</td>
          <td><code>custom/v8s-site-config.json</code></td>
          <td>Copier les templates complets sans besoin.</td>
        </tr>
        <tr>
          <td>Surcharger des assets</td>
          <td><code>custom/public/</code></td>
          <td>Changer les defaults produit pour une instance.</td>
        </tr>
        <tr>
          <td>Changer le Worker</td>
          <td><code>scripts/workers/</code></td>
          <td>Modifier le <code>src/</code> généré.</td>
        </tr>
      </tbody>
    </table>
  </section>

  <section class="cheatsheet-card">
    <h2>Dépannage</h2>
    <table>
      <thead>
        <tr>
          <th>Symptôme</th>
          <th>Vérifier</th>
          <th>Correctif probable</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>OK localement, pas en ligne</td>
          <td>Action GitHub et statut de déploiement Worker.</td>
          <td>Poussez, attendez le déploiement, retestez.</td>
        </tr>
        <tr>
          <td>Lien absent</td>
          <td><code>build/v8s.json</code> généré.</td>
          <td>Corrigez la ligne source, puis rebuildez.</td>
        </tr>
        <tr>
          <td>Mauvaise langue</td>
          <td>Langues configurées et surcharges localisées.</td>
          <td>Ajoutez la page localisée ou utilisez le fallback.</td>
        </tr>
        <tr>
          <td>Horaire surprenant</td>
          <td>Fuseau horaire opérateur et fenêtre de dates.</td>
          <td>Utilisez des noms IANA explicites.</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>

## Comparaisons rapides

<table class="cheatsheet-compare">
  <thead>
    <tr>
      <th>Choix</th>
      <th>À utiliser quand</th>
      <th>À retenir</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>defaults/</code></td>
      <td>Vous changez la baseline produit pour toutes les instances.</td>
      <td>À revoir comme comportement produit.</td>
    </tr>
    <tr>
      <td><code>custom/</code></td>
      <td>Vous changez une instance déployée.</td>
      <td>Meilleur endroit pour les changements opérateur.</td>
    </tr>
    <tr>
      <td>Slug exact</td>
      <td>Le chemin public doit résoudre vers une seule destination connue.</td>
      <td>Supporte le comportement horaire.</td>
    </tr>
    <tr>
      <td>Namespace splat</td>
      <td>Un préfixe stable doit transmettre des chemins imbriqués.</td>
      <td>À éviter pour les redirections sensibles au temps.</td>
    </tr>
  </tbody>
</table>
