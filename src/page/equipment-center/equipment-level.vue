/*
* @Author: 元实
* @Date:   2019-09-02
* @Description: '设备级别'
*/

<template>
    <div class="equiplevel-page">
        <div class="container">
            <!-- 设备级别页面头部-->
            <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="搜索内容" label-width="100px">
                        <el-input
                            v-model="selectionParams.content"
                            autocomplete="off"
                            placeholder="请输入搜索内容"
                            clearable
                            class="input-item longer">
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="addEquipLevelRecord" size="small">新增</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 设备级别页面头部-->

            <!--设备级别信息表格-->
            <el-table
                :data="equipLevelsData"
                class="defaultTab"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh">

                <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    :index="indexRecord">
                </el-table-column>

                <el-table-column
                    label="设备级别"
                    width="400"
                    prop="fLevelName">
                </el-table-column>

                <el-table-column
                    label="设备数量"
                    width="400"
                    prop="equipmentCount">
                </el-table-column>

                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editEquipLevelRecord(scope.row)" size="small">编辑</el-button>
                        <el-button type="text" @click="showEquipLevelDetails(scope.row)" size="small">详情</el-button>
                        <el-button type="text" @click="deleteEquipLevelRecord(scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--设备级别信息表格-->

            <!-- 分页-->
            <div class="block defaultPage" v-if="paginator.pagesQnty > 0">
                <el-pagination
                    id="page"
                    @size-change="changePageSize"
                    @current-change="goToPage"
                    :current-page.sync="paginator.currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="paginator.totalRecordsQnty"
                    :page-count="paginator.pagesQnty"
                    :page-sizes="paginator.pageSizes"
                    :page-size="paginator.pageSize">
                </el-pagination>
            </div>
            <!-- 分页-->

            <!-- 设备级别新增弹框-->
            <TheDialog
                :modal="isAddFormShown"
                :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                @closeModal="closeDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="addEquipLevelForm"
                        class="demo-form-inline input-form"
                        :model="addEquipLevelForm"
                        :rules="addEquipLevelRules">
                        <el-row type="flex" justify="space-between">
                            <el-form-item
                                label="设备级别"
                                label-width="100px"
                                prop="fLevelName">
                                <el-input
                                    v-model="addEquipLevelForm.fLevelName"
                                    autocomplete="off"
                                    placeholder="请输入设备级别"
                                    clearable
                                    class="input-item longer">
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                            <el-button type="primary" @click.stop="submitEquipLevelData">确定</el-button>
                            <el-button @click.stop="resetForm('addEquipLevelForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 设备级别新增弹框-->

            <!-- 设备信息详情 -->
            <el-dialog
                title="设备级别详情"
                :visible.sync="isDetailsShown"
                top="30px"
                width="1000px">
                <!--设备信息表格-->
                <el-table
                    :data="equipmentByLevel"
                    class="defaultTab"
                    highlight-current-row
                    stripe
                    style="width: 100%"
                    max-height="600px">

                    <el-table-column
                        type="index"
                        label="序号"
                        width="60"
                        :index="indexRecord">
                    </el-table-column>

                    <el-table-column
                        label="设备编号"
                        prop="fEquipmentModel">
                    </el-table-column>

                    <el-table-column
                        label="设备名称"
                        prop="fEquipmentName">
                    </el-table-column>

                    <el-table-column
                        label="设备类型"
                        prop="fEquipmentType">
                    </el-table-column>

                    <el-table-column
                        label="设备区域"
                        prop="areaName">
                    </el-table-column>

                    <el-table-column
                        label="设备状态"
                        prop="state">
                        <template slot-scope="scope">
                            {{  showEquipmentState(scope.row.fStart) }}
                        </template>
                    </el-table-column>
                </el-table>
                <!--设备信息表格-->
            </el-dialog>
            <!-- 设备信息详情 -->
        </div>
    </div>
</template>

<script>
    import { EquipmentLevelService } from '@/api/equipment-level' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                equipLevelsData: [], //设备级别数据

                selectionParams: { //搜索参数
                    content: '' //搜索内容
                },

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                //新增/编辑设备级别form -->>
                isAddFormShown: false, //显示新增/编辑设备级别的弹框
                addFormTitle: '新增设备级别',   //新增设备级别弹框的抬头
                isEditMode: false, //编辑状态
                editFormTitle: '编辑设备级别', //编辑设备级别弹框的抬头

                addEquipLevelForm: {
                    fLevelName: ''     //设备级别名称
                },

                addEquipLevelRules: {  //验证设备级别数据的规则
                    fLevelName: [
                        { required: true, message: '请输入设备级别', trigger: 'blur' }
                    ]
                },
                //<<-- 新增/编辑设备级别form

                //设备级别详情　-->
                isDetailsShown: false, //是否展示设备级别详情
                equipmentByLevel: [], //设备
                //<-- 设备级别详情
            };
        },

        mounted() {
            this.getAllEquipLevels();
        },

        methods: {
            /**
             * 给每一条数据设置序号
             */
            indexRecord(index) {
                let paginator = this.paginator;
                let calcIndex = ((paginator.currentPage - 1) * paginator.pageSize) + index + 1;

                return calcIndex;
            },

            /**
             * 获取设备级别
             */
            async getAllEquipLevels() {
                let result = {};

                this.selectionParams.pageSize = this.paginator.pageSize;
                this.selectionParams.pageCurrent = this.paginator.currentPage;
                result = await EquipmentLevelService.getEquipmentDataByPage(this.selectionParams);

                if (result.success) {
                    this.equipLevelsData = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getAllEquipLevels();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.pageCurrent = pageNum;
                }
                this.getAllEquipLevels();
            },

            /**
             * 展示新增设备级别的弹框，设置弹框中的数据
             */
            addEquipLevelRecord() {
                this.clearFormFields();
                this.showEquipLevelDialog();

                this.isEditMode = false;
            },

            /**
             * 清理给form绑定的变量
             */
            clearFormFields() {
                this.addEquipLevelForm.fLevelName = '';
            },

            /**
             * 显示新增弹框
             */
            showEquipLevelDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 关闭弹框
             */
            closeDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 提交设备级别数据
             */
            submitEquipLevelData() {
                this.$refs.addEquipLevelForm.validate(async valid => {
                    let page = 1;

                    let result = {};

                    if (valid) {
                        if (!this.isEditMode) {
                            result = await EquipmentLevelService.insertEquipLevelRecord(this.addEquipLevelForm);
                            page = 1;
                        } else {
                            result = await EquipmentLevelService.updateEquipLevelRecord(this.addEquipLevelForm);
                            page = null;
                        }

                        if (result.success) {
                            this.closeDialog();
                            this.goToPage(page);
                        } else {
                            this.$message.error(result.msg);
                        }
                    } else {
                        this.$message.error('请输入设备级别数据');
                    }
                });
            },

            /**
             * 编辑设备级别
             * @param {Object} row  -- 要修改的那一条数据　　
             * @returns {Promise<void>}
             */
            async editEquipLevelRecord(row) {
                let id = row.fId;
                let result = await EquipmentLevelService.getEditEquipLevelData(id);

                this.isEditMode = true;

                if (result.success) {
                    this.addEquipLevelForm = result.obj;
                    this.showEquipLevelDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 删除设备级别
             * @param {Object} row  -- 要删除的那一条数据
             * @returns {Promise<void>}
             */
            async deleteEquipLevelRecord(row) {
                this.$confirm('确定删除设备级别？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await EquipmentLevelService.deleteEquipLevelRecord(row.fId);

                    if (result.success) {
                        this.goToPage(1);
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 展示设备级别详情
             * @param {Object} row  -- 一条数据
             */
            async showEquipLevelDetails(row) {
                let id = row.fId;
                let equipment = await EquipmentLevelService.getEquipmentByLevel(id);

                if (equipment.success) {
                    this.equipmentByLevel = equipment.obj;
                    this.toggleEquipmentDetails();
                } else {
                    this.$message.error(equipment.msg);
                }
            },

            /**
             * 显示/关闭详情页
             */
            toggleEquipmentDetails() {
                this.isDetailsShown = !this.isDetailsShown;
            },

            /**
             * 显示设备状态
             * @param {number} state -- 设备状态：0 - 关闭 , 1 - 开启　
             */
            showEquipmentState(state) {
                switch (state) {
                    case 0:
                        return '关闭';
                    case 1:
                        return '开启';
                }
            }
         }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .equiplevel-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding:15px 10px;
        }
    }


    .search-form {
        .el-form-item__label {
            background: rgba(241,244,249,1);
            text-align: center !important;
            border: 1px solid #E1E5E8;
            border-right: none;
            color: #324057 !important;
            height: 36px !important;
            line-height: 36px !important;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .select,
        .input-item {
            .el-input__inner {
                height: 36px !important;
                border-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }

    .input-form {
        .input-volume {
            width: 200px;
        }

        .input-card {
            margin-bottom: 15px;
        }
    }

    .select,
    .input-item {
        &.longer {
            width: 220px;
        }
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
    }

</style>
