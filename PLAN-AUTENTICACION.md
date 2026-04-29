# Autenticacion del editor PROLOPE — Guia completa

---

## 1. Resumen rapido

El editor de contenidos PROLOPE ahora requiere **inicio de sesion**. Nadie puede editar pagaciones sin estar autenticado. El sistema funciona tanto en desarrollo local (Windows, Mac, Linux) como en produccion (servidor UAB).

---

## 2. Guia de uso paso a paso (para la configuración en el servidor, consúltese el punto 9)

### 2.1. Primera vez: configuracion inicial

Solo hay que hacer esto **una vez** en cada ordenador donde vayas a trabajar.

#### Paso 1 — Abrir una terminal

- **Windows**: Abre PowerShell (busca "PowerShell" en el menu Inicio)
- **Mac/Linux**: Abre la Terminal

Navega hasta la carpeta del proyecto:

```
cd C:\Users\joelr\Desktop\Archivo_Digital\PROLOPE
```

#### Paso 2 — Generar la clave de desarrollo

Esta clave cifra el archivo de usuarios. Solo existe en tu ordenador, nunca se sube al repositorio Git.

```
node -e "require('fs').writeFileSync('.dev-key', require('crypto').randomBytes(32).toString('hex'))"
```

Este comando no muestra nada en pantalla si va bien. Crea un archivo oculto llamado `.dev-key` en la carpeta del proyecto.

> **Si ya tienes `.dev-key`** (porque ya configuraste el proyecto antes), puedes saltarte este paso.

#### Paso 3 — Crear tu usuario

```
node add-user.js --create prolope
```

El script te pedira:
1. **Contrasena**: escribe una contrasena de al menos 12 caracteres y pulsa Enter. En Windows la contrasena sera visible mientras la escribes; en Mac/Linux se mostraran asteriscos.
2. **Confirmar contrasena**: vuelve a escribir la misma contrasena y pulsa Enter.

Si todo va bien, veras: `Usuario creado: prolope`

> **Importante**: recuerda esta contrasena. No se puede recuperar (solo se guarda un hash irreversible). Si la olvidas, tendras que eliminar el usuario y crearlo de nuevo (ver seccion 2.4).

#### Paso 4 — Arrancar el servidor

```
node editor-server.js
```

Veras un mensaje como:

```
  ╔════════════════════════════════════════════╗
  ║   Editor de contenidos PROLOPE             ║
  ║   http://localhost:3000                    ║
  ║   Autenticacion activa (1 usuario)         ║
  ╚════════════════════════════════════════════╝
```

#### Paso 5 — Iniciar sesion en el navegador

1. Abre el navegador y ve a **http://localhost:3000**
2. Aparecera la pagina de login
3. Escribe tu usuario (por defecto: `prolope`) y tu contrasena
4. Haz clic en **Entrar**
5. Si las credenciales son correctas, seras redirigido al editor de contenidos

Para detener el servidor, ve a la terminal y pulsa **Ctrl+C**.

---

### 2.2. Uso diario

Si ya hiciste la configuracion inicial (tienes `.dev-key` y `users.enc`), el dia a dia es simplemente:

```
node editor-server.js
```

Luego abre **http://localhost:3000** en el navegador e inicia sesion.

---

### 2.3. Gestion de usuarios

Todos estos comandos se ejecutan en la terminal, desde la carpeta del proyecto.

#### Listar usuarios existentes

```
node add-user.js --list
```

Muestra algo como:
```
  prolope  (admin)  creado: 2026-04-29T10:00:00Z
```

#### Crear un nuevo usuario

```
node add-user.js --create nombre-usuario
```

El nombre de usuario solo puede contener letras, numeros, puntos y guiones. La contrasena debe tener al menos 12 caracteres.

#### Eliminar un usuario

```
node add-user.js --remove nombre-usuario
```

Se elimina inmediatamente. Si eliminas todos los usuarios, el servidor no arrancara hasta que crees al menos uno.

#### Cambiar la contrasena de un usuario

No hay un comando directo. El procedimiento es eliminar y recrear:

```
node add-user.js --remove prolope
node add-user.js --create prolope
```

La nueva contrasena puede ser la misma o diferente.

---

### 2.4. Solucion de problemas

| Problema | Solucion |
|---|---|
| El servidor no arranca y dice "No se encontro clave de cifrado" | Falta el archivo `.dev-key`. Ejecuta el comando del paso 2 de la seccion 2.1 |
| El servidor no arranca y dice "No existe users.enc" | No hay ningun usuario creado. Ejecuta `node add-user.js --create prolope` |
| El servidor no arranca y dice "No se pudo descifrar users.enc" | El archivo `.dev-key` ha cambiado o `users.enc` esta corrupto. Borra ambos y repite los pasos 2 y 3 de la seccion 2.1 |
| `add-user.js --create` se queda colgado (no hace nada) | Esto ya esta corregido. Si ocurre en una version anterior, asegurate de tener la ultima version de `add-user.js` |
| Intento iniciar sesion y dice "Demasiados intentos" | Has fallado la contrasena 5 veces. Espera 30 minutos o reinicia el servidor (el rate limit es en memoria) |
| Olvide mi contrasena | Elimina el usuario y crealo de nuevo: `node add-user.js --remove prolope` y luego `node add-user.js --create prolope` |
| La pagina de login no carga | Asegurate de que el servidor esta arrancado (`node editor-server.js`) y de que estas en `http://localhost:3000` |

---

### 2.5. Reglas de las contrasenas

- **Minimo**: 12 caracteres.
- **Permitido**: cualquier caracter (letras, numeros, simbolos, espacios, acentos, etc.).
- **Recomendacion**: usa una frase larga (ej: `correcto caballo bateria estufa`) o una contrasena generada por un gestor de contrasenas.

---

## 3. Archivos del sistema

| Archivo | Que es | Se sube a Git? |
|---|---|---|
| `editor-server.js` | Servidor principal (con autenticacion integrada) | Si |
| `add-user.js` | Script para crear/eliminar/listar usuarios | Si |
| `login.html` | Pagina de inicio de sesion | Si |
| `.env.example` | Documentacion de variables de entorno | Si |
| `.gitignore` | Lista de archivos excluidos de Git | Si |
| `.dev-key` | Clave de cifrado local (desarrollo) | **No** (cada desarrollador tiene la suya) |
| `users.enc` | Almacena usuarios cifrados | **No** (contiene credenciales) |
| `access.log` | Registro de actividad (auditoria) | **No** |

---

## 4. Arquitectura tecnica

### 4.1. Componentes

- **Servidor**: Node.js puro (sin Express, sin dependencias externas). Solo usa modulos nativos: `crypto`, `http`, `fs`, `path`.
- **Almacena de usuarios**: archivo cifrado `users.enc` (AES-256-GCM).
- **Clave de cifrado**: `/etc/prolope/auth.key` (produccion) o `.dev-key` (desarrollo) o variable de entorno `PROLOPE_AUTH_KEY`.
- **Sesiones**: tokens aleatorios de 256 bits almacenados en cookies httpOnly.

### 4.2. Formato del archivo users.enc

El archivo en disco no es legible. Contiene texto codificado en base64 con la estructura:

```
[IV aleatorio 12 bytes][ciphertext][Auth Tag 16 bytes]
```

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

### 4.3. Hash de contrasenas

- Algoritmo: **scrypt** (modulo nativo de Node.js).
- Parametros: `N=16384, r=8, p=1` (coste alto, resistente a GPU/ASIC).
- Cada usuario tiene un **salt aleatorio individual** de 32 bytes.
- Formato: `scrypt$N$r$p$<salt>$<hash>`.
- Verificacion con `crypto.timingSafeEqual()` para evitar timing attacks.
- Requisito minimo: 12 caracteres, validado en `add-user.js`.

### 4.4. Cifrado del archivo

- Algoritmo: **AES-256-GCM** (cifrado autenticado: confidencialidad + integridad).
- La clave (32 bytes) se lee de la fuente disponible (ver prioridad mas arriba).
- Un IV aleatorio nuevo se genera cada vez que se reescribe el archivo.
- El auth tag garantiza que **cualquier modificacion de un solo byte** del archivo en disco se detecta al descifrar y produce un error.

### 4.5. Orden de prioridad para la clave de cifrado

El servidor (y `add-user.js`) buscan la clave en este orden:

1. **`/etc/prolope/auth.key`** — Produccion (Linux). Archivo con permisos restrictivos del SO.
2. **Variable de entorno `PROLOPE_AUTH_KEY`** — Alternativa. Contiene la clave en hexadecimal.
3. **`.dev-key`** — Desarrollo local. Archivo en la raiz del proyecto.

Si no existe ninguna fuente de clave, el servidor **no arranca** y muestra instrucciones.

---

## 5. Flujo de autenticacion

### 5.1. Login

```
Usuario → GET / → Sin sesion valida → Se sirve login.html
Usuario → POST /api/login {username, password}
Servidor:
  1. Valida formato del username (solo alfanumericos, guiones y puntos).
     La contrasena NO se filtra (se hashea directamente).
  2. Comprueba rate limit de la IP (ver seccion 6).
  3. Busca usuario en el almacen en memoria.
  4. Verifica hash scrypt con timingSafeEqual.
  5. Si es correcto:
     - Genera session token (crypto.randomBytes(32)).
     - Almacena en activeSessions (Map en memoria).
     - Devuelve cookie: session=<token>
       Flags: HttpOnly; SameSite=Lax; Path=/; Max-Age=28800
       Flag Secure: solo en produccion.
     - Redirige a /editor.
  6. Si falla:
     - Devuelve 401 con mensaje generico "Usuario o contrasena incorrectos".
     - Registra intento en access.log.
```

### 5.2. Verificacion de sesion

Todas las rutas `/api/*` (salvo `/api/login`) y `/editor` exigen una cookie de sesion valida:

1. Extraer cookie `session` del header.
2. Buscar en `activeSessions`.
3. Verificar que no ha expirado (8h de inactividad Y 24h absolutas).
4. Si es valida: renovar timestamp de ultima actividad y continuar.
5. Si no: responder 401 (API) o redirigir a login (paginas HTML).

Los archivos estaticos (CSS, JS, imagenes) se sirven **sin autenticacion** para que la pagina de login pueda cargar correctamente.

### 5.3. Logout

```
POST /api/logout
  - Elimina sesion de activeSessions
  - Borra cookie del cliente
```

### 5.4. Expiracion de sesion

- **Timeout de inactividad**: 8 horas sin peticiones. Cada peticion valida renueva el timestamp.
- **Timeout absoluto**: 24 horas desde el momento del login. Tras 24 horas se fuerza re-login aunque haya habido actividad continua.
- Las sesiones expiradas se limpian automaticamente cada 10 minutos.

### 5.5. Cookie Secure condicional

- **En produccion** (`NODE_ENV=production`): la cookie incluye `Secure` (solo se envia por HTTPS).
- **En desarrollo** (sin `NODE_ENV` o distinto de `production`): la cookie **no** incluye `Secure` (permite HTTP en localhost).

---

## 6. Protecciones de seguridad

### 6.1. Rate limiting

- **Limite**: 5 intentos de login por IP en 10 minutos.
- **Bloqueo**: al exceder el limite, la IP queda bloqueada durante 30 minutos.
- **Respuesta**: HTTP 429 con cabecera `Retry-After`.
- El rate limit se almacena en memoria. Al reiniciar el servidor se resetea.

### 6.2. Deteccion de IP real detras de proxy

En produccion, Apache/Nginx hace de proxy y todas las peticiones llegan desde `127.0.0.1`. Sin correccion, todos los usuarios compartirian el mismo rate limit.

**Solucion:** se lee `X-Forwarded-For` solo cuando la peticion viene de una IP de confianza (loopback). En desarrollo local, `req.socket.remoteAddress` ya es la IP real del cliente.

### 6.3. Cabeceras de seguridad

Todas las respuestas incluyen:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer
Cache-Control: no-store
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'
```

En produccion se anade ademas:
```
Strict-Transport-Security: max-age=63072000; includeSubDomains
```

### 6.4. Proteccion contra CSRF

- Cookie con `SameSite=Lax`.
- Verificacion del header `Origin` en todas las peticiones POST (excepto login/logout).

### 6.5. Proteccion contra inyeccion en users.enc

1. **AES-256-GCM (AEAD)**: cualquier alteracion invalida el auth tag. El servidor se niega a arrancar.
2. **Clave fuera del proyecto**: no esta en ningun archivo del directorio web.
3. **Sin API de creacion de usuarios**: el servidor no expone ningun endpoint para crear/modificar usuarios. Solo `add-user.js` (CLI) puede hacerlo.
4. **Validacion de input**: el endpoint de login rechaza caracteres sospechosos en el campo de usuario. La contrasena se hashea directamente sin filtrarse.

### 6.6. HTTPS en produccion

- El servidor rechaza peticiones HTTP que no vengan de `localhost`/`127.0.0.1`.
- Si la UAB no proporciona HTTPS, se muestra un aviso en la pagina de login: "Conexion no segura. Contacta con el administrador."

---

## 7. Logs de auditoria

El archivo `access.log` registra toda la actividad de autenticacion y edicion:

```
[2026-04-29T10:15:32Z] LOGIN_SUCCESS  ip=147.83.x.x  user=prolope
[2026-04-29T10:16:01Z] LOGIN_FAILURE  ip=192.168.x.x  user=admin
[2026-04-29T10:20:00Z] RATE_LIMITED   ip=192.168.x.x
[2026-04-29T10:30:00Z] LOGOUT         ip=147.83.x.x  user=prolope
[2026-04-29T11:00:00Z] FILE_SAVE      ip=147.83.x.x  user=prolope  file=el-grupo/contacto.html
[2026-04-29T11:05:00Z] FILE_DELETE    ip=147.83.x.x  user=prolope  file=eventos/old-page.html
```

El archivo `access.log` esta en `.gitignore` y nunca se sube al repositorio.

---

## 8. Modelo de amenazas

| Atacante | Que intenta | Proteccion |
|---|---|---|
| Navegador web externo | Acceder al editor sin credenciales | Login + cookie de sesion |
| Navegador web externo | Fuerza bruta de contrasenas | Rate limiting (5 intentos / 10 min) |
| Atacante en la red | Capturar sesion (sniffing) | HTTPS + cookie Secure |
| Atacante en la red | Robar cookie (XSS) | Cookie httpOnly + CSP |
| Atacante en la red | CSRF | SameSite=Lax + verificacion de Origin en POST |
| Acceso FTP al directorio web | Leer credenciales | `users.enc` cifrado + clave fuera del directorio |
| Acceso FTP al directorio web | Inyectar usuario en el JSON | AES-256-GCM detecta alteracion |
| Shell como usuario web | Leer la clave de cifrado | Permisos OS (0400, otro owner) |
| Shell como `prolope-service` | Leer la clave | Responsabilidad de infraestructura (fuera de alcance) |
| Root en el servidor | Cualquier cosa | Fuera de alcance: parcheo del SO, firewall, etc. |

---

## 9. Configuracion en el servidor UAB (produccion)

### 9.1. Paso a paso

```bash
# 1. Crear usuario de sistema dedicado
sudo useradd -r -s /bin/false prolope-service

# 2. Generar clave de cifrado
sudo mkdir -p /etc/prolope
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" \
  | sudo tee /etc/prolope/auth.key
sudo chmod 400 /etc/prolope/auth.key
sudo chown prolope-service:prolope-service /etc/prolope/auth.key

# 3. Crear primer usuario (pide contrasena interactivamente)
node add-user.js --create prolope

# 4. Crear servicio de systemd
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

