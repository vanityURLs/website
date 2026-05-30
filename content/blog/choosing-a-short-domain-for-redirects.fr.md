---
title: "Choisir un domaine court pour les redirections"
date: 2026-05-21
author: "Benoît H. Dicaire"
description: "Comment choisir et enregistrer un domaine court pour un redirecteur vanityURLs sans se coincer opérationnellement."
tags: ["guide", "domains"]
featured: false
---

Un domaine de liens courts à un seul travail : être facile a taper, a reconnaitre, a scanner et a réténir. Il n'a pas besoin d'expliquer toute votre organisation. Il doit rendre des liens comme `go.example/launch`, `v8s.link/docs` ou `bn.to/event` intentionnels.

## Commencer Par La Confiance, Pas Seulement La Longueur

Le domaine disponible le plus court n'est pas automatiquement le meilleur. Un domaine de redirection apparait dans des courriels, codes QR, diapositives de conference, documents imprimes, publications sociales et réponses de support. Les gens decident s'ils cliquent en une fraction de seconde.

Preferez un domaine qui est :

- lie a votre nom, produit, marque ou communaute
- facile a dire a voix haute
- difficile a confondre avec un autre mot ou une autre organisation
- sans ponctuation bizarre une fois en minuscules
- assez court pour laisser respirer le slug

Par exemple, `go.example.com` est plus long qu'un domaine pays a deux lettres, mais il peut être plus reconnaissable pour une entreprise qui possède déjà `example.com`.

## Choisir Entre Apex Et Sous-Domaine

Vous pouvez faire tourner vanityURLs sur :

- un domaine apex dedie, comme `v8s.link`
- un sous-domaine d'un domaine que vous possèdez déjà, comme `go.example.com`

Un domaine apex dedie est memorable et portable. C'est aussi un domaine de plus a renouveler, securiser et surveiller.

Un sous-domaine est souvent plus facile a faire approuver dans une équipe parce que l'organisation possède déjà le domaine parent. Il est moins compact, mais il herite de la confiance de la marque existante.

## Verifier Le Registraire Et Le DNS

Avant d'achétér, confirmez que le domaine peut utiliser le DNS autoritatif Cloudflare. Avec le setup DNS principal de Cloudflare, vous ajoutez le domaine a Cloudflare puis vous changez les serveurs de noms chez le registraire.

Verifiez aussi :

- le prix de renouvellement, pas seulement le prix de première annee
- les règles d'admissibilite speciales du registre
- la disponibilite de la confidentialité de domaine
- le support de la signature de sécurité DNS
- le contrôle direct des serveurs de noms chez le registraire

Cloudflare Registrar est pratique pour les domaines de premier niveau supportes parce que les domaines achêtes la utilisent déjà Cloudflare DNS. Pour les domaines non supportes, n'importe quel registraire convient si vous pouvez changer les serveurs de noms autoritatifs.

## Eviter Les Domaines Jetables

Les raccourcisseurs sont abuses partout sur Internet, donc les signaux de confiance comptent. Évitez les domaines qui ressemblent à une infrastructure de campagne jetable, sauf si c'est vraiment le cas d'usage.

Soyez prudent avec :

- les chaines aléatoires sans lien avec votre identité
- les caracteres ou graphies qui imitent une autre marque
- les TLD qui ont une réputation d'abus dans votre public
- les domaines amusants mais impossibles a dicter au telephone
- les domaines qui dependent d'une blague que vous ne voudrez plus dans cinq ans

Les meilleurs domaines de redirection sont ennuyeux dans le bon sens : compacts, possèdes par vous et durables.

## Planifier Les Premiers Liens

Avant d'installer vanityURLs, notez cinq liens que vous prevoyez créer en premier. Cela permet de tester si le domaine fonctionne dans de vrais exemples.

De bons premiers liens peuvent être :

```text
/github
/docs
/contact
/slides
/status
```

Si ces liens semblent naturels avec votre domaine, vous avez probablement un bon candidat.

## Garder Le Renouvellement Ennuyeux

Placez la date de renouvellement, le compte du registraire, le fournisseur DNS et le courriel de récupération dans un gestionnaire de mots de passe. Un domaine de liens courts devient une infrastructure des qu'il est imprime ou partage. Le perdre plus tard casse tous les liens déjà publies.
