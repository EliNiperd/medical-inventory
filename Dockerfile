# Usa una imagen oficial de Node (no Alpine, porque better-sqlite3 compila más fácil en Debian/Ubuntu)
FROM node:20-bullseye

# Crea directorio de la app
WORKDIR /app

# Instala dependencias del sistema necesarias para compilar better-sqlite3
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    build-essential \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Construye la app Next.js
RUN npm run build

# Expone el puerto
EXPOSE 3000

# Comando de inicio
CMD ["npm", "start"]
