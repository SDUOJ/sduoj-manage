/*
  Copyright 2020-2021 the original author or authors.

  Licensed under the General Public License, Version 3.0 (the "License");
you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.gnu.org/licenses/gpl-3.0.en.html
*/

// 替换 mavonEditor 的 $img2Url 方法
// 占位符识别 <img src="fileIndex" ...
function $img2Url(fileIndex, url) {
  // <img src="1"
  var reg_str = '/\\<img src=\\"' + fileIndex + '\\"/g';
  /* eslint-disable */
  var reg = eval(reg_str);
  this.d_value = this.d_value.replace(reg, '<img src="' + url + '"');
  this.$refs.toolbar_left.$changeUrl(fileIndex, url);
  this.iRender();
}

// 替换 mavonEditor 的 $imgAdd 方法
// 生产的 markdown 图片为 html 中的 img 标签，不再是 ![]()
function $imgAdd(pos, $file, isinsert) {
  if (isinsert === undefined) isinsert = true;
  var $vm = this;
  if (this.__rFilter == null) {
    this.__rFilter = /^image\//i;
  }
  this.__oFReader = new FileReader();
  this.__oFReader.onload = function (oFREvent) {
    $vm.markdownIt.image_add(pos, oFREvent.target.result);
    $file.miniurl = oFREvent.target.result;
    if (isinsert === true) {
      // 去除特殊字符
      /* eslint-disable no-useless-escape */
      $file._name = $file.name.replace(/[\[\]\(\)\+\{\}&\|\\\*^%$#@\-]/g, '');

      $vm.insertText($vm.getTextareaDom(),
        {
          prefix: `<img src="${pos}" alt="${$file._name}" style="zoom:100%;" />`,
          subfix: '',
          str: ''
        });
      $vm.$nextTick(function () {
        $vm.$emit('imgAdd', pos, $file);
      })
    }
  }
  if ($file) {
    var oFile = $file;
    if (this.__rFilter.test(oFile.type)) {
      this.__oFReader.readAsDataURL(oFile);
    }
  }
}

export function overrideFunction($vm) {
  $vm.$imgAdd = $imgAdd.bind($vm);
  $vm.$img2Url = $img2Url.bind($vm);
}
