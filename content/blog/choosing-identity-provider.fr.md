---
title: "Commencez par le code a usage unique, puis meritez l'IdP"
date: 2026-05-22
description: "Comment choisir entre code a usage unique, GitHub, Google et d'autres fournisseurs d'identite pour securiser les pages operationnelles vanityURLs"
tags: ["cloudflare", "access", "identity"]
---

La premiere decision d'identite pour un domaine court devrait etre ennuyeuse.

Protegez `/_stats` et `/_tests` avant que l'instance soit publique. Ne passez pas le premier deploiement a concevoir une architecture d'identite enterprise si l'enterprise n'existe pas encore.

Pour vanityURLs, [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/applications/) protege les pages operationnelles avant que le Worker les serve. La question n'est pas "quel IdP est le meilleur?" La question est "quel chemin d'acces l'operateur peut-il reviser et retirer sans ceremonie?"

## Le Defaut Du Premier Jour

Utilisez le [code a usage unique](https://developers.cloudflare.com/cloudflare-one/identity/one-time-pin/) de Cloudflare pour une instance personnelle ou une petite equipe qui accede rarement aux pages operationnelles.

Il a une propriete utile : aucun fournisseur d'identite externe n'a besoin d'etre configure avant que le tableau de bord soit prive. Cloudflare envoie un code de connexion aux adresses courriel approuvees. C'est assez pour mettre l'instance en ligne sans exposer l'inventaire de liens.

Le compromis est la friction. Si les gens se connectent chaque jour, les codes par courriel deviennent du bruit. C'est le moment ou un IdP commence a meriter sa place.

## Quand Utiliser Un Vrai IdP

Choisissez le fournisseur qui possede deja le processus d'arrivee et de depart.

| Fournisseur | Utilisez-le quand |
| --- | --- |
| [GitHub](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/github/) | les mainteneurs appartiennent deja a la meme organisation ou equipe GitHub |
| [Google](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/google/) | l'operateur utilise deja Gmail ou Google Workspace |
| [Microsoft Entra ID](https://developers.cloudflare.com/cloudflare-one/identity/idp-integration/entra-id/) ou un autre IdP corporatif | l'acces devrait suivre les controles RH, appareil, MFA et offboarding existants |

Le selecteur compte autant que le fournisseur. Une instance personnelle peut autoriser des adresses nommees. Une instance d'equipe devrait aller vers des groupes maintenus, l'appartenance a une organisation GitHub ou des selecteurs venant de l'IdP. Sinon, l'offboarding devient une chasse au tresor.

## Plusieurs Fournisseurs Ne Posent Pas Probleme

Le premier choix ne fige pas l'architecture.

Vous pouvez commencer avec le code a usage unique et ajouter GitHub, Google ou un IdP corporatif plus tard pour la meme application Access. Si une personne utilise la meme adresse courriel chez plusieurs fournisseurs, Cloudflare evalue l'identite retournee par le fournisseur choisi puis applique la politique Access.

Cette flexibilite est utile. C'est aussi un piege si personne ne possede la revue. Ajouter des fournisseurs devrait rendre l'acces plus facile a gouverner, pas plus difficile a expliquer.

## Le Test

Apres avoir configure le fournisseur, testez la frontiere :

1. Ouvrez un profil de navigateur deconnecte ou prive.
2. Visitez `https://<short-domain>/_stats`.
3. Confirmez que Cloudflare Access apparait avant le tableau de bord.
4. Confirmez qu'une identite non autorisee echoue.

Puis notez qui possede la politique Access. Votre futur vous ne se souviendra pas pourquoi `friend@example.com` etait autorise.

Utilisez [Controle d'acces](/fr/docs/customize/access-control/) pour les etapes de setup. Utilisez [Exploiter Cloudflare Access pour un domaine de liens courts](/fr/blog/operating-cloudflare-access-for-a-short-link-domain/) pour la checklist de revue.
