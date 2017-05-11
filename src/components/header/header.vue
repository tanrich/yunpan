<template>
  <Header class="header">
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <div class="logo">
          <img src="./logo.png" height="50" alt="logo">
        </div>
        <div class="name">重邮云盘</div>
      </el-col>
    </el-row>
  </Header>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Row, Col } from 'element-ui'
  Vue.use(Row)
  Vue.use(Col)

  export default {
    name: '',
    data () {
      return {}
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .header
    padding 10px 0
    background #eff4f8
    .logo, .name
      display inline-block
      vertical-align top
      img
        display block
    .name
      line-height 50px
      font-size 20px
      font-weight bold
      color #333
      margin-left 10px
</style>
