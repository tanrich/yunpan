<template>
  <div class="navList" @mousedown.left="selectNav($event)">
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-menu-item index="1"><i class="el-icon-menu" value="所有文件"></i>所有文件</el-menu-item>
      <el-menu-item index="2"><i class="el-icon-picture"></i>图片</el-menu-item>
      <el-menu-item index="3"><i class="el-icon-document"></i>文档</el-menu-item>
      <el-menu-item index="4"><i class="el-icon-date"></i>视频</el-menu-item>
      <el-menu-item index="5"><i class="el-icon-message"></i>压缩包</el-menu-item>
      <el-menu-item index="6"><i class="el-icon-star-on"></i>音乐</el-menu-item>
      <el-menu-item index="7"><i class="el-icon-more"></i>其他</el-menu-item>
    </el-menu>
    <div class="progress">
      <el-progress type="circle" :percentage="28.9"></el-progress>
      <p>579.61G / 2063G</p>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Row, Col, Menu, MenuItem, MenuItemGroup, Submenu, Progress } from 'element-ui'
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Menu)
  Vue.use(MenuItem)
  Vue.use(MenuItemGroup)
  Vue.use(Submenu)
  Vue.use(Progress)
  export default {
    name: '',
    data () {
      return {}
    },
    methods: {
      selectNav (event) {
        let selectFunction = event.target.innerText || event.target.getAttribute('value')
        this.$emit('selectNav', selectFunction)
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .navList
    position relative
    height inherit
    ul
      height 100%
      margin-top 10px
      background #eff4f8
      padding-bottom 200px
      box-sizing border-box
      .is-active
        background rgba(0,0,0,.05) !important
    .progress
      position relative
      margin-top -180px
      p
        line-height 16px
        font-size 14px
        margin-top 7px
</style>
