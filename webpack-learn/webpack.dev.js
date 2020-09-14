const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/app.ts'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name].js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
		inline: true,
		host: 'localhost',
    compress: true,
    historyApiFallback: true,
		port: 8085,
    open: true,
    hot: true
  },
  resolve: {
    alias: {
      css: './css/',
      components: './components/'
    },
    extensions: ['.ts', '.js', '.json']
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
        use: [miniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        // loader: 'style-loader!css-loader!less-loader'
        use: [miniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.txt$/,
        loader: path.resolve(__dirname, './src/loader/txt.js')
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
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
  ],
  devtool: 'source-map'
}