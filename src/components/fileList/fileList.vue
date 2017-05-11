<template>
  <div class="file_list">
    <div class="tool_list">
      <div class="major_function">
        <el-upload class="upload"
                   action="https://jsonplaceholder.typicode.com/posts/"
        >
          <el-button type="primary">
            上传 <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
        <el-button>新建文件夹 <i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <div class="secondary_function">
        <el-button>分享 <i class="el-icon-share el-icon--right"></i></el-button>
        <el-button>下载 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button>删除 <i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button>重命名 <i class="el-icon-edit el-icon--right"></i></el-button>
        <el-button>复制到 <i class="el-icon-document el-icon--right"></i></el-button>
        <el-button>更多 <i class="el-icon-more el-icon--right"></i></el-button>
      </div>
    </div>
    <div class="file_package">
      <div class="file_package_title">
        <div class="file_package_title_info">
          <div>全部文件</div>
          <div>已全部加载,共{{filePackageContent.length}}个</div>
        </div>
        <div class="file_package_title_select">
          <el-checkbox v-model="checked">全选</el-checkbox>
        </div>
      </div>
      <div class="file_package_content">
        <ul>
          <li v-for="(item,index) in filePackageContent" :key="index" class="file_package_content_item">
            <div class="type"></div>
            <div class="name">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Button, Upload, Checkbox } from 'element-ui'
  import axios from 'axios'
  Vue.use(Button)
  Vue.use(Upload)
  Vue.use(Checkbox)
  export default {
    name: '',
    data () {
      return {
        filePackageContent: '',
        checked: false
      }
    },
    mounted () {
      axios.get('/Server/All')
        .then(res => {
          this.filePackageContent = res.data
        })
        .catch(err => console.log(err))
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus" scoped>
  .file_list
    margin-right 10px
    padding 15px
    border 1px solid #d8dfea
    border-bottom none
    border-top-left-radius 5px
    border-top-right-radius 5px
    background #fff
    height inherit
    box-sizing border-box
    display flex
    flex-direction column
    .tool_list
      .major_function, .secondary_function
        display inline-block
        font-size 0
        .upload
          display inline-block
          margin-right 10px
      .secondary_function
        margin-left 20px
        button
          margin-left 5px
    .file_package
      flex 1
      .file_package_title
        border-bottom 1px solid #f2f6fd
        .file_package_title_info
          padding 10px 0
          div
            display inline-block
            color #666
            font-size 12px
            font-weight bold
            line-height 12px
          div + div
            float right
        .file_package_title_select
          padding 5px 0
      .file_package_content
        padding 5px 0
        .file_package_content_item
          display inline-block
          width 120px;
          height 127px;
          cursor pointer
          &:hover
            background #f1f5fa
            border-radius 7px
          .type
            width 84px
            height 84px
            background url("./file.png") center no-repeat;
            margin 9px auto 0;
          .name
            font-size 14px
            text-align center
            margin 6px 5px 5px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
</style>
