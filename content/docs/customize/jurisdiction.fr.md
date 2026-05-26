---
aside: false
title: "Juridiction"
description: "Decider l'operateur, la juridiction, le droit applicable et les contacts de confiance utilises par les pages publiques generees de vanityURLs."
weight: 70
aliases:
  - /docs/jurisdiction/

---

vanityURLs pose quelques questions sur l'operateur afin que les pages publiques generees aient un vrai responsable, un chemin de signalement et un contexte legal. Utilisez cette page avant ou pendant `npm run setup` lorsque vous decidez quoi saisir.

Cette page n'est pas un avis juridique. Elle explique ce que les champs controlent et propose des reponses de phase 1 assez pratiques pour mettre une instance en ligne.

## Decider d'abord

Avant de configurer les pages publiques, decidez qui exploite l'instance et qui traite les signalements.

| Decision | Recommandation phase 1 | Personnalisation ulterieure |
| --- | --- | --- |
| Identite operateur | Personne, equipe, entreprise ou organisation responsable de l'instance | Aligner le texte avec l'entite qui possede le domaine et le depot |
| Juridiction | Pays, province/etat ou lieu d'exploitation | Raffiner avec une revue interne ou juridique si l'instance est organisationnelle |
| Droit applicable | Habituellement la meme valeur que la juridiction | Utiliser une valeur plus precise seulement lorsque c'est le bon contexte legal |
| Contact general | `hello@<short-domain>` | Router vers l'equipe qui possede le redirecteur |
| Contact confidentialite | `privacy@<short-domain>` | Router vers la personne ou l'equipe qui traite les questions de confidentialite |
| Contact Trust & Safety | `abuse@<short-domain>` | Router les signalements d'abus, phishing, malware, usurpation et liens dangereux |
| Contact securite | `security@<short-domain>` | Router les signalements de vulnerabilites et publier via `/.well-known/security.txt` |
| Fenetre de reponse | `5 business days` | Utiliser une attente de reponse humaine realiste, pas un SLA garanti |

Utilisez des adresses par role lorsque possible. Elles sont plus faciles a transferer lorsque la propriete change et plus faciles a reconnaitre pour les visiteurs, registraires et chercheurs.

## Questions de setup

Le Quickstart peut differer les pages confidentialite, conditions et securite autonome. Trust & Safety et `security.txt` peuvent quand meme etre publies avec un plus petit ensemble de reponses.

| Question de setup | Quand elle apparait | Ce que cela controle |
| --- | --- | --- |
| Configurer les pages confidentialite, conditions et securite maintenant? | Toujours | Determine si les pages confidentialite, conditions et securite autonome sont generees maintenant |
| Operator legal name | Toujours | Identite publique de l'operateur affichee sur les pages de confiance et legales generees |
| Trust & Safety contact | Toujours | Adresse publique pour les signalements d'abus et de liens dangereux |
| Trust & Safety response window | Toujours | Attente de bonne foi pour la revue des signalements |
| Security contact | Toujours | Adresse pour les signalements de vulnerabilites et `/.well-known/security.txt` |
| Operator jurisdiction, for example Canada | Seulement lorsque les pages legales completes sont activees | Lieu dont les lois gouvernent l'operateur ou l'instance |
| Governing law | Seulement lorsque les pages legales completes sont activees | Cadre juridique utilise par la page des conditions generee |
| Operator contact email | Seulement lorsque les pages legales completes sont activees | Adresse de contact generale du redirecteur |
| Privacy contact | Seulement lorsque les pages legales completes sont activees | Adresse pour les questions de confidentialite et de protection des donnees |
| Legal pages last updated date | Seulement lorsque les pages legales completes sont activees | Date affichee sur les pages confidentialite, conditions et securite generees |

Vous pouvez relancer `npm run setup` plus tard. L'installateur lit les valeurs existantes et les propose comme defauts, donc vous pouvez utiliser des reponses simples en phase 1 et les raffiner pendant la personnalisation.

## Juridiction et droit applicable

La juridiction est le lieu dont les lois gouvernent l'operateur ou l'instance. Pour un redirecteur personnel, c'est generalement l'endroit ou vous vivez. Pour une organisation, c'est generalement l'endroit ou l'organisation exploitante est etablie.

Le droit applicable est le cadre juridique utilise par la page des conditions. Il est souvent le meme que la juridiction. Utilisez une valeur plus precise, comme `Quebec, Canada`, seulement lorsque c'est le bon contexte legal pour l'operateur.

## Date de derniere mise a jour

La date de derniere mise a jour des pages legales est affichee sur les pages de politique generees. Utilisez `YYYY-MM-DD`.

Mettez cette date a jour lorsque le contenu publie change de maniere significative, par exemple :

- nouveau fournisseur d'analytics
- changement d'adresse de contact
- changement de juridiction ou de droit applicable
- changement materiel au texte de confidentialite, conditions, confiance ou securite

## Fenetre de reponse

La fenetre de reponse Trust & Safety est une attente de bonne foi pour la revue des signalements. Ce n'est pas un accord de niveau de service garanti.

Exemples raisonnables :

```text
5 business days
72 hours
as soon as practical
```

Evitez les promesses que vous ne pouvez pas tenir de maniere fiable. Le but est de definir une attente humaine et de montrer que les signalements d'abus ont un vrai chemin de traitement.

## Pages liees

Utilisez [Pied de page et pages](/fr/docs/customize/footer-pages/) pour les chemins de sortie generes, les liens de pied de page, les alias et les surcharges de pages custom.
