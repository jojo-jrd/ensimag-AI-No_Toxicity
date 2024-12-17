import io
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
from flask import Flask, request, jsonify

# Flask app
app = Flask(__name__)

# Variables globales
model = None
tokenizer = None

# Fonction pour charger le modèle et le tokenizer si nécessaire
def initialize_model_and_tokenizer():
    global model, tokenizer

    if model is None or tokenizer is None:
        try:
            print("Chargement du modèle...")
            model = load_model('model.h5', compile = False)
            print("Modèle chargé avec succès.")
            model.compile()

            print("Chargement du tokenizer...")
            with io.open('tokenizer.json', 'r', encoding='utf-8') as f:
                tokenizer_data = json.load(f)
                tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_data)
            print("Tokenizer chargé avec succès.")
        except Exception as e:
            print(f"Erreur lors du chargement du modèle ou du tokenizer : {e}")
            raise e

# Route pour effectuer une prédiction
@app.route('/predict', methods=['POST'])
def predict():
    global model, tokenizer

    # Initialiser le modèle et le tokenizer si ce n'est pas fait
    try:
        initialize_model_and_tokenizer()
    except Exception as e:
        return jsonify({"error": f"Erreur lors de l'initialisation : {str(e)}"}), 500

    try:
        data = request.get_json()
        comments = data.get("comments", [])

        if not comments or not isinstance(comments, list):
            return jsonify({"error": "Paramètre 'comments' manquant ou invalide."}), 400

        # Prétraitement des commentaires
        max_len = 200
        sequences = tokenizer.texts_to_sequences(comments)
        padded_sequences = pad_sequences(sequences, maxlen=max_len)

        # Prédictions
        predictions = model.predict(padded_sequences)
        results = [
            {"toxic": bool(prediction > 0.5)}
            for comment, prediction in zip(comments, predictions)
        ]

        return jsonify(results)
    except Exception as e:
        return jsonify({"error": f"Une erreur est survenue : {str(e)}"}), 500

if __name__ == '__main__':
    app.run()

