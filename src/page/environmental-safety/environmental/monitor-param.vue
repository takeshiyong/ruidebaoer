/*
 * @Author: 赵磊
 * @Date:   2019-08-13
 * @Description: '监测点参数'
 */
<template>
    <div class="monitor-param-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="condition.nameKeyWord" placeholder="请输入名称" clearable class="input-father"/>
                    </el-form-item>
                    <el-form-item label="监测点">
                        <el-select size="medium" v-model="condition.monitorId" filterable placeholder="请选择关联监测点" clearable class="input-father">
                            <el-option
                            v-for="item in monitors"
                            :key="item.fId"
                            :label="item.fName"
                            :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="getMonitorParams"><i class="el-icon-search" style="marginRight: 5px"></i>搜索</el-button>
                        <el-button type="primary"  @click="insertMonitorParam" >
                            <i class="el-icon-plus" style="marginRight: 5px" ></i>新建
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="monitorParams" stripe class="defaultTab paramTab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60" :index="indexMethod"></el-table-column>
                    <el-table-column prop="fParamName" label="名称" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fParamNum" label="编号" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="monitorName" label="监测点" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fUnit" label="单位" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fUpperLimit" label="上限" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="是否可用" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.fIsEnable == 1 ? '是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否屏蔽" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.fIsShield == 1 ? '是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateMonitor(scope.row)" >&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteMonitor(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="handlerSizeChange" @current-change="handlerPageChange" :current-page="condition.currentPage"
                layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes"
                :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>

        <TheDialog :modal='monitorModal' :modalTitle="modalTitle" @closeModal="closeModal('monitorParamForm',monitorModal)">
            <div slot="custom-modal-content">
                <el-form :model="monitorParamForm" :rules="monitorParamFormRules" ref="monitorParamForm" label-width="90px" v-if="modalTitle == '新建环保监测点参数' || modalTitle == '编辑环保监测点参数'">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="是否启用" class="param-switch">
                                <el-switch
                                  v-model="monitorParamForm.fIsEnable"
                                  style="display: block;"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  active-text="启用"
                                  inactive-text="禁用">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="屏蔽报警" class="param-switch">
                                <el-switch
                                  v-model="monitorParamForm.fIsShield"
                                  style="display: block;"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  active-text="是"
                                  inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="名　　称" prop="fParamName">
                                <el-input size="small" placeholder="请填写参数名称" :maxlength="50"  v-model="monitorParamForm.fParamName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="编　　号" prop="fParamNum">
                                <el-input size="small" placeholder="请填写参数编号" :maxlength="50"  v-model="monitorParamForm.fParamNum" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="监 测 点" prop="fMonitorId">
                                <el-select size="small" v-model="monitorParamForm.fMonitorId" filterable placeholder="请选择关联监测点" style="width:100%;">
                                    <el-option
                                    v-for="item in monitors"
                                    :key="item.fId"
                                    :label="item.fName"
                                    :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="数据类型" prop="fDataType">
                                <el-input size="small" placeholder="请填写数据类型" :maxlength="10"  v-model="monitorParamForm.fDataType" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上　　限" prop="fUpperLimit">
                                <el-input size="small" placeholder="请填写参数上限" :maxlength="20"  v-model="monitorParamForm.fUpperLimit" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="单　　位" prop="fUnit">
                                <el-input size="small" placeholder="请填写参数编号" :maxlength="50"  v-model="monitorParamForm.fUnit" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('monitorParamForm')" size="small">确定
                        </el-button>
                        <el-button @click="resetForm('monitorParamForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { StartegyService } from '@/api/personal-info' // api
    import { MonitorService, MonitorParamService } from '@/api/environmental-safety'// 环保监测
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data(){
            var FParamName = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('参数名称不能为空'));
                } else {
                    callback();
                }
            };
            var FMonitorId = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('关联监测点不能为空'));
                } else {
                    callback();
                }
            };
            var FDataType = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('数据类型不能为空'));
                } else {
                    callback();
                }
            };
            var FIsEnable = (rule, value, callback) => {
                if (value === null) {
                    callback(new Error('是否可用不能为空'));
                } else {
                    callback();
                }
            };
            var FIsShield = (rule, value, callback) => {
                if (value === null) {
                    callback(new Error('是否屏蔽报警不能为空'));
                } else {
                    callback();
                }
            };
            return {
                calPageSize: 1,
                calPageCurrent: 1,
                // 分页条件
                condition:{
                    currentPage: 1, // 当前页
                    monitorId: '',// 监测点id
                    nameKeyWord: '', // 名称关键字
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                monitors:[],// 环保监测点
                monitorParams: [],// 环保监测点参数
                monitorModal: false,  // 侧滑弹层显示与否状态
                modalTitle: '',   // 弹层标题
                monitorParamInfor: {
                    fParamName: '',// 参数名称
                    fMonitorId: '',// 监测点id
                    fParamNum: '',// 参数编号
                    fUnit: '',// 参数单位
                    fUpperLimit: '',// 参数上限
                    fLowerLimit: '',// 参数下限
                    fDataType: '',// 参数类型
                    fIsEnable: true,//是否可用
                    fIsShield: false, //是否屏蔽
                },
                monitorParamForm:{

                },
                deps: [], // 部门集合
                depProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
                dutyUsers: [], // 使用人集合
                deptId: '',// 报警推送人所在部门id
                // 校验规则
                monitorParamFormRules: {
                    fParamName: [
                        { required: true, validator: FParamName,}
                    ],
                    fMonitorId: [
                        { required: true, validator: FMonitorId,}
                    ],
                    fDataType: [
                        { required: true, validator: FDataType,}
                    ],
                    fIsEnable: [
                        { required: true, validator: FIsEnable,}
                    ],
                    fIsShield: [
                        { required: true, validator: FIsShield,}
                    ]
                },
            }
        },
        components:{
            TheDialog
        },
        mounted: function(){
            this.getMonitors();// 获取监测点
            this.getMonitorParams();// 获取监测点参数
        },
        methods:{
            /**
             * 1.访问接口方法
             */
            /**
             * 1.0获取所有监测点
             */
            async getMonitors(){
                let res = await MonitorService.selectAll();
                if (res.success) {
                    if (res.obj != null){
                        this.monitors = res.obj;
                    } else {
                        this.$message.warning(res.msg);
                        this.monitors = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.monitors = [];
                }
            },
            /**
             * 1.1获取环保监测点参数
             */
            async getMonitorParams(){
                let res = await MonitorParamService.selectMonitorParamsByPage(this.condition);
                if (res.success) {
                    if (res.obj != null){
                        this.condition.sum = res.obj.itemTotal;
                        if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length >0) {
                            this.monitorParams = res.obj.items;
                            this.calPageSize = res.obj.pageSize;
                            this.calPageCurrent = res.obj.pageCurrent;
                        } else {
                            this.monitorParams = [];
                        }
                    } else {
                        this.$message.warning(res.msg);
                        this.monitorParams = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.monitorParams = [];
                }
            },
            /**
             * 1.2 新增监测点
             */
            async insertMonitorParamSave(){
                let res = await MonitorParamService.addMonitorParam(this.monitorParamForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('monitorParamForm',this.monitorModal);
                    this.getMonitorParams();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.3修改监测点
             */
            async updateMonitorSave(){
                let res = await MonitorParamService.updateMonitorParam(this.monitorParamForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('monitorParamForm',this.monitorModal);
                    this.getMonitorParams();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.4 删除
             */
            deleteMonitor(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前监测点参数，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    var fIdList = [];
                    fIdList.push(row.fId);
                    let res = await MonitorParamService.deleteMonitorParamByBatch(fIdList);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.getMonitorParams();
                        } else{
                            this.$message.warning(res.msg);
                        };
                }).catch(() => {

                });
            },
            /**
             * 2. 逻辑控制方法
             */
            /**
             * 2.1列表序号
             */
            indexMethod(index){
                return index + this.calPageSize*(this.calPageCurrent-1)+1;
            },
            //
            /**
             * 2.2改变分页大小
             */
            handlerSizeChange(val){
                this.condition.pageSize = val;
                this.getMonitorParams();
            },
            /**
             * 2.3 改变当前页
             */
            handlerPageChange(val){
                this.condition.currentPage = val;
                this.getMonitorParams();
            },
            /**
             * 2.4 新建环保监测点参数
             */
            insertMonitorParam(){
                // 初始化弹层
                this.modalTitle = '新建环保监测点参数';
                this.monitorModal = true;
                // 清空form表单
                this.monitorParamInfor.fParamName= '';
                this.monitorParamInfor.fMonitorId= '';
                this.monitorParamInfor.fParamNum= '';
                this.monitorParamInfor.fUnit= '';
                this.monitorParamInfor.fUpperLimit= '';
                this.monitorParamInfor.fLowerLimit= '';
                this.monitorParamInfor.fDataType= '';
                this.monitorParamInfor.fIsEnable= true;
                this.monitorParamInfor.fIsShield= false;
                this.monitorParamForm = this.monitorParamInfor;
            },
            /**
             * 2.5修改监测点参数
             */
            async updateMonitor(row){
                // 查询人员信息来获得部门id(未存部门id)
                if(row.tEnvAlarmPersonList != null && row.tEnvAlarmPersonList.length != 0){
                    const deptId = await this.getUserInfoByUserId(row.tEnvAlarmPersonList[0].fEmployeeId)
                    this.getDutyUsers(deptId, 'change');// 查询部门下人员
                    row.deptIds = [];
                    let res = await StartegyService.getParentIds(deptId);
                    if (res.success){
                        row.deptIds = res.obj;
                    }else{
                        row.deptIds = [];
                    }
                }
                var cloneRow = {};
                cloneRow = JSON.parse(JSON.stringify(row))
                var personArray = cloneRow.tEnvAlarmPersonList;
                if(personArray != null && personArray.length != 0){
                    for(var person of personArray){
                        if(typeof(person) == 'object'){
                            var alarmPerson = person.fEmployeeId;
                            personArray.splice(personArray.indexOf(person),1,alarmPerson);
                        }
                    }
                }
                this.monitorParamForm = cloneRow;
                // 初始化
                this.$nextTick(()=>{
                    this.modalTitle = "编辑环保监测点参数";
                    this.monitorModal = true;
                })
            },
            /**
             * 2.6 改变部门
             */
            handleChangeDept(value) {
                if(value == ''){
                    this.dutyUsers = [];
                    this.monitorParamForm.tEnvAlarmPersonList = [];
                    return;
                }
                this.monitorParamForm.tEnvAlarmPersonList = [];
                this.getDutyUsers(value[value.length-1], 'change');
            },
            /**
             * 2.7 重置表单
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 2.8 弹层保存
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == "新建环保监测点参数") {
                            this.insertMonitorParamSave();
                        }
                        if (this.modalTitle == "编辑环保监测点参数") {
                            this.updateMonitorSave();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 2.9 关闭弹层
             */
            closeModal(form, modalStatus){
                this.monitorModal = false;
                this.$refs[form].resetFields();
                this.modalTitle = "";
            }
        },
        watch:{

        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .monitor-param-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .users-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 260px)!important;
                    overflow-y: auto!important;
                }
            }
        }
        .param-switch {
            .el-switch {
                .el-switch__label * {
                    font-size: 14px!important;
                }
            }
        }
    }
</style>

<style>
    .param-switch .el-switch {
        line-height: 25px!important;
    }
</style>

