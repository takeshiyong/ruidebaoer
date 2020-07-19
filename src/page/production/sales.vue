/*
* @Author: 元实
* @Date:   2019-07-24
* @Description: '销量页面'
*/

<template>
    <div class="sales-page">
        <div class="container">
            <!-- 销量页面头部-->
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="时间区域" label-width="100px">
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
                                :key="department.id"
                                :label="department.depName"
                                :value="department.id">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="insertSalesRecord" size="small">新增</el-button>
                        <!--<el-button type="primary" icon="el-icon-download" @click.stop="" size="small">下载</el-button>-->
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 销量页面头部-->

            <!-- 销量页面表格-->
            <el-table
                ref="salesTable"
                :data="salesData"
                class="defaultTab"
                highlight-current-row
                stripe
                max-height="250vh">

                <el-table-column
                    label="日期"
                    prop="dateStr"
                    width="100"
                    fixed="left"
                    class-name="dateColumn">
                </el-table-column>

                <el-table-column
                    v-for="goodsType in goodsTypes"
                    :key="goodsType.id"
                    :label="goodsType.goodsName"
                    min-width="150"
                    :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ getSalesVolumeForGoodsType(goodsType.id, scope.row) || '--' }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="总计" min-width="150">
                    <template slot-scope="scope">
                        {{ calculateTotal(scope.row) }}
                    </template>
                </el-table-column>

                <el-table-column fixed="right" label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button type="text" @click="updateSalesRecord(scope.row, scope.$index)" size="small">编辑</el-button>
                    </template>
                </el-table-column>
                <template slot="empty">
                    <div style="width: 100%;display: flex;justifyContent: center">
                        <span>暂无数据</span>
                    </div>
                </template>
            </el-table>
            <!-- 销量页面表格-->

            <!-- 销量页面表格分页-->
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
            <!-- 销量页面表格分页-->

            <!-- 销量页面输入数据弹框-->
            <TheDialog
                :modal="inputForm.isInputFormShown"
                :modalTitle="inputForm.isUpdateMode ? '编辑' : '新增'"
                @closeModal="closeInputDialog">
                <template v-slot:custom-modal-content>

                    <el-form ref="inputSalesInfoFormRef" label-width="150px" :rules="inputSalesInfoFormRules" class="input-form" :model="inputForm">
                        <template v-if="inputForm.isDateCanBeChanged">
                            <el-form-item
                                label="日期"
                                label-width="50px"
                                prop="inputSalesDateObj">
                                <el-date-picker
                                    size="medium"
                                    v-model="inputForm.inputSalesDateObj"
                                    type="date"
                                    class="datePicker"
                                    :picker-options="inputPickerOptions"
                                    @change="changeInputSalesDate">
                                </el-date-picker>
                            </el-form-item>

                        </template>
                        <template v-else>
                            <div class="margin-bottom-20">
                                {{ inputSalesDateStr.slice(0, 10) }}
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
                            title="销量不能为负数"
                            type="error"
                            v-if="inputForm.hasNegativeValue">
                        </el-alert>

                        <el-table
                            ref="salesTable"
                            :data="inputForm.inputSalesData"
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
                                :key="goodsType.id"
                                :label="goodsType.goodsName"
                                min-width="150"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-input type="number" min="0" v-model="scope.row[goodsType.id]" placeholder="销量" ref="formInputs" clearable></el-input>
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
            <!-- 销量页面输入数据弹框-->
        </div>
    </div>
</template>

