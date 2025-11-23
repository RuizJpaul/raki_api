# Documentación del Proyecto `raki_api`

## Descripción

API RESTful para gestionar donaciones y postulaciones entre donadores y beneficiarios. Utiliza Node.js, Express y Sequelize con una base de datos PostgreSQL (Neon).

---

## Instalación

1. **Clona el repositorio:**
   ```sh
   git clone https://github.com/RuizJpaul/raki_api.git
   cd raki_api
   ```

2. **Instala las dependencias:**
   ```sh
   npm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env` en la raíz con el siguiente contenido (ajusta según tu base de datos):
     ```
     DB_NAME=tu_db
     DB_USER=tu_usuario
     DB_PASS=tu_password
     DB_HOST=tu_host
     DB_PORT=5432
     JWT_SECRET=tu_secreto
     PORT=4000
     ```

---

## Ejecución

- **Modo desarrollo (con nodemon):**
  ```sh
  npm run dev
  ```
- **Modo normal:**
  ```sh
  node src/app.js
  ```

---

## Estructura de Carpetas

```
src/
  app.js                // Punto de entrada de la API
  config/db.js          // Configuración de Sequelize y conexión a la DB
  controllers/          // Lógica de negocio para cada recurso
  middleware/           // Middlewares de autenticación y roles
  models/               // Definición de modelos Sequelize
  routes/               // Definición de rutas Express
public/                 // Carpeta pública (no usada en la API)
package.json            // Dependencias y scripts
.env                    // Variables de entorno (no versionado)
```

---

## Modelos Principales


## Estructura de los Modelos y Ejemplos de Payloads


### Usuario
| Campo       | Tipo    | Descripción                                 |
|-------------|---------|---------------------------------------------|
| id_usuario  | INTEGER | PK, autoincremental                         |
| username    | STRING  | Nombre de usuario (opcional)                |
| correo      | STRING  | Email único                                 |
| password    | STRING  | Contraseña (hash)                           |
| telefono    | STRING  | Teléfono (opcional)                         |
| rol         | ENUM    | "donador" o "beneficiario"                  |

**Ejemplo registro:**
```json
{
  "username": "juan",
  "correo": "juan@mail.com",
  "password": "123456",
  "telefono": "123456789",
  "rol": "donador"
}
```


### Donador
| Campo             | Tipo    | Descripción                        |
|-------------------|---------|------------------------------------|
| id_donador        | INTEGER | PK, autoincremental                |
| id_usuario        | INTEGER | FK a Usuario                       |
| nombre            | STRING  | Nombre del donador                 |
| tipo_entidad      | STRING  | Tipo de entidad                    |
| direccion         | STRING  | Dirección                          |
| ruc               | STRING  | RUC                                |
| persona_contacto  | STRING  | Nombre de contacto                 |
| telefono          | STRING  | Teléfono de contacto               |
| ciudad            | STRING  | Ciudad (opcional)                  |


### Beneficiario
| Campo                | Tipo    | Descripción                        |
|----------------------|---------|------------------------------------|
| id_beneficiario      | INTEGER | PK, autoincremental                |
| id_usuario           | INTEGER | FK a Usuario                       |
| nombre               | STRING  | Nombre del beneficiario            |
| tipo_entidad         | STRING  | Tipo de entidad                    |
| direccion            | STRING  | Dirección                          |
| capacidad_atencion   | INTEGER | Capacidad de atención              |
| persona_contacto     | STRING  | Nombre de contacto                 |
| telefono             | STRING  | Teléfono de contacto               |
| ciudad               | STRING  | Ciudad (opcional)                  |

### Donacion
| Campo            | Tipo    | Descripción                        |
|------------------|---------|------------------------------------|
| id_donacion      | INTEGER | PK, autoincremental                |
| id_donador       | INTEGER | FK a Donador                       |
| id_categoria     | INTEGER | FK a CategoriaDonacion             |
| nombre           | STRING  | Nombre de la donación              |
| descripcion      | TEXT    | Descripción                        |
| cantidad         | INTEGER | Cantidad ofrecida                  |
| fecha_vencimiento| DATE    | Fecha de vencimiento               |
| ubicacion        | STRING  | Ciudad/ubicación                   |
| estado           | ENUM    | "disponible", "entregada", "cancelada" |

**Ejemplo creación:**
```json
{
  "nombre": "Alimentos",
  "descripcion": "Cajas de arroz",
  "cantidad": 10,
  "fecha_vencimiento": "2025-12-31",
  "ubicacion": "Lima",
  "id_categoria": 1
}
```

### CategoriaDonacion
| Campo        | Tipo    | Descripción                |
|--------------|---------|----------------------------|
| id_categoria | INTEGER | PK, autoincremental        |
| nombre       | STRING  | Nombre de la categoría     |
| descripcion  | TEXT    | Descripción                |

### Postulacion
| Campo            | Tipo    | Descripción                        |
|------------------|---------|------------------------------------|
| id_postulacion   | INTEGER | PK, autoincremental                |
| id_donacion      | INTEGER | FK a Donacion                      |
| id_beneficiario  | INTEGER | FK a Beneficiario                  |
| fecha_postulacion| DATE    | Fecha de la postulación            |
| estado           | ENUM    | "pendiente", "aprobada", "rechazada" |

**Ejemplo creación:**
```json
{
  "id_donacion": 1
}
```

---

## Resumen de Payloads por Endpoint

- **Registro:** `/api/auth/register` → Usuario + datos de donador/beneficiario
- **Login:** `/api/auth/login` → { correo, password }
- **Crear donación:** `/api/donaciones` → { nombre, descripcion, cantidad, fecha_vencimiento, ubicacion, id_categoria }
- **Crear postulación:** `/api/postulaciones` → { id_donacion }
- **Actualizar estado postulación:** `/api/postulaciones/:id/estado` → { estado }

---


---

## Casos de Prueba (Ejemplos de Payloads)

### 1. Registro de Donador

POST `/api/auth/register`
```json
{
  "username": "donador1",
  "correo": "donador1@mail.com",
  "password": "123456",
  "rol": "donador",
  "nombre": "Empresa Donadora",
  "tipo_entidad": "empresa",
  "direccion": "Av. Principal 123",
  "ruc": "12345678901",
  "persona_contacto": "Juan Perez",
  "telefono": "999888777",
  "ciudad": "Lima"
}
```

### 2. Registro de Beneficiario

POST `/api/auth/register`
```json
{
  "username": "beneficiario1",
  "correo": "beneficiario1@mail.com",
  "password": "123456",
  "rol": "beneficiario",
  "nombre": "ONG Ayuda",
  "tipo_entidad": "ong",
  "direccion": "Calle Secundaria 456",
  "capacidad_atencion": 50,
  "persona_contacto": "Maria Lopez",
  "telefono": "988776655",
  "ciudad": "Arequipa"
}
```

### 3. Login

POST `/api/auth/login`
```json
{
  "correo": "donador1@mail.com",
  "password": "123456"
}
```

### 4. Crear Donación (Donador autenticado)

POST `/api/donaciones`
Header: `Authorization: Bearer <token>`
```json
{
  "nombre": "Ropa de abrigo",
  "descripcion": "20 frazadas nuevas",
  "cantidad": 20,
  "fecha_vencimiento": "2025-12-31",
  "ubicacion": "Lima",
  "id_categoria": 1
}
```

### 5. Crear Postulación (Beneficiario autenticado)

POST `/api/postulaciones`
Header: `Authorization: Bearer <token>`
```json
{
  "id_donacion": 1
}
```

### 6. Actualizar Estado de Postulación (Donador autenticado)

PUT `/api/postulaciones/1/estado`
Header: `Authorization: Bearer <token>`
```json
{
  "estado": "aprobada"
}
```

---

Si tu app da error, revisa que los nombres de los campos coincidan exactamente con los ejemplos y que el header de autorización esté presente en los endpoints protegidos.

---

## Endpoints Principales

### Autenticación

- `POST /api/auth/register` — Registro de usuario (donador o beneficiario)
- `POST /api/auth/login` — Login y obtención de token JWT

### Donaciones

- `GET /api/donaciones` — Listar donaciones (filtros: categoría, ciudad, estado, búsqueda)
- `GET /api/donaciones/:id` — Obtener detalle de donación
- `POST /api/donaciones` — Crear donación (solo donador autenticado)
- `PUT /api/donaciones/:id` — Editar donación (solo dueño)
- `DELETE /api/donaciones/:id` — Eliminar donación (solo dueño)

### Postulaciones

- `POST /api/postulaciones` — Crear postulación (solo beneficiario autenticado)
- `GET /api/postulaciones/mis-postulaciones` — Ver postulaciones propias (beneficiario)
- `GET /api/postulaciones/donacion/:id` — Ver postulaciones a una donación (donador dueño)
- `PUT /api/postulaciones/:id/estado` — Cambiar estado (aprobada/rechazada) (donador dueño)

### Dashboard

- `GET /api/dashboard/donador` — Estadísticas para donador
- `GET /api/dashboard/beneficiario` — Estadísticas para beneficiario

---

## Autenticación y Roles

- Se usa JWT. El token se envía en el header `Authorization: Bearer <token>`.
- Roles: `donador` y `beneficiario`. Los endpoints restringidos usan middlewares para validar el rol.

---

## Dependencias

- express
- sequelize
- pg
- dotenv
- cors
- bcryptjs
- jsonwebtoken
- nodemon (dev)

---

## Notas Técnicas

- La base de datos debe estar en Neon PostgreSQL o compatible con PostgreSQL.
- Las asociaciones entre modelos están definidas en `src/models/index.js`.
- Los controladores implementan la lógica de negocio y validaciones.
- Los middlewares en `src/middleware/authMiddleware.js` validan el token y el rol.

---

## Contacto y Soporte

- Autor: Jean_Paul
- Issues: [https://github.com/RuizJpaul/raki_api/issues](https://github.com/RuizJpaul/raki_api/issues)

---

¿Necesitas ejemplos de uso, diagramas o más detalles? Indícalo y te los proporciono.
