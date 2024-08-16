---
title: "Dites Adieu aux Réducteurs d'URL Tiers : Présentation de VanityURLs"
date: 2024-08-16
authors:
  - name: Félix Léger
    link: https://github.com/felleg
    image: https://github.com/felleg.png
#excludeSearch: true
---

Pendant des années, les services de réduction d'URL comme bit.ly, goo.gl et tinyurl
ont été les outils de prédilection pour quiconque souhaitait raccourcir des URLs longues pour 
les partager plus facilement. Ces services ont été gratuits et pratiques, offrant
des fonctionnalités telles que des domaines personnalisés et le suivi, mais la situation 
évolue—et pas pour le mieux.

# Le Problème de la Dépendance aux Services Tiers

En janvier 2024, Bitly, le principal réducteur d'URL depuis 2008, a apporté un
changement significatif : les comptes créés après 2018 ont été soudainement limités
à la création de seulement 10 liens par mois. Pour ceux qui comptaient sur
la limite précédente de 10 000 liens gratuits par mois, ce fut un coup dur.
Ce qui était autrefois un outil utile pour les marketeurs, les blogueurs et les petites
entreprises est devenu presque inutilisable du jour au lendemain.

Mais Bitly n'est pas le seul service à décevoir ses utilisateurs. Goo.gl,
le service de réduction d'URL de Google, a été abandonné en 2019, et il a été
annoncé en juillet 2024 que tous les liens goo.gl cesseront de fonctionner le
25 août 2025. L'impact potentiel de ce changement est énorme, avec
une partie d'internet risquant de se retrouver avec des liens cassés du jour au lendemain.

Ces changements mettent en évidence un problème critique : nous avons compté sur des services gratuits de fournisseurs tiers qui, en fin de compte, n'ont aucune obligation 
de fournir des solutions fiables à long terme. Nous leur avons confié nos liens, et maintenant beaucoup en paient le prix.

# Présentation de VanityURLs : Votre Propre Service de Réduction d'URL

Voici VanityURLs—un nouveau type de réducteur d'URL qui vous donne le contrôle.
Avec VanityURLs (également connu sous le nom de **V8S**), vous n'avez plus besoin de dépendre d'un fournisseur tiers comme
Bitly ou TinyURL. Au lieu de cela, vous apportez vos liens avec vous, hébergés sur
votre propre domaine. Voici comment cela fonctionne :

1. **Achetez un Domaine :** Commencez par acheter votre propre domaine.
1. **Hébergez un fichier redirect :** Mettez en place un dépôt contenant un
   fichier de redirection avec tous vos liens raccourcis.
1. **Liez avec Cloudflare Worker :** Utilisez un Cloudflare worker pour connecter
   votre domaine à votre fichier `_redirect`.

Et c'est tout ! Vous avez maintenant un service de réduction d'URL
entièrement fonctionnel que vous contrôlez. Plus besoin de vous inquiéter
des changements de politique, de l'abandon ou des liens cassés. Avec
V8S, vos liens vous appartiennent toujours.

Pour résumer, V8S n'est *pas* un nouveau fournisseur qui hébergera
vos liens. Il s'agit plutôt d'un ensemble d'instructions pour
combiner une liste de redirections, votre domaine existant et un
service d'hébergement web de votre choix (par exemple, Cloudflare). En tout temps,
vous resterez maître de vos liens. Vous pouvez même les migrer vers un
nouveau domaine, si vous le souhaitez.

# Pourquoi VanityURLs ?

Avec tant de fournisseurs gratuits de réduction d'URL
—Bitly, Rebrandly, Dub, TinyURL, BL.INK, Zapier,
Short.io, T.ly, Cutt.ly, et plus encore—vous vous demandez peut-être pourquoi vous
devez passer à V8S. La réponse est simple : le contrôle
et la fiabilité. V8S garantit que vos liens restent
intacts et fonctionnels, quels que soient les changements dans
le monde des services tiers.

# Commencer

Configurer V8S est simple, et pour rendre cela
encore plus facile, nous fournissons des scripts pour automatiser le processus.

Ne laissez pas vos liens être victimes des caprices
des fournisseurs tiers. Prenez le contrôle avec V8S.

