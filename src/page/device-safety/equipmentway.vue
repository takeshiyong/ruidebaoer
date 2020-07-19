 /*
 * @Author: 杨高杰
 * @Date:   2019-08-20
 * @Description: '巡检路线'
 */
 <template>
    <div class="check-item-page">
         <div class="container">
              <div>
                   <el-form :inline="true" class="demo-form-inline search-form" label-width="100px">
                       <el-form-item label="巡检路线名">
                           <el-input placeholder="请输入巡检路线名" clearable size="small" class="input-father" v-model="fName"></el-input>
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary" @click="findway"><i class="el-icon-search"></i>搜索</el-button>
                           <el-button type="primary" @click="addway"><i class="el-icon-plus"></i>新建</el-button>
                       </el-form-item>
                   </el-form>
              </div>
              <div class="tab">
                   <el-table :data="waytable" stripe class="defaultTab" highlight-current-row>
                       <el-table-column type="index" label="序号" width="60"></el-table-column>
                       <el-table-column prop="fPatrolRouteName" label="路线名称" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column prop="fPatrolRouteRemarks" label="路线备注" min-width="80" :show-overflow-tooltip="true">
                       </el-table-column>
                       <el-table-column label="操作" width="200">
                           <template slot-scope="scope">
                               <el-button type="text" @click="edio_item(scope.row.fPatrolRouteId)">&nbsp;编辑</el-button>
                               <el-button type="text" @click="remove_item(scope.row.fPatrolRouteId)">&nbsp;删除</el-button>
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
                      <el-form :model="wayForm"  ref="wayForm" label-width="100px">
                           <el-form-item label="路线名称" prop="name" :rules="{ required: true, message: '请输入路线名称 ', trigger: 'blur' }">
                                <el-input
                                    style="width: 40%;"
                                    type="text"
                                    placeholder="请输入路线名称"
                                    v-model="wayForm.name"
                                    autocomplete="off"
                                ></el-input>
                           </el-form-item>
                           <el-form-item label="路线备注" prop="remark" :rules="{ required: true, message: '请输入路线备注 ', trigger: 'blur' }">
                                <el-input
                                    style="width: 40%;"
                                    type="text"
                                    placeholder="请输入路线备注"
                                    v-model="wayForm.remark"
                                    autocomplete="off"
                                ></el-input>
                           </el-form-item>
                           <el-form-item label="巡检区域">
                                 <el-select v-model="wayForm.peace" placeholder="请选择巡检区域" style="width: 40%;" @change="selpeace">
                                     <el-option
                                       v-for="item in peace"
                                       :key="item.value"
                                       :label="item.fAreaName"
                                       :value="item.fId">
                                     </el-option>
                                 </el-select>
                           </el-form-item>
                           <el-form-item label="巡检机器" prop="device">
                                 <el-select v-model="wayForm.device" ref="deviceinfo"  placeholder="请选择巡检机器" style="width: 40%;">
                                     <el-option
                                       v-for="item in devices"
                                       :key="item.value"
                                       :label="item.fEquipmentName"
                                       :value="item.fId">
                                     </el-option>
                                 </el-select>
                                 <el-button type="primary" size="small" @click="addEquipmens">添加</el-button>
                           </el-form-item>
                           <draggable v-model="wayForm.itemarr" :move="getdata" @update="datadragEnd">
                               <el-form-item v-for="(val,i) in wayForm.itemarr" :key='i' :label="(i+1)+':'+val.name"  :prop="'itemarr.' + i + '.item'" :rules="{
                                    required: true, message: '至少选择一项检查项',  trigger: 'change'
                                }">
                                   <el-card class="box-card cardjq">
                                         <i class="el-icon-close closejq" @click="removejq(i)"></i>
                                         <el-checkbox-group v-model="val.item" @change="waycheck(val.item)">
                                             <el-checkbox  :checked="checkeds"  v-for="(value,index) in val.devicearr" :key="index" :label="value.fCheckItemsId" name="item">{{value.fCheckItemsContent}}</el-checkbox>
                                         </el-checkbox-group>
                                         <div v-if="val.devicearr.length == 0"><span>该设备暂无巡检项</span></div>
                                   </el-card>
                               </el-form-item>
                               
                           </draggable>
                           <el-form-item>
                               <el-button type="primary" @click="submitForm('wayForm')" size="small">确定</el-button>
                               <el-button @click="resetForm('wayForm')" size="small">重置</el-button>
                           </el-form-item>
                      </el-form>
                  </div>
              </TheDialog>
         </div>
    </div>
</template>
<script>
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import draggable from 'vuedraggable'//拖拽组件
    import { wayService } from '@/api/device-safety'; //引入api
    export default {
        data() {
            return {
                fName:'', // 名称
                wayshow:false,//编辑和新建线路的弹窗
                modalTitle:'',//弹窗标题
                equlist:[],
                checkeds:false,//控制全选
                waytable:[{
                  name:'',
                  device:[],
                  remark:'',
                }],
                searchParam: {
                    //分页相关
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                wayForm:{//新建线路
                   name:'',
                   device:[],
                   remark:'',
                   peace:'',
                   itemarr:[]
                },

                  devicearr:[{
                     id:'1',
                     names:'轴承检查'
                   },{
                     id:'2',
                     names:'皮带检查'
                  }],
                peace: [],
                devices: [{
                   value: '1',
                   label: '皮带机'
                   }, {
                   value: '2',
                   label: '破碎机'
                }],
                wayFormRules:[{}],
                //ref获取name名
                deviceref:'',
                //后台接口需要的数据格式
                insertway:[],
                lxid:'',//巡检路线id
            }
        },
        components: {
            TheDialog,draggable
        },
        mounted() {
            this.waylist();
            this.allarea();
        },
        methods:{
            //新建路线
            addway(){
                this.wayshow=true;
                this.checkeds=true;
                this.wayForm={
                   name:'',
                   device:[],
                   remark:'',
                   peace:'',
                   itemarr:[]
                };
                this.modalTitle='新建巡检路线'
            },
            //分页操作
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.waylist();
            },
            //搜索
            findway(){
                this.waylist();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.waylist();
            },
            waycheck(val){
              console.log(val)
            },
            //区域发生改变
            selpeace(){
                this.selectarea();
                this.wayForm.itemarr=[];
                this.wayForm.device=''
            },
            //重置表单
            resetForm() {
               this.wayForm={
                  name:'',
                  device:'',
                  remark:'',
                  peace:'',
                  itemarr:[]
               };
            },
            //添加机器
            addEquipmens(){
               this.deviceref=this.$refs.deviceinfo.$refs.reference.value
               if(this.wayForm.device==""||this.wayForm.device==null){
                  this.$message.error('请选择机器');
               }else{
                 this.addEquipmen()
               }
            },
            //根据下标删除
            removejq(i){
              this.wayForm.itemarr.splice(i,1);
            },
            //编辑
            edio_item(fid){
              this.modalTitle='编辑巡检路线'
              this.checkeds=false;
              this.lxid=fid;
              this.edioEquipment(fid)
            },
            //拖动
            getdata (evt) {
            },
            datadragEnd (evt) {
                console.log('拖动前的索引 :' + evt.oldIndex)
                console.log('拖动后的索引 :' + evt.newIndex)
                console.log(JSON.stringify(this.wayForm.itemarr))
            },
            /**
             * 提交排序好的巡检路线
             * @return {Array}   查询的结果
             * 处理接口返回的数据，拖拽后排序值使用数据本身index
             */
            submitForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.insertway=this.wayForm.itemarr
                        //删除和替换键值对使数据统一
                        this.insertway=JSON.parse(JSON.stringify(this.insertway).replace(/item/g, 'fCheckItemsIdList'))
                        for (let i=0;i<this.insertway.length;i++) {
                            delete this.insertway[i].name
                            delete this.insertway[i].devicearr
                        }
                        //给后台追加拖拽后的排序值
                        this.insertway = this.insertway.map((data,index)=>({...data, fEquipmentSort: index}));
                        //请求接口
                        if(this.modalTitle=='新建巡检路线'){
                            this.addequway();
                        }else{
                            this.wayedio()
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //删除table某个数据
            remove_item(fid) {
                this.$confirm("是否删除该路线?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.deleteway(fid)
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            /*分页查询所有巡检路线*/
            async waylist() {
                const res = await wayService.waylist({
                    "pageCurrent":this.searchParam.currentPage,
                    "pageSize":this.searchParam.pageSize,
                    "fPatrolRouteName":this.fName
                });
                if (res.success) {
                   this.waytable=res.obj.items
                   this.searchParam.sum=res.obj.itemTotal
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*查询所有区域*/
            async allarea() {
                const res = await wayService.allarea();
                if (res.success) {
                     this.peace=res.obj
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*查询区域下对应设备*/
            async selectarea() {
                const res = await wayService.selectarea(this.wayForm.peace);
                if (res.success) {
                     this.devices=res.obj
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*查询区域所有设备*/
            async allareaequ() {
                const res = await wayService.allareaequ();
                if (res.success) {
                     this.devices=res.obj.equipmentList
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*添加机器且查询检查项*/
            async addEquipmen() {
                const res = await wayService.addEquipmen(this.wayForm.device);
                if (res.success) {
                    let list={fEquipmentId:this.wayForm.device,name:this.deviceref,
                    item:[],devicearr:res.obj}
                    this.wayForm.itemarr.push(list);
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //新建巡检路线
            async addequway() {
                const res = await wayService.addway({
                  fPatrolRouteName:this.wayForm.name,
                  fPatrolRouteRemarks:this.wayForm.remark,
                  routeEquipmentList:this.insertway,
                  fRegionId:this.wayForm.peace,
                  fPatrolRouteId:""
                });
                if (res.success) {
                     this.$message({
                          message: "新建成功",
                          type: "success"
                     });
                     this.wayshow=false;
                     this.waylist();
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*删除某个数据*/
            async deleteway(id) {
                const res = await wayService.deleteway(id);
                if (res.success) {
                    this.$message({
                         message: "删除成功",
                         type: "success"
                    });
                    this.waylist();
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*查看编辑项*/
            async edioEquipment(id) {
                const res = await wayService.edioEquipment(id);
                if (res.success) {
                    this.wayshow=true;
                    this.wayForm={//新建线路
                       name:res.obj.fPatrolRouteName,
                       device:[],
                       remark:res.obj.fPatrolRouteRemarks,
                       peace:res.obj.fRegionId,
                       itemarr:res.obj.routeEquipmentList
                    }
                    this.wayForm.itemarr = this.wayForm.itemarr.map((data)=>{
                      return {
                        ...data,
                        devicearr:data.fAllCheckItemsList,
                        name:data.fEquipmentName,
                        item:data.fSelectItemsIdList
                      }
                    });
                } else {
                  this.$message.warning(res.msg);
                }
            },
            /*点击编辑*/
            async wayedio() {
                const res = await wayService.wayedio({
                     fPatrolRouteName:this.wayForm.name,
                     fPatrolRouteRemarks:this.wayForm.remark,
                     routeEquipmentList:this.insertway,
                     fRegionId:this.wayForm.peace,
                     fPatrolRouteId:this.lxid
                });
                if (res.success) {
                    this.$message({
                         message: "编辑成功",
                         type: "success"
                    });
                    this.wayshow=false;
                    this.waylist();
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
