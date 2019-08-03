<template>
    <div>

      <el-form :inline="true" class="demo-form-inline">
        <el-button type="success" plain icon="el-icon-plus" v-on:click="add()">新增</el-button>
        <el-button type="danger" plain icon="el-icon-delete" v-on:click="deleteAll()"> </el-button>

        <el-form-item label="姓名">
          <el-input v-model="mypage.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>

      </el-form>

      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
        prop="id"
        label="#"
        width="120">
        <!--<template slot-scope="scope">{{ scope.row.name }}</template>-->
      </el-table-column>

        <el-table-column
          prop="photo"
          label="头像"
          width="120">
          <template slot-scope="scope">
            <el-image :src="scope.row.photo"></el-image>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="姓名"
          width="120">
          <!--<template slot-scope="scope">{{ scope.row.name }}</template>-->
        </el-table-column>


        <el-table-column
          prop="age"
          label="年龄"
          width="120">
           <!--<template slot-scope="scope">{{scope.row.age}}</template>-->
        </el-table-column>

        <el-table-column
          prop="sex"
          label="性别"
          width="120">
          <!--<template slot-scope="scope">{{scope.row.sex}}</template>-->
        </el-table-column>

        <el-table-column
          label="操作"
          width="240">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="fordelete(scope.row.id)">删除</el-button>
            <el-button type="success" plain icon="el-icon-edit" v-on:click="update(scope.row)">修改</el-button>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination
        background
        layout="prev, pager, next,sizes"
        :total="total"
        :page-sizes=[1,2,3,4,5]
        :page-size="mypage.pageSize"
        @current-change="nextOrOtherPage"
        @size-change="pageSizeChange"
        >
      </el-pagination>

      <!--添加 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible">

        <el-form :model="formdata">

          <el-form-item label="#" :label-width="formLabelWidth">
            <el-input :readonly=true v-model="formdata.id" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="头像" :label-width="formLabelWidth">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:10000/test/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <el-form-item label="姓名" :label-width="formLabelWidth">
            <el-input v-model="formdata.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="年龄" :label-width="formLabelWidth">
            <el-input  v-model="formdata.age" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio v-model="formdata.sex" label="男">男</el-radio>
            <el-radio v-model="formdata.sex" label="女">女</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="toclose">取 消</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData:[],
        Selection:[],
          total:5,
        mypage:{
          page:1,
          pageSize:3,
          name:""
        },
        //默认添加表单是关闭状态
        formdata:{},
        formLabelWidth:'120px',
        dialogFormVisible:false,
        imageUrl:""
      }
    },
    mounted(){
      this.getList()
    },
    methods: {
       getList(){
         this.$axios.post("http://localhost:10000/test/getlist",this.mypage).then(respost=>{
           this.tableData = respost.data.list;
           this.total = respost.data.total;
         })
       },
      //点击下一页
      nextOrOtherPage(val) {
        this.mypage.page = val;
        this.getList();
      },
      pageSizeChange(val) {
        this.mypage.pageSize = val;
        this.getList();
      },
      update(student){
        this.formdata= student;
        this.imageUrl= student.photo;
        this.dialogFormVisible=true;
      },
      save(){
        let url = "http://localhost:10000/test/add"
        if (this.formdata.id>0){
          url = "http://localhost:10000/test/update"
        }
        this.$axios.post(url,this.formdata).then(respost =>{
          if (respost.data == "ok"){
            this.getList();
            this.imageUrl=""
            this.$message({
              message:'保存成功',
              type:'success'
            });
          } else{
            this.$message.error("失败");
          }
         this.toclose();
        })
      },
      add() {
        this.formdata={id:0}
        this.dialogFormVisible = true;
      },
      toclose() {
        this.formdata = {};
        this.dialogFormVisible = false;
      },
    fordelete(id){
        this.$axios.post("http://localhost:10000/test/delete?id="+id).then(res=>{
          if (this.data == "ok"){
            if ((this.total -1 )%this.mypage.pageSize == 0){
              this.mypage.page = this.mypage.page-1;
            }
            this.getList();
            this.$message({
              message:'成功',
              type:'success'
            });
          } else{
              this.$message.error("失败");
          }
        })

    },
      deleteAll(){
        let ids ="";
        ids = this.Selection.map(mod=>{
          return mod.id;
        })
        this.$axios.post("http://localhost:10000/test/deleteAll?ids="+ids).then(respost=>{
          if (this.data == "ok"){
            if ((this.total -1)% this.mypage.pageSize == 0){
              this.mypage.page = this.mypage.page-1;
            }
            this.getList();
            this.$message({
              message:'成功',
              type:'success'
            });
          }else {
            this.$message.error("失败");
          }
        })
      },
      handleSelectionChange(val) {
        this.Selection = val;
      },
      onSubmit(){
        this.getList();
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        console.log(file)
        this.formdata.photo="http://localhost:8090/"+file.name;
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style>

</style>
