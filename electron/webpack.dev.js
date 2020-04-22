const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'development',
  target: 'node',
  entry: ['./electron/src/game.ts'],
  output: {
    publicPath: '',
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
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
  externals: [nodeExternals()],
}
