---
aside: false
title: "Pied de page et pages"
description: "Comprendre les réponses de setup utilisées pour générer les liens de pied de page, confidentialité, conditions, Trust & Safety, sécurité et security.txt."
weight: 50
aliases:
  - /docs/footer-pages/
  - /docs/légal-trust-pages/
---

vanityURLs peut publier des liens de pied de page et des pages publiques depuis les valeurs opérateur stockées dans `custom/v8s-site-config.json`. Ces pages font partie de la posture publique d'un domaine de liens courts : elles indiquent aux visiteurs, signalants, registraires et chercheurs en sécurité qui exploite le redirecteur et comment joindre le bon contact.

Utilisez cette page pour comprendre quels fichiers sont génères, quels liens apparaissent dans le pied de page, et ou surcharger les pages lorsque le contenu génère ne suffit pas. Utilisez [Juridiction](/fr/docs/customize/jurisdiction/) lorsque vous decidez l'opérateur, la juridiction, le droit applicable et les contacts de confiance.

{{% steps %}}

### Choisir de differer ou non les pages légales

Dans `npm run setup`, répondez a **Configurer les pages confidentialité, conditions et sécurité maintenant?**. Pour le Quickstart, `N` convient.

Lorsque vous differez les pages légales complêtes :

- Trust & Safety est quand même déployé pour que les gens puissent signaler un abus
- `/.well-known/security.txt` est quand même déployé lorsque le contact sécurité est configure
- Confidentialite, conditions et la page sécurité autonome sont ignorees jusqu'a leur configuration

Choisissez `Y` lorsque vous êtes prêt a publier le texte de confidentialité, conditions et sécurité pour l'opérateur de l'instance.

### Réviser les sorties générées

Dans le dépôt de votre instance, vérifiez les fichiers publics génères sous `build/` après l'execution du setup. Utilisez `custom/public/` seulement lorsque vous maintenez volontairement du HTML custom ou des assets publics.

| Sortie                      | Role                                                                           |
| --------------------------- | ------------------------------------------------------------------------------ |
| `/privacy`                  | Avis de confidentialité pour les données traitees par le redirecteur           |
| `/terms`                    | Conditions d'utilisation du domaine court                                      |
| `/trust-safety`             | Signalement d'abus et divulgation coordonnée des vulnérabilités                |
| `/security`                 | Page de divulgation sécurité lorsque les pages légales complêtes sont activées |
| `/.well-known/security.txt` | Contact de divulgation de vulnérabilités lisible par machine                   |

Si vous remplacez plus tard les pages générées par du HTML custom sous `custom/public/`, gardez les mêmes contacts et chemins publics de signalement exacts.

### Réviser les liens de pied de page

Dans les pages publiques générées ou custom, vérifiez les liens de pied de page pour la langue courante. Les pages publiques par défaut incluent des liens de pied de page vers les pages de politique qui existent pour cette langue.

Lorsque les pages confidentialité et conditions sont configurées, le pied de page est un endroit naturel pour ajouter une phrase courte, par exemple :

```text
En continuant, vous acceptez les Conditions, incluant l'avis de confidentialite.
```

Si vanityURLs ajoute ce comportement génère, le texte devrait seulement s'afficher lorsque les deux destinations existent. Les mots `Conditions` et `avis de confidentialite` devraient pointer vers les pages générées ou custom de la langue courante.

### Surcharger les pages publiques custom

Dans le dépôt de votre instance, remplacez les pages générées seulement lorsque vous avez besoin de HTML complètement custom. Utilisez ces chemins :

| Page            | Fichier custom                |
| --------------- | ----------------------------- |
| Confidentialite | `custom/public/privacy.html`  |
| Conditions      | `custom/public/terms.html`    |
| Trust & Safety  | `custom/public/abuse.html`    |
| Sécurité        | `custom/public/security.html` |

Les pages anglaises ont aussi des alias sans extension comme `/privacy`, `/terms`, `/trust-safety`, et `/security`. Les pages localisées utilisent le répertoire de langue, par exemple `custom/public/fr/privacy.html`.

{{% /steps %}}
