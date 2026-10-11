'use strict';

/**
 * Server lokal tanpa perlu akun Vercel.
 *   npm start      (atau)      node dev-server.js
 * Lalu buka http://localhost:3000
 *
 * Server ini meniru Vercel: menyajikan folder public/ dan menjalankan
 * fungsi di api/ sebagai /api/<nama>. Variabel rahasia dibaca dari .env.local.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const API_DIR = path.join(__dirname, 'api');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
};

function loadEnv(file) {
  try {
    for (const line of fs.readFileSync(path.join(__dirname, file), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && m[2] && !(m[1] in process.env)) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    }
  } catch (err) {
    /* file tidak ada, tidak apa-apa */
  }
}
loadEnv('.env.local');
loadEnv('.env');

// Header keamanan yang sama dengan di Vercel (dibaca dari vercel.json).
let globalHeaders = [];
try {
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  const rule = (config.headers || []).find((r) => r.source === '/(.*)');
  if (rule) globalHeaders = rule.headers;
} catch (err) {
  /* abaikan */
}

function readBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > 1e6) req.destroy();
      else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', () => resolve(''));
  });
}

async function runApi(name, req, res, url) {
  const file = path.join(API_DIR, `${name}.js`);
  if (!/^[a-z0-9_-]+$/i.test(name) || !fs.existsSync(file)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ ok: false, message: 'Not found' }));
  }

  delete require.cache[require.resolve(file)]; // selalu pakai kode terbaru
  const handler = require(file);

  req.query = Object.fromEntries(url.searchParams.entries());
  if (req.method === 'POST') {
    const raw = await readBody(req);
    try {
      req.body = raw ? JSON.parse(raw) : {};
    } catch (err) {
      req.body = raw;
    }
  }

  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
    return res;
  };

  try {
    await handler(req, res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({ ok: false, message: 'Server error' }));
    }
  }
}

function serveStatic(pathname, res) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(PUBLIC_DIR, rel));

  if (!file.startsWith(PUBLIC_DIR)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.end('404 Not found');
    }
    res.setHeader('Content-Type', MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  for (const { key, value } of globalHeaders) res.setHeader(key, value);

  if (url.pathname.startsWith('/api/')) {
    return runApi(url.pathname.slice(5).replace(/\/$/, ''), req, res, url);
  }
  return serveStatic(url.pathname, res);
});

server.listen(PORT, () => {
  console.log(`Portofolio berjalan di http://localhost:${PORT}`);
  if (!process.env.RESEND_API_KEY) {
    console.log('Catatan: RESEND_API_KEY belum diisi, jadi formulir kontak belum bisa mengirim email.');
  }
});
