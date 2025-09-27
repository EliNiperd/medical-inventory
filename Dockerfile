# Elige la imagen base que necesites, pero es importante que sea una versión completa o que puedas instalar paquetes
FROM node:18-bullseye-slim

# Instala las herramientas de compilación
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# El resto de tu Dockerfile
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]