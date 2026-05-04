const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },

    devServer: {
        host: '0.0.0.0',
        // Container içinde 8080, host'a 3001 olarak publish edilir (docker-compose.yml).
        // vue-cli'nin "App running at" çıktısı ve HMR socket'i bu adresi kullanır.
        public: '127.0.0.1:3001',
        clientLogLevel: 'warning',
        hot: true,
        contentBase: 'dist',
        compress: true,
        open: true,
        overlay: { warnings: false, errors: true },
        publicPath: '/',
        quiet: true,
        watchOptions: {
            poll: false,
            ignored: /node_modules/
        }
    },

    chainWebpack: config => {
        config.plugins.delete('prefetch-index'),
            config.module
                .rule('vue')
                .use('vue-loader')
                .tap(args => {
                    args.compilerOptions.whitespace = 'preserve'
                })
    },

    productionSourceMap: true,   // GEÇİCİ: hata stack trace'ini orijinal dosya/satıra map'lemek için açık. Test bittikten sonra false'a geri al.

    assetsDir: './assets/'
    /*configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                { from: 'src/assets/img', to: 'assets/img' },
                { from: 'src/assets/fonts', to: 'assets/fonts' }
            ])
        ]
    }*/,

    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "@/assets/scss/_variables.scss";'
            }
        }
    }
}
