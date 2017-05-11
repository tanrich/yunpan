<template>
  <div id="app">
    <VHeader></VHeader>
    <VContent></VContent>
  </div>
</template>

<script>
  import { Button, Slider } from 'element-ui'
  import Vue from 'vue'
  import VHeader from './components/header/header.vue'
  import VContent from './components/content/content.vue'
  export default {
    name: 'app',
    data () {
      return {}
    },
    components: {
      VHeader,
      VContent
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

  #app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    -webkit-font-smoothing antialiased
    display flex
    flex-direction column
    height 100%
</style>
