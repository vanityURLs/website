---
aside: false
title: "Pages légales et de confiance"
description: "Comprendre les réponses de setup utilisées pour générer les pages confidentialité, conditions, Trust & Safety, sécurité et security.txt."
weight: 50

---

vanityURLs peut publier des pages légales et de confiance depuis les valeurs opérateur stockées dans `custom/v8s-site-config.json`. Ces pages font partie de la posture publique d'un domaine de liens courts : elles indiquent aux visiteurs, signalants, registraires et chercheurs en sécurité qui exploite le redirecteur et comment joindre le bon contact.

Cette page n'est pas un avis juridique. Elle explique ce que chaque question de setup contrôle afin que vous puissiez fournir des valeurs simples en phase 1, puis les raffiner plus tard avec la bonne revue interne ou juridique.

## Différer ou configurer maintenant

L'installateur demande s'il faut configurer les pages confidentialité, conditions et sécurité maintenant. Pour le Quickstart, `N` convient.

Lorsque vous différez les pages légales complètes :

- Trust & Safety est quand même déployé pour que les gens puissent signaler un abus
- `/.well-known/security.txt` est quand même déployé lorsque le contact sécurité est configuré
- Confidentialité, conditions et la page sécurité autonome sont ignorées jusqu'à leur configuration

Choisissez `Y` lorsque vous êtes prêt à publier le texte de confidentialité, conditions et sécurité pour l'opérateur de l'instance.

## Identité opérateur

| Question de setup | Ce que cela signifie |
| --- | --- |
| Operator legal name | La personne, entreprise, OBNL, équipe ou organisation responsable de l'instance |
| Operator contact email | Adresse de contact générale pour le redirecteur |
| Privacy contact | Adresse pour les questions de confidentialité et de protection des données |
| Trust & Safety contact | Adresse pour les signalements d'abus, phishing, malware, usurpation et liens dangereux |
| Security contact | Adresse pour les signalements de vulnérabilités et le contact publié dans `security.txt` |

Utilisez des adresses par rôle lorsque possible, comme `hello@`, `privacy@`, `abuse@` et `security@` sur le domaine court. Elles sont plus faciles à transférer lorsque la propriété change.

## Juridiction et droit applicable

La juridiction est le lieu dont les lois gouvernent l'opérateur ou l'instance. Pour un redirecteur personnel, c'est généralement l'endroit où vous vivez. Pour une organisation, c'est généralement l'endroit où l'organisation exploitante est établie.

Le droit applicable est le cadre juridique utilisé par la page des conditions. Il est souvent le même que la juridiction. Utilisez une valeur plus précise, comme `Québec, Canada`, seulement lorsque c'est le bon contexte légal pour l'opérateur.

Gardez la réponse de phase 1 simple. Vous pouvez relancer `npm run setup` lorsque vous êtes prêt à la raffiner.

## Date de dernière mise à jour

La date de dernière mise à jour des pages légales est affichée sur les pages de politique générées. Utilisez `YYYY-MM-DD`.

Mettez cette date à jour lorsque le contenu publié change de manière significative, par exemple :

- nouveau fournisseur d'analytics
- changement d'adresse de contact
- changement de juridiction ou de droit applicable
- changement matériel au texte de confidentialité, conditions, confiance ou sécurité

## Fenêtre de réponse Trust & Safety

La fenêtre de réponse Trust & Safety est une attente de bonne foi pour la revue des signalements. Ce n'est pas un accord de niveau de service garanti.

Exemples raisonnables :

```text
5 business days
72 hours
as soon as practical
```

Évitez les promesses que vous ne pouvez pas tenir de manière fiable. Le but est de définir une attente humaine et de montrer que les signalements d'abus ont un vrai chemin de traitement.

## Sorties générées

Ces réponses de setup alimentent les fichiers publics générés :

| Sortie | Rôle |
| --- | --- |
| `/privacy` | Avis de confidentialité pour les données traitées par le redirecteur |
| `/terms` | Conditions d'utilisation du domaine court |
| `/trust-safety` | Signalement d'abus et divulgation coordonnée des vulnérabilités |
| `/security` | Page de divulgation sécurité lorsque les pages légales complètes sont activées |
| `/.well-known/security.txt` | Contact de divulgation de vulnérabilités lisible par machine |

Si vous remplacez plus tard les pages générées par du HTML custom sous `custom/public/`, gardez les mêmes contacts et chemins publics de signalement exacts.

## Pages publiques custom

Remplacez les pages generees seulement lorsque vous avez besoin de HTML completement custom. Utilisez ces chemins :

| Page | Fichier custom |
| --- | --- |
| Confidentialite | `custom/public/privacy.html` |
| Conditions | `custom/public/terms.html` |
| Trust & Safety | `custom/public/abuse.html` |
| Securite | `custom/public/security.html` |

Les pages anglaises ont aussi des alias sans extension comme `/privacy`, `/terms`, `/trust-safety`, et `/security`. Les pages localisees utilisent le repertoire de langue, par exemple `custom/public/fr/privacy.html`.
