var path = require('path');
var LiveReloadPlugin = require('webpack-livereload-plugin');

module.exports = {
    entry: {
        app: ['./app'],
    },
    resolve: {
        modulesDirectories: ['node_modules', './app'],
        extensions: ['', '.js', '.jsx'],
    },
    output: {
        path: path.join(__dirname, './assets/'),
        publicPath: '/assets/',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loaders: ['babel?presets[]=react&presets[]=es2015'],
            },
        ],
    },
    plugins: [
        new LiveReloadPlugin({
            appendScriptTag: true,
        }),
    ],
};
