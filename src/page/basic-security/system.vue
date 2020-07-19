 /*
  * @Author: 杨高杰
  * @Date:   2019-09-06
  * @Description: '安全规章制度管理'
  */
 <template>
     <div class="equipment-type-page">
         <div class="container">
             <el-row>
                 <el-col :lg="6" :md="8" :sm="10" :xs="24">
                     <div class="left-sidebar">
                         <div class="header">
                             <span>制度类型</span>
                             <el-tooltip effect="dark" content="新建" placement="top">
                                 <el-button  type="text" icon="el-icon-plus" @click="insertGenera" class="opear-btn insert-btn"></el-button>
                             </el-tooltip>
                         </div>
                         <div class="line"></div>
                         <div class="main">
                             <div v-if="generas.length > 0">
                                 <div v-for="(item, index) in generas" :key="index" class="genera-div" @click="fcates(item)">
                                     <div class="genera-info">
                                         <div class="genera-name">{{item.fTypeName}}</div>
                                         <el-button type="text" icon="el-icon-edit" class="update-btn" @click="updateGenera(item)"></el-button>
                                         <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="deleteGenera(item)"></el-button>
                                     </div>
                                 </div>
                             </div>
                             <div class="no-data-div" v-else>
                                 暂无数据
                             </div>
                         </div>
                     </div>
                 </el-col>
                 <el-col :lg="18" :md="16" :sm="14" :xs="24">
                     <div class="right-list">
                         <div class="header">
                             <span>{{typeTitle}}</span>
                         </div>
                         <div class="line"></div>
                         <div class="main">
                             <div class="search">
                                 <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                     <el-form-item label="关键词">
                                         <el-input placeholder="请输入制度信息" clearable size="small" class="input-father" v-model="fName"></el-input>
                                     </el-form-item>
                                     <el-form-item>
                                         <el-button type="primary" @click="findsystem"><i class="el-icon-search"></i>搜索</el-button>
                                         <el-button type="primary" @click="makegood" ><i class="el-icon-plus" ></i>新建</el-button>
                                         <el-button type="primary" @click="deletsystem" ><i class="el-icon-delete" ></i>删除</el-button>
                                     </el-form-item>
                                 </el-form>
                             </div>
                             <div class="tab">
                                 <el-table ref="multipleTable" :data="systemtable" stripe class="defaultTab" @selection-change="handleSelectionChange" highlight-current-row>
                                       <el-table-column
                                             type="selection"
                                             width="55">
                                       </el-table-column>
                                       <el-table-column type="index" label="序号" width="60"></el-table-column>
                                       <el-table-column prop="fFileName" label="安全制度名称" min-width="60" :show-overflow-tooltip="true">
                                           <template slot-scope="scope">
                                               <a style="color: #409EFF;cursor: pointer" @click="openFile(scope.row.fFileLocationUrl)">{{scope.row.fFileName}}
                                               </a>
                                           </template>
                                       </el-table-column>
                                       <el-table-column prop="fTypeName" label="安全制度类别" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column prop="fCreateUserName" label="制定人" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column label="操作" width="200">
                                           <template slot-scope="scope">
                                               <el-button type="text" @click="ediogood(scope.row.fId,scope.$index)">&nbsp;编辑</el-button>
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
                         </div>
                     </div>
                 </el-col>
             </el-row>
         </div>
         <!-- 弹层 -->
         <!-- 1.侧滑弹层 -->
         <TheDialog :modal='generaModal' :modalTitle="modalTitle1" @closeModal="closeModal('generaForm',generaModal)">
             <div slot="custom-modal-content">
                 <el-form  :model="generaForm" :rules="generaFormRules" ref="generaForm" label-width="80px">
                     <el-row>
                         <el-col :span="12">
                             <el-form-item label="制度类型" prop="fName">
                                 <el-input v-model="generaForm.fName" size="small" placeholder="请填写制度类型名称"></el-input>
                             </el-form-item>
                         </el-col>
                     </el-row>
                     <el-form-item>
                         <el-button type="primary" @click="submitGeneraForm('generaForm')" size="small">确定</el-button>
                         <el-button @click="resetForm('generaForm')" size="small">重置</el-button>
                     </el-form-item>
                 </el-form>
             </div>
         </TheDialog>
         <TheDialog :modal='attributeModal' :modalTitle="modalTitle" @closeModal="closeModal('goodsform',attributeModal)">
             <div slot="custom-modal-content">
                  <el-form  :model="goodsform" :rules="goodsformRules" ref="goodsform" label-width="80px">
                      <el-form-item label="制度类型" prop="type">
                            <el-select v-model="goodsform.type" class="input-father" clearable placeholder="请选择制度类型">
                                <el-option
                                  v-for="item in stagelist"
                                  :key="item.fId"
                                  :label="item.fTypeName"
                                  :value="item.fId">
                                </el-option>
                            </el-select>
                      </el-form-item>
                      <el-form-item label="制度文件" prop="wjlist">
                          <el-upload
                              class="upload-demo"
                              drag
                              accept=".doc, .docx, .xls, xlsx, .pdf, .ppt"
                              :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                              multiple
                              ref="upload"
                              :on-preview="handlePreview"
                              :on-remove="handleRemove"
                              :before-remove="beforeRemove"
                              :limit="1"
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
                      <el-form-item>
                          <el-button type="primary" @click="submitForm('goodsform')" size="small">确定</el-button>
                          <el-button @click="resetesForm('goodsform')" size="small">重置</el-button>
                      </el-form-item>
                  </el-form>
             </div>
         </TheDialog>
     </div>
 </template>

 <script>
     import { ruleService } from '@/api/basic-safey' // api
     import TheDialog from "@/components/TheDialog" // 侧滑组件
     export default {
         data() {
             return {
                 generas: [], // 制度大类集合
                 fName: '', // 名称
                 fcate:'',//类型
                 searchParam: {
                     //分页相关
                     currentPage: 1,
                     sum: 0,
                     pageSizes: [10, 20, 30, 40],
                     pageSize: 10
                 },
                 systemtable:[],//表格数据
                 divisionModal:false,//表单显示隐藏
                 modalTitle:'',//标题
                 imageUrl:'',//上传后的图片预览
                 goodsform:{//新建制度表格数据
                     wjlist:"",
                     type:'',
                     name:'',
                     feilname:'',
                 },
                 multipleSelection: [],//多选的数组
                 stagelist:[],//制度类型
                 generascate:'',//制度
                 fileList: [],//文件集合
                 // 侧滑弹层
                 modalTitle1: '', // 弹层标题
                 generaModal: false, // 弹层Modal
                 generaForm: {
                   fName:'',
                 }, // 弹层表单
                 generaInfor: { // 初始化空表单
                     fId:'', //id
                     fIsDelete: false, // 是否可删除
                     fName:'', // 设备大类
                 },
                 generaFormState: true,
                 generaFormRules: { // 表单校验
                     fName: [
                         {required: true, message: '请填写制度类型', trigger: 'blur'},
                     ]
                 },
                 goodsformRules: { // 表单校验
                     type:[{required: true,message: "请选择制度类型",trigger: "change"}],
                     wjlist:[{required: true, message: '文件不能为空',trigger: 'blur'}],
                 },
                 typeTitle: '全部制度', // 右侧标题
                 types: [], // 设备类型集合

                 // 侧滑弹层
                 modalTitle2: '', // 弹层标题
                 typeModal: false, // 弹层Modal
                 typeForm: {}, // 弹层表单
                 typeInfor: { // 初始化空表单
                     fId:'', //id
                     fIsDelete: false, // 是否可删除
                     fEquipmentTypeId:'', // 设备大类id
                     fTypeName: '', // 设备类型
                 },
                 typeFormState: true,
                 previewUrl: process.env.PREVIEW_API, //预览附件

                 // 侧滑弹层
                 modalTitle3: '', // 弹层标题
                 attributeModal: false, // 弹层Modal
                 cateid:"",//制度类型id
                 attributeForm: {}, // 弹层表单
                 goodid:'',//制度id
                 attributeInfor: { // 初始化空表单
                     fId:'', //id
                     fIsDelete: false, // 是否可删除
                     fEquipmentTypeInfoId:'', // 所属类型id
                     fAttributeName: '', // 设备类型
                     fUnit: '' // 单位
                 },
                 //新建商品的表单校验
                 rules: {
                    cate:[{required: true,message: "请选择商品类型",trigger: "change"}],
                    name:[{ required: true, message: '名称不能为空'}],
                    detail:[{ required: true, message: '商品简介不能为空'}],
                    num:[{ required: true, message: '商品库存不能为空'}]
                 },


             }
         },
         components: {
             TheDialog,
         },
         mounted: function(){
             this.init();
         },
         methods: {
             /**
              * 页面初始化
              */
             init(){
                 // 获取商品类型
                 this.ruleall();
                 //获取表格数据
                 this.systemall()
             },
             makegood(){
                this.attributeModal=true
                this.modalTitle="新建制度"
                this.goodsform={//新建制度
                    wjlist:"",
                    type:'',
                    name:'',
                    feilname:'',
                 };
             },
             //搜索
             findsystem(){
                 this.generascate='';
                 this.systemall()
             },
             //点击查询
             fcates(item){
                this.generascate=item.fId;
                this.systemall()
             },
             //点击删除
             deletsystem(){
               if(this.multipleSelection==''){
                   this.$message.warning('请选择制度');
               }else{
                   this.$confirm('您将删除该制度, 是否继续?', '提示', {
                           confirmButtonText: '确定',
                           cancelButtonText: '取消',
                           type: 'warning'
                         }).then(() => {
                            this.systemdelet()
                         }).catch(() => {
                           this.$message({
                             type: 'info',
                             message: '已取消删除'
                           });
                         });
               }
             },
             //多选
              handleSelectionChange(val) {
                 for (let i in val) {
                     this.multipleSelection.push(val[i].fId)
                 }
                 console.log(this.multipleSelection)
              },
             /* 分页操作*/
             handleSizeChange(val) {
                 this.searchParam.pageSize = val;
                 this.systemall()
             },
             handleCurrentChange(val) {
                 this.searchParam.currentPage = val;
                 this.systemall()
             },
             /**
              * 获取制度类型
              * @return {Array}   查询的结果
              */
             async ruleall(){
                 let res = await ruleService.ruleall();
                 if (res.success) {
                     if (res.obj != null && res.obj != undefined && res.obj.length > 0){
                         this.generas = res.obj;
                         this.stagelist=res.obj;
                     } else {
                         this.generas = [];
                     }
                 } else {
                     this.$message.warning(res.msg);
                     this.generas = [];
                 }
             },
             /**
              * 新增按钮(类型)
              */
             insertGenera(){
                 // 初始化弹层
                 this.modalTitle1 = '新建制度类型';
                 this.generaModal = true;
                 // 清空表单
                 this.generaForm.fName='';
             },
             /**
              * 编辑按钮
              */
             updateGenera(row){
                 this.cateid=row.fId;
                 this.generaForm.fName=row.fTypeName;
                 this.modalTitle1 = '编辑制度类型';
                 this.generaModal = true;
             },
             //打开文件
             openFile(fileurl) {
                     window.open(
                         this.previewUrl + fileurl,
                         "",
                         "width=1000,height=880,top=80,left=450,toolbar=no, menubar=no, scrollbars=no, resizable=no"
                     );
             },
             /**
              * 删除按钮
              */
             deleteGenera(row){
                 if (row.fId == '' || row.fId == null || row.fId == undefined) {
                     return;
                 };
                 this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     type: 'warning',
                     cancelButtonText: '取消',
                 }).then(async () => {
                     let res = await ruleService.ruledelet(row.fId);
                         if (res.success) {
                             this.$message.success(res.msg);
                             this.init();
                         } else{
                             this.$message.warning(res.msg);
                         };
                 }).catch(() => {

                 });
             },
             /**
              * 提交表单
              * @param formName {object} 表单名称
              */
             submitGeneraForm(formName){
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         if (this.modalTitle1 == '新建制度类型') {
                             this.ruleinsert();
                         }
                         if (this.modalTitle1 == '编辑制度类型') {
                             this.ruleupdate();
                         }
                     } else {
                         this.$message.warning('必填项输入为空或错误！');
                         return false;
                     }
                 })
             },
             //新建制度
             submitForm(formName){
                 this.$refs[formName].validate((valid) => {
                     if (valid) {
                         if(this.modalTitle=="新建制度"){
                             this.systemadd()
                         }else{
                             this.systemedio()
                         }
                     } else {
                         this.$message.warning('必填项输入为空或错误！');
                         return false;
                     }
                 })
             },
             /**
              * 重置表单
              * @param formName {object} 表单名称
              */
             resetesForm(formName){
                this.goodsform={//新建制度
                  wjlist:"",
                  type:'',
                  name:'',
                  feilname:'',
               };
               this.fileList=[]
             },
             /**
              * 重置表单
              * @param formName {object} 表单名称
              */
             resetForm(formName){
                 this.$refs[formName].resetFields();
             },
             /**
              * 新增制度类型
              */
             async ruleinsert(){
                 let res = await ruleService.ruleinsert({
                     fTypeName:this.generaForm.fName
                 });
                 if (res.success) {
                          this.closeModal('generaForm',this.generaModal);
                          this.$message.success(res.msg);
                          this.init();
                 } else {
                     this.$message.warning(res.msg);
                     this.generas = [];
                 }
             },
             /**
              * 修改制度类型
              */
             async ruleupdate(){
                 let res = await ruleService.ruleupdate({
                      fTypeName:this.generaForm.fName,
                      fId:this.cateid
                 });
                 if (res.success) {
                          this.$message.success(res.msg);
                          this.closeModal('generaForm',this.generaModal);
                          this.init();
                 } else {
                     this.$message.warning(res.msg);
                     this.generas = [];
                 }
             },
             /**
              * 获取全部制度
              */
             async systemall(){
                 let res = await ruleService.systemall({
                    "currentPage":this.searchParam.currentPage,
                    "pageSize":this.searchParam.pageSize,
                    fSearchCount:this.fName,
                    fType:this.generascate
                 });
                 if (res.success) {
                      this.systemtable=res.obj.items;
                      this.searchParam.sum = res.obj.itemTotal;
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 新建安全制度
              */
             async systemadd(){
                 let res = await ruleService.systemadd({
                    fFileLocationUrl:this.goodsform.wjlist,
                    fFileName:this.goodsform.name,
                    fSecuritySystemType:this.goodsform.type,
                    fCoursewareTitle:this.goodsform.feilname,
                    fType:3,
                 });
                 if (res.success) {
                      this.$message.success(res.msg);
                      this.closeModal('goodsform',this.attributeModal);
                      this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 编辑安全制度
              */
             async systemedio(){
                 let res = await ruleService.systemedio({
                    fFileLocationUrl:this.goodsform.wjlist,
                    fFileName:this.goodsform.name,
                    fSecuritySystemType:this.goodsform.type,
                    fCoursewareTitle:this.goodsform.feilname,
                    fType:3,
                    fId:this.goodid
                 });
                 if (res.success) {
                      this.$message.success(res.msg);
                      this.closeModal('goodsform',this.attributeModal);
                      this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 删除安全制度
              */
             async systemdelet(){
                 let res = await ruleService.systemdelet({
                      fIds:this.multipleSelection
                 });
                 if (res.success) {
                      this.$message.success(res.msg);
                      this.init();
                      this.multipleSelection=''
                 } else{
                     this.$message.warning(res.msg);
                 };
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
                    this.goodsform.wjlist=res.data.fFileLocationUrl
                    this.goodsform.name=res.data.fFileName
                    this.goodsform.feilname=res.data.fFileTitle
                 } else {
                     this.handleRemove(file);
                     this.$message.warning("上传失败");
                 }
             },
             /**
              * 侧滑弹层关闭
              */
             closeModal(form, modalStatus){
                 switch(form){
                     case 'generaForm':
                         this.modalTitle1 = "";
                         this.generaModal = false;
                         break;
                     case 'typeForm':
                         this.modalTitle2 = "";
                         this.typeModal = false;
                         break;
                     case 'goodsform':
                         this.modalTitle = "";
                         this.attributeModal = false;
                         break;
                 }
                 //this.$refs[form].resetFields();
             },


             /**
              * 新增按钮
              */
             insertType(){
                 // 初始化弹层
                 this.modalTitle2 = '新建制度类型';
                 this.typeModal = true;
                 // 清空表单
                 this.typeInfor.fId = '';
                 this.typeInfor.fEquipmentTypeId = '';
                 this.typeInfor.fTypeName = '';
                 this.typeInfor.fIsDelete = false;
                 this.typeForm = this.typeInfor;
             },
             /**
              * 编辑按钮
              */
             ediogood(id,index){
                this.goodid=id;
                this.attributeModal=true;
                this.modalTitle="编辑制度";
                let c=[];
                c.push(this.systemtable[index])
                this.fileList=c.map((data)=>{
                   return {
                      name:data.fFileName
                   }
                })
                this.goodsform={//新建制度
                    wjlist:this.systemtable[index].fFileLocationUrl,
                    type:this.systemtable[index].fSecuritySystemType,
                    name:this.systemtable[index].fFileName,
                    feilname:'',
                 };
             },
         },
          watch: {
             'generaForm': function(obj) {
                 this.generaFormState = false;
                 this.$nextTick(() => {
                     this.generaFormState = true;
                 })
                 this.$forceUpdate();
             },
             'typeForm': function(obj) {
                 this.typeFormState = false;
                 this.$nextTick(() => {
                     this.typeFormState = true;
                 })
                 this.$forceUpdate();
             },
             'attributeForm': function(obj) {
                 this.attributeFormState = false;
                 this.$nextTick(() => {
                     this.attributeFormState = true;
                 })
                 this.$forceUpdate();
             },
         }
     }
 </script>

 <style rel="stylesheet/scss" lang="scss" scoped>
     .equipment-type-page {
         width: 100%;
         height: 100%;
         background: #fff;
         box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
         border-radius:8px;
         .container { // 页面容器
             .left-sidebar { // 左侧
                 height: calc(100vh - 90px);
                 border-right: 1px solid #F1F1F1;
                 .header { // 头部
                     padding: 20px;
                     color: rgba(84,84,84,1);
                     line-height: 25px;
                     font-size: 16px;
                     .opear-btn { // 操作按钮
                         float: right;
                         color: #545454;
                         font-size: 17px;
                     }
                     .insert-btn { // 新建按钮
                         margin-top: -4px;
                     }
                 }
                 .line { // 标题下划线
                     margin: 0px 20px;
                     margin-top: -6px;
                     height: 1px;
                     border-bottom: 1px solid rgba(226,227,229,1);
                 }
                 .main { // 内容
                     margin-top: 20px;
                     height: calc(100vh - 171px);
                     overflow-y: auto;
                     .no-data-div {
                         line-height: 60px;
                         width: 100%;
                         color: #909399;
                         text-align: center;
                     }
                     .genera-div {
                          cursor:pointer;
                         .genera-info:hover {
                             height: 100px;
                             margin: 0px 0px 10px 0px;
                             transition: all .3s ease-in-out;

                             .update-btn {
                                 opacity: 1;
                             }
                             .delete-btn {
                                 opacity: 1;
                             }
                         }
                         .genera-info {
                             position: relative;
                             border-top: 4px solid #e7eaec;
                             height: 100px;
                             line-height: 100px;
                             font-size: 16px;
                             text-align: left;
                             padding-left: 40px;
                             margin: 0px 15px 10px 15px;
                             box-shadow: 0px 0px 9px 2px rgba(54,58,65,0.1);
                             color: #545454;
                             .genera-name {
                                 font-weight: 700;
                             }
                             .update-btn {
                                 color: #545454;
                                 font-size: 16px;
                                 position: absolute;
                                 right: 40px;
                                 top: 10%;
                                 opacity: 0;
                             }
                             .delete-btn {
                                 color: #545454;
                                 font-size: 16px;
                                 position: absolute;
                                 right: 40px;
                                 top: 44%;
                                 opacity: 0;
                             }
                         }
                     }
                 }
             }
             .right-list { // 右侧
                 height: calc(100vh - 90px);

                 .header { // 头部
                     padding: 20px;
                     color: rgba(84,84,84,1);
                     line-height: 25px;
                     font-size: 16px;
                     .opear-btn { // 操作按钮
                         color: #545454;
                         font-size: 17px;
                         float: left;
                     }
                     .save-btn { // 保存按钮
                         margin-right: 10px;
                         margin-top: -4px;
                     }
                 }
                 .line { // 标题下划线
                     margin: 0px 20px;
                     margin-top: -6px;
                     height: 1px;
                     border-bottom: 1px solid rgba(226,227,229,1);
                 }
                 .main { // 内容
                     height: calc(100vh - 191px);
                     overflow-y: auto;
                     padding: 20px;
                     .tab {
                         .attribute {
                             padding: 0px 10px;
                             margin-top: 10px;
                             line-height: 30px;
                             .description {
                                 color: #c0c4cc;
                                 font-size: 12px;
                             }
                         }
                     }
                 }
             }
         }
     }
     .wpct-100 {
         width: 100%;
     }
     .rule_pagination {
         margin-top: 1.25rem;
         text-align: right;
     }

     .upload-wj {
         display: flex;
         align-items: center;
         justify-content: center;
         margin-top: 15px;
     }
     .avatar-uploader .el-upload:hover {
         border-color: #409eff;
     }
     .avatar-uploader-icon {
         font-size: 28px;
         color: #8c939d;
         width: 132px;
         height: 132px;
         line-height: 132px;
         text-align: center;
     }
     .avatar {
         width: 132px;
         height: 132px;
         display: block;
     }
 </style>
