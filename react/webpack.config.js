const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, './src/app.tsx'),
    // test: path.resolve(__dirname, './src/test.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
		inline: true,
		host: 'localhost',
    compress: true,
    historyApiFallback: true,
		port: 8084,
    open: true,
    hot: true
	},
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: "ts-loader"
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
      template: 'react/index.html',
      title: 'react demo!',
      inject: 'body',
      minify: {
        // removeComments: true,
        // collapseWhitespace: true
      }
    })
  ]
}
