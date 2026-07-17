import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Cargar variables del archivo .env (está en la carpeta raíz, un nivel arriba de backend)
load_dotenv(dotenv_path="../.env")

# Leemos estrictamente las variables del entorno sin ningún valor hardcodeado
USER = os.getenv("POSTGRES_USER")
PASSWORD = os.getenv("POSTGRES_PASSWORD")
HOST = os.getenv("POSTGRES_HOST")
PORT = os.getenv("POSTGRES_PORT")
DB_NAME = os.getenv("POSTGRES_DB")

# Medida de seguridad: Si falta alguna credencial crítica, detenemos la ejecución
if not all([USER, PASSWORD, HOST, PORT, DB_NAME]):
    raise ValueError(
        "🚨 Error de seguridad/configuración: Faltan variables de entorno de la base de datos. Verifica tu archivo .env"
    )

# URL de conexión limpia
DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DB_NAME}"

# Crear el motor de conexión
engine = create_engine(DATABASE_URL)

# Sesión para interactuar con la BD en los endpoints
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base de la que heredarán nuestros modelos
Base = declarative_base()

# Dependencia para inyectar la sesión en FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()