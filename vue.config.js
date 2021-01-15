/*
 * Copyright 2020-2021 the original author or authors.
 *
 * Licensed under the General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const resolve = dir => require('path').join(__dirname, dir);

module.exports = {
  chainWebpack: config => config.resolve.alias
    .set('@', resolve('src'))
    .set('_c', resolve('src/components'))
    .set('_u', resolve('src/utils')),
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
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'node_modules/mavon-editor/dist/highlightjs',
            to: resolve('dist/highlightjs'), // 插件将会把文件导出于/dist/highlightjs之下
          },
          {
            from: 'node_modules/mavon-editor/dist/markdown',
            to: resolve('dist/markdown'), // 插件将会把文件导出于/dist/markdown之下
          },
          {
            from: 'node_modules/mavon-editor/dist/katex', // 插件将会把文件导出
            to: resolve('dist/katex')
          }]
      })
    ]
  },
  devServer: {
    disableHostCheck: true,
    port: 8081
  }
}
