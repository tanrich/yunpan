<template>
  <div>
    <VHomeHeader></VHomeHeader>
    <VHomeContent></VHomeContent>
  </div>
</template>
<script type="text/ecmascript-6">
  import VHomeHeader from '../home_header/home_header.vue'
  import VHomeContent from '../home_content/home_content.vue'

  export default {
    name: '',
    data () {
      return {}
    },
    components: {
      VHomeHeader,
      VHomeContent
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>

</style>
