var wallabyWebpack = require('wallaby-webpack');

module.exports = function (wallaby) {

    var webpackPostprocessor = wallabyWebpack({
        // webpack options
        resolve: {
            extensions: ['', '.js', '.jsx'],
        },
    });

    return {
        files: [
            { pattern: 'node_modules/karma-phantomjs-shim/shim.js', instrument: false },
            { pattern: 'node_modules/chai/chai.js', instrument: false },
            { pattern: 'node_modules/sinon/pkg/sinon.js', instrument: false },
            { pattern: 'node_modules/sinon-chai/lib/sinon-chai.js', instrument: false },

            { pattern: 'src/**/*.js*', load: false },
            { pattern: 'test/utils.js', load: false },
        ],

        tests: [
            { pattern: 'test/**/*.spec.js*', load: false },
        ],

        compilers: {
            '**/*.js*': wallaby.compilers.babel({
                presets: ['es2015', 'react'],
            }),
        },

        postprocessor: webpackPostprocessor,

        testFramework: 'mocha',

        setup: function () {
            window.expect = chai.expect;
            window.should = undefined;
            window.should = chai.should();

            window.__moduleBundler.loadTests();
        },
    };
};
