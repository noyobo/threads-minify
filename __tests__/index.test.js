import { describe, it, expect, beforeAll } from 'vitest';
import { join, relative } from 'path';
import fs from 'fs';
import { threadsMinify } from '../dist/index';

function exploreDir(directory, jsFiles) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  for (const file of files) {
    const fullPath = join(directory, file.name);
    if (file.isDirectory()) {
      exploreDir(fullPath, jsFiles);
    } else if (file.isFile()) {
      jsFiles.push(fullPath);
    }
  }
  return jsFiles.map((file) => relative(directory, file));
}

const actualDir = join(__dirname, './actual');
const expectDir = join(__dirname, './expect');

describe('threadsMinify', () => {
  beforeAll(async () => {
    await threadsMinify(join(__dirname, './files'), {
      outputDir: expectDir,
      outputBase: join(__dirname, './'),
    });
  });

  it('should match file contents between actual and expected directories', () => {
    const actualFiles = exploreDir(actualDir, []);
    const expectFiles = exploreDir(expectDir, []);

    // 检查文件列表是否一致
    expect(actualFiles.sort()).toEqual(expectFiles.sort());

    // 检查每个文件的内容是否一致
    actualFiles.forEach((file) => {
      const actualContent = fs.readFileSync(join(actualDir, file), 'utf-8');
      const expectContent = fs.readFileSync(join(expectDir, file), 'utf-8');
      expect(actualContent).toBe(expectContent);
    });
  });
});