import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const cache = new Map<string, { html: string; expires: number }>();
const TTL = 60 * 1000; // 1 minute cache

// Serve static files from the client build
app.use(express.static(path.resolve(__dirname, '../dist/client'), { index: false }));

app.get("*", async (req, res, next) => {
  const url = req.originalUrl;
  
  try {
    // Check cache first
    const cached = cache.get(url);
    if (cached && cached.expires > Date.now()) {
      return res.status(200).set({ 'Content-Type': 'text/html' }).end(cached.html);
    }

    // Read template
    const template = fs.readFileSync(
      path.resolve(__dirname, '../dist/client/index.html'),
      'utf-8'
    );

    // Load server entry and render
    // @ts-ignore - This file is generated during build
    const { render } = await import('../dist/server/entry-server.js');
    const { html } = await render(url);

    // Replace placeholder with rendered content
    const responseHtml = template.replace('<!--app-html-->', html);

    // Cache the result
    cache.set(url, {
      html: responseHtml,
      expires: Date.now() + TTL,
    });

    res.status(200).set({ 'Content-Type': 'text/html' }).end(responseHtml);
  } catch (e: any) {
    console.error('Error during SSR:', e);
    next(e);
  }
});

const PORT = process.env.PORT || 5173;

app.listen(PORT, () => {
  console.log(`🚀 SSR Production server running at http://localhost:${PORT}`);
});
