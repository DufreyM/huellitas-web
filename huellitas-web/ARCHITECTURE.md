# Arquitectura del backend

El backend sigue el patrón **controller → service → repository** en todos sus módulos (`pet`, `auth`, `user`, `adoption`, `event`, `donation`). Cada capa tiene una única responsabilidad y solo conoce a la capa inmediatamente inferior.

```
Request → routes → middlewares → controller → service → repository → Prisma → PostgreSQL
```

## Capas

**`routes/*.routes.js`**
Define los endpoints HTTP de un módulo y encadena los middlewares necesarios (`protect`, `authorize`, `validate`) antes del controller. No contiene lógica.

**`middlewares/`**
- `auth.middleware.js` — `protect` verifica el JWT y adjunta `req.user`; `authorize(...roles)` rechaza con 403 si el rol de `req.user` no está permitido.
- `validate.middleware.js` — valida `req.body` contra un schema de `zod` antes de llegar al controller.
- `error.middleware.js` / `notFound.middleware.js` — manejo centralizado de errores, nunca se devuelve un stack trace crudo al cliente.

**`controllers/*.controller.js`**
Reciben el `req`/`res`, llaman al service correspondiente y arman la respuesta con `ApiResponse`. No acceden a Prisma ni contienen reglas de negocio. Todos están envueltos en `asyncHandler` para propagar errores async al middleware de errores sin try/catch repetido.

**`services/*.service.js`**
Contienen la lógica de negocio: reglas de validación que no son de forma sino de negocio (ej. las transiciones de estado válidas de una mascota en `pet.service.js`, o que un evento no puede terminar antes de empezar en `event.service.js`), y lanzan `ApiError` con el código HTTP correspondiente cuando algo no es válido. Es la única capa que orquesta llamadas al repository.

**`repositories/*.repository.js`**
Único punto de acceso a la base de datos. Cada función es una llamada directa a Prisma Client (`config/prisma.js`), sin lógica de negocio ni transformación de datos más allá de lo que necesita la propia consulta.

**`validations/*.validation.js`**
Schemas de `zod` que describen la forma esperada del `req.body` de cada endpoint. Se usan desde `validate.middleware.js`, nunca directamente desde el controller.

**`utils/`**
- `ApiError` — error con `statusCode` para errores de negocio esperables (404, 400, 401, 403, 409).
- `ApiResponse` — forma consistente de toda respuesta exitosa: `{ success, statusCode, message, data }`.
- `asyncHandler` — envuelve controllers async para que sus rechazos lleguen al middleware de errores.

## Cómo agregar un módulo nuevo

Replicando el patrón ya usado en `pet`/`event`/`donation`:

1. `repositories/<modulo>.repository.js` — funciones `get*`/`create*`/`update*`/`delete*` que llaman a `prisma.<modelo>`.
2. `services/<modulo>.service.js` — reglas de negocio, lanza `ApiError` cuando corresponde, delega el resto al repository.
3. `validations/<modulo>.validation.js` — schema de `zod` para crear (y `.partial()` para actualizar).
4. `controllers/<modulo>.controller.js` — un handler por endpoint, envuelto en `asyncHandler`, responde con `ApiResponse`.
5. `routes/<modulo>.routes.js` — define las rutas, aplica `protect`/`authorize`/`validate` según quién debe poder usarlas.
6. Registrar el router en `routes/index.js`.
7. Tests con Jest: mockear la capa inmediatamente inferior a la que se prueba (`jest.mock("../repositories/...")` para tests de service, `jest.mock("../config/prisma")` para tests de repository) — ver `pet.service.test.js` y `pet.repository.test.js` como referencia.

## Autenticación y autorización

- Los tokens JWT se firman con `{ sub: userId, role }` y se verifican en `protect`.
- Los tres roles reales de la ONG son `Superadministrador`, `Voluntario` y `Operador` (enum `UserRole` en `prisma/schema.prisma`).
- Cada módulo decide por sí mismo, en sus rutas, qué roles pueden ejecutar cada acción vía `authorize(...roles)` — no hay una tabla de permisos centralizada todavía.
