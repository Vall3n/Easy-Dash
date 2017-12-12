const path = require('path');
const webpack  = require('webpack');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
const UglifyEsPlugin = require('uglify-es-webpack-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    console.warn('env =>', env);
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 'app': 'aurelia-bootstrapper' },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['ClientApp', 'node_modules']
        },
        output: {
            path: path.resolve(bundleOutputDir),
            publicPath: 'dist/',
            filename: '[name].js'
        },
        module: {
            rules: [
                { test: /\.ts$/i, include: /ClientApp/, use: 'ts-loader?silent=true' },
                { test: /\.html$/i, use: 'html-loader' },
                { test: /\.scss$/i, issuer: /\.html$/i, loader: 'css-loader!sass-loader' },
                { test: /\.css$/i, use: [isDevBuild ? 'css-loader' : 'css-loader?minimize'] },
                { test: /.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=25000' }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            new copyWebpackPlugin([
                {
                    context: './node_modules/bootswatch/dist',
                    from: '**/*.min.css',
                    to: 'bootswatch'
                }
            ]),
            new AureliaPlugin({ aureliaApp: 'boot' })
        ].concat(isDevBuild ? [
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]')  // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            new UglifyEsPlugin()
        ])
    }];
}
