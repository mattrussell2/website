const loader = require('file-loader');
const path = require('path');

module.exports = {
  entry: './src/index.js', // your main entry point for your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  watch: false, 
  experiments:{
    topLevelAwait: true
  }
//   devServer: {
//     static: path.join(__dirname, 'dist'),
//     open: true
//   }
};
