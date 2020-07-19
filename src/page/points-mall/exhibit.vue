 /*
 * @Author: 杨高杰
 * @Date:   2019-08-29
 * @Description: '商品上下架'
 */
 <template>
     <div class="patrol-page">
         <div class="container">
              <div>
                   <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                       <el-form-item label="商品信息">
                           <el-input placeholder="请输入商品相关信息" clearable size="small" class="input-father" v-model="fName"></el-input>
                       </el-form-item>
                       <el-form-item label="商品状态">
                           <el-select class="input-father" v-model="shopcate" placeholder="是否上下架">
                               <el-option
                                 label="全部"
                                 value= "">
                               </el-option>
                               <el-option
                                 label="上架"
                                 :value="true">
                               </el-option>
                               <el-option
                                 label="下架"
                                 :value="false">
                               </el-option>
                           </el-select>
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary" @click="searchCurrent"><i class="el-icon-search"></i>搜索</el-button>
                       </el-form-item>
                   </el-form>
              </div>
              <div class="tab">
                   <el-table :data="goodstable" stripe class="defaultTab" highlight-current-row>
                         <el-table-column type="selection" width="55"></el-table-column>
                         <el-table-column type="index" label="序号" width="60"></el-table-column>
                         <el-table-column prop="fCommPath" label="商品照片" min-width="80" :show-overflow-tooltip="true">
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
                         <el-table-column prop="fExchangeNumber" label="已销售" min-width="80" :show-overflow-tooltip="true">
                         </el-table-column>
                         <el-table-column prop="fStock" label="库存" min-width="80" :show-overflow-tooltip="true">
                         </el-table-column>
                         <el-table-column prop="fDiscountNumber" label="打折数" min-width="40" :show-overflow-tooltip="true">
                         </el-table-column>
                         <el-table-column prop="fShelfOnTime" label="折后积分" min-width="40" :show-overflow-tooltip="true">
                         </el-table-column>
                         <el-table-column prop="fShelfOnStatus" label="商品状态" min-width="40" :show-overflow-tooltip="true">
                             <template slot-scope="scope">
                                 <span style="color: #67C23A;" v-if="scope.row.fShelfOnStatus==true">在售</span>
                                 <span style="color: #F56C6C;" v-if="scope.row.fShelfOnStatus==false">已下架</span>
                             </template>
                         </el-table-column>
                         <el-table-column label="操作" width="200">
                             <template slot-scope="scope">
                                 <el-button v-if="scope.row.fShelfOnStatus" type="text" @click="undercarriage(scope.row)">&nbsp;下架</el-button>
                                 <el-button disabled v-if="!scope.row.fShelfOnStatus" type="text">&nbsp;下架</el-button>
                                 <el-button type="text" @click="delet(scope.row)">&nbsp;删除</el-button>
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
 </template>
 <script>
     import TheDialog from "@/components/TheDialog" // 侧滑组件
     import { ShelfService } from '@/api/integral-shop' // api
     export default {
         data() {
             return {
                 options: [{
                      value: 0.5,
                      label: '5折'
                    },{
                      value: 0.6,
                      label: '6折'
                    }, {
                      value: 0.7,
                      label: '7折'
                    }, {
                      value: 0.8,
                      label: '8折'
                    }, {
                      value: 0.9,
                      label: '9折'
                    }, {
                      value: 1,
                      label: '原价'
                 }],
                 value: '',
                 fName: '', // 名称
                 orderdata:'',//日期
                 stage:'',//订单状态
                 shop_note:false,//上下架记录
                 shop_shelf:false,//商品上架
                 nodetable:[],//上下架记录
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
                 previewUrl: process.env.PREVIEW_API,
                 goodsform:{//新建商品表格数据
                     name:'',//商品名称
                     detail:'',//商品简介
                     cate:'',//商品类型
                     num:'',//商品库存
                     jxnum:'',//积分价值
                     xjnum:'',//现金价值
                 },
                 multipleSelection: [],//多选的数组
                 shopcate:'',
                 //新建商品的表单校验
                 rules: {
                    cate:[{required: true,message: "请选择商品类型",trigger: "change"}],
                    name:[{ required: true, message: '名称不能为空'}],
                    detail:[{ required: true, message: '商品简介不能为空'}],
                    num:[{ required: true, message: '商品库存不能为空'}]
                 },
                 num:'',
                 title:"",//上下架标题
             }
         },
         components: {
             TheDialog,
         },
         watch:{
              shop_shelf(newvalue,oldvalue) {
                    if (newvalue==false) {
                        this.$refs.multipleTable.clearSelection();
                    }
              }
         },
         mounted() {
             this.goodstables()
         },
         methods:{

             /* 分页操作*/
             handleSizeChange(val) {
                 this.searchParam.pageSize = val;
                 this.goodstables()
             },
             handleCurrentChange(val) {
                 this.searchParam.currentPage = val;
                 this.goodstables()
             },
             //点击下架
             undercarriage(row){
                 this.$confirm(`此操作将下架当前商品，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await ShelfService.xiajia(row.fid);
                         if (res.success) {
                             this.$message.success(res.msg);
                             this.goodstables()
                         } else{
                             this.$message.warning(res.msg);
                         };
                 }).catch(() => {

                 });
             },
             delet(row){
                 this.$confirm(`此操作将删除该商品，是否继续？`, '提示', {
                     confirmButtonText: '确定',
                     cancelButtonText: '取消',
                     type: 'warning'
                 }).then(async () => {
                     let res = await ShelfService.delet(row.fid);
                         if (res.success) {
                             this.$message.success(res.msg);
                             this.goodstables()
                         } else{
                             this.$message.warning(res.msg);
                         };
                 }).catch(() => {

                 });
             },
             /**
              * 获取商品table
              * @return {Array}   查询的结果
              */
             async goodstables(){
                 let res = await ShelfService.shelflist({
                    "currentPage":this.searchParam.currentPage,
                    "pageSize":this.searchParam.pageSize,
                     "fCommState": this.shopcate,//上下架状态
                     "fCommodityId": this.fName,//商品关键词
                 });
                 if (res.success) {
                     this.goodstable=res.obj.items;
                     this.searchParam.sum = res.obj.itemTotal;
                 } else{
                     this.$message.warning(res.msg);
                 };
             },
            //搜索
            searchCurrent(){
                this.searchParam.currentPage = 1;
                this.goodstables()
            }
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
             .rule_pagination {
                 margin-top: 1.25rem;
                 text-align: right;
             }
         }
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
 </style>
