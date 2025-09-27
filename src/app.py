import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Cargar variables de entorno
load_dotenv()

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist/')

app = Flask(__name__, static_folder=static_file_dir)
jwt = JWTManager(app)
app.url_map.strict_slashes = False

# ---- Configuración CORS ----
# Permitir frontend local y el frontend desplegado
frontend_urls = [
    "https://super-duper-capybara-q74x9x54gxg924jjp-3000.app.github.dev",  # local dev
    "https://ayudaanimal-1.onrender.com"  # reemplaza con tu frontend en Render
]
CORS(app, resources={r"/*": {"origins": frontend_urls}})

# ---- Configuración de Base de Datos ----
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# ---- Admin y comandos ----
setup_admin(app)
setup_commands(app)

# ---- Registro de endpoints ----
app.register_blueprint(api, url_prefix='/api')

# ---- Servir frontend ----
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Servir la aplicación Vite frontend desde dist/"""
    if path != "" and os.path.exists(os.path.join(static_file_dir, path)):
        return send_from_directory(static_file_dir, path)
    else:
        return send_from_directory(static_file_dir, 'index.html')

# ---- Manejo de errores ----
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ---- Sitemap opcional ----
@app.route("/sitemap")
def sitemap():
    return generate_sitemap(app)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
