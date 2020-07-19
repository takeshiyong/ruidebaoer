/*
* @Author: 杨高杰
* @Date:   2019-0-09
* @Description: '货物管理'
*
* @Modified:
* 1. 2019-09-12 元实 级别类型配置
* 2. 2019-10-08 元实　解决点击“搜索”没有效果的问题
*/
<template>
    <div class="goods-page">
          <div class="container">
             <div>
                <el-form :inline="true" label-width="100px" :model="formInline" class="demo-form-inline search-form">
                     <el-form-item label="货物名称">
                         <el-input class="input-father" clearable  v-model="formInline.name" placeholder="请输入货物名称"></el-input>
                     </el-form-item>
                     <el-form-item label="货物类型" label-width="100px">
                         <el-select class="input-father" clearable v-model="formInline.cate" placeholder="请选择课程分类">
                             <el-option v-for="(val,index) in goodcates" :key="index" :label="val.fTypeName" :value="val.fId"></el-option>
                         </el-select>
                     </el-form-item>
                     <el-form-item>
                         <el-button type="primary" icon="el-icon-search" @click="goodlist">搜索</el-button>
                         <el-button type="primary" icon="el-icon-plus" @click="makecate">新建货物类型</el-button>
                         <el-button type="primary" icon="el-icon-plus" @click="makegood">新建货物</el-button>
                         <el-badge is-dot class="item" :hidden="catebadge">
                            <el-button type="primary" @click="seecate">查看货物类型</el-button>
                         </el-badge>
                         <el-button type="primary" icon="el-icon-edit" @click="configureTypes">级别类型配置</el-button>
                     </el-form-item>
               </el-form>
               <el-table :data="good_table" border style="width: 100%; margin-top: 20px" stripe class="defaultTab dictionaryTypeTab">
                     <el-table-column label="序号" width="64" type="index">
                     </el-table-column>
                     <el-table-column prop="fGoodsName" width="240" label="货物名称" :show-overflow-tooltip="true">
                     </el-table-column>
                     <el-table-column prop="fTypeName" label="货物类型" width="240">
                     </el-table-column>
                     <el-table-column prop="fMaxSize" label="最大粒径" width="150">
                     </el-table-column>
                     <el-table-column prop="fMinSize" label="最小粒径" width="150">
                     </el-table-column>
                     <el-table-column prop="fUnit" label="单位" width="80">
                     </el-table-column>
                     <el-table-column prop="fRemark" label="货物备注" :show-overflow-tooltip="true">
                     </el-table-column>
                     <el-table-column fixed="right" label="操作" width="160">
                         <template slot-scope="scope">
                             <el-button type="text" size="small" @click="ediogod(scope.$index,scope.row.fId)">编辑</el-button>
                             <el-button type="text" size="small" @click="delatgoods(scope.row.fId)" style="color:#F56C6C;">删除</el-button>
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
         <!-- 货物类型弹窗 -->
         <el-dialog title="货物类型" :visible.sync="seegoodcste" width="30%" center>
             <el-table :data="goodcatetable" border style="width: 100%;font-size:12px;color:#666;" class="defaultTab dictionaryTypeTab">
               <el-table-column label="序号" width="64" type="index">
               </el-table-column>
               <el-table-column label="货物类型名称" prop="fTypeName" :show-overflow-tooltip="true">
               </el-table-column>
                <el-table-column label="操作" width="160">
                   <template slot-scope="scope">
                       <el-button   type="text" size="small" @click="ediohl(scope.row.fId,scope.row.fTypeName)">编辑</el-button>
                       <el-button   type="text" size="small" @click="deletcate(scope.row.fId)" style="color:#F56C6C;">删除</el-button>
                   </template>
               </el-table-column>
             </el-table>
         </el-dialog>
         <!-- 新建货物类型弹窗 -->
          <TheDialog :modal='point' :modalTitle="pointTitle" @closeModal="point=false;">
               <div slot="custom-modal-content">
                    <el-form :model="craetgood" ref="craetgood" label-width="100px" class="demo-ruleForm">
                          <el-form-item label="货物类型" prop="name" :rules="[
                             { required: true, message: '名称不能为空'},
                              { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
                            ]">
                            <el-input maxlength="18" type="typename" placeholder="请输入货物类型名称" v-model="craetgood.name" autocomplete="off"></el-input>
                          </el-form-item>
                          <el-form-item>
                            <el-button v-if="this.pointTitle=='新建货物类型'" type="primary" @click="submitname('craetgood')">提交</el-button>
                            <el-button v-if="this.pointTitle=='编辑货物类型'" type="primary" @click="edioname('craetgood')">编辑</el-button>
                            <el-button @click="resetForm('craetgood')">重置</el-button>
                          </el-form-item>
                    </el-form>
               </div>
         </TheDialog>
         <!-- 新建货物 -->
         <TheDialog :modal='pointgoodshow' :modalTitle="pointTitle" @closeModal="pointgoodshow=false;">
               <div slot="custom-modal-content">
                    <el-form :model="pointgood" ref="pointgood" :rules="rules" label-width="100px" class="demo-ruleForm">
                      <el-form-item label="货物名称" prop="name" :rules="[
                        { required: true, message: '名称不能为空'},
                         { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
                       ]">
                        <el-input style="width: 50%;" type="text" placeholder="请输入货物名称" v-model="pointgood.name" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="货物类型" prop="cate" :rules="[{ required: true, message: '请选择货物类型',trigger: 'change'
                      }]">
                        <el-select  style="width: 50%;" v-model="pointgood.cate" placeholder="请选择货物类型">
                            <el-option v-for="(val,index) in goodcates" :key="index" :label="val.fTypeName" :value="val.fId"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="最大粒径" prop="maxsize">
                        <el-input style="width: 50%;" type="number" placeholder="请输入最大粒径数值为数字" v-model="pointgood.maxsize"  autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="最小粒径" prop="minsize">
                        <el-input style="width: 50%;"  type="number" placeholder="请输入最小粒径数值为数字" v-model="pointgood.minsize" @blur="numberyz"  autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="单位" prop="unit" :rules="[
                        { required: true, message: '单位不能为空'},
                       ]">
                        <el-input style="width: 50%;" type="text" placeholder="请输入粒径单位" v-model="pointgood.unit" autocomplete="off"></el-input>
                      </el-form-item>
                      <el-form-item label="货物备注" prop="remarks" :rules="[
                        { required: true, message: '备注不能为空'},
                       ]">
                        <el-input type="textarea" maxlength="60" placeholder="请输入货物备注" show-word-limit v-model="pointgood.remarks"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button  v-if="this.pointTitle=='新建货物'" type="primary" @click="creat_good('pointgood')">立即创建</el-button>
                        <el-button  v-if="this.pointTitle=='编辑货物'" type="primary" @click="edit_good('pointgood')">立即编辑</el-button>
                        <el-button @click="reset_good('pointgood')">重置</el-button>
                      </el-form-item>
                    </el-form>
               </div>
         </TheDialog>

        <!-- 级别类型设置弹框-->
        <TheDialog
            :modal="isConfigureDialogShown"
            modalTitle="级别类型配置"
            @closeModal="closeDialog">
            <template v-slot:custom-modal-content>
                <el-form
                    ref="configurationForm"
                    class="demo-form-inline input-form">

                    <el-table
                        ref="configureTable"
                        :data="configurationForm"
                        class="defaultTab margin-top-20"
                        highlight-current-row
                        stripe>

                        <el-table-column
                            label="类型"
                            width="100"
                            prop="fType">
                        </el-table-column>

                        <el-table-column
                            label="部门级别"
                            prop="department">
                            <template slot-scope="scope">
                                <el-select
                                    v-model="scope.row.fLevel"
                                    placeholder="部门级别"
                                    clearable
                                    :ref="'depTypeSelect' + scope.$index"
                                    @blur="handleSelectBlur"
                                    @change="(value) => {handleSelectChange(value, 'depTypeSelect' + scope.$index)}">
                                    <el-option v-for="type in departmentTypes"
                                    :key="type.fId"
                                    :label="type.fName"
                                    :value="type.fId"
                                    ></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="备注"
                            prop="fRemark"
                            :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-input
                                    v-model="scope.row.fRemark"
                                    placeholder="备注"
                                    clearable></el-input>
                            </template>
                        </el-table-column>
                    </el-table>


                    <el-row  type="flex" justify="center" class="form-buttons margin-top-15">
                        <el-button type="primary" @click.stop="submitConfigureData">确定</el-button>
                        <el-button @click.stop="resetForm('configurationForm')">重置</el-button>
                    </el-row>
                </el-form>
            </template>
        </TheDialog>
        <!-- 级别类型设置弹框-->
    </div>
