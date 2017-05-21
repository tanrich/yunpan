<template>
  <div class="content">
    <div style="flex: 4;text-align: center;height: 100%">
      <VNavList @selectNav="selectNav"></VNavList>
    </div>
    <div style="flex: 20;height: 100%">
      <VFileList ref="file_list"></VFileList>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import VNavList from '../home_navList/home_navList.vue'
  import VFileList from '../home_fileList/home_fileList.vue'
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
    },
    methods: {
      selectNav (selectFunction) {
        console.log(selectFunction)
        this.$refs['file_list'].initFilePackageContent(selectFunction)
      }
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
