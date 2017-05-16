<template>
  <div class="navList">
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-menu-item index="1"><i class="el-icon-menu"></i>所有文件</el-menu-item>
      <el-menu-item index="2"><i class="el-icon-picture"></i>图片</el-menu-item>
      <el-menu-item index="3"><i class="el-icon-document"></i>文档</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-date"></i>视频</el-menu-item>
      <el-menu-item index="5"><i class="el-icon-message"></i>种子</el-menu-item>
      <el-menu-item index="6"><i class="el-icon-star-on"></i>音乐</el-menu-item>
      <el-menu-item index="7"><i class="el-icon-more"></i>其他</el-menu-item>
    </el-menu>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Row, Col, Menu, MenuItem, MenuItemGroup, Submenu } from 'element-ui'
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Menu)
  Vue.use(MenuItem)
  Vue.use(MenuItemGroup)
  Vue.use(Submenu)
  export default {
    name: '',
    data () {
      return {}
    },
    methods: {}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .content
    ul
      margin-top 10px
      background #eff4f8
</style>
