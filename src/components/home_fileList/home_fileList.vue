<template>
  <div class="file_list"
       ref="file_list"
       @mousedown.left.stop="FileListLeftClick($event)"
       @mousedown.right.stop="FileListRightClick($event)">
    <div class="tool_list">
      <div class="major_function">
        <el-upload class="upload"
                   :action="baseURL+'/upload'"
                   :data="fileConfig"
                   :show-file-list="false"
                   :with-credentials="true"
                   :on-change="uploadStatus"
        >
          <el-button type="primary">
            上传 <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
        <el-button @click="newFolder">新建文件夹 <i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <div class="secondary_function" v-show="checkedIndex!==''" @mousedown.left.stop="selectFunction($event)">
        <el-button>分享<i class="el-icon-share el-icon--right"></i></el-button>
        <el-button>下载<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button>删除<i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button>重命名<i class="el-icon-edit el-icon--right"></i></el-button>
        <el-button>复制到<i class="el-icon-document el-icon--right"></i></el-button>
        <el-button>更多<i class="el-icon-more el-icon--right"></i></el-button>
        <a target="_self" ref="download" :href="downloadURL" hidden></a>
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
          <div>
            <ul @click.stop="pathJump($event)">
              <li v-for="item in pathList" class="pathItem"><span>/{{item}}</span></li>
            </ul>
          </div>
          <div>已全部加载,共{{filePackageContent.length}}个</div>
        </div>
        <div class="file_package_title_select" v-show="this.filePackageContent.length" @mousedown.left.stop>
          <el-checkbox v-model="checkedAll" @change="setCheckedAll(checkedAll)">全选</el-checkbox>
        </div>
      </div>
      <div class="file_package_content">
        <div class="empty_file" v-show="!this.filePackageContent.length">
          <p>这里空空如也，快去上传文件吧！</p>
        </div>
        <ul>
          <li v-for="(item,index) in filePackageContent"
              class="file_package_content_item overFile"
              :class="{isChecked:item.checked}"
              :key="index"
              @mousedown.left.stop="folderLeftClick(item,$event)"
              @mousedown.right="folderRightClick(item, index)"
          >
            <div class="type overFile" :class="initKinds(item)"></div>
            <div class="name overFile" v-show="!item.isRename">{{item.fileName}}</div>
            <div class="rename" v-show="item.isRename">
              <input type="text"
                     autofocus="autofocus"
                     @keydown.enter.stop="submitNewName(item)"
                     @mousedown.left.stop
                     v-model="item.newName"
              ><i class="el-icon-close"
                  @mousedown.left.stop="cancelRename($event)"
            ></i>
            </div>
            <div class="choose" @mousedown.left.stop>
              <el-checkbox v-model="item.checked" @change="folderSelect(item,index)"></el-checkbox>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="context_menu"
         ref="context_menu"
         v-show="contextMenu.status"
    >
      <ul v-show="contextMenu.overFileStatus" @mousedown.left.stop="selectFunction($event)">
        <li v-for="list in contextMenu.overFile.typeOne" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeTwo" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeThree" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeFour" class="context_menu_list">{{list}}</li>
      </ul>
      <ul v-show="!contextMenu.overFileStatus" @mousedown.left.stop="selectFunction($event)">
        <li v-for="list in contextMenu.overSpace.typeOne" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overSpace.typeTwo" class="context_menu_list">{{list}}</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import { Button, Upload, Checkbox, Message, Loading } from 'element-ui'
  import axios from 'axios'
  import API from '../../api'
  Vue.use(Button)
  Vue.use(Upload)
  Vue.use(Checkbox)
  Vue.use(Message)
  Vue.use(Loading)
  export default {
    name: '',
    data () {
      return {
        baseURL: API.baseURL,
        fileList: {
          left: '',
          top: ''
        },
        filePackageContent: [
          {
            fileName: '1',
            checked: false,
            isRename: false,
            kinds: 'folder'
          },
          {
            fileName: '2',
            checked: false,
            isRename: false,
            kinds: 'folder'
          },
          {
            fileName: '3',
            checked: false,
            isRename: false,
            kinds: 'document'
          },
          {
            fileName: '4',
            checked: false,
            isRename: false,
            kinds: 'others'
          }
        ],
        checkedAll: false,
        searchContent: '',
        searchWait: '',
        fileConfig: {
          path: '/'
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
        },
        checkedIndex: '',
        waitDataOptions: '',
        downloadURL: ''
      }
    },
    created () {
      Message.closeAll()
    },
    mounted () {
      // 获取fileList对于网页的位置，方便以后使用
      this.fileList = {
        left: this.$refs['file_list'].getBoundingClientRect().left,
        top: this.$refs['file_list'].getBoundingClientRect().top
      }
      this.waitDataOptions = {
        target: '.file_package_content',
        loading: false,
        fullscreen: false
//        text: '老板等等，我在拼命加载中…'
      }
      // 打开页面自动请求所有文件
      this.initFilePackageContent()
    },
    computed: {
      pathList () {
        let tmpPath = this.fileConfig.path.split('/')
        tmpPath.splice(0, 1, '所有文件')
        return tmpPath
      }
    },
    methods: {
      // 初始化页面数据
      initFilePackageContent () {
        let loading = Loading.service(this.waitDataOptions)
        this.fileConfig.path = '/'
        API.getAllFiles(this.fileConfig)
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
          })
          .then(() => loading.close())
          .catch(err => console.error(err))
      },

      // 初始化file类别，分配对应class图标
      initKinds (item) {
        switch (item.kinds) {
          case 'folder':
            return {
              'folder': true
            }
          case 'document':
            return {
              'document': true
            }
          case 'others':
            return {
              'others': true
            }
        }
      },

      // 文件路径初始化
      initFileConfig (path) {
        let _self = this
        if (this.fileConfig.path === '/') {
          this.fileConfig = {
            path: this.fileConfig.path + path
          }
        } else {
          this.fileConfig = {
            path: this.fileConfig.path + '/' + path
          }
        }
      },

      // 上传过程调用函数
      uploadStatus (file) {
        Message.closeAll()
        if (file.status === 'ready') {
          Message.info({
            showClose: true,
            message: '正在上传中…',
            duration: 2000
          })
        } else if (file.status === 'success') {
          Message.success({
            showClose: true,
            message: '上传成功！',
            duration: 2000
          })
          this.refresh()
        } else if (file.status === 'error') {
          Message.error({
            showClose: true,
            message: '上传失败！',
            duration: 2000
          })
        }
      },

      // 左键点击文件夹事件
      folderLeftClick (item, event) {
        console.log('进入')

        this.initFileConfig(item.fileName)
        API.getAllFiles(this.fileConfig)
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
          })
          .catch(err => console.error(err))
      },

      // 右键点击文件夹事件
      folderRightClick (item, index) {
        this.setCheckedAll(false)
        item.checked = true
        this.checkedIndex = index
      },

      // 文件选中事件 checkbox触发
      folderSelect (item, index) {
        // Vue 不能检测到对象属性的添加或删除
        // 最开始不存在item.checked ，直接用if判断无法区分是undefined还是false
        if (typeof item.checked === 'undefined') {
          this.$set(this.filePackageContent[index], 'checked', true)
        }
        item.checked ? this.checkedIndex = index : this.checkedIndex = ''
      },

      // 改变全部文件选中状态
      setCheckedAll (value) {
        this.filePackageContent.forEach((item) => {
          // Vue监测机制的问题
          if (typeof item.checked === 'undefined') {
            this.$set(item, 'checked', value)
            return
          }
          if (item.checked === value) {
            return
          }
          item.checked = value
        })
      },

      // 本组件右键点击事件
      FileListRightClick (event) {
        this.showRightContextMenu(event)
      },

      // 本组件左键点击事件
      FileListLeftClick () {
        this.hideRightContextMenu()
        this.setCheckedAll(false)
        this.renameState(false)
        this.checkedIndex = ''
        this.checkedAll = false
      },

      // 隐藏右键菜单
      hideRightContextMenu () {
        this.contextMenu.status = false
      },

      // 显示并定位右键菜单
      showRightContextMenu (event) {
        let classList = event.target.classList
        this.contextMenu.status = true
        this.$refs['context_menu'].style.top = event.pageY - this.fileList.top + 'px'
        this.$refs['context_menu'].style.left = event.pageX - this.fileList.left + 'px'
        // 判断点击区域class是否包含overFile
        for (let k of classList) {
          if (k === 'overFile') {
            this.contextMenu.overFileStatus = true
            return
          }
        }
        this.contextMenu.overFileStatus = false
      },

      // 选择右键菜单功能
      selectFunction (event) {
        let selection = event.target.innerText
        // console.log(selection)
        switch (selection) {
          case '打开':
            console.log('打开')
            break
          case '下载':
            console.log('下载')
            this.download()
            break
          case '分享':
            console.log('分享')
            break
          case '复制':
            console.log('复制')
            break
          case '移动到':
            console.log('移动到')
            break
          case '重命名':
            console.log('重命名')
            this.renameState(true)
            break
          case '删除':
            console.log('删除')
            this.delete()
            break
          case '查看':
            console.log('查看')
            break
          case '排序方式':
            console.log('排序方式')
            break
          case '刷新':
            this.refresh()
            break
          case '重新加载页面':
            console.log('重新加载页面')
            break
          case '新建文件夹':
            console.log('新建文件夹')
            this.newFolder()
            break
        }
        this.hideRightContextMenu()
      },

      // 删除文件操作
      delete () {
        Message.closeAll()
        API.delete({id: this.filePackageContent[this.checkedIndex].id})
          .then(res => {
            res = res.data
            if (res.status === 1) {
              Message.success({
                showClose: true,
                message: '删除成功！',
                duration: 2000
              })
              this.refresh()
            } else {
              throw new Error('修改失败')
            }
          })
          .catch(err => {
            console.error(err)
            Message.error({
              showClose: true,
              message: '删除失败！',
              duration: 2000
            })
          })
      },

      // 下载文件
      download () {
        this.downloadURL = this.baseURL + '/download?id=' + this.filePackageContent[this.checkedIndex].id
        this.$nextTick(() => {
          this.$refs['download'].click()
        })
      },

      // 刷新
      refresh () {
        let loading = Loading.service(this.waitDataOptions)
        API.getAllFiles(this.fileConfig)
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
          })
          .then(() => loading.close())
          .catch(err => console.error(err))
      },

      // 搜索
      search () {
        clearTimeout(this.searchWait)
        this.searchWait = setTimeout(() => console.log('ajax中'), 300)
      },

      // 新建文件夹
      newFolder () {
        // 保存旧数组长度便于比较是否创建成功
        let oldLength = this.filePackageContent.length
        // 新建文件夹请求
        Message.closeAll()
        API.newFolder(Object.assign({}, this.fileConfig, {folderName: '新建文件夹'}))
          .then(res => {
            res = res.data.data
            if (res.length !== oldLength) {
              this.filePackageContent = res
              Message.success({
                showClose: true,
                message: '文件夹创建成功！',
                duration: 2000
              })
            } else {
              throw new Error('文件夹创建失败')
            }
          })
          .then(() => {
            // 为新创建的文件夹记录默认选中值
            this.checkedIndex = this.filePackageContent.length - 1
            this.renameState(true)
          })
          .catch(err => {
            console.error(err)
            Message.error({
              showClose: true,
              message: '文件夹创建失败！',
              duration: 2000
            })
          })
        // 本地模拟创建一个文件夹
//        this.filePackageContent.push({
//          fileName: '新建文件夹',
//          checked: true,
//          isRename: true,
//          kinds: 'folder'
//        })
      },

      // 取消重命名
      cancelRename () {
        this.renameState(false)
      },

      // 改变重命名状态
      renameState (value) {
        console.log('现在选中index序号为' + this.checkedIndex)
        if (this.checkedIndex !== '') {
          // Vue 不能检测到对象属性的添加或删除
          this.$set(this.filePackageContent[this.checkedIndex], 'isRename', value)
        }
      },

      // 提交新的重命名
      submitNewName (item) {
        let tmpName = item.fileName
        item.fileName = item.newName
        this.renameState(false)
        Message.closeAll()
        if (item.kinds === 'folder') {
          // 文件夹名字修改
          API.folderRename({
            id: item.id,
            newFolderName: item.newName
          })
            .then(res => {
              res = res.data
              if (res.status === 1) {
                Message.success({
                  showClose: true,
                  message: '修改成功！',
                  duration: 2000
                })
              } else {
                throw new Error('修改失败')
              }
            })
            .catch(err => {
              console.error(err)
              Message.error({
                showClose: true,
                message: '修改失败！',
                duration: 2000
              })
            })
        } else {
          // 文件名字修改
          API.fileRename({
            id: item.id,
            newFileName: item.newName
          })
            .then(res => {
              res = res.data
              if (res.status === 1) {
                Message.success({
                  showClose: true,
                  message: '修改成功！',
                  duration: 2000
                })
              } else {
                throw new Error('修改失败')
              }
            })
            .catch(err => {
              console.error(err)
              Message.error({
                showClose: true,
                message: '修改失败！',
                duration: 2000
              })
            })
        }
      },

      // 路径跳转
      pathJump (event) {
        let path = event.target.innerText
        if (path === '/所有文件') {
          this.fileConfig.path = '/'
        } else {
          let index = this.fileConfig.path.indexOf(path)
          this.fileConfig.path = this.fileConfig.path.substr(0, index) + path
        }
        this.refresh()
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
          .pathItem
            display inline-block
            cursor pointer
        .file_package_title_select
          padding 5px 0
      .file_package_content
        position relative
        min-height 50%
        padding 5px 0
        box-sizing border-box
        .empty_file
          position absolute
          left 50%
          top 50%
          width 488px
          background url('emptyfile.png') no-repeat scroll center 0 transparent
          box-sizing border-box
          padding-top 146px
          margin -108px 0 0 -244px
          text-align center
          p
            font-size 16px
            line-height 30px
            color #424e67
            margin 20px 0
            font-weight 300
        .file_package_content_item
          display inline-block
          width 120px;
          height 127px;
          margin-right 5px
          cursor pointer
          position relative
          border 1px solid transparent
          box-sizing border-box
          vertical-align top
          &.isChecked
            background #f1f5fa
            border 1px solid #90c3fd
            border-radius 7px
            .choose
              visibility visible
          &:hover
            background #f1f5fa
            border-radius 7px
            .choose
              visibility visible
          .type
            width 84px
            height 84px
            margin 9px auto 0
            &.folder
              background url("./file.png") center no-repeat
            &.document
              background url("./document.png") center no-repeat
            &.others
              background url("./others.png") center no-repeat
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
          .rename
            overflow hidden
            input
              display inline-block
              width 86px
              padding 2px 5px
              border 1px solid #bfcbd9
              border-radius 2px
              box-sizing border-box
              font-size 12px
              color #bfcbd9
              margin-left 8px
              outline none
              float left
              &:focus
                box-shadow 0 0 5px 0 #bfcbd9
            i
              display inline-block
              float right
              margin-right 2px
              color #bfcbd9
              font-size 10px
              padding 3px
              border-radius 2px
              border 1px solid #bfcbd9
              background #fff
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
