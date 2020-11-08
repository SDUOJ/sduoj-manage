export default {
  data: function() {
    return {
      pageSizeOpts: [20, 40, 100]
    }
  },
  computed: {
    pageNow: {
      get: function() {
        return parseInt(this.$route.query.pageNow) || 1;
      },
      set: function(pageNow) {
        this.$router.push({ query: { ...this.$route.query, pageNow } });
      }
    },
    pageSize: {
      get: function() {
        return parseInt(this.$route.query.pageSize) || 20;
      },
      set: function(pageSize) {
        this.$router.push({ query: { ...this.$route.query, pageSize } });
      }
    },
    sortBy: {
      get: function() {
        return this.$route.query.sortBy || '';
      },
      set: function(sortBy) {
        this.$router.push({ query: { ...this.$route.query, sortBy } });
      }
    },
    ascending: {
      get: function() {
        return this.$route.query.ascending || '';
      },
      set: function(ascending) {
        this.$router.push({ query: { ...this.$route.query, ascending } });
      }
    }
  }
}
