---
title: "Dites adieu aux raccourcisseurs d'URL tiers : voici VanityURLs"
date: 2024-08-16
author: "Félix Léger"
description: "Les raccourcisseurs d'URL tiers laissent tomber leurs utilisateurs. vanityURLs vous redonne le contrôle de vos liens."
tags: ["release", "guide"]
featured: true
translationKey: "introducing-v8s"
---

Pendant des années, des services comme bit.ly, goo.gl et tinyurl ont été les outils de référence pour partager des liens compacts. Ces services étaient gratuits et pratiques — mais le paysage est en train de changer, et pas pour le mieux.

## Le problème avec les services tiers

En janvier 2024, Bitly — le raccourcisseur de liens leader depuis 2008 — a introduit un changement majeur : les comptes créés après 2018 ont été soudainement limités à **10 liens par mois**. Pour ceux qui s'appuyaient sur la limite précédente de 10 000 liens gratuits par mois, c'était un coup dur.

Goo.gl de Google a été déprécié en 2019, et en juillet 2024, Google a annoncé que tous les liens goo.gl cesseront de fonctionner le **25 août 2025**. Une partie des liens sur internet pourrait se rompre du jour au lendemain.

Ces changements mettent en lumière un problème fondamental : nous avons fait confiance à des services gratuits de fournisseurs tiers qui n'ont aucune obligation de fournir des solutions fiables à long terme.

## Présentation de VanityURLs : votre propre service de raccourcissement

Voici **VanityURLs** — aussi connu sous le nom de **v8s** — un raccourcisseur d'URL open source qui vous donne le contrôle. Avec v8s, vous ne dépendez d'aucun fournisseur tiers. Vos liens vous appartiennent, hébergés sur votre propre domaine.

1. **Achetez un domaine** — n'importe quel domaine court que vous souhaitez
2. **Hébergez un fichier de redirection** — un fichier texte dans un dépôt GitHub
3. **Connectez via Cloudflare Pages** — une plateforme serverless gratuite

v8s n'est *pas* un nouveau vendeur qui hébergera vos liens. C'est un ensemble d'instructions pour combiner votre propre domaine, une liste de redirections, et Cloudflare Pages. **Vos liens vous appartiennent toujours.**

## Pourquoi VanityURLs ?

La réponse est simple : **contrôle et fiabilité**. v8s garantit que vos liens restent intacts et fonctionnels, quels que soient les changements dans le monde des services tiers. Vous possédez votre domaine. Vous possédez votre fichier de redirection. Vous possédez vos liens.

[Lire le guide d'installation →](/fr/docs/getting-started/)
