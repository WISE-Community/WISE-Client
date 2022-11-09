const webpack = require('webpack');

module.exports = {
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'url-loader'
          }
        ],
        type: 'javascript/auto'
      }
    ],
  },
};
