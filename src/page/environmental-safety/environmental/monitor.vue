/*
 * @Author: 赵磊
 * @Date:   2019-08-13
 * @Description: '监测点'
 */
<template>
    <div class="monitor-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="condition.nameKeyWord" placeholder="请输入名称" clearable class="input-father"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="getMonitors">
                            <i class="el-icon-search" style="marginRight: 5px"></i>
                            搜索
                        </el-button>
                        <el-button type="primary"  @click="insertMonitor">
                            <i class="el-icon-plus" style="marginRight: 5px"></i>
                            新建
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="monitors" stripe class="defaultTab monitorTab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60" :index="indexMethod"></el-table-column>
                    <el-table-column prop="fName" label="名称" min-width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fCreateTime" label="创建时间" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="content">
                            <span>{{content.row.fCreateTime == null ? '--':content.row.fCreateTime}}</span>
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
        <!-- 弹层 -->
        <!-- 侧滑弹层 -->
        <TheDialog :modal='monitorModal' :modalTitle="modalTitle" @closeModal="closeModal('monitorForm',monitorModal)">
            <div slot="custom-modal-content">
                <el-form :model="monitorForm" :rules="monitorFormRules" ref="monitorForm" label-width="90px" v-if="modalTitle == '新建环保监测点' || modalTitle == '编辑环保监测点'">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="名　　称" prop="fName">
                                <el-input size="small" placeholder="请填写环保监测点名称" :maxlength="60"  v-model="monitorForm.fName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="部　　门"  prop="deptIds">
                                <el-cascader v-model="monitorForm.deptIds" size="small" style="width:100%;"
                                   :options="deps"
                                   :props="depProps"
                                   @change="handleChangeDept"  placeholder="请选择部门" clearable change-on-select>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="推 送 人" prop="tEnvAlarmPersonList">
                                <el-select size="small" v-model="monitorForm.tEnvAlarmPersonList" filterable multiple placeholder="请选择报警推送人" style="width:100%;">
                                    <el-option
                                    v-for="item in dutyUsers"
                                    :key="item.fId"
                                    :label="item.fUserName"
                                    :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('monitorForm')" size="small">
                            确定
                        </el-button>
                        <el-button @click="resetForm('monitorForm')" size="small">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { StartegyService } from '@/api/personal-info' // api
    import { MonitorService } from '@/api/environmental-safety' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data(){
            var FName = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('监测点名称不能为空'));
                }else if(value.length > 30){
                    callback(new Error('监测点名称不能大于30个字符'));
                }else {
                    callback();
                }
            };
            return {
                calPageSize: 1,
                calPageCurrent: 1,
                // 分页条件
                condition:{
                    currentPage: 1, // 当前页
                    nameKeyWord: '', // 名称关键字
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                monitors:[],// 环保监测点
                monitorModal: false,  // 侧滑弹层显示与否状态
                modalTitle: '',   // 弹层标题
                monitorInfor: {
                    fName: '',// 监测点名称
                    deptIds: [],// 部门
                    tEnvAlarmPersonList: [],// 报警通知人
                },
                monitorForm:{

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
                monitorFormRules: {
                    fName: [
                        { required: true, validator: FName,}
                    ]
                },
            }
        },
        components:{
            TheDialog
        },
        mounted: function(){
            this.getMonitors();// 获取监测点
            this.initDep();// 获取部门结构
        },
        methods:{
            /**
             * 1.访问接口方法
             */
            /**
             * 1.1获取环保监测点
             * @return {Array}   查询的结果
             */
            async getMonitors(){
                let res = await MonitorService.selectMonitorsByPage(this.condition);
                if (res.success) {
                    if (res.obj != null){
                        this.condition.sum = res.obj.itemTotal;
                        if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length >0) {
                            this.monitors = res.obj.items;
                            this.calPageSize = res.obj.pageSize;
                            this.calPageCurrent = res.obj.pageCurrent;
                        } else {
                            this.monitors = [];
                        }
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
             * 1.2新增监测点
             */
            async insertMonitorSave(){
                var param = JSON.parse(JSON.stringify(this.monitorForm));
                var persons = JSON.parse(JSON.stringify(param.tEnvAlarmPersonList))

                param.tEnvAlarmPersonList = [];
                if(persons != undefined && persons.length != 0){
                    for(var userId of persons){
                        var alarmPerson = {};
                        alarmPerson.fEmployeeId = userId;

                        param.tEnvAlarmPersonList.push(alarmPerson);
                    }
                }
                let res = await MonitorService.addMonitor(param);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('monitorForm',this.monitorModal);
                    this.getMonitors();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.3修改监测点
             */
            async updateMonitorSave(){
                var personArray = this.monitorForm.tEnvAlarmPersonList;
                if(personArray != null && personArray.length != 0){
                    for(var person of personArray){
                        if(typeof(person) == 'string'){
                            var alarmPerson = {};
                            alarmPerson.fEmployeeId = person;
                            personArray.splice(personArray.indexOf(person),1,alarmPerson);
                        }
                    }
                }
                console.log(this.monitorForm)
                let res = await MonitorService.updateMonitor(this.monitorForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('monitorForm',this.monitorModal);
                    this.getMonitors();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.4删除
             */
            deleteMonitor(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前监测点，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    var fIdList = [];
                    fIdList.push(row.fId);
                    let res = await MonitorService.deleteMonitorByBatch(fIdList);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.getMonitors();
                        } else{
                            this.$message.warning(res.msg);
                        };
                }).catch(() => {

                });
            },
            /**
             * 1.5获取部门树
             */
            async initDep(){
                let res = await StartegyService.getDeps();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.deps = res.obj;
                    } else {
                        this.deps = [];
                    }
                } else {
                    console.log(res.msg);
                    this.deps = [];
                }
            },
            /**
             * 1.6获取部门下人
             */
            async getDutyUsers(id, sign){
                let res = await StartegyService.getAllDepUsers(id);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        if (sign == 'change') {
                            this.dutyUsers = res.obj;
                        }
                    } else {
                        if (sign == 'change') {
                            this.dutyUsers = [];
                        }
                    }
                } else {
                    this.dutyUsers = [];
                }
            },
            /**
             * 1.7根据人员id获得人员信息
             */
            async getUserInfoByUserId(userId){
                console.log(userId)
                let res = await StartegyService.selectbyfid(userId);
                if (res.success) {
                    if (res.obj != null) {
                        return res.obj.fDeptId;
                    }
                } else {
                    return '';
                }
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
            /**
             * 2.2改变分页大小
             */
            handlerSizeChange(val){
                this.condition.pageSize = val;
                this.getMonitors();
            },
            /**
             * 2.3改变当前页
             */
            handlerPageChange(val){
                this.condition.currentPage = val;
                this.getMonitors();
            },
            /**
             * 2.4新增监测点
             */
            insertMonitor(){
                // 初始化弹层
                this.modalTitle = '新建环保监测点';
                this.monitorModal = true;
                // 清空form表单
                this.monitorInfor.fName = '';
                this.monitorInfor.tEnvAlarmPersonList = [];
                this.monitorInfor.deptIds = [];

                this.monitorForm = this.monitorInfor;
            },
            /**
             * 2.5修改监测点
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
                this.monitorForm = cloneRow;
                // 初始化
                this.$nextTick(()=>{
                    this.modalTitle = "编辑环保监测点";
                    this.monitorModal = true;
                })
            },
            /**
             * 2.6改变部门
             */
            handleChangeDept(value) {
                if(value == ''){
                    this.dutyUsers = [];
                    this.monitorForm.tEnvAlarmPersonList = [];
                    return;
                }
                this.monitorForm.tEnvAlarmPersonList = [];
                this.getDutyUsers(value[value.length-1], 'change');
            },
            /**
             * 2.7重置表单
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 2.8弹层保存
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == "新建环保监测点") {
                            this.insertMonitorSave();
                        }
                        if (this.modalTitle == "编辑环保监测点") {
                            this.updateMonitorSave();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 2.9关闭弹层
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
    .monitor-page {
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
    .monitor-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 260px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
</style>