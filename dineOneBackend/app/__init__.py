from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS  # Add this import
from dotenv import load_dotenv
import os
from app.config.firebase_config import initialize_firebase
# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    # Initialize Firebase
    initialize_firebase()

    with app.app_context():
        from app.api.routes import api_bp
        app.register_blueprint(api_bp)

        db.create_all()

    # Move CORS setup here
    CORS(app, resources={r"/*": {"origins": "*"}})

    return app

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    CLOVER_API_KEY = os.getenv('CLOVER_API_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('SUPABASE_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("The SUPABASE_DATABASE_URI environment variable is not set.")