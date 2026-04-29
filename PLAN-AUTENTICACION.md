# Plan de autenticación para el editor PROLOPE

## 1. Contexto

El editor de contenidos PROLOPE (`editor-server.js`) permite editar todas las páginas del sitio web vía `editor-web.html`. Actualmente **no tiene autenticación**: cualquiera que llegue al servidor puede editar todo.

El objetivo es implementar un sistema de login seguro que proteja el editor cuando se despliegue en el servidor del departamento de la UAB.

---

## 2. Arquitectura general

- **Servidor**: Node.js puro (sin Express, sin dependencias externas).
- **Almacén de usuarios**: archivo cifrado `users.enc` (AES-256-GCM).
- **Clave de cifrado**: archivo `/etc/prolope/auth.key` con permisos restrictivos del SO.
- **Sesiones**: tokens aleatorios de 256 bits en cookies httpOnly.
- **Sin dependencias externas**: solo se usan módulos nativos de Node.js (`crypto`, `http`, `fs`, `path`).

---

## 3. Almacenamiento de credenciales

### 3.1. Formato del archivo

El archivo `users.enc` contiene el almacén de usuarios **cifrado con AES-256-GCM**. En disco no es JSON legible; es texto codificado en base64 con la estructura:

```
[IV aleatorio 12 bytes][ciphertext][Auth Tag 16 bytes]
```

> **Nota:** El auth tag se coloca al final porque AES-256-GCM lo genera *después* del cifrado. Este es el orden convencional y simplifica la implementación (se escribe secuencialmente: IV → cifrar → append tag).

El contenido descifrado (solo existe en memoria del proceso) es:

```json
[
  {
    "username": "prolope",
    "passwordHash": "scrypt$16384$8$1$<salt hex>$<hash hex>",
    "role": "admin",
    "created": "2026-04-29T10:00:00Z"
  }
]
```

### 3.2. Hash de contraseñas

- Algoritmo: **scrypt** (módulo nativo de Node.js).
- Parámetros: `N=16384, r=8, p=1` (coste alto, resistente a GPU/ASIC).
- Cada usuario tiene un **salt aleatorio individual** de 32 bytes.
- Formato del hash almacenado: `scrypt$N$r$p$<salt>$<hash>`.
- Verificación con `crypto.timingSafeEqual()` para evitar timing attacks.
- **Requisito mínimo de contraseña**: 12 caracteres. Se valida en `add-user.js` al crear el usuario. Se permiten todos los caracteres (incluyendo especiales, Unicode, etc.).

### 3.3. Cifrado del archivo

- Algoritmo: **AES-256-GCM** (cifrado autenticado: confidencialidad + integridad).
- La clave (32 bytes) se lee de `/etc/prolope/auth.key`.
- Un IV aleatorio nuevo se genera cada vez que se reescribe el archivo.
- El auth tag garantiza que **cualquier modificación de un solo byte** del archivo en disco se detecta al descifrar y produce un error.

### 3.4. Protección contra inyección

Un atacante que intente modificar `users.enc` para inyectar un usuario se encuentra con:

