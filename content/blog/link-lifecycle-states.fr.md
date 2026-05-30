---
title: "Ne supprimez pas un lien pour changer son sens"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Utiliser les états de cycle de vie pour rendre le comportement des liens courts explicite sans supprimer l'historique ni perdre l'intention opérationnelle."
tags: ["états-de-liens", "opérations", "liens-courts"]
featured: false
---

Un lien court survit souvent au moment qui l'a créé.

Quelqu'un le colle dans un runbook. Quelqu'un l'imprime sur une diapositive. Quelqu'un l'ajoute aux favoris. Six mois plus tard, une destination change et la solution tentante est de supprimer la ligne.

Ne commencez pas par la. Dans vanityURLs, les états de cycle de vie rendent la décision opérationnelle explicite dans `custom/v8s-links.txt` : rediriger, expirer, désactiver, mettre en maintenance ou disparaitre comme un vrai introuvable.

## États De Redirection

Utilisez `permanent` lorsque la destination est stable. vanityURLs retourne HTTP `301`, le statut de redirection permanente defini par [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110).

Utilisez `ephemeral` lorsque la destination fonctionne maintenant mais pourrait changer bientôt. vanityURLs retourne HTTP `302`, aussi defini par RFC 9110. Les pages de lancement, campagnes temporaires, salles de collaboration et liens de support courts vivent souvent ici.

Si l'état est omis, le builder revient au défaut du projet. Pour les liens importants, écrivez l'état quand même. Les lignes explicites survivent mieux à la revue que l'intention implicite.

```text
docs|https://www.vanityurls.link/en/docs/|permanent|Docs|Documentation|docs|v8s||
launch|https://example.com/spring|ephemeral|Spring launch|Temporary campaign|campaign|marketing||
```

## États Sans Redirection

Utilisez `expired` lorsqu'un lien était valide mais devrait maintenant expliquer que son temps est passe. Les événements, offres, postes d'embauche et liens d'accès temporaires devraient échouer clairement plutot que deriver vers une destination sans rapport.

Utilisez `disabled` lorsque le lien est volontairement indisponible. Le slug, le propriétaire, les metadonnées et l'historique de revue restent visibles.

Utilisez `maintenance` lorsque la cible devrait revenir. C'est l'état "pas maintenant" pour les interruptions planifiées, migrations et blocages de sécurité temporaires.

Utilisez `deactivated` lorsque le slug devrait se comporter comme s'il n'existait pas. vanityURLs retourne un vrai `404`. Gardez-le pour les cas ou une page expirée ou désactivée revelerait plus que l'opérateur veut exposer.

## L'Expiration Est Un Garde-Fou

Le champ `expires_at` peut rendre un lien effectivement expire lorsque le timestamp est dans le passe.

Ce n'est pas un planificateur. C'est un garde-fou. Il garde la ligne originale lisible tout en laissant le runtime arrétér la redirection après l'echeance si personne ne pense à modifier le fichier le lendemain matin.

```text
event/check-in|https://example.com/check-in|ephemeral|Check-in|Event check-in|event|ops|2026-06-01T13:00:00Z|
```

## Le Compromis

Les états de cycle de vie ajoutent un peu de vocabulaire. C'est le cout.

Le benefice est l'auditabilite. Une personne en revue peut voir si un lien doit rediriger de facon permanente, rester temporaire, échouer avec une explication, attendre ou disparaitre. Supprimer la ligne répond seulement à une question : le lien est parti. Cela ne dit pas pourquoi.

Pour le format exact des champs et le comportement runtime, lisez [Format des liens](/fr/docs/reference/link-format/). Pour inspecter des exemples actifs, utilisez la [page des opérations v8s.link](/fr/docs/v8s-link/operations/).