# 5. Configurar Apache/Nginx como proxy inverso con HTTPS (ver seccion 9.2)
```

### 9.2. Configuracion del proxy inverso (Apache)

```apache
# Apache: VirtualHost con HTTPS
<VirtualHost *:443>
    ServerName prolope.uab.cat
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/prolope.uab.cat/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/prolope.uab.cat/privkey.pem

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

---

## 10. Resumen de garantias

| Garantia | Mecanismo |
|---|---|
| Contrasenas irreversibles en disco | scrypt (N=16384, salt individual) |
| Contrasenas minimamente robustas | Requisito de 12 caracteres en `add-user.js` |
| Almacena de usuarios ilegible en disco | AES-256-GCM |
| Almacena de usuarios inmodificable sin clave | Auth tag AEAD |
| Clave inaccesible desde el directorio web | Archivo fuera del DocumentRoot + permisos OS 0400 |
| Clave inaccesible desde shell de usuario web | Owner dedicado (prolope-service) |
| Credenciales protegidas en transito | HTTPS obligatorio en produccion |
| Sesion protegida contra robo (XSS) | Cookie httpOnly + CSP |
| Sesion protegida contra CSRF | SameSite=Lax + verificacion Origin en POST |
| Sesion con caducidad absoluta | 24h maximo aunque haya actividad |
| Proteccion contra fuerza bruta | Rate limiting (5 intentos / 10 min / IP real) |
| Rate limiting correcto detras de proxy | Deteccion de IP real via X-Forwarded-For (solo desde loopback) |
| Autenticacion siempre activa | El servidor nunca arranca sin clave (ni en desarrollo) |
| Probado en local antes de produccion | Mismo flujo de login con `.dev-key` + cookie sin Secure |
| Deteccion de intrusiones | Logs de auditoria (access.log) |
| Sin dependencias externas | Solo modulos nativos de Node.js |

---

## 11. Changelog de revisiones

### v2 (2026-04-29)

Correcciones aplicadas tras revision:

1. **Eliminado el "modo sin autenticacion"**: el servidor nunca arranca sin clave, ni siquiera en desarrollo. Se usa `.dev-key` autogenerada en local.
2. **Cookie `Secure` condicional**: solo se aplica en produccion (`NODE_ENV=production`), permitiendo probar login en `http://localhost`.
3. **Deteccion de IP real detras de proxy**: `X-Forwarded-For` se lee solo desde IPs de confianza (loopback).
4. **Validacion de input solo en username**: la contrasena no se filtra por caracteres especiales (se hashea directamente).
5. **Timeout absoluto de sesion**: limite de 24 horas ademas del timeout de inactividad de 8 horas.
6. **Requisito minimo de contrasena**: 12 caracteres, validado en `add-user.js`.
7. **Orden del formato de archivo corregido**: `[IV][ciphertext][auth tag]` siguiendo el orden convencional de GCM.
8. **`SameSite=Lax` en lugar de `Strict`**: permite navegacion desde enlaces externos sin perder sesion.

### v3 (2026-04-29)

Implementacion completada:

1. **`editor-server.js` modificado** con autenticacion completa: descifrado de `users.enc`, middleware de sesion, HTTPS enforcement, rate limiting, cabeceras de seguridad, validacion de input, logging, CSRF protection.
2. **`login.html` creado** con pagina de login minimalista, aviso de conexion insegura, manejo de errores y rate limiting en el cliente.
3. **`add-user.js` creado** con soporte para crear, eliminar y listar usuarios. Incluye fallback para Windows (readline estandar en lugar de manipulacion de stdin).
4. **`.gitignore` actualizado** con `users.enc`, `access.log`, `.env`, `.dev-key`, `_versions/`.
5. **`.env.example` creado** documentando las variables de entorno disponibles.
6. **Compatibilidad con Windows**: `add-user.js` detecta `process.platform === 'win32'` y usa `readline` estandar en lugar de manipulacion directa de stdin, evitando que PowerShell se cuelgue.
