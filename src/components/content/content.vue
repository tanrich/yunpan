<template>
  <div class="content">
    <div style="flex: 4;text-align: center;height: 100%">
      <VNavList></VNavList>
    </div>
    <div style="flex: 20;height: 100%">
      <VFileList></VFileList>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import VNavList from '../navList/navList.vue'
  import VFileList from '../fileList/fileList.vue'
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
    components: {
      VNavList,
      VFileList
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .content
    background #eff4f8
    position relative
    flex 1
    display flex
</style>
