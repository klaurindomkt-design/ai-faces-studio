import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let's configure larger size limits to robustly handle custom premium images uploaded as Base64 strings
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // API Endpoint to save custom portfolio models directly into the file system
  app.post("/api/save-portfolio", (req, res) => {
    try {
      const { models } = req.body;
      if (!models || !Array.isArray(models)) {
        return res.status(400).json({ 
          success: false, 
          message: "Formato de dados inválido: matriz de modelos não foi recebida." 
        });
      }

      // Format code payload gracefully preserving typed definition
      const codeOutput = `import { Model } from '../types';\n\nexport const modelsData: Model[] = ${JSON.stringify(models, null, 2)};\n`;

      const targetPath = path.join(process.cwd(), 'src', 'data', 'modelsData.ts');
      
      // Save directly to the live server codebase on disk
      fs.writeFileSync(targetPath, codeOutput, 'utf-8');

      console.log(`[API Server] Portfolio successfully hardcoded to src/data/modelsData.ts on disk.`);
      return res.json({ 
        success: true, 
        message: "Portfólio persistido no código-fonte com sucesso!" 
      });
    } catch (err: any) {
      console.error("[API Server] Save error details:", err);
      return res.status(500).json({ 
        success: false, 
        message: `Falha ao gravar arquivo: ${err.message}` 
      });
    }
  });

  // Enable dynamic Vite Asset Middleware in Development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Assets Serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully online and listening on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server starting failure:", error);
});
