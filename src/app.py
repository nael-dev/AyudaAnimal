import os
from dotenv import load_dotenv
from flask import Flask, send_from_directory, jsonify
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

# Carpeta del frontend construido con Vite
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../dist')



app = Flask(__name__, static_folder=static_file_dir)
jwt = JWTManager(app)
app.url_map.strict_slashes = False

# ---- Configuración CORS ----
# Permitir cualquier origen que llame a la API
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---- Configuración Base de Datos ----
db_url = os.getenv("DATABASE_URL")
if db_url:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
Migrate(app, db, compare_type=True)

# ---- Admin y comandos ----
setup_admin(app)
setup_commands(app)

# ---- Registro de endpoints ----
app.register_blueprint(api, url_prefix='/api')

# ---- Servir frontend ----
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    full_path = os.path.join(static_file_dir, path)
    if path and os.path.exists(full_path):
        return send_from_directory(static_file_dir, path)
    return send_from_directory(static_file_dir, 'index.html')


# ---- Manejo de errores ----
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ---- Sitemap opcional ----
@app.route("/sitemap")
def sitemap():
    return generate_sitemap(app)

# ---- Entrypoint para Render ----
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
