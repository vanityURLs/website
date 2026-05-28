---
aside: false
title: "Pied de page et pages"
description: "Comprendre les réponses de setup utilisées pour générer les liens de pied de page, confidentialité, conditions, Trust & Safety, sécurité et security.txt."
weight: 50
aliases:
  - /docs/footer-pages/
  - /docs/legal-trust-pages/

---

vanityURLs peut publier des liens de pied de page et des pages publiques depuis les valeurs opérateur stockées dans `custom/v8s-site-config.json`. Ces pages font partie de la posture publique d'un domaine de liens courts : elles indiquent aux visiteurs, signalants, registraires et chercheurs en sécurité qui exploite le redirecteur et comment joindre le bon contact.

Utilisez cette page pour comprendre quels fichiers sont generes, quels liens apparaissent dans le pied de page, et ou surcharger les pages lorsque le contenu genere ne suffit pas. Utilisez [Juridiction](/fr/docs/customize/jurisdiction/) lorsque vous decidez l'operateur, la juridiction, le droit applicable et les contacts de confiance.

{{% steps %}}

### Choisir de differer ou non les pages legales

Dans `npm run setup`, repondez a **Configurer les pages confidentialite, conditions et securite maintenant?**. Pour le Quickstart, `N` convient.

Lorsque vous differez les pages legales completes :

- Trust & Safety est quand meme deploye pour que les gens puissent signaler un abus
- `/.well-known/security.txt` est quand meme deploye lorsque le contact securite est configure
- Confidentialite, conditions et la page securite autonome sont ignorees jusqu'a leur configuration

Choisissez `Y` lorsque vous etes pret a publier le texte de confidentialite, conditions et securite pour l'operateur de l'instance.

### Reviser les sorties generees

Dans le depot de votre instance, verifiez les fichiers publics generes sous `custom/public/` ou `build/` apres l'execution du setup.

| Sortie | Role |
| --- | --- |
| `/privacy` | Avis de confidentialite pour les donnees traitees par le redirecteur |
| `/terms` | Conditions d'utilisation du domaine court |
| `/trust-safety` | Signalement d'abus et divulgation coordonnee des vulnerabilites |
| `/security` | Page de divulgation securite lorsque les pages legales completes sont activees |
| `/.well-known/security.txt` | Contact de divulgation de vulnerabilites lisible par machine |

Si vous remplacez plus tard les pages generees par du HTML custom sous `custom/public/`, gardez les memes contacts et chemins publics de signalement exacts.

### Reviser les liens de pied de page

Dans les pages publiques generees ou custom, verifiez les liens de pied de page pour la langue courante. Les pages publiques par defaut incluent des liens de pied de page vers les pages de politique qui existent pour cette langue.

Lorsque les pages confidentialite et conditions sont configurees, le pied de page est un endroit naturel pour ajouter une phrase courte, par exemple :

```text
En continuant, vous acceptez les Conditions, incluant l'avis de confidentialite.
```

Si vanityURLs ajoute ce comportement genere, le texte devrait seulement s'afficher lorsque les deux destinations existent. Les mots `Conditions` et `avis de confidentialite` devraient pointer vers les pages generees ou custom de la langue courante.

### Surcharger les pages publiques custom

Dans le depot de votre instance, remplacez les pages generees seulement lorsque vous avez besoin de HTML completement custom. Utilisez ces chemins :

| Page | Fichier custom |
| --- | --- |
| Confidentialite | `custom/public/privacy.html` |
| Conditions | `custom/public/terms.html` |
| Trust & Safety | `custom/public/abuse.html` |
| Securite | `custom/public/security.html` |

Les pages anglaises ont aussi des alias sans extension comme `/privacy`, `/terms`, `/trust-safety`, et `/security`. Les pages localisees utilisent le repertoire de langue, par exemple `custom/public/fr/privacy.html`.

{{% /steps %}}
