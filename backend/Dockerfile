# Usamos una imagen oficial de Python súper ligera
FROM python:3.12-slim

# Evita archivos .pyc y fuerza a que los logs se impriman de inmediato en la consola de Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero los requerimientos para aprovechar el caché de Docker
COPY requirements.txt .

# Instalamos las librerías de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el código de nuestra carpeta backend al contenedor
COPY . .

# Exponemos el puerto 8000
EXPOSE 8000

# Comando para arrancar FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]