# Documentación Ejecutiva API Raki

## 1. Autenticación y Registro


### Registro
**POST /api/auth/register**

**Body JSON:**
```json
{
  "username": "juanp",
  "correo": "juan@mail.com",
  "password": "123456",
  "rol": "donador", // o "beneficiario"
  "nombre": "Empresa Donadora",
  "tipo_entidad": "empresa", // solo donador/beneficiario
  "direccion": "Av. Principal 123",
  "ruc": "12345678901", // solo donador
  "persona_contacto": "Juan Perez",
  "telefono": "999888777",
  "capacidad_atencion": 50 // solo beneficiario
}
```
**Campos obligatorios:** username, correo, password, rol  
**Campos opcionales según rol:**  
- Donador: nombre, tipo_entidad, direccion, ruc, persona_contacto, telefono  
- Beneficiario: nombre, tipo_entidad, direccion, persona_contacto, telefono, capacidad_atencion

### Login
**POST /api/auth/login**

**Body JSON:**
```json
{
  "correo": "juan@mail.com",
  "password": "123456"
}
```
**Campos obligatorios:** correo, password

### Perfil
**GET /api/auth/profile**

**Header:**  
`Authorization: Bearer <token>`

**Respuesta:**  
Datos completos del usuario y su perfil (según rol).

---

## 2. Donaciones


### Crear donación
**POST /api/donaciones**

**Header:**  
`Authorization: Bearer <token>` (solo donador)

**Body JSON:**
```json
{
  "nombre": "Alimentos no perecibles",
  "descripcion": "Caja con productos básicos",
  "cantidad": 10,
  "fecha_vencimiento": "2025-12-31",
  "ubicacion": "Lima",
  "id_categoria": 2
}
```
**Campos obligatorios:** nombre, cantidad  
**Campos opcionales:** descripcion, fecha_vencimiento, ubicacion, id_categoria

### Listar donaciones
**GET /api/donaciones**

**Query params opcionales:**  
- categoria (id_categoria)
- estado (disponible, entregada, etc.)
- q (búsqueda por nombre)

### Detalle de donación
**GET /api/donaciones/:id**

---

## 3. Postulaciones


### Crear postulación
**POST /api/postulaciones**

**Header:**  
`Authorization: Bearer <token>` (solo beneficiario)

**Body JSON:**
```json
{
  "id_donacion": 5
}
```
**Campo obligatorio:** id_donacion

### Listar postulaciones propias
**GET /api/postulaciones/mis-postulaciones**

**Header:**  
`Authorization: Bearer <token>` (solo beneficiario)

---

## 4. Dashboard


### Donador
**GET /api/dashboard/donador**

**Header:**  
`Authorization: Bearer <token>` (solo donador)

### Beneficiario
**GET /api/dashboard/beneficiario**

**Header:**  
`Authorization: Bearer <token>` (solo beneficiario)

---

## 5. Seguridad y Roles

- Todos los endpoints protegidos requieren el token JWT en el header:  
  `Authorization: Bearer <token>`
- Los roles (`donador`, `beneficiario`) determinan el acceso a los endpoints.

---

## 6. Flujo de datos

- El usuario se registra o inicia sesión y recibe un token.
- El token se usa para acceder a endpoints protegidos.
- Los datos enviados y recibidos siempre usan los mismos nombres de campos que aparecen en los formularios y pantallas del Figma.
- La API valida los datos y responde solo con los campos relevantes para el frontend.

---

## 7. Ejemplo de respuesta de registro/login/perfil

```json
{
  "token": "jwt_token",
  "usuario": {
    "id_usuario": 1,
    "username": "juan",
    "correo": "juan@mail.com",
    "rol": "donador",
    "perfil": {
      "id_donador": 1,
      "nombre": "Empresa Donadora",
      "tipo_entidad": "empresa",
      "direccion": "Av. Principal 123",
      "ruc": "12345678901",
      "persona_contacto": "Juan Perez",
      "telefono": "999888777"
    }
  }
}
```

---

## 8. Notas técnicas

- La API usa JWT para autenticación.
- Los modelos y endpoints están alineados con los campos y flujos del Figma.
- Si el frontend necesita un campo nuevo, debe agregarse en el Figma y en la API.