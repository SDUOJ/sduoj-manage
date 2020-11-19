export default {
  data: function() {
    return {
      excelData: [],
      excelColumns: []
    }
  },
  methods: {
    beforeUpload: function(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$Message.warn('Please do not upload files larger than 1m in size.');
      return false;
    },
    handleSuccess: function({ results, header }) {
      this.excelData = results.slice(1);
      this.excelColumns = header.map(o => {
        return {
          title: o,
          key: o
        }
      });
    },
    clearExcel: function() {
      this.excelData = [];
      this.excelColumns = [];
    }
  }
}
