module.exports = {
    entry: "./webpack/entry.js",
    output: {
        path: 'src/assets/javascripts/',
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015']
            }
        }]
    }
};