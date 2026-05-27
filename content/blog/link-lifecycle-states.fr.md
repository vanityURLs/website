---
title: "Utiliser les états de cycle de vie des liens"
date: 2026-05-27
author: "Benoît H. Dicaire"
description: "Utiliser les états de cycle de vie pour rendre le comportement des liens courts explicite sans supprimer l'historique ni perdre l'intention opérationnelle."
tags: ["etats-de-liens", "operations", "liens-courts"]
featured: false
---

Un lien court n'est pas toujours simplement actif ou disparu. Parfois il doit être permanent. Parfois il doit rester temporaire. Parfois il doit arrêter de router sans disparaître de l'historique. Les états de cycle de vie rendent ces choix explicites dans `custom/v8s-links.txt`.

C'est important parce qu'un redirecteur est une infrastructure opérationnelle. Les gens ajoutent les liens aux favoris, les collent dans la documentation, les impriment sur des slides et les partagent dans les conversations. Changer le comportement d'un lien devrait être visible en revue de code.

## États actifs

Utilisez `permanent` lorsque la destination est stable et que vous acceptez que les clients et les crawlers traitent la redirection comme durable. En termes HTTP, vanityURLs retourne une redirection permanente pour ce lien.

Utilisez `ephemeral` lorsque la destination fonctionne maintenant mais pourrait changer bientôt : page de lancement, campagne temporaire, espace de collaboration court terme ou tout lien pour lequel cacher une redirection permanente serait trop audacieux.

Si l'état est omis, le builder traite la ligne selon le défaut du projet. Pour les liens importants, écrivez l'état quand même. L'explicite évite les surprises.

## États d'attente

Utilisez `expired` lorsque le lien était valide mais doit maintenant envoyer les visiteurs vers une page d'expiration. C'est utile pour les événements, les offres, les liens d'embauche et les ressources temporaires qui devraient échouer clairement au lieu de dériver vers une destination sans rapport.

Utilisez `disabled` lorsque le lien doit être volontairement indisponible. Ce n'est pas la même chose que le supprimer. Le slug existe encore, le propriétaire et les métadonnées existent encore, et la page désactivée indique aux opérateurs et aux visiteurs que le lien a été désactivé volontairement.

Utilisez `maintenance` lorsque la cible devrait revenir. L'état maintenance est utile pendant les interruptions planifiées, les migrations ou les blocages de sécurité temporaires où la bonne réponse est "pas maintenant" plutôt que "disparu".

Utilisez `deactivated` lorsque le lien doit se comporter comme s'il n'existait pas. vanityURLs retourne une vraie réponse introuvable pour cet état. Gardez-le pour les cas où même une page désactivée ou expirée révélerait plus que vous voulez exposer.

## Dates d'expiration

Le champ `expires_at` peut rendre un lien effectivement expiré lorsque le timestamp est dans le passé. Cela garde la ligne originale lisible tout en laissant le runtime appliquer automatiquement l'état le plus prudent.

C'est un bon choix pour les liens d'événements et les liens d'accès temporaires. L'intention reste dans l'inventaire, et l'expiration ne dépend pas de quelqu'un qui doit se souvenir de modifier le fichier le lendemain matin.

## Choisir l'état

Commencez avec la question opérationnelle :

- Le navigateur devrait-il se souvenir longtemps de cette redirection ? Utilisez `permanent`.
- La cible pourrait-elle changer bientôt ? Utilisez `ephemeral`.
- Le lien est-il terminé, mais mérite une explication ? Utilisez `expired`.
- Le lien est-il volontairement arrêté ? Utilisez `disabled`.
- La cible est-elle temporairement indisponible ? Utilisez `maintenance`.
- Le slug devrait-il sembler absent ? Utilisez `deactivated`.

Pour le format exact des champs et le comportement runtime, lisez [Format des liens](/fr/docs/reference/link-format/). Pour inspecter des exemples actifs, utilisez la [page des opérations v8s.link](/fr/docs/v8s-link/operations/).
