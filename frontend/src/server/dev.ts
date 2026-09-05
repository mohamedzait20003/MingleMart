import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer as createViteServer } from "vite"

import { stateScript } from './state';

const app = express()

// Don't advertise the framework/version in response headers.
app.disable('x-powered-by')

// Built before Vite so HMR can be handed this server to upgrade. Left in
// middleware mode Vite opens its own websocket on 24678 instead: a second port
// to collide on when two runs overlap, and a second one to leak when a run is
// killed rather than closed. Sharing one port removes both.
const server = http.createServer(app)

const vite = await createViteServer({
  server: { middlewareMode: true, hmr: { server } },
  appType: "custom",
})

app.use(vite.middlewares)

app.get('/{*splat}', async (req: Request, res: Response, next: NextFunction) => {
  const url = req.originalUrl;

  if (url.startsWith('/.well-known/') || url.includes('favicon.ico')) {
    return res.status(404).end();
  }

  try {
    let template = fs.readFileSync(
      path.resolve(process.cwd(), 'index.html'),
      'utf-8'
    );
    
    // Apply Vite HTML transforms
    template = await vite.transformIndexHtml(url, template);

    // Load the server entry module
    const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

    // Render the app HTML
    const { html, preloadedState, status } = await render(url, new Headers(req.headers as Record<string, string>));

    const responseHtml = template
      .replace('<!--app-html-->', html)
      .replace('<!--app-state-->', stateScript(preloadedState));

    res.status(status).set({ 'Content-Type': 'text/html' }).end(responseHtml);
  } catch (e: unknown) {
    if (e instanceof Response) {
      const location = e.headers.get('Location');
      if (location) return res.redirect(e.status, location);
    }

    if (e instanceof Error) {
      vite.ssrFixStacktrace(e);
    }

    next(e);
  }
})

const PORT = Number(process.env.PORT) || 5173;

/**
 * How long to wait for a previous run to let go before giving up.
 *
 * Measured at roughly four and a half seconds on Windows, so the window is
 * generous: waiting a few seconds too long costs nothing, and giving up a
 * moment too early costs the whole dev server.
 */
const HANDOVER_ATTEMPTS = 60;
const HANDOVER_DELAY_MS = 250;

/** Retries to ride out silently before saying anything. Roughly a second. */
const QUIET_ATTEMPTS = 4;

server.listen(PORT);

// Bound to the event rather than passed to listen(), so the banner is printed
// only once the port is actually held. Announcing it from the listen callback
// while a retry is still pending is how a dead server ends up claiming to be
// running - the last thing printed before nothing works.
server.on('listening', () => {
  console.log(`🚀 SSR DEV running at http://localhost:${PORT}`);
});

/**
 * Ride out the handover between two runs.
 *
 * `tsx watch` replaces this process on every change under server/, and Windows
 * does not hand the port over instantly: the outgoing process is killed rather
 * than closed, and the socket lingers for seconds afterwards. The incoming
 * process therefore finds the port taken, listen() emits EADDRINUSE - and an
 * unhandled error event takes it down for good. The watcher stays alive,
 * nothing is serving, and the only symptom is that the server stopped after a
 * change.
 */
let attempts = 0;

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code !== 'EADDRINUSE') {
    throw error;
  }

  attempts += 1;

  if (attempts <= HANDOVER_ATTEMPTS) {
    // Said once, and only after the handover has taken long enough to be worth
    // mentioning. An ordinary restart resolves inside a second, and announcing
    // that reads as a stall - the last line on screen, describing something
    // already fixed by the time it is read.
    if (attempts === QUIET_ATTEMPTS + 1) {
      console.log(`Waiting for port ${PORT} to be released by the previous run...`);
    }

    setTimeout(() => server.listen(PORT), HANDOVER_DELAY_MS);
    return;
  }

  // Past the handover window this is not a race, it is a process that outlived
  // its terminal. Say so, instead of a stack trace that reads like a bug here.
  console.error(`
Port ${PORT} is held by another process that is not shutting down.
It is usually an earlier dev server that outlived its terminal.

  netstat -ano | findstr :${PORT}
  taskkill /PID <pid> /F

Or start this one elsewhere:  $env:PORT=5174; npm run dev
`);

  process.exit(1);
});

/**
 * Deliberately no SIGTERM or SIGINT handler.
 *
 * A graceful one was tried and made things worse. Registering a listener
 * replaces Node's default "exit now" behaviour, and the close it waits on never
 * finishes: `server.close()` waits for open connections, and the HMR websocket
 * above is upgraded off this same server, so it is not a connection
 * `closeAllConnections()` knows how to drop. The outgoing process then hangs on
 * the port forever, the incoming one waits and gives up, and a change to any
 * file under server/ silently stops updating anything.
 *
 * Letting the default kill stand means the port is released as the process
 * dies. Windows takes a moment to make it available again, which is what the
 * retry above is for.
 */
