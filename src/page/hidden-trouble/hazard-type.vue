/*
* @Author: 王侃
* @Date:   2019-08-06
* @Description: '隐患类型'
*/
<template>
    <div class="hazard-type-page">
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
                <el-table :data="types" stripe class="defaultTab hazard-type-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column label="类型图示" min-width="80">
                        <template slot-scope="scope">
                            <img :src="previewUrl+scope.row.tFileManagementDTO.fFileLocationUrl" width="26" height="26" alt="" class="pic">
                        </template>
                    </el-table-column>
                    <el-table-column prop="fTypeName" label="类型名称" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fTypeNo" label="类型编号" min-width="80" :show-overflow-tooltip="true">
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
                        <el-col :span="8">
                            <el-form-item label="类型图片" prop="fPictureUrl">
                                <el-upload
                                    class="avatar-uploader"
                                    ref="upload"
                                    :action="uploadaction"
                                    :show-file-list="false"
                                    :on-success="handlersuccess"
                                    :before-upload="handleBeforeUpload">
                                    <img v-if="imageUrl" :src="previewUrl+imageUrl" class="avatar">
                                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="类型名称" prop="fTypeName">
                                <el-input v-model="typeForm.fTypeName" :maxlength="10" size="small" placeholder="请填写类型名称"></el-input>
                            </el-form-item>
                            <el-form-item label="类型编号" prop="fTypeNo">
                                <el-input v-model="typeForm.fTypeNo" :maxlength="10" size="small" placeholder="请填写类型编号"></el-input>
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
    import { TypeService } from '@/api/hidden-trouble' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                fName: '', // 名称
                types: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                typeModal: false, // 弹层Modal
                typeForm: {}, // 弹层表单
                typeInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: true, // 是否可删除
                    fTypeName:'', // 类型名称
                    fTypeNo: '', // 类型编号
                    fPictureUrl: '',
                },

                tFileManagementDTO: {
                    fCoursewareTitle: '',
                    fFileLocationUrl: '',
                    fFileName: '',
                    fType: 1
                },
                typeFormState: true,
                typeFormRules: { // 表单校验
                    fPictureUrl: [
                        {required: true, message: '请选择上传图片', trigger: 'blur'},
                    ],
                    fTypeName: [
                        {required: true, message: '请选择填写类型名称', trigger: 'blur'},
                    ],
                    fTypeNo: [
                        {required: true, message: '请选择填写类型编号', trigger: 'blur'},
                    ]
                },

                // 图片上传
                imageUrl: '',
                uploadaction: '#',
                previewUrl: process.env.PREVIEW_API,
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
                // 获取隐患类型
                this.getType();
            },
            /**
             * 获取隐患类型
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
                this.modalTitle = '新建隐患类型';
                this.typeModal = true;
                // 清空表单
                this.imageUrl = "";
                this.typeInfor.fId = '';
                this.typeInfor.fIsDelete = true;
                this.typeInfor.fTypeName = '';
                this.typeInfor.fTypeNo = '';
                this.typeInfor.fPictureUrl = '';
                this.typeForm = this.typeInfor;
            },
            /**
             * 编辑按钮
             */
            updateType(row){
                row.fPictureUrl = row.tFileManagementDTO.fFileLocationUrl;
                this.imageUrl = row.tFileManagementDTO.fFileLocationUrl;
                this.typeForm = this._.clone(row);
                this.modalTitle = '编辑隐患类型';
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
             * 上传图片前的钩子
             */
            handleBeforeUpload(file) {
                const isJPG = file.type === 'image/jpeg' || 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    return this.$message.error('上传头像图片只能是 JPG 、PNG格式!');
                }
                if (!isLt2M) {
                    return this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return new Promise((resolve, reject) => {
                    console.log(process.env.FILE_API);
                    this.uploadaction = process.env.FILE_API + "/ikingtech/oss/api/upload/v1";

                    this.$refs.upload.$nextTick(_ => {
                        resolve(file);
                    });
                });
            },
            /**
             * 上传成功后的钩子
             */
            handlersuccess(res, file){
                if (res.success) {
                    if (res.data != null && res.data != undefined && JSON.stringify(res.data) != "{}") {
                        this.typeInfor.fPictureUrl = res.data.fFileLocationUrl;
                        this.imageUrl = res.data.fFileLocationUrl;
                        res.data.fType = 1;
                        res.data.fCoursewareTitle = res.data.fFileTitle;
                        this.tFileManagementDTO = res.data;
                    }
                } else {
                    this.$message.error("上传失败！");
                }
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitForm(formName){
                this.typeForm.tFileManagementDTO = this.tFileManagementDTO;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建隐患类型') {
                            this.insertTypeForm();
                        }
                        if (this.modalTitle == '编辑隐患类型') {
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
    .hazard-type-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
            .tab {
                .pic {
                    margin-top: 4px;
                }
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .hazard-type-page {
        .container {
            .search {
                .search-form {
                    .el-form-item__label {
                        background: rgba(241,244,249,1);
                        text-align: center!important;
                        border: 1px solid #E1E5E8;
                        border-right: none;
                        color: #324057!important;
                        height: 36px!important;
                        line-height: 36px!important;
                        border-top-left-radius: 4px;
                        border-bottom-left-radius: 4px;
                    }
                    .input-father {
                        .el-input__inner {
                            border: 1px solid #E1E5E8!important;
                            border-left: none!important;
                            border-radius: 0!important;
                            height: 36px!important;
                            line-height: 36px!important;
                            border-top-right-radius: 4px!important;
                            border-bottom-right-radius: 4px!important;
                        }
                    }
                }
            }
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 220px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
</style>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 132px;
    height: 132px;
    line-height: 132px!important;
    text-align: center;
  }
  .avatar {
    width: 132px;
    height: 132px;
    display: block;
  }
</style>