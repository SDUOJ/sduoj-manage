<!--
   Copyright 2020-2021 the original author or authors.

   Licensed under the General Public License, Version 3.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

        https://www.gnu.org/licenses/gpl-3.0.en.html
 -->

<template>
  <div class="clearfix container" style="height: 300px">
    <div class="_center">
      <Row style="margin-left: 60px">
        <Col span="15">
          <div class="tip" style="display: inline-block; padding-top: 40px">
            <div class="notfound">404</div>
          </div>
        </Col>
        <Col span="9">
          <img :src="Img404" alt="PIKACHU" width="300">
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import Img404 from '@/assets/404.png';
export default {
  computed: {
    Img404: () => Img404
  }
}
</script>

<style lang="less" scoped>
  ._center {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 0);
  }
  .tip {
    .notfound {
      text-align: center;
      padding-top: -20px;
      font-size: 10em;
    }
    span {
      font-size: 20px;
    }
  }
</style>
