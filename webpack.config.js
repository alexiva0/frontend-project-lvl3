const HtmlWebpackPlugin = require('html-webpack-plugin');

const mode = process.env.BUILD_MODE || 'development';

module.exports = {
  entry: './src/index.js',
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'index.html',
  })],
};
