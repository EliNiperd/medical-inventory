# 📚 Nombre de tu Proyecto

Web App for medical inventory with use openFDA api and IA.

[![Licencia: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Deployed on VPS](https://img.shields.io/badge/Deployed-VPS-success)](https://eliconacento.com)

## 🚀 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Estilos**: TailwindCSS
- **Autenticación**: NextAuth.js
- **Despliegue**: Servidor VPS (Ubuntu) + dominio [eliconacento.com](https://eliconacento.com)

## ⚙️ Requisitos

- Node.js >= 18.x
- PostgreSQL >= 14
- npm (o pnpm/yarn)

## 🛠️ Instalación Local

```bash
git clone https://github.com/EliNiperd/medical-inventory.git
cd tu-proyecto
npm install
cp .env.example .env.local
# → Edita .env.local con tus credenciales locales
npm prisma migrate dev --name init
npm dev