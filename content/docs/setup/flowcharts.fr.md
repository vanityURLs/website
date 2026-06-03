---
title: "Flux de configuration"
description: "Cartographier les groupes de questions de npm run setup et le chemin heureux."
weight: 30
aside: false
---

`npm run setup` s'exécute de façon interactive. Il pose des questions groupées, déduit certains défauts des réponses précédentes, puis écrit seulement les fichiers propres à l'instance selon les options choisies.

Utilisez cette page pour comprendre le flux de l'installateur avant de le lancer, ou pour améliorer un groupe de questions sans deviner le comportement des prompts voisins.

## Chemin heureux

Le chemin heureux garde les zones optionnelles désactivées pendant la première configuration. Il crée une instance simple, écrit les fichiers de base et lance la vérification.

{{< mermaid >}}
flowchart TD
A["Lancer<br/>npm run setup"] --> C["Questions de base<br/>de l'instance"]
C --> A0{"Configurer les analytics<br/>maintenant?"}
A0 -->|"Non"| I["Access, langues<br/>et fuseau horaire"]
I --> L{"Configurer juridiction<br/>et pages liées?"}
L -->|"Non"| E{"Réviser les emails<br/>de contact publics?"}
E -->|"Oui"| T["Contacts Trust, Safety<br/>et sécurité"]
E -->|"Non"| T
T --> B{"Configurer<br/>la marque?"}
B -->|"Non"| W["Écrire les fichiers<br/>de l'instance"]
W --> V["Exécuter npm run check"]
V --> F["Afficher les<br/>prochaines étapes"]
{{< /mermaid >}}

## Instance de base

Les questions de base identifient le service de liens courts et préparent des valeurs utilisées par les groupes suivants.

{{< mermaid >}}
flowchart LR
A["Questions de base<br/>de l'instance"] --> D["Domaine court"]
D --> W["Nom du Worker"]
W --> O["Libellé propriétaire"]
O --> S["Écrire 3 pour la longueur<br/>de slug aléatoire<br/>si absente"]
{{< /mermaid >}}

L'installateur ne demande pas la longueur des slugs aléatoires. Les valeurs `links.random_slug_length` existantes sont conservées; les valeurs absentes sont écrites à `3`.

## Analytics

Les analytics commencent par une décision, pas par un choix de fournisseur obligatoire. `Non` reste sur le chemin heureux.

{{< mermaid >}}
flowchart TD
A{"Configurer les analytics<br/>maintenant?"}
A -->|"Non"| N["Utiliser le défaut<br/>analytics désactivé"]
A -->|"Oui"| P["Fournisseur analytics"]
P --> O["Divulgation analytics<br/>opérateur"]
O --> R["Rétention analytics<br/>opérateur"]
N --> C["Continuer<br/>la configuration"]
R --> C
{{< /mermaid >}}

Utilisez [Analytics](/fr/docs/customize/analytics/) pendant la personnalisation lorsque vous êtes prêt à choisir les fournisseurs et le texte de rétention.

## Access et localisation

Ces questions supportent les pages opérationnelles protégées, les variantes de langue générées et les horodatages des liens planifiés.

{{< mermaid >}}
flowchart LR
A["Domaine d'équipe<br/>Cloudflare Access"] --> L["Langues<br/>supportées"]
L --> T["Fuseau horaire<br/>opérateur"]
T --> N["Suite:<br/>décision juridiction"]
{{< /mermaid >}}

Le fuseau horaire doit être un [nom de fuseau IANA](/fr/docs/reference/timezones/), comme `America/Toronto`.

## Juridiction et contacts

Les pages légales peuvent rester désactivées pendant la première configuration. L'installateur demande tout de même le nom légal de l'opérateur et les contacts publics de signalement afin que les pages générées aient des défauts responsables.

{{< mermaid >}}
flowchart TD
A{"Configurer juridiction<br/>et pages liées?"}
A -->|"Non"| N["Nom légal<br/>seulement"]
A -->|"Oui"| J["Juridiction"]
J --> G["Droit applicable"]
G --> P["Contacts opérateur<br/>et confidentialité"]
N --> E{"Réviser les emails<br/>de contact publics?"}
P --> E
E -->|"Oui"| D["Domaine opérateur<br/>pour les emails"]
E -->|"Non"| C["Utiliser les contacts<br/>existants ou défauts"]
D --> T["Contact Trust & Safety"]
C --> T
T --> R["Délai de réponse"]
R --> S["Contact sécurité"]
S --> U["Date de dernière<br/>mise à jour"]
{{< /mermaid >}}

Utilisez [Juridiction](/fr/docs/customize/jurisdiction/) lorsque vous êtes prêt à activer et ajuster les pages légales publiques.

## Marque

La marque peut rester désactivée pendant la première configuration. Si vous la configurez, les couleurs du logo texte sont indépendantes de la copie complète des pages publiques vers `custom/public`.

{{< mermaid >}}
flowchart TD
A{"Configurer<br/>la marque?"}
A -->|"Non"| D["Utiliser les défauts<br/>de defaults/public"]
A -->|"Oui"| S{"Ajouter une ligne<br/>de slogan?"}
S -->|"Oui"| L["Slogan de marque<br/>par langue"]
S -->|"Non"| N["Aucun slogan"]
L --> W["Logo texte:<br/>portion première couleur"]
N --> W
W --> G["Logo texte:<br/>portion couleur accent"]
G --> P{"Avancé:<br/>copier toutes les pages<br/>par défaut vers custom/public?"}
P -->|"Non"| D
P -->|"Oui"| C["Copier defaults/public<br/>pour modifier le HTML"]
{{< /mermaid >}}

Choisissez la copie avancée seulement lorsque vous voulez modifier manuellement les pages HTML publiques.

## Écriture et vérification

Le dernier groupe écrit les fichiers propres à l'instance et vérifie le résultat.

{{< mermaid >}}
flowchart TD
A["Réponses de setup<br/>résolues"] --> L["custom/v8s-links.txt<br/>créé si absent"]
L --> C["custom/v8s-site-config.json<br/>mis à jour"]
C --> W["wrangler.toml<br/>mis à jour"]
W --> V{"Vérification<br/>activée?"}
V -->|"Oui"| R["Exécuter npm run check"]
V -->|"Non ou dry-run"| N["Afficher les<br/>prochaines étapes"]
R --> N
{{< /mermaid >}}