<script>
    import { SalesVolumeService } from '@/api/production' // 请求api
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

                salesData: [],   //销量数据
                multipleRowSelection: [],    //选择几行

                inputSalesInfoFormRules: {   //验证输入数据的规则
                    inputSalesDateObj: [
                        { type: 'date', required: true, message: '日期不能为空', trigger: 'change' }
                    ]
                },

                inputForm: {
                    isInputFormShown: false, //是否显示录入数据弹框
                    isUpdateMode: false,  //是否修改数据
                    isDateCanBeChanged: true,
                    inputSalesDateObj: 0,   //日期毫秒
                    isDataAlreadyPresent: false,  //新增的时候，对应日期的数据是否已经存在
                    inputSalesData: [],
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
            inputSalesDateStr: { //日期字符串: YYYY-MM-DD HH:MM:SS或者YYYY-MM-DD
                get() {
                    if (this.inputForm.inputSalesDateObj) {
                        return common.YMDHMSParseTime(this.inputForm.inputSalesDateObj);
                    }
                },

                set(value) {
                    if (value) {
                        this.inputForm.inputSalesDateObj = new Date(value);
                    } else {
                        this.inputForm.inputSalesDateObj = null;
                    }
                }
            }
        },

        async created() {
            this.setDefaultDateRange();
            await this.getDepartments();
            await this.getGoodsTypes();
            await this.getSalesDataPage();
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

                result = await SalesVolumeService.getDepartmentsData();
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

                result = await SalesVolumeService.getGoodsTypesData();
                if (result.success) {
                    this.goodsTypes = result.obj.slice();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取销量数据（一页）
             */
            async getSalesDataPage() {
                let result = {};
                let params = {};

                params = this.setSearchSalesDataParams();
                result = await SalesVolumeService.getSalesVolumeData(params);
                if (result.success) {
                    this.salesData = result.obj.items.slice();
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置给查询接口传的参数
             */
            setSearchSalesDataParams() {
                let endDate = 0;
                let startDate = 0;
                let selectionParams = this.selectionParams;

                startDate = common.YMDHMSParseTime(this.dateRange[0]);
                endDate = common.YMDHMSParseTime(this.dateRange[1]);

                return {
                    searchBeginTime: startDate,
                    searchEndTime: endDate,
                    deptId: this.selectionParams.department,
                    pageCurrent: this.paginator.currentPage,
                    pageSize: this.paginator.pageSize,
                    type: 1   //1-按货物类型查询，2-按部门查询
                }
            },

            /**
             * 按照货物类型id获取销量
             * @param {string} goodsType     - 货物类型
             * @param {Object} salesDataRow     - 一条数据
             * @returns {*}  - 销量
             */
            getSalesVolumeForGoodsType(goodsType, salesDataRow) {
                let goodsData = salesDataRow.saleOutList;
                let goodTypesQnty = goodsData.length;

                for (let i = 0; i < goodTypesQnty; i++) {
                    let goodsItem = goodsData[i];

                    if (goodsItem.goodsId === goodsType) {
                        return goodsItem.saleNumberSum;
                    }
                }

                return null;
            },

            /**
             * 计算每一日的总计
             */
            calculateTotal(salesDataRow) {
                let goodsData = salesDataRow.saleOutList;
                let goodsQnty = goodsData.length;
                let total = 0;

                for (let i = 0; i < goodsQnty; i++) {
                    total += goodsData[i].saleNumberSum;
                }

                return total;
            },

            /**
             * 新增的时候，显示输入数据的弹框
             */
            async insertSalesRecord() {
                this.setInputSalesDataStructure();

                let inputForm = this.inputForm;

                inputForm.isUpdateMode = false;
                inputForm.isDateCanBeChanged = true;
                inputForm.isNoDataInput = false;
                inputForm.hasNegativeValue = false;

                let today = new Date;
                let todayStr = common.YMDHMSParseTime(today);

                inputForm.inputSalesDateObj = today;

                this.openInputDialog();

                let detailedSalesData = await this.getDetailedSalesDataForDate(todayStr);

                if (this.checkDataPresent(detailedSalesData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInitialSalesDataForEdit(detailedSalesData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                }
            },

            /**
             * 查看详情数据是否存在
             * @param {Array} detailedSalesData   -- 详情数据
             */
            checkDataPresent(detailedSalesData) {
                let present = false;
                let recordsQnty = detailedSalesData.length;

                for (let i = 0; i < recordsQnty; i++) {
                    let saleDetail = detailedSalesData[i].saleDetail;

                    if (saleDetail.length) {
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
             *  'id1': 销量，         - 'id1'是货物类型id
             *  ...
             *  'idN': 销量
             * },
             * ...
             * ]
             */
            setInputSalesDataStructure() {
                let inputSalesData = [];
                let departments = this.departments;
                let departmentsQnty = departments.length;
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;

                for (let i = 0; i < departmentsQnty; i++) {
                    let departmentData = {
                        id: departments[i].id
                    };

                    for (let j = 0; j < goodsTypesQnty; j++) {
                        departmentData[goodsTypes[j].id] = null;
                    }
                    inputSalesData.push(departmentData);
                }
                this.inputForm.inputSalesData = inputSalesData;
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
                    if (departments[i].id === id) {
                        return departments[i].depName;
                    }
                }

                return '';
            },

            /**
             * 选择日期的时候，查看是否已经有这条记录
             */
            async changeInputSalesDate() {
                let inputForm = this.inputForm;
                let dateStr = '';
                let detailedSalesData = {};

                if (!inputForm.inputSalesDateObj) {
                    return;
                }

                dateStr = this.inputSalesDateStr.slice(0, 10);
                detailedSalesData = await this.getDetailedSalesDataForDate(dateStr);

                inputForm.isNoDataInput = false;
                inputForm.hasNegativeValue = false;

                if (this.checkDataPresent(detailedSalesData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInputSalesDataStructure();
                    this.setInitialSalesDataForEdit(detailedSalesData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                    inputForm.isUpdateMode = false;
                    this.resetForm('formInputs');
                }
            },

            /**
             * 编辑一套销量数据
             * @param {Object} salesData  - 要编辑的一条数据
             */
            async updateSalesRecord(salesData) {
                let inputForm = this.inputForm;

                inputForm.isUpdateMode = true;
                inputForm.isDateCanBeChanged = false;
                inputForm.isDataAlreadyPresent = false;
                this.inputSalesDateStr = salesData.dateStr;
                inputForm.isNoDataInput = false;

                this.setInputSalesDataStructure();
                this.openInputDialog();

                let detailedSalesData = await this.getDetailedSalesDataForDate();

                if (detailedSalesData) {
                    this.setInitialSalesDataForEdit(detailedSalesData);
                }
            },

            /**
             * 编辑的时候，获取详情销量数据
             */
            async getDetailedSalesDataForDate() {
                let params = { fSaleDate: this.inputSalesDateStr };
                let result =  await SalesVolumeService.getDetailedData(params);

                if (result.success) {
                    return result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 修改的时候，把详情数据复制到输入数据的对象
             * @param {Object} detailedSalesData  -- 接口返回的详情销量数据
             */
            setInitialSalesDataForEdit(detailedSalesData) {
                let detailedDataQnty = detailedSalesData.length;
                let inputSalesData = this.inputForm.inputSalesData;
                let inputSalesDataQnty = inputSalesData.length;

                for (let i = 0; i < detailedDataQnty; i++) {
                    let departmentId = detailedSalesData[i].depId;

                    for (let j = 0; j < inputSalesDataQnty; j++) {
                        if (inputSalesData[j].id === departmentId) {
                            let salesVolumeData = detailedSalesData[i].saleDetail;
                            let salesVolumeDataQnty = salesVolumeData.length;

                            for (let k = 0; k < salesVolumeDataQnty; k++) {
                                let goodsTypeId = salesVolumeData[k].goodsId;
                                inputSalesData[j][goodsTypeId] = salesVolumeData[k].saleNum;
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

                if (this.inputForm.isDateCanBeChanged && !this.inputForm.inputSalesDateObj) {
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
                    if (!record.salelists.length) {
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

                let result = await this.submitSalesData(record);

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
                let inputFormData = this.inputForm.inputSalesData;
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
             * @param {Object} inputSalesData  -- 输入的数据
             */
            setDataForInsertion() {
                let record = {
                    fSaleDate: '',
                    salelists: []
                };
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;
                let departments = this.departments;
                let departmentsQnty = departments.length;

                record.fSaleDate = this.inputSalesDateStr;
                for (let i = 0; i < goodsTypesQnty; i++) {
                    for (let j = 0; j < departmentsQnty; j++) {
                        let goodsTypeId = goodsTypes[i].id;
                        let goodsName = goodsTypes[i].goodsName;
                        let departmentId = departments[j].id;
                        let volume = this.inputForm.inputSalesData[j][goodsTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                fSaleDate: this.inputSalesDateStr,
                                fGoodsName: goodsName,
                                fGoodsId: goodsTypeId,
                                fSaleTypeId: departmentId,
                                fSaleNumber: Number(volume),
                                fIsDelete: false,
                                f_level: 3
                            };

                            record.salelists.push(dataItem);
                        }
                    }
                }

                return record;
            },

            /**
             * 把新增的数据复制到提交数据的结构
             * @param {Object} inputSalesData  -- 输入的数据
             */
            setDataForUpdate() {
                let record = [];
                let goodsTypes = this.goodsTypes;
                let goodsTypesQnty = goodsTypes.length;
                let departments = this.departments;
                let departmentsQnty = departments.length;
                let date = '';

                date = this.inputSalesDateStr;
                for (let i = 0; i < goodsTypesQnty; i++) {
                    for (let j = 0; j < departmentsQnty; j++) {
                        let goodsTypeId = goodsTypes[i].id;
                        let departmentId = departments[j].id;
                        let volume = this.inputForm.inputSalesData[j][goodsTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                fSaleDate: date,
                                goodsId: goodsTypeId,
                                depId: departmentId,
                                fSaleNumber: Number(volume)
                            };

                            record.push(dataItem);
                        }
                    }
                }

                return record;
            },

            /**
             * 提交销量数据
             * @param {Object} inputSalesDataRecord  -- 输入的销量数据
             * @returns {boolean}
             */
            async submitSalesData(inputSalesDataRecord) {
                let res = {};

                if (!this.inputForm.isUpdateMode) {
                    res = await SalesVolumeService.insertSalesVolumeData(inputSalesDataRecord);
                } else {
                    res = await SalesVolumeService.updateSalesVolumeData(inputSalesDataRecord);
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
                this.getSalesDataPage();
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

                let detailedSalesData = await this.getDetailedSalesDataForDate(this.inputSalesDateStr);

                if (this.checkDataPresent(detailedSalesData)) {
                    this.setInitialSalesDataForEdit(detailedSalesData);
                }

                this.inputForm.isNoDataInput = false;
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getSalesDataPage();
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
