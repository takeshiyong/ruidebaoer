/*
 * @Author: 王侃
 * @Date:   2019-08-16
 * @Description: '会议类型'
 */
<template>
    <div class="meeting-type-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="类型">
                        <el-input placeholder="请输入类型" clearable size="small" class="input-father" v-model="fName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getType"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertType"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="types" stripe class="defaultTab meeting-type-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fTypeName" label="会议类型" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fRemark" label="备注" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateType(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteType(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='typeModal' :modalTitle="modalTitle" @closeModal="closeModal('typeForm',typeModal)">
            <div slot="custom-modal-content">
                <el-form v-if="typeFormState" :model="typeForm" :rules="typeFormRules" ref="typeForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型名称" prop="fTypeName">
                                <el-input v-model="typeForm.fTypeName" :maxlength="10" size="small" placeholder="请填写类型名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="fRemark">
                                <el-input type="textarea" maxlength="200" v-model="typeForm.fRemark" :rows="2" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('typeForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('typeForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { TypeService } from '@/api/meeting-management' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                fName: '', // 类型名称
                types: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                typeModal: false, // 弹层Modal
                typeForm: {}, // 弹层表单
                typeInfor: { // 初始化空表单
                    fId: '', // id
                    fTypeName: '', // 类型名称
                    fRemark: '', // 备注
                    fIsDelete: true
                },
                typeFormState: true,
                typeFormRules: { // 表单校验
                    fTypeName: [
                        { required: true, message: '请填写类型名称', trigger: 'blur'}
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
                // 获取会议类型
                this.getType();
            },
            /**
             * 获取会议类型
             * @return {Array}   查询的结果
             */
            async getType(){
                let res = await TypeService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        if (this.fName != '') {
                            this.types = common.fuzzyQuery(res.obj, this.fName, 'fTypeName');
                        } else {
                            this.types = res.obj;
                        }
                    } else {
                        this.types = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.types = [];
                };
            },
            /**
             * 新增按钮
             */
            insertType(){
                // 初始化弹层
                this.modalTitle = '新建会议类型';
                this.typeModal = true;
                // 清空表单
                this.typeInfor.fId = '';
                this.typeInfor.fTypeName = '';
                this.typeInfor.fRemark = '';
                this.typeForm = this.typeInfor;
            },
            /**
             * 编辑按钮
             */
            updateType(row){
                this.typeForm = this._.clone(row);
                this.modalTitle = '编辑会议类型';
                this.typeModal = true;
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
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建会议类型') {
                            this.insertTypeForm();
                        }
                        if (this.modalTitle == '编辑会议类型') {
                            this.updateTypeForm();
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
            async insertTypeForm(){
                let res = await TypeService.insertType(this.typeForm);
                if (res.success) {
                    this.closeModal('typeForm',this.typeModal);
                    this.$message.success(res.msg);
                    this.getType();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateTypeForm(){
                let res = await TypeService.updateType(this.typeForm);
                if (res.success) {
                    this.closeModal('typeForm',this.typeModal);
                    this.$message.success(res.msg);
                    this.getType();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.typeModal = false;
                this.$refs[form].resetFields();
            }
        },
        watch: {
            'typeForm': function(obj) {
                this.typeFormState = false;
                this.$nextTick(() => {
                    this.typeFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .meeting-type-page {
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