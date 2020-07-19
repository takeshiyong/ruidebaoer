/*
* @Author: 杨高杰
* @Date:   2019-09-05
* @Description: '安全目标'
*/
<template>
    <div class="patrol-page">
        <div class="container">
             <div>
                  <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                      <el-form-item label="关键词">
                          <el-input placeholder="请输入查询内容" clearable size="small" class="input-father" v-model="fName"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="finditem"><i class="el-icon-search"></i>搜索</el-button>
                          <el-button type="primary" @click="makegoals"><i class="el-icon-plus"></i>新建</el-button>
                      </el-form-item>
                  </el-form>
             </div>
             <div class="tab">
                  <el-table :data="goalstable" stripe class="defaultTab" highlight-current-row>
                        <el-table-column type="index" label="序号" width="60"></el-table-column>
                        <el-table-column prop="fName" label="安全目标名称" min-width="80" :show-overflow-tooltip="true">

                        </el-table-column>
                        <el-table-column prop="fCount" label="安全目标内容" min-width="80" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column prop="fSignedTime" label="目标签订年份" min-width="80" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                               <span>{{scope.row.fSignedTime.substring(0,10)}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fOwners" label="甲方人员" min-width="80" :show-overflow-tooltip="true">
                             <template slot-scope="scope">
                                <span v-for="(val,index) in scope.row.fOwners" :key="index">{{val.fUserName}}&nbsp;&nbsp;</span>
                             </template>
                        </el-table-column>
                        <el-table-column prop="fCommPrice" label="乙方人员" min-width="80" :show-overflow-tooltip="true">
                             <template slot-scope="scope">
                                <span v-for="(val,index) in scope.row.fSeconds" :key="index">{{val.fUserName}}&nbsp;&nbsp;</span>
                             </template>
                        </el-table-column>
                        <el-table-column prop="fCreateUserName" label="创建人" min-width="80" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button type="text" @click="feil(scope.row.fId)">&nbsp;附件</el-button>
                                <el-button type="text" @click="ediogood(scope.row.fId,scope.$index)">&nbsp;编辑</el-button>
                                <el-button type="text" @click="deletgoodsp(scope.row.fId)">&nbsp;删除</el-button>
                            </template>
                        </el-table-column>
                  </el-table>
                  <div class="rule_pagination">
                      <el-pagination
                          id="page"
                          :current-page="searchParam.currentPage"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="searchParam.sum"
                          :page-size="searchParam.pageSize"
                          :page-sizes="searchParam.pageSizes"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                      ></el-pagination>
                  </div>
             </div>
             <!-- 弹层 -->
             <!-- 1.侧滑弹层 -->
             <TheDialog :modal='divisionModal' :modalTitle="modalTitle" @closeModal="divisionModal=false">
                 <div slot="custom-modal-content">
                       <el-form :model="goalsForm" :rules="rules" ref="goalsForm" label-width="120px" class="demo-ruleForm">
                             <el-form-item label="安全目标名称" prop="name">
                                 <el-input v-model="goalsForm.name" placeholder="请填写安全目标名称" type="text" maxlength="20" style="width: 50%;"></el-input>
                             </el-form-item>
                             <el-form-item label="目标签订时间" prop="year">
                                  <el-date-picker
                                        style="width: 50%;"
                                        v-model="goalsForm.year"
                                        type="date"
                                        placeholder="选择日期">
                                  </el-date-picker>
                             </el-form-item>
                             <el-form-item label="甲方人员" prop="peopleone">
                                  <el-select
                                     v-model="goalsForm.peopleone"
                                     multiple
                                     collapse-tags
                                     style="width: 50%;"
                                     placeholder="请选择甲方人员">
                                     <el-option
                                       v-for="item in options"
                                       :key="item.value"
                                       :label="item.fUserName"
                                       :value="item.fId">
                                     </el-option>
                                   </el-select>
                             </el-form-item>
                             <el-form-item label="乙方人员" prop="peopletwo">
                                  <el-select
                                     v-model="goalsForm.peopletwo"
                                     multiple
                                     collapse-tags
                                     style="width: 50%;"
                                     placeholder="请选择乙方人员">
                                     <el-option
                                       v-for="item in options"
                                       :key="item.value"
                                       :label="item.fUserName"
                                       :value="item.fId">
                                     </el-option>
                                   </el-select>
                             </el-form-item>
                             <el-form-item label="上传附件" prop="wjlist">
                                 <el-upload
                                     class="upload-demo"
                                     drag
                                     accept="image/jpeg, image/gif, image/png, .doc, .docx, .xls, xlsx, .pdf, .ppt"
                                     :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                                     multiple
                                     ref="upload"
                                     :on-preview="handlePreview"
                                     :on-remove="handleRemove"
                                     :before-remove="beforeRemove"
                                     :limit="3"
                                     :on-exceed="handleExceed"
                                     :before-upload="handbu"
                                     :file-list="fileList"
                                     :on-success="handleSuccess"
                                     :show-upload-list="true"
                                     :on-error="handleErr"
                                     :on-change="feilchange"
                                 >
                                     <i class="el-icon-upload"></i>
                                     <div class="el-upload__text">
                                         将文件拖到此处，或
                                         <em>点击上传</em>
                                     </div>
                                 </el-upload>
                             </el-form-item>
                             <el-form-item label="安全目标内容" prop="detail">
                                 <el-input style="width: 90%;" type="textarea" v-model="goalsForm.detail"></el-input>
                             </el-form-item>
                             <el-form-item>
                               <el-button type="primary" @click="submitForm('goalsForm')">确定</el-button>
                               <el-button @click="resetForm('goalsForm')">重置</el-button>
                             </el-form-item>
                       </el-form>
                       <el-row type="flex" class="row-bg" justify="center">
                         <el-col :span="20">
                              <div class="grid-content bg-purple note">
                                  <div class="title">{{goalsForm.name}}</div>
                                  <div class="content">{{goalsForm.detail}}</div>
                                  <div class="people">
                                    <div class="first" style=" border-bottom:.5px dashed #D9D9D9;">
                                       <div class="nameone">甲方：</div>
                                       <div class="onename">
                                          <el-tag v-for="(val,index) of clist" :key="index" >{{val.fUserName}}</el-tag>
                                       </div>
                                    </div>
                                    <div class="first" style="margin-top: 8px;">
                                       <div class="nameone">乙方：</div>
                                       <div class="onename">
                                           <el-tag v-for="(val,index) of dlist" :key="index" >{{val.fUserName}}</el-tag>
                                       </div>
                                    </div>
                                  </div>
                              </div>
                         </el-col>
                       </el-row>
                 </div>
             </TheDialog>
             <!-- 附件 -->
             <el-dialog title="目标附件" :visible.sync="outerVisible">
                 <el-table
                     :data="filenote"
                     border
                     style="width: 100%;font-size:12px;color:#666;"
                     class="defaultTab"
                 >
                     <el-table-column label="序号" width="64" type="index"></el-table-column>
                     <el-table-column
                         label="文件名称"
                         min-width="100"
                         prop="fFileName"
                         :show-overflow-tooltip="true"
                     >
                         <template slot-scope="scope">
                             <a
                                 style="color: blue;cursor: pointer"
                                 @click="openFile(scope.row.fFileLocationUrl)"
                             >{{scope.row.fFileName}}
                             </a>
                         </template>
                     </el-table-column>
                     <!-- <el-table-column label="操作" width="200">
                         <template slot-scope="scope">
                             <el-button
                                 type="primary"
                                 style="margin-right:4px;border-radius:0px;padding:5px 10px;background-color:#E5E5E5;border:0px;color:#333333;"
                                 class="fa fa-trash-o"
                                 size="small"
                                 @click="deleteFile(scope.row.fId)"
                             >&nbsp;删除</el-button>
                         </template>
                     </el-table-column> -->
                 </el-table>
             </el-dialog>
        </div>
    </div>
</template>
<script>
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { basicService } from '@/api/basic-safey' // api
    import { common } from "@/utils/common"; // common
    export default {
        data() {
            return {
                fName:"", // 名称
                searchParam: {
                    //分页相关
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                goalstable:[],//表格数据
                year:[{
                  lable:new Date().getFullYear()-5,
                  value:new Date().getFullYear()-5,
                },
                {
                  lable:new Date().getFullYear()-4,
                  value:new Date().getFullYear()-4,
                },
                {
                  lable:new Date().getFullYear()-3,
                  value:new Date().getFullYear()-3,
                },
                {
                  lable:new Date().getFullYear()-2,
                  value:new Date().getFullYear()-2,
                },
                {
                  lable:new Date().getFullYear()-1,
                  value:new Date().getFullYear()-1,
                },
                {
                  lable:new Date().getFullYear(),
                  value:new Date().getFullYear(),
                },
                {
                  lable:new Date().getFullYear()+1,
                  value:new Date().getFullYear()+1,
                },
                {
                  lable:new Date().getFullYear()+2,
                  value:new Date().getFullYear()+2,
                },
                {
                  lable:new Date().getFullYear()+3,
                  value:new Date().getFullYear()+3,
                },
                {
                  lable:new Date().getFullYear()+4,
                  value:new Date().getFullYear()+4,
                },
                {
                  lable:new Date().getFullYear()+5,
                  value:new Date().getFullYear()+5,
                }],
                divisionModal:false,//弹窗
                modalTitle:'',//弹窗标题
                outerVisible:false,//附件显隐
                fileList: [],
                filenote:[],//文件列表
                goalsid:'',//安全目标id
                previewUrl: process.env.PREVIEW_API, //预览附件
                goalsForm:{
                  name:'',
                  detail:'',
                  peopleone:[],
                  peopletwo:[],
                  wjlist:[],
                  year:''
                },
                 options: [],
                 aoptions: [],
                 rules: {
                      name: [
                          {
                              required: true,
                              message: "请填写安全目标内容",
                              trigger: "blur"
                          }
                      ],
                      detail: [
                          {
                              required: true,
                              message: "请填写安全目标内容",
                              trigger: "blur"
                          }
                      ],
                      wjlist:[{required: true, message: '文件不能为空',trigger: 'blur'}],
                      year:[
                        {
                            required: true,
                            message: "请选择安全目标年份",
                            trigger: "change"
                        }
                      ],
                      peopleone:[
                        {
                            required: true,
                            message: "请选择甲方人员",
                            trigger: "change"
                        }
                      ],
                      peopletwo:[
                        {
                            required: true,
                            message: "请选择乙方人员",
                            trigger: "change"
                        }
                      ],

                 }

            }
        },
        components: {
            TheDialog,
        },
        computed:{
          //监听对一维数组和多维数组进行模糊匹配，实现双向绑定
          clist:function(){
              let c='';
              c=this.options
              c=c.filter(item=>this.goalsForm.peopleone.some(subItem=>subItem==item.fId))
              return c;
          },
          dlist:function(){
              let d='';
              d=this.aoptions
              d=d.filter(item=>this.goalsForm.peopletwo.some(subItem=>subItem==item.fId))
              return d;
          }
        },
        mounted() {
            this.golasAll()
            this.getAllUser()
        },
        methods:{
            //搜索
            finditem(){
               this.golasAll()
            },
            /**
             * 新建安全目标按钮
             */
            makegoals(){
               this.modalTitle="新建安全目标"
               this.fileList=[]
               this.goalsForm={
                 name:'',
                 detail:'',
                 peopleone:[],
                 peopletwo:[],
                 wjlist:[]
               }
               this.divisionModal=true
            },
            //打开文件
            openFile(fileurl) {
                    window.open(
                        this.previewUrl + fileurl,
                        "",
                        "width=1000,height=880,top=80,left=450,toolbar=no, menubar=no, scrollbars=no, resizable=no"
                    );
            },
            /* 删除目标*/
            deletgoodsp(id){
                this.$confirm("是否删除该条安全目标?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                     this.deletgolas(id)
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            /*查询安全目标信息*/
            feil(id){
              this.findgolas(id)
            },
            //编辑
            ediogood(id){
                this.modalTitle="编辑安全目标"
                this.findgola(id)
                this.goalsid=id
            },
            /* 分页操作*/
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.golasAll()
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.golasAll()
            },
            //文件上传
            handleRemove(file, fileList) {
                //上传文件失败操作
                // let fileLists = this.fileList.map(data => data.uid);
                // this.fileList.splice(fileLists.indexOf(file.uid), 1);
            },
            handlePreview(file) {},
            handleExceed(files, fileList) {
                this.$message.warning(
                    `当前限制选择 3 个文件，本次选择了 ${
                        files.length
                    } 个文件，共选择了 ${files.length + fileList.length} 个文件`
                );
            },
            feilchange(file, fileList) {

            },
            handleErr(err, file, fileList) {},
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handbu(file) {
                if (file.size > 10 * 1024 * 1024) {
                    this.$message.warning("文件超过10M！");
                    return false;
                }
            },
            handleSuccess(res, file, fileList) {
                if (res.data != null) {
                    this.goalsForm.wjlist.push(res.data)
                    console.log(this.goalsForm.wjlist)
                    this.goalsForm.wjlist = this.goalsForm.wjlist.map((data)=>{
                      return {
                        ...data,
                        fType:"3",
                        fCoursewareTitle:data.fFileTitle
                      }
                    });
                    console.log(this.goalsForm.wjlist)
                } else {
                    this.handleRemove(file);
                    this.$message.warning("上传失败");
                }
            },
            //新建和编辑
            submitForm(formName) {
                    this.$refs[formName].validate((valid) => {
                      if (valid) {
                          if(this.modalTitle=="新建安全目标"){
                            this.addgolas()
                          }else{
                            this.updategolas()
                          }
                      } else {
                        console.log('error submit!!');
                        return false;
                      }
                    });
                  },
            resetForm(formName) {
              this.$refs[formName].resetFields();
            },
            /**
             * 获取安全目标table
             * @return {Array}   分页查询的结果
             */
            async golasAll(){
                let res = await basicService.golasAll({
                   "currentPage":this.searchParam.currentPage,
                   "pageSize":this.searchParam.pageSize,
                   "fCount":this.fName
                });
                if (res.success) {
                    this.goalstable=res.obj.items;
                    this.searchParam.sum = res.obj.itemTotal;
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 获取全部人员
             * @return {Array}
             */
            async getAllUser(){
                let res = await basicService.getAllUser();
                if (res.success) {
                    this.options=res.obj
                    this.aoptions=res.obj
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 新建安全目标
             * @return {Array}
             */
            async addgolas(){
                if (this.goalsForm.year != '') {
                    this.goalsForm.year = common.YMDHMSParseTime(this.goalsForm.year);
                }
                let res = await basicService.addgolas({
                     fCount:this.goalsForm.detail,
                     fName:this.goalsForm.name,
                     fOwners:this.goalsForm.peopleone,
                     fSeconds:this.goalsForm.peopletwo,
                     files:this.goalsForm.wjlist,
                     fSignedTime:this.goalsForm.year
                });
                if (res.success) {
                    this.$message.success(res.msg);
                    this.divisionModal=false;
                    this.golasAll()
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改安全目标
             * @return {Array}
             */
            async updategolas(){
                if (this.goalsForm.year != '') {
                    this.goalsForm.year = common.YMDHMSParseTime(this.goalsForm.year);
                }
                console.log(this.goalsForm.wjlist)
                let res = await basicService.updategolas({
                     fId:this.goalsid,
                     fCount:this.goalsForm.detail,
                     fName:this.goalsForm.name,
                     fOwners:this.goalsForm.peopleone,
                     fSeconds:this.goalsForm.peopletwo,
                     files:this.goalsForm.wjlist,
                     fSignedTime:this.goalsForm.year
                });
                if (res.success) {
                    this.$message.success(res.msg);
                    this.divisionModal=false;
                    this.golasAll()
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 删除安全目标
             * @return {Array}
             */
            async deletgolas(id){
                let res = await basicService.deletgolas(id);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.golasAll()
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 查询安全目标信息
             * @return {Array}
             */
            async findgolas(id){
                let res = await basicService.findgolas(id);
                if (res.success) {
                     this.filenote=res.obj.tFiles
                     this.outerVisible=true
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 查询安全目标信息
             * @return {Array}
             */
            async findgola(id){
                let res = await basicService.findgolas(id);
                if (res.success) {
                     let a=[];
                     for (let i=0;i<res.obj.fOwners.length;i++) {
                          a.push(res.obj.fOwners[i].fUserId)
                     }
                     let b=[];
                     for (let i=0;i<res.obj.fSeconds.length;i++) {
                          b.push(res.obj.fSeconds[i].fUserId)
                     }
                     this.fileList=res.obj.tFiles.map((data)=>{
                        return {
                           name:data.fFileName
                         }
                     })
                     console.log(res.obj.tFiles)
                     console.log(this.fileList)
                     this.goalsForm={
                       name:res.obj.fName,
                       detail:res.obj.fName,
                       year:res.obj.fSignedTime,
                       peopleone:a,
                       peopletwo:b,
                       wjlist:res.obj.tFiles
                     }
                      this.divisionModal=true

                } else{
                    this.$message.warning(res.msg);
                };
            },
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .patrol-page {
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
    .note{
      padding: 20px;
      border: .5px solid #D9D9D9;
      .title{
        width: 90%;
        margin-left: 5%;
        text-align: center;
        font-size: 20px;
        font-weight: 800;
        margin-bottom: 0.9375rem;
      }
      .content{
        text-indent:2em;
        font-size: 14px;
        letter-spacing:2px;
        line-height: 26px;
      }
      .people{
        margin-top: 15px;
        margin-bottom:1.25rem;
        .first{
          width: 100%;
          height: 100px;
          overflow-y: auto;
          .nameone{
            font-weight: 800;
          }
          .onename{
              padding-left: 2.5rem;
              margin-top: 0.5rem;
          }
        }
      }
    }
    /deep/ .el-tag + .el-tag{
      margin-left:0.75rem;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .patrol-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 220px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }

</style>
