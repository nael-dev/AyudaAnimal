import logging
from logging.config import fileConfig
import os

from flask import current_app
from alembic import context
from api.models import db  # importa tus modelos aquí

# Configuración Alembic
config = context.config

# Asegurarse de que fileConfig encuentre el alembic.ini
alembic_ini_path = os.path.join(os.path.dirname(__file__), '..', 'alembic.ini')
fileConfig(alembic_ini_path)
logger = logging.getLogger('alembic.env')

# Metadata de SQLAlchemy para autogenerate
target_metadata = db.metadata

def get_engine():
    try:
        return current_app.extensions['migrate'].db.get_engine()
    except (TypeError, AttributeError):
        return current_app.extensions['migrate'].db.engine

def get_engine_url():
    try:
        return str(get_engine().url).replace('%', '%%')
    except AttributeError:
        return None

config.set_main_option('sqlalchemy.url', get_engine_url())

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = get_engine()
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
