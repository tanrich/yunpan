<template>
  <div class="home_index" ref="home_index">
    <VHomeHeader :username="username"></VHomeHeader>
    <VHomeContent></VHomeContent>
  </div>
</template>
<script type="text/ecmascript-6">
  import VHomeHeader from '../home_header/home_header.vue'
  import VHomeContent from '../home_content/home_content.vue'
  import API from '../../api'
  import { saveLocalStorage, getLocalStorage } from '../../common/js/store'
  import { Message } from 'element-ui'

  export default {
    name: '',
    data () {
      return {
        username: ''
      }
    },
    mounted () {
      // 禁用默认右键菜单
      this.$refs['home_index'].oncontextmenu = function () {
        return false
      }
      // console.log(getLocalStorage(false))
      API.vCheckLogin()
        .then(res => {
          res = res.data
          if (res.status === 0) {
            console.log('未登录')
            // this.$router.push({path: '/'})
          } else {
            console.log('已登录')
            this.username = res.username
          }
        })
        .catch(err => console.log(err))
    },
    components: {
      VHomeHeader,
      VHomeContent
    },
    methods: {
      test () {
        return false
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .home_index
    height 100%
    display flex
    flex-direction column
</style>
