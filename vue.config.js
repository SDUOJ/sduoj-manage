const path = require('path');
module.exports = {
  chainWebpack: config => config.resolve.alias
    .set('@', path.join(__dirname, 'src'))
    .set('_c', path.join(__dirname, 'src/components'))
    .set('_u', path.join(__dirname, 'src/utils')),
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: 'less-loader',
              options: { lessOptions: { javascriptEnabled: true } }
            }
          ]
        }
      ]
    }
  },
  devServer: {
    disableHostCheck: true
  }
}
