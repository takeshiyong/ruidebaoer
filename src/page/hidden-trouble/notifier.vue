/*
* @Author: 王侃
* @Date:   2019-08-06
* @Description: '上报通知人'
*/
<template>
    <div class="notifier-page">
        <div class="container">
            <div class="search">
                 <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="姓名">
                        <el-input placeholder="请输入姓名" clearable size="small" class="input-father" v-model="fName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getNotifier"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertNotifier"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="notifies" stripe class="defaultTab notifier-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="100"></el-table-column>
                    <el-table-column prop="fUserName" label="上报通知人" min-width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteNotifier(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='notifierModal' :modalTitle="modalTitle" @closeModal="closeModal('notifierForm',notifierModal)">
            <div slot="custom-modal-content">
                <el-form v-if="notifierFormState" :model="notifierForm" :rules="notifierFormRules" ref="notifierForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属部门">
                                <el-cascader class="wpct-100" @change="depChange" v-model="notifierForm.depIds" clearable change-on-select :options="deps" :props="depProps" :show-all-levels="false" placeholder="请选择部门"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓　　名" prop="fUserId">
                                <el-select class="wpct-100" v-model="notifierForm.fUserId" placeholder="请选择姓名" filterable clearable>
                                    <el-option
                                      v-for="user in users"
                                      :key="user.fId"
                                      :label="user.fUserName"
                                      :value="user.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('notifierForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('notifierForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { NotifierService } from '@/api/hidden-trouble' // api
    import { StartegyService } from '@/api/personal-info' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                fName: '', // 名称
                notifies: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                notifierModal: false, // 弹层Modal
                notifierForm: {}, // 弹层表单
                notifierInfor: { // 初始化空表单
                    fId: '', // id
                    fUserId: '', // 人员id
                    depIds: [],
                },
                notifierFormState: true,
                notifierFormRules: { // 表单校验
                    fUserId: [
                        {required: true, message: '请选择人员', trigger: 'change'},
                    ],
                },
                deps: [], // 部门集合
                depProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
                users: [], // 人员集合
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
                // 获取上报通知人
                this.getNotifier();
                // 获取部门树
                this.initDep();
                // 获取人员
                this.initUsers();
            },
            /**
             * 获取上报通知人
             * @return {Array}   查询的结果
             */
            async getNotifier(){
                let res = await NotifierService.getNotifier();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        if (this.fName != '') {
                            this.notifies = common.fuzzyQuery(res.obj, this.fName, 'fUserName');
                        } else {
                            this.notifies = res.obj;
                        }
                    } else {
                        this.notifies = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.notifies = [];
                };
            },
            /**
             * 获取人员
             * @return {Array}   查询的结果
             */
            async initUsers(){
                let res = await StartegyService.getAllUser();
                if ( res.success ) {
                    if (res.obj != null && res.obj !=undefined && res.obj.length >0) {
                        this.users = res.obj;
                    } else {
                        this.users = [];
                    }
                } else {
                    this.users = [];
                }
            },
            /**
             * 获取部门树
             * @return {Array}   查询的结果
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
             * 获取部门下人
             * @return {Array}   查询的结果
             */
            async getDutyUsers(id){
                let res = await StartegyService.getAllDepUsers(id);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.users = res.obj;
                    } else {
                        this.users = [];
                    }
                } else {
                    this.users = [];
                }
            },
            /**
             * 部门change事件
             */
            depChange(val){
                this.notifierForm.fUserId = '';
                let fDepId = val[val.length - 1];
                if (fDepId != '' && fDepId != undefined) {
                    this.getDutyUsers(val[val.length - 1]);
                } else {
                    this.initUsers();
                }
            },
            /**
             * 新增按钮
             */
            insertNotifier(){
                // 初始化弹层
                this.modalTitle = '新建上报通知人';
                this.notifierModal = true;
                // 清空表单
                this.notifierInfor.fId = '';
                this.notifierInfor.fUserId = '';
                this.notifierForm = this.notifierInfor;
            },
            /**
             * 删除按钮
             */
            deleteNotifier(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await NotifierService.deleteNotifier(row.fId);
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
                        this.insertNotifierForm();
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
            async insertNotifierForm(){
                let res = await NotifierService.insertNotifier(this.notifierForm);
                if (res.success) {
                    this.closeModal('notifierForm',this.notifierModal);
                    this.$message.success(res.msg);
                    this.getNotifier();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.notifierModal = false;
                this.$refs[form].resetFields();
            }
        },
        watch: {
            'notifierForm': function(obj) {
                this.notifierFormState = false;
                this.$nextTick(() => {
                    this.notifierFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .notifier-page {
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