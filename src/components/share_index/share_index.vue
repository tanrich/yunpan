<template>
  <div class="share_index">
    <div class="enCode" v-show="code">
      <div class="bg"></div>
      <div class="container">
        <div class="logo"></div>
        <div class="detail">
          <div class="header">
            <div class="avatar">
              <div class="photo_frame">
                <img src="./熊猫.jpg" width="44">
              </div>
            </div>
            <div class="info">
              <span class="username">{{shareName}}</span>
              <span>给您加密分享了文件</span>
            </div>
          </div>
          <div class="body">
            <div class="title">请输入提取码：</div>
            <div class="input_box">
              <input type="text" v-model="inputCode" @keydown.enter.stop="checkCode">
              <button type="button" @click.stop="checkCode">提取文件</button>
            </div>
            <div class="error" v-show="errTips">提取码错误</div>
          </div>
        </div>
      </div>
    </div>
    <div class="deCode" v-show="!code">
      <VHomeHeader style="border-bottom: 1px solid #dee9f5"></VHomeHeader>
      <div class="file_content">
        <div class="file_header">
          <div class="name">{{fileInfo.fileId.fileName}}</div>
          <div class="time">
            <div class="share_time"><i class="el-icon-time"></i>{{fileInfo.dateTime}}</div>
            <div class="last_time">失效时间：{{fileInfo.status}}</div>
          </div>
          <el-button type="info" class="download" size="small" @click.stop="download(fileInfo.fileId.id)"><i
            class="el-icon-arrow-down"></i> 下载
          </el-button>
          <a target="_self" ref="download" :href="downloadURL" download="123" hidden></a>
        </div>
        <div class="file_body">
          <div class="file_body_center">
            <div class="file_icon"></div>
            <div class="file_size">文件大小：{{fileInfo.fileId.size}} MB</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import { Message, Button } from 'element-ui'
  import Vue from 'vue'
  import VHomeHeader from '../home_header/home_header.vue'
  import API from '../../api'
  import axios from 'axios'

  Vue.use(Message)
  Vue.use(Button)
  export default {
    name: '',
    data () {
      return {
        hash: '',
        inputCode: '',
        code: true,
        errTips: false,
        fileInfo: {
          fileId: {}
        },
        downloadURL: ''
      }
    },
    components: {
      VHomeHeader
    },
    created () {
      this.hash = decodeURIComponent(location.hash)
      if (this.hash.indexOf('?') === -1) {
        this.$router.push({path: '/'})
        return
      }
    },
    mounted () {
      Message.closeAll()
    },
    computed: {
      shareUrl () {
        return this.hash.substr(this.hash.indexOf('?'))
      },
      shareName () {
        return this.hash.substr(this.hash.indexOf('=') + 1, this.hash.length - 5 - this.hash.indexOf('='))
      }
    },
    methods: {
      // 输入验证码确认事件
      checkCode () {
        let url = `${API.baseURL}/share${this.shareUrl}&code=${this.inputCode}`
        axios.get(url)
          .then(res => {
            res = res.data
            if (res.status === 1) {
              this.code = false
              this.fileInfo = res.data
              console.log(this.fileInfo)
            } else {
              this.errTips = true
            }
          })
          .catch(err => {
            console.error(err)
            Message.error({
              showClose: true,
              message: '网络出现故障',
              duration: 2000
            })
          })
      },
      download (id) {
        this.downloadURL = API.baseURL + '/download?id=' + id
        this.$nextTick(() => {
          this.$refs['download'].click()
        })
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .share_index
    position relative
    height 100%
    width 100%
    background #eef2f6
    .bg
      position absolute
      height 400px
      width 100%
      background url("./share_bg.png")
      background-size 100% 100%
      left 0
      bottom 0
    .container
      position absolute
      display block
      width 460px
      left 50%
      top 50%
      margin-left -230px
      margin-top -240px
      z-index 1
      .logo
        width 228px
        height 100px
        background-image -webkit-image-set(url('./logo_1x.png') 1x, url('./logo_2x.png') 2x)
        background-repeat no-repeat
        margin 0 auto
      .detail
        box-shadow 0 0 10px rgba(171, 198, 235, .3)
        .header
          background-color #438aee
          color #fff
          border-top-left-radius 4px
          border-top-right-radius 4px
          font-size 12px
          overflow hidden
          .avatar
            float left
            padding 15px 10px 15px 25px
            .photo_frame
              width 44px
              height 44px
              border-radius 50%
              padding 4px
              background #3779d6
              overflow hidden
              img
                border-radius 50%
          .info
            float left
            line-height 82px
            span
              display inline-block
              font-weight bolder
            .username
              font-size 14px
        .body
          width 400px
          background #fff
          padding 20px 30px 40px
          border-bottom-left-radius 4px
          border-bottom-right-radius 4px
          .title
            padding 0 0 5px
            margin 20px 0 10px
            color #5b667b
            font-size 14px
          .input_box
            overflow hidden
            padding-bottom 10px
            input
              width 280px
              border 1px solid #f2f2f2
              padding 8px 10px
              height 19px
              line-height 19px
              background #f2f2f2
              border-radius 4px
              float left
              outline none
              color rgb(102, 102, 102)
              font-size 12px
            button
              background #3b8cff
              border-radius 4px
              padding 0 15px
              margin-left 14px
              height 34px
              line-height 34px
              color #fff
              border none
              font-weight bolder
              outline none
              cursor pointer
              &:hover
                opacity 0.7
          .error
            font-size 12px
            color red
    .file_content
      display flex
      flex-direction column
      width 750px
      min-height 500px
      margin 20px auto 0
      background #fff
      border-top-left-radius 5px
      border-top-right-radius 5px
      .file_header
        padding 15px 10px
        border-bottom 1px solid #f1f5fb
        position relative
        .download
          position absolute
          top 30px
          right 35px
          font-size 14px !important
          line-height 14px
        .name
          padding-top 5px
          width 300px
          font-size 14px
          font-weight bolder
          line-height 36px
          color #424e67
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
        .time
          i
            margin-right 5px
          div
            display inline-block
            color rgb(102, 102, 102)
            font-weight 500
            font-size 12px
          .last_time
            margin-left 10px
      .file_body
        flex 1
        padding 10px
      .file_body_center
        min-height 400px
        background #f6f9fd
        border-radius 4px
        overflow hidden
        .file_icon
          width 56px
          height 56px
          margin 80px auto 35px
          background url("./others.png")
          background-size 100% 100%
        .file_size
          font-size 12px
          text-align center
</style>
