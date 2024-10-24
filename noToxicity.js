const browserAPI = typeof browser !== "undefined" ? browser : chrome;

(function() {
    browserAPI.storage.sync.get(['keywords', 'autoMode'], (optionsStorage) => {
        const keywords = optionsStorage.keywords || "";
        const autoMode = optionsStorage.autoMode;
        // TODO
        
        // Récupère tous les blocs de la page
        // TODO h3 problème
        const textBlocks = document.querySelectorAll('h1,h2,h4,h5,h6,pre,p,span,a');
    
        textBlocks.forEach(block => {
            // Si le bloc possède du texte
            if (block.innerText) {
                // TODO here
                //block.style.color = '#ffaa00';
                // TODO: change the condition
                if (block.innerText.toUpperCase().includes("INSTALLATION")) {
                    // Créer un conteneur pour envelopper le bloc de texte
                    const container = document.createElement('div');
                    container.classList.add('hidden-block-no-toxicity');

                    // Créer un overlay semi-transparent
                    const overlay = document.createElement('div');
                    overlay.classList.add('hidden-overlay-no-toxicity');

                    // Créer une image en haut à droite
                    // const image = document.createElement('img');
                    // image.src = './icons/icon.png';
                    // image.alt = 'Danger icon';

                    // Créer un bouton pour révéler le contenu
                    const button = document.createElement('button');
                    button.classList.add('reveal-button-no-toxicity');
                    button.innerText = "Afficher le texte";

                    // Créer un élément pour expliquer pourquoi le texte est masqué
                    const explanation = document.createElement('div');
                    explanation.classList.add('explanation-no-toxicity');
                    explanation.innerText = "Texte masqué en raison de son contenu potentiellement inapproprié.";

                    // Ajouter un événement au bouton pour révéler le texte
                    button.addEventListener('click', () => {
                        container.classList.add('visible-no-toxicity');
                        overlay.style.display = 'none'; // Cache la superposition après le clic
                    });

                    // Insérer les éléments dans l'overlay
                    // overlay.appendChild(image);
                    overlay.appendChild(button);
                    overlay.appendChild(explanation);

                    // Insérer l'overlay et le bloc de texte dans le conteneur
                    block.parentNode.insertBefore(container, block);
                    container.appendChild(block); // Place le bloc de texte dans le conteneur
                    container.appendChild(overlay); // Place la superposition au-dessus
                }
            }
        });  
    });
})();