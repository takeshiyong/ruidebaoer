 /*
 * @Author: 杨高杰
 * @Date:   2019-08-20
 * @Description: '设备检查项'
 */
 <template>
    <div class="check-item-page">
         <div class="container">
              <div>
                   <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                       <el-form-item label="设备检查项">
                           <el-input placeholder="请输入关键词查询" clearable size="small" class="input-father" v-model="fName"></el-input>
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary" @click="finditem"><i class="el-icon-search"></i>搜索</el-button>
                           <el-button type="primary" @click="addway"><i class="el-icon-plus"></i>新建</el-button>
                       </el-form-item>
                   </el-form>
              </div>
              <div class="tab">
                   <el-table :data="itemtable" stripe class="defaultTab" highlight-current-row>
                       <el-table-column type="index" label="序号" width="60"></el-table-column>
                       <el-table-column prop="fEquipmentTypeName" label="设备小类" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column prop="fCheckItemsContent" label="设备检查项" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column prop="fCheckItemsRemarks" label="检查项备注" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <span>{{scope.row.fCheckItemsRemarks || '---'}}</span>
                          </template>
                       </el-table-column>
                       <el-table-column label="操作" width="200">
                           <template slot-scope="scope">
                               <el-button type="text" @click="edio_item(scope.row.fCheckItemsId,scope.$index)">&nbsp;编辑</el-button>
                               <el-button type="text" @click="remove_item(scope.row.fCheckItemsId)">&nbsp;删除</el-button>
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
              <TheDialog :modal='wayshow' :modalTitle="modalTitle" @closeModal="wayshow=false">
                  <div slot="custom-modal-content">
                      <el-form :model="itemForm"  ref="itemForm" label-width="100px">
                           <el-form-item label="巡检设备类" prop="device" :rules="[{required: true,message: '请选择巡检设备类', trigger: 'change'},]">
                                <el-cascader
                                    style="width: 40%;"
                                    placeholder="请选择或者搜索设备类型"
                                     v-model="itemForm.device"
                                    :options="options"
                                    :props="props"
                                    filterable>
                                </el-cascader>
                           </el-form-item>
                           <el-form-item label="检查项名称" prop="name" :rules="[{ min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' },
                           { required: true, message: '请输入检查项名称 ', trigger: 'blur' }]">
                                <el-input
                                    style="width: 40%;"
                                    type="text"
                                    placeholder="请输入检查项名称"
                                    v-model="itemForm.name"
                                    autocomplete="off"
                                ></el-input>
                           </el-form-item>
                           <el-form-item label="检查项备注" prop="remark">
                               <el-input type="textarea" maxlength="60" placeholder="请输入检查项备注" show-word-limit v-model="itemForm.remark"></el-input>
                           </el-form-item>
                           <el-form-item>
                               <el-button type="primary" size="small" @click="item_submit('itemForm')">确定</el-button>
                               <el-button  size="small" @click="resetcourrse('itemForm')">重置</el-button>
                           </el-form-item>
                      </el-form>
                  </div>
              </TheDialog>
         </div>
    </div>
</template>
<script>
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { itemService } from '@/api/device-safety'; //引入api
    export default {
        data() {
            return {
                fName:'', // 名称
                wayshow:false,//编辑和新建线路的弹窗
                modalTitle:'',//弹窗标题
                equlist:[],
                itemtable:[],
                searchParam: {
                    //分页相关
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                itemForm:{//新建线路
                   name:'',
                   device:'',
                   remark:'',
                },
                options:[],
                wayFormRules:[{}],
                itemid:'',
                //规则tree数据
                props: {
                  value:'fId',
                  label:'fName',
                  children: 'tEquipmentTypeInfos'
                }
            }
        },
        components: {
            TheDialog,
        },
        mounted() {
            this.allequtree()
            this.itemlist()
        },
        methods:{
            //新建路线
            addway(){
                this.wayshow=true;
                this.itemForm={};
                this.modalTitle='新建检查项'
            },
            //搜索
            finditem(){
                this.itemlist()
            },
            //分页操作
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.itemlist();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.itemlist();
            },
            //编辑和新建检查项表单提交
            item_submit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if(this.modalTitle=='新建检查项'){
                           this.iteminsert()
                        }else{
                          this.itemedio()
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //重置表单
            resetcourrse(formName) {
                this.$refs[formName].resetFields();
            },
            edio_item(id,index){
                this.wayshow=true;
                this.modalTitle='编辑检查项';
                this.itemid=id;
                this.itemForm={
                   name:this.itemtable[index].fCheckItemsContent,
                   device:[this.itemtable[index].fEquipmentTypeId],
                   remark:this.itemtable[index].fCheckItemsRemarks,
                }
            },
            /*查询设备大小类*/
            async allequtree() {
                const res = await itemService.allequtree();
                if (res.success) {
                    this.options=res.obj
                    this.options=JSON.parse(JSON.stringify(this.options).replace(/fTypeName/g, 'fName'))
                    console.log(JSON.stringify(this.options))
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*新建设备检查项*/
            async iteminsert() {
                const res = await itemService.iteminsert({
                     fCheckItemsContent:this.itemForm.name,
                     fCheckItemsRemarks:this.itemForm.remark,
                     fEquipmentTypeId:this.itemForm.device[this.itemForm.device.length-1],
                     fCheckItemsSort:1
                });
                if (res.success) {
                     this.$message({
                          message: "新建成功",
                          type: "success"
                     });
                     this.wayshow=false;
                     this.itemlist()
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*查询table数据*/
            async itemlist() {
                const res = await itemService.itemlist({
                   "pageCurrent":this.searchParam.currentPage,
                   "pageSize":this.searchParam.pageSize,
                   fCheckItemsContent:this.fName
                });
                if (res.success) {
                   this.itemtable=res.obj.items
                   this.searchParam.sum=res.obj.itemTotal
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //删除table某个数据
            remove_item(fid) {
                this.$confirm("是否删除该检查项?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.itemdelete(fid)
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            /*删除的api*/
            async itemdelete(id) {
                console.log(id)
                const res = await itemService.itemdelete(id);
                if (res.success) {
                    this.$message({
                         message: "删除成功",
                         type: "success"
                    });
                    this.itemlist();
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*编辑的api*/
            async itemedio() {
                const res = await itemService.itemedio({
                    fCheckItemsContent:this.itemForm.name,
                    fCheckItemsRemarks:this.itemForm.remark,
                    fEquipmentTypeId:this.itemForm.device[this.itemForm.device.length-1],
                    fCheckItemsSort:1,
                    fCheckItemsId:this.itemid
                });
                if (res.success) {
                    this.$message({
                         message: "修改成功",
                         type: "success"
                    });
                    this.wayshow=false;
                    this.itemlist();
                } else {
                  this.$message.warning(res.msg);
                }
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .check-item-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        .container {
            padding:15px 10px;
        }
    }
    .cardjq{
      position: relative;
    }
    .closejq{
      color: #F56C6C;
      position: absolute;
      top: 0.5rem;
      right:0.5rem;
      cursor: pointer;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .rule_pagination {
        margin-top: 1.25rem;
        text-align: right;
    }
    .check-item-page {
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
