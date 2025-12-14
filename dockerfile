FROM node:18-alpine AS builder
WORKDIR /app

# Copiar package.json y lockfile
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# ✅ Generar Prisma Client ANTES del build
RUN npx prisma generate

# ✅ Build normal (NO standalone)
RUN npm run build

# --- Runtime ---
FROM node:18-alpine AS runner
WORKDIR /app

# Copiar todo desde builder
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]
