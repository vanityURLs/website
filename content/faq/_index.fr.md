---
title: "FAQ"
description: "FAQ source en anglais sur l'exploitation, la securisation, et la mise à jour d'une instance vanityURLs."
---

## Mises à jour

### Dois-je lancer `npm run update` ou `npm run update -- --ref main` ?

Pour une instance normale, lancez la commande simple :

```bash
npm run update
```

Elle résout le dernier tag de release stable de vanityURLs et rafraîchit les fichiers détenus par le produit depuis cette release. C'est le choix le plus sûr en production, parce que le code reçu correspond à une release publiée.

Utilisez la branche courante `main` seulement lorsque vous voulez volontairement du code non publié, habituellement sur une instance de test ou pendant la validation d'un correctif avec les mainteneurs :

```bash
npm run update -- --ref main
```

`main` peut contenir des correctifs qui ne sont pas encore dans la dernière release, mais elle peut aussi changer avant que des notes de release existent. Si vous mettez à jour depuis `main`, commitez ce choix clairement et revenez à la commande normale après la publication de la prochaine release.

Voir [Mettre à jour une instance](/fr/docs/reference/upgrading/) pour le workflow complet.
