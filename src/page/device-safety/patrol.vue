/*
* @Author: 杨高杰
* @Date:   2019-08-15
* @Description: '设备巡检'
*/
<template>
    <div class="patrol-page">
        <div class="container">
             <div v-if="patrolshow">
                  <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                      <el-form-item label="巡检任务">
                          <el-input placeholder="请输入巡检任务标题" clearable size="small" class="input-father" v-model="fName"></el-input>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary" @click="patroltables()"><i class="el-icon-search"></i>搜索</el-button>
                          <el-button type="primary" @click="addcheck()"><i class="el-icon-plus"></i>新建</el-button>
                      </el-form-item>
                  </el-form>
             </div>
             <div class="tab" v-if="patrolshow">
                  <el-table :data="patroltable" stripe class="defaultTab" highlight-current-row>
                      <el-table-column type="index" label="序号" width="60"></el-table-column>
                      <el-table-column prop="fPatrolTaskDate" label="巡检时间" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <span>{{moment(scope.row.fPatrolTaskDate).format('YYYY-MM-DD')}}</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskTitle" label="巡检标题" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="tEquipmentPatrolTaskUserList" label="巡检人" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <span  v-for="(item,index) in scope.row.tEquipmentPatrolTaskUserList" :key="index" style="margin-right: 0.5rem;">{{item.fUserName}}&nbsp;</span>
                          </template>
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskRecordNum" label="总巡检次数" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolRecordNum" label="当前巡检次数" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskState" label="任务状态" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <el-tag v-if="scope.row.fPatrolTaskState==0"  effect="dark">进行中</el-tag>
                              <el-tag v-if="scope.row.fPatrolTaskState==1" type='success'  effect="dark">已完成</el-tag>
                              <el-tag v-if="scope.row.fPatrolTaskState==2" type='danger'  effect="dark">未完成</el-tag>
                          </template>
                      </el-table-column>
                      <el-table-column label="操作" width="200">
                          <template slot-scope="scope">
                              <el-button type="text" @click="detail_patrol(scope.row.fPatrolTaskId)">&nbsp;详情</el-button>
                              <el-button type="text" @click="edio_patrol(scope.$index,scope.row.fPatrolTaskId)">&nbsp;编辑</el-button>
                              <el-button type="text" @click="delet_patrol(scope.row.fPatrolTaskId)">&nbsp;删除</el-button>
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
             <!-- 详情 -->
             <div class="patrol-detail-header" v-if="!patrolshow">
                 <el-page-header @back="goBack" content="巡检详情"></el-page-header>
             </div>
             <div class="patrol-detail-content" v-if="!patrolshow">
                <el-tabs type="border-card" @tab-click="leave">
                <el-tab-pane v-for="(val,index) in tasklist" :key="index" :label="`第${index+1}轮巡检`" >
                 <el-form class="demo-form-inline">
                     <el-form-item label="当前巡检状态:">
                         <el-tag v-if="val.fRecordType==0" effect="dark">未巡查</el-tag>
                         <el-tag v-if="val.fRecordType==1" effect="dark">巡查中</el-tag>
                         <el-tag v-if="val.fRecordType==2" effect="dark">巡查结束</el-tag>
                         <el-tag v-if="val.fRecordType==3" effect="dark">提前结束</el-tag>
                         <el-tag v-if="val.fRecordType==4" effect="dark">巡查未完成</el-tag>
                     </el-form-item>
                 </el-form>
                 <el-card class="box-card" style="margin-top: 15px;" v-for="(val,index) in equitem" :key="index" >
                       <div slot="header" class="clearfix">
                         <span><i class="el-icon-monitor" style="color: #409EFF;"></i>&nbsp;{{val.fEquipmentName}}</span>
                         <div style="float: right; padding: 3px 0;">
                             <span style="font-size: 14px;">&nbsp;&nbsp;巡查时间：{{val.fTime}}</span>
                             <span style="font-size: 14px;">&nbsp;&nbsp;巡查人： {{val.fUserName}}</span>
                         </div>
                       </div>
                       <div class="text item">
                           <el-row :gutter="20">
                              <el-col :span="6" v-for="(value,indexs) in val.tPatrolItemsRecords" :key="indexs">
                                   <div class="patrolitem" @click="item_detail(index,indexs)">
                                      <i v-if="value.fIsAbnormal" class="el-icon-circle-check" style="color: #67C23A;">{{value.fCheckItemsContent}}</i>
                                      <i v-if="!value.fIsAbnormal" class="el-icon-circle-close" style="color: #F56C6C;">{{value.fCheckItemsContent}}</i>
                                   </div>
                              </el-col>
                           </el-row>
                       </div>
                       </el-card>
                     </el-tab-pane>
                 </el-tabs>
             </div>
             <!-- 弹层 -->
             <!-- 1.侧滑弹层 -->
             <TheDialog :modal='divisionModal' :modalTitle="modalTitle" @closeModal="divisionModal=false">
                 <div slot="custom-modal-content">
                     <el-form :model="patrolForm" :rules="patrolFormRules" ref="patrolForm" label-width="80px">
                          <el-form-item label="开始时间" prop="time">
                                  <el-date-picker
                                       style="width: 40%;"
                                       v-model="patrolForm.time"
                                       type="date"
                                       placeholder="选择日期"
                                       :picker-options="pickerOptions"
                                        >
                                  </el-date-picker>
                          </el-form-item>
                          <el-form-item label="巡检人员" prop="people">
                                <el-select v-model="patrolForm.people" value-key="fId"  multiple filterable placeholder="请选择巡检人员" style="width: 40%;">
                                    <el-option
                                      v-for="item in peoples"
                                      :key="item.fId"
                                      :label="item.fUserName"
                                      :value="item.fId">
                                    </el-option>
                                </el-select>
                          </el-form-item>
                          <el-form-item label="巡检路线" prop="device">
                                 <el-select v-model="patrolForm.device" placeholder="请选择巡检路线" style="width: 40%;">
                                    <el-option
                                      v-for="item in devices"
                                      :key="item.fPatrolRouteId"
                                      :label="item.fPatrolRouteName"
                                      :value="item.fPatrolRouteId">
                                    </el-option>
                                  </el-select>
                          </el-form-item>
                          <el-form-item label="巡检次数" prop="nums">
                                 <el-input
                                     style="width: 40%;"
                                     type="number"
                                     placeholder="请输入规则次数"
                                     v-model="patrolForm.nums"
                                     autocomplete="off"
                                 ></el-input>
                          </el-form-item>
                          <el-form-item>
                              <el-button type="primary" :loading="loading" @click="submitForm('patrolForm')" size="small">确定</el-button>
                              <el-button @click="resetForm('patrolForm')" size="small">重置</el-button>
                          </el-form-item>
                     </el-form>
                 </div>
             </TheDialog>
             <el-dialog title="巡检内容" :visible.sync="item_detailshow" width="600px">
                  <el-form class="demo-form-inline">
                      <el-form-item label="巡检时间:">
                           {{patroldetail.time}}
                      </el-form-item>
                      <el-form-item label="巡检人:">
                           {{patroldetail.people}}
                      </el-form-item>
                      <el-form-item label="巡检机器:">
                           {{patroldetail.device}}
                      </el-form-item>
                      <el-form-item label="巡检项:">
                           {{patroldetail.item}}
                      </el-form-item>
                      <el-form-item label="设备状态:">
                          <el-tag v-if="this.patroldetail.stage"  type="success" effect="dark">正常</el-tag>
                          <el-tag v-if="!this.patroldetail.stage" type="danger" effect="dark">异常</el-tag>
                      </el-form-item>
                      <!-- <el-form-item label="异常详情:">
                          <div class="warn_photo"><img src="../../../static/img/logo.png" /></div>
                          <div class="warn_photo"><img src="../../../static/img/logo.png" /></div>
                          <div class="warn_photo"><img src="../../../static/img/logo.png" /></div>
                          <div class="warn_photo"><img src="../../../static/img/logo.png" /></div>
                      </el-form-item> -->
                      <el-form-item label="异常备注:">
                            {{patroldetail.remarks ||'---'}}
                      </el-form-item>
                  </el-form>
             </el-dialog>
        </div>
    </div>
