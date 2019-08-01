// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

module.exports = {
  devServer: {
    proxy: {
      "/api/*": {
        target: "http://localhost:8081",
        secure: false
      }
    },
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: '8080',
    https: true,
    hotOnly: false
  },
/*  
  configureWebpack: {
    plugins: [
      new VuetifyLoaderPlugin()
    ]
  },
*/  
  chainWebpack: config => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use("i18n")
        .loader("@kazupon/vue-i18n-loader")
        .end();
  },
  pluginOptions: {
    i18n: {
      locale: 'sv',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}


