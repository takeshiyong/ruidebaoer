/*
* @Author: 杨高杰
* @Date:   2019-08-20
* @Description: '巡检班次'
*/
<template>
    <div class="hazard-division-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="班次">
                        <el-input placeholder="请输入班次" clearable size="small" class="input-father" v-model="fName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getDivision"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertDivision"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="divisions" stripe class="defaultTab hazard-division-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fName" label="班次名称" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fBeginTime" label="开始时间" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fEndTime" label="结束时间" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateDivision(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteDivision(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='divisionModal' :modalTitle="modalTitle" @closeModal="closeModal('divisionForm',divisionModal)">
            <div slot="custom-modal-content">
                <el-form v-if="divisionFormState" :model="divisionForm" :rules="divisionFormRules" ref="divisionForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开始时间" prop="fBeginTime">
                                <el-input-number class="wpct-100" controls-position="right" v-model="divisionForm.fBeginTime" size="small" :min="0" :max="24"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="结束时间" prop="fEndTime">
                                <el-input-number class="wpct-100" controls-position="right" v-model="divisionForm.fEndTime" size="small" :min="0" :max="24"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="班次名称" prop="fName">
                                <el-input v-model="divisionForm.fName" :maxlength="10" size="small" placeholder="请填写班次名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('divisionForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('divisionForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { classesService } from '@/api/device-safety' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            let CDstartTime = (rule, value, callback) => {
                if (this.divisionForm.fEndTime == 0) {
                    callback();
                    return;
                }
                if (value > this.divisionForm.fEndTime && this.divisionForm.fEndTime !== '') {
                    callback(new Error('开始时间不能大于结束时间!'));
                } else {
                    callback();
                }
            };
            let CDendTime = (rule, value, callback) => {
                if (value == 0) {
                    callback();
                    return;
                }   
                if (value < this.divisionForm.fBeginTime) {
                    callback(new Error('结束时间不能小于开始时间!'));
                } else {
                    callback();
                }
            };
            return {
                fName: '', // 名称
                divisions: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                divisionModal: false, // 弹层Modal
                divisionForm: {}, // 弹层表单
                divisionInfor: { // 初始化空表单
                    fId: '', // id
                    fName: '', // 班次名称
                    fBeginTime: 0, // 开始时间
                    fEndTime: 0, // 结束时间
                    fIsAcrossDay: true,
                    fIsDelete: true
                },
                divisionFormState: true,
                divisionFormRules: { // 表单校验
                    fBeginTime: [
                        {required: true, message: '请填写开始时间', trigger: 'change'},
                    ],
                    fEndTime: [
                        {required: true, message: '请填写结束时间', trigger: 'change'}
                    ],
                    fName: [
                        { required: true, message: '请填写班次名称', trigger: 'blur' }
                    ],
                }
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
                // 获取隐患班次
                this.getDivision();
            },
            /**
             * 获取隐患班次
             * @return {Array}   查询的结果
             */
            async getDivision(){
                let res = await classesService.classesall();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        if (this.fName != '') {
                            this.divisions = common.fuzzyQuery(res.obj, this.fName, 'fName');
                        } else {
                            this.divisions = res.obj;
                        }
                    } else {
                        this.divisions = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.divisions = [];
                };
            },
            /**
             * 新增按钮
             */
            insertDivision(){
                // 初始化弹层
                this.modalTitle = '新建隐患班次';
                this.divisionModal = true;
                // 清空表单
                this.divisionInfor.fId = '';
                this.divisionInfor.fName = '';
                this.divisionInfor.fBeginTime = 0;
                this.divisionInfor.fEndTime = 0;
                this.divisionForm = this.divisionInfor;
            },
            /**
             * 编辑按钮
             */
            updateDivision(row){
                this.divisionForm = this._.clone(row);
                this.modalTitle = '编辑隐患班次';
                this.divisionModal = true;
            },
            /**
             * 删除按钮
             */
            deleteDivision(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    console.log(row.fId)
                    let res = await classesService.classesdelete(row.fId);
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
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建隐患班次') {
                            this.insertDivisionForm();
                        }
                        if (this.modalTitle == '编辑隐患班次') {
                            this.updateDivisionForm();
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
            async insertDivisionForm(){
                let res = await classesService.classesinsert(this.divisionForm);
                if (res.success) {
                    this.closeModal('divisionForm',this.divisionModal);
                    this.$message.success(res.msg);
                    this.getDivision();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateDivisionForm(){
                let res = await classesService.classesedio(this.divisionForm);
                if (res.success) {
                    this.closeModal('divisionForm',this.divisionModal);
                    this.$message.success(res.msg);
                    this.getDivision();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.divisionModal = false;
                this.$refs[form].resetFields();
            }
        },
        watch: {
            'divisionForm': function(obj) {
                this.divisionFormState = false;
                this.$nextTick(() => {
                    this.divisionFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .hazard-division-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
        }
    }
    .wpct-100 {
        width: 100%;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .hazard-division-page {
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
