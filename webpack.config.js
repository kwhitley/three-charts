var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var path = require('path')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const embedFileSize = 65536

module.exports = {
  context: __dirname,
  devtool: isProd ? 'hidden-source-map' : 'source-map', //cheap-eval-source-map
  entry: {
    app: ['./client/index.js'],
    vendors: [
      'async',
      'classnames',
      'highcharts',
      'leaflet',
      'leaflet-bing-layer',
      'react',
      'react-dom',
      'react-highcharts',
      'react-leaflet',
      'react-redux',
      'react-router',
      'react-router-redux',
      'react-select',
      'redux',
      'redux-immutable',
      'redux-registry'
    ]
  },
  output: {
    path: path.join(__dirname, '/dist/client/js'),
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
      },
      {test: /\.svg$/, loader: `url?limit=${embedFileSize}&mimetype=image/svg+xml`},
      {test: /\.png$/, loader: `url?limit=${embedFileSize}&mimetype=image/png`},
      {test: /\.jpg$/, loader: `url?limit=${embedFileSize}&mimetype=image/jpeg`},
      {test: /\.gif$/, loader: `url?limit=${embedFileSize}&mimetype=image/gif`}
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    modules: [
      path.resolve('./client'),
      'node_modules'
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new CopyWebpackPlugin([{ from: 'static', to: path.join(__dirname, '/dist/client') }]),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.js' }),
  ]
}