</template>
<script>
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { patrolService } from '@/api/device-safety'; //引入api
    import { common } from "@/utils/common"; // common
    import moment from 'moment';
    const cityOptions = ['轴承检查1', '轴承检查2', '轴承检查3', '轴承检查4'];
    export default {
        data() {
            //校验正数
            let validateInt = (rule, value, callback) => {
                if (!value) {
                    callback();
                    return;
                }
                let reg = /^[1-9][0-9]*$/;
                if (!reg.test(value)) {
                    callback(new Error("请填写正确的数值(大于0的整数值)"));
                } else {
                    callback();
                }
            };
            return {
                moment:moment,
                fName: '', // 名称
                loading: false,
                divisionModal:false,//编辑和新建巡检弹框
                modalTitle:'',//弹框标题
                patrolshow:true,
                item_detailshow:false,//检查项详情显隐
                patrolid:'',//巡检任务id
                tasklist:[],//巡检轮
                PatrolRecordId:'',//巡检轮id
                equitem:[],//巡检轮机器list
                patrolForm:{
                   time:'',//巡查时间
                   people:[],//巡查人员
                   device:'',//区域和设备
                   nums:'',//巡检次数
                },
                peoples: [],
                patroldetail:{//详情
                  time:'',
                  people:'',
                  device:'',
                  item:'',//检查项
                  stage:'',//状态
                  remarks:'',//备注
                },
                 //设定时间选择器
                pickerOptions: {
                   disabledDate(time) {
                   return Date.now() > time.getTime()+3600 * 1000 * 24;
                   }
                },
                //巡检的表格数据
                patroltable:[],
                checkAll: false,
                cities:cityOptions,
                isIndeterminate: true,
                patrolFormRules:{//表单校验
                    time: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    people: [
                        { required: true, message: '请选择巡检人员', trigger: 'change' }
                    ],
                    device:[
                        { required: true, message: '请选择巡检路线', trigger: 'change' }
                    ],
                    nums: [
                        {
                            required: true,
                            message: "请输入巡检次数",
                            trigger: "blur"
                        },
                        {
                            validator: validateInt,
                            trigger: "blur"
                        }
                    ]
                },
                searchParam: {
                    //分页相关
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                devices: [{
                   value: '1',
                   label: '一条创建的路线'
                   }, {
                   value: '2',
                   label: '二条创建的路线'
                   }],

            }
        },
        components: {
            TheDialog,
        },
        mounted() {
          this.peopleall();
          this.wayall();
          this.patroltables()
        },
        methods:{
            //提交和重置表单
            submitForm(formName) {
                  this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if(this.modalTitle=='新建设备巡检'){
                           this.patroladd()
                        }else{
                           this.patroledio()
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
            leave (tab, event) {
               console.log(tab.index, event);
               this.PatrolRecordId=this.tasklist[tab.index].fPatrolRecordId
               this.equipmentCheckItem()
               console.log(this.PatrolRecordId)
            },
            addcheck(){
              this.divisionModal=true;
              this.modalTitle='新建设备巡检';
              this.patrolForm={
                 time:'',//巡查时间
                 people:[],//巡查人员
                 device:'',//区域和设备
                 nums:'',//巡检次数
              }
            },
            deviceChange(value){
              console.log(value);
            },

            //分页操作
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.patroltables()
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.patroltables()
            },
            //详情返回
            goBack(){
               this.patrolshow=!this.patrolshow
            },
            //点击详情
            detail_patrol(id){
               this.patrolshow=!this.patrolshow;
               this.patroltask(id)
            },
            item_detail(id,ids){
               console.log(id,ids)
               this.patroldetail.time=this.equitem[id].fTime
               this.patroldetail.people=this.equitem[id].fUserName
               this.patroldetail.device=this.equitem[id].fEquipmentName
               this.patroldetail.item=this.equitem[id].tPatrolItemsRecords[ids].fCheckItemsContent
               this.patroldetail.stage=this.equitem[id].tPatrolItemsRecords[ids].fIsAbnormal
               this.patroldetail.remarks=this.equitem[id].tPatrolItemsRecords[ids].fPatrolItemsDescribe
               this.item_detailshow=true
            },
            //编辑巡检任务
            edio_patrol(index,id){
                this.divisionModal=true;
                this.modalTitle='编辑设备巡检';
                this.patrolid=id;
                let plist=[];
                for (let i=0;i<this.patroltable[index].tEquipmentPatrolTaskUserList.length;i++) {
                    plist.push(this.patroltable[index].tEquipmentPatrolTaskUserList[i].fUserId)
                }
                this.patrolForm={
                   time:this.patroltable[index].fPatrolTaskDate ,//巡查时间
                   people:plist,//巡查人员
                   device:this.patroltable[index].fPatrolRouteId,//巡检路线
                   nums:this.patroltable[index].fPatrolTaskRecordNum,//巡检次数
                }
            },
            //删除巡检任务
            delet_patrol(id){
                this.$confirm("是否删除该条巡检任务?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                .then(() => {
                    this.patroldelete(id)
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
            },
            //查询全部人员
            async peopleall() {
                const res = await patrolService.peopleall();
                if (res.success) {
                    this.peoples=res.obj
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //查询全部巡检路线
            async wayall() {
                const res = await patrolService.wayall();
                if (res.success) {
                    this.devices=res.obj
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //提交巡检任务
            async patroladd() {
                if (this.loading) return
                this.loading = true;
                if (this.patrolForm.time != '') {
                    this.patrolForm.time = common.YMDHMSParseTime(this.patrolForm.time);
                }
                const res = await patrolService.patroladd({
                      fPatrolTaskDate:this.patrolForm.time,
                      fPatrolTaskRecordNum:this.patrolForm.nums,
                      fPatrolRouteId:this.patrolForm.device,
                      fUserIdList:this.patrolForm.people,
                });
                this.loading = false;
                if (res.success) {
                    this.devices=res.obj
                    this.divisionModal=false;
                    this.$message({
                        message: "新增成功",
                        type: "success"
                    });
                    this.patroltables()
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //查询巡检任务表格
            async patroltables() {
                const res = await patrolService.patroltable({
                    "pageCurrent":this.searchParam.currentPage,
                    "pageSize":this.searchParam.pageSize,
                     fPatrolTaskTitle:this.fName
                });
                if (res.success) {
                    this.patroltable=res.obj.items
                    this.searchParam.sum=res.obj.itemTotal
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //删除的api
            async patroldelete(id) {
                const res = await patrolService.patroldelete(id);
                if (res.success) {
                     this.$message({
                         message: "删除成功",
                         type: "success"
                     });
                     this.patroltables();
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //编辑的api
            async patroledio() {
                if (this.loading) return
                this.loading = true;
                if (this.patrolForm.time != '') {
                    this.patrolForm.time = common.YMDHMSParseTime(this.patrolForm.time);
                }
                this.loading = false;
                const res = await patrolService.patroledio({
                      fPatrolTaskId:this.patrolid,
                      fPatrolTaskDate:this.patrolForm.time,
                      fPatrolTaskRecordNum:this.patrolForm.nums,
                      fPatrolRouteId:this.patrolForm.device,
                      fUserIdList:this.patrolForm.people,
                });
                if (res.success) {
                    this.devices=res.obj
                    this.divisionModal=false;
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.patroltables()
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //查询对应的任务
            async patroltask(id) {
                const res = await patrolService.patroltask({
                    fPatrolTaskId:id
                });
                if (res.success) {
                    this.tasklist=res.obj
                    this.PatrolRecordId=res.obj[0].fPatrolRecordId
                    this.equipmentCheckItem()
                } else {
                  this.$message.warning(res.msg);
                }
            },
            //查询所有设备和检查项
            async equipmentCheckItem() {
                const res = await patrolService.equipmentCheckItem({
                    fPatrolRecordId:this.PatrolRecordId
                });
                if (res.success) {
                   this.equitem=res.obj
                } else {
                  this.$message.warning(res.msg);
                }
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

    .patrol-detail-content{
        margin-top: 15px;
        max-height: calc(100vh - 220px)!important;
        overflow-y: auto!important;
    }
    .patrol-card {
        width: 480px;
        margin: 0 auto;
    }
    .patrolitem{
      border:1px solid #EBEEF5;
      border-radius: 1.875rem;
      height: 1.875rem;
      line-height: 1.875rem;
      text-align: center;
      cursor:pointer;
      margin-bottom: 15px;
    }
    .warn_photo{
      height: 6.25rem;
      width: 6.25rem;
      margin-left: 0.9375rem;
      float: left;
    }
    .warn_photo img{
      width: 100%;
      height: 100%;
    }
</style>
