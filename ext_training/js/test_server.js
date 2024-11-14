// Importer axios
// TODO REMOVE AND USE FETCH
const axios = require('axios');

// URL de l'API Flask
const BASE_URL = 'https://JulianGmz.pythonanywhere.com';

// Fonction pour tester la prédiction
async function testPrediction() {
    try {
        const comments = [
            "You are an amazing person!",
            "F*** you, idiot!",
            "I hope you have a great day!",
            "Go kill yourself.",
            "What a wonderful world!",
            "You're so dumb.",
            "Have a nice day!",
            "Shut up, loser!",
            "I respect your opinion.",
            "Nobody likes you."
        ];

        // Envoyer une requête POST à l'API Flask
        const response = await axios.post(`${BASE_URL}/predict`, { comments });
        
        // Afficher la réponse
        console.log('Prediction response:', response.data);
    } catch (error) {
        console.error('Error during prediction:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

// Fonction principale pour exécuter les tests
(async function main() {
    console.log('Testing predictions...');
    await testPrediction();
})();
