<template>
    <div class="file-page">
        <div class="container">
            <div>
               <el-form :inline="true" label-width="60px" :model="formInline" class="demo-form-inline search-form">
                    <el-form-item label="关键词">
                        <el-input class="input-father" clearable  v-model="formInline.user" placeholder="可输入姓名,部门"></el-input>
                    </el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="this.managementAll">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="makemanagement()">添加会员</el-button>
                    </el-form-item>
              </el-form>
               <el-table ref="multipleTable" :data="departmentData" class="defaultTab dictionaryTypeTab" tooltip-effect="dark" border stripe style="width: 100%">
                  <el-table-column label="序号" width="64" type="index">
                  </el-table-column>
                  <el-table-column prop="username" label="姓名" width="120">
                  </el-table-column>
                  <el-table-column prop="departmentName" label="部门" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="fCardNumber" label="会员卡号" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column fixed="right" label="操作" width="160">
                      <template slot-scope="scope">
                        <el-button type="text" size="small" @click="pointDetail(scope.row.fId)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="rule_pagination">
                 <el-pagination id="page" :current-page="searchParam.currentPage" layout="total, sizes, prev, pager, next, jumper"
                   :total="searchParam.sum" :page-size="searchParam.pageSize" :page-sizes="searchParam.pageSizes"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange">
                 </el-pagination>
              </div>
            </div>
        </div>
        <!-- 添加会员弹窗 -->
         <TheDialog :modal='point' :modalTitle="pointTitle" @closeModal="point=false;">
              <div slot="custom-modal-content">
                  <el-form ref="form" label-position="left">
                      <el-form-item label="会员姓名:">
                          <el-select v-model="namevalue" filterable placeholder="请选择">
                              <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.fUserName"
                                :value="item.fId">
                              </el-option>
                            </el-select>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" @click="add_memer()">立即添加</el-button>
                        <el-button @click="reset_rule('ruleform')">重置</el-button>
                      </el-form-item>
                  </el-form>
                </div>
        </TheDialog>

    </div>
</template>
<script>
   import { managementService } from '@/api/personal-info'; //引入api
   import TheDialog from "@/components/TheDialog";
   export default {
     components: {
       TheDialog
     },
     data() {
       return {
         point:false,
         pointTitle:'',
         formInline: {
           user: null, //用户输入的内容
           region: null //选择的部门
         },
         departmentData: [{
           name: '杨高杰', //姓名
           department: '安环部', //部门
           department_m: '500', //名誉积分
           department_k: '300' //可兑换积分
         }, {
           name: '杨高杰', //姓名
           department: '安环部', //部门
           department_m: '500', //名誉积分
           department_k: '300' //可兑换积分
         }, {
           name: '杨高杰', //姓名
           department: '安环部', //部门
           department_m: '500', //名誉积分
           department_k: '300' //可兑换积分
         }, {
           name: '杨高杰', //姓名
           department: '安环部', //部门
           department_m: '500', //名誉积分
           department_k: '300' //可兑换积分
         }, ],
         searchParam: {
           currentPage: 1,
           sum: 0,
           pageSizes: [10, 20, 30, 40],
           pageSize: 10,
         },
         options: [],
        namevalue: '',

       }
     },
     mounted() {
        this.getAllUser();
        this.managementAll();
     },
     methods: {
       makemanagement(){
          this.point=true;
          this.namevalue='';
          this.pointTitle="新加会员";
       },
       reset_rule(){
         this.namevalue='';
       },
       add_memer(){
         this.addmemebers()
       },
       //获取所有人员
        async getAllUser() {
          const res = await managementService.getAllUser();
          if (res.success) {
            this.options=res.obj
          } else {
            this.$message.warning(res.msg);
          }
        },
        //分业查询所有规则
         async managementAll() {
          const res = await managementService.managementAll({
            pageCurrent: this.searchParam.currentPage,
            pageSize: this.searchParam.pageSize,
            content: this.formInline.user,
            departmentName:this.formInline.region,
          });
          if (res.success) {
            this.departmentData = res.obj.items
            this.searchParam.sum = res.obj.itemTotal
          } else {
            this.$message.warning(res.msg);
          }
        },
        //分页操作
        handleSizeChange(val) {
          this.searchParam.pageSize = val;
          this.managementAll();
        },
        handleCurrentChange(val) {
          this.searchParam.currentPage = val;
          this.managementAll();
        },
        //删除某个会员
        pointDetail(fid) {
            this.$confirm('是否删除该会员?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.delecte(fid)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
        },
        async delecte(id) {
          const res = await managementService.delecte(id);
          if (res.success) {
             this.$message({
               message: '删除成功',
               type: 'success'
             });
             this.managementAll();
             this.getAllUser();
          } else {
            this.$message.warning(res.msg);
          }
        },
        //添加会员
        async addmemebers() {
          if(this.namevalue==""||this.namevalue==null){
              this.$message.warning("请选择人员");
              return false;
          }
          const res = await managementService.addmemeber({
             userId:this.namevalue
          });
          if (res.success) {
             this.$message({
               message: '添加成功',
               type: 'success'
             });
             this.namevalue='';
             this.managementAll();
             this.getAllUser()
          } else {
            this.$message.warning(res.msg);
          }
        },

     }
   }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .file-page {
         width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 5px;

          .container {
            padding: 15px 10px;

            .rule_pagination {
              margin-top: 1.25rem;
              text-align: right;
            }
          }
        }
</style>
