---
aside: false
title: "Juridiction"
description: "Decider l'operateur, la juridiction, le droit applicable et les contacts de confiance utilises par les pages publiques generees de vanityURLs."
weight: 30
aliases:
  - /docs/jurisdiction/

---

vanityURLs pose quelques questions sur l'operateur afin que les pages publiques generees aient un vrai responsable, un chemin de signalement et un contexte legal. Utilisez cette page avant ou pendant `npm run setup` lorsque vous decidez quoi saisir.

Cette page n'est pas un avis juridique. Elle explique ce que les champs controlent et propose des reponses de phase 1 assez pratiques pour mettre une instance en ligne. Utilisez [Pied de page et pages](/fr/docs/customize/footer-pages/) lorsque vous avez besoin des chemins generes, des liens de pied de page, des alias et des surcharges de pages custom.

Pour la raison d'etre des adresses courriel generees, consultez [Courriels de contact publics pour les pages générées](/fr/blog/public-contact-emails-for-generated-pages/).

{{% steps %}}

### Identifier l'operateur

Dans `npm run setup`, repondez a **Operator legal name** avec la personne, l'equipe, l'entreprise ou l'organisation responsable de l'instance. Alignez le texte avec l'entite qui possede le domaine et le depot.

### Reviser les courriels de contact publics

Dans `npm run setup`, repondez a **Review public contact emails for generated pages?** avec `Y` lorsque vous voulez inspecter ou modifier les adresses courriel publiques affichees sur les pages generees et dans `/.well-known/security.txt`.

Lorsque vous les revisez, setup demande **Operator domain for contact emails**. Utilisez le domaine qui doit recevoir les adresses de contact par role. Laissez vide lorsque les contacts doivent utiliser le domaine court.

Si le domaine de contact operateur est vide, setup propose des adresses par role sur le domaine court, par exemple `abuse@example.link`. Si vous entrez un domaine operateur, par exemple `example.com`, setup propose plutot les adresses par role sur ce domaine, par exemple `abuse@example.com`.

### Definir les contacts de signalement

Si vous repondez `N`, setup conserve les valeurs publiques existantes ou derive des valeurs par defaut pratiques a partir du domaine court. Lorsque vous revisez les valeurs, utilisez des adresses par role lorsque possible. Elles sont plus faciles a transferer lorsque la propriete change et plus faciles a reconnaitre pour les visiteurs, registraires et chercheurs.

| Question de setup | Recommandation phase 1 | Ce que cela controle |
| --- | --- | --- |
| Trust & Safety contact | `abuse@<short-domain>` | Adresse publique pour les signalements d'abus, phishing, malware, usurpation et liens dangereux |
| Security contact | `security@<short-domain>` | Adresse pour les signalements de vulnerabilites et `/.well-known/security.txt` |
| Operator contact email | `hello@<short-domain>` | Adresse de contact generale lorsque les pages legales completes sont activees |
| Privacy contact | `privacy@<short-domain>` | Contact confidentialite et protection des donnees lorsque les pages legales completes sont activees |

### Decider le contexte legal

Dans `npm run setup`, activez les pages legales completes lorsque vous etes pret a publier les pages confidentialite, conditions et securite autonome. Ces questions apparaissent seulement lorsque les pages legales completes sont activees :

| Question de setup | Recommandation phase 1 | Ce que cela controle |
| --- | --- | --- |
| Operator jurisdiction | Pays, province/etat ou lieu d'exploitation | Lieu dont les lois gouvernent l'operateur ou l'instance |
| Governing law | Habituellement la meme valeur que la juridiction | Cadre juridique utilise par la page des conditions generee |
| Legal pages last updated date | Date de revue courante au format `YYYY-MM-DD` | Date affichee sur les pages confidentialite, conditions et securite generees |

Pour un redirecteur personnel, la juridiction est generalement l'endroit ou vous vivez. Pour une organisation, c'est generalement l'endroit ou l'organisation exploitante est etablie. Utilisez une valeur de droit applicable plus precise, comme `Quebec, Canada`, seulement lorsque c'est le bon contexte legal pour l'operateur.

### Definir la fenetre de reponse

Dans `npm run setup`, repondez a **Trust & Safety response window** avec une attente de revue humaine realiste, pas un accord de niveau de service garanti.

Exemples raisonnables :

```text
5 business days
72 hours
as soon as practical
```

Evitez les promesses que vous ne pouvez pas tenir de maniere fiable. Le but est de definir une attente humaine et de montrer que les signalements d'abus ont un vrai chemin de traitement.

### Revoir lorsque les engagements publics changent

Relancez `npm run setup` lorsque le contenu publie change de maniere significative, par exemple :

- nouveau fournisseur d'analytics
- changement d'adresse de contact
- changement de juridiction ou de droit applicable
- changement materiel au texte de confidentialite, conditions, confiance ou securite

L'installateur lit les valeurs existantes et les propose comme defauts, donc vous pouvez utiliser des reponses simples en phase 1 et les raffiner pendant la personnalisation.

{{% /steps %}}
