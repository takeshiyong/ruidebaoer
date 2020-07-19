/*
* @Author: 元实
* @Date:   2019-09-04
* @Description: '设备保养'
*/

<template>
    <div class="workshop-page">
        <div class="container">
            <el-row>
                <el-col :span="4">
                    <div class="full-height right-separator">
                        <el-header>设备类型</el-header>

                        <!-- 保养类型 -->
                        <el-menu
                            default-active="0"
                            @select="selectEquipmentType">
                            <el-menu-item v-for="(type, index) in equipmentTypes" :key="type.fId" :index="index">
                                <span>{{ type.fTypeName }}</span>
                            </el-menu-item>
                        </el-menu>
                        <!-- 保养类型 -->
                    </div>
                </el-col>

                <el-col :span="20">
                    <el-container class="care-tables">
                        <el-header>保养项设置</el-header>

                        <el-row>
                            <div class="selector">
                                <span class="selector-header margin-right40">保养级别</span>

                                <el-radio-group
                                    v-model="searchParams.maintainLevel"
                                    @change="changeCareLevel">
                                    <el-radio :label="0">日常保养</el-radio>
                                    <el-radio :label="1">周保养</el-radio>
                                    <el-radio :label="2">月保养</el-radio>
                                    <el-radio :label="3">年保养</el-radio>
                                </el-radio-group>
                            </div>
                        </el-row>

                        <div class="tables-container">
                            <el-row>
                                <div class="table-wrapper">
                                    <!--保养信息表格-->
                                    <el-table
                                        :data="careItems"
                                        class="defaultTab"
                                        highlight-current-row
                                        stripe
                                        style="width: 100%"
                                        max-height="250vh">
    
                                        <el-table-column
                                            type="index"
                                            label="序号"
                                            width="60"
                                            :index="indexCareItemsRecord">
                                        </el-table-column>
    
                                        <el-table-column
                                            label="保养内容"
                                            prop="fMaintainItemsTitle">
                                        </el-table-column>
    
                                        <el-table-column
                                            label="如有必要"
                                            width="155">
                                            <template slot-scope="scope">
                                                {{ scope.row.fMaintainItemsOperate || '--' }}
                                            </template>
                                        </el-table-column>
    
                                        <el-table-column
                                            label="备注"
                                            width="155">
                                            <template slot-scope="scope">
                                                {{ scope.row.fMaintainItemsRemarks || '--' }}
                                            </template>
                                        </el-table-column>
    
                                        <el-table-column
                                            label="操作"
                                            width="115"
                                            fixed="right">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="deleteCareInfo(scope.row.fMaintainItemsId)" size="small">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <!--保养信息表格-->
                                    <el-button
                                        icon="el-icon-plus"
                                        class="add-button"
                                        @click="addCareItem">添加保养项</el-button>
    
                                    <!-- 分页-->
                                    <div class="block defaultPage" v-if="careItemPaginator.pagesQnty > 0">
                                        <el-pagination
                                            @size-change="changeCareItemsPageSize"
                                            @current-change="goToCareItemsPage"
                                            :current-page.sync="careItemPaginator.currentPage"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="careItemPaginator.totalRecordsQnty"
                                            :page-count="careItemPaginator.pagesQnty"
                                            :page-sizes="careItemPaginator.pageSizes"
                                            :page-size="careItemPaginator.pageSize">
                                        </el-pagination>
                                    </div>
                                    <!-- 分页-->
                                </div>
                            </el-row>
    
                            <el-row>
                                <div class="table-wrapper">
                                    <!--保养信息表格-->
                                    <el-table
                                        :data="protectEssentials"
                                        class="defaultTab"
                                        highlight-current-row
                                        stripe
                                        style="width: 100%"
                                        max-height="250vh">
    
                                        <el-table-column
                                            type="index"
                                            label="序号"
                                            width="60"
                                            :index="indexProtectRecord">
                                        </el-table-column>
    
                                        <el-table-column
                                            label="维护要点"
                                            prop="fMaintainPointsTitle">
                                            <template slot-scope="scope">
                                                {{ scope.row.fMaintainPointsTitle || '--' }}
                                            </template>
                                        </el-table-column>
    
                                        <el-table-column
                                            label="操作"
                                            width="115"
                                            fixed="right">
                                            <template slot-scope="scope">
                                                <el-button type="text" @click="deleteProtectInfo(scope.row.fMaintainPointsId)" size="small">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <!--保养信息表格-->
                                    <el-button
                                        icon="el-icon-plus"
                                        class="add-button"
                                        @click="addProtectItem">添加维护要点</el-button>
    
                                    <!-- 分页-->
                                    <div class="block defaultPage" v-if="protectPaginator.pagesQnty > 0">
                                        <el-pagination
                                            @size-change="changeProtectPageSize"
                                            @current-change="goToProtectPage"
                                            :current-page.sync="protectPaginator.currentPage"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="protectPaginator.totalRecordsQnty"
                                            :page-count="protectPaginator.pagesQnty"
                                            :page-sizes="protectPaginator.pageSizes"
                                            :page-size="protectPaginator.pageSize">
                                        </el-pagination>
                                    </div>
                                    <!-- 分页-->
                                </div>
                            </el-row>
                        </div>
                    </el-container>
                </el-col>
            </el-row>
        </div>

        <!-- 新增保养项弹框-->
        <TheDialog
            :modal="isAddCareItemFormShown"
            modalTitle="新增保养项"
            @closeModal="closeDialog(1)">
            <template v-slot:custom-modal-content>
                <el-form
                    ref="addCareItemForm"
                    class="demo-form-inline input-form"
                    :model="addCareItemForm"
                    :rules="addCareItemRules">
                    <el-row>
                        <el-form-item
                            label="保养内容"
                            label-width="100px"
                            prop="fMaintainItemsTitle">
                            <el-input
                                v-model="addCareItemForm.fMaintainItemsTitle"
                                type="textarea"
                                autocomplete="off"
                                placeholder="请输入保养内容"
                                resize="none"
                                clearable>
                            </el-input>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-form-item
                            label="如有必要"
                            label-width="100px">
                            <el-input
                                v-model="addCareItemForm.fMaintainItemsOperate"
                                autocomplete="off"
                                placeholder="请输入如有必要"
                                clearable
                                class="input-item longer">
                            </el-input>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-form-item
                            label="备注"
                            label-width="100px">
                            <el-input
                                v-model="addCareItemForm.fMaintainItemsRemarks"
                                type="textarea"
                                autocomplete="off"
                                placeholder="请输入备注"
                                resize="none"
                                clearable>
                            </el-input>
                        </el-form-item>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                        <el-button type="primary" @click.stop="submitCareItemData">确定</el-button>
                        <el-button @click.stop="resetForm('addCareItemForm')">重置</el-button>
                    </el-row>
                </el-form>
            </template>
        </TheDialog>
        <!-- 新增保养项弹框-->

        <!-- 新增维护要点弹框-->
        <TheDialog
            :modal="isAddProtectFormShown"
            modalTitle="新增维护要点"
            @closeModal="closeDialog(2)">
            <template v-slot:custom-modal-content>
                <el-form
                    ref="addProtectForm"
                    class="demo-form-inline input-form"
                    :model="addProtectForm"
                    :rules="addProtectFormRules">
                    <el-row>
                        <el-form-item
                            label="维护要点"
                            label-width="100px"
                            prop="fMaintainPointsTitle">
                            <el-input
                                v-model="addProtectForm.fMaintainPointsTitle"
                                type="textarea"
                                autocomplete="off"
                                placeholder="请输入维护要点"
                                resize="none"
                                clearable
                                class="input-item">
                            </el-input>
                        </el-form-item>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                        <el-button type="primary" @click.stop="submitProtectData">确定</el-button>
                        <el-button @click.stop="resetForm('addProtectForm')">重置</el-button>
                    </el-row>
                </el-form>
            </template>
        </TheDialog>
        <!-- 新增维护要点弹框-->
    </div>
