const { threadsMinify } = require('../dist/index');
const { join } = require('path');

threadsMinify(join(__dirname, './files'), {
  outputDir: join(__dirname, './out'),
  outputBase: join(__dirname, './')
});