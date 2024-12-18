const browserAPI_notoxicity = typeof browser !== "undefined" ? browser : chrome;

async function sendAnalyzeIATextRequest(sentences) {
    try {
        const response = await browserAPI_notoxicity.runtime.sendMessage({
            type: 'analyzeSentences',
            sentences: sentences,
        });

        if (response && response.results) {
            return response.results; // Retourne les résultats de l'API
        } else {
            console.error("Aucune réponse valide reçue. " + response);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi du message :", error);
        return null;
    }
}

async function sendAnalyzeTextRequest(sentence, keywords) {
    try {
        const response = await browserAPI_notoxicity.runtime.sendMessage({
            type: 'analyzeText',
            sentence: sentence,
            keywords: keywords,
            threshold: 0.41
        });

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

// Fonction pour masquer un bloc
function hideBlock(block) {
    // Vérifie si le bloc a déjà été masqué
    if (block.classList.contains('processed-no-toxicity')) {
        return; // Ne masque pas à nouveau
    }

    // Marque le bloc comme traité
    block.classList.add('processed-no-toxicity');

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
    button.addEventListener('click', (ev) => {
        ev.preventDefault();
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


(async function() {
    // Récupère les options de stockage (keywords, autoMode)
    const optionsStorage = await browserAPI_notoxicity.storage.local.get(['keywords', 'autoMode']);
    const keywords = (optionsStorage.keywords || '')
        .split(',')
        .filter(keyword => keyword.length > 0);

    const autoMode = optionsStorage.autoMode;

    if (keywords.length === 0 && !autoMode) {
        console.error("Aucune application de l'extension (pas de mot clé ou le mode automatique est désactivé)");
        return;
    }

    // Sélectionne des éléments parents logiques pour regrouper le texte
    const textBlocks = document.querySelectorAll('h1,h2,h3,h4,h5,h6,pre,p,span,a,strong,li');

    // Utiliser un Set pour éviter de traiter plusieurs fois le même élément
    const processedElements = new Set();
    sentencesToAnalyze = [];
    blockMap = [];
    
    waitPromises = [];

    // Parcours chaque bloc de texte
    for (const block of textBlocks) {

        // Évite de traiter les éléments déjà traités ou les éléments imbriqués
        if (processedElements.has(block) || [...processedElements].some(el => el.contains(block))) {
            continue;
        }

        console.log("Traitement du bloc de texte:", block);
        const textContent = block.innerText;
        if (textContent) {
            const sentence = textContent.toLowerCase()
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .replace(/\s+/g, ' ')
            .trim();

            if (sentence.split(' ').length < 3) {
                continue; // Ignore les phrases trop courtes
            }

            if (autoMode) {
                sentencesToAnalyze.push(sentence);
                blockMap.push(block); // Associe le bloc à la phrase
            }

            if (keywords.length) {
                waitPromises.push(sendAnalyzeTextRequest(sentence, keywords).then(isToxic =>{
                    // Si un contenu toxique est détecté, masque le bloc de texte
                    if (isToxic) {
                        // Marque cet élément comme traité
                        processedElements.add(block);
                        hideBlock(block);
                    }
                    return  Promise.resolve();
                }).catch(err => {
                    console.error("Erreur lors de l'analyse du texte:", err);
                    return Promise.resolve();
                }));
            }
        }
    }
    if (autoMode && sentencesToAnalyze.length > 0) {
        Promise.all(waitPromises).then(async () => {
            // Get the answer for all sentences
            const iaSentenceResults = await sendAnalyzeIATextRequest(sentencesToAnalyze);
            console.log(iaSentenceResults);
            if (iaSentenceResults) {
                iaSentenceResults.forEach((result, index) => {
                    if (result?.is_toxic) {
                        const block = blockMap[index];
                        if (block && !processedElements.has(block)) {
                            processedElements.add(block);
                            hideBlock(block);
                        }
                    }
                });
            }
            waitPromises = [];
            sentencesToAnalyze = [];
            blockMap = [];
        });
    }
})();