</template>

<script>
    import { CareService } from '@/api/care' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                careLevel: '日常保养',   //保养级别

                careItems: [], //保养项数据
                protectEssentials: [], //维护要顶数据
                equipmentTypes: [], //设备类型

                searchParams: {   //查询保养项条件
                    equipmentTypeId: '',   //设备类型id
                    maintainLevel: 0  //保养级别
                },

                //新增保养项form -->
                isAddCareItemFormShown: false,
                addCareItemForm: {
                    fMaintainItemsOperate: '', //保养项操作（如有必要）
                    fMaintainLevel: 0, //保养级别: 0-日常, 1-周, 2-月, 3-年
                    fMaintainItemsRemarks: '', //保养项备注
                    fMaintainItemsTitle: '', //保养项内容
                    fEquipmentTypeId: '' //设备类型id
                },

                addCareItemRules: { //验证新增保养项form的规则
                    fMaintainItemsTitle: [
                        { required: true, message: '请输入保养项内容', trigger: 'blur' }
                    ]
                },
                //<-- 新增保养项form

                // 保养分页 -->
                careItemPaginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },
                // <-- 保养分页

                //新增维护要点form -->
                isAddProtectFormShown: false,
                addProtectForm: {
                    fMaintainLevel: 0, //保养级别: 0-日常, 1-周, 2-月, 3-年
                    fEquipmentTypeId: '', //设备类型id
                    fMaintainPointsTitle: '' //保养项内容
                },

                addProtectFormRules: {
                    fMaintainPointsTitle: [
                        { required: true, message: '请输入维修要点', trigger: 'blur' }
                    ]
                },
                //<-- 新增维护要点form

                protectPaginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },
            };
        },

        async mounted() {
            await this.getEquipmentTypes();
        },

        methods: {
            /**
             * 获取设备类型
             */
            async getEquipmentTypes() {
                let result = await CareService.getEquipmentTypesData();

                if (result.success) {
                    this.equipmentTypes = result.obj;
                    this.selectEquipmentType(0);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 选择设备类型
             */
            selectEquipmentType(index) {
                let equipTypeId = this.equipmentTypes[index].fId;
                let params = this.searchParams;

                params.equipmentTypeId = equipTypeId;
                this.getCareItems();
                this.getProtectEssentials();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToCareItemsPage(pageNum) {
                if (pageNum) {
                    this.careItemPaginator.pageCurrent = pageNum;
                }
                this.getCareItems();
            },

            /**
             * 获取保养项
             */
            async getCareItems() {
                let result = {};

                this.searchParams.pageSize = this.careItemPaginator.pageSize;
                this.searchParams.pageCurrent = this.careItemPaginator.currentPage;

                this.careItems = [];

                result = await CareService.getCareItemsData(this.searchParams);

                if (result.success) {
                    this.careItems = result.obj.items || [];
                    this.careItemPaginator.pagesQnty = result.obj.pageCount;
                    this.careItemPaginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 给每一条保养项数据设置序号
             */
            indexCareItemsRecord(index) {
                let paginator = this.careItemPaginator;
                let calcIndex = ((paginator.currentPage - 1) * paginator.pageSize) + index + 1;

                return calcIndex;
            },

            /**
             * 新增保养项
             */
            addCareItem() {
                this.isAddCareItemFormShown = true;
                this.clearAddCareItemForm();
            },

            /**
             *清理保养项form
             */
            clearAddCareItemForm() {
                let form = this.addCareItemForm;

                form.fMaintainItemsTitle = '';
                form.fMaintainItemsOperate = '';
                form.fMaintainItemsRemarks = '';
            },

            /**
             * 提交保养项数据
             */
            submitCareItemData() {
                this.$refs.addCareItemForm.validate(async valid => {
                    if (valid) {
                        this.addCareItemForm.fEquipmentTypeId = this.searchParams.equipmentTypeId;
                        this.addCareItemForm.fMaintainLevel = this.searchParams.maintainLevel;

                        let result = await CareService.insertCareItemRecord(this.addCareItemForm);

                        if (!result.success) {
                            this.$message.error(result.msg);
                        } else {
                            this.closeDialog(1);
                            this.goToCareItemsPage();
                        }
                    }
                });
            },

            /**
             * 删除保养项
             * @param {string} id -- 保养项id
             */
            deleteCareInfo(id) {
                this.$confirm('确定删除保养项？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await CareService.deleteCareItemRecord(id);

                    if (result.success) {
                        this.goToCareItemsPage();
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changeCareItemsPageSize(size) {
                this.careItemPaginator.pageSize = size;
                this.getCareItems();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToProtectPage(pageNum) {
                if (pageNum) {
                    this.protectPaginator.pageCurrent = pageNum;
                }
                this.getProtectEssentials();
            },

            /**
             * 获取维护要点
             */
            async getProtectEssentials() {
                let result = {};

                this.searchParams.pageSize = this.protectPaginator.pageSize;
                this.searchParams.pageCurrent = this.protectPaginator.currentPage;

                this.protectEssentials =[];

                result = await CareService.getProtectEssentialsData(this.searchParams);

                if (result.success) {
                    this.protectEssentials = result.obj.items || [];
                    this.protectPaginator.pagesQnty = result.obj.pageCount;
                    this.protectPaginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 给每一条维护要点数据设置序号
             */
            indexProtectRecord(index) {
                let paginator = this.protectPaginator;
                let calcIndex = ((paginator.currentPage - 1) * paginator.pageSize) + index + 1;

                return calcIndex;
            },

            /**
             * 新增维护要点
             */
            addProtectItem() {
                this.isAddProtectFormShown = true;
                this.clearAddProtectForm();
            },

            /**
             * 清理维护要点字段数据
             */
            clearAddProtectForm() {
                this.addProtectForm.fMaintainPointsTitle = '';
            },

            /**
             * 提交维护要点数据
             */
            submitProtectData() {
                this.$refs.addProtectForm.validate(async valid => {
                    if (valid) {
                        this.addProtectForm.fEquipmentTypeId = this.searchParams.equipmentTypeId;
                        this.addProtectForm.fMaintainLevel = this.searchParams.maintainLevel;

                        let result = await CareService.insertProtectRecord(this.addProtectForm);

                        if (!result.success) {
                            this.$message.error(result.msg);
                        } else {
                            this.closeDialog(2);
                            this.goToProtectPage();
                        }
                    }
                });
            },

            /**
             * 删除维护要点
             * @param {string} id -- 维护要点id
             */
            deleteProtectInfo(id) {
                this.$confirm('确定删除维护要点？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await CareService.deleteProtectRecord(id);

                    if (result.success) {
                        this.goToProtectPage();
                    } else {
                        this.$message.error(result.msg);
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
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changeProtectPageSize(size) {
                this.protectPaginator.pageSize = size;
                this.getProtectEssentials();
            },

            /**
             * 关闭弹框
             * @param {number} dialogType    -- 1 - 新增保养项, 2 - 新增维护要点
             */
            closeDialog(dialogType) {
                switch (dialogType) {
                    case 1:
                        this.isAddCareItemFormShown = false;
                        break;

                    case 2:
                        this.isAddProtectFormShown = false;
                        break;
                }
            },

            /**
             * 改变保养级别
             */
            changeCareLevel() {
                this.getCareItems();
                this.getProtectEssentials();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .workshop-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding:15px 10px;
        }

        .full-height {
            height: calc(100vh - 120px);
        }

        .right-separator {
            border-right: solid 1px #e6e6e6;
        }

        .aside-title {
            padding-left: 20px;
            color: #666;
        }

        .margin-top20 {
            margin-top: 20px;
        }

        .care-tables {
            padding-left: 10px;
        }
        
        .selector {
            padding: 10px 20px;
            background: #eee;
        }

        .margin-right40 {
            margin-right: 40px;
        }
        
        .tables-container {
            height: 73vh;
            overflow-y: auto;
        }

        .table-wrapper {
            padding: 20px;
        }

        .defaultTab {
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
        }

        .add-button {
            width: 100%;
            padding: 12px 0;
            font-size: 14px;
            color: #38acfd;
            font-weight: normal;
            border-top: none;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        .selector-header {
            font-size: 14px;
        }
    }

    .el-menu {
        border-right: none;

        > .el-menu-item:hover,
        > .el-menu-item.is-active {
            border-left: solid 3px #38acfd;
        }
    }
</style>
