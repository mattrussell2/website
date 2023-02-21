const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new CopyWebpackPlugin({
      'patterns':[
        { from: 'src/assets', to: 'assets' }, 
        { from: path.resolve(__dirname, 'CNAME'), toType: 'file', to: 'CNAME'}
      ]})
  ]
};
