import fs from 'node:fs';
import path from 'node:path';
import Piscina from 'piscina';
import { error } from 'node:console';

export const threadsMinify = (inputDir: string, options?: {
  outputBase: string, outputDir: string
}) => {
  const { outputDir, outputBase } = options || {};
  const jsFiles: string[] = [];
  exploreDir(inputDir, jsFiles);
  const pool = new Piscina({ filename: path.join(__dirname, 'worker.js') });

  Promise.all(jsFiles.map(file => {
    return pool.run({ file, outputDir, outputBase }, { name: 'minify' });
  })).catch((err) => {
    error('Error in minification:', err);
  })
};

function exploreDir(directory: string, jsFiles: string[]) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    if (file.isDirectory()) {
      exploreDir(fullPath, jsFiles);
    } else if (file.isFile() && path.extname(file.name) === '.js') {
      jsFiles.push(fullPath);
    }
  }
}

