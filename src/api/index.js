import axios from 'axios'
// 'http://192.168.43.232:8080'
// 'http://192.168.1.160:8080'
// 'http://172.33.11.50:8080'
// 'http://39.108.105.138:8080/yunpan'
// 'http://192.168.155.6:8080'
let baseURL = 'http://192.168.43.232:8080'
const request = axios.create({
  baseURL: baseURL,
  withCredentials: true
})

export default {
  baseURL,
  // 验证码获取地址
  checkCodeSrc: baseURL + '/authImage',
  // 登陆请求
  login: (params) => request.get('/login', {params}),
  // 退出登陆
  logout: () => request.get('/logout'),
  // 注册请求
  register: (params) => request.get('/register', {params}),
  // 注册用户名检测
  vCheckRUsername: (params) => request.get('/vcheckrusername', {params}),
  // 验证码检测
  vCheckCode: (params) => request.get('/vcheckcode', {params}),
  // 检测登陆状态
  vCheckLogin: () => request.get('vchecklogin'),
  // 获取所有文件
  getAllFiles: (params) => request.get('/getallfiles', {params}),
  // 新建文件夹
  newFolder: (params) => request.get('/newfolder', {params}),
  // 删除文件或者文件夹
  delete: (params) => request.get('/delete', {params}),
  // 修改文件名
  fileRename: (params) => request.get('/filerename', {params}),
  // 修改文件夹名
  folderRename: (params) => request.get('/folderrename', {params}),
  // 下载文件
  download: (params) => request.get('/download', {params}),
  // 获取使用空间
  getRoomSpace: (params) => request.get('/getroomspace', {params}),
  // 分类加载
  getKinds: (params) => request.get('getkinds', {params})
}