</template>
<script>
  import TheDialog from "@/components/TheDialog";
  import { GoodService } from '@/api/production'; //引入api
  export default {
     components: {
        TheDialog
    },
    data() {
      //校验正数
      let validateInt = (rule, value, callback) => {
        if (!value) {
          callback();
          return;
        }
        let reg = /^[1-9][0-9]*$/;
        if (!reg.test(value)) {
          callback(new Error('请填写正确的数值(大于0的整数值)'));
        } else {
          callback();
        }
      };
      return {
        //搜索相关
        formInline:{
          name:'',
          cate:''
        },
        //表格数据
        good_table:[{
          name:"码头货物",
          cate:"黑货啊",
          maxsize:'300',
          minsize:'50',
          unit:"kg",
          remarks:"杨高杰家的货物"
        }],
        //货物类型
        goodcates:[],
        seegoodcste:false,//货物弹窗
        //弹窗内表格
        goodcatetable:[{
          name:'码头'
        }],
        point:false,//新建货物类型显隐
        pointgoodshow:false,//新建or编辑货物的显隐
        pointTitle:'新建货物类型',//新建货物类型标题
        catebadge:true,
         /* 首页分页相关*/
        searchParam: {
          currentPage: 1,
          sum: 2,
          pageSizes: [10, 20, 30, 40],
          pageSize: 10,
        },
        //新建货物类型
        craetgood:{
          name:''
        },
        //新加货物
        pointgood:{
          name:"",
          cate:"",
          maxsize:"",
          minsize:"",
          unit:"",
          remarks:""
        },
        cateid:'',//货物类型id
        goodid:'',
        //新建货物的校验
        rules: {
          maxsize: [
              {
                  required: true,
                  message: "请填写最大粒径",
                  trigger: "blur"
              },
              {
                  validator: validateInt,
                  trigger: "blur"
              }
          ],
          minsize: [
               {
                   required: true,
                   message: "请填写最小粒径",
                   trigger: "blur"
               },
              {
                  validator: validateInt,
                  trigger: "blur"
              }
          ],
        },

        departmentTypes: [], //部门类型
        isConfigureDialogShown: false, //是否展示级别类型弹框
        isEditConfigurationMode: false, //是否编辑级别类型数据
      　configurationForm: [ //类型级别配置
           {
               fType: 1,  //类型
               fLevel: '', //部门级别
               fRemark: '' //备注
           },

           {
               fType: 2,  //类型
               fLevel: '', //部门级别
               fRemark: '' //备注
           },

           {
               fType: 3,  //类型
               fLevel: '', //部门级别
               fRemark: '' //备注
           }
        ],

        configurationFormRules: {
            fLevel: { required: true, message: '请选择部门级别', trigger: 'blur' }
        }
      }
    },
     mounted() {
       this.goodtype();
       this.goodlist();
    },
    methods: {
       /* 新建货物类型表单*/
       makecate(){
          this.point=true;
          this.pointTitle="新建货物类型";
          this.craetgood={
            name:''
          }
       },
       /*编辑货物类型确认按钮*/
       edioname(){
         this.ediotype()
       },
       //删除货物
       delatgoods(fid){
          this.$confirm('此操作将删除该货物, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
             }).then(() => {
                this.deletgood(fid)
             }).catch(() => {
               this.$message({
                 type: 'info',
                 message: '已取消删除'
               });
             });
       },
       /* 查看货物类型表单*/
       seecate(){
           this.catebadge=true;
           this.seegoodcste=true
       },
       ediohl(fid,fname){
         this.seegoodcste=false;
         this.point=true;
         this.pointTitle="编辑货物类型";
         this.cateid=fid
         this.craetgood={
           name:fname
         }
       },
       deletcate(fid){
         this.$confirm('此操作将删除该类型, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
               this.delettype(fid)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
       },
        /* 新建货物表单*/
       makegood(){
          this.pointgoodshow=true;
          this.pointTitle="新建货物";
          this.pointgood={
            name:"",
            cate:"",
            maxsize:'',
            minsize:'',
            unit:"",
            remarks:""
          }
       },
       creat_good(formName){
           this.$refs[formName].validate((valid) => {
            if (valid) {
               this.addgoods()
            } else {
              console.log('error submit!!');
              return false;
            }
          });
       },
       /* 提交表单*/
        submitname(formName){
            this.$refs[formName].validate((valid) => {
             if (valid) {
                this.addgoodtype()
             } else {
               console.log('error submit!!');
               return false;
             }
           });
        },
         /* 编辑首页表格确定*/
        edit_good(formName){
            this.$refs[formName].validate((valid) => {
             if (valid) {
                this.ediogood()
             } else {
               console.log('error submit!!');
               return false;
             }
           });
        },
       /* 重置表单*/
      resetForm(formName) {
          this.$refs[formName].resetFields();
      },
      reset_good(formName) {
          this.$refs[formName].resetFields();
      },
      /* 编辑首页表单*/
      ediogod(index,id){
         this.goodid=id;
         this.pointgoodshow=true;
         this.pointTitle="编辑货物";
         this.pointgood={
           name:this.good_table[index].fGoodsName,
           cate:this.good_table[index].fTypeId,
           maxsize:this.good_table[index].fMaxSize,
           minsize:this.good_table[index].fMinSize,
           unit:this.good_table[index].fUnit,
           remarks:this.good_table[index].fRemark
         }
      },
        /* 分页操作*/
      handleSizeChange(val) {
        this.searchParam.pageSize = val;
        this.goodlist()
      },
      handleCurrentChange(val) {
        this.searchParam.currentPage = val;
        this.goodlist()
      },
      /*查询所有货物类型*/
      async goodtype() {
          const res = await GoodService.goodtype({});
          if (res.success) {
             this.goodcates=res.obj
             this.goodcatetable=res.obj
          } else {
            this.$message.warning(res.msg);
          }
      },
      /*查询所有货物表格*/
        /**
         * @modified  2019-10-08 元实 加上了搜索条件
         */
      async goodlist() {
          const res = await GoodService.goodlist({
              "pageCurrent":this.searchParam.currentPage,
              "pageSize":this.searchParam.pageSize,
              fGoodsName: this.formInline.name,
              fTypeId: this.formInline.cate
          });
          if (res.success) {
             this.good_table=res.obj.items
             this.searchParam.sum=res.obj.itemTotal
          } else {
            this.$message.warning(res.msg);
          }
      },
      /*新加货物类型*/
      async addgoodtype() {
          const res = await GoodService.addgoodtype({
               fTypeName:this.craetgood.name,
               "fIsDelete": false,
          });
          if (res.success) {
             this.$message({
                message:"新建成功",
                type: 'success'
              });
              this.catebadge=false;
              this.point=false;
              this.goodtype();
          } else {
            this.$message.warning(res.msg);
          }
      },
      /*修改货物类型*/
      async ediotype() {
          const res = await GoodService.ediotype({
               fId:this.cateid,
               fTypeName:this.craetgood.name,
               "fIsDelete": false,
          });
          if (res.success) {
             this.$message({
                message:"编辑成功",
                type: 'success'
              });
              this.catebadge=false;
              this.point=false;
              this.goodtype();
              this.seegoodcste=true
          } else {
            this.$message.warning(res.msg);
          }
      },
      /*删除货物类型*/
       async delettype(fid) {
          const res = await GoodService.delettype(fid);
          if (res.success) {
             this.$message({
                message:"删除成功",
                type: 'success'
              });
              this.goodtype();
          } else {
            this.$message.warning(res.msg);
          }
      },
      //新加货物
       async addgoods() {
          const res = await GoodService.addgoods({
              "fGoodsName": this.pointgood.name,
              "fIsDelete": false,
              "fMaxSize": this.pointgood.maxsize,
              "fMinSize": this.pointgood.minsize,
              "fRemark": this.pointgood.remarks,
              "fTypeId": this.pointgood.cate,
              "fUnit": this.pointgood.unit
          });
          if (res.success) {
             this.$message({
                message:"新建成功",
                type: 'success'
              });
               this.pointgoodshow=false;
              this.goodlist()
          } else {
            this.$message.warning(res.msg);
          }
      },
      //删除货物
       async deletgood(fid) {
          const res = await GoodService.deletgood(fid);
          if (res.success) {
             this.$message({
                message:"删除成功",
                type: 'success'
              });
              this.goodlist();
          } else {
            this.$message.warning(res.msg);
          }
      },
      //编辑货物
      async ediogood() {
          const res = await GoodService.ediogood({
             "fId":this.goodid,
             "fGoodsName": this.pointgood.name,
             "fIsDelete": false,
             "fMaxSize": this.pointgood.maxsize,
             "fMinSize": this.pointgood.minsize,
             "fRemark": this.pointgood.remarks,
             "fTypeId": this.pointgood.cate,
             "fUnit": this.pointgood.unit
          });
          if (res.success) {
              this.$message({
                 message:"编辑成功",
                 type: 'success'
               });
                this.pointgoodshow=false;
               this.goodlist()
          } else {
            this.$message.warning(res.msg);
          }
      },
      numberyz(){
          if(this.pointgood.minsize>this.pointgood.maxsize){
               this.$message.error('最小粒径应小于最大粒径');
               this.pointgood.minsize=''
          }
          // if(this.pointgood.minsize<this.pointgood.maxsize){
          //      this.$message.error('最大粒径应大于最小粒径');
          //      this.pointgood.maxsize=''
          // }
      },

    /**
     * 显示级别类型弹框
     * @author 元实
     */
      async configureTypes() {
          this.isConfigureDialogShown = true;
          this.getDepartmentTypes();

        　this.setInitialConfiguration();

          let configuration = await GoodService.getConfiguration();

          if (configuration.success) {
              this.configurationForm = configuration.obj;
              this.isEditConfigurationMode = true;
          } else {
              this.isEditConfigurationMode = false;
          }
      },

        /**
         * 初始化配置数据
         * @author 元实
         */
        setInitialConfiguration() {
          this.configurationForm = [ //类型级别配置
              {
                  fType: 1,  //类型
                  fLevel: '', //部门级别
                  fRemark: '' //备注
              },

              {
                  fType: 2,  //类型
                  fLevel: '', //部门级别
                  fRemark: '' //备注
              },

              {
                  fType: 3,  //类型
                  fLevel: '', //部门级别
                  fRemark: '' //备注
              }
          ];
        },

      /**
       * 获取部门类型
       * @author 元实
       */
      async getDepartmentTypes() {
          let result = await GoodService.getDepartmentTypes();

          if (result.success) {
              this.departmentTypes = result.obj;
          } else {
              this.$message.error(result.msg);
          }
      },

      /**
       * 关闭弹框
       * @author 元实
       */
      closeDialog() {
          this.isConfigureDialogShown = false;
      },

        /**
         * 处理部门类型下拉框的blur事件
         * @author 元实
         */
        handleSelectBlur(event) {
            console.log(event);
          this.validateDepartTypeSelect(event.target.value, event.target);
        },

        /**
         * 验证部门类型输入
         * @author 元实
         */
        validateDepartTypeSelect(value, select) {
            if (value) {
                console.log(select.style.borderColor);
                select.style.borderColor = '';
                return true;
            } else {
                select.style.borderColor = '#F56C6C';
                return false;
            }
        },

        /**
         * 处理部门类型下拉框的change事件
         * @author 元实
         */
        handleSelectChange(value, refName) {
            this.validateDepartTypeSelect(value, this.$refs[refName].$el.querySelector('input'));
        },

      /**
       * 提交级别类型配置数据
       * @author 元实
       */
      async submitConfigureData() {
        let depType1Input = this.$refs.depTypeSelect0.$el.querySelector('input');
        let value1 = depType1Input.value;
        let depType2Input = this.$refs.depTypeSelect1.$el.querySelector('input');
        let value2 = depType2Input.value;
        let depType3Input = this.$refs.depTypeSelect2.$el.querySelector('input');
        let value3 = depType3Input.value;

        let isValid1 = this.validateDepartTypeSelect(value1, depType1Input);
        let isValid2 = this.validateDepartTypeSelect(value2, depType2Input);
        let isValid3 = this.validateDepartTypeSelect(value3, depType3Input);

        if (isValid1 && isValid2 && isValid3) {
            let result = await GoodService.insertConfigurationData(this.configurationForm);

            if (result.success) {
                this.closeDialog();
            } else {
                this.$message.error(result.msg);
            }
        } else {
            this.$message.error('请选择部门级别');
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .goods-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
      .container {
        padding:15px 10px;
      }
    }
     .rule_pagination {
      margin-top: 1.25rem;
      text-align: right;
    }

    .formButtons {
        margin-top: 20px;
    }

    .margin-bottom-20 {
        margin-bottom: 20px;
    }

    .margin-top-20 {
        margin-top: 20px;
    }

    .margin-top-15 {
        margin-top: 15px;
    }

    .el-form-item {
        margin-bottom: 0;
    }
</style>
