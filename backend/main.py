from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
import requests

# Importamos nuestra conexión y modelos de los otros archivos
from database import engine, get_db, Base
import models

# 1. MÁGIA ORM: Crea todas las tablas en PostgreSQL en este instante
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API - CV Abdiel Magaña",
    description="Backend para el currículum interactivo contenerizado conectado a PostgreSQL",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELOS DE PYDANTIC (Para validar datos en el API) ---
class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    tech_stack: List[str]
    link: Optional[str] = None
    class Config:
        from_attributes = True

class ExperienceResponse(BaseModel):
    id: int
    role: str
    company: str
    period: str
    description: List[str]
    class Config:
        from_attributes = True

class ProfileResponse(BaseModel):
    id: int
    name: str
    title: str
    location: str
    about: str
    skills: List[str]
    class Config:
        from_attributes = True

class CVDataResponse(BaseModel):
    profile: Optional[ProfileResponse]
    projects: List[ProjectResponse]
    experience: List[ExperienceResponse]

# --- SCRIPT PARA AUTO-POBLAR LA BD SI ESTÁ VACÍA ---
@app.on_event("startup")
def seed_database():
    db = next(get_db())
    if db.query(models.Profile).first():
        return

    print("BD vacía detectada. Descargando perfil, proyectos y experiencia...")
    
    # 1. Perfil Profesional (Honesto, robusto y enfocado en tus fortalezas reales)
    perfil = models.Profile(
        name="Abdiel Antonio Magaña Ayala",
        title="Estudiante de Ingeniería en Sistemas | Desarrollador de Software & Infraestructura",
        location="Mérida, Yucatán, México",
        about="Estudiante de Ingeniería en Sistemas orientado al desarrollo de software modular, administración de bases de datos relacionales (PostgreSQL) y despliegue de aplicaciones contenerizadas (Docker). Gran interés en el aprendizaje continuo de ciberseguridad, redes y buenas prácticas de documentación técnica.",
        skills=[
            "Desarrollo Full Stack", "Docker & Contenedores", "PostgreSQL / SQL",
            "Fundamentos de Ciberseguridad", "Linux / WSL", "Documentación Técnica", 
            "Python", "React", "Node.js", "FastAPI", "Git / GitHub"
        ]
    )
    db.add(perfil)

    # 2. Proyecto Destacado: FotoIdeas App
    fotoideas = models.Project(
        title="FotoIdeas App (POS System)",
        description="Sistema integral de Punto de Venta (POS) y gestión operativa. Co-desarrollador de la arquitectura backend en Node.js, frontend en React y base de datos relacional en PostgreSQL dentro de Docker. Incluye documentación técnica completa y manuales de capacitación para usuarios.",
        tech_stack=["Node.js", "React", "PostgreSQL", "Docker", "Git", "Documentación"],
        link="https://github.com/Gadiel-Sosa/fotoideas-app"
    )
    db.add(fotoideas)

    # 3. Descarga de GitHub filtrando tareas escolares
    GITHUB_USER = "Pan-di-tas" 
    
    REPOS_IGNORADOS = [
        "Examen-Final", "Arreglo", "Hash", "Pan-di-tas-patch-1",
        "Metodos-de-ordenamiento", "ADA-6-Programa-grafos", "Arbol",
        "Lista-ligada", "Metodos-de-busqueda", "intercalacion", "Shellsort",
        "Practica-2-colas", "ADA2---Colas", "PRACT1---Estruc-Pilas", 
        "Pilas_ADA_1", "pila", "pp",
        "Practica-2", "Ejemplo3SB"
    ]

    try:
        url = f"https://api.github.com/users/{GITHUB_USER}/repos?sort=updated&per_page=25"
        response = requests.get(url)
        if response.status_code == 200:
            repos = response.json()
            for repo in repos:
                nombre = repo["name"]
                if not repo["fork"] and nombre not in REPOS_IGNORADOS and nombre != GITHUB_USER:
                    desc = repo["description"]
                    if not desc:
                        if "Libreria" in nombre:
                            desc = "Librería algorítmica de alto rendimiento implementada en Python para la optimización y procesamiento de métodos de ordenamiento."
                        else:
                            desc = f"Implementación de software y desarrollo modular estructurado utilizando {repo['language'] or 'tecnologías multi-plataforma'}."
                        
                    p = models.Project(
                        title=nombre,
                        description=desc,
                        tech_stack=[repo["language"] or "Architecture", "Docker", "Git"],
                        link=repo["html_url"]
                    )
                    db.add(p)
    except Exception as e:
        print(f"Error al conectar con la API de GitHub: {e}")

    # 4. Experiencia Real & Gestión
    exp_fotoideas = models.Experience(
        role="Co-desarrollador Full Stack & Arquitectura",
        company="FotoIdeas App (Sistema POS Comercial)",
        period="2026 — Presente",
        description=[
            "Desarrollo e implementación de un sistema de Punto de Venta (POS) comercial utilizando Node.js, React y bases de datos PostgreSQL contenerizadas en Docker.",
            "Creación integral de la documentación técnica, manuales de usuario y guías estructuradas para el despliegue del sistema y la capacitación de clientes finales.",
            "Estructuración de flujos de trabajo modulares y resolución de problemas de integración entre el frontend y el backend."
        ]
    )
    
    exp_negocio = models.Experience(
        role="Propietario & Administrador General",
        company="Las Auténticas Cangreburguer",
        period="Gestión Continua",
        description=[
            "Administración integral de operaciones, control de inventarios, proveeduría y logística operativa en negocio familiar de alimentos.",
            "Diseño y maquetación digital de menús comerciales y desarrollo de estrategias de promoción local para el punto de venta.",
            "Gestión directa del servicio al cliente, control de flujos de caja y optimización de costos operativos."
        ]
    )
    
    db.add(exp_fotoideas)
    db.add(exp_negocio)
        
    db.commit()
    print("¡Base de datos populada, filtrada y realista exitosamente!")

# --- ENDPOINTS ---
@app.get("/")
def read_root():
    return {"message": "API de Abdiel en línea y conectada a PostgreSQL. Visita /docs"}

@app.get("/api/cv", response_model=CVDataResponse)
def get_cv(db: Session = Depends(get_db)):
    # Hacemos consultas SQL reales a PostgreSQL a través de SQLAlchemy
    perfil = db.query(models.Profile).first()
    proyectos = db.query(models.Project).all()
    experiencia = db.query(models.Experience).all()
    
    return {
        "profile": perfil,
        "projects": proyectos,
        "experience": experiencia
    }