// server.js
// Simple custom server to run a Next.js production build.
// Usage (after `npm run build`):
//   NODE_ENV=production node server.js    (Linux / cPanel)
//   set NODE_ENV=production&& node server.js (Windows)

const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((req, res) => {
      // Optional: add simple security headers here if needed
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'SAMEORIGIN');
      handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Next server listening on http://localhost:${port} (dev: ${dev})`);
    });

    // Graceful shutdown
    const shutDown = () => {
      console.log('> Shutting down server...');
      server.close(() => process.exit(0));
    };

    process.on('SIGINT', shutDown);
    process.on('SIGTERM', shutDown);
  })
  .catch((err) => {
    console.error('Error preparing Next app:', err);
    process.exit(1);
  });
