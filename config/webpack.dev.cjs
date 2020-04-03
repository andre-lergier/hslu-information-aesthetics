const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const common = require('./webpack.common.cjs');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({ inject: true, template: './index.html' }),
  ],
  devtool: 'inline-cheap-source-map',
  devServer: {
    contentBase: path.join(__dirname, '../static'), // path to static files
    compress: true,
    port: 9000,
  },
});
