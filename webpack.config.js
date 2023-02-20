const loader = require('file-loader');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js', // your main entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  watch: false, 
  experiments:{
    topLevelAwait: true
  },
  plugins: [
    new CopyWebpackPlugin({
      'patterns':[
        { from: 'src/assets', to: 'assets' }
      ]})
  ]
//   devServer: {
//     static: path.join(__dirname, 'dist'),
//     open: true
//   }
};
