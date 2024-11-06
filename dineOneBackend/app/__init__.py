from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os
from app.config.firebase_config import initialize_firebase
from celery import Celery

# Load environment variables from .env file
load_dotenv()

db = SQLAlchemy()
celery = Celery(
    'app',
    broker=os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0'),
    backend=os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')
)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize celery
    celery.conf.update(app.config)

    db.init_app(app)

    initialize_firebase()

    with app.app_context():
        from app.api.routes import api_bp
        app.register_blueprint(api_bp)

        db.create_all()

    CORS(app, resources={r"/*": {"origins": "*"}})

    return app

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    SQLALCHEMY_DATABASE_URI = os.getenv('SUPABASE_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/0')

    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("The SUPABASE_DATABASE_URI environment variable is not set.")