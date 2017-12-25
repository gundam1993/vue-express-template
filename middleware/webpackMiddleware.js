console.log('start webpack')

const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('../build/webpack.dev.conf')
const buildConfig = require('../config')
const compiler = webpack(webpackConfig)

const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
const webpackHotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
const staticPath = path.posix.join(buildConfig.dev.assetsPublicPath, buildConfig.dev.assetsSubDirectory)


// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    webpackHotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

module.exports = function(app, express) {
  // handle fallback for HTML5 history API
  app.use(require('connect-history-api-fallback')())
  // serve webpack bundle output
  app.use(webpackDevMiddleware)
  // enable hot-reload and state-preserving
  app.use(webpackHotMiddleware)
  app.use(staticPath, express.static('./static'))
  let _resolve
  let readyPromise = new Promise(resolve => {
    _resolve = resolve
  })
  webpackDevMiddleware.waitUntilValid(() => {
    _resolve()
  })
}
