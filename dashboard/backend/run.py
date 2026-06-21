from datetime import date

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return {
        "message": "Backend Fraud Detection API Running"
    }
    
@app.route("/predict", methods=["POST"])
def predict(nombre):
    return {
        "nombre": nombre
    }

if __name__ == "__main__":
    app.run(debug=True)