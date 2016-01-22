var babelOptions = {
  presets: ['es2015', 'react']
};

module.exports = function (config) {
  config.set({
    basePath: './',
    frameworks: ['phantomjs-shim', 'mocha', 'chai'],

    files: [
      'test/**/*.spec.js'
    ],
    preprocessors: {
      'test/**/*.spec.js': 'webpack'
    },

    reporters: ['coverage', 'dots'],

    webpack: {
      babel: babelOptions,
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: babelOptions
      },
      module: {
        preLoaders: [
          // Transpile only tests
          {
            test: /\.spec\.jsx?/,
            loader: 'babel',
            exclude: /node_modules/
          },
          // Transpile all project without tests
          {
            test: /\.jsx?$/,
            loader: 'isparta',
            exclude: [
              /node_modules/,
              /\.spec\.jsx?/
            ]
          }
        ]
      }
    },
    webpackServer: {
      noInfo: true
    },

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS'],
    autoWatch: true,
    singleRun: false
  });
};
