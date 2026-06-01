---
aside: false
title: "Juridiction"
description: "Decider l'opérateur, la juridiction, le droit applicable et les contacts de confiance utilisés par les pages publiques générées de vanityURLs."
weight: 30
aliases:
  - /docs/jurisdiction/
---

vanityURLs pose quelques questions sur l'opérateur afin que les pages publiques générées aient un vrai responsable, un chemin de signalement et un contexte légal. Utilisez cette page avant ou pendant `npm run setup` lorsque vous decidez quoi saisir.

Cette page n'est pas un avis juridique. Elle explique ce que les champs contrôlent et propose des réponses de phase 1 assez pratiques pour mettre une instance en ligne. Utilisez [Pied de page et pages](/fr/docs/customize/footer-pages/) lorsque vous avez besoin des chemins génères, des liens de pied de page, des alias et des surcharges de pages custom.

Pour la raison d'être des adresses courriel générées, consultez [Courriels de contact publics pour les pages générées](/fr/blog/public-contact-emails-for-generated-pages/).

{{% steps %}}

### Identifier l'opérateur

Dans `npm run setup`, répondez a **Operator légal name** avec la personne, l'équipe, l'entreprise ou l'organisation responsable de l'instance. Alignez le texte avec l'entite qui possède le domaine et le dépôt.

### Réviser les courriels de contact publics

Dans `npm run setup`, répondez a **Review public contact emails for generated pages?** avec `Y` lorsque vous voulez inspecter ou modifier les adresses courriel publiques affichées sur les pages générées et dans `/.well-known/security.txt`.

Lorsque vous les révisez, setup demande **Operator domain for contact emails**. Utilisez le domaine qui doit recevoir les adresses de contact par rôle. Laissez vide lorsque les contacts doivent utiliser le domaine court.

Si le domaine de contact opérateur est vide, setup propose des adresses par rôle sur le domaine court, par exemple `abuse@example.link`. Si vous entrez un domaine opérateur, par exemple `example.com`, setup propose plutot les adresses par rôle sur ce domaine, par exemple `abuse@example.com`.

### Definir les contacts de signalement

Si vous répondez `N`, setup conserve les valeurs publiques existantes ou derive des valeurs par défaut pratiques à partir du domaine court. Lorsque vous révisez les valeurs, utilisez des adresses par rôle lorsque possible. Elles sont plus faciles a transferer lorsque la propriété change et plus faciles a reconnaitre pour les visiteurs, registraires et chercheurs.

| Question de setup      | Recommandation phase 1    | Ce que cela contrôle                                                                                |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| Trust & Safety contact | `abuse@<short-domain>`    | Adresse publique pour les signalements d'abus, phishing, malware, usurpation et liens dangereux     |
| Security contact       | `security@<short-domain>` | Adresse pour les signalements de vulnérabilités et `/.well-known/security.txt`                      |
| Operator contact email | `hello@<short-domain>`    | Adresse de contact generale lorsque les pages légales complêtes sont activées                       |
| Privacy contact        | `privacy@<short-domain>`  | Contact confidentialité et protection des données lorsque les pages légales complêtes sont activées |

### Decider le contexte légal

Dans `npm run setup`, activez les pages légales complêtes lorsque vous êtes prêt a publier les pages confidentialité, conditions et sécurité autonome. Ces questions apparaissent seulement lorsque les pages légales complêtes sont activées :

| Question de setup             | Recommandation phase 1                           | Ce que cela contrôle                                                         |
| ----------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Operator jurisdiction         | Pays, province/état ou lieu d'exploitation       | Lieu dont les lois gouvernent l'opérateur ou l'instance                      |
| Governing law                 | Habituellement la même valeur que la juridiction | Cadre juridique utilisé par la page des conditions générée                   |
| Legal pages last updated date | Date de revue courante au format `YYYY-MM-DD`    | Date affichee sur les pages confidentialité, conditions et sécurité générées |

Pour un redirecteur personnel, la juridiction est generalement l'endroit ou vous vivez. Pour une organisation, c'est generalement l'endroit ou l'organisation exploitante est etablie. Utilisez une valeur de droit applicable plus précise, comme `Quebec, Canada`, seulement lorsque c'est le bon contexte légal pour l'opérateur.

### Definir la fenêtre de réponse

Dans `npm run setup`, répondez a **Trust & Safety response window** avec une attente de revue humaine realiste, pas un accord de niveau de service garanti.

Exemples raisonnables :

```text
5 business days
72 hours
as soon as practical
```

Les pages générées localisént les exemples intégrés courants ci-dessus. Les autres formulations personnalisées sont réutilisees telles quelles dans chaque langue générée. Choisissez donc un texte acceptable sur toutes les pages Confiance et sécurité localisées, ou remplacez les pages localisées générées par une copie personnalisée.

Évitez les promesses que vous ne pouvez pas tenir de maniere fiable. Le but est de definir une attente humaine et de montrer que les signalements d'abus ont un vrai chemin de traitement.

### Revoir lorsque les engagements publics changent

Relancez `npm run setup` lorsque le contenu publie change de maniere significative, par exemple :

- nouveau fournisseur d'analytics
- changement d'adresse de contact
- changement de juridiction ou de droit applicable
- changement matériel au texte de confidentialité, conditions, confiance ou sécurité

L'installateur lit les valeurs existantes et les propose comme défauts, donc vous pouvez utiliser des réponses simples en phase 1 et les raffiner pendant la personnalisation.

{{% /steps %}}
