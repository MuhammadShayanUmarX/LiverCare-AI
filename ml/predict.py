import json
import sys
from pathlib import Path

import joblib
import numpy as np


MODEL_PATH = Path(__file__).resolve().parents[1] / 'liver_disease_model.joblib'
REQUIRED_FIELDS = [
    'age',
    'gender',
    'bmi',
    'alcohol',
    'smoking',
    'geneticRisk',
    'physicalActivity',
    'diabetes',
    'hypertension',
    'liverFunctionTest'
]

_MODEL = None


def load_model():
    global _MODEL
    if _MODEL is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f'Model file not found at {MODEL_PATH}')
        _MODEL = joblib.load(MODEL_PATH)
    return _MODEL


def prepare_features(payload):
    missing = [field for field in REQUIRED_FIELDS if field not in payload]
    if missing:
        raise ValueError(f'Missing fields: {", ".join(missing)}')

    try:
        features = np.array([[
            float(payload['age']),
            float(payload['gender']),
            float(payload['bmi']),
            float(payload['alcohol']),
            float(payload['smoking']),
            float(payload['geneticRisk']),
            float(payload['physicalActivity']),
            float(payload['diabetes']),
            float(payload['hypertension']),
            float(payload['liverFunctionTest'])
        ]], dtype=float)
    except (TypeError, ValueError) as exc:
        raise ValueError('Invalid numeric value supplied') from exc

    return features


def infer(payload):
    model = load_model()
    features = prepare_features(payload)

    if hasattr(model, 'predict_proba'):
        probability = float(model.predict_proba(features)[0][1]) * 100
    else:
        prediction = model.predict(features)[0]
        if isinstance(prediction, (int, float, np.number)):
            probability = float(prediction)
            if probability <= 1:
                probability *= 100
        else:
            probability = 50.0

    probability = max(0.0, min(100.0, probability))

    if probability < 30:
        risk_level = 'low'
    elif probability < 60:
        risk_level = 'medium'
    else:
        risk_level = 'high'

    return {
        'probability': round(probability, 1),
        'riskLevel': risk_level
    }


def main():
    try:
        raw_input = sys.stdin.read()
        payload = json.loads(raw_input or '{}')
        result = infer(payload)
        print(json.dumps({'success': True, **result}))
    except Exception as exc:  # pylint: disable=broad-except
        print(json.dumps({'success': False, 'error': str(exc)}))
        sys.exit(1)


if __name__ == '__main__':
    main()

