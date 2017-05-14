'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');

module.exports = {
  context: __dirname + '/js',
  entry: {
    main: './main'
  },
  output: {
    path: __dirname,
    filename: '[name].js' /*,
    library: "main" //использование модуля в любом месте через экспорт его в глобальную ОВ
    */
  },
  watch: NODE_ENV == 'development',
  
  watchOptions: {
    aggregateTimeout: 100
  },
  
  devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : false,
  
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV)
    })/*,
    new webpack.optimize.CommonsChunkPlugin({
      name: "common"
    })*/
  ],
  
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.js']
  },

  resolveLoader: {
    modules: ['node_modules'],
    moduleExtensions: ['-loader', '*'],
    extensions: ['*', '.js']
  }
};

if (NODE_ENV == 'production') {
  module.exports.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          // don't show unreachable variables etc
          warnings:     false,
          drop_console: true,
          unsafe:       true
        }
      })
  );
}
