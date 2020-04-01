const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: './src/js/index.js',
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'), // legt Ordner fest --> __dirname ist aktueller Ordner(config)
    publicPath: '/',
  },

  // babel config
  module: {
    rules: [
      {
        test: /\.m?js$/, // test property identifies which file or files should be transformed
        exclude: /(node_modules|bower_components)/,

        // use property indicates which loader should be used to do the transforming
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // 'style-loader' dev mode with inline styles
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer'),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: 'compressed',
              },
              webpackImporter: false,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin([{
      from: 'static/**/*',
      to: '.',
    },
    ], { copyUnmodified: true }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
};
