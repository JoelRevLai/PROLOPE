#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const USERS_FILE = path.join(__dirname, 'users.enc');
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SALT_LEN = 32;
const KEY_LEN = 64;

function getAuthKey() {
  const prodKey = '/etc/prolope/auth.key';
  if (fs.existsSync(prodKey)) {
    return Buffer.from(fs.readFileSync(prodKey, 'utf8').trim(), 'hex');
  }
  if (process.env.PROLOPE_AUTH_KEY) {
    return Buffer.from(process.env.PROLOPE_AUTH_KEY.trim(), 'hex');
  }
  const devKey = path.join(__dirname, '.dev-key');
  if (fs.existsSync(devKey)) {
    return Buffer.from(fs.readFileSync(devKey, 'utf8').trim(), 'hex');
  }
  console.error('ERROR: No se encontro clave de cifrado.');
  console.error('');
  console.error('Para desarrollo local, genera una clave:');
  console.error('  node -e "require(\'fs\').writeFileSync(\'.dev-key\', require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

function encrypt(data, key) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, encrypted, tag]).toString('base64');
}

function decrypt(encBase64, key) {
  const raw = Buffer.from(encBase64, 'base64');
  const iv = raw.subarray(0, 12);
  const tag = raw.subarray(raw.length - 16);
  const ciphertext = raw.subarray(12, raw.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(ciphertext, undefined, 'utf8') + decipher.final('utf8');
}

function loadUsers(key) {
  if (!fs.existsSync(USERS_FILE)) return [];
  const enc = fs.readFileSync(USERS_FILE, 'utf8').trim();
  return JSON.parse(decrypt(enc, key));
}

function saveUsers(users, key) {
  const data = JSON.stringify(users, null, 2);
  fs.writeFileSync(USERS_FILE, encrypt(data, key), 'utf8');
}

function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LEN);
  const hash = crypto.scryptSync(password, salt, KEY_LEN, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P });
  return 'scrypt$' + SCRYPT_N + '$' + SCRYPT_R + '$' + SCRYPT_P + '$' + salt.toString('hex') + '$' + hash.toString('hex');
}

function askPassword() {
  const isWindows = process.platform === 'win32';

  return new Promise((resolve) => {
    if (isWindows) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      rl.question('Contrasena (minimo 12 caracteres): ', (pw1) => {
        rl.question('Confirmar contrasena: ', (pw2) => {
          rl.close();
          if (pw1 !== pw2) {
            console.error('Las contrasenas no coinciden.');
            process.exit(1);
          }
          if (pw1.length < 12) {
            console.error('La contrasena debe tener al menos 12 caracteres.');
            process.exit(1);
          }
          resolve(pw1);
        });
      });
    } else {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      process.stdout.write('Contrasena (minimo 12 caracteres): ');
      const stdin = process.openStdin();
      const onData = (ch) => {
        if (ch[0] === 13 || ch[0] === 10) {
          stdin.removeListener('data', onData);
          process.stdout.write('\n');
        } else if (ch[0] === 127 || ch[0] === 8) {
          process.stdout.write('\b \b');
        } else {
          process.stdout.write('*');
        }
      };
      stdin.on('data', onData);

      rl.question('', (pw1) => {
        rl.close();
        stdin.removeListener('data', onData);
        process.stdout.write('Confirmar contrasena: ');
        stdin.on('data', onData);
        const rl2 = readline.createInterface({ input: process.stdin, output: process.stderr });
        rl2.question('', (pw2) => {
          rl2.close();
          stdin.removeListener('data', onData);
          if (pw1 !== pw2) {
            console.error('\nLas contrasenas no coinciden.');
            process.exit(1);
          }
          if (pw1.length < 12) {
            console.error('\nLa contrasena debe tener al menos 12 caracteres.');
            process.exit(1);
          }
          resolve(pw1);
        });
      });
    }
  });
}

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (!action || (action !== '--create' && action !== '--remove' && action !== '--list')) {
    console.log('Uso:');
    console.log('  node add-user.js --create <usuario>');
    console.log('  node add-user.js --remove <usuario>');
    console.log('  node add-user.js --list');
    process.exit(0);
  }

  const key = getAuthKey();

  if (action === '--list') {
    const users = loadUsers(key);
    if (users.length === 0) {
      console.log('No hay usuarios registrados.');
    } else {
      users.forEach(u => {
        console.log('  ' + u.username + '  (' + u.role + ')  creado: ' + u.created);
      });
    }
    return;
  }

  const username = args[1];
  if (!username) {
    console.error('Especifica un nombre de usuario.');
    process.exit(1);
  }
  if (!/^[a-zA-Z0-9.\-]+$/.test(username)) {
    console.error('El nombre de usuario solo puede contener letras, numeros, puntos y guiones.');
    process.exit(1);
  }

  const users = loadUsers(key);

  if (action === '--remove') {
    const idx = users.findIndex(u => u.username === username);
    if (idx === -1) {
      console.error('Usuario no encontrado: ' + username);
      process.exit(1);
    }
    users.splice(idx, 1);
    saveUsers(users, key);
    console.log('Usuario eliminado: ' + username);
    return;
  }

  if (action === '--create') {
    if (users.find(u => u.username === username)) {
      console.error('El usuario "' + username + '" ya existe.');
      process.exit(1);
    }
    const password = await askPassword();
    users.push({
      username: username,
      passwordHash: hashPassword(password),
      role: 'admin',
      created: new Date().toISOString()
    });
    saveUsers(users, key);
    console.log('Usuario creado: ' + username);
  }
}

main().catch(e => {
  console.error('Error: ' + e.message);
  process.exit(1);
});
