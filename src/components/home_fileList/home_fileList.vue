<template>
  <div class="file_list"
       ref="file_list"
       @mousedown.left.stop="hideRightContextMenu($event)"
       @mousedown.right.stop="showRightContextMenu($event)">
    <div class="tool_list">
      <div class="major_function">
        <el-upload class="upload"
                   action="http://192.168.1.160:8080/upload"
                   :data="fileConfig"
                   :multiple="true"
                   :show-file-list="false"
                   :with-credentials="true"
        >
          <el-button type="primary">
            上传 <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
        <el-button @click="newFolder">新建文件夹 <i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <div class="secondary_function">
        <el-button>分享 <i class="el-icon-share el-icon--right"></i></el-button>
        <el-button>下载 <i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button>删除 <i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button>重命名 <i class="el-icon-edit el-icon--right"></i></el-button>
        <el-button>复制到 <i class="el-icon-document el-icon--right"></i></el-button>
        <el-button>更多 <i class="el-icon-more el-icon--right"></i></el-button>
      </div>
      <div class="search">
        <el-input
          placeholder="请输入要查找的内容"
          icon="search"
          v-model="searchContent"
          :on-icon-click="search"
          @input="search"
        >
        </el-input>
      </div>
    </div>
    <div class="file_package">
      <div class="file_package_title">
        <div class="file_package_title_info">
          <div>全部文件</div>
          <div>已全部加载,共{{filePackageContent.length}}个</div>
        </div>
        <div class="file_package_title_select">
          <el-checkbox v-model="checkedAll" @change="setCheckedAll">全选</el-checkbox>
        </div>
      </div>
      <div class="file_package_content">
        <ul>
          <li v-for="(item,index) in filePackageContent"
              class="file_package_content_item overFile"
              :class="{isChecked:item.checked}"
              :key="index"
              @click.stop="folderClick(item.fileName,$event)"
          >
            <div class="type overFile"></div>
            <div class="name overFile">{{item.fileName}}</div>
            <div class="choose">
              <el-checkbox v-model="item.checked"></el-checkbox>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="context_menu" ref="context_menu" v-show="contextMenu.status">
      <ul v-show="contextMenu.overFileStatus">
        <li v-for="list in contextMenu.overFile.typeOne" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeTwo" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeThree" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeFour" class="context_menu_list">{{list}}</li>
      </ul>
      <ul v-show="!contextMenu.overFileStatus">
        <li v-for="list in contextMenu.overSpace.typeOne" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overSpace.typeTwo" class="context_menu_list">{{list}}</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Button, Upload, Checkbox } from 'element-ui'
  import axios from 'axios'
  import API from '../../api'
  Vue.use(Button)
  Vue.use(Upload)
  Vue.use(Checkbox)
  export default {
    name: '',
    data () {
      return {
        fileList: {
          left: '',
          top: ''
        },
        filePackageContent: [
          {
            fileName: 1,
            checked: false
          },
          {
            fileName: 2,
            checked: false
          }
        ],
        checkedAll: false,
        searchContent: '',
        searchWait: '',
        fileConfig: {
          path: ''
        },
        contextMenu: {
          status: false,
          overFileStatus: false,
          overFile: {
            typeOne: ['打开', '下载'],
            typeTwo: ['分享'],
            typeThree: ['复制', '移动到'],
            typeFour: ['重命名', '删除']
          },
          overSpace: {
            typeOne: ['查看', '排序方式', '刷新'],
            typeTwo: ['重新加载页面', '新建文件夹']
          }
        }
      }
    },
    mounted () {
      // 获取fileList对于网页的位置，方便以后使用
      this.fileList = {
        left: this.$refs['file_list'].getBoundingClientRect().left,
        top: this.$refs['file_list'].getBoundingClientRect().top
      }
      // 打开页面自动请求所有文件
      API.getAllFiles(this.fileConfig)
        .then(res => {
          res = res.data.data
          this.filePackageContent = res
        })
        .catch(err => console.log(err))
    },
    methods: {
      // 搜索
      search () {
        clearTimeout(this.searchWait)
        this.searchWait = setTimeout(() => console.log('ajax中'), 300)
      },
      // 点击文件夹事件
      folderClick (path, event) {
        let className = event.target.className
        if (className === 'el-checkbox__inner' || className === 'el-checkbox__original') {
          return false
        }
        console.log('进入')
        this.fileConfig = {
          path: this.fileConfig.path + '/' + path
        }
        API.getAllFiles(this.fileConfig)
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
          })
          .catch(err => console.log(err))
      },
      // 新建文件夹
      newFolder () {
        API.newFolder(Object.assign({}, this.fileConfig, {folderName: 123}))
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
          })
          .catch(err => console.log(err))
      },
      // 全选
      setCheckedAll () {
        this.filePackageContent.forEach((item) => {
          item.checked = this.checkedAll
        })
      },
      // 显示并定位右键菜单
      showRightContextMenu (event) {
        let classList = event.target.classList
        this.contextMenu.status = true
        this.$refs['context_menu'].style.top = event.pageY - this.fileList.top + 'px'
        this.$refs['context_menu'].style.left = event.pageX - this.fileList.left + 'px'
        for (let k of classList) {
          if (k === 'overFile') {
            this.contextMenu.overFileStatus = true
            return
          }
        }
        this.contextMenu.overFileStatus = false
      },
      // 隐藏右键菜单
      hideRightContextMenu () {
        this.contextMenu.status = false
      }
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
    position relative
    .tool_list
      font-size 0
      .major_function, .secondary_function, .search
        display inline-block
        font-size 0
        .upload
          display inline-block
          margin-right 10px
      .secondary_function
        margin-left 20px
        button
          margin-left 5px
      .search
        float right
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
          margin-right 5px
          cursor pointer
          position relative
          border 1px solid transparent
          box-sizing border-box
          &:hover
            background #f1f5fa
            border-radius 7px
            .choose
              visibility visible
          &.isChecked
            background #f1f5fa
            border 1px solid #90c3fd
            border-radius 7px
            .choose
              visibility visible
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
          .choose
            visibility hidden
            position absolute
            width 18px
            height 18px
            border-radius 50%
            background #a1c4ff
            opacity .5
            top 7px
            left 7px
    .context_menu
      position absolute
      border 1px solid #dde0e4
      box-shadow 0 0 8px #ccc
      border-radius 5px
      top 250px
      padding 2px 0
      background #fff
      cursor pointer
      .context_menu_list
        width 145px
        height 23px
        min-height 23px
        line-height 23px
        padding 0 20px
        box-sizing border-box
        color #5b667b
        font-size 13px !important
        &:hover
          background #20a0ff
          color #fff
      .separate
        height 1px
        background #e9e9e9
        margin 5px 0
</style>
