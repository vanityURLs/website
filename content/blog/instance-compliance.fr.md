---
title: Conformite d'une instance
date: 2026-05-15
author: "Benoit H. Dicaire"
description: ""
tags: ["roadmap", "opérations"]
draft: true
---

> J'ai construit un raccourcisseur d'URL open source, disponible sur https://www.VanityURLS.link, https://github.com/vanityURLs/code et https://github.com/vanityURLs/website.

Par exemple, le redirecteur officiel d'exemple est a https://vanityurls.link et mon instance personnelle a dicai.re

Je copierai un zip des deux dépôts publics pour que vous ayez le contexte.

L'utilisateur choisirà un domaine court disponible sur le marche, copiera le dépôt Git localement, executerà l'installation, créerà un Worker dans son compte Cloudflare et le deploiera sur Internet.

C'est son instance de la solution open source, et il est responsable d'un comportement ethique. Comme lorsqu'on construit un site web avec Hugo. Ce n'est qu'un outil.

Nous ne savons pas ou les utilisateurs sont situes, ni leur juridiction, ni les lois nationales incluant la vie privée. Nous ne savons pas si leur redirecteur sert à un usage personnel, sans but lucratif ou commercial.

Quelles declarations ou pages, incluant le contenu, sont requises sur leur instance de redirecteur pour agir de bonne foi sans éténdre excessivement leur responsabilité?

Actuellement, il semble que les pages Confidentialite, Conditions, Abus et Sécurité puissent fonctionner, même si c'est seulement base sur l'intuition, et certains contenus peuvent probablement être consolides sur une seule page.

## Donnees Visiteur Worker Et Chemins Analytics

Gardez Confidentialite et Conditions séparées. Elles font deux travaux juridiques différents : Confidentialite est une divulgation sous les régimes de protection des données ([PIPEDA](https://laws-lois.justice.gc.ca/eng/acts/P-8.6/), [Loi 25](https://www.quebec.ca/gouvernement/ministere/cybersecurite-numerique/publications/loi-modernisant-dispositions-legislatives-protection-renseignements-personnels), [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj), CCPA), Conditions est un contrat unilatéral qui limite la responsabilité et réserve le droit de l'opérateur de désactiver des liens. Les melanger affaiblit les deux, et les outils qui scannent les domaines pour la conformité, comme les registraires qui appliquent leur AUP, cherchent les pages nommees. Abus et Sécurité peuvent raisonnablement fusionner dans une page "Report" ou "Trust & Safety" si le déployéeur veut consolider; ce sont deux canaux de signalement entrant avec des sevérités différentes. La seule raison de garder `/security` comme URL séparée est que `security.txt` y pointe déjà via le champ `Policy:`, et que les scanners de style CERT s'attendent à un chemin stable. Donc ma recommandation : garder les quatre pour toute instance publique, et permettre un bundle `/legal` avec ancres `#privacy`, `#terms`, `#abuse`, `#security` comme mode documente pour les déploiements personnels ou non commerciaux.

Ce dont chaque page a besoin pour être de bonne foi sans suréténdre la responsabilité. Voici le minimum que j'exigerais des déployéeurs, formule pour fonctionner entre juridictions :

Confidentialite : identité de l'opérateur et canal de contact; liste honnété de ce qui est traite (IP, UA, pays, chemin, timestamp); finalites (livraison de redirection, prévention d'abus, diagnostic); réténtion exprimee en plages, pas en promesses ("journaux d'accès Cloudflare selon leur réténtion; événements analytics jusqu'a N mois si active"); sous-traitants (Cloudflare toujours, Umami/Fathom si actifs) avec liens vers leurs politiques; transferts internationaux reconnus par une phrase sur le réseau mondial Cloudflare; paragraphe générique de droits ("lorsque la loi applicable prévoit des droits d'accès, correction ou suppression, l'opérateur répondra aux demandes verifiees") au lieu d'enumerer des articles GDPR que l'opérateur ne peut pas forcement honorer; ligne explicite "aucun cookie defini par ce redirecteur" si vrai; avis enfants ("non destiné aux enfants de moins de 13 ans"); date de dernière mise à jour. Le template actuel est proche : ajoutez réténtion, sous-traitants nommes et révision datee, et il atterrit.

Conditions : tel quel / aucune garantie; plafond explicite de responsabilité, même symbolique ("dans la mesure maximale permise par la loi"); liste d'usage acceptable (hameconnage, logiciels malveillants, contenu illégal, violation de propriété intellectuelle); droit de l'opérateur de désactiver tout lien a tout moment sans avis; clause de non-approbation (lien != approbation de la destination); placeholder de droit applicable a remplir par l'opérateur; clause de litige. Évitez les SLA, promesses de disponibilite et affirmations de conformité nommant des cadres ("GDPR-compliant") que vous n'avez pas audites.

Abus : canal de contact; ce qu'un signalement devrait contenir; categories traitees directement par l'opérateur (hameconnage, malware, copyright, diffamation) versus escalade (CSAM -> NCMEC/IWF/police locale; nommez-les pour que les signaleurs ne perdent pas de temps); fenêtre de réponse de bonne foi, jamais un SLA garanti; actions que l'opérateur peut prendre. C'est ici que le déployéeur gagne une posture de safe harbor même dans les juridictions qui n'en offrent pas formellement : un processus de retrait documente est le signal universel de bonne foi.

Sécurité : portee VDP (ce domaine + code Worker) et exclusions explicites (infrastructure Cloudflare, GitHub); contact, PGP optionnel; phrase de safe harbor ("la recherche de bonne foi dans la portee ne fera pas l'objet d'action légale"); attente de divulgation coordonnée (90 jours est standard). Miroir dans `/.well-known/security.txt` selon [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116) — vous le faites déjà.

Quelques elements qui ne sont pas des pages mais appartiennent à la même conversation. `security.txt` (livre) et `robots.txt` (livre) font partie de la surface de confiance. La Loi 25 du Quebec exige spécifiquement une personne responsable des renseignements personnels publiquement identifiee; si le déployéeur est au Quebec, ce nom ou titre appartient à la page Confidentialite. Le DSA de l'UE impose un point de contact unique et des conditions en langage clair aux services intermediaires; un déployéeur quebecois avec visiteurs europeens devrait traiter le contact Abus comme point de contact DSA. Les `noindex,nofollow` sur les templates sont une bonne hygiene defensive pour éviter que des defaults non edites polluent les moteurs de recherche.

Deux risques précis de surextension dans les templates actuels. Premierement, "The operator may disable or remove links that appear unsafe" dans les Conditions est un droit, donc correct. Mais aucune page n'inclut actuellement une clause "aucune garantie / limite de responsabilité", qui est ce qui protège financierement le déployéeur. Deuxiemêment, le template Confidentialite liste ce qui peut être traite sans nommer Cloudflare comme sous-traitant ni indiquer la réténtion; c'est assez pour un lecteur amical mais pas pour un regulateur. Les deux se corrigent en un paragraphe.

Suggestion concrété pour le projet lui-même. Envisager d'ajouter un `v8s-operator.json` ou d'éténdre `v8s-site-config.json` avec des champs requis par le build avant déploiement : `operator.legal_name`, `operator.jurisdiction`, `operator.contact_email`, `operator.privacy_contact`, `operator.last_updated`. Le build refuse de livrer si l'un est vide ou encore par défaut. Ensuite, les quatre templates se rendent depuis ces valeurs. Cela convertit "template a adapter", que les déployéeurs oublieront, en gate de déploiement. C'est le même motif que la discipline chezmoi : des defaults opinionated qui échouent bruyamment lorsqu'ils ne sont pas configures.
