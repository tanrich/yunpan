import axios from 'axios'

let baseURL = 'http://192.168.43.232:8080'
const request = axios.create({
  baseURL: baseURL
})

export default {
  // 验证码获取地址
  checkCodeSrc: baseURL + '/authImage',
  // 登陆请求
  login: (params) => request.get('/login', {params}),
  // 注册请求
  register: (params) => request.get('/register', {params}),
  // 注册用户名检测
  vCheckRUsername: (params) => request.get('/vcheckrusername', {params}),
  // 验证码检测
  vCheckCode: (params) => request.get('/vcheckcode', {params})
}
