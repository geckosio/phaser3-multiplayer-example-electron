const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: ['./www/src/app.ts'],
  output: {
    publicPath: '',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
  },
  devServer: {
    open: true,
    // host: '0.0.0.0',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin([{ from: 'www/src/assets', to: 'assets' }]),
    new HtmlWebpackPlugin({
      template: 'www/src/index.html',
    }),
  ],
}
