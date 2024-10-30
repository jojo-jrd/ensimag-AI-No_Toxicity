# No Toxicity Extension

## Prérequis

Assurez-vous d'avoir `npm` installé sur votre machine.

## Installation

1. **Installer les dépendances :**

   ```sh
   npm install
   ```

2. **Build la solution :**
    ###  Chrome:
        npm run build:chrome
        
    ### Firefox:
        npm run build:firefox

## Utilisation
Après avoir généré la solution, vous pouvez charger l'extension dans votre navigateur en mode développeur et commencer à l'utiliser pour analyser les textes toxiques.

### Chrome:
1. Ouvrez chrome://extensions/ dans votre navigateur Chrome.
2. Activez le mode développeur en haut à droite.
3. Cliquez sur "Charger l'extension non empaquetée" et sélectionnez le dossier contenant votre extension.

### Firefox:

1. Ouvrez about:debugging#/runtime/this-firefox dans votre navigateur Firefox.
2. Cliquez sur "Charger Add-on Temporaire" et sélectionnez le dossier contenant votre extension.