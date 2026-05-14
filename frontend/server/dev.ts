import fs from 'fs';
import path from 'path';
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer as createViteServer } from "vite"

async function start() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  })

  app.use(vite.middlewares)

  app.get("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    // Ignore browser/devtools probing requests
    if (url.startsWith('/.well-known/') || url.includes('favicon.ico')) {
      return res.status(404).end();
    }

    try {
      // Read the index.html template
      let template = fs.readFileSync(
        path.resolve(process.cwd(), 'index.html'),
        'utf-8'
      );

      // Apply Vite HTML transforms
      template = await vite.transformIndexHtml(url, template);

      // Load the server entry module
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      // Render the app HTML and extract styles
      const { html, styles } = await render(url);

      // Replace placeholders with rendered HTML and styles
      const responseHtml = template
        .replace('<!--ssr-styles-->', styles || '')
        .replace('<!--app-html-->', html);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(responseHtml);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  })

  app.listen(5173, () => {
    console.log("🚀 SSR DEV running at http://localhost:5173");
  });
}

start()
