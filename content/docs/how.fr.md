---
title: Tout ce que vous avez toujours voulu savoir sur la redirection d'URL (mais que vous aviez peur de demander)
linkTitle: comment ça marche
prev: /docs/admin
---

HTTP est un [protocole](https://developer.mozilla.org/fr/docs/Web/HTTP/Ressources_et_spécifications) pour récupérer des ressources telles que des documents HTML. Vous pouvez [rediriger](https://developer.mozilla.org/fr/docs/Web/HTTP/Redirections#Aperçu) au niveau du service, au sein d'une page ou via JavaScript si celui-ci est activé.

La façon la plus simple de rediriger vers une autre URL est d'utiliser une balise [HTML <meta>](https://www.w3docs.com/learn-html/html-meta-tag.html) avec le paramètre http-equiv réglé sur “refresh”. L'attribut content définit le délai avant que le navigateur ne redirige l'utilisateur vers la nouvelle page web. Pour rediriger immédiatement, définissez ce paramètre à “0” secondes pour l'attribut content.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="refresh" content="0; url='https://github.com/bhdicaire'" />
  </head>
  <body>
    <p>Vous serez bientôt redirigé vers le GitHub de BH Dicaire !</p>
  </body>
</html>
```

Cependant, les redirections HTTP s'exécutent toujours en premier, donc l'utilisation du composant serverless des pages Cloudflare est plus élégante. Je n'ai pas besoin de créer une page HTML statique par URL, que ce soit manuellement ou via un générateur de site statique tel que [Hugo](https://gohugo.io/).

## Comment ça marche?
La sauce secrète repose sur ces deux fichiers simples:
  * `build/_redirects` basé sur cette [documentation](https://developers.cloudflare.com/pages/platform/redirects)
  * `build/_headers` basé sur cette [documentation](https://developers.cloudflare.com/pages/platform/headers/)

Assurez-vous de placer tous les éléments avec des espaces réservés ou des splats à la fin de `build/_redirects`.

```bash
/mail https://outlook.office.com/ 301
/github https://github.com/bhdicaire/ 301
/github/* https://github.com/bhdicaire/:splat
```

> Les Pages utilisent la validation HTTP et doivent accéder à un point de terminaison HTTP pendant la validation. Si un autre produit Cloudflare interfère (tel qu'Access, une redirection, un Worker, etc.), la validation ne peut pas être complétée.

### En-têtes HTTPS

J'utilise le fichier `build/_headers` pour inclure les éléments suivants dans les réponses des Pages Cloudflare. N'oubliez pas de modifier les URL pour `pages.dev` et votre domaine personnalisé :

```html
https://xyz.pages.dev/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff

https://example.com/*
  X-Robots-Tag: noindex
  X-Content-Type-Options: nosniff
```
