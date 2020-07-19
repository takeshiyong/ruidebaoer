/*
* @Author: 王侃
* @Date:   2019-08-08
* @Description: '能耗'
*/
<template>
    <div class="dynamic-page">
        <div class="container">
            <el-row>
                <el-col :lg="6" :md="8" :sm="10" :xs="24">
                    <div class="left-sidebar">
                        <div class="header">
                            <span>能耗类型</span>
                            <el-tooltip effect="dark" content="新建" placement="top">
                                <el-button  type="text" icon="el-icon-plus" @click="insertType" class="opear-btn insert-btn"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <div v-if="types.length > 0">
                                <div v-for="(item, index) in types" :key="index" class="type-div">
                                    <div class="type-info">
                                        <div class="type-name">{{item.fName}}</div>
                                        <div class="type-unit">{{item.fUnit}}</div>
                                        <p class="type-remark">
                                            {{item.fRemark}}
                                        </p>
                                        <el-button type="text" icon="el-icon-edit" class="update-btn" @click="updateType(item)"></el-button>
                                        <el-button type="text" icon="el-icon-delete" class="delete-btn" @click="deleteType(item)"></el-button>
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
                    <div class="right-list" v-show="dynamicPage">
                        <!-- animated fadeInUp -->
                        <div class="search">
                            <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                <el-form-item label="时间区域" label-width="100px">
                                    <el-date-picker
                                        unlink-panels
                                        v-model="dateRange"
                                        type="daterange"
                                        range-separator="至"
                                        start-placeholder="起始时间"
                                        end-placeholder="结束时间" class="input-picker" @change="changeDate">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="车间">
                                    <el-select v-model="fWorkshopId" placeholder="车间" class="input-father">
                                        <el-option label="所有车间" value=""></el-option>
                                        <el-option
                                            v-for="workshop in workshops"
                                            :key="workshop.workshopId"
                                            :label="workshop.workshopName"
                                            :value="workshop.workshopId"
                                            >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="searchDetail"><i class="el-icon-search"></i>搜索</el-button>
                                    <el-button type="primary" @click="insertEnergy"><i class="el-icon-plus"></i>新建</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="tab">
                            <el-table :data="tableData" stripe class="defaultTab allUserTab" highlight-current-row>
                                <el-table-column prop="date" label="日期" min-width="100" :show-overflow-tooltip="true" align="center">
                                    <template slot-scope="scope">
                                        {{fmt.YMDParseTime(scope.row.date)}}
                                    </template>
                                </el-table-column>
                                <el-table-column v-for="(item, index) in col"
                                    :key="`col_${index}`"
                                    :prop="item.prop"
                                    :label="item.fName"
                                    align="center">
                                    <template slot-scope="scope">
                                        {{scope.row[item.prop] == undefined? '--': scope.row[item.prop]}}
                                    </template>
                                </el-table-column>
                                <el-table-column fixed="right" label="总计" min-width="80">
                                    <template slot-scope="scope">
                                        {{ calculateTotal(scope.row) }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" fixed="right" width="120">
                                    <template slot-scope="scope">
                                        <!-- <el-button type="text">&nbsp;详情</el-button> -->
                                        <el-button type="text" @click="updateEnergyRecord(scope.row, scope.$index)">&nbsp;编辑</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="block defaultPage" v-if="condition.sum > 0">
                            <el-pagination id="page"  @size-change="energySizeChange" @current-change="getEnergy":current-page="condition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                            </el-pagination>
                        </div>
                    </div>
                    <div class="right-list" v-show="dynamicOpear">
                        <div class="search">
                            <el-form ref="inputForm" :rules="inputEnergyInfoFormRules" :model="inputForm" class="search-form">
                                <template v-if="inputForm.isDateCanBeChanged">
                                    <el-form-item label="日期" label-width="80px" prop="inputEnergyDateObj">
                                        <el-date-picker type="date" placeholder="日期" class="input-father" v-model="inputForm.inputEnergyDateObj" :picker-options="inputPickerOptions" @change="changeInputEnergyDate"></el-date-picker>
                                    </el-form-item>
                                </template>
                                <template v-else>
                                    <div class="margin-bottom-20">
                                        {{ inputEnergyDateStr.slice(0, 10) }}
                                    </div>
                                </template>

                                <el-alert
                                    title="此日期的数据已存在"
                                    type="warning"
                                    v-if="inputForm.isDataAlreadyPresent" class="margin-bottom-20">
                                </el-alert>

                                <el-alert
                                    title="请输入数据"
                                    type="error"
                                    v-if="inputForm.isNoDataInput" class="margin-bottom-20">
                                </el-alert>
                                <div class="tab margin-bottom-20" >
                                    <el-table :data="inputForm.inputEnergyData" stripe class="defaultTab allUserTab" highlight-current-row>
                                        <el-table-column label="车间" width="100" :show-overflow-tooltip="true" align="center" fixed="left">
                                            <template slot-scope="scope">
                                                {{  getWorkshopName(scope.row.id) }}
                                            </template>
                                        </el-table-column>
                                        <el-table-column v-for="(item, index) in types"
                                            :key="item.fId"
                                            :label="item.fName"
                                            align="center"
                                            min-width="150"
                                            :show-overflow-tooltip="true">
                                            <template slot-scope="scope">
                                                <el-input type="number" v-model="scope.row[item.fId]" class="over-number-input" ref="formInputs">
                                                </el-input>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <el-form-item label-width="10px">
                                    <el-button type="primary" size="small" @click="submitData">确定</el-button>
                                    <el-button size="small" @click="resetEnergyForm('formInputs')">重置</el-button>
                                    <el-button size="small" @click="back">返回</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="right-list" v-show="dynamicDetail">
                        <div class="search">
                            <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                <el-form-item label="开始时间">
                                    <el-date-picker type="date" placeholder="开始时间" class="input-father"></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="tab"></div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='typeModal' :modalTitle="modalTitle1" @closeModal="closeModal('typeForm',typeModal)">
            <div slot="custom-modal-content">
                <el-form v-if="typeFormState" :model="typeForm" :rules="typeFormRules" ref="typeForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型名称" prop="fName">
                                <el-input v-model="typeForm.fName" :maxlength="4" size="small" placeholder="请填写类型名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型单位" prop="fUnit">
                                <el-input v-model="typeForm.fUnit" :maxlength="6" size="small" placeholder="请填写类型单位"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备  注" prop="fRemark">
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
    import { DynamicService } from '@/api/production' // api
    import { common } from "@/utils/common"; // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                dynamicPage: true, // 能耗
                dynamicOpear: false, // 能耗新增或编辑
                dynamicDetail: false, // 能耗详情

                types: [], // 能耗类型集合
                workshops: [], // 车间

                tableData: [], // 能耗集合
                col: [], // 能耗表头
                condition: { // 分页对象
                    currentPage: 1,
                    endTime: '',
                    fEnergyTypeId: '',
                    fWorkshopId: '',
                    pageSize: 10,
                    startTime: '',
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },
                //当前参数
                startTime: '',
                endTime: '',
                fWorkshopId: '',

                // 侧滑弹层
                modalTitle1: '', // 弹层标题
                typeModal: false, // 弹层Modal
                typeForm: {}, // 弹层表单
                typeInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: false, // 是否可删除
                    fName:'', // 类型名称
                    fUnit: '', // 类型单位
                    fRemark: '',
                },
                typeFormState: true,
                typeFormRules: { // 表单校验
                    fName: [
                        {required: true, message: '请填写类型名称', trigger: 'blur'},
                    ],
                    fUnit: [
                        {required: true, message: '请填写类型单位', trigger: 'blur'},
                    ],
                    fRemark: [
                        {required: true, message: '请填写备注', trigger: 'blur'},
                    ]
                },


                inputPickerOptions: {
                    disabledDate(time) {             //输入数据的时候，不能选择今日以上
                        return time.getTime() > Date.now();
                    }
                },
                inputEnergyInfoFormRules: {   //验证输入数据的规则
                    inputEnergyDateObj: [
                        { required: true, message: '日期不能为空', trigger: 'change' }
                    ]
                },
                inputForm: {
                    isUpdateMode: false,  //是否修改数据
                    isDateCanBeChanged: true,
                    inputEnergyDateObj: 0,   //日期毫秒
                    isDataAlreadyPresent: false,  //新增的时候，对应日期的数据是否已经存在
                    inputEnergyData: [],
                    isNoDataInput: false
                },
                dateRange: '',
            }
        },
        computed: {
            inputEnergyDateStr: { //日期字符串: YYYY-MM-DD HH:MM:SS或者YYYY-MM-DD
                get() {
                    if (this.inputForm.inputEnergyDateObj) {
                        return common.YMDHMSParseTime(this.inputForm.inputEnergyDateObj);
                    }
                },

                set(value) {
                    if (value) {
                        this.inputForm.inputEnergyDateObj = new Date(value);
                    } else {
                        this.inputForm.inputEnergyDateObj = null;
                    }
                }
            },
            // dateRange: { //搜索时间区域
            //     get() {
            //         return [
            //             this.condition.startTime,
            //             this.condition.endTime
            //         ];
            //     },

            //     set(dateRange) {
            //         if (dateRange) {
            //             this.condition.startTime = dateRange[0];
            //             this.condition.endTime = dateRange[1];
            //         }
            //     }
            // },
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
                // 获取能耗类型
                this.getType();
                // 获取能耗
                this.getEnergy(1)
                // 获取班组
                this.getWorkshop();
            },
            /**
             * 获取班组集合
             * @return {Array}   查询的结果
             */
            async getWorkshop(){
                let res = await DynamicService.getWorkshop();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0){
                        this.workshops = res.obj;
                    } else {
                        this.workshops = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.workshops = [];
                }
            },
            /**
             * 获取能耗类型
             * @return {Array}   查询的结果
             */
            async getType(){
                let res = await DynamicService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                            this.types = res.obj;
                            this.col = this._.clone(res.obj);
                            // let param = {
                            //     fName: '日期'
                            // }
                            // this.col.unshift(param); // 将对象推到数组第一位
                            for (var i = 0; i < this.col.length; i++) {
                                // if (i == 0) {
                                //     this.col[i].prop = 'date';
                                // } else {
                                this.col[i].prop = 'type' + i;
                                // }
                            };
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
                this.modalTitle1 = '新建能耗类型';
                this.typeModal = true;
                // 清空表单
                this.typeInfor.fId = '';
                this.typeInfor.fIsDelete = false;
                this.typeInfor.fName = '';
                this.typeInfor.fUnit = '';
                this.typeInfor.fRemark = '';
                this.typeForm = this.typeInfor;
            },
            /**
             * 编辑按钮
             */
             updateType(obj){
                this.typeForm = this._.clone(obj);
                this.modalTitle1 = '编辑能耗类型';
                this.typeModal = true;
             },
            /**
             * 删除按钮
             */
            deleteType(obj){
                if (obj.fId == '' || obj.fId == null || obj.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await DynamicService.deleteType(obj.fId);
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
                        if (this.modalTitle1 == '新建能耗类型') {
                            this.insertTypeForm();
                        }
                        if (this.modalTitle1 == '编辑能耗类型') {
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
                let res = await DynamicService.insertType(this.typeForm);
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
                let res = await DynamicService.updateType(this.typeForm);
                if (res.success) {
                    this.closeModal('typeForm',this.typeModal);
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
                    case 'typeForm':
                        this.modalTitle1 = "";
                        this.typeModal = false;
                        this.$refs[form].resetFields();
                        break;
                }
            },
            /**
             * 时间区域change事件
             */
            changeDate(date){
                if (date != null) {
                    this.startTime = date[0];
                    this.endTime = date[1];
                } else {
                    this.startTime = '';
                    this.endTime = '';
                }
            },
            // 搜索
            searchDetail () {
                this.condition.startTime = this.startTime;
                this.condition.endTime = this.endTime;
                this.condition.fWorkshopId = this.fWorkshopId;
                this.getEnergy(1)
            },
            /**
             * 获取能耗
             * @return {Array}   查询的结果
             */
            async getEnergy(val){
                
                this.dynamicPage = true;
                this.dynamicOpear = false;
                this.dynamicDetail = false;

                this.condition.currentPage = val;

                if (this.condition.startTime != '') {
                    this.condition.startTime = common.YMDHMSParseTime(this.condition.startTime);
                }
                if (this.condition.endTime != '') {
                    this.condition.endTime = common.YMDHMSParseTime(this.condition.endTime);
                }
                let res = await DynamicService.getEnergy(this.condition);
                if (res.success) {
                    this.condition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        for(let a of res.obj.items) {
                            for (let b of a.numberAndType) {
                                for (let c of this.col) { // 遍历表头
                                    if (b.energyId == c.fId) { // 匹配数据是那个表头下字段
                                        a[c.prop] = b.num; // 数据增加表头一致性字段并赋值
                                    }
                                }
                            }
                        }
                        this.tableData = res.obj.items;
                    } else {
                        this.tableData = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.tableData = [];
                };
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            energySizeChange(num){
                this.condition.pageSize = num;
                this.getEnergy(1);
            },
            /**
             * 计算每一日的总计
             */
            calculateTotal(row) {
                let energyData = row.numberAndType;
                let energyQnty = energyData.length;
                let total = 0;

                for (let i = 0; i < energyQnty; i++) {
                    total += energyData[i].num;
                }

                return total;
            },
            /**
             * 新增按钮
             */
            async insertEnergy(){
                this.setInputEnergyDataStructure();

                this.dynamicPage = false;
                this.dynamicOpear = true;
                this.dynamicDetail = false;

                let inputForm = this.inputForm;

                inputForm.isUpdateMode = false;
                inputForm.isDateCanBeChanged = true;
                inputForm.isNoDataInput = false;

                let today = new Date;
                let todayStr = common.YMDHMSParseTime(today);

                inputForm.inputEnergyDateObj = today;

                let detailedEnergyData = await this.getdetailedEnergyDataForDate(todayStr);

                if (this.checkDataPresent(detailedEnergyData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInitialEnergyDataForEdit(detailedEnergyData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                }
            },
            /**
             * 编辑按钮
             */
            async updateEnergyRecord(energyData) {
                let inputForm = this.inputForm;

                inputForm.isUpdateMode = true;
                inputForm.isDateCanBeChanged = false;
                inputForm.isDataAlreadyPresent = false;
                inputForm.isNoDataInput = false;
                this.inputEnergyDateStr = energyData.date;

                this.setInputEnergyDataStructure();

                this.dynamicPage = false;
                this.dynamicOpear = true;
                this.dynamicDetail = false;

                let detailedEnergyData = await this.getdetailedEnergyDataForDate();

                if (detailedEnergyData) {
                    this.setInitialEnergyDataForEdit(detailedEnergyData);
                }
            },
            /**
             * 按照车间id获取车间名称
             * @params {string} id  -- 车间id
             */
            getWorkshopName(id) {
                let workshops = this.workshops;
                let workshopsQnty = workshops.length;

                for (let i = 0; i < workshopsQnty; i++) {
                    if (workshops[i].workshopId === id) {
                        return workshops[i].workshopName;
                    }
                }

                return '';
            },
            /**
             * 查看详情数据是否存在
             * @param {Array} detailedEnergyData   -- 详情数据
             */
            checkDataPresent(detailedEnergyData) {
                let present = false;
                let recordsQnty = detailedEnergyData.length;

                for (let i = 0; i < recordsQnty; i++) {
                    let energys = detailedEnergyData[i].typeAndNum;

                    if (energys.length) {
                        present = true;
                    }
                }

                return present;
            },
            /**
             * 初始输入的数据的结构
             * 为了容易把数据给el-table组件绑定，输入的数据的结构是一下的
             * [{
             *  id:...，   - 车间id
             *  'id1': 能耗，         - 'id1'是能耗类型id
             *  ...
             *  'idN': 能耗
             * },
             * ...
             * ]
             */
            setInputEnergyDataStructure() {
                let inputEnergyData = [];
                let workshops = this.workshops;
                let workshopsQnty = workshops.length;
                let types = this.types;
                let typesQnty = types.length;

                for (let i = 0; i < workshopsQnty; i++) {
                    let workshopData = {
                        id: workshops[i].workshopId
                    };

                    for (let j = 0; j < typesQnty; j++) {
                        workshopData[types[j].fId] = null;
                    }
                    inputEnergyData.push(workshopData);
                }
                this.inputForm.inputEnergyData = inputEnergyData;
            },
            /**
             * 编辑的时候，获取详情能耗数据
             */
            async getdetailedEnergyDataForDate() {
                let params = { date: this.inputEnergyDateStr };
                let result =  await DynamicService.getDetailedData(params);

                if (result.success) {
                    return result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },
            /**
             * 修改的时候，把详情数据复制到输入数据的对象
             * @param {Object} detailedEnergyData  -- 接口返回的详情能耗数据
             */
            setInitialEnergyDataForEdit(detailedEnergyData) {
                let detailedDataQnty = detailedEnergyData.length;
                let inputEnergyData = this.inputForm.inputEnergyData;
                let inputEnergyDataQnty = inputEnergyData.length;

                for (let i = 0; i < detailedDataQnty; i++) {
                    let workshopId = detailedEnergyData[i].workshopId;

                    for (let j = 0; j < inputEnergyDataQnty; j++) {
                        if (inputEnergyData[j].id === workshopId) {
                            let energyVolumeData = detailedEnergyData[i].typeAndNum;
                            let energyVolumeDataQnty = energyVolumeData.length;

                            for (let k = 0; k < energyVolumeDataQnty; k++) {
                                let energyTypeId = energyVolumeData[k].typeId;
                                inputEnergyData[j][energyTypeId] = energyVolumeData[k].num;
                            }
                        }
                    }
                }
            },
            /**
             * 选择日期的时候，查看是否已经有这条记录
             */
            async changeInputEnergyDate() {
                let inputForm = this.inputForm;
                let dateStr = '';
                let detailedEnergyData = {};

                if (!this.inputEnergyDateStr) {
                    return;
                }

                dateStr = this.inputEnergyDateStr.slice(0, 10);
                detailedEnergyData = await this.getdetailedEnergyDataForDate(dateStr);

                if (this.checkDataPresent(detailedEnergyData)) {
                    inputForm.isDataAlreadyPresent = true;
                    inputForm.isUpdateMode = true;
                    this.setInitialEnergyDataForEdit(detailedEnergyData);
                } else {
                    inputForm.isDataAlreadyPresent = false;
                    inputForm.isUpdateMode = false;
                    this.resetEnergyForm('formInputs');
                }
            },
            /**
             * 提交数据
             */
            async submitData() {
                let record = null;
                let updateMode = this.inputForm.isUpdateMode;

                if (this.inputForm.isDateCanBeChanged && !this.inputForm.inputEnergyDateObj) {
                    return;
                }

                if (!updateMode) {
                    record = this.setDataForInsertion(this.inputForm.inputEnergyData);
                    if (!record.energy.length) {
                        this.inputForm.isNoDataInput = true;
                        return;
                    }
                } else {
                    record = this.setDataForUpdate(this.inputForm.inputEnergyData);
                    if (!record.length) {
                        this.inputForm.isNoDataInput = true;
                        return;
                    }
                }

                let result = await this.submitEnergyData(record);

                if (result.success) {
                    if (!updateMode) {
                        this.$message.success(result.msg);
                        this.getEnergy(1);
                    } else {
                        this.$message.success(result.msg);
                        this.getEnergy(this.condition.currentPage);
                    }
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 把新增的数据复制到提交数据的结构
             * @param {Object} inputEnergyData  -- 输入的数据
             */
            setDataForInsertion(inputEnergyData) {
                let record = {
                    fDate: '',
                    energy: []
                };
                let types = this.types;
                let typesQnty = types.length;
                let workshops = this.workshops;
                let workshopsQnty = workshops.length;

                record.fDate = this.inputEnergyDateStr;
                for (let i = 0; i < typesQnty; i++) {
                    for (let j = 0; j < workshopsQnty; j++) {
                        let energyTypeId = types[i].fId;
                        let workshopId = workshops[j].workshopId;
                        let volume = this.inputForm.inputEnergyData[j][energyTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                date: this.inputEnergyDateStr,
                                energyTypeId: energyTypeId,
                                workShopId: workshopId,
                                energyNumber: Number(volume),
                                delete: false,
                                remark: '',
                                fId: ''
                            };

                            record.energy.push(dataItem);
                        }
                    }
                }

                return record;
            },

            /**
             * 把编辑的数据复制到提交数据的结构
             * @param {Object} inputEnergyData  -- 输入的数据
             */
            setDataForUpdate(inputEnergyData) {
                let record = [];
                let types = this.types;
                let typesQnty = types.length;
                let workshops = this.workshops;
                let workshopsQnty = workshops.length;
                let date = '';

                date = this.inputEnergyDateStr;
                for (let i = 0; i < typesQnty; i++) {
                    for (let j = 0; j < workshopsQnty; j++) {
                        let energyTypeId = types[i].fId;
                        let workshopId = workshops[j].workshopId;
                        let volume =  this.inputForm.inputEnergyData[j][energyTypeId];

                        if (volume !== '' && volume !== null) {
                            let dataItem = {
                                date: date,
                                energyId: energyTypeId,
                                workshopId: workshopId,
                                num: Number(volume)
                            };

                            record.push(dataItem);
                        }
                    }
                }

                return record;
            },
            /**
             * 提交能耗数据
             * @param {Object} inputEnergyDataRecord  -- 输入的能耗数据
             * @returns {boolean}
             */
            async submitEnergyData(inputEnergyDataRecord) {
                let res = {};

                console.log(inputEnergyDataRecord);
                if (!this.inputForm.isUpdateMode) {
                    res = await DynamicService.insertEnergyVolumeData(inputEnergyDataRecord);
                } else {
                    res = await DynamicService.updateEnergyVolumeData(inputEnergyDataRecord);
                }

                return res;
            },
            /**
             * 清理表单
             * @param {string}  formName    -- 表单名称
             */
            async resetEnergyForm(formName) {
                let inputRefs = this.$refs[formName];
                let inputsQnty = inputRefs.length;

                for (let i = 0; i < inputsQnty; i++) {
                    inputRefs[i].clear();
                }

                let detailedEnergyData = await this.getdetailedEnergyDataForDate(this.inputEnergyDateStr);

                if (this.checkDataPresent(detailedEnergyData)) {
                    this.setInitialEnergyDataForEdit(detailedEnergyData);
                }

                this.inputForm.isNoDataInput = false;
            },
            /**
             * 返回
             */
            back(){
                this.dynamicPage = true;
                this.dynamicOpear = false;
                this.dynamicDetail = false;
            },
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
    .dynamic-page {
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
                    .type-div {
                        .type-info:hover {
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
                        .type-info {
                            position: relative;
                            border-top: 4px solid #e7eaec;
                            height: 100px;
                            line-height: 30px;
                            font-size: 16px;
                            text-align: left;
                            padding-left: 30px;
                            margin: 0px 15px 10px 15px;
                            box-shadow: 0px 0px 9px 2px rgba(54,58,65,0.1);
                            color: #545454;
                            .type-name {
                                margin-top: 14px;
                                font-weight: 700;
                            }
                            .type-unit {
                                font-style: italic;
                                color: #CBD1D8;
                                font-size: 15px;
                            }
                            .type-remark {
                                word-break: break-all;
                                overflow: hidden;
                                display: -webkit-box;
                                -webkit-box-orient: vertical;
                                -webkit-line-clamp: 3;
                                color: #CBD1D8;
                                line-height: 20px;
                                font-size: 13px;
                                position: absolute;
                                left: 90px;
                                top: 16px;
                                width: calc(100% - 160px);
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
                height: calc(100vh - 120px) ;
                padding: 20px 20px 10px 20px;
            }
        }
    }
    .margin-bottom-20 {
        margin-bottom: 20px;
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .over-number-input {
        .el-input__inner {
            padding: 0 0 0 15px!important;
        }
    }
</style>