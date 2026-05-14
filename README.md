# Descripción

## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo `.env.example` y nombrarlo `.env` cambiar los valores de las variables de entorno
3. Instalar dependencias `npm install`
4. Levantar la base de datos `docker compose up -d`
5. Correr las migraciones `npx prisma migrate dev`
6. Correr la semilla `npm run seed`
7. Correr la app `npm run dev`

## Correr en prod

### Vercel + Prisma Postgres

- Desplegar el frontend en Vercel
- Crear una base en Prisma Postgres desde el Marketplace de Vercel
- Configurar en Vercel estas variables:
  - `DATABASE_URL`: URL `prisma://...` para runtime
  - `DIRECT_DATABASE_URL`: URL `postgresql://...` para migraciones
- Ejecutar las migraciones contra `DIRECT_DATABASE_URL`
