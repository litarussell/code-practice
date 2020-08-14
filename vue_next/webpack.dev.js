const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

console.log('0------->', __dirname)

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/app.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  devServer: {
		contentBase: path.resolve(__dirname, 'dist'),
		inline: true,
		host: 'localhost',
		compress: true,
		port: 8083,
		open: true
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
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
      title: 'vue next demo!',
      inject: 'body',
      minify: {
        // removeComments: true,
        // collapseWhitespace: true
      }
    })
  ]
}