/*
 * Copyright 2020-2021 the original author or authors.
 *
 * Licensed under the General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 */

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
    disableHostCheck: true,
    port: 8081
  }
}
