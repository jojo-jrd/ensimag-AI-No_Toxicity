// Déclare window globalement sur chrome (sinon problème dans les bundles)
if (typeof browser === "undefined") {
    globalThis.window = globalThis.window || globalThis;
}

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

const browserAPI_serviceworker = typeof browser !== "undefined" ? browser : chrome;
let model;
let modelLoadingPromise = null;
const embeddingCache = new Map(); // Cache pour les embedding

async function loadModel() {
    if (!model) {
        if (!modelLoadingPromise) {
            modelLoadingPromise = use.load().then(loadedModel => {
                model = loadedModel;
                modelLoadingPromise = null;

                return model;
            }).catch(error => {
                modelLoadingPromise = null;
                throw error;
            });
        }
        return modelLoadingPromise;
    }
    return model;
}

async function getEmbeddings(texts) {
    await loadModel(); // Vérifie que le modèle est chargé

    const newEmbeddings = [];
    const textsToEmbed = [];

    // Vérifie le cache pour chaque texte
    for (const text of texts) {
        if (embeddingCache.has(text)) {
            newEmbeddings.push(embeddingCache.get(text));
        } else {
            textsToEmbed.push(text);
        }
    }

    // Obtenir les embeddings pour les nouveaux textes
    if (textsToEmbed.length > 0) {
        const embeddings = await model.embed(textsToEmbed);
        const embeddingsArray = embeddings.arraySync();

        // Ajouter les nouveaux embeddings au cache et à la liste des résultats
        textsToEmbed.forEach((text, index) => {
            embeddingCache.set(text, embeddingsArray[index]);
            newEmbeddings.push(embeddingsArray[index]);
        });
    }

    return newEmbeddings; // retourne un tableau 2D du vecteur
}

// Calculer la similarité cosinus entre deux vecteurs
function cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

async function analyzeText(sentence, keywords, threshold = 0.7) {
    try {
        // Obtenir les embeddings pour tous les mots en une seule fois
        //const texts = [sentence, ...keywords];
        const embeddingsA = await getEmbeddings([sentence]);
        const embeddingsB = await getEmbeddings(keywords);

        // Séparer l'embedding de la phrase et des mots-clés
        const sentenceEmbedding = embeddingsA[0];
        const keywordEmbeddings = embeddingsB;
        
        let keywordCpt = 0;
        for (const keywordEmbedding of keywordEmbeddings) {

            const similarity = cosineSimilarity(sentenceEmbedding, keywordEmbedding);
            if (similarity > threshold) {
                return true; // Retourne true dès qu'un mot dépasse le seuil
            }
            keywordCpt++;
        }
        return false; // Retourne false si aucun mot ne dépasse le seuil
    } catch (error) {
        console.error(error);
        return false;
    }
}


loadModel(); // On charge le modèle dès le début

const BASE_URL = "https://juliangmz.pythonanywhere.com";

// Fonction pour analyser un texte via l'API Flask
async function sendAIAnalyzeRequest(sentences) {
    try {
        const response = await fetch(`${BASE_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comments: sentences }),
        });

        if (response.ok) {
            const result = await response.json();
            return result; // Retourne les prédictions
        } else {
            console.error(`Erreur lors de la requête Flask: ${response.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la requête Flask:", error);
        return null;
    }
}

function handleMessage(message, sender, sendResponse) {
    if (message.type === 'analyzeText' && message.sentence && Array.isArray(message.keywords)) {        
        analyzeText(message.sentence, message.keywords, message.threshold)
            .then(result => {
                sendResponse({ isAboveThreshold: result });
            })
            .catch(error => {
                console.error(error);
                sendResponse({ isAboveThreshold: false });
            });
        return true; // Indique une réponse asynchrone à l’API
    } else if (message.type === 'analyzeSentences') {
        // Gestion de la requête pour plusieurs phrases
        sendAIAnalyzeRequest(message.sentences)
            .then((result) => {
                sendResponse({ results: result });
            })
            .catch((error) => {
                console.error(error);
                sendResponse({ results: null });
            });
        return true; // Réponse asynchrone
    }
}
browserAPI_serviceworker.runtime.onMessage.addListener(handleMessage);