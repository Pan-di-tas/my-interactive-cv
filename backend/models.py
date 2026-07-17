from sqlalchemy import Column, Integer, String, Text, ARRAY
from database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    about = Column(Text, nullable=False)
    # En PostgreSQL podemos usar campos tipo ARRAY de texto nativamente para listas
    skills = Column(ARRAY(String), nullable=False)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    tech_stack = Column(ARRAY(String), nullable=False)
    link = Column(String, nullable=True)

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String, nullable=False)
    company = Column(String, nullable=False)
    period = Column(String, nullable=False)
    description = Column(ARRAY(String), nullable=False)