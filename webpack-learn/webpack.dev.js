const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/app.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, "node_modules"),
        include: path.resolve(__dirname, "src")
      },
      {
        test: /\.css$/,
        // use: ['style-loader', 'css-loader']
        use: [miniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.txt$/,
        loader: path.resolve(__dirname, './src/loader/txt.js')
      }
    ]
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
      title: 'webpack demo!',
      inject: 'body',
      minify: {
        // removeComments: true,
        // collapseWhitespace: true
      }
    })
  ]
}