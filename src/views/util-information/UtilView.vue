<template>
  <div style="background:#eee; padding: 20px">
    <Row :gutter="50">
      <Col span="10" v-for="(item, index) in utilSelectorConfig" :key="item.introduction+index.toString()">
        <UtilMenuCard
        :util-title="item.title"
        :util-introduction="item.introduction"
        @change-dialog="changeDialog(item.name)"></UtilMenuCard>
      </Col>
    </Row>

    <comprehensiveView ref="comprehensive"></comprehensiveView>

    <announcement-view ref="announcement"></announcement-view>
  </div>
</template>

<script>
import UtilMenuCard from '_c/Card/UtilMenuCard';
import announcementView from './sub-view/announcementView';
import comprehensiveView from './sub-view/comprehensiveView';
import moment from 'moment';
export default {
  components: {
    UtilMenuCard,
    comprehensiveView,
    announcementView
  },
  data: function () {
    return {
      utilSelectorConfig: [
        {
          name: 'comprehensive',
          title: 'Export the contest comprehensive report',
          introduction: '根据提供的组号，比赛号，学生等配置导出比赛数据'
        },
        {
          name: 'announcement',
          title: 'Edit the announcement',
          introduction: '查看、增加、删除、修改公告'
        }
      ]
    }
  },
  methods: {
    changeDialog (item) {
      this.$refs[item].visible = true
    }
  },
  filters: {
    // 格式化比赛进行时长
    getDuration: (start, end) => {
      const diff = parseInt(end) - parseInt(start);
      const duration = moment.duration(diff, 'milliseconds');
      const minutes = duration.minutes() < 10 ? '0' + duration.minutes() : duration.minutes().toString();
      const seconds = duration.seconds() < 10 ? '0' + duration.seconds() : duration.seconds().toString();
      return [Math.floor(duration.asHours()), minutes, seconds].join(':');
    },
    parseInt: val => parseInt(val)
  },
  computed: {
    moment: () => moment
  },
  watch: {
  }
}
</script>

<style scoped lang="less">

.prefix {
  padding: 5px;
  line-height: 1;
}

.timeline-prefix {
  margin: 30px 5px 20px;
  line-height: 1;
  color: cornflowerblue;
}

.tag-card {
  margin: 10px;
  padding: 10px;
}

.add-config-btn {
  margin: 10px;
  float: right;
}

</style>
