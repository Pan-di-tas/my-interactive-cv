import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Intentar leer DATABASE_URL (la variable estándar que configuramos en Render)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 2. Si no existe DATABASE_URL, intentamos armarla con las variables sueltas de tu .env local
if not SQLALCHEMY_DATABASE_URL:
    user = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    server = os.getenv("POSTGRES_SERVER") or os.getenv("POSTGRES_HOST", "localhost")
    db = os.getenv("POSTGRES_DB")
    
    if user and password and db:
        SQLALCHEMY_DATABASE_URL = f"postgresql://{user}:{password}@{server}/{db}"
    else:
        raise ValueError("🚨 Error de seguridad/configuración: Faltan variables de entorno de la base de datos. Verifica tu archivo .env o la pestaña Environment en Render.")

# 3. Corrección vital para servidores en la nube:
# SQLAlchemy 1.4+ exige que la URL empiece con 'postgresql://', pero Render a veces genera URLs con 'postgres://'.
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()