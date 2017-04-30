export default {
  entry: 'src/index.js',
  targets: [
    {
      format: 'umd',
      moduleName: 'fpstiming',
      dest: 'build/fpstiming.js'
    },
    {
      format: 'es',
      dest: 'build/fpstiming.module.js'
    }
  ]
};
