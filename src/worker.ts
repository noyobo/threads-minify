import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { minifyJS } from './minifyJS.js';
import { existsSync, mkdirSync } from 'node:fs';

export const minify = async (options: { file: string; outputBase?: string; outputDir?: string }) => {
  const { file, outputDir, outputBase } = options;
  const mapFile = file.replace(/\.js$/, '.js.map');
  const hasMap = existsSync(mapFile);
  const map = hasMap ? await readFile(mapFile, 'utf-8') : undefined;
  const code = await readFile(file, 'utf-8');
  const result = await minifyJS({
    filename: file,
    code,
    map,
  });

  let outputFile = file;
  let outputMapFile = mapFile;

  if (outputDir && outputBase) {
    const fileName = relative(outputBase, outputFile);
    outputFile = join(outputDir, fileName);
    if (hasMap) {
      outputMapFile = outputFile.replace(/\.js$/, '.js.map');
    }
    mkdirSync(dirname(outputFile), { recursive: true });
  }

  return Promise.all(
    [
      writeFile(outputFile, result.code),
      hasMap && result.map ? writeFile(outputMapFile, result.map) : undefined,
    ].filter(Boolean),
  );
};
