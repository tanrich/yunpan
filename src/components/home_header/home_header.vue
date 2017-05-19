<template>
  <Header class="header">
    <el-row>
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="22">
        <router-link to="/" class="logo_name">
          <div class="logo">
            <img src="../../common/images/logo.png" height="50" alt="logo">
          </div>
          <div class="name">重邮云盘</div>
        </router-link>
        <div class="user">
          <div class="user-info">
            <span class="user-avatar">
              <img src="./熊猫.jpg" alt="user-logo" width="30" height="30">
            </span>
            <span class="user-name">{{username}}</span>
          </div>
          <div class="logout" @click="logout">退出</div>
        </div>
      </el-col>
    </el-row>
  </Header>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'
  import API from '../../api'
  import { Row, Col } from 'element-ui'
  Vue.use(Row)
  Vue.use(Col)

  export default {
    name: '',
    data () {
      return {}
    },
    props: ['username'],
    methods: {
      logout () {
        API.logout()
          .then(res => {
            res = res.data
            if (res.status === 1) {
              console.log('退出成功')
              this.$router.push({path: '/'})
            }
          })
          .catch(err => console.log(err))
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .header
    padding 10px 0
    background #eff4f8
    .logo_name
      display inline-block
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
    .user
      display inline-block
      float right
      line-height 50px
      font-size 14px
      .user-info
        margin-right 25px
        display inline-block
        .user-avatar
          display inline-block
          width 30px
          height 30px
          border-radius 50%
          overflow hidden
          position relative
          top 10px
          margin-right 5px
        .user-name
          display inline-block
      .logout
        display inline-block
</style>
