import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from tensorflow.keras.models import load_model
import json
import io

model = load_model('../model/model.h5', compile=False)
print("Modèle chargé avec succès.")
model.compile()

print("Chargement du tokenizer...")
with io.open('../model/tokenizer.json', 'r', encoding='utf-8') as f:
    tokenizer_data = json.load(f)
    tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_data)
print("Tokenizer chargé avec succès.")

# Charger les fichiers CSV
test_data = pd.read_csv('../csv/test.csv')
expected_data = pd.read_csv('../csv/test_labels.csv')

# Prétraitement des commentaires
def preprocess_comments(comments):
    # Tokenisation et padding avec le tokenizer sauvegardé
    sequences = tokenizer.texts_to_sequences(comments)
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, maxlen=200)  # Ajuster ici
    return padded_sequences

# Filtrer les lignes dont les résultats attendus ne sont pas -1
valid_rows = ~(expected_data.iloc[:, 1:] == -1).all(axis=1)
filtered_test_data = test_data[valid_rows].reset_index(drop=True)
filtered_expected_data = expected_data[valid_rows].reset_index(drop=True)

# Prétraiter les commentaires filtrés
filtered_comments = filtered_test_data['comment_text'].astype(str)
filtered_padded_comments = preprocess_comments(filtered_comments)

# Faire des prédictions sur les données filtrées
predictions = model.predict(filtered_padded_comments)
binary_predictions = (predictions > 0.5).astype(int).flatten()  # Convertir en 0/1

# Interpréter les réponses attendues
def process_expected(expected):
    expected = expected.iloc[:, 1:]  # Ignorer la colonne ID
    is_toxic = (expected == 1).any(axis=1).astype(int)
    return is_toxic

expected_toxic = process_expected(filtered_expected_data)

# Calculer les métriques
accuracy = accuracy_score(expected_toxic, binary_predictions)
precision = precision_score(expected_toxic, binary_predictions)
recall = recall_score(expected_toxic, binary_predictions)
f1 = f1_score(expected_toxic, binary_predictions)

# Afficher les résultats
print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1 Score: {f1:.4f}")
