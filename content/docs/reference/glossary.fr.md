---
aside: false
title: "Glossaire"
description: "Definitions des termes vanityURLs utilises dans la documentation, le blog et les pages publiques."
weight: 32
---

Ce glossaire definit les termes utilises dans la documentation vanityURLs. Utilisez-le lorsqu'une page mentionne un concept avant d'expliquer le fichier ou le workflow associe.

<dl>
  <dt><dfn>Application Access</dfn></dt>
  <dd>Une application Cloudflare Zero Trust qui protege certains chemins, comme <code>/_stats/*</code> et <code>/_tests/*</code>, avant que le Worker serve ces pages.</dd>

  <dt><dfn>Artefact de build</dfn></dt>
  <dd>Un fichier genere sous <code>build/</code> ou <code>src/</code>. Modifiez les fichiers source dans <code>custom/</code> ou <code>defaults/</code>, puis reconstruisez au lieu de modifier les artefacts directement.</dd>

  <dt><dfn>Cible par defaut</dfn></dt>
  <dd>La destination fallback utilisee par un lien planifie lorsqu'aucune regle horaire n'est active.</dd>

  <dt><dfn>Destination</dfn></dt>
  <dd>La longue URL vers laquelle un lien court redirige. Dans le format de lien, elle est stockee dans la colonne <code>target</code>.</dd>

  <dt><dfn>Domaine court</dfn></dt>
  <dd>Le domaine utilise pour les redirections, comme <code>v8s.link</code> ou <code>go.example.com</code>.</dd>

  <dt><dfn>Fournisseur d'identite</dfn></dt>
  <dd>Une source de connexion utilisee par Cloudflare Access, comme GitHub, Google ou un code a usage unique, pour confirmer qui essaie d'acceder a une page protegee.</dd>

  <dt><dfn>Libelle owner</dfn></dt>
  <dd>Une courte valeur interne dans <code>v8s-links.txt</code> qui identifie la personne ou l'equipe responsable d'un lien.</dd>

  <dt><dfn>Lien planifie</dfn></dt>
  <dd>Un lien court dont la destination peut changer selon le jour, la fenetre horaire et le fuseau horaire avec <code>custom/v8s-schedules.json</code>.</dd>

  <dt><dfn>Lien splat</dfn></dt>
  <dd>Un lien stocke comme <code>slug/*</code> qui transmet le reste du chemin dans une destination contenant <code>:splat</code>.</dd>

  <dt><dfn>Operateur</dfn></dt>
  <dd>La personne, l'equipe ou l'organisation responsable de l'instance vanityURLs, des pages publiques, des contacts de confiance et de la configuration des pages legales.</dd>

  <dt><dfn>Overlay custom</dfn></dt>
  <dd>La couche propre a l'instance sous <code>custom/</code>. Elle remplace ou etend les defaults produit sans modifier les fichiers upstream.</dd>

  <dt><dfn>Politique Access</dfn></dt>
  <dd>Une regle Cloudflare Zero Trust qui decide quelles identites peuvent atteindre une application Access protegee.</dd>

  <dt><dfn>Politique de blocage</dfn></dt>
  <dd>Les regles propres a l'instance dans <code>custom/v8s-policies.json</code> qui bloquent les domaines dangereux, mots-cles, chemins de scanner ou trafic indesirable avant la recherche de redirection.</dd>

  <dt><dfn>Registre de liens</dfn></dt>
  <dd>L'ensemble des enregistrements de liens courts utilises par vanityURLs. Les humains modifient <code>custom/v8s-links.txt</code>; le build produit le registre genere consomme par le Worker.</dd>

  <dt><dfn>Registre genere</dfn></dt>
  <dd>Le registre runtime de redirection ecrit dans <code>build/v8s.json</code> pendant le build a partir des liens, horaires, politiques et configurations.</dd>

  <dt><dfn>Route</dfn></dt>
  <dd>Le mappage Cloudflare Workers qui envoie les requetes pour votre domaine court vers le Worker vanityURLs.</dd>

  <dt><dfn>Runtime</dfn></dt>
  <dd>Le Worker Cloudflare et les assets statiques qui servent les redirections et les pages apres le build et le deploiement.</dd>

  <dt><dfn>Slug</dfn></dt>
  <dd>Le chemin apres votre domaine court. Dans <code>https://v8s.link/docs</code>, le slug est <code>docs</code>.</dd>

  <dt><dfn>Slug aleatoire</dfn></dt>
  <dd>Un slug genere par <code>lnk</code> lorsque vous fournissez une destination sans choisir vous-meme le chemin court.</dd>

  <dt><dfn>Tag</dfn></dt>
  <dd>Un libelle separe par virgules sur une ligne de lien, utilise pour grouper les liens, decrire l'intention ou choisir des longueurs de slugs aleatoires propres aux tags.</dd>

  <dt><dfn>Worker</dfn></dt>
  <dd>L'application Cloudflare Workers qui execute le redirecteur vanityURLs.</dd>
</dl>
