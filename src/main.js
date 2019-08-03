// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入jQuery
import $ from 'jquery'
Vue.prototype.$=$
//全局配置的访问服务端的域名
import domain from './domain.js'
//存入全局备用
Vue.prototype.domain=domain

//AES加密
import utils from '@/js/utils.js'
Vue.prototype.toAes=utils

//配置Axios
import vueAxios from 'axios'

//默认当axios
//设置vueAxios.defaults.withCredentials的值为true进行跨域请求的时候是不会携带Cookies的则跨域的时候会带上cookie
vueAxios.defaults.withCredentials = true;

//为axios添加一个请求拦截器start
vueAxios.interceptors.request.use((config)=>{
  //使用拦截器发送前携带上JWT token参数
  let token=window.localStorage.getItem("token");
  config.headers['Authorization']=token
  return config;
},(error)=>{
  return Promise.reject(error)
})
//为axios添加一个请求拦截器end

//设置一个响应拦截器用来刷新token信息start
vueAxios.interceptors.response.use((response)=>{

  let yy=response.headers['authorization'];

  if(yy!=undefined){
    //重新设置localStorge中的token的值，用来刷新tocken
    window.localStorage.setItem("token",yy)
  }
  return response;
},(error)=>{
  //失败跳转到登录界面
  router.replace({
    path: '/',
    query: {redirect: router.currentRoute.fullPath}
  })
})
//设置一个响应拦截器end

//添加路由拦截，拦截路由权限start
router.beforeEach((to,from,next)=>{
  //判断是否登录 to.meta.require是true说明需要进行登录的验证
  if(to.meta.require){
    //获取本地存储中的jwt token
    let token=window.localStorage.getItem("token");
    if(token!=null){
      next();
    }else{
      next({path:"/"});//跳转到登录页面
    }
  }else{
    //否则说明不需要进行登录的验证
    next();
  }
  //判断是否在权限列表中

});

//添加路由拦截，拦截路由权限end

//将axios存储在全局的VUe中然后就可以用this.的方式去掉用
Vue.prototype.$axios=vueAxios




//自己导入的小图片
import './assets/font/iconfont.css'
import './assets/xiaotubiao/iconfont.css'
//vue的样式配置start
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)
//vue的样式配置end

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


/* 引入UEditer start */
import '../static/UE/ueditor.config.js'
import '../static/UE/ueditor.all.min.js'
import '../static/UE/lang/zh-cn/zh-cn.js'
import '../static/UE/ueditor.parse.min.js'
/* 引入UEditer end*/
//音频文件的使用
import yinpin from '../static/tishiyin/tishiyin.mp3'
import aiya from '../static/tishiyin/aiya.mp3'
import en from '../static/tishiyin/en.mp3'
import qingsong from '../static/tishiyin/dahuaxiyou.mp3'

Vue.prototype.playAudio = (id,yinyue) => {
  let buttonAudio = document.getElementById(id);
  if(yinyue=="yinpin"){
    buttonAudio.setAttribute('src',yinpin)
  }
  if(yinyue=="en"){
    buttonAudio.setAttribute('src',en)
  }
  if(yinyue=="aiya"){
    buttonAudio.setAttribute('src',aiya)
  }
  if(yinyue=="qingsong"){
    buttonAudio.setAttribute('src',qingsong)
  }
  buttonAudio.play()
}
