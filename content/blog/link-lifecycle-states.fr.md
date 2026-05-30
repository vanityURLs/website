---
title: "Ne supprimez pas un lien pour changer son sens"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Utiliser les etats de cycle de vie pour rendre le comportement des liens courts explicite sans supprimer l'historique ni perdre l'intention operationnelle."
tags: ["etats-de-liens", "operations", "liens-courts"]
featured: false
---

Un lien court survit souvent au moment qui l'a cree.

Quelqu'un le colle dans un runbook. Quelqu'un l'imprime sur une diapositive. Quelqu'un l'ajoute aux favoris. Six mois plus tard, une destination change et la solution tentante est de supprimer la ligne.

Ne commencez pas par la. Dans vanityURLs, les etats de cycle de vie rendent la decision operationnelle explicite dans `custom/v8s-links.txt` : rediriger, expirer, desactiver, mettre en maintenance ou disparaitre comme un vrai introuvable.

## Etats De Redirection

Utilisez `permanent` lorsque la destination est stable. vanityURLs retourne HTTP `301`, le statut de redirection permanente defini par [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110).

Utilisez `ephemeral` lorsque la destination fonctionne maintenant mais pourrait changer bientot. vanityURLs retourne HTTP `302`, aussi defini par RFC 9110. Les pages de lancement, campagnes temporaires, salles de collaboration et liens de support courts vivent souvent ici.

Si l'etat est omis, le builder revient au defaut du projet. Pour les liens importants, ecrivez l'etat quand meme. Les lignes explicites survivent mieux a la revue que l'intention implicite.

```text
docs|https://www.vanityurls.link/en/docs/|permanent|Docs|Documentation|docs|v8s||
launch|https://example.com/spring|ephemeral|Spring launch|Temporary campaign|campaign|marketing||
```

## Etats Sans Redirection

Utilisez `expired` lorsqu'un lien etait valide mais devrait maintenant expliquer que son temps est passe. Les evenements, offres, postes d'embauche et liens d'acces temporaires devraient echouer clairement plutot que deriver vers une destination sans rapport.

Utilisez `disabled` lorsque le lien est volontairement indisponible. Le slug, le proprietaire, les metadonnees et l'historique de revue restent visibles.

Utilisez `maintenance` lorsque la cible devrait revenir. C'est l'etat "pas maintenant" pour les interruptions planifiees, migrations et blocages de securite temporaires.

Utilisez `deactivated` lorsque le slug devrait se comporter comme s'il n'existait pas. vanityURLs retourne un vrai `404`. Gardez-le pour les cas ou une page expiree ou desactivee revelerait plus que l'operateur veut exposer.

## L'Expiration Est Un Garde-Fou

Le champ `expires_at` peut rendre un lien effectivement expire lorsque le timestamp est dans le passe.

Ce n'est pas un planificateur. C'est un garde-fou. Il garde la ligne originale lisible tout en laissant le runtime arreter la redirection apres l'echeance si personne ne pense a modifier le fichier le lendemain matin.

```text
event/check-in|https://example.com/check-in|ephemeral|Check-in|Event check-in|event|ops|2026-06-01T13:00:00Z|
```

## Le Compromis

Les etats de cycle de vie ajoutent un peu de vocabulaire. C'est le cout.

Le benefice est l'auditabilite. Une personne en revue peut voir si un lien doit rediriger de facon permanente, rester temporaire, echouer avec une explication, attendre ou disparaitre. Supprimer la ligne repond seulement a une question : le lien est parti. Cela ne dit pas pourquoi.

Pour le format exact des champs et le comportement runtime, lisez [Format des liens](/fr/docs/reference/link-format/). Pour inspecter des exemples actifs, utilisez la [page des operations v8s.link](/fr/docs/v8s-link/operations/).
