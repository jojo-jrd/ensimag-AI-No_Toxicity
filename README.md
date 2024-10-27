# No Toxicity Extension

## Prérequis

Assurez-vous d'avoir `npm` installé sur votre machine.

## Installation

1. **Installer les dépendances :**

   ```sh
   npm install
   ```

2. **Installer les dépendances de développement :**
    ```sh
    npm install --save-dev webpack webpack-cli
    ```

## Génération du Bundle
Pour compiler toutes les librairies en un seul fichier bundle, utilisez Webpack :

    npx webpack
    

## Utilisation
Après avoir généré le bundle, vous pouvez charger l'extension dans votre navigateur en mode développeur et commencer à l'utiliser pour analyser les textes toxiques.