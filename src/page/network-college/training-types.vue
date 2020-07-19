/*
* @Author: 元实
* @Date:   2019-10-09
* @Description: '培训类型页面'
*/


<template>
    <div class="trainingtypes-page">
        <div class="container">
            <!-- 培训类型页面头部-->
            <el-row>
                <el-button type="primary" icon="el-icon-plus" @click.stop="addTrainingType" size="small">添加类型</el-button>
            </el-row>
            <!-- 培训类型页面头部-->

            <!--培训类型页面表格-->
            <el-table
                :data="trainingTypes"
                class="defaultTab margin-top15"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh">

                <el-table-column
                    label="类型名"
                    prop="fTypeName"
                    min-width="200">
                </el-table-column>

                <el-table-column
                    label="操作"
                    fixed="right"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editTrainingType(scope.row.fTypeName, scope.row.fId)" size="small">编辑</el-button>
                        <el-button type="text" @click="deleteTrainingType(scope.row.fId)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--培训类型页面表格-->

            <!-- 培训类型新增弹框-->
            <TheDialog
                :modal="isAddFormShown"
                :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                @closeModal="closeTrainingTypeDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="trainingTypeForm"
                        :model="trainingTypeForm"
                        :rules="trainingTypeRules"
                        class="demo-form-inline input-form">
                        <el-row>
                            <el-form-item
                                label="类型名"
                                label-width="100px"
                                prop="fTypeName">
                                <el-input
                                    v-model="trainingTypeForm.fTypeName"
                                    auto-complete="false"
                                    clearable
                                    class="middle-width"
                                    placeholder="请输入类型名">
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                            <el-button type="primary" @click.stop="submitTrainingTypeData">确定</el-button>
                            <el-button @click.stop="resetForm('trainingTypeForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 培训类型新增弹框-->
        </div>
    </div>
</template>

<script>
    import { TrainingTypesService } from '@/api/network-college' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                trainingTypes: [], //培训类型

                isAddFormShown: false, //是否显示新增/编辑培训类型的弹框
                addFormTitle: '新增培训类型',   //新增培训类型弹框的抬头
                isEditMode: false, //编辑状态
                editFormTitle: '编辑培训类型', //编辑培训类型弹框的抬头

                trainingTypeForm: { //新增/编辑培训类型的对象
                    fTypeName: '', //培训类型名
                    fId: '' //培训类型id
                },
                trainingTypeRules: { //验证规则
                    fTypeName: [
                        { required: true, message: '请输入培训类型名！', trigger: 'blur' }
                    ]
                }
            };
        },

        mounted() {
            this.getTrainingsTypes();
        },

        methods: {
            /**
             * 获取培训类型
             */
            async getTrainingsTypes() {
                let result = await TrainingTypesService.getTrainingTypes();

                if (result.success) {
                    this.trainingTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 展示新增/编辑培训类型的弹框
             */
            addTrainingType() {
                this.clearFormFields();
                this.openTrainingTypeDialog();

                this.isEditMode = false;
            },

            /**
             * 清理培训类型form数据
             */
            clearFormFields() {
                this.trainingTypeForm = {
                    fTypeName: ''
                };
            },

            /**
             * 展示弹框
             */
            openTrainingTypeDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 关闭弹框
             */
            closeTrainingTypeDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 提交培训类型数据
             */
            submitTrainingTypeData() {
                this.$refs.trainingTypeForm.validate(async valid => {
                    if (valid) {
                        let result = {};

                        if (!this.isEditMode) {
                            result = await TrainingTypesService.insertTrainType(this.trainingTypeForm);
                        } else {
                            result = await TrainingTypesService.updateTrainType(this.trainingTypeForm);
                        }

                        if (result.success) {
                            this.closeTrainingTypeDialog();
                            this.getTrainingsTypes();
                        } else {
                            this.$message.error(result.msg);
                        }
                    }
                });
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 编辑培训
             * @param {string} typeName --- 培训名id
             * @param {string} fId --- 培训类型id
             */
            async editTrainingType(typeName, fId) {
                this.isEditMode = true;
                this.trainingTypeForm.fTypeName = typeName;
                this.trainingTypeForm.fId = fId;
                this.openTrainingTypeDialog();
            },

            /**
             * 删除培训类型
             * @param {string} fId  --- 培训类型id
             */
            deleteTrainingType(fId) {
                this.$confirm('确定删除培训类型？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await TrainingTypesService.deleteTrainingType(fId);

                    if (result.success) {
                        this.getTrainingsTypes();
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .trainingtypes-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding:15px 10px;
        }
    }

    .margin-top15 {
        margin-top: 15px;
    }

    .margin-top20 {
        margin-top: 20px;
    }
</style>
