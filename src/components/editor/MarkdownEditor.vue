<template>
  <div>
    <mavon-editor ref="md" @imgAdd="$imgAdd" v-model="description.markdownDescription" style="min-height: 600px"/>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import api from '_u/api';

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

export default {
  name: 'MarkdownEditor',
  components: {mavonEditor},
  data: function() {
    return {
      description: {
        markdownDescription: ''
      }
    }
  },
  methods: {
    $imgAdd: function(pos, file) {
      const formdata = new FormData();
      formdata.append('files', file);
      api.multiUpload(formdata).then(ret => {
        const $vm = this.$refs.md;
        $vm.$img2Url(pos, `/api/filesys/download/${ret[0].id}/${ret[0].name}`);
        $vm.$refs.toolbar_left.img_file = [[0, null]];
        $vm.$refs.toolbar_left.num = 0;
      }, err => {
        this.$Message.error(err.message);
      })
    },
    $attachAdd: function(files) {
      return new Promise((resolve, reject) => {
        const formdata = new FormData();
        files.forEach(file => {
          formdata.append('files', file.file)
        });
        api.multiUpload(formdata).then(ret => {
          ret.forEach(o => {
            const $vm = this.$refs.md;
            // 去除特殊字符
            /* eslint-disable no-useless-escape */
            const _name = o.name.replace(/[\[\]\(\)\+\{\}&\|\\\*^%$#@\-]/g, '');
            $vm.insertText($vm.getTextareaDom(),
              {
                prefix: '[' + _name + '](' + `/api/filesys/download/${o.id}/${o.name.replace(' ', '_')}` + ')',
                subfix: '',
                str: ''
              }
            );
          });
          resolve();
        }, reject);
      })
    },
    $clear: function() {
      const $vm = this.$refs.md;
      $vm.$refs.toolbar_left.img_file = [[0, null]];
      $vm.$refs.toolbar_left.num = 0;
    },
    setDescription: function(description) {
      this.description = description;
    }
  },
  mounted: function() {
    const $vm = this.$refs.md;
    $vm.$imgAdd = $imgAdd.bind($vm);
    $vm.$img2Url = $img2Url.bind($vm);
  }
}
</script>

<style scoped>

</style>
