---
aside: false
title: "Pied de page et pages"
description: "Comprendre les réponses de setup utilisées pour générer les liens de pied de page, confidentialité, conditions, Trust & Safety, sécurité et security.txt."
weight: 60
aliases:
  - /docs/footer-pages/
  - /docs/legal-trust-pages/

---

vanityURLs peut publier des liens de pied de page et des pages publiques depuis les valeurs opérateur stockées dans `custom/v8s-site-config.json`. Ces pages font partie de la posture publique d'un domaine de liens courts : elles indiquent aux visiteurs, signalants, registraires et chercheurs en sécurité qui exploite le redirecteur et comment joindre le bon contact.

Utilisez cette page pour comprendre quels fichiers sont generes, quels liens apparaissent dans le pied de page, et ou surcharger les pages lorsque le contenu genere ne suffit pas. Utilisez [Juridiction](/fr/docs/customize/jurisdiction/) lorsque vous decidez l'operateur, la juridiction, le droit applicable et les contacts de confiance.

## Différer ou configurer maintenant

L'installateur demande s'il faut configurer les pages confidentialité, conditions et sécurité maintenant. Pour le Quickstart, `N` convient.

Lorsque vous différez les pages légales complètes :

- Trust & Safety est quand même déployé pour que les gens puissent signaler un abus
- `/.well-known/security.txt` est quand même déployé lorsque le contact sécurité est configuré
- Confidentialité, conditions et la page sécurité autonome sont ignorées jusqu'à leur configuration

Choisissez `Y` lorsque vous êtes prêt à publier le texte de confidentialité, conditions et sécurité pour l'opérateur de l'instance.

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

## Liens de pied de page

Les pages publiques par défaut incluent des liens de pied de page vers les pages de politique qui existent pour la langue courante. Lorsque les pages confidentialité et conditions sont configurées, le pied de page est un endroit naturel pour ajouter une phrase courte, par exemple :

```text
En continuant, vous acceptez les Conditions, incluant l'avis de confidentialité.
```

Si vanityURLs ajoute ce comportement généré, le texte devrait seulement s'afficher lorsque les deux destinations existent. Les mots `Conditions` et `avis de confidentialité` devraient pointer vers les pages générées ou custom de la langue courante.

## Pages publiques custom

Remplacez les pages generees seulement lorsque vous avez besoin de HTML completement custom. Utilisez ces chemins :

| Page | Fichier custom |
| --- | --- |
| Confidentialite | `custom/public/privacy.html` |
| Conditions | `custom/public/terms.html` |
| Trust & Safety | `custom/public/abuse.html` |
| Securite | `custom/public/security.html` |

Les pages anglaises ont aussi des alias sans extension comme `/privacy`, `/terms`, `/trust-safety`, et `/security`. Les pages localisees utilisent le repertoire de langue, par exemple `custom/public/fr/privacy.html`.
