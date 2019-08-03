//全局的配置的一些服务端的域名
const serverpath='http://127.0.0.1:8888/'
//WebSocket实时信息提示功能
const webSocketUrl='ws://localhost:8888/ws/websocket/'
//图片上传
const serverimageupload='http://'
//试题类型
const shititype=[
  {label:'单选题',value:"1"},
  {label:'多选题',value:"2"},
  {label:'判断题',value:"3"},
  {label:'填空题',value:"4"},
  {label:'问答题',value:"5"}];

//试题难易程度
const texts=["简单","一般","稍难","困难","汗颜难"]
const textsList=[{label:"简单",value:"1"},{label:"一般",value:"2"},
  {label:"稍难",value:"3"},{label:"困难",value:"4"},{label:"汗颜难",value:"5"}]

//试题状态
const shitistatus=[
  {label:'开放',value:'1'},
  {label:'关闭',value:'0'}
   ]

//选项名称
const xuanxiang=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]

const userinfo={};
const websocket=null;
export default {
  webSocketUrl,//webSocket配置的url
  serverpath,  //WebServer的服务端地址
  userinfo,
  shititype,
  texts,
  shitistatus,
  xuanxiang,
  textsList,
  websocket
}

