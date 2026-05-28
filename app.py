from flask import Flask, request, jsonify
import pickle
from pathlib import Path
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

MODEL_PATH = Path('model_log.pkl')
SCALER_PATH = Path('scaler.pkl')

scaler = StandardScaler()
logreg_model = None

# Load the pre-trained Logistic Regression model if it is available.
if MODEL_PATH.exists():
    with MODEL_PATH.open('rb') as model_file:
        logreg_model = pickle.load(model_file)

if SCALER_PATH.exists():
    with SCALER_PATH.open('rb') as scaler_file:
        scaler = pickle.load(scaler_file)

# Load the scaler (assuming it was also saved, or re-initialize and fit if data is available)
# For simplicity, assuming `scaler` is still in memory from previous execution.
# If not, you would need to save and load it like the model:
# scaler = pickle.load(open('scaler.pkl', 'rb')) 
# (You would need to add `pickle.dump(scaler, open('scaler.pkl', 'wb' ))` after fitting it earlier)

# Define numerical columns for scaling
num_cols_api = ['Age', 'BP', 'Cholesterol', 'Max HR', 'ST depression']

def _fallback_probability(data):
    age = float(data.get('Age', 0) or 0)
    bp = float(data.get('BP', 0) or 0)
    cholesterol = float(data.get('Cholesterol', 0) or 0)
    max_hr = float(data.get('Max HR', 0) or 0)
    st_depression = float(data.get('ST depression', 0) or 0)

    sex = float(data.get('Sex', 0) or 0)
    chest_pain = float(data.get("Chest pain type", 0) or 0)
    fbs = float(data.get('FBS over 120', 0) or 0)
    ekg = float(data.get('EKG results', 0) or 0)
    angina = float(data.get('Exercise angina', 0) or 0)

    score = 0.0
    score += age / 100.0
    score += bp / 200.0
    score += cholesterol / 400.0
    score += (200 - max_hr) / 200.0
    score += st_depression / 4.0
    score += sex * 0.10
    score += chest_pain * 0.08
    score += fbs * 0.10
    score += ekg * 0.08
    score += angina * 0.12

    risk_probability = min(0.95, max(0.02, score / 4.0))
    status = 'High Risk' if risk_probability >= 0.55 else 'Low Risk'

    return risk_probability, status


@app.route('/predict_heart_disease', methods=['POST'])
def predict_heart_disease_api():
    data = request.json or {}
    try:
        feature_order = [
            'Age', 'Sex', 'Chest pain type', 'BP', 'Cholesterol',
            'FBS over 120', 'EKG results', 'Max HR', 'Exercise angina',
            'ST depression', 'Slope of ST', 'Number of vessels fluro', 'Thallium'
        ]

        input_df = pd.DataFrame([data])
        input_df = input_df[feature_order]

        if logreg_model is not None:
            input_df[num_cols_api] = scaler.transform(input_df[num_cols_api])
            risk_probability = float(logreg_model.predict_proba(input_df)[0][1])
            binary_prediction = int(logreg_model.predict(input_df)[0])
            status = 'High Risk' if binary_prediction == 1 else 'Low Risk'
        else:
            risk_probability, status = _fallback_probability(data)

        return jsonify({
            'Status': status,
            'Risk probability': f"{risk_probability * 100:.2f}%",
            'mode': 'fallback' if logreg_model is None else 'model'
        })
    except KeyError as e:
        return jsonify({'error': f'Missing data for: {e}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # To run this Flask app in Colab, you'd typically use ngrok or similar.
    # For local testing, you can run this cell and access http://127.0.0.1:5000/predict_heart_disease
    app.run(debug=True, use_reloader=False) # use_reloader=False prevents double execution in some environments