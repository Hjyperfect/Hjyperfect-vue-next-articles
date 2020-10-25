# 使用 Typescript + Vue3.0 个人学习使用

* Vue3 配合 Typescript ，使用新版Vuex 和 Vue-Router 全家桶完成前后端分离复杂项目

### 安装依赖
```
npm install
```

### 运行本地开发环境

**特别注意，起初本项目为慕课网学习使用，要使用慕课网的防盗 API, 可以在 main.ts 拦截器中一劳永逸的添加**

```javascript
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
// 笔者会及时更新icode: D22AA504EF11A840
axios.interceptors.request.use(config => {
  ... 其他代码
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '******' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '******')
  } else {
  // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '******' }
  }
  return config
})
```

```
npm run serve
```
