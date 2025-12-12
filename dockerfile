# ---------- BUILD ----------
FROM node:18-alpine AS builder

# Dependencias necesarias para Sharp
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    build-base \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

# Prisma (SQLite + Postgres)
COPY prisma ./prisma
RUN npx prisma generate

RUN npm run build


# ---------- RUN ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Dependencias de Sharp en runtime
RUN apk add --no-cache \
    vips-dev \
    fftw-dev \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "start"]
