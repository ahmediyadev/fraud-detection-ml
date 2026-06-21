from flask import Flask
from flask_cors import CORS
from app.routes import api

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024

    app.register_blueprint(api)
    return app