/**
 * Created by Tommy Huang on 17/12/25.
 */
console.log(`Running on ${process.env.NODE_ENV} mode`)
const path = require('path')
const express = require('express')
const config = require('config-lite')({
  config_basedir: __dirname,
  config_dir: 'server_config'
})

const DIST_DIR = path.join(__dirname, 'dist')
const STATIC_DIR = path.join(__dirname, 'static')
const PRD_HTML_FILE = path.join(__dirname, 'dist/index.html')

let app = express()

//开发模式下使用 webpackDevMiddleware 和 webpackHotMiddleware 热更新页面
if (process.env.NODE_ENV !== 'production') {
  const webpackMiddleware = require('./middleware/webpackMiddleware')
  webpackMiddleware(app, express)
} else {
  app.use(express.static(DIST_DIR))
  app.use(express.static(STATIC_DIR))
  app.get('*', (req, res) => res.sendFile(PRD_HTML_FILE))
}


app.listen(3000, () => console.log('Example app listening on port 3000!'))

