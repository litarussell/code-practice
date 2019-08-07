const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, 'app.tsx'),
    // test: path.resolve(__dirname, './src/test.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
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
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          {
          loader: "ts-loader",
          options: {
            // 自动将所有.vue文件转化为.vue.tsx文件
            appendTsSuffixTo: [/\.vue$/]
          }
        }]
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      title: 'vue demo!',
      inject: 'body',
      minify: {
        // removeComments: true,
        // collapseWhitespace: true
      }
    })
  ]
}
