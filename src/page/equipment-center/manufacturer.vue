/*
 * @Author: 王侃
 * @Date:   2019-08-19
 * @Description: '生产厂商'
 */
<template>
    <div class="manufacturer-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="生产厂商">
                        <el-input placeholder="请输入生产厂商" clearable size="small" class="input-father" v-model="condition.content"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getManufacturer(1)"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertManufacturer"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="manufacturers" stripe class="defaultTab manufacturer-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fManufacturerName" label="生产厂商名称" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fManufacturerAddress" label="生产厂商地址" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fLinkman" label="联系人" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fPhone" label="联系电话" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateManufacturer(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteManufacturer(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="pageSizeChange" @current-change="getManufacturer":current-page="condition.pageCurrent" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='manufacturerModal' :modalTitle="modalTitle" @closeModal="closeModal('manufacturerForm',manufacturerModal)">
            <div slot="custom-modal-content">
                <el-form v-if="manufacturerFormState" :model="manufacturerForm" :rules="manufacturerFormRules" ref="manufacturerForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="生产厂商" prop="fManufacturerName">
                                <el-input v-model="manufacturerForm.fManufacturerName" :maxlength="10" size="small" placeholder="请填写生产厂商名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="地　　址" prop="fManufacturerAddress">
                                <el-input v-model="manufacturerForm.fManufacturerAddress" size="small" placeholder="请填写厂商地址"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联 系 人" prop="fLinkman">
                                <el-input v-model="manufacturerForm.fLinkman" :maxlength="10" size="small" placeholder="请填写联系人名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="fPhone">
                                <el-input v-model="manufacturerForm.fPhone" size="small" placeholder="请填写联系电话"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('manufacturerForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('manufacturerForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { ManufacturerService } from '@/api/equipment-type' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            const validateStartTime = (rule, phone, callback) => {
                if (!phone) {
                    callback();
                    return true;
                }
                if (phone) {
                    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))){ 
                        callback('电话号码格式有误');
                        return false;
                    } 
                }
                callback();
                return true;
            };
            return {
                manufacturers: [], // 列表集合

                condition: { // 分页请求对象
                    content: '', // 生产厂商名称
                    pageCurrent: 1, // 当前页面
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                manufacturerModal: false, // 弹层Modal
                manufacturerForm: {}, // 弹层表单
                manufacturerInfor: { // 初始化空表单
                    fId: '', // id
                    fManufacturerName: '', // 生产厂商名称
                    fIsDelete: false, // 是否可删
                    fLinkman: '', // 联系人
                    fPhone: '', // 联系电话
                    fManufacturerAddress: '', // 生产厂商地址
                },
                manufacturerFormState: true,
                manufacturerFormRules: { // 表单校验
                    fManufacturerName: [
                        { required: true, message: '请填写生产厂商名称', trigger: 'blur'}
                    ],
                    fPhone: [
                        { validator: validateStartTime, trigger: 'change' }
                    ],
                },
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
                // 获取生产厂商
                this.getManufacturer(1);
            },
            /**
             * 获取生产厂商
             * @return {Array}   查询的结果
             */
            async getManufacturer(val){
                this.condition.pageCurrent = val;
                let res = await ManufacturerService.getManufacturerByPage(this.condition);
                if (res.success) {
                    this.condition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.manufacturers = res.obj.items;
                    } else {
                        this.manufacturers = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.manufacturers = [];
                };
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            pageSizeChange(num){
                this.condition.pageSize = num;
                this.getManufacturer(1);
            },
            /**
             * 新增按钮
             */
            insertManufacturer(){
                // 初始化弹层
                this.modalTitle = '新建生产厂商';
                this.manufacturerModal = true;
                // 清空表单
                this.manufacturerInfor.fId = '';
                this.manufacturerInfor.fManufacturerName = '';
                this.manufacturerInfor.fLinkman = '';
                this.manufacturerInfor.fPhone = '';
                this.manufacturerInfor.fManufacturerAddress = '';
                this.manufacturerInfor.fIsDelete = false;
                this.manufacturerForm = this.manufacturerInfor;
            },
            /**
             * 编辑按钮
             */
            updateManufacturer(row){
                this.manufacturerForm = this._.clone(row);
                this.modalTitle = '编辑生产厂商';
                this.manufacturerModal = true;
            },
            /**
             * 删除按钮
             */
            deleteManufacturer(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await ManufacturerService.deleteManufacturer(row.fId);
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
                        if (this.modalTitle == '新建生产厂商') {
                            this.insertManufacturerForm();
                        }
                        if (this.modalTitle == '编辑生产厂商') {
                            this.updateManufacturerForm();
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
            async insertManufacturerForm(){
                let res = await ManufacturerService.insertManufacturer(this.manufacturerForm);
                if (res.success) {
                    this.closeModal('manufacturerForm',this.manufacturerModal);
                    this.$message.success(res.msg);
                    this.getManufacturer(1);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateManufacturerForm(){
                let res = await ManufacturerService.updateManufacturer(this.manufacturerForm);
                if (res.success) {
                    this.closeModal('manufacturerForm',this.manufacturerModal);
                    this.$message.success(res.msg);
                    this.getManufacturer(this.condition.pageCurrent);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.manufacturerModal = false;
                this.$refs[form].resetFields();
            },
        },
        watch: {
            'manufacturerForm': function(obj) {
                this.manufacturerFormState = false;
                this.$nextTick(() => {
                    this.manufacturerFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .manufacturer-page {
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