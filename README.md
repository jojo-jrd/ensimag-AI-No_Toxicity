# Extension de navigateur - IA

<img align="right" width="100" height="100" src="./icons/ensimag.svg">


## Objectif

L'objectif était de créer une extension utilisant l'Intelligence Artificielle permettant de cacher des blocs qui contenaient des mots toxiques (vulgaires, violents, suicidaires et discriminants)

## Installation

Nous pouvons l'utiliser et l'installer en mode "Debug" car il est assez complexe de la faire valider et la mettre en extension dans les addons des navigateurs.

Cet extension est multi-plateforme, elle est donc compatible entre `Firefox` et les naviagateurs sous `Chromium`.
Cependant, l'installation diverge en fonction de son navigateur d'utilisation.

### Firefox

Tout d'abord, dans ce répertoire, il faut exécuter la commande :

```sh
npm run build-firefox
```

Ensuite, rendez-vous sur le site [about:debugging](about:debugging) de Firefox, cliquez sur l'onglet `This Firefox`/`Ce Firefox` puis sur `Load Tempory Add-on...`/`Charger un module complémentaire temporaire...` et ouvrez le fichier `manifest.json` de l'extension.

### Chrome

Tout d'abord, dans ce répertoire, il faut exécuter la commande :

```sh
npm run build-chrome
```

Ensuite, rendez-vous sur le site [chrome://extensions/](chrome://extensions/) de Chrome, cliquez sur le bouton `Load unpacked` et ouvrez le dossier comportant le fichier `manifest.json` de l'extension.

## Utilisation

TODO options etc...


## Crédit

Ce projet a été réalisé dans un groupe de 4 personnes :
- LENNE Arthur
- JOSSERAND Jordan
- SOUBEYRAND Alex
- GOMEZ Julian


