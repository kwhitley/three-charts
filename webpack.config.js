var webpack = require('webpack')
var path = require('path')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const embedFileSize = 65536

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './example/index.js'
  ],
  output: {
    path: path.join(__dirname, '/example/build/js'),
    publicPath: '/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          plugins: ['transform-decorators-legacy']
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          'style',
          'css',
          'less'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    modules: [
      path.resolve('./client'),
      'node_modules'
    ]
  },
  devServer: {
    contentBase: './example/build',
    port: 3000,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
}
