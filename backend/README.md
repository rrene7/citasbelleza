# Backend (Express + Postgres)

## Requisitos
- Node.js 20+
- Postgres (Neon recomendado)

## Configuración
1) Copia `.env.example` a `.env`
2) Completa `DATABASE_URL` y `JWT_SECRET`
3) Crea las tablas ejecutando `schema.sql` en tu BD

## Instalar y correr
```bash
cd backend
npm install
npm run dev
```

API base: `http://localhost:4000`

## Endpoints principales
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/salons`
- POST `/api/salons` (auth)
- GET `/api/services`
- POST `/api/services` (auth)
- GET `/api/workers`
- POST `/api/workers` (auth)
- POST `/api/bookings`
- GET `/api/bookings` (auth)
- GET `/api/availability/:workerId/:date`

## Notas
- Las rutas protegidas requieren header `Authorization: Bearer <token>`
