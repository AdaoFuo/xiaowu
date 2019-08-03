<template>
  <div class="login-wrap" :style="divimg">

    <div>
      <p class="p-title">LCG我爱编码,蛟龙在线,欢迎点评</p>
    </div>
    <div class="ms-login">
      <div class="ms-title">
        欢迎使用
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="ms-content">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <el-button slot="prepend" icon="iconfont icon-guanliyuanrenzheng"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input type="password" placeholder="请输入认证密码" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')">
            <el-button slot="prepend" icon="iconfont icon-yuechi"></el-button>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <div class="form-inline-input">
            <div class="code-box" id="code-box">
              <input ref="coderef" type="text" name="code" class="code-input" />
              <p></p>
              <span style="color:#909399">
                     拖动验证
                  </span>
            </div>
          </div>
        </el-form-item>


        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!-- 登录进度 -->
        <el-progress ref="jindu" :style="jindustyle"  :text-inside="true"
                     :stroke-width="18"
                     :percentage="percent"
                     status="success"></el-progress>
      </el-form>
    </div>



  </div>
</template>

<script>
  export default {
    name: "login",
    data(){
      return{
        divimg:{//背景图片的使用
          backgroundImage:"url(" + require('../../assets/yun.jpg') + ")",
          backgroundRepeat: "no-repeat",
          height:"100%",
          width:"100%",

          overflow:"hidden",
          backgroundSize:"cover"
        },
        percent:0,
        jindustyle:{
          display:'none'
        },
        ruleForm: {
          username:'zhangsan',
          password:'123456'
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      submitForm(ruleid){

        let code=this.$refs.coderef.value;
        if(code==null||code==""){
          const h = this.$createElement;
          this.$notify({
            title: '提示信息：',
            message: h('i', { style: 'font-style:normal'}, '请进行拖动校验！'),
            duration:1500 //延时时间
          });
        }else{
          //登陆操作
          let par={};
          //将用户名和密码的明文进行加密
          par.loginname=this.ruleForm.username;
          par.password=this.ruleForm.password;
          if(this.ruleForm.username==""||this.ruleForm.username==null){
            this.$notify.info({
              title: '提示',
              message: '请填写用户名'
            });
            return;
          }
          if(this.ruleForm.password==""||this.ruleForm.password==null){
            this.$notify.info({
              title: '提示',
              message: '请填写密码'
            });
            return;
          }
          par.code=this.$refs.coderef.value;
          //转JSON串
          let canshu=this.toAes.encrypt(JSON.stringify(par));
          let params={canshu:canshu};
          let qs=require("qs");
          //打开登陆进度条
          this.$data.jindustyle.display='block';
          //每0.1秒更新一下进度
          var timer=setInterval(()=>{
            let pp=this.$data.percent+10;
            if(pp>=100){
              pp=99;
            }
            this.$data.percent=pp;
          },100)

          this.$axios.post(this.domain.serverpath+"login",qs.stringify(params)).then((response)=>{

            let respo=response.data;
            if(respo.success=="ok"){
              //存储token到浏览器端的缓存中，
              window.localStorage.setItem("token",respo.token);
              //关闭加载窗
              this.$data.percent=100
              //隐藏进度条
              this.$data.jindustyle.display='none'
              //关闭定时
              clearInterval(timer)

              //跳转到首页界面
              this.domain.userinfo.username=respo.result.username
              this.domain.userinfo.userid=respo.result.id
              //将用户ID存入到全局的VUE对象中

              this.$router.push({path:'/view/shouye/shouye',query:{username:respo.result.username,userid:respo.result.id}});
            }else if(respo.error!=null){
              //关闭加载窗
              //关闭加载窗
              this.$data.percent=100
              //隐藏进度条
              this.$data.jindustyle.display='none'
              //关闭定时
              clearInterval(timer)
              this.$notify.error({
                title: '提示',
                duration:1000,
                message: respo.error
              });
            }

          }).catch((error)=>{
            //关闭加载窗
            this.$data.percent=100;
            //隐藏进度条
            this.$data.jindustyle.display='none';
            //关闭定时
            clearInterval(timer);
            this.$notify.error({
              title: '错误',
              message: '出错了~_~，请联系管理员！'
            });
          })


        }

      },
      //拖动验证start
      getOffset(box,direction){
        var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
        var offset = box[setDirection];
        var parentBox = box.offsetParent;
        while(parentBox){
          offset+=parentBox[setDirection];
          parentBox = parentBox.offsetParent;
        }
        parentBox = null;
        return parseInt(offset);
      },
      moveCode(code,_this){
        var fn = {codeVluae : code};
        var box = document.querySelector("#code-box"),
          progress = box.querySelector("p"),
          codeInput = box.querySelector('.code-input'),
          evenBox = box.querySelector("span");
        //默认事件
        var boxEven = ['mousedown','mousemove','mouseup'];
        //改变手机端与pc事件类型
        if(typeof document.ontouchstart == 'object'){
          boxEven = ['touchstart','touchmove','touchend'];
        }
        var goX,offsetLeft,deviation,evenWidth,endX;
        function moveFn(e){
          e.preventDefault();
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          endX = e.clientX - goX;
          endX = (endX > 0) ? (endX > evenWidth) ? evenWidth : endX : 0;
          if(endX > evenWidth * 0.7){
            progress.innerText = '松开验证';
            progress.style.backgroundColor = "#66CC66";
          }else{
            progress.innerText = '';
            progress.style.backgroundColor = "#FFFF99";
          }
          progress.style.width = endX+deviation+'px';
          evenBox.style.left = endX+'px';
        }
        function removeFn() {
          document.removeEventListener(boxEven['2'],removeFn,false);
          document.removeEventListener(boxEven['1'],moveFn,false);
          if(endX > evenWidth * 0.7){
            progress.innerText = '验证成功';
            progress.style.width = evenWidth+deviation+'px';
            evenBox.style.left = evenWidth+'px'
            codeInput.value = fn.codeVluae;
            evenBox.onmousedown = null;
            _this.ruleForm.verification = true;

            //alert( codeInput.value);

          }else{
            progress.style.width = '0px';
            evenBox.style.left = '0px';
          }
        };
        function getOffset(box,direction){
          var setDirection = (direction == 'top') ? 'offsetTop' : 'offsetLeft' ;
          var offset = box[setDirection];
          var parentBox = box.offsetParent;
          while(parentBox){
            offset+=parentBox[setDirection];
            parentBox = parentBox.offsetParent;
          }
          parentBox = null;
          return parseInt(offset);
        };
        evenBox.addEventListener(boxEven['0'], function(e) {
          e = (boxEven['0'] == 'touchstart') ? e.touches[0] : e || window.event;
          goX = e.clientX,
            offsetLeft = getOffset(box,'left'),
            deviation = this.clientWidth,
            evenWidth = box.clientWidth - deviation,
            endX;
          document.addEventListener(boxEven['1'],moveFn,false);
          document.addEventListener(boxEven['2'],removeFn,false);
        },false);
        fn.setCode = function(code){
          if(code)
            fn.codeVluae = code;
        }
        fn.getCode = function(){
          return fn.codeVluae;
        }
        fn.resetCode = function(){
          alert("====")
          evenBox.removeAttribute('style');
          progress.removeAttribute('style');
          codeInput.value = '';
        };
        return fn;
      }//拖动验证end

    },
    mounted(){
      var _this = this;
      var code = "";
      //从后台获取滑动验证码
      //参数 url 访问参数
      this.$axios.post(this.domain.serverpath+'getCode').then((response)=>{
        code=response.data.result;
        //向浏览器写一个Cookie
        document.cookie = 'testCookies' + "=" + response.data.token + "; " + -1;
        _this.moveCode(code,_this);
      }).catch((error)=>{

      })

//});
    }
  }
</script>

<style scoped>
  /*  .login-wrap{
      position: relative;
      width:100%;
      height:100%;
      background-image: url(../../assets/login-bg.jpg);
      background-size: 100%;
    }*/
  .ms-title{
    width:100%;
    line-height: 50px;
    text-align: left;
    font-size:20px;
    color: #fff;
    font-style:italic;
    border-bottom: 1px solid #ddd;
  }
  .ms-login{
    position: absolute;
    left:70%;
    top:50%;
    width:350px;
    margin:-190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255,255,255, 0.3);
    overflow: hidden;
  }
  .ms-content{
    padding: 30px 30px;
  }
  .login-btn{
    text-align: center;
  }
  .login-btn button{
    width:100%;
    height:36px;
    margin-bottom: 10px;
  }
  .login-tips{
    font-size:12px;
    line-height:30px;
    color:#fff;
  }

  /** 滑动验证start **/
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 290px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 40px;
    background-color:#fff;
    font-size: 16px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #FFFF99;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .form-inline-input{
    border:1px solid #dadada;
    border-radius:5px;
  }
  .form-inline-input input,
  .code-box{
    padding: 0 3px;
    width: 285px;
    height: 40px;
    color: #fff;
    text-shadow: 0px 0px 0px black;
    background: #efefef;
    border: 0;
    border-radius: 5px;
    outline: none;
  }
  .code-box{
    position: relative;
  }
  .code-box p,
  .code-box span{
    display:block;
    position: absolute;
    left: 0;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 5px;
    padding:0;
    margin:0;
  }
  .code-box span{
    width: 70px;
    background-color:#fff;
    font-size: 12px;
    cursor: pointer;
    margin-right:1px;
  }
  .code-box p{
    width: 0;
    background-color: #F5F7FA;
    overflow: hidden;
    text-indent: -20px;
    transition: background 1s ease-in;
  }
  .code-box .code-input{
    display: none;
  }
  .code-box .code-input{
    display: none;
  }
  .p-title{
    color: white;
    font-size: 16px;
    text-align: left;
    padding-left: 20px;
    font-style:italic
  }
  /** 滑动验证end **/
</style>
