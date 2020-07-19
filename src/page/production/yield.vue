/*
* @Author: 元实
* @Date:   2019-08-08
* @Description: '产量页面'
*/

<template>
    <div class="sales-page">
        <div class="container">
            <!-- 产量页面头部-->
            <el-form :inline="true" class="demo-form-inline search-form" :model="selectionParams">
                <el-row>
                    <el-form-item
                        label="时间区域"
                        label-width="100px"
                        prop="queryDateRange">
                        <el-date-picker
                            size="medium"
                            v-model="dateRange"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间"
                            class="datePicker">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="部门" label-width="100px">
                        <el-select v-model="selectionParams.department" placeholder="部门" class="select">
                            <el-option label="所有部门" value=""></el-option>
                            <el-option
                                v-for="department in departments"
                                :key="department.teamId"
                                :label="department.teamName"
                                :value="department.teamId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="insertProductRecord"  size="small">新增</el-button>
                        <!--<el-button type="primary" icon="el-icon-download" @click.stop="" size="small">下载</el-button>-->
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 产量页面头部-->

            <!-- 产量页面表格-->
            <el-table
                ref="productTable"
                :data="productData"
                class="defaultTab"
                highlight-current-row
                stripe
                max-height="250vh">

                <el-table-column
                    label="日期"
                    width="100"
                    fixed="left"
                    class-name="dateColumn">
                    <template slot-scope="scope">
                        {{ scope.row.date.slice(0, 10) }}
                    </template>
                </el-table-column>

                <el-table-column
                    v-for="goodsType in goodsTypes"
                    :key="goodsType.goodsId"
                    :label="goodsType.goodsType"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ getProductVolumeForGoodsType(goodsType.goodsId, scope.row) || '--' }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="总计" min-width="150">
                    <template slot-scope="scope">
                        {{ calculateTotal(scope.row) }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button type="text" @click="updateProductRecord(scope.row, scope.$index)"   size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 产量页面表格-->

            <!-- 产量页面表格分页-->
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
            <!-- 产量页面表格分页-->

            <!-- 产量页面输入数据弹框-->
            <TheDialog
                :modal="inputForm.isInputFormShown"
                :modalTitle="inputForm.isUpdateMode ? '编辑' : '新增'"
                @closeModal="closeInputDialog">
                <template v-slot:custom-modal-content>

                    <el-form ref="inputSalesInfoFormRef" label-width="150px" :rules="inputProductInfoFormRules" class="input-form" :model="inputForm">
                        <template v-if="inputForm.isDateCanBeChanged">
                            <el-form-item
                                label="日期"
                                label-width="50px"
                                prop="inputProductDateObj">
                                <el-date-picker
                                    size="medium"
                                    v-model="inputForm.inputProductDateObj"
                                    type="date"
                                    class="datePicker"
                                    :picker-options="inputPickerOptions"
                                    @change="changeInputProductDate">
                                </el-date-picker>
                            </el-form-item>

                        </template>
                        <template v-else>
                            <div class="margin-bottom-20">
                                {{ inputProductDateStr.slice(0, 10) }}
                            </div>
                        </template>

                        <el-alert
                            title="此日期的数据已存在"
                            type="warning"
                            v-if="inputForm.isDataAlreadyPresent">
                        </el-alert>

                        <el-alert
                            title="请输入数据"
                            type="error"
                            v-if="inputForm.isNoDataInput">
                        </el-alert>

                        <el-alert
                            title="产量不能为负数"
                            type="error"
                            v-if="inputForm.hasNegativeValue">
                        </el-alert>

                        <el-table
                            ref="productTable"
                            :data="inputForm.inputProductData"
                            class="defaultTab margin-top-20"
                            highlight-current-row
                            stripe>

                            <el-table-column
                                label="部门"
                                width="100"
                                fixed="left">
                                <template slot-scope="scope">
                                    {{  getDepartmentName(scope.row.id) }}
                                </template>
                            </el-table-column>

                            <el-table-column
                                v-for="goodsType in goodsTypes"
                                :key="goodsType.goodsId"
                                :label="goodsType.goodsType"
                                min-width="150"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-input type="number" min="0" v-model="scope.row[goodsType.goodsId]" placeholder="产量" ref="formInputs" clearable></el-input>
                                </template>
                            </el-table-column>
                        </el-table>

                        <el-row  type="flex" justify="center" class="formButtons">
                            <el-button type="primary" @click.stop="submitData">确定</el-button>
                            <el-button @click.stop="resetForm('formInputs')">重置</el-button>
                        </el-row>
                    </el-form>

                </template>
            </TheDialog>
            <!-- 产量页面输入数据弹框-->
        </div>
    </div>
</template>

<script>
    import { ProductVolumeService } from '@/api/production' // 请求api
    import { common } from "@/utils/common"; //公用的方法
    import TheDialog from "@/components/TheDialog";  // 侧滑组件
    import { mapGetters } from 'vuex';

    export default {
        components: {
            TheDialog,
        },

        data() {
            return {
                goodsTypes: [], //货物规格
                departments: [], //部门

                productData: [],   //产量数据
                multipleRowSelection: [],    //选择几行

                inputProductInfoFormRules: {   //验证输入数据的规则
                    inputProductDateObj: [
                        { type: 'date', required: true, message: '日期不能为空', trigger: 'change' }
                    ]
                },

                inputForm: {
                    isInputFormShown: false, //是否显示录入数据弹框
                    isUpdateMode: false,  //是否修改数据
                    isDateCanBeChanged: true,
                    inputProductDateObj: 0,   //日期毫秒
                    isDataAlreadyPresent: false,  //新增的时候，对应日期的数据是否已经存在
                    inputProductData: [],
                    isNoDataInput: false,
                    hasNegativeValue: false
                },

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                dateRange: [], //时间段

                selectionParams: {
                    startDate: new Date(new Date - 30 * 24 * 60 * 60 * 1000),  //开始日期
                    endDate: new Date,   //结束日期
                    department: '' //部门
                },

                inputPickerOptions: {
                    disabledDate(time) {             //输入数据的时候，不能选择今日以上
                        return time.getTime() > Date.now();
                    }
                }
            };
        },

        computed: {
            inputProductDateStr: { //日期字符串: YYYY-MM-DD HH:MM:SS或者YYYY-MM-DD
                get() {
                    if (this.inputForm.inputProductDateObj) {
                        return common.YMDHMSParseTime(this.inputForm.inputProductDateObj);
                    }
                },

                set(value) {
                    if (value) {
                        this.inputForm.inputProductDateObj = new Date(value);
                    } else {
                        this.inputForm.inputProductDateObj = null;
                    }
                }
            }
        },

        async created() {
            this.setDefaultDateRange();
            await this.getDepartments();
            await this.getGoodsTypes();
            await this.getProductDataPage();
        },

        methods: {
            /**
             * 设置默认时间区域
             */
            setDefaultDateRange() {
                this.dateRange = [
                    this.selectionParams.startDate,
                    this.selectionParams.endDate
                ];
            },

            /**
             * 获取部门的id和名称
             */
            async getDepartments() {
                let result = {};

                result = await ProductVolumeService.getDepartmentsData();
                if (result.success) {
                    this.departments = result.obj.slice();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取货物类型id和名称
             */
            async getGoodsTypes() {
                let result = {};

                result = await ProductVolumeService.getGoodsTypesData();
                if (result.success) {
                    this.goodsTypes = result.obj.slice();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取产量数据（一页）
             */
            async getProductDataPage() {
                let result = {};
                let params = {};

                params = this.getProductproductDataParams();
                result = await ProductVolumeService.getProductVolumeData(params);
                if (result.success) {
                    this.productData = result.obj.items.slice();
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置给查询接口传的参数
             */
            getProductproductDataParams() {
                let endDate = 0;
                let startDate = 0;
                let selectionParams = this.selectionParams;

                startDate = common.YMDHMSParseTime(this.dateRange[0]);
                endDate = common.YMDHMSParseTime(this.dateRange[1]);

                return {
                    startTime: startDate,
                    endTime: endDate,
                    fTeamId: this.selectionParams.department,
                    currentPage: this.paginator.currentPage,
                    pageSize: this.paginator.pageSize,
                    type: 1
                }
            },

            /**
             * 按照货物类型id获取产量
             * @param {string} goodsType     - 货物类型
             * @param {Object} productDataRow     - 一条数据
             * @returns {*}  - 产量
             */
            getProductVolumeForGoodsType(goodsType, productDataRow) {
                let goodsData = productDataRow.goodsTypeYield;
                let goodTypesQnty = goodsData.length;

                for (let i = 0; i < goodTypesQnty; i++) {
                    let goodsItem = goodsData[i];

                    if (goodsItem.fGoodsId === goodsType) {
                        return goodsItem.yield;
                    }
                }

                return null;
            },

            /**
             * 计算每一日的总计
             */
            calculateTotal(productDataRow) {
                let goodsData = productDataRow.goodsTypeYield;
                let goodsQnty = goodsData.length;
                let total = 0;

                for (let i = 0; i < goodsQnty; i++) {
                    total += goodsData[i].yield;
                }

                return total;
            },

            /**
             * 新增的时候，显示输入数据的弹框
             */
            async insertProductRecord() {
                this.setInputProductDataStructure();

                let inputForm = this.inputForm;

                inputForm.isUpdateMode = false;
                inputForm.isDateCanBeChanged = true;
                inputForm.isNoDataInput = false;
                inputForm.hasNegativeValue = false;

                let today = new Date;
                let todayStr = common.YMDHMSParseTime(today);

                inputForm.inputProductDateObj = today;

                this.openInputDialog();

                let detailedProductData = await this.getdetailedProductDataForDate(todayStr);

                if (this.checkDataPresent(detailedProductData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInitialproductDataForEdit(detailedProductData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                }
            },

            /**
             * 查看详情数据是否存在
             * @param {Array} detailedProductData   -- 详情数据
             */
            checkDataPresent(detailedProductData) {
                let present = false;
                let recordsQnty = detailedProductData.length;

                for (let i = 0; i < recordsQnty; i++) {
                    let products = detailedProductData[i].goodsIdAndYied;

                    if (products.length) {
                        present = true;
                    }
                }

                return present;
            },

            /**
             * 初始输入的数据的结构
             * 为了容易把数据给el-table组件绑定，输入的数据的结构是一下的
             * [{
             *  id:...，   - 部门id
             *  'id1': 产量，         - 'id1'是货物类型id
             *  ...
             *  'idN': 产量
             * },
             * ...
             * ]
             */
            setInputProductDataStructure() {
                let inputProductData = [];
                let departments = this.departments;
                let departmentsQnty = departments.length;
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;

                for (let i = 0; i < departmentsQnty; i++) {
                    let departmentData = {
                        id: departments[i].teamId
                    };

                    for (let j = 0; j < goodsTypesQnty; j++) {
                        departmentData[goodsTypes[j].goodsId] = null;
                    }
                    inputProductData.push(departmentData);
                }
                this.inputForm.inputProductData = inputProductData;
            },

            /**
             * 设置开关输入数据的弹框为开
             */
            openInputDialog() {
                this.inputForm.isInputFormShown = true;
            },

            /**
             * 开关输入数据的弹框
             */
            closeInputDialog() {
                this.inputForm.isInputFormShown = false;
            },

            /**
             * 按照部门id获取部门名称
             * @params {string} id  -- 部门id
             */
            getDepartmentName(id) {
                let departments = this.departments;
                let departmentsQnty = departments.length;

                for (let i = 0; i < departmentsQnty; i++) {
                    if (departments[i].teamId === id) {
                        return departments[i].teamName;
                    }
                }

                return '';
            },

            /**
             * 选择日期的时候，查看是否已经有这条记录
             */
            async changeInputProductDate() {
                let inputForm = this.inputForm;
                let dateStr = '';
                let detailedProductData = {};

                if (!this.inputProductDateStr) {
                    return;
                }

                dateStr = this.inputProductDateStr.slice(0, 10);
                detailedProductData = await this.getdetailedProductDataForDate(dateStr);

                inputForm.isNoDataInput = false;
                inputForm.hasNegativeValue = false;

                if (this.checkDataPresent(detailedProductData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInputProductDataStructure();
                    this.setInitialproductDataForEdit(detailedProductData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                    inputForm.isUpdateMode = false;
                    this.resetForm('formInputs');
                }
            },

            /**
             * 编辑一套产量数据
             * @param {Object} productData  - 要编辑的一条数据
             */
            async updateProductRecord(productData) {
                let inputForm = this.inputForm;

                inputForm.isUpdateMode = true;
                inputForm.isDateCanBeChanged = false;
                inputForm.isDataAlreadyPresent = false;
                inputForm.isNoDataInput = false;
                this.inputProductDateStr = productData.date;

                this.setInputProductDataStructure();
                this.openInputDialog();

                let detailedProductData = await this.getdetailedProductDataForDate();

                if (detailedProductData) {
                    this.setInitialproductDataForEdit(detailedProductData);
                }
            },

            /**
             * 编辑的时候，获取详情产量数据
             */
            async getdetailedProductDataForDate() {
                let params = { date: this.inputProductDateStr };
                let result =  await ProductVolumeService.getDetailedData(params);

                if (result.success) {
                    return result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 修改的时候，把详情数据复制到输入数据的对象
             * @param {Object} detailedProductData  -- 接口返回的详情产量数据
             */
            setInitialproductDataForEdit(detailedProductData) {
                let detailedDataQnty = detailedProductData.length;
                let inputProductData = this.inputForm.inputProductData;
                let inputProductDataQnty = inputProductData.length;

                for (let i = 0; i < detailedDataQnty; i++) {
                    let departmentId = detailedProductData[i].teamId;

                    for (let j = 0; j < inputProductDataQnty; j++) {
                        if (inputProductData[j].id === departmentId) {
                            let productVolumeData = detailedProductData[i].goodsIdAndYied;
                            let productVolumeDataQnty = productVolumeData.length;

                            for (let k = 0; k < productVolumeDataQnty; k++) {
                                let goodsTypeId = productVolumeData[k].goodsId;
                                inputProductData[j][goodsTypeId] = productVolumeData[k].yied;
                            }
                        }
                    }
                }
            },

            /**
             * 提交数据
             */
            async submitData() {
                let record = null;
                let updateMode = this.inputForm.isUpdateMode;

                if (this.inputForm.isDateCanBeChanged && !this.inputForm.inputProductDateObj) {
                    return;
                }

                if (this.hasNegativeValue()) {
                    this.inputForm.hasNegativeValue = true;
                    return;
                } else {
                    this.inputForm.hasNegativeValue = false;
                }

                if (!updateMode) {
                    record = this.setDataForInsertion();
                    if (!record.outPut.length) {
                        this.inputForm.isNoDataInput = true;
                        return;
                    }
                } else {
                    record = this.setDataForUpdate();
                    if (!record.length) {
                        this.inputForm.isNoDataInput = true;
                        return;
                    }
                }

                let result = await this.submitproductData(record);

                if (result.success) {
                    if (!updateMode) {
                        this.$message.success('新增成功');
                        this.goToPage(1);
                    } else {
                        this.$message.success('修改成功');
                        this.goToPage();
                    }
                    this.closeInputDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 查看是否有负值
             */
            hasNegativeValue() {
                let inputFormData = this.inputForm.inputProductData;
                let recordQnty = inputFormData.length;

                for (let i = 0; i < recordQnty; i++) {
                    for (let id in inputFormData[i]) {
                        if (id !== 'id') {
                            if (inputFormData[i][id] < 0) {
                                return true;
                            }
                        }
                    }
                }

                return false;
            },

            /**
             * 把新增的数据复制到提交数据的结构
             * @param {Object} inputProductData  -- 输入的数据
             */
            setDataForInsertion() {
                let record = {
                    fDate: '',
                    outPut: []
                };
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;
                let departments = this.departments;
                let departmentsQnty = departments.length;

                record.fDate = this.inputProductDateStr;
                for (let i = 0; i < goodsTypesQnty; i++) {
                    for (let j = 0; j < departmentsQnty; j++) {
                        let goodsTypeId = goodsTypes[i].goodsId;
                        let departmentId = departments[j].teamId;
                        let volume = this.inputForm.inputProductData[j][goodsTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                fDate: this.inputProductDateStr,
                                fGoodsId: goodsTypeId,
                                fTeamId: departmentId,
                                fYied: Number(volume),
                                fDelete: false,
                            };

                            record.outPut.push(dataItem);
                        }
                    }
                }

                return record;
            },

            /**
             * 把新增的数据复制到提交数据的结构
             * @param {Object} inputProductData  -- 输入的数据
             */
            setDataForUpdate() {
                let record = [];
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;
                let departments = this.departments;
                let departmentsQnty = departments.length;
                let date = '';

                date = this.inputProductDateStr;
                for (let i = 0; i < goodsTypesQnty; i++) {
                    for (let j = 0; j < departmentsQnty; j++) {
                        let goodsTypeId = goodsTypes[i].goodsId;
                        let departmentId = departments[j].teamId;
                        let volume =  this.inputForm.inputProductData[j][goodsTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                date: date,
                                goodsId: goodsTypeId,
                                teamId: departmentId,
                                yield: Number(volume)
                            };

                            record.push(dataItem);
                        }
                    }
                }

                return record;
            },

            /**
             * 提交产量数据
             * @param {Object} inputProductDataRecord  -- 输入的产量数据
             * @returns {boolean}
             */
            async submitproductData(inputProductDataRecord) {
                let res = {};

                if (!this.inputForm.isUpdateMode) {
                    res = await ProductVolumeService.insertProductVolumeData(inputProductDataRecord);
                } else {
                    res = await ProductVolumeService.updateProductVolumeData(inputProductDataRecord);
                }

                return res;
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.currentPage = pageNum;
                }
                this.getProductDataPage();
            },

            /**
             * 清理表单
             * @param {string}  formName    -- 表单名称
             */
            async resetForm(formName) {
                let inputRefs = this.$refs[formName];
                let inputsQnty = inputRefs.length;

                for (let i = 0; i < inputsQnty; i++) {
                    inputRefs[i].clear();
                }

                let detailedProductData = await this.getdetailedProductDataForDate(this.inputProductDateStr);

                if (this.checkDataPresent(detailedProductData)) {
                    this.setInitialproductDataForEdit(detailedProductData);
                }

                this.inputForm.isNoDataInput = false;
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getProductDataPage();
            }
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .sales-page {
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

        .datePicker {
            border-left: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }

        .select,
        .input-volume {
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

    .formButtons {
        margin-top: 20px;
    }

    .margin-bottom-20 {
        margin-bottom: 20px;
    }

    .margin-top-20 {
        margin-top: 20px;
    }
</style>
