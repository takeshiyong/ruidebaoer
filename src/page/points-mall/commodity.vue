 /*
  * @Author: 杨高杰
  * @Date:   2019-09-02
  * @Description: '商品基本信息'
  */
 <template>
     <div class="equipment-type-page">
         <div class="container">
             <el-row>
                 <el-col :lg="6" :md="8" :sm="10" :xs="24">
                     <div class="left-sidebar">
                         <div class="header">
                             <span>商品类型</span>
                             <el-tooltip effect="dark" content="新建" placement="top">
                                 <el-button  type="text" icon="el-icon-plus" @click="insertGenera" class="opear-btn insert-btn"></el-button>
                             </el-tooltip>
                         </div>
                         <div class="line"></div>
                         <div class="main">
                             <div v-if="generas.length > 0">
                                 <div v-for="(item, index) in generas" :key="index" class="genera-div" @click="fcates(item)">
                                     <div class="genera-info">
                                         <div class="genera-name">{{item.fCateName}}</div>
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
                                     <el-form-item label="商品信息">
                                         <el-input placeholder="请输入商品相关信息" clearable size="small" class="input-father" v-model="fName"></el-input>
                                     </el-form-item>
                                     <el-form-item>
                                         <el-button type="primary" @click="findshops"><i class="el-icon-search"></i>搜索</el-button>
                                         <el-button type="primary" @click="makegood" ><i class="el-icon-plus" ></i>新建</el-button>
                                         <el-button type="primary" @click="goodspz" icon="el-icon-setting">商品配置</el-button>
                                         <el-button type="primary" @click="namepz" icon="el-icon-setting">管理人员配置</el-button>
                                         <el-button type="primary" @click="grounding"><i class="el-icon-top"></i>上架</el-button>
                                     </el-form-item>
                                 </el-form>
                             </div>
                             <div class="tab">
                                 <el-table :data="goodstable" ref="multipleTable" @selection-change="handleSelectionChange" stripe class="defaultTab" highlight-current-row>
                                       <el-table-column type="selection" width="55"></el-table-column>
                                       <el-table-column type="index" label="序号" width="60"></el-table-column>
                                       <el-table-column prop="fPatrolTaskDate" label="商品封面" min-width="60" :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <el-image
                                                    style="width: 30px; height:30px;cursor:pointer; "
                                                    :src="previewUrl+scope.row.fCommPath"
                                                    :preview-src-list="previewUrl+scope.row.fCommPath"
                                                ></el-image>
                                            </template>
                                       </el-table-column>
                                       <el-table-column prop="fCommName" label="商品名" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column prop="fCateName" label="商品类型" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column prop="fCommIntegral" label="积分定价" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column prop="fCommPrice" label="现金定价" min-width="80" :show-overflow-tooltip="true">
                                       </el-table-column>
                                       <el-table-column label="操作" width="200">
                                           <template slot-scope="scope">
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
                             <el-form-item label="商品类型" prop="fName">
                                 <el-input v-model="generaForm.fName" size="small" placeholder="请填写商品类型名称"></el-input>
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
                  <el-form
                      :model="goodsform"
                      ref="goodsform"
                      :rules="rules"
                      label-width="100px"
                      class="demo-form-inline"
                  >
                      <el-row>
                          <el-col :span="8">
                              <el-form-item label="商品图片" prop="fPictureUrl">
                                  <el-upload
                                      class="avatar-uploader"
                                      accept="image/jpeg, image/gif, image/png, image/jpg"
                                      ref="upload"
                                      :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                                      :show-file-list="false"
                                      :on-success="handlersuccess"
                                      :before-upload="handbu"
                                  >
                                      <img v-if="imageUrl" :src="previewUrl+imageUrl" class="avatar" />
                                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                  </el-upload>
                              </el-form-item>
                          </el-col>
                          <el-col :span="13">
                              <el-form-item
                                  label="商品名称"
                                  label-width="100px"
                                  prop="name"
                              >
                                  <el-input
                                      type="name"
                                      maxlength="20"
                                      placeholder="请输入商品名称"
                                      v-model="goodsform.name"
                                      class="input-w"
                                      style="width: 80%;"
                                  ></el-input>
                              </el-form-item>
                              <el-form-item label="商品类型" prop="cate">
                                  <el-select v-model="goodsform.cate" style="width: 80%;"  class="input-w" placeholder="请选择商品类型">
                                      <el-option
                                          v-for="(val,index) in goodcate"
                                          :key="index"
                                          :label="val.fCateName"
                                          :value="val.fId"
                                      ></el-option>
                                  </el-select>
                              </el-form-item>
                              <el-form-item
                                  label="商品规格"
                                  label-width="100px"
                                  prop="num"
                              >
                                  <el-input
                                      type="text"
                                      maxlength="8"
                                      placeholder="请输入商品规格"
                                      v-model="goodsform.num"
                                      class="input-w"
                                      style="width: 80%;"
                                  ></el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                      <el-row >
                         <el-col :span="8">
                             <el-form-item
                                 label="积分价值"
                                 label-width="100px"
                                 prop="jfnum"
                             >
                                 <el-input
                                     type="number"
                                     maxlength="8"
                                     placeholder="请输入积分价值"
                                     v-model="goodsform.jfnum"
                                     class="input-w"
                                     style="width: 100%;"
                                 ></el-input>
                             </el-form-item>
                         </el-col>
                         <el-col :span="13">
                              <el-form-item
                                  label="现金价值"
                                  label-width="100px"
                                  prop="xjnum"
                              >
                                  <el-input
                                      type="number"
                                      maxlength="8"
                                      placeholder="请输入现金价值"
                                      v-model="goodsform.xjnum"
                                      class="input-w"
                                      style="width: 80%;"
                                  ></el-input>
                              </el-form-item>
                         </el-col>
                      </el-row>
                      <el-form-item>
                          <el-button
                              type="primary"
                              @click="submitcourrse('goodsform')"
                          >确定</el-button>
                          <el-button @click="resetcourrse('goodsform')">重置</el-button>
                      </el-form-item>
                  </el-form>
             </div>
         </TheDialog>
         <el-dialog :show-close="true" title="商品管理员配置" :visible.sync="setingpeople" append-to-body width="800px">
                 <el-form :inline="true" :model="peopleInline" class="demo-form-inline">
                     <el-form-item label="商品管理员">
                       <el-select clearable filterable style="width: 13.1rem;" v-model="peopleInline.id" placeholder="请选择商品管理员">
                           <el-option
                             v-for="item in plist"
                             :key="item.value"
                             :label="item.fUserName"
                             :value="item.fId">
                           </el-option>
                       </el-select>
                       <el-select style="width: 13.1rem;margin-left: 0.5rem;" v-model="peopleInline.cate" placeholder="请选择商品管理员">
                           <el-option
                             label="商品管理员"
                             value="1">
                           </el-option>
                           <el-option
                             label="商品核销员"
                             value="2">
                           </el-option>
                           <el-option
                             label="管理员"
                             value="3">
                           </el-option>
                       </el-select>
                     </el-form-item>
                     <el-form-item>
                       <el-button type="primary" @click="adduser">添加</el-button>
                     </el-form-item>
                 </el-form>
                 <el-table :data="nametable" stripe class="defaultTab" highlight-current-row>
                       <el-table-column type="index" label="序号" width="60"></el-table-column>
                       <el-table-column prop="fPersonnerName" label="姓名" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column prop="fPersonnerId" label="编号" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column prop="fPersonnerRole" label="角色" min-width="80" :show-overflow-tooltip="true">
                           <template slot-scope="scope">
                               <span v-if="scope.row.fPersonnerRole==1">商品管理员</span>
                               <span v-if="scope.row.fPersonnerRole==2">商品核销员</span>
                               <span v-if="scope.row.fPersonnerRole==3">管理员</span>
                           </template>
                       </el-table-column>
                       <el-table-column label="操作" width="200">
                           <template slot-scope="scope">
                               <!-- <el-button type="text" @click="ediopeople(scope.row)">&nbsp;编辑</el-button> -->
                               <el-button type="text" @click="deletpeople(scope.row)">&nbsp;删除</el-button>
                           </template>
                       </el-table-column>
                 </el-table>
         </el-dialog>
         <!-- 商城配置 -->
         <el-dialog :show-close="true" title="商品配置" :visible.sync="setinggood" append-to-body width="800px">
                 <el-card class="box-card">
                    <el-form  :inline="true" :model="goodleInline">
                          <el-form-item label="订单失效时间">
                               <el-input type="number" placeholder="请输入失效时间"  v-model="goodleInline.time"></el-input>
                          </el-form-item>
                          <el-form-item label="兑换商品规则">
                               <el-select v-model="goodleInline.rule" placeholder="请选择商品管理员">
                                   <el-option
                                     v-for="item in jflist"
                                     :key="item.value"
                                     :label="item.fName"
                                     :value="item.fId">
                                   </el-option>
                               </el-select>
                          </el-form-item>
                          <el-form-item label="积分金钱比例">
                              <el-col :span="11">
                                 <el-input type="number" placeholder="积分" style="width: 5.8rem;" v-model="goodleInline.jf"></el-input>
                              </el-col>
                              <el-col class="line" :span="2">：</el-col>
                              <el-col :span="11">
                                 <el-input type="number" placeholder="金钱" style="width:5.8rem;" v-model="goodleInline.jq"></el-input>
                              </el-col>
                            </el-form-item>
                          <el-form-item>
                            <el-button type="primary" @click="allConfiguration">配置</el-button>
                          </el-form-item>
                    </el-form>
                 </el-card>
         </el-dialog>
         <!-- 上下架 -->
         <el-dialog :title="title" :visible.sync="shop_shelf" width="800px">
               <el-table
                   :data="multipleSelection"
                   border
                   style="width: 100%">
                   <el-table-column
                     prop="fCommName"
                     label="商品名称"
                     :show-overflow-tooltip="true"
                      >
                   </el-table-column>
                   <el-table-column
                     prop="fCommPrice"
                     label="商品价格"
                     >
                   </el-table-column>
                   <el-table-column
                     prop="fShelfOnNumber"
                     label="上架数量"
                     width="180"
                     >
                     <template slot-scope="scope">
                          <el-input-number v-model="scope.row.fShelfOnNumber"  label="描述文字"></el-input-number>
                     </template>
                   </el-table-column>
                   <el-table-column
                     prop="fCommIntegral"
                     label="积分价格">
                   </el-table-column>
                   <el-table-column
                     prop="name"
                     label="打折数"
                     width="180">
                     <template slot-scope="scope">
                         <el-select v-model="scope.row.fDiscountNumber" placeholder="请选择折扣" @change="rebate(scope.$index,scope.row.fDiscountNumber)">
                             <el-option
                               v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                             </el-option>
                           </el-select>
                     </template>
                   </el-table-column>
                   <el-table-column
                     prop="fShelfOnTime"
                     label="折后积分"
                     >
                   </el-table-column>
                 </el-table>
                  <div slot="footer" class="dialog-footer">
                     <el-button @click="shop_shelf = false">取 消</el-button>
                     <el-button type="primary" @click="define()">确 定</el-button>
                   </div>
         </el-dialog>
     </div>
 </template>

 <script>
     import { ShopService } from '@/api/integral-shop' // api
     import { basicService } from '@/api/basic-safey' // api
     import { ShelfService } from '@/api/integral-shop' // api
     import TheDialog from "@/components/TheDialog" // 侧滑组件
     export default {
         data() {
             return {
                 MoneyScale: 0, //积分比
                 generas: [], // 设备大类集合
                 previewUrl: process.env.PREVIEW_API,
                 fName: '', // 名称
                 orderdata:'',//日期
                 stage:'',//订单状态
                 setinggood:false,//商品配置显隐
                 setingpeople:false,//商品管理人员配置
                 plist:[],//人员list
                 nametable:[],//姓名的表格
                 stagelist:[{
                   label:'待核销',
                   id:'0',
                 },{
                   label:'已核销',
                   id:'1',
                 }],
                 searchParam: {
                     //分页相关
                     currentPage: 1,
                     sum: 0,
                     pageSizes: [10, 20, 30, 40],
                     pageSize: 10
                 },
                 goodstable:[],//表格数据
                 divisionModal:false,//表单显示隐藏
                 modalTitle:'',//标题
                 imageUrl:'',//上传后的图片预览
                 goodsform:{//新建商品表格数据
                     name:'',//商品名称
                     detail:'',//商品简介
                     cate:'',//商品类型
                     num:'',//商品库存
                     jxnum:'',//积分价值
                     xjnum:'',//现金价值
                     kcnum:'',//库存数量
                 },
                 multipleSelection: [],//多选的数组
                 goodcate:[{//商品类型
                   id:1,
                   label:"生活用品"
                 },{
                   id:2,
                   label:"工作用品"
                 }],

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
                         {required: true, message: '请填写商品类型', trigger: 'blur'},
                     ]
                 },

                 typeTitle: '全部商品', // 右侧标题
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
                 typeFormRules: { // 表单校验
                     fTypeName: [
                         {required: true, message: '请填写类型名称', trigger: 'blur'},
                     ],
                     fEquipmentTypeId: [
                         { required: true, message: '请选择所属大类', trigger: 'change' }
                     ]
                 },

                 // 侧滑弹层
                 modalTitle3: '', // 弹层标题
                 attributeModal: false, // 弹层Modal
                 cateid:"",//商品类型id
                 attributeForm: {}, // 弹层表单
                 goodid:'',//货物id
                 attributeInfor: { // 初始化空表单
                     fId:'', //id
                     fIsDelete: false, // 是否可删除
                     fEquipmentTypeInfoId:'', // 所属类型id
                     fAttributeName: '', // 设备类型
                     fUnit: '' // 单位
                 },
                 peopleInline:{
                   id:'',//商品管理员id
                   cate:'',//商品管理角色
                 },
                 goodleInline:{//配置信息
                    jq:'',
                    jf:'',
                    time:'',
                    rule:''
                 },
                 fcate:'',//点击右侧类型
                 jflist:[],//获取所有积分规则
                 //新建商品的表单校验
                 rules: {
                    cate:[{required: true,message: "请选择商品类型",trigger: "change"}],
                    name:[{ required: true, message: '名称不能为空'}],
                    detail:[{ required: true, message: '商品简介不能为空'}],
                    num:[{ required: true, message: '商品规格不能为空'}]
                 },
                 //商品上下架
                 options: [{
                      value: 1,
                      label: '1折'
                    },{
                      value: 2,
                      label: '2折'
                    },{
                      value: 3,
                      label: '3折'
                    },{
                      value: 4,
                      label: '4折'
                    },{//打折数
                      value: 5,
                      label: '5折'
                    },{
                      value: 6,
                      label: '6折'
                    }, {
                      value: 7,
                      label: '7折'
                    }, {
                      value: 8,
                      label: '8折'
                    }, {
                      value: 9,
                      label: '9折'
                    }, {
                      value: 10,
                      label: '原价'
                 }],
                 title:"",//上下架标题
                 shop_shelf:false,//商品上架

             }
         },
         components: {
             TheDialog,
         },
         mounted: function(){
             this.init();
             this.getAllUser();
             this.nameall();
             this.getIntegralRules();
             this.getMoneyScale()
         },
         methods: {
             /**
              * 页面初始化
              */
             init(){
                 // 获取商品类型
                 this.shopcatelist();
                 //获取表格数据
                 this.goodstables()
             },
             fcates(item){
                this.fcate=item.fId;
                this.typeTitle=item.fCateName;
                this.goodstables()
             },
             findshops(){
                this.fcate='';
                this.typeTitle='全部商品'
                this.goodstables()
             },
             //上下架相关
             /* 表格多选*/
             handleSelectionChange(val) {
                 this.multipleSelection = val;
                 console.log(this.multipleSelection)
             },
             /* 点击上架按钮*/
             grounding(){
                 if (this.multipleSelection=="") {
                    this.$message.error('请选择商品');
                 }else{
                    this.title="商品上架"
                    this.multipleSelection = this.multipleSelection.map((data)=>{
                      delete data.currentPage
                      delete data.pageSize
                      return {
                        ...data,
                        fShelfOnNumber:1,//上架数量
                        fDiscountNumber:10,//打折数
                        fShelfOnTime:data.fCommIntegral*10*0.1,//折后积分
                        fShelfOnStatus:true
                      }
                    });
                    this.shop_shelf=true;
                    console.log(this.multipleSelection)
                 }
             },
             rebate(index,value){
               console.log(index,value)
               this.multipleSelection[index].fShelfOnTime=this.multipleSelection[index].fCommIntegral*this.multipleSelection[index].fDiscountNumber*0.1
               console.log(this.multipleSelection)
             },
             define(){
                 this.racks()
             },
             /**
              * 批量上下架
              * @return {Array}   查询的结果
              */
             async racks(){
               this.multipleSelection = this.multipleSelection.map((data)=>{
                 // delete data.fCateName
                 // delete data.fCommName
                 // delete data.fCommPath
                 return {
                   ...data,
                   fDiscountNumber:data.fDiscountNumber,//打折数
                   fDiscountScoer:data.fShelfOnTime*data.fDiscountNumber,//折后积分
                   fCommodityId:data.fId,
                 }
               });
               this.multipleSelection=JSON.parse(JSON.stringify(this.multipleSelection).replace(/fCommPrice/g, 'fShelfOnPrice'))
               console.log("this.multipleSelection", JSON.stringify(this.multipleSelection))
                 let res = await ShelfService.racks({
                     "commAddList":this.multipleSelection
                 });
                 if (res.success) {
                      if(this.title=="商品上架"){
                        this.$message.success("上架成功");
                        this.$refs.multipleTable.clearSelection();
                        this.shop_shelf=false;
                        this.goodstables()
                      }else{
                        this.$message.success("下架成功 ")
                        this.$refs.multipleTable.clearSelection();
                        this.shop_shelf=false;
                        this.goodstables()
                      }
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             //新建商品
             makegood(){
                this.attributeModal=true
                this.modalTitle="新建商品"
                this.goodsform={//新建商品表格数据
                     name:'',//商品名称
                     detail:'',//商品简介
                     cate:'',//商品类型
                     num:'',//商品库存
                     jxnum:'',//积分价值
                     xjnum:'',//现金价值
                     kcnum:'',//库存数量
                 };
               this.imageUrl="";
             },
             deletpeople(row){
                 this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await ShopService.namedelet(row.fId);
                         if (res.success) {
                             this.$message.success(res.msg);
                             this.nameall()
                         } else{
                             this.$message.warning(res.msg);
                         };
                 }).catch(() => {

                 });
             },
             //商品配置
             goodspz(){
               this.selectConfiguration()
               this.setinggood=true
             },
             //管理人员配置
             namepz(){
                this.setingpeople=true;
                this.peopleInline={
                   id:'',//商品管理员id
                   cate:'',//商品管理角色
                 }
             },
             /**
              * 获取所有积分规则
              * @return {Array}
              */
             async getIntegralRules(){
                 let res = await ShopService.getIntegralRules();
                 if (res.success) {
                     this.jflist=res.obj
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 获取商城配置
              * @return {Array}
              */
             async selectConfiguration(){
                 let res = await ShopService.selectConfiguration();
                 if (res.success) {
                     this.goodleInline={//配置信息
                        jq:1,
                        jf:res.obj.integralMoneyRatio,
                        time:res.obj.failureTime,
                        rule:res.obj.memberRedemptionRules
                     }
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 进行商城配置
              * @return {Array}
              */
             async allConfiguration(){
                 let res = await ShopService.allConfiguration({
                    "failureTime":this.goodleInline.time,
                    "integralMoneyRatio": Math.ceil(this.goodleInline.jf/this.goodleInline.jq) ,
                    "memberRedemptionRules": this.goodleInline.rule
                 });
                 if (res.success) {
                      this.$message.success(res.msg);
                      this.selectConfiguration()
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 新加管理人员
              * @return {Array}
              */
             async adduser(){
                 let res = await ShopService.addshop({
                      fPersonnerId:this.peopleInline.id,
                      fPersonnerRole:this.peopleInline.cate,
                 });
                 if (res.success) {
                     this.$message.success(res.msg);
                     this.nameall()
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
                     this.plist=res.obj
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 获取管理人员table
              * @return {Array}
              */
             async nameall(){
                 let res = await ShopService.nameall();
                 if (res.success) {
                     this.nametable=res.obj
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 上传成功后的钩子
              */
             handlersuccess(res, file) {
                 if (res.success) {
                     if (
                         res.data != null &&
                         res.data != undefined &&
                         JSON.stringify(res.data) != "{}"
                     ) {
                         this.imageUrl = res.data.fFileLocationUrl;
                         console.log(this.imageUrl)
                         this.imagename = res.data.fFileName;
                         this.imagecate = res.data.fFileTitle;
                     }
                 } else {
                     this.$message.error("上传失败！");
                 }
             },
             /**
              * 上传成功后的钩子
              */
             handbu(file) {
                 if (file.size > 10 * 1024 * 1024) {
                     this.$message.warning("文件超过10M！");
                     return false;
                 }
             },
             /* 分页操作*/
             handleSizeChange(val) {
                 this.searchParam.pageSize = val;
                 this.goodstables()
             },
             handleCurrentChange(val) {
                 this.searchParam.currentPage = val;
                 this.goodstables()
             },
             // /* 表格多选*/
             // handleSelectionChange(val) {
             //     this.multipleSelection = val;
             // },
             /**
              * 获取商品类型
              * @return {Array}   查询的结果
              */
             async shopcatelist(){
                 let res = await ShopService.shopcatelist();
                 if (res.success) {
                     if (res.obj != null && res.obj != undefined && res.obj.length > 0){
                         this.generas = res.obj;
                         this.goodcate=res.obj
                     } else {
                         this.generas = [];
                     }
                 } else {
                     this.$message.warning(res.msg);
                     this.generas = [];
                 }
             },
             /**
              * 获取商品table
              * @return {Array}   查询的结果
              */
             async goodstables(){
                 let res = await ShopService.goodstable({
                    "currentPage":this.searchParam.currentPage,
                    "pageSize":this.searchParam.pageSize,
                    fCommName:this.fName,
                    fCategoryId:this.fcate
                 });
                 if (res.success) {
                     this.goodstable=res.obj.items;
                     this.searchParam.sum = res.obj.itemTotal;
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 新增按钮
              */
             insertGenera(){
                 // 初始化弹层
                 this.modalTitle1 = '新建商品类型';
                 this.generaModal = true;
                 // 清空表单
                 this.generaInfor.fId = '';
                 this.generaInfor.fName = '';
                 this.generaInfor.fIsDelete = false;
                 this.generaForm = this.generaInfor;
             },
             /**
              * 编辑按钮
              */
             updateGenera(row){
                 this.cateid=row.fId;
                 this.generaForm.fName=row.fCateName;
                 this.modalTitle1 = '编辑商品类型';
                 this.generaModal = true;
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
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await ShopService.deletcate(row.fId);
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
                         if (this.modalTitle1 == '新建商品类型') {
                             this.insertGeneraForm();
                         }
                         if (this.modalTitle1 == '编辑商品类型') {
                             this.updateGeneraForm();
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
             resetForm(formName){
                 this.$refs[formName].resetFields();
             },
             /**
              * 新增请求
              * @param {object}     提交的表单对象
              */
             async insertGeneraForm(){
                 let res = await ShopService.addTCommCategory({
                    fCateName:this.generaForm.fName,
                    "fIsDelete":false
                 });
                 if (res.success) {
                     this.closeModal('generaForm',this.generaModal);
                     this.$message.success(res.msg);
                     this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 修改请求
              * @param {object}     提交的表单对象
              */
             async updateGeneraForm(){
                 let res = await ShopService.updateTCommCategory({
                    fCateName:this.generaForm.fName,
                    "fIsDelete":false,
                    "fId":this.cateid,
                 });
                 if (res.success) {
                     this.closeModal('generaForm',this.generaModal);
                     this.$message.success(res.msg);
                     this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /*提交新建表单*/
             submitcourrse(formName) {
                 this.$refs[formName].validate(valid => {
                     if (valid) {
                         if (this.modalTitle=="新建商品") {
                              this.addgoods();
                         }else{
                              this.ediogoods();
                         }

                     } else {
                         console.log("error submit!!");
                         return false;
                     }
                 });
             },
             /**
              * 新增商品
              * @param {object}     提交的表单对象
              */
             async addgoods(){
                 let res = await ShopService.addgoods({
                    fCategoryId:this.goodsform.cate,
                    fCommName:this.goodsform.name,
                    fCommIntegral:this.goodsform.jfnum,
                    fCommPrice:this.goodsform.xjnum,
                    fCommSpecification:this.goodsform.num,
                    fCommPath:this.imageUrl,
                    fStock:this.goodsform.kcnum,
                 });
                 if (res.success) {
                     this.closeModal('goodsform',this.attributeModal);
                     this.$message.success(res.msg);
                     this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
             /**
              * 编辑商品
              * @param {object}     提交的表单对象
              */
             async ediogoods(){
                 let res = await ShopService.ediogoods({
                    fCategoryId:this.goodsform.cate,
                    fCommName:this.goodsform.name,
                    fCommIntegral:this.goodsform.jfnum,
                    fCommPrice:this.goodsform.xjnum,
                    fCommSpecification:this.goodsform.num,
                    fCommPath:this.imageUrl,
                    fStock:this.goodsform.kcnum,
                    fId:this.goodid,
                 });
                 if (res.success) {
                     this.closeModal('goodsform',this.attributeModal);
                     this.$message.success(res.msg);
                     this.init();
                 } else{
                     this.$message.warning(res.msg);
                 };
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
                 this.modalTitle2 = '新建设备类型';
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
                this.modalTitle="编辑商品";
                this.imageUrl=this.goodstable[index].fCommPath
                this.goodsform.cate=this.goodstable[index].fCategoryId
                this.goodsform.name=this.goodstable[index].fCommName
                this.goodsform.jfnum=this.goodstable[index].fCommIntegral
                this.goodsform.xjnum=this.goodstable[index].fCommPrice
                this.goodsform.num=this.goodstable[index].fCommSpecification
             },
             /**
              * 删除按钮
              */
             deleteType(row){
                 if (row.fId == '' || row.fId == null || row.fId == undefined) {
                     return;
                 };
                 this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await TypeService.deleteType(row.fId);
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
              * 删除按钮
              */
             deletgoodsp(id){
                 this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await ShopService.deletgoods(id);
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
              * 获取金钱比
              */
            async getMoneyScale(){
                const res = await ShopService.selectByType(1);
                if(res.success){
                    this.MoneyScale = res.obj.value;
                }else{
                    // console.log(res.msg)
                    this.$message.warning(res.msg);
                }
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
             'goodsform.xjnum': function(){
                 this.goodsform.jfnum = this.goodsform.xjnum * this.MoneyScale
             },
             'goodsform.jfnum': function(){
                 this.goodsform.jfnum = this.goodsform.jfnum
             }
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
                         .genera-info:hover {
                             height: 100px;
                             margin: 0px 0px 10px 0px;
                             transition: all .3s ease-in-out;
                             cursor:pointer;
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
     /deep/ .el-upload {
         display: flex;
         align-items: center;
         justify-content: center;
     }
     /deep/ .avatar-uploader .el-upload {
         border: 1px dashed #d9d9d9;
         border-radius: 6px;
         cursor: pointer;
         position: relative;
         overflow: hidden;
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
     .tdbody{
        width: 160px;
        text-align: center;
        font-weight: 800;
        height: 40px;
     }
     .tdpding{
       padding-left: 10px;
     }
 </style>
