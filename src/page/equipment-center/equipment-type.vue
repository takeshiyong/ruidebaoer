/*
 * @Author: 王侃
 * @Date:   2019-08-19
 * @Description: '设备类型'
 */
<template>
    <div class="equipment-type-page">
        <div class="container">
            <el-row>
                <el-col :lg="6" :md="8" :sm="10" :xs="24">
                    <div class="left-sidebar">
                        <div class="header">
                            <span>设备大类</span>
                            <el-tooltip effect="dark" content="新建" placement="top">
                                <el-button  type="text" icon="el-icon-plus" @click="insertGenera" class="opear-btn insert-btn"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <div v-if="generas.length > 0">
                                <div v-for="(item, index) in generas" :key="index" class="genera-div">
                                    <div class="genera-info">
                                        <div class="genera-name">{{item.fName}}</div>
                                        <el-button type="text" icon="el-icon-edit" class="update-btn" @click="updateGenera(item)"></el-button>
                                        <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="deleteGenera(item)"></el-button>
                                    </div>
                                </div>
                            </div>
                            <div class="no-data-div" v-else>
                                暂无数据
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="18" :md="16" :sm="14" :xs="24">
                    <div class="right-list">
                        <div class="header">
                            <span>{{typeTitle}}</span>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <div class="search">
                                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                    <el-form-item>
                                        <el-button type="primary" @click="getType">全部</el-button>
                                        <el-button type="primary" @click="insertType"><i class="el-icon-plus"></i>新建</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="tab">
                                <el-table :data="types" stripe class="defaultTab type-tab" highlight-current-row>
                                    <el-table-column type="expand">
                                        <template slot-scope="props">
                                            <div v-if="props.row.attribute.length == 0">
                                                <div class="attribute">
                                                    <span class="description">暂未配置~</span>
                                                    <el-button type="text"  @click="insertAttribute(props.row)">立即配置</el-button>
                                                </div>
                                            </div>
                                            <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin:10px;" v-else>
                                                <el-row class="view-details-row" v-for="(item, index) in props.row.attribute" :key="index">
                                                    <el-col :span="4" class="field-name">
                                                        属性名称
                                                    </el-col>
                                                    <el-col :span="6" class="field-context">{{item.fAttributeName}}</el-col>
                                                    <el-col :span="4" class="field-name">
                                                        单　　位
                                                    </el-col>
                                                    <el-col :span="6" class="field-context">{{item.fUnit}}</el-col>
                                                    <el-col :span="4" class="field-context">
                                                        <el-button type="text" @click="updateAttribute(props.row, item)">编辑</el-button>
                                                        <el-button type="text" @click="deleteAttribute(item)">删除</el-button>
                                                    </el-col>
                                                </el-row>
                                            </el-card>
                                        </template>
                                    </el-table-column>
                                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                                    <el-table-column prop="fTypeName" label="设备类型" min-width="80" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column label="操作" width="300">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="insertAttribute(scope.row)">&nbsp;属性配置</el-button>
                                            <el-button type="text" @click="updateType(scope.row)">&nbsp;编辑</el-button>
                                            <el-button type="text" @click="deleteType(scope.row)">&nbsp;删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='generaModal' :modalTitle="modalTitle1" @closeModal="closeModal('generaForm',generaModal)">
            <div slot="custom-modal-content">
                <el-form v-if="generaFormState" :model="generaForm" :rules="generaFormRules" ref="generaForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="设备大类" prop="fName">
                                <el-input v-model="generaForm.fName" size="small" placeholder="请填写设备大类名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitGeneraForm('generaForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('generaForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <TheDialog :modal='typeModal' :modalTitle="modalTitle2" @closeModal="closeModal('typeForm',typeModal)">
            <div slot="custom-modal-content">
                <el-form v-if="typeFormState" :model="typeForm" :rules="typeFormRules" ref="typeForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属大类" prop="fEquipmentTypeId">
                                <el-select filterable v-model="typeForm.fEquipmentTypeId" placeholder="请选择所属大类" style="width: 100%;" clearable>
                                    <el-option
                                      v-for="item in generas"
                                      :key="item.fId"
                                      :label="item.fName"
                                      :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型" prop="fTypeName">
                                <el-input v-model="typeForm.fTypeName" size="small" placeholder="请填写设备类型"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitTypeForm('typeForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('typeForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <TheDialog :modal='attributeModal' :modalTitle="modalTitle3" @closeModal="closeModal('attributeForm',attributeModal)">
            <div slot="custom-modal-content">
                <el-form v-if="attributeFormState" :model="attributeForm" :rules="attributeFormRules" ref="attributeForm" label-width="80px">
                    <el-row>
                        <el-col :span="12" v-if="modalTitle3 == '新建类型属性'">
                            <el-form-item label="所属类型" prop="fEquipmentTypeInfoId">
                                <el-select filterable v-model="attributeForm.fEquipmentTypeInfoId" placeholder="请选择所属类型" style="width: 100%;" clearable disabled>
                                    <el-option
                                      v-for="item in types"
                                      :key="item.fId"
                                      :label="item.fTypeName"
                                      :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="属性名称" prop="fAttributeName">
                                <el-input v-model="attributeForm.fAttributeName" size="small" placeholder="请填写属性名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="属性单位" prop="fUnit">
                                <el-input v-model="attributeForm.fUnit" size="small" placeholder="请填写属性单位"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitAttributeForm('attributeForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('attributeForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { GeneraService, TypeService, AttributeService } from '@/api/equipment-type' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                generas: [], // 设备大类集合


                // 侧滑弹层
                modalTitle1: '', // 弹层标题
                generaModal: false, // 弹层Modal
                generaForm: {}, // 弹层表单
                generaInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: false, // 是否可删除
                    fName:'', // 设备大类
                },
                generaFormState: true,
                generaFormRules: { // 表单校验
                    fName: [
                        {required: true, message: '请填写设备大类', trigger: 'blur'},
                    ]
                },

                typeTitle: '全部属性', // 右侧标题
                types: [], // 设备类型集合

                // 侧滑弹层
                modalTitle2: '', // 弹层标题
                typeModal: false, // 弹层Modal
                typeForm: {}, // 弹层表单
                typeInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: false, // 是否可删除
                    fEquipmentTypeId:'', // 设备大类id
                    fTypeName: '', // 设备类型
                },
                typeFormState: true,
                typeFormRules: { // 表单校验
                    fTypeName: [
                        {required: true, message: '请填写设备类型', trigger: 'blur'},
                    ],
                    fEquipmentTypeId: [
                        { required: true, message: '请选择所属大类', trigger: 'change' }
                    ]
                },

                // 侧滑弹层 
                modalTitle3: '', // 弹层标题
                attributeModal: false, // 弹层Modal
                attributeForm: {}, // 弹层表单
                attributeInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: false, // 是否可删除
                    fEquipmentTypeInfoId:'', // 所属类型id
                    fAttributeName: '', // 设备类型
                    fUnit: '' // 单位
                },
                attributeFormState: true,
                attributeFormRules: { // 表单校验
                    fAttributeName: [
                        {required: true, message: '请填写属性名称', trigger: 'blur'},
                    ],
                    fEquipmentTypeInfoId: [
                        { required: true, message: '请选择所属类型', trigger: 'change' }
                    ]
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
                // 获取设备大类
                this.getGenera();
                // 获取设备类型
                this.getType();
            },
            /**
             * 获取设备大类
             * @return {Array}   查询的结果
             */
            async getGenera(){
                let res = await GeneraService.getGenera();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0){
                        this.generas = res.obj;
                    } else {
                        this.generas = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.generas = [];
                }
            },
            /**
             * 新增按钮
             */
            insertGenera(){
                // 初始化弹层
                this.modalTitle1 = '新建设备大类';
                this.generaModal = true;
                // 清空表单
                this.generaInfor.fId = '';
                this.generaInfor.fName = '';
                this.generaInfor.fIsDelete = false;
                this.generaForm = this.generaInfor;
            },
            /**
             * 编辑按钮
             */
            updateGenera(row){
                this.generaForm = this._.clone(row);
                this.modalTitle1 = '编辑设备大类';
                this.generaModal = true;
            },
            /**
             * 删除按钮
             */
            deleteGenera(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await GeneraService.deleteGenera(row.fId);
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
            submitGeneraForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle1 == '新建设备大类') {
                            this.insertGeneraForm();
                        }
                        if (this.modalTitle1 == '编辑设备大类') {
                            this.updateGeneraForm();
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
            async insertGeneraForm(){
                let res = await GeneraService.insertGenera(this.generaForm);
                if (res.success) {
                    this.closeModal('generaForm',this.generaModal);
                    this.$message.success(res.msg);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateGeneraForm(){
                let res = await GeneraService.updateGenera(this.generaForm);
                if (res.success) {
                    this.closeModal('generaForm',this.generaModal);
                    this.$message.success(res.msg);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                switch(form){
                    case 'generaForm':
                        this.modalTitle1 = "";
                        this.generaModal = false;
                        break;
                    case 'typeForm':
                        this.modalTitle2 = "";
                        this.typeModal = false;
                        break;
                    case 'attributeForm':
                        this.modalTitle3 = "";
                        this.attributeModal = false;
                        break;
                }
                this.$refs[form].resetFields();
            },

            /**
             * 获取设备类型
             * @return {Array}   查询的结果
             */
            async getType(){
                let res = await TypeService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0){
                        for(let item of res.obj){
                            let res1 = await AttributeService.getAttributeInfo(item.fId);
                            if (res1.success) {
                                if (res1.obj != null && res1.obj != undefined && res1.obj.length > 0) {
                                    item.attribute = res1.obj;
                                } else {
                                    item.attribute = [];
                                }
                            } else {
                                item.attribute = [];
                                this.$message.warning(res.msg);
                            }
                        }


                        this.types = res.obj;
                    } else {
                        this.types = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.types = [];
                }
            },
            /**
             * 新增按钮
             */
            insertType(){
                // 初始化弹层
                this.modalTitle2 = '新建设备类型';
                this.typeModal = true;
                // 清空表单
                this.typeInfor.fId = '';
                this.typeInfor.fEquipmentTypeId = '';
                this.typeInfor.fTypeName = '';
                this.typeInfor.fIsDelete = false;
                this.typeForm = this.typeInfor;
            },
            /**
             * 编辑按钮
             */
            updateType(row){
                this.typeForm = this._.clone(row);
                this.modalTitle2 = '编辑设备类型';
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
            submitTypeForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle2 == '新建设备类型') {
                            this.insertTypeForm();
                        }
                        if (this.modalTitle2 == '编辑设备类型') {
                            this.updateTypeForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
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
                    this.init();
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
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },

            /**
             * 新增按钮
             */
            insertAttribute(row){
                // 初始化弹层
                this.modalTitle3 = '新建类型属性';
                this.attributeModal = true;
                // 清空表单
                this.attributeInfor.fId = '';
                this.attributeInfor.fEquipmentTypeInfoId = row.fId;
                this.attributeInfor.fAttributeName = '';
                this.attributeInfor.fUnit = '';
                this.attributeInfor.fIsDelete = false;
                this.attributeForm = this.attributeInfor;
            },
            /**
             * 编辑按钮
             */
            updateAttribute(row,item){
                let param = {
                    fAttributeName: item.fAttributeName,
                    fEquipmentTypeInfoId: row.fId,
                    fId: item.fId,
                    fUnit: item.fUnit
                }
                this.attributeForm = this._.clone(param);
                this.modalTitle3 = '编辑类型属性';
                this.attributeModal = true;
            },
            /**
             * 删除按钮
             */
            deleteAttribute(item){
                if (item.fId == '' || item.fId == null || item.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await AttributeService.deleteAttribute(item.fId);
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
            submitAttributeForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle3 == '新建类型属性') {
                            this.insertAttributeForm();
                        }
                        if (this.modalTitle3 == '编辑类型属性') {
                            this.updateAttributeForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 新增请求
             * @param {object}     提交的表单对象
             */
            async insertAttributeForm(){
                let res = await AttributeService.insertAttribute(this.attributeForm);
                if (res.success) {
                    this.closeModal('attributeForm',this.attributeModal);
                    this.$message.success(res.msg);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateAttributeForm(){
                let res = await AttributeService.updateAttribute(this.attributeForm);
                if (res.success) {
                    this.closeModal('attributeForm',this.attributeModal);
                    this.$message.success(res.msg);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
        },
         watch: {
            'generaForm': function(obj) {
                this.generaFormState = false;
                this.$nextTick(() => {
                    this.generaFormState = true;
                })
                this.$forceUpdate();
            },
            'typeForm': function(obj) {
                this.typeFormState = false;
                this.$nextTick(() => {
                    this.typeFormState = true;
                })
                this.$forceUpdate();
            },
            'attributeForm': function(obj) {
                this.attributeFormState = false;
                this.$nextTick(() => {
                    this.attributeFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .equipment-type-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container { // 页面容器
            .left-sidebar { // 左侧
                height: calc(100vh - 90px);
                border-right: 1px solid #F1F1F1;
                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
                    font-size: 16px;
                    .opear-btn { // 操作按钮
                        float: right;
                        color: #545454;
                        font-size: 17px;
                    }
                    .insert-btn { // 新建按钮
                        margin-top: -4px;
                    }
                }
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    margin-top: 20px;
                    height: calc(100vh - 171px);
                    overflow-y: auto;
                    .no-data-div {
                        line-height: 60px;
                        width: 100%;
                        color: #909399;
                        text-align: center;
                    }
                    .genera-div {
                        .genera-info:hover {
                            height: 100px;
                            margin: 0px 0px 10px 0px;
                            transition: all .3s ease-in-out;
                            .update-btn {
                                opacity: 1;
                            }
                            .delete-btn {
                                opacity: 1;
                            }
                        }
                        .genera-info {
                            position: relative;
                            border-top: 4px solid #e7eaec;
                            height: 100px;
                            line-height: 100px;
                            font-size: 16px;
                            text-align: left;
                            padding-left: 40px;
                            margin: 0px 15px 10px 15px;
                            box-shadow: 0px 0px 9px 2px rgba(54,58,65,0.1);
                            color: #545454;
                            .genera-name {
                                font-weight: 700;
                            }
                            .update-btn {
                                color: #545454;
                                font-size: 16px;
                                position: absolute;
                                right: 40px;
                                top: 10%;
                                opacity: 0;
                            }
                            .delete-btn {
                                color: #545454;
                                font-size: 16px;
                                position: absolute;
                                right: 40px;
                                top: 44%;
                                opacity: 0;
                            }
                        }
                    }
                }
            }
            .right-list { // 右侧
                height: calc(100vh - 90px);

                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
                    font-size: 16px;
                    .opear-btn { // 操作按钮
                        color: #545454;
                        font-size: 17px;
                        float: left;
                    }
                    .save-btn { // 保存按钮
                        margin-right: 10px;
                        margin-top: -4px;
                    }
                }
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    height: calc(100vh - 191px);
                    overflow-y: auto;
                    padding: 20px;
                    .tab {
                        .attribute {
                            padding: 0px 10px;
                            margin-top: 10px;
                            line-height: 30px;
                            .description {
                                color: #c0c4cc;
                                font-size: 12px;
                            }
                        }
                    }
                }
            }
        }
    }
    .wpct-100 {
        width: 100%;
    }
</style>