# Heart Disease Prediction App

This project now contains a React frontend for a heart-disease risk prediction app connected to the Flask API in `app.py`.

## What changed
- Replaced the old example flight-price UI with a heart-disease risk form.
- Connected the form to the Flask endpoint `/predict_heart_disease`.
- Added the `axios` dependency for API requests.

## Run locally
1. Start the Flask API:
   python app.py
2. In another terminal, start the React app:
   npm run dev

The frontend will send patient details to the backend and display the predicted status and risk probability.
