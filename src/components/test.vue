<template>
  <div>
  <el-row class="tac">
    <el-col :span="4">
      <h5>导航窗格</h5>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">

        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>

          <el-submenu index="1-0">
            <template slot="title">分组一</template>
            <el-menu-item index="1-1" v-on:click="topath('/test01')">用户列表</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>

          <el-submenu index="2-0">
            <template slot="title">分组二</template>
            <el-menu-item index="2-1">选项3</el-menu-item>
            <el-menu-item index="2-2">选项4</el-menu-item>
          </el-submenu>

          <el-submenu index="3-0">
            <template slot="title">分组三</template>
            <el-menu-item index="3-1">选项1</el-menu-item>
          </el-submenu>

        </el-submenu>

        <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item>

        <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>

        <el-menu-item index="4">
          <i class="el-icon-setting"></i>
          <span slot="title">导航四</span>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="20">
      <router-view/>
    </el-col>
  </el-row>

  </div>
</template>

<script>
  export default {

    name:"test",
    methods:{
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
    handleClose(key, keyPath) {
    console.log(key, keyPath);
       },
      topath(url){
        this.$router.push(url)
      }
     }
    }
</script>

<style scoped>

</style>
