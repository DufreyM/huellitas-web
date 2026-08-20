# Huellitas de la Calle — Backend

API REST (Express + Prisma + PostgreSQL) del panel administrativo y sitio de adopciones de la ONG Huellitas de la Calle. El código del servidor vive en `src/backend/` y sigue el patrón **controller → service → repository** (ver [ARCHITECTURE.md](./ARCHITECTURE.md)).

## Requisitos previos

- Node.js 18 o superior
- Docker (para levantar PostgreSQL localmente) — o una instancia de PostgreSQL propia

## Variables de entorno

Copiá `.env.example` a `.env` y completá los valores:

```
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"
PORT_BK=3001
JWT_SECRET="una-clave-larga-y-aleatoria"
JWT_EXPIRES_IN="1d"
```

- `DATABASE_URL`: cadena de conexión a PostgreSQL usada por Prisma.
- `PORT_BK`: puerto donde escucha el servidor Express (`dev:api`).
- `JWT_SECRET` / `JWT_EXPIRES_IN`: firma y expiración de los tokens de sesión.

## Instalación y arranque

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar PostgreSQL local con Docker
docker compose up -d

# 3. Aplicar las migraciones de Prisma
npx prisma migrate deploy

# 4. (Opcional) Sembrar 20 mascotas de prueba
npx prisma db seed  # equivalente a: node prisma/seed.js

# 5. Crear el primer usuario Superadministrador
ADMIN_EMAIL=admin@huellitas.org ADMIN_PASSWORD=tu-clave node prisma/createAdmin.js

# 6. Levantar el servidor de la API en modo desarrollo
npm run dev:api
```

El servidor queda escuchando en `http://localhost:3001` (o el puerto definido en `PORT_BK`). Podés verificar que está arriba con:

```bash
curl http://localhost:3001/api/health
```

## Pruebas

```bash
npm test
```

Corre la suite de Jest (`src/backend/**/*.test.js`) sobre servicios, middlewares y validaciones — no requiere base de datos, todo el acceso a Prisma está mockeado.

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev:api` | Levanta el servidor Express con recarga automática (nodemon) |
| `npm test` | Corre la suite de Jest |
| `npx prisma migrate dev` | Crea/aplica migraciones en desarrollo |
| `npx prisma studio` | Explorador visual de la base de datos |

## Estructura del proyecto

El backend real vive en `src/backend/`; el resto del repo (`app/`, `next.config.ts`, etc.) es un proyecto Next.js separado que no está relacionado con esta API.

```
src/backend/
├── config/        # Cliente de Prisma, configuración de JWT
├── controllers/    # Reciben el request y arman la respuesta HTTP
├── services/       # Lógica de negocio y reglas de validación
├── repositories/    # Único punto de acceso a Prisma/la base de datos
├── routes/         # Definición de endpoints por módulo
├── middlewares/     # protect/authorize, manejo de errores, validación con zod
├── validations/     # Esquemas de zod por módulo
└── data/           # Datos de seed
```

Más detalle sobre el patrón en capas y cómo replicarlo para un módulo nuevo en [ARCHITECTURE.md](./ARCHITECTURE.md).
