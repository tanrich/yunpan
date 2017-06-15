<template>
  <div class="file_list"
       :class="{'share':shareListShow}"
       ref="file_list"
       @mousedown.left.stop="FileListLeftClick($event)"
       @mousedown.right.stop="FileListRightClick($event)">
    <!--工具条-->
    <div class="tool_list" v-show="!shareListShow">
      <!--一级工具栏-->
      <div class="major_function">
        <el-upload class="upload"
                   :action="baseURL+'/upload'"
                   :data="fileConfig"
                   :show-file-list="false"
                   :file-list="fileList"
                   :with-credentials="true"
                   :before-upload="beforeUpload"
                   :on-change="uploadStatus"
                   :on-progress="uploading"
        >
          <el-button type="primary">
            上传 <i class="el-icon-upload el-icon--right"></i>
          </el-button>
        </el-upload>
        <el-button class="newFolder" @click="newFolder">新建文件夹 <i class="el-icon-plus el-icon--right"></i></el-button>
      </div>
      <!--二级工具栏-->
      <div class="secondary_function" v-show="checkedIndex!==''" @mousedown.left.stop="selectFunction($event)">
        <el-button>分享<i class="el-icon-share el-icon--right"></i></el-button>
        <el-button>下载<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-button>删除<i class="el-icon-delete el-icon--right"></i></el-button>
        <el-button>重命名<i class="el-icon-edit el-icon--right"></i></el-button>
        <el-button>复制到<i class="el-icon-document el-icon--right"></i></el-button>
        <el-button>更多<i class="el-icon-more el-icon--right"></i></el-button>
        <a target="_self" ref="download" :href="downloadURL" download="123" hidden></a>
      </div>
      <!--搜索-->
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
    <!--文件区域-->
    <div class="file_package" v-show="!shareListShow">
      <!--路径以及加载总数-->
      <div class="file_package_title">
        <div class="file_package_title_info">
          <div>
            <ul @click.stop="pathJump($event)">
              <li v-for="(item,index) in pathList" :key="index" class="pathItem"><span>/{{item}}</span></li>
            </ul>
          </div>
          <div>已全部加载,共{{filePackageContent.length}}个</div>
        </div>
        <div class="file_package_title_select" v-show="this.filePackageContent.length" @mousedown.left.stop>
          <el-checkbox v-model="checkedAll" @change="setCheckedAll(checkedAll)">全选</el-checkbox>
        </div>
      </div>
      <!--文件列表-->
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
            <div class="type overFile" :class="initFileKinds(item)"></div>
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
    <!--已分享文件列表-->
    <div class="share_package" v-show="shareListShow">
      <div class="share_package_title">
        <div>链接分享<span>(分享失败超过1年以上的链接记录将被自动清理)</span></div>
        <div style="color: rgb(102, 102, 102)">已加载{{this.shareListContent.length}}个</div>
      </div>
      <div class="share_package_content">
        <ul>
          <li class="share_block_style share_block_title">
            <div class="block_four block">分享文件</div>
            <div class="block_half block"></div>
            <div class="block_one block">提取码</div>
            <div class="block_one block">保存次数</div>
            <div class="block_one block">下载次数</div>
            <div class="block_two block">分享时间</div>
            <div class="block_one block">失效时间</div>
          </li>
          <input type="text" :value="shareUrl" id="key" style="opacity: 0;position: absolute">
          <li v-for="(item,index) in shareListContent" class="share_block_style share_block_list" :key="index">
            <div class="block_four block">{{item.fileId.fileName}}</div>
            <div class="block_half block copy" data-clipboard-target="#key" @click="changeShareUrl(item.url)"><i class="el-icon-document"></i></div>
            <div class="block_one block">{{item.code}}</div>
            <div class="block_one block">{{item.saveTimes}}</div>
            <div class="block_one block">{{item.downloadTimes}}</div>
            <div class="block_two block">{{item.dateTime}}</div>
            <div class="block_one block">{{item.status}}</div>
          </li>
        </ul>
      </div>
    </div>
    <!--右键菜单-->
    <div class="context_menu"
         ref="context_menu"
         v-show="contextMenu.status"
    >
      <ul v-show="contextMenu.overFileStatus" @mousedown.left.stop="selectFunction($event)">
        <li v-for="(list,index) in contextMenu.overFile.typeOne" :key="index" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="(list,index) in contextMenu.overFile.typeTwo" :key="index" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="list in contextMenu.overFile.typeThree" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="(list,index) in contextMenu.overFile.typeFour" :key="index" class="context_menu_list">{{list}}</li>
      </ul>
      <ul v-show="!contextMenu.overFileStatus" @mousedown.left.stop="selectFunction($event)">
        <li v-for="(list,index) in contextMenu.overSpace.typeOne" :key="index" class="context_menu_list">{{list}}</li>
        <li class="separate"></li>
        <li v-for="(list,index) in contextMenu.overSpace.typeTwo" :key="index" class="context_menu_list">{{list}}</li>
      </ul>
    </div>
    <!--上传状态表-->
    <div class="upload_progress" v-show="uPshow">
      <h3 class="header">
        <div class="title">上传文件</div>
        <div class="control">
          <i class="el-icon-minus" @click.stop="setInfoShow(false)" v-show="infoShow"></i>
          <i class="el-icon-plus" @click.stop="setInfoShow(true)" v-show="!infoShow"></i>
          <i class="el-icon-close" @click.stop="closeuPshow"></i>
        </div>
      </h3>
      <div class="tips" v-show="tipsShow">
        <div class="title">有{{fileList.length}}个文件上传成功</div>
        <div class="caution" v-popover:tipOne>
          <span><i class="el-icon-warning"></i>&nbsp;警告</span>
          <i class="el-icon-close" @click.stop="closeTipsShow"></i>
          <el-popover
            ref="tipOne"
            placement="left-end"
            width="200"
            trigger="hover"
            content="严禁利用重邮网盘上传、传播暴力恐怖、色情违法及其他违法信息，一经发现将严格按照相关法律法规处理。">
          </el-popover>
        </div>
      </div>
      <transition name="fade">
        <div class="info" v-show="infoShow">
          <ul>
            <li class="info_item info_title">
              <el-row>
                <el-col :span="12">文件(夹)名</el-col>
                <el-col :span="4">大小</el-col>
                <el-col :span="4">上传目录</el-col>
                <el-col :span="4">状态</el-col>
              </el-row>
            </li>
            <li v-for="(item,index) in fileList" :key="index" class="info_item">
              <el-row>
                <el-col :span="12" class="name">{{item.name}}</el-col>
                <el-col :span="4">{{item.size | itemSize}}</el-col>
                <el-col :span="4">{{fileConfig.path}}</el-col>
                <el-col :span="4">
                  <el-progress :percentage="Number(item.percentage.toFixed(0))" class="progress_ratio"></el-progress>
                  <i class="el-icon-circle-check" v-show="false"></i>
                  <i class="el-icon-circle-close" v-show="false"></i>
                </el-col>
              </el-row>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <!--创建分享窗口-->
    <div class="create_share" v-show="createShareShow">
      <div class="share_container">
        <div class="share_header">
          <div class="name">分享文件：{{checkedObj.fileName}}</div>
          <div class="close" @click="shareShowToggleClick(false)"><i class="el-icon-close"></i></div>
        </div>
        <div class="share_body">
          <div class="share_block">
            <div class="name">分享形式：</div>
            <div class="select">
              <el-radio>加密 <span>仅限拥有密码者可查看，更加隐私安全</span></el-radio>
              <el-radio disabled>公开 <span>任何人可查看或下载，同时出现在您的分享列表</span></el-radio>
            </div>
          </div>
          <div class="share_block">
            <div class="name">分享时间：</div>
            <div class="select">
              <el-select size="small" v-model="shareTimeSelect">
                <el-option
                  style="font-size: 12px"
                  v-for="item in shareTimeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="share_button">
          <el-button type="primary" @click="createShare()">创建连接</el-button>
          <el-button @click="shareShowToggleClick(false)">取消</el-button>
        </div>
        <div class="share_footer">
          配合净网行动，重邮网盘严厉打击色情低俗等不良信息的传播行为，如发现，将封禁账号。
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  import {
    Button,
    Upload,
    Checkbox,
    Message,
    Loading,
    Popover,
    Row,
    Col,
    Progress,
    Radio,
    Select,
    Option
  } from 'element-ui'
  import axios from 'axios'
  import API from '../../api'
  import Clipboard from 'clipboard'

  Vue.use(Button)
  Vue.use(Upload)
  Vue.use(Checkbox)
  Vue.use(Message)
  Vue.use(Loading)
  Vue.use(Popover)
  Vue.use(Row)
  Vue.use(Col)
  Vue.use(Progress)
  Vue.use(Radio)
  Vue.use(Select)
  Vue.use(Option)
  export default {
    name: '',
    data () {
      return {
        baseURL: API.baseURL,
        selfTemplate: {
          left: '',
          top: ''
        },
        filePackageContent: [
//          {
//            fileName: '1',
//            checked: false,
//            isRename: false,
//            kinds: 'folder'
//          },
//          {
//            fileName: '2',
//            checked: false,
//            isRename: false,
//            kinds: 'picture'
//          },
//          {
//            fileName: '3',
//            checked: false,
//            isRename: false,
//            kinds: 'document'
//          },
//          {
//            fileName: '4',
//            checked: false,
//            isRename: false,
//            kinds: 'others'
//          },
//          {
//            fileName: '5',
//            checked: false,
//            isRename: false,
//            kinds: 'gzip'
//          },
//          {
//            fileName: '6',
//            checked: false,
//            isRename: false,
//            kinds: 'music'
//          },
//          {
//            fileName: '7',
//            checked: false,
//            isRename: false,
//            kinds: 'video'
//          }
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
        downloadURL: '',
        fileList: [],
        tipsShow: true,
        infoShow: true,
        uPshow: false,
        shareListShow: false,
        shareListContent: [],
        shareTimeOption: [
          {
            value: '24小时后',
            label: '24小时'
          },
          {
            value: '7天后',
            label: '7天'
          },
          {
            value: '永久有效',
            label: '永久有效'
          }
        ],
        shareTimeSelect: '24小时',
        createShareShow: false,
        tmpId: '',
        shareUrl: ''
      }
    },
    created () {
      Message.closeAll()
    },
    mounted () {
      // 获取selfTemplate对于网页的位置，方便以后使用
      this.selfTemplate = {
        left: this.$refs['file_list'].getBoundingClientRect().left,
        top: this.$refs['file_list'].getBoundingClientRect().top
      }
      this.waitDataOptions = {
        target: '.file_package_content',
        loading: false,
        fullscreen: false
      }
      // 打开页面自动请求所有文件
      this.initFilePackageContent('allFiles')
    },
    filters: {
      itemSize (size) {
        if (size / 1024 / 1024 < 1) {
          return (size / 1024).toFixed(0) + 'Kb'
        } else {
          return (size / 1024 / 1024).toFixed(2) + 'Mb'
        }
      }
    },
    computed: {
      pathList () {
        let tmpPath = this.fileConfig.path.split('/')
        tmpPath.splice(0, 1, '所有文件')
        return tmpPath
      },
      // 获取选中文件名字
      checkedObj () {
        if (typeof this.checkedIndex !== 'undefined' && this.checkedIndex !== '') {
          return {
            fileName: this.filePackageContent[this.checkedIndex].fileName,
            id: this.filePackageContent[this.checkedIndex].id
          }
        }
        return false
      }
    },
    methods: {
      changeShareUrl (url) {
        this.shareUrl = ''
        this.shareUrl = 'http://localhost:8080/#/share?url=' + url
      },
      // 初始化粘贴板
      initClipBoard () {
        let copy = new Clipboard('.copy')
        copy.on('success', () => {
          Message.success({
            showClose: true,
            message: '复制成功，赶紧分享给朋友吧！',
            duration: 2000
          })
        })
      },
      // 初始化页面数据
      initFilePackageContent (kind) {
        let loading = Loading.service(this.waitDataOptions)
        this.fileConfig.path = '/'
        this.$router.push({name: 'home', params: {path: kind}})
        if (kind === 'allFiles') {
          API.getAllFiles(this.fileConfig)
            .then(res => {
              res = res.data.data
              this.filePackageContent = res
              this.shareListShow = false
            })
            .then(() => loading.close())
            .catch(err => console.error(err))
        } else if (kind === 'allShare') {
          API.getAllShare()
            .then(res => {
              res = res.data.data
              this.shareListContent = res
              this.shareListShow = true
            })
            .then(() => loading.close())
            .then(() => this.initClipBoard())
            .catch(err => console.error(err))
        } else {
          API.getKinds({kinds: kind})
            .then(res => {
              res = res.data.data
              this.filePackageContent = res
            })
            .then(() => loading.close())
            .catch(err => console.error(err))
        }
      },

      // 初始化file类别，分配对应class图标
      initFileKinds (item) {
        switch (item.kinds) {
          case 'folder':
            return {
              'folder': true
            }
          case 'document':
            return {
              'document': true
            }
          case 'music':
            return {
              'music': true
            }
          case 'gzip':
            return {
              'gzip': true
            }
          case 'picture':
            return {
              'picture': true
            }
          case 'video':
            return {
              'video': true
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

      // 上传之前的函数检查
      beforeUpload (file) {
        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          Message.error({
            showClose: true,
            message: '上传文件大小超过50Mb了~',
            duration: 2000
          })
          return isLt50M
        }
      },

      // 上传过程中调用函数
      uploading (event, file, fileList) {
        this.fileList = fileList
      },

      // 上传状态调用函数
      uploadStatus (file, fileList) {
        this.fileList = fileList
        this.uPshow = true
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
        if (item.kinds !== 'folder') {
          return false
        }
        this.initFileConfig(item.fileName)
        API.getAllFiles(this.fileConfig)
          .then(res => {
            res = res.data.data
            this.filePackageContent = res
            this.$router.push({name: 'home', params: {path: '/allFiles' + this.fileConfig.path}})
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
        this.$refs['context_menu'].style.top = event.pageY - this.selfTemplate.top + 'px'
        this.$refs['context_menu'].style.left = event.pageX - this.selfTemplate.left + 'px'
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
            this.shareShowToggleClick(true)
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
        this.searchWait = setTimeout(() => {
          API.query({fileName: this.searchContent})
            .then(res => {
              res = res.data.data
              this.filePackageContent = res
            })
        }, 300)
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
        // console.log('现在选中index序号为' + this.checkedIndex)
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
      },

      // 关闭tips
      closeTipsShow () {
        this.tipsShow = false
      },

      // 下载详情是否展开
      setInfoShow (value) {
        this.infoShow = value
      },

      // 关闭下载查看
      closeuPshow () {
        this.uPshow = false
      },

      // 创建分享
      createShare () {
        API.createShare({
          status: this.shareTimeSelect,
          id: this.tmpId
        })
          .then(res => {
            res = res.data
            if (res.status === 1) {
              this.shareShowToggleClick(false)
              Message.success({
                showClose: true,
                message: '分享成功！',
                duration: 2000
              })
            }
          })
          .catch(err => console.error(err))
      },

      // 分享界面切换
      shareShowToggleClick (value) {
        this.createShareShow = value
        if (value) {
          this.tmpId = this.checkedObj.id
        } else {
          this.tmpId = ''
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" type="text/stylus">
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
    &.share
      padding 15px 0 15px 0
    .tool_list
      font-size 0
      .major_function, .secondary_function, .search
        display inline-block
        font-size 0
        .upload
          display inline-block
          margin-right 10px
          position relative
          .el-upload-list
            position absolute
        .newFolder
          display inline-block
          vertical-align top
      .secondary_function
        margin-left 20px
        button
          margin-left 5px
      .search
        float right
    .file_package
      flex 1
      display flex
      flex-direction column
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
        flex 1
        position relative
        min-height 50%
        padding 5px 0
        box-sizing border-box
        overflow-y auto
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
            &.picture
              background url("picture.gif") center no-repeat
            &.gzip
              background url("./gzip.png") center no-repeat
            &.music
              background url("./music.png") center no-repeat
            &.video
              background url("./video.png") center no-repeat
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
    .share_package
      font-size 12px
      .share_package_title
        line-height 18px
        padding 5px 15px
        overflow hidden
        border-bottom 1px solid #f2f6fd
        span
          color #8e99b3
          margin-left 5px
        div
          display inline-block
          float left
        div + div
          float right
      .share_package_content
        color #333
        .share_block_title
          line-height 36px
          color #888
          .block
            padding 0 15px
            &:hover
              background #f6faff
        .share_block_style
          display flex
          border-bottom 1px solid #f2f6fd
          box-sizing border-box
          line-height 44px
          .block_half
            flex 0.5
            visibility hidden
            cursor pointer
            text-align center
          .block_one
            flex 1
          .block_two
            flex 2
          .block_four
            flex 3.5
            cursor pointer
        .share_block_list
          .block
            padding 0 15px
          &:hover
            border-bottom 1px solid #daebf4
            background #f6faff
            .block_half
              visibility visible
    .context_menu
      position absolute
      border 1px solid #dde0e4
      box-shadow 0 0 8px #ccc
      border-radius 5px
      top 250px
      padding 2px 0
      background #fff
      cursor pointer
      z-index 100
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
    .upload_progress
      position fixed
      display flex
      flex-direction column
      bottom 0
      top auto
      left auto
      right 30px
      width 633px
      background #fff
      box-sizing border-box
      border 1px solid #e2e2e2
      border-top-left-radius 7px
      border-top-right-radius 7px
      box-shadow 0 0 10px #ccc
      margin-bottom -2px
      z-index 99
      .header
        line-height 44px
        overflow hidden
        padding 0 15px 0 13px
        .title, .control
          display inline-block
          font-size 14px
          color #424e67
        .title
          float left
          font-weight 400
        .control
          float right
          font-size 12px
          i
            margin-left 10px
            font-weight 600
      .tips
        line-height 33px
        background #62a3ff
        overflow hidden
        padding 0 10px 0 13px
        .title, .caution
          display inline-block
          font-size 12px
          font-weight 500
          color #fff
        .title
          float left
        .caution
          float right
          cursor pointer
          .el-icon-close
            transform scale(0.7)
            margin-left 5px
      .info
        flex 1
        overflow auto
        &.fade-enter-active, &.fade-leave-active {
          transition: all .2s
        }
        &.fade-enter, &.fade-leave-active {
          transform scale(1, 0)
        }
        .info_item
          padding 0 13px
          line-height 50px
          border-bottom 1px solid #f2f6fd
          box-sizing border-box
          font-size 12px
          overflow hidden
          .name
            padding 0 20px 0 0
            overflow hidden
            white-space: nowrap
            text-overflow: ellipsis
          .el-progress__text
            font-size 12px !important
          .progress_ratio
            margin-top 18px
          .el-icon-circle-check
            color #5cd992
          .el-icon-circle-close
            color #f8645c
        .info_title
          line-height 33px
          border-top 1px solid #f2f6fd
          box-sizing border-box
    .create_share
      display block
      position fixed
      width 100%
      height 100%
      left 0px
      top 0px
      background rgba(0, 0, 0, .5)
      z-index 50
      .share_container
        position absolute
        width 530px
        left 50%
        top 50%
        margin-left -265px
        margin-top -165px
        background #fff
        .share_header
          padding 0 10px
          line-height 42px
          overflow hidden
          background #f7faff
          border-bottom 1px solid #c4dbfe
          .name
            float left
            width 480px
            white-space nowrap
            text-overflow ellipsis
            overflow hidden
            color #424e67
            font-size 14px
          .close
            float right
            cursor pointer
            i
              font-size 12px
              color #5f7094
              line-height 20px
              margin 0 2px
              text-align center
        .share_body
          margin 20px 0
          padding 10px 20px 0
          .share_block
            overflow hidden
            padding-bottom 15px
          .name, .select
            vertical-align top
            display inline-block
            padding 15px 20px 0
            color #8b909e
            box-sizing border-box
          .name
            padding 17px 20px 0
            font-size 12px
            font-weight 500
          .el-radio
            display block
            padding-bottom 15px
          .el-radio + .el-radio
            margin-left 0
            padding-bottom 0
          .el-radio__inner
            width 12px
            height 12px
          .el-radio__label
            font-size 12px
            color #424e67
            font-weight 500
        .share_button
          margin-top 40px
          font-size 0
          text-align right
          padding 0 20px
          button
            width 110px
          button + button
            width 90px
        .share_footer
          margin-top 15px
          font-size 12px
          line-height 30px
          color #c0c4ce
          text-align center
</style>
