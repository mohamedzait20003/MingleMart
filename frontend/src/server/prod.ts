import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { LRUCache } from 'lru-cache';
import { parseCookie } from 'cookie';

import cookieNames from '../common/data/cookies.json';
import { fileURLToPath } from 'node:url';


import { stateScript } from './state';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.disable('x-powered-by');

const pages = new LRUCache<string, string>({
  max: 500,
  maxSize: 64 * 1024 * 1024,
  sizeCalculation: (html) => html.length,
  ttl: 60 * 1000,
});

/**
 * Whether this request carries no signed-in identity.
 *
 * Parsed rather than substring-matched, and checks both cookies: `session` is
 * readable, so a user can delete it in devtools while `access` still
 * authenticates them — and that render must not be cached as if anonymous.
 */
function isAnonymous(header?: string): boolean {
  if (!header) {
    return true;
  }

  const cookies = parseCookie(header);
  return !cookies[cookieNames.session] && !cookies[cookieNames.access];
}

app.use(express.static(path.resolve(__dirname, '../../dist/client'), { index: false }));

app.get('/{*splat}', async (req, res, next) => {
  const url = req.originalUrl;

  try {
    const cacheable = isAnonymous(req.headers.cookie);

    if (cacheable) {
      const cached = pages.get(url);
      
      if (cached) {
        return res.status(200).set({ 'Content-Type': 'text/html' }).end(cached);
      }
    }

    const template = fs.readFileSync(
      path.resolve(__dirname, '../../dist/client/index.html'),
      'utf-8'
    );

    // Load server entry and render
    // @ts-expect-error - This file only exists after `npm run build`.
    const { render } = await import('../../dist/server/entry-server.js');
    const { html, preloadedState, status } = await render(url, new Headers(req.headers as Record<string, string>));

    const responseHtml = template.replace('<!--app-html-->', html).replace('<!--app-state-->', stateScript(preloadedState));

    // Only successful pages are cached. A 404 body is cheap to re-render and
    // caching it would let one bad URL occupy the cache indefinitely.
    if (cacheable && status === 200) {
      pages.set(url, responseHtml);
    }

    res.status(status).set({ 'Content-Type': 'text/html' }).end(responseHtml);
  } catch (e: unknown) {
    if (e instanceof Response) {
      const location = e.headers.get('Location');
      if (location) return res.redirect(e.status, location);
    }

    console.error('Error during SSR:', e);
    next(e);
  }
});

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`🚀 SSR Production server running at http://localhost:${PORT}`);
});
