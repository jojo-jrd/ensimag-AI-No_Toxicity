console.log("RUnnnn....")
const browserAPI_notoxicity = typeof browser !== "undefined" ? browser : chrome;

async function sendAnalyzeTextRequest(sentence, keywords) {
    try {
        console.log("Envoi...", sentence, keywords);
        const response = await browserAPI_notoxicity.runtime.sendMessage({ type: 'analyzeText', sentence: sentence, keywords: keywords, threshold: 0.41 });
        console.log("Réponse reçue :", response);

        if (response && typeof response.isAboveThreshold === 'boolean') {
            return response.isAboveThreshold;
        } else {
            console.error("Aucune réponse valide reçue. " + response);
            return false;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        return false;
    }
}

(async function() {
    // Récupère les options de stockage (keywords, autoMode)
    const optionsStorage = await browserAPI_notoxicity.storage.local.get(['keywords', 'autoMode']);
    const keywords = (optionsStorage.keywords || '')
        .split(',')
        .filter(keyword => keyword.length > 0);

    const autoMode = optionsStorage.autoMode;

    if (keywords.length === 0) {
        console.log("Aucun mot-clé n'a été défini. Veuillez ajouter des mots-clés dans les options.");
        return;
    }

    // Sélectionne des éléments parents logiques pour regrouper le texte
    const textBlocks = document.querySelectorAll('h1,h2,h4,h5,h6,pre,p,span,a');

    // Utiliser un Set pour éviter de traiter plusieurs fois le même élément
    const processedElements = new Set();

    // Parcours chaque bloc de texte
    for (const block of textBlocks) {

        // Évite de traiter les éléments déjà traités ou les éléments imbriqués
        if (processedElements.has(block) || [...processedElements].some(el => el.contains(block))) {
            continue;
        }

        const textContent = block.innerText;
        if (textContent) {
            const sentence = textContent.toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

            if (sentence.split(' ').length < 3) {
                continue; // Ignore les phrases trop courtes
            }

            const isToxic = await sendAnalyzeTextRequest(sentence, keywords);

            // Si un contenu toxique est détecté, masque le bloc de texte
            if (isToxic) {
                // Marque cet élément comme traité
                processedElements.add(block);

                // Créer un conteneur pour envelopper le bloc de texte
                const container = document.createElement('div');
                container.classList.add('hidden-block-no-toxicity');

                // Créer un overlay semi-transparent
                const overlay = document.createElement('div');
                overlay.classList.add('hidden-overlay-no-toxicity');

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
                overlay.appendChild(button);
                overlay.appendChild(explanation);

                // Insérer l'overlay et le bloc de texte dans le conteneur
                block.parentNode.insertBefore(container, block);
                container.appendChild(block); // Place le bloc de texte dans le conteneur
                container.appendChild(overlay); // Place la superposition au-dessus
            }
        }
    }
})();