1. **AES-256-GCM (AEAD)**: cualquier alteración invalida el auth tag. El servidor se niega a arrancar.
2. **Clave fuera del proyecto**: no está en ningún archivo del directorio web.
3. **Sin API de creación de usuarios**: el servidor no expone ningún endpoint para crear/modificar usuarios. Solo `add-user.js` (CLI con acceso shell) puede hacerlo.
4. **Validación de input en el username**: el endpoint de login rechaza caracteres sospechosos (`{`, `}`, `<`, `>`, `"`, `\`, etc.) en el campo de usuario. La contraseña **no se filtra** (se hashea directamente, no se interpreta), lo que permite contraseñas fuertes con cualquier carácter.

---

## 4. Almacenamiento de la clave de cifrado

### 4.1. Ubicación

La clave se almacena en `/etc/prolope/auth.key`, **fuera del directorio web**.

### 4.2. Permisos del SO

```
Archivo: /etc/prolope/auth.key
Permisos: 0400 (solo lectura, solo el owner)
Owner:    prolope-service:prolope-service
```

Se crea un **usuario de sistema dedicado** `prolope-service` que ejecuta el servidor Node.js. Este usuario es el único que puede leer la clave.

El usuario que gestiona el directorio web (o el usuario de Apache/Nginx) **no tiene permisos** para leer ese archivo.

### 4.3. Configuración inicial

```bash
# Crear usuario de sistema (como root)
sudo useradd -r -s /bin/false prolope-service

# Crear directorio y archivo de clave
sudo mkdir -p /etc/prolope

# Generar clave aleatoria de 32 bytes en hex
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" \
  | sudo tee /etc/prolope/auth.key

# Restringir permisos
sudo chmod 400 /etc/prolope/auth.key
sudo chown prolope-service:prolope-service /etc/prolope/auth.key
```

### 4.4. ¿Por qué no una variable de entorno?

Una variable de entorno (`PROLOPE_AUTH_KEY`) es una alternativa válida pero más débil:

| Método | ¿Protegido contra acceso FTP? | ¿Protegido contra shell como usuario web? |
|---|---|---|
| Variable de entorno (`.bashrc`, systemd) | Sí | No (`/proc/<pid>/environ`) |
| Archivo con permisos OS (`/etc/prolope/auth.key`) | Sí | Sí (permisos 0400, otro usuario) |

Por eso el mecanismo principal es el **archivo con permisos del SO**. La variable de entorno se mantiene solo como alternativa para **desarrollo local**.

---

## 5. Flujo de autenticación

### 5.1. Login

```
Usuario → GET / → Sin sesión válida → Se sirve login.html
Usuario → POST /api/login {username, password}
Servidor:
  1. Valida formato del username (solo alfanuméricos, guiones y puntos)
     La contraseña NO se filtra (se hashea directamente)
  2. Comprueba rate limit de la IP (ver sección 8 para detección de IP real)
  3. Busca usuario en el almacén en memoria
  4. Verifica hash scrypt con timingSafeEqual
  5. Si es correcto:
     - Genera session token (crypto.randomBytes(32))
     - Almacena en activeSessions (Map en memoria)
     - Devuelve cookie: session=<token>
       Flags: HttpOnly; SameSite=Lax; Path=/; Max-Age=28800
       Flag Secure: solo en producción (ver 5.5)
     - Redirige a /editor
  6. Si falla:
     - Devuelve 401 con mensaje genérico "Usuario o contraseña incorrectos"
     - Registra intento en access.log
```

### 5.2. Verificación de sesión

Todas las rutas `/api/*` (salvo `/api/login`) y `/editor` exigen una cookie de sesión válida:

1. Extraer cookie `session` del header.
2. Buscar en `activeSessions`.
3. Verificar que no ha expirado (8 horas de inactividad **y** 24 horas absolutas desde el login).
4. Si es válida: renovar timestamp de última actividad y continuar.
5. Si no: responder 401 (API) o redirigir a login (páginas HTML).

### 5.3. Logout

```
POST /api/logout
  - Elimina sesión de activeSessions
  - Borra cookie del cliente
```

### 5.4. Expiración de sesión

- **Timeout de inactividad**: 8 horas sin peticiones (configurable). Cada petición válida renueva el timestamp de última actividad.
- **Timeout absoluto**: 24 horas desde el momento del login (configurable). Tras 24 horas se fuerza re-login aunque haya habido actividad continua. Esto limita el daño si una sesión se compromete.
- Las sesiones expiradas (por cualquiera de los dos criterios) se limpian periódicamente (cada 10 minutos).

### 5.5. Cookie Secure condicional

La flag `Secure` en la cookie indica al navegador que solo la envíe por HTTPS. En desarrollo local (sin HTTPS), esta flag impediría que el navegador envíe la cookie y el login no funcionaría.

- **En producción** (`NODE_ENV=production`): la cookie incluye `Secure`.
- **En desarrollo** (`NODE_ENV` ausente o distinto de `production`): la cookie **no** incluye `Secure`.

Esto permite probar el flujo completo de login en `http://localhost:3000`.

---

## 6. Cifrado en tránsito: HTTPS

### 6.1. Requisito

Sin HTTPS, las credenciales y la cookie de sesión viajan en claro por la red. Un atacante en la misma red (WiFi del campus, etc.) puede capturar la sesión.

### 6.2. Aplicación en el servidor

- **En producción**: el servidor rechaza peticiones HTTP que no vengan de `localhost`/`127.0.0.1`.
- Detección: se comprueba `req.headers['x-forwarded-proto']` (proxy inverso) o `req.socket.encrypted` (TLS directo).
- Si no es HTTPS: respuesta 403 con mensaje informativo.

### 6.3. Configuración del proxy inverso

Si Apache/Nginx está por delante de Node.js:

```apache
# Apache: VirtualHost con HTTPS
<VirtualHost *:443>
    ServerName prolope.uab.cat
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/prolope.uab.cat/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/prolope.uab.cat/privkey.pem

    # Redirige al puerto de Node.js
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/
    RequestHeader set X-Forwarded-Proto https
    RequestHeader set X-Forwarded-For "%{REMOTE_ADDR}s"
</VirtualHost>

# Redirigir HTTP a HTTPS
<VirtualHost *:80>
    ServerName prolope.uab.cat
    Redirect permanent / https://prolope.uab.cat/
</VirtualHost>
```

### 6.4. Si la UAB no proporciona HTTPS

- Se documenta como limitación de seguridad.
- Se muestra aviso en la página de login: *"Conexión no segura. Contacta con el administrador."*
- Se recomienda encarecidamente al departamento de informática que habilite TLS.

---

## 7. Cabeceras de seguridad

Todas las respuestas del editor y la API incluyen:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'
Cache-Control: no-store
```

> **Nota:** `Strict-Transport-Security` solo se envía en producción (cuando se confirma HTTPS), para no causar problemas en desarrollo local.

---

## 8. Rate limiting

- **Límite**: 5 intentos de login por IP en 10 minutos.
- **Bloqueo**: al exceder el límite, la IP queda bloqueada durante 30 minutos.
- **Almacenamiento**: Map en memoria `{ IP → { attempts: [...timestamps], blockedUntil: timestamp } }`.
- **Limpieza**: entradas expiradas se eliminan cada 10 minutos.
- Respuesta al exceder: HTTP 429 con cabecera `Retry-After`.

### 8.1. Detección de IP real detrás de proxy inverso

En producción, Apache/Nginx hace de proxy y todas las peticiones llegan a Node.js desde `127.0.0.1`. Sin corrección, todos los usuarios compartirían el mismo rate limit.

**Solución:** se lee `X-Forwarded-For` solo cuando la petición viene de una IP de confianza (loopback):

```
function getClientIP(req) {
  const remote = req.socket.remoteAddress;
  // Solo confiar en X-Forwarded-For si viene del proxy local
  if (remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1') {
    const xff = req.headers['x-forwarded-for'];
    if (xff) return xff.split(',')[0].trim();
  }
  return remote;
}
```

En desarrollo local (sin proxy), `req.socket.remoteAddress` ya es la IP real del cliente, así que no hay impacto.

---

## 9. Logs de auditoría

Archivo `access.log` con formato:

```
[2026-04-29T10:15:32Z] LOGIN_SUCCESS  ip=147.83.x.x  user=prolope
[2026-04-29T10:16:01Z] LOGIN_FAILURE  ip=192.168.x.x  user=admin
[2026-04-29T10:20:00Z] RATE_LIMITED   ip=192.168.x.x
[2026-04-29T10:30:00Z] LOGOUT         ip=147.83.x.x  user=prolope
[2026-04-29T11:00:00Z] FILE_SAVE      ip=147.83.x.x  user=prolope  file=el-grupo/contacto.html
[2026-04-29T11:05:00Z] FILE_DELETE    ip=147.83.x.x  user=prolope  file=eventos/old-page.html
```

El archivo `access.log` se añade a `.gitignore`.

---

## 10. Modelo de amenazas

| Atacante | Qué intenta | Protección |
|---|---|---|
| Navegador web externo | Acceder al editor sin credenciales | Login + cookie de sesión |
| Navegador web externo | Fuerza bruta de contraseñas | Rate limiting (5 intentos / 10 min) |
| Atacante en la red | Capturar sesión (sniffing) | HTTPS + cookie Secure |
| Atacante en la red | Robar cookie (XSS) | Cookie httpOnly + CSP |
| Atacante en la red | CSRF | SameSite=Lax + verificación de Origin en POST |
| Acceso FTP al directorio web | Leer credenciales | `users.enc` cifrado + key fuera del directorio |
| Acceso FTP al directorio web | Inyectar usuario en el JSON | AES-256-GCM detecta alteración |
| Shell como usuario web | Leer la clave de cifrado | Permisos OS (0400, otro owner) |
| Shell como `prolope-service` | Leer la clave | Responsabilidad de infraestructura (fuera de alcance) |
| Root en el servidor | Cualquier cosa | Fuera de alcance: parcheo del SO, firewall, etc. |

---

## 11. Archivos nuevos y modificados

| Archivo | Acción | Descripción |
|---|---|---|
| `editor-server.js` | Modificar | Añadir: descifrado de users.enc, middleware de sesión, HTTPS enforcement, rate limiting, cabeceras de seguridad, validación de input, logging |
| `login.html` | Nuevo | Página de login con estilos coherentes con editor-web.css |
| `users.enc` | Nuevo | Almacén de usuarios cifrado (reemplaza users.json) |
| `add-user.js` | Nuevo | Script CLI para crear/eliminar usuarios (`node add-user.js --create <usuario>`) |
| `.gitignore` | Modificar | Añadir `users.enc`, `access.log`, `.env`, `.dev-key` |
| `.env.example` | Nuevo | Documentación de variables (sin valores reales) |

### `editor-server.js` — cambios principales

1. Al arrancar:
   - Lee `/etc/prolope/auth.key` (producción) o `PROLOPE_AUTH_KEY` (env var) o `.dev-key` (desarrollo local).
   - Si no existe ninguna fuente de clave → **error y salida** (nunca arranca sin autenticación).
   - Descifra `users.enc` → array de usuarios en memoria.
   - Si `users.enc` no existe aún → muestra mensaje indicando que se debe crear el primer usuario con `add-user.js` y termina.
2. Middleware en todas las peticiones:
   - Cabeceras de seguridad.
   - Comprobación de HTTPS en producción.
   - Rate limiting en `/api/login`.
3. Rutas protegidas:
   - Todas las `/api/*` (salvo `/api/login`) requieren sesión válida.
   - `/` y `/editor` requieren sesión válida → si no, sirven `login.html`.
4. Rutas nuevas:
   - `POST /api/login` → autenticación.
   - `POST /api/logout` → cerrar sesión.

### `login.html`

- Página HTML minimalista.
- Campos: usuario + contraseña + botón "Entrar".
- Muestra errores genéricos (nunca revela si el usuario existe).
- Aviso visual si la conexión no es HTTPS.
- Estilos consistentes con el editor.

### `add-user.js`

```bash
# Crear usuario (pide contraseña interactivamente, mínimo 12 caracteres)
node add-user.js --create prolope

# Eliminar usuario
node add-user.js --remove prolope

# Listar usuarios
node add-user.js --list
```

- Lee la clave de `/etc/prolope/auth.key` o `PROLOPE_AUTH_KEY` o `.dev-key`.
- Si `users.enc` no existe, lo crea desde cero (primer usuario).
- Descifra `users.enc`, modifica, vuelve a cifrar.
- Contraseña introducida por teclado con `readline` (no se muestra en pantalla).
- Valida longitud mínima de 12 caracteres. Acepta cualquier carácter.

---

## 12. Configuración en el servidor UAB (paso a paso)

```bash
# 1. Crear usuario de sistema
sudo useradd -r -s /bin/false prolope-service

# 2. Generar clave de cifrado
sudo mkdir -p /etc/prolope
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" \
  | sudo tee /etc/prolope/auth.key
sudo chmod 400 /etc/prolope/auth.key
sudo chown prolope-service:prolope-service /etc/prolope/auth.key

# 3. Crear primer usuario (pide contraseña interactivamente)
node add-user.js --create prolope

# 4. Crear service de systemd
sudo tee /etc/systemd/system/prolope-editor.service << 'EOF'
[Unit]
Description=Editor PROLOPE
After=network.target

[Service]
Type=simple
User=prolope-service
WorkingDirectory=/var/www/prolope
ExecStart=/usr/bin/node editor-server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable prolope-editor
sudo systemctl start prolope-editor

# 5. Configurar Apache/Nginx como proxy inverso con HTTPS (ver sección 6.3)
```

---

## 13. Para desarrollo local

En local no hace falta ni HTTPS ni el archivo `/etc/prolope/auth.key`. El servidor busca la clave en este orden de prioridad:

1. `/etc/prolope/auth.key` (producción)
2. Variable de entorno `PROLOPE_AUTH_KEY`
3. Archivo `.dev-key` en el directorio del proyecto

### Primera vez: setup automático

Si no existe ninguna clave, el servidor **no arranca** y muestra instrucciones:

```
ERROR: No se encontró clave de cifrado.

Para desarrollo local, genera una clave:
  node -e "require('fs').writeFileSync('.dev-key', require('crypto').randomBytes(32).toString('hex'))"

Luego crea el primer usuario:
  node add-user.js --create prolope
```

### Uso habitual

```bash
# Generar clave de desarrollo (solo la primera vez)
node -e "require('fs').writeFileSync('.dev-key', require('crypto').randomBytes(32).toString('hex'))"

# Crear usuario de prueba (solo la primera vez)
node add-user.js --create prolope

# Arrancar el servidor (con autenticación activa)
node editor-server.js
```

El flujo de login funciona exactamente igual que en producción, con estas diferencias:

- La cookie no lleva flag `Secure` (permite HTTP en localhost).
- No se exige HTTPS.
- No se envía la cabecera `Strict-Transport-Security`.

> **Importante:** `.dev-key` está en `.gitignore`. Nunca se sube al repositorio. Cada desarrollador genera la suya.

---

## 14. Resumen de garantías

| Garantía | Mecanismo |
|---|---|
| Contraseñas irreversibles en disco | scrypt (N=16384, salt individual) |
| Contraseñas mínimamente robustas | Requisito de 12 caracteres en `add-user.js` |
| Almacén de usuarios ilegible en disco | AES-256-GCM |
| Almacén de usuarios inmodificable sin clave | Auth tag AEAD |
| Clave inaccesible desde el directorio web | Archivo fuera del DocumentRoot + permisos OS 0400 |
| Clave inaccesible desde shell de usuario web | Owner dedicado (prolope-service) |
| Credenciales protegidas en tránsito | HTTPS obligatorio en producción |
| Sesión protegida contra robo (XSS) | Cookie httpOnly + CSP |
| Sesión protegida contra CSRF | SameSite=Lax + verificación Origin en POST |
| Sesión con caducidad absoluta | 24h máximo aunque haya actividad |
| Protección contra fuerza bruta | Rate limiting (5 intentos / 10 min / IP real) |
| Rate limiting correcto detrás de proxy | Detección de IP real vía X-Forwarded-For (solo desde loopback) |
| Autenticación siempre activa | El servidor nunca arranca sin clave (ni en desarrollo) |
| Probado en local antes de producción | Mismo flujo de login con `.dev-key` + cookie sin Secure |
| Detección de intrusiones | Logs de auditoría (access.log) |
| Sin dependencias externas | Solo módulos nativos de Node.js |

---

## 15. Changelog de revisiones

### v2 (2026-04-29)

Correcciones aplicadas tras revisión:

1. **Eliminado el "modo sin autenticación"**: el servidor nunca arranca sin clave, ni siquiera en desarrollo. Se usa `.dev-key` autogenerada en local.
2. **Cookie `Secure` condicional**: solo se aplica en producción (`NODE_ENV=production`), permitiendo probar login en `http://localhost`.
3. **Detección de IP real detrás de proxy**: `X-Forwarded-For` se lee solo desde IPs de confianza (loopback). Evita que todos los usuarios compartan un único rate limit.
4. **Validación de input solo en username**: la contraseña ya no se filtra por caracteres especiales (se hashea directamente), permitiendo contraseñas más fuertes.
5. **Timeout absoluto de sesión**: añadido límite de 24 horas además del timeout de inactividad de 8 horas.
6. **Requisito mínimo de contraseña**: 12 caracteres, validado en `add-user.js`.
7. **Orden del formato de archivo corregido**: `[IV][ciphertext][auth tag]` en lugar de `[IV][auth tag][ciphertext]`, siguiendo el orden convencional de GCM.
8. **`SameSite=Lax` en lugar de `Strict`**: permite navegación desde enlaces externos sin perder sesión, manteniendo protección CSRF en peticiones POST.
