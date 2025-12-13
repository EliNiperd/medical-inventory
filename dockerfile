# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Pasar variables de entorno al build
ARG NEXTAUTH_URL
ARG NEXTAUTH_SECRET
ARG DATABASE_URL
ARG POSTGRES_URL
ARG GOOGLE_API_KEY

ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV POSTGRES_URL=$POSTGRES_URL
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

RUN npx prisma generate

RUN npm run build

# 2. Production stage
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

# Variables necesarias en runtime
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV POSTGRES_URL=$POSTGRES_URL
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

EXPOSE 3000

CMD ["npm", "start"]
