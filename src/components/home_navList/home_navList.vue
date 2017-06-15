<template>
  <div class="navList" @mousedown.left="selectNav($event)">
    <el-menu default-active="1" class="el-menu-vertical-demo">
      <el-menu-item index="1" value="allFiles"><i class="el-icon-menu" value="allFiles"></i>所有文件</el-menu-item>
      <el-menu-item index="2" value="picture"><i class="el-icon-picture" value="picture"></i>图片</el-menu-item>
      <el-menu-item index="3" value="document"><i class="el-icon-document" value="document"></i>文档</el-menu-item>
      <el-menu-item index="4" value="video"><i class="el-icon-date" value="document"></i>视频</el-menu-item>
      <el-menu-item index="5" value="gzip"><i class="el-icon-message" value="gzip"></i>压缩包</el-menu-item>
      <el-menu-item index="6" value="music"><i class="el-icon-star-on" value="music"></i>音乐</el-menu-item>
      <el-menu-item index="7" value="others"><i class="el-icon-more" value="others"></i>其他</el-menu-item>
      <el-menu-item index="8" value="allShare"><i class="el-icon-share" value="allShare"></i>已分享文件</el-menu-item>
    </el-menu>
    <div class="progress" @mousedown.left.stop>
      <el-progress type="circle" :width="110" :percentage="roomConfig.usedRatio"></el-progress>
      <p>{{roomConfig.usedSpace}}MB / {{roomConfig.allSpace}}MB</p>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import API from '../../api'
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
      return {
        roomConfig: {}
      }
    },
    mounted () {
      this.initRoomSpace()
    },
    methods: {
      initRoomSpace () {
        API.getRoomSpace()
          .then(res => {
            res = res.data
            this.roomConfig = {
              allSpace: res.allSpace,
              usedSpace: res.allSpace - res.leftSpace,
              usedRatio: ((res.allSpace - res.leftSpace) / res.allSpace).toFixed(2) * 100
            }
          })
      },
      selectNav (event) {
        let selectFunction = event.target.getAttribute('value')
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
      padding-bottom 170px
      box-sizing border-box
      .is-active
        background rgba(0, 0, 0, .05) !important
    .progress
      position relative
      margin-top -160px
      p
        line-height 16px
        font-size 12px
        margin-top 7px
</style>
