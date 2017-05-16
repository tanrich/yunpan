<template>
  <div class="login_index">
    <header class="header">
      <el-row>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="23">
          <div class="logo">
            <img src="../../assets/logo.png" height="55" alt="logo">
          </div>
          <div class="name">重邮云盘</div>
        </el-col>
      </el-row>
    </header>
    <div class="banner">
      <el-carousel speed="5000" trigger="click" height="550px" arrow="never">
        <el-carousel-item>
          <div class="banner_bg banner_bg1"></div>
        </el-carousel-item>
        <el-carousel-item>
          <div class="banner_bg banner_bg2"></div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="user-form">
      <h4 class="title">欢迎登陆重邮云盘</h4>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="登陆" name="login">
          <el-form :model="form" ref="l_form" :rules="l_rules" label-width="0px">
            <el-form-item prop="l_username">
              <el-input v-model="form.l_username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="l_password">
              <el-input v-model="form.l_password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="l_checkCode">
              <div class="checkbox">
                <div class="checkbox_input">
                  <el-input v-model="form.l_checkCode" placeholder="验证码" width="100px" @key.enter="login"></el-input>
                </div>
                <div class="checkbox_code">
                  <img :src="checkCodeSrc" width="100px" height="36px" alt="验证码"
                       ref="l_authImage">
                </div>
                <div class="checkbox_change">
                  <span @click="changeCheckCode('login', $event)">换一张</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="login" width="100%">登陆</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form :model="form" ref="r_form" :rules="r_rules" label-width="0px">
            <el-form-item prop="r_username" error="true">
              <el-input v-model="form.r_username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="r_password">
              <el-input v-model="form.r_password" type="password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item prop="r_confirm_password">
              <el-input v-model="form.r_confirm_password" type="password" placeholder="确认密码"></el-input>
            </el-form-item>
            <el-form-item prop="r_checkCode">
              <div class="checkbox">
                <div class="checkbox_input">
                  <el-input v-model="form.r_checkCode" placeholder="验证码" width="100px"></el-input>
                </div>
                <div class="checkbox_code">
                  <img :src="checkCodeSrc" width="100px" height="36px" alt="验证码"
                       ref="r_authImage">
                </div>
                <div class="checkbox_change">
                  <span @click="changeCheckCode('register', $event)">换一张</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" native-type="submit" @click="register">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <footer class="footer">
      <el-row>
        <el-col :span="5">&nbsp;</el-col>
        <el-col :span="14">
          <ul class="download">
            <li class="type"><span class="windows"></span></li>
            <li class="type"><span class="android"></span></li>
            <li class="type"><span class="iphone"></span></li>
            <li class="type"><span class="ipad"></span></li>
            <li class="type"><span class="mac"></span></li>
          </ul>
        </el-col>
        <el-col :span="5">&nbsp;</el-col>
      </el-row>
    </footer>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import axios from 'axios'
  import API from '../../api'
  import {
    Row,
    Col,
    Carousel,
    CarouselItem,
    Form,
    FormItem,
    Input,
    Button,
    Tabs,
    TabPane,
    Message
  } from 'element-ui'
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Carousel)
  Vue.use(CarouselItem)
  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Input)
  Vue.use(Button)
  Vue.use(Tabs)
  Vue.use(TabPane)
  Vue.use(Message)

  export default {
    name: '',
    data () {
      let vLUsername = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入用户名'))
        }
        callback()
      }
      let vLPassword = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入密码'))
        }
        callback()
      }
      let vRUsername = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('用户名不能为空'))
        }
        if (/^\w+$/.test(value) === false) {
          return callback(new Error('用户名包含非法字符'))
        }
        clearTimeout(this.r_username_wait)
        this.r_username_wait = setTimeout(() => {
          API.vCheckRUsername({r_username: value})
            .then(res => {
              res = res.data
              if (res.status === 0) {
                callback(new Error('该用户名已被注册'))
              } else {
                callback()
              }
            })
            .catch(err => console.log(err))
        }, 0)
      }
      let vRPassword = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入密码'))
        }
        if (/^\w+$/.test(value) === false) {
          return callback(new Error('用户名包含非法字符'))
        }
        if (this.form.r_confirm_password !== '') {
          this.$refs.r_form.validateField('r_confirm_password')
        }
        callback()
      }
      let vRConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请再次输入密码'))
        }
        if (/^\w+$/.test(value) === false) {
          return callback(new Error('用户名包含非法字符'))
        }
        if (value !== this.form.r_password) {
          return callback(new Error('两次输入密码不一致!'))
        }
        callback()
      }
      let vCheckCode = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入验证码'))
        }
        clearTimeout(this.checkCode_wait)
        this.checkCode_wait = setTimeout(() => {
          API.vCheckCode({checkCode: value})
            .then(res => {
              res = res.data
              if (res.status === 0) {
                callback(new Error('验证码错误'))
              } else {
                callback()
              }
            })
            .catch(err => console.log(err))
        }, 0)
      }
      return {
        activeTab: 'login',
        checkCodeSrc: API.checkCodeSrc,
        r_username_wait: '',
        checkCode_wait: '',
        form: {
          l_username: '',
          l_password: '',
          l_checkCode: '',
          r_username: '',
          r_password: '',
          r_confirm_password: '',
          r_checkCode: ''
        },
        r_rules: {
          r_username: [
            {validator: vRUsername, trigger: ['change', 'blur']}
          ],
          r_password: [
            {validator: vRPassword, trigger: 'blur'}
          ],
          r_confirm_password: [
            {validator: vRConfirmPassword, trigger: 'blur'}
          ],
          r_checkCode: [
            {validator: vCheckCode, trigger: ['change', 'blur']}
          ]
        },
        l_rules: {
          l_username: [
            {validator: vLUsername, trigger: 'blur'}
          ],
          l_password: [
            {validator: vLPassword, trigger: 'blur'}
          ],
          l_checkCode: [
            {validator: vCheckCode, trigger: ['change', 'blur']}
          ]
        }
      }
    },
    mounted () {
      Message.closeAll()
    },
    methods: {
      login () {
        this.$refs.l_form.validate(res => {
          if (res) {
            API.login(this.form)
              .then(res => {
                res = res.data
                if (res.status === 0) {
                  console.log('用户名或者密码不对')
                } else if (res.status === 1) {
                  console.log('登陆成功')
                  this.$router.push({path: '/home'})
                } else if (res.status === 2) {
                  console.log('验证码错误')
                }
              })
              .catch(err => console.log(err))
          }
        })
      },
      register () {
        let _self = this
        this.$refs.r_form.validate(res => {
          if (res) {
            API.register(this.form)
              .then(res => {
                res = res.data
                if (res.status === 0) {
                  console.log('用户名已被注册')
                } else if (res.status === 1) {
                  Message.success({
                    showClose: true,
                    message: '恭喜你注册成功！',
                    duration: 2000
                  })
                  _self.activeTab = 'login'
                  _self.$refs.r_form.resetFields()
                } else if (res.status === 2) {
                  console.log('验证码错误')
                }
              })
              .catch(err => console.log(err))
          }
        })
      },
      changeCheckCode (value, event) {
        if (value === 'login') {
          this.$refs.l_authImage.src = 'http://192.168.43.232:8080/authImage?date=' + new Date()
        } else if (value === 'register') {
          this.$refs.r_authImage.src = 'http://192.168.43.232:8080/authImage?date=' + new Date()
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .login_index
    height 100%
    background #eff4f8
    display flex
    flex-direction column
    position relative
    .header
      position absolute
      top 0
      left 0
      right 0
      padding 15px 0
      z-index 99
      .logo, .name
        display inline-block
        vertical-align top
        img
          display block
      .name
        font-size 34px
        color #fff
        margin-left 5px
        margin-top 12px
        box-sizing border-box
        font-weight 400
    .banner
      flex 0 0 550px
      height 550px
      overflow hidden
      &:hover
        .banner_bg
          transform scale(1.05)
      .banner_bg
        height 550px
        background-size 100% 100% !important;
        transition all 1s
        &.banner_bg1
          background url("./login_bg1.jpeg") no-repeat;
        &.banner_bg2
          background url("./login_bg2.jpeg") no-repeat;
    .user-form
      position absolute
      width 350px
      box-sizing border-box
      padding 0 20px
      background #fff
      z-index 99
      top 100px
      right 100px
      border-radius 4px
      .title
        padding-top 32px
        padding-bottom 15px
        text-align center
        font-size 18px
        font-weight 200
        color #333
      .checkbox
        display flex
        .checkbox_input, .checkbox_code
          flex 0 0 100px
          width 100px
        .checkbox_code
          height 36px
          border 1px solid #bfcbd9
          border-radius 4px
          box-sizing border-box
          margin-left 5px
          overflow hidden
        .checkbox_change
          flex 1
          margin-left 5px
          font-size 12px
          color #3582f8
          cursor pointer
    .footer
      flex 1
      .download
        display flex
        margin-top 30px
        .type
          flex 1
          position relative
          span
            display inline-block
            height 70px
            width 90px
            overflow hidden
            background url("./download.png")
            vertical-align top
            position relative
            left 50%
            margin-left -45px
            &.windows
              background-position -500px -70px
            &.android
              background-position -320px -0px
            &.iphone
              background-position -270px -160px
            &.ipad
              background-position -500px -0px
            &.mac
              background-position -180px -160px
</style>
