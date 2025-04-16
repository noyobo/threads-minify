import fs from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { minifyJS } from './minifyJS.js';

export const minify = async (options: {
  file: string;
  outputBase?: string;
  outputDir?: string;
}) => {
  const { file, outputDir, outputBase } = options;
  const mapFile = file.replace(/\.js$/, '.map.js');
  const hasMap = fs.existsSync(mapFile);
  const map = hasMap ? fs.readFileSync(mapFile, 'utf-8') : undefined;
  const code = fs.readFileSync(file, 'utf-8');
  const result = await minifyJS({
    filename: file,
    code,
    map
  });

  let outputFile = file;
  let outputMapFile = mapFile;

  if (outputDir && outputBase) {
    const fileName = relative(outputBase, outputFile);
    outputFile = join(outputDir, fileName);
    if (hasMap) {
      outputMapFile = outputFile.replace(/\.js$/, '.map.js');
    }
  }
  fs.mkdirSync(dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, result.code);
  if (hasMap && result.map) {
    fs.writeFileSync(outputMapFile, result.map);
  }
};

