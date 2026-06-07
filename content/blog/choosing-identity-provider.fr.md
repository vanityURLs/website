---
title: "Commencez par le code à usage unique, puis meritez l'IdP"
date: 2026-05-22
description: "Comment choisir entre code à usage unique, GitHub, Google et d'autres fournisseurs d'identité pour securiser les pages opérationnelles vanityURLs"
tags: ["cloudflare", "access", "identity"]
---

La première décision d'identité pour un domaine court devrait être ennuyeuse.

Protegez `/en/_stats/`, les autres chemins stats localisés et `/en/_tests/` avant que l'instance soit publique. Ne passez pas le premier déploiement a concevoir une architecture d'identité enterprise si l'enterprise n'existe pas encore.

Pour vanityURLs, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) protège les pages opérationnelles avant que le Worker les serve. La question n'est pas "quel IdP est le meilleur?" La question est "quel chemin d'accès l'opérateur peut-il réviser et retirer sans ceremonie?"

## Le Défaut Du Premier Jour

Utilisez le [code à usage unique](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/) de Cloudflare pour une instance personnelle ou une petite équipe qui accede rarement aux pages opérationnelles.

Il à une propriété utile : aucun fournisseur d'identité externe n'a besoin d'être configure avant que le tableau de bord soit privé. Cloudflare envoie un code de connexion aux adresses courriel approuvees. C'est assez pour mettre l'instance en ligne sans exposer l'inventaire de liens.

Le compromis est la friction. Si les gens se connectent chaque jour, les codes par courriel deviennent du bruit. C'est le moment ou un IdP commence a meriter sa place.

## Quand Utiliser Un Vrai IdP

Choisissez le fournisseur qui possède déjà le processus d'arrivee et de départ.

| Fournisseur                                                                                                                          | Utilisez-le quand                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/github/)                                          | les mainteneurs appartiennent déjà à la même organisation ou équipe GitHub      |
| [Google](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/)                                          | l'opérateur utilise déjà Gmail ou Google Workspace                              |
| [Microsoft Entra ID](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/entra-id/) ou un autre IdP corporatif | l'accès devrait suivre les contrôles RH, appareil, MFA et offboarding existants |

Le selecteur compte autant que le fournisseur. Une instance personnelle peut autoriser des adresses nommees. Une instance d'équipe devrait aller vers des groupes maintenus, l'appartenance à une organisation GitHub ou des selecteurs venant de l'IdP. Sinon, l'offboarding devient une chasse au tresor.

## Plusieurs Fournisseurs Ne Posent Pas Probleme

Le premier choix ne fige pas l'architecture.

Vous pouvez commencer avec le code à usage unique et ajouter GitHub, Google ou un IdP corporatif plus tard pour la même application Access. Si une personne utilise la même adresse courriel chez plusieurs fournisseurs, Cloudflare évalue l'identité retournee par le fournisseur choisi puis applique la politique Access.

Cette flexibilité est utile. C'est aussi un piege si personne ne possède la revue. Ajouter des fournisseurs devrait rendre l'accès plus facile a gouverner, pas plus difficile a expliquer.

## Le Test

Apres avoir configure le fournisseur, testez la frontiere :

1. Ouvrez un profil de navigateur deconnecte ou privé.
2. Visitez `https://<short-domain>/en/_stats/`.
3. Confirmez que Cloudflare Access apparait avant le tableau de bord.
4. Confirmez qu'une identité non autorisee échoue.

Puis notez qui possède la politique Access. Votre futur vous ne se souviendra pas pourquoi `friend@example.com` était autorise.

Utilisez [Contrôle d'accès](/fr/docs/customize/access-control/) pour les etapes de setup. Utilisez [Exploiter Cloudflare Access pour un domaine de liens courts](/fr/blog/operating-cloudflare-access-for-a-short-link-domain/) pour la checklist de revue.
