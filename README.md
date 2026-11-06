# ChatU API REST

Backend del ejercicio **API REST de Chat con MongoDB y Mongoose**, implementado con Node.js, Express y Mongoose. Incluye los **11 endpoints obligatorios y los 3 opcionales**, es decir, 14; también `/api/v1/health`.

## Requisitos
- Node.js 18 o superior
- MongoDB Community Server en ejecución **o** MongoDB Atlas
- VS Code y Postman (opcional: MongoDB Compass)

## Instalación y ejecución

1. Abrir esta carpeta en VS Code y abrir **Terminal > New Terminal**.
2. Ejecutar `npm install`.
3. Usar `.env` incluido en el ZIP para MongoDB local (o cambiar `MONGO_URI` por conexión Atlas). **Nunca compartir `.env` ni subirlo a GitHub**.
4. Encender el servicio MongoDB si usas instalación local; Compass no inicia el servidor.
5. Ejecutar `npm run dev`.
6. Verificar `http://localhost:3000/api/v1/health` en el navegador. Debe mostrar `{"ok":true,"data":"ChatU API activa"}`.
7. Importar `postman/ChatU.postman_collection.json` en Postman. Ejecutar las solicitudes **en orden** sobre una base de datos vacía. Las pruebas guardan automáticamente los IDs como variables de colección.

**IMPORTANTE:** los correos y los nombres de usuarios/salas son de prueba y son fijos; si repites toda la colección sobre la misma base obtendrás respuestas 409 por duplicados. Para reiniciar la demo, utiliza otra base en `MONGO_URI` o elimina manualmente los datos de prueba.

## Endpoints (prefijo `/api/v1`)
| Método | Ruta | Uso |
|---|---|---|
| GET | `/health` | Estado del servidor |
| POST | `/users` | Crear usuario |
| GET | `/users?status=online` | Listar/filtrar |
| GET | `/users/:id` | Ver usuario |
| PATCH | `/users/:id/status` | Actualizar estado (opcional) |
| POST | `/rooms` | Crear sala, `ownerId` |
| GET | `/rooms` | Salas públicas y `memberCount` |
| GET | `/rooms/:id` | Sala con miembros |
| POST | `/rooms/:id/join` | Unirse, `userId` |
| POST | `/rooms/:id/leave` | Salir, `userId` (opcional) |
| DELETE | `/rooms/:id` | Borrar sala y mensajes, `ownerId` (opcional) |
| POST | `/rooms/:id/messages` | Enviar, `senderId` y `content` |
| GET | `/rooms/:id/messages?page=1&limit=20` | Paginación |
| PUT | `/messages/:id` | Editar, `senderId` y `content` |
| DELETE | `/messages/:id` | Borrar, `senderId` |

## Ejemplos de JSON

**POST /users:** `{"username":"ana","email":"ana@ceutec.edu","status":"online"}`

**POST /rooms:** `{"name":"Programación I","description":"Sala del curso","ownerId":"ID_DE_ANA"}`

**POST /rooms/:id/join:** `{"userId":"ID_DE_BETO"}`

**POST /rooms/:id/messages:** `{"senderId":"ID_DE_BETO","content":"Hola a todos"}`

**PUT /messages/:id:** `{"senderId":"ID_DEL_AUTOR","content":"Mensaje editado"}`

**DELETE /messages/:id:** `{"senderId":"ID_DEL_AUTOR"}` (Body > raw > JSON en Postman).

## Respuestas

Éxito: `{"ok":true,"data":{...}}`. Listado paginado añade `"meta":{"page":1,"limit":20,"total":25}`. Error: `{"ok":false,"error":{"code":"NOT_MEMBER","message":"El usuario no pertenece a la sala"}}`.

Errores: 400 validación/ID, 403 permisos, 404 no encontrado, 409 duplicado, 500 interno. La edición y el borrado de mensajes solo permiten al autor indicado por `senderId` (una restricción adicional de este proyecto). **Sin JWT, `senderId` y `ownerId` son proporcionados por el cliente y no garantizan identidad: es un ejercicio académico, no una API segura para producción.**

## Verificación en Compass
Conectar a `mongodb://127.0.0.1:27017`, abrir base `chatu` y revisar `users`, `rooms`, `messages`. `room` y `sender` se almacenan como ObjectId.
