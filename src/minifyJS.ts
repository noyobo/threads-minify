import { transform } from '@swc/core';

export const minifyJS = async (options: { filename?: string; code: string; map?: string }) => {
  const { filename: fileName, code: inputCode, map: inputMap } = options;
  let map = inputMap;
  let sourceMaps = !!map;

  return await transform(inputCode, {
    filename: fileName,
    sourceMaps: sourceMaps,
    inputSourceMap: sourceMaps ? map : undefined,
    minify: true,
    jsc: {
      target: 'es5',
      minify: {
        compress: {
          defaults: false,
          booleans: true,
          collapse_vars: true,
          comparisons: true,
          computed_props: true,
          conditionals: true,
          dead_code: true,
          directives: true,
          drop_debugger: true,
          hoist_props: true,
          if_return: true,
          join_vars: true,
          keep_fargs: true,
          negate_iife: true,
          properties: true,
          side_effects: true,
          switches: true,
          typeofs: true,
          unused: true
        },
        mangle: {
          toplevel: false,
          keep_classnames: false,
          keep_fnames: false,
          keep_private_props: false,
          ie8: false,
          safari10: false
        },
        format: {
          asciiOnly: true,
          wrapIife: true
        }
      }
    },
    module: { type: 'commonjs', strictMode: false }
  }).catch((e) => {
    console.log('\n');
    if (!fileName) {
      console.error('minipack', 'minifyJS code:');
      console.log(inputCode);
    } else {
      console.error('minipack', 'minifyJS error:', fileName);
    }
    throw e;
  });
};
