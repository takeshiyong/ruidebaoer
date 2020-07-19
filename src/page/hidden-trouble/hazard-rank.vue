/*
* @Author: 王侃
* @Date:   2019-08-06
* @Description: '隐患级别'
*/
<template>
    <div class="hazard-rank-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="级别">
                        <el-input placeholder="请输入类型" clearable size="small" class="input-father" v-model="fName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getLevel"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertLevel"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="levels" class="defaultTab hazard-rank-tab" highlight-current-row row-key="fId">
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fLevelName" label="级别名称" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fLevelNo" label="级别编号" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="奖惩规则" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-popover trigger="click" placement="left">
                                <div v-if="scope.row.reward.length == 0 ">
                                    <div class="reward">
                                        <span class="description">暂未配置~</span>
                                        <el-button type="text" @click="setReward(scope.row)">立即配置</el-button>
                                    </div>
                                </div>
                                <div v-for="(item, index) in scope.row.reward" :key="index" class="reward">
                                    <span>{{item.fName}}</span>
                                    <hr>
                                    <p v-if="item.fTimeLimit != null">
                                        超时时长：
                                        <span>{{item.fTimeLimit}}&nbsp;时</span>
                                    </p>
                                    <p>
                                        积分奖惩：
                                        <span v-if="item.fIntegralNumber == 0">--</span>
                                        <span v-else-if="item.fChangeType == true">+{{item.fIntegralNumber}}</span>
                                        <span v-else>-{{item.fIntegralNumber}}</span>
                                    </p>
                                    <p>
                                        现金奖惩：
                                        <span v-if="item.fMoneyNumber == 0">--</span>
                                        <span v-else-if="item.fMoneyType == true">+{{item.fMoneyNumber}}</span>
                                        <span v-else>-{{item.fMoneyNumber}}</span>
                                    </p>
                                </div>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">规则详情</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateLevel(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteLevel(scope.row)">&nbsp;删除</el-button>
                            <el-button type="text" @click="setReward(scope.row)">&nbsp;奖惩</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='levelModal' :modalTitle="modalTitle" @closeModal="closeModal('levelForm',levelModal)">
            <div slot="custom-modal-content">
                <el-form v-if="levelFormState" :model="levelForm" :rules="levelFormRules" ref="levelForm" label-width="80px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="级别名称" prop="fLevelName">
                                <el-input v-model="levelForm.fLevelName" :maxlength="10" size="small" placeholder="请填写级别名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="级别编号" prop="fLevelNo">
                                <el-input v-model="levelForm.fLevelNo" :maxlength="10" size="small" placeholder="请填写级别编号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('levelForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('levelForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <TheDialog :modal='rewardModal' modalTitle="奖惩配置" @closeModal="closeModal('rewardForm',rewardModal)">
            <div slot="custom-modal-content">
                <el-form v-if="rewardFormState" :model="rewardForm" :rules="rewardFormRules" ref="rewardForm" label-width="80px">
                    <div style="line-height:50px;margin-bottom:20px;">
                        奖励隐患上报人
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="积分规则" prop="fIntegralRuleId1">
                                <el-select clearable filterable  placeholder="请选择" v-model="rewardForm.fIntegralRuleId1" class="wpct-100" popper-class="integralRuleInfo">
                                    <el-option
                                        v-for="item in integralRules"
                                        :key="item.fId"
                                        :label="item.fName"
                                        :value="item.fId">
                                        <p style="float: left">
                                            {{ item.fName }}
                                        </p>
                                        <br>
                                        <span style="float: left; color: #8492a6; font-size: 12px;">
                                            积分奖惩：
                                            <span v-if="item.fIntegralNumber == 0">--</span>
                                            <span v-else-if="item.fChangeType == true">+{{item.fIntegralNumber}}</span>
                                            <span v-else>-{{item.fIntegralNumber}}</span>
                                            <span></span>
                                            现金奖惩：
                                            <span v-if="item.fMoneyNumber == 0">--</span>
                                            <span v-else-if="item.fMoneyType == true">+{{item.fMoneyNumber}}</span>
                                            <span v-else>-{{item.fMoneyNumber}}</span>
                                        </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div style="line-height:50px;margin-bottom:20px;">
                        隐患单位确认隐患超时
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="超时时长" prop="fTimeLimit2">
                                <el-input type="number" v-model="rewardForm.fTimeLimit2" class="over-time-input" :min="1">
                                    <template slot="append">时</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="积分规则" prop="fIntegralRuleId2">
                                <el-select clearable filterable  placeholder="请选择" v-model="rewardForm.fIntegralRuleId2" class="wpct-100" popper-class="integralRuleInfo">
                                    <el-option
                                        v-for="item in integralRules"
                                        :key="item.fId"
                                        :label="item.fName"
                                        :value="item.fId">
                                        <p style="float: left">
                                            {{ item.fName }}
                                        </p>
                                        <br>
                                        <span style="float: left; color: #8492a6; font-size: 12px;">
                                            积分奖惩：
                                            <span v-if="item.fIntegralNumber == 0">--</span>
                                            <span v-else-if="item.fChangeType == true">+{{item.fIntegralNumber}}</span>
                                            <span v-else>-{{item.fIntegralNumber}}</span>
                                            <span></span>
                                            现金奖惩：
                                            <span v-if="item.fMoneyNumber == 0">--</span>
                                            <span v-else-if="item.fMoneyType == true">+{{item.fMoneyNumber}}</span>
                                            <span v-else>-{{item.fMoneyNumber}}</span>
                                        </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div style="line-height:50px;margin-bottom:20px;">
                        惩罚隐患单位负责人
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="积分规则" prop="fIntegralRuleId3">
                                <el-select clearable filterable  placeholder="请选择" v-model="rewardForm.fIntegralRuleId3" class="wpct-100" popper-class="integralRuleInfo">
                                    <el-option
                                        v-for="item in integralRules"
                                        :key="item.fId"
                                        :label="item.fName"
                                        :value="item.fId">
                                        <p style="float: left">
                                            {{ item.fName }}
                                        </p>
                                        <br>
                                        <span style="float: left; color: #8492a6; font-size: 12px;">
                                            积分奖惩：
                                            <span v-if="item.fIntegralNumber == 0">--</span>
                                            <span v-else-if="item.fChangeType == true">+{{item.fIntegralNumber}}</span>
                                            <span v-else>-{{item.fIntegralNumber}}</span>
                                            <span></span>
                                            现金奖惩：
                                            <span v-if="item.fMoneyNumber == 0">--</span>
                                            <span v-else-if="item.fMoneyType == true">+{{item.fMoneyNumber}}</span>
                                            <span v-else>-{{item.fMoneyNumber}}</span>
                                        </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div style="line-height:50px;margin-bottom:20px;">
                        隐患单位处理隐患超时
                        <hr>
                    </div>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="积分规则" prop="fIntegralRuleId4">
                                <el-select clearable filterable  placeholder="请选择" v-model="rewardForm.fIntegralRuleId4" class="wpct-100" popper-class="integralRuleInfo">
                                    <el-option
                                        v-for="item in integralRules"
                                        :key="item.fId"
                                        :label="item.fName"
                                        :value="item.fId">
                                        <p style="float: left">
                                            {{ item.fName }}
                                        </p>
                                        <br>
                                        <span style="float: left; color: #8492a6; font-size: 12px;">
                                            积分奖惩：
                                            <span v-if="item.fIntegralNumber == 0">--</span>
                                            <span v-else-if="item.fChangeType == true">+{{item.fIntegralNumber}}</span>
                                            <span v-else>-{{item.fIntegralNumber}}</span>
                                            <span></span>
                                            现金奖惩：
                                            <span v-if="item.fMoneyNumber == 0">--</span>
                                            <span v-else-if="item.fMoneyType == true">+{{item.fMoneyNumber}}</span>
                                            <span v-else>-{{item.fMoneyNumber}}</span>
                                        </span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitRewardForm('rewardForm')" size="small">确定</el-button>
                        <el-button @click="resetRewardForm('rewardForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import Sortable from "sortablejs" // sortablejs
    import { LevelService } from '@/api/hidden-trouble' // api
    import { PointService } from '@/api/personal-info' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            let LevelName = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('请填写级别名称'));
                } else {
                    callback();
                }
            };
            let LevelNo = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('请填写级别编号'));
                } else {
                    callback();
                }
            };
            return {
                fName: '', // 名称
                levels: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                levelModal: false, // 弹层Modal
                levelForm: {}, // 弹层表单
                levelInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: true, // 是否可删除
                    fLevelName:'', // 级别名称
                    fLevelNo: '', // 级别编号
                    fSort:0 // 排序
                },
                levelFormState: true,
                levelFormRules: { // 表单校验
                    fLevelName: [
                        { validator: LevelName,required: true, trigger: 'blur' }
                    ],
                    fLevelNo: [
                        { validator: LevelNo,required: true, trigger: 'blur' }
                    ],
                },

                rewardModal: false, // 弹层Modal
                rewardForm: {}, // 弹层表单
                rewardInfor: { // 初始化空表单
                    fLevel: '', // 隐患级别
                    // 奖励隐患上报人
                    fId1: '', // id
                    fIntegralRuleId1: '', // 规则id
                    fType1: 1,
                    // 隐患单位确认隐患超时
                    fId2: '', // id
                    fIntegralRuleId2: '', // 规则id
                    fTimeLimit2: 1,
                    fType2: 3,
                    // 惩罚隐患单位负责人
                    fId3: '', // id
                    fIntegralRuleId3: '', // 规则id
                    fType3: 2,
                    // 隐患单位处理隐患超时
                    fId4: '', // id
                    fIntegralRuleId4: '', // 规则id
                    fType4: 4,
                },
                rewardFormState: true,
                rewardFormRules: { // 表单校验
                    fIntegralRuleId1: [
                        { required: true, message: '请选择积分规则', trigger: 'change' }
                    ],
                    fTimeLimit2: [
                        { required: true, message: '请填写超时时长', trigger: 'blur' }
                    ],
                    fIntegralRuleId2: [
                        { required: true, message: '请选择积分规则', trigger: 'change' }
                    ],
                    fIntegralRuleId3: [
                        { required: true, message: '请选择积分规则', trigger: 'change' }
                    ],
                    fIntegralRuleId4: [
                        { required: true, message: '请选择积分规则', trigger: 'change' }
                    ]
                },

                integralRules: [], // 积分规则集合
            }
        },
        components: {
            TheDialog,
        },
        mounted: function(){
            this.init();
            this.rowDrop();
        },
        methods: {
            /**
             * 页面初始化
             */
            init(){
                // 获取隐患级别
                this.getLevel();
                // 获取积分规则
                this.getIntegralRules();
            },
            /**
             * 行拖拽
             */
            rowDrop() {
                const tbody = document.querySelector('.el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.levels.splice(oldIndex, 1)[0]
                        _this.levels.splice(newIndex, 0, currRow)
                        _this.levels.some((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
                            item.fSort = index + 1;
                        })
                        _this.updateSort(_this.levels); // 提交请求
                    }
                })
            },
            /**
             * 获取隐患级别
             * @return {Array}   查询的结果
             */
            async getLevel(){
                let res = await LevelService.getLevel();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        for (let item of res.obj){
                            let res1 = await LevelService.getReward(item.fId);
                            if (res1.success) {
                                if (res1.obj != null && res1.obj !=undefined && res1.obj.length >0) {
                                    item.reward = res1.obj;
                                } else {
                                    item.reward = [];
                                }
                            } else{
                                item.reward = [];
                                this.$message.warning(res.msg);
                            };
                        }
                        if (this.fName != '') {
                            this.levels = common.fuzzyQuery(res.obj, this.fName, 'fLevelName');
                        } else {
                            this.levels = res.obj;
                        }
                    } else {
                        this.levels = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.levels = [];
                };
            },
            /**
             * 获取积分规则
             * @return {Array}   查询的结果
             */
            async getIntegralRules(){
                let res = await PointService.getIntegralRules();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length) {
                        this.integralRules = res.obj;
                        console.log(this.integralRules);
                    } else {
                        this.integralRules = [];
                    }
                } else {
                    this.integralRules = [];
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 新增按钮
             */
            insertLevel(){
                // 初始化弹层
                this.modalTitle = '新建隐患级别';
                this.levelModal = true;
                // 清空表单
                this.levelInfor.fId = '';
                this.levelInfor.fIsDelete = true;
                this.levelInfor.fLevelName = '';
                this.levelInfor.fLevelNo = '';
                this.levelInfor.fSort = 0;
                this.levelForm = this.levelInfor;
            },
            /**
             * 编辑按钮
             */
            updateLevel(row){
                this.levelForm = this._.clone(row);
                this.modalTitle = '编辑隐患级别';
                this.levelModal = true;
            },
            /**
             * 删除按钮
             */
            deleteLevel(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await LevelService.deleteLevel(row.fId);
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
                        if (this.modalTitle == '新建隐患级别') {
                            this.insertLevelForm();
                        }
                        if (this.modalTitle == '编辑隐患级别') {
                            this.updateLevelForm();
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
            async insertLevelForm(){
                let res = await LevelService.insertLevel(this.levelForm);
                if (res.success) {
                    this.closeModal('levelForm',this.levelModal);
                    this.$message.success(res.msg);
                    this.getLevel();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateLevelForm(){
                let res = await LevelService.updateLevel(this.levelForm);
                if (res.success) {
                    this.closeModal('levelForm',this.levelModal);
                    this.$message.success(res.msg);
                    this.getLevel();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 排序请求
             * @param {object}     提交的表单对象
             */
            async updateSort(arr){
                let param = {
                    troubleLevels: arr
                };
                let res = await LevelService.updateSort(param);
                if (res.success) {
                    this.$message.success(res.msg);
                } else{
                    this.$message.warning(res.msg);
                    this.getLevel();
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                switch(form){
                    case 'levelForm':
                        this.levelModal = false;
                        break;
                    case 'rewardForm':
                        this.rewardModal = false;
                        break;
                }
                this.$refs[form].resetFields();
            },
            /**
             * 将成配置按钮
             */
            setReward(row){
                // 判断是否已配置奖惩
                if (row.reward.length !=0){ // 修改已有的奖惩配置
                    let params = {
                        fLevel: '', // 隐患级别
                        // 奖励隐患上报人
                        fId1: '', // id
                        fIntegralRuleId1: '', // 规则id
                        fType1: 1,
                        // 隐患单位确认隐患超时
                        fId2: '', // id
                        fIntegralRuleId2: '', // 规则id
                        fTimeLimit2: 1,
                        fType2: 3,
                        // 惩罚隐患单位负责人
                        fId3: '', // id
                        fIntegralRuleId3: '', // 规则id
                        fType3: 2,
                        // 隐患单位处理隐患超时
                        fId4: '', // id
                        fIntegralRuleId4: '', // 规则id
                        fType4: 4,
                    }
                    params.fLevel = row.fId;
                    for (let item of row.reward) {
                        switch(item.fType){
                            case 1:
                                params.fId1 = item.fId;
                                params.fIntegralRuleId1 = item.fIntegralRuleId;
                                break;
                            case 2:
                                params.fId3 = item.fId;
                                params.fIntegralRuleId3 = item.fIntegralRuleId;
                                break;
                            case 3:
                                params.fId2 = item.fId;
                                params.fIntegralRuleId2 = item.fIntegralRuleId;
                                params.fTimeLimit2 = item.fTimeLimit;
                                break;
                            case 4:
                                params.fId4 = item.fId;
                                params.fIntegralRuleId4 = item.fIntegralRuleId;
                                break;
                        }
                    }
                    this.rewardForm = this._.clone(params);
                    this.rewardModal = true;
                } else { // 新建奖惩配置
                    this.rewardModal = true;
                    this.rewardInfor.fLevel = row.fId;
                    this.rewardInfor.fId1 = '';
                    this.rewardInfor.fIntegralRuleId1 = '';
                    this.rewardInfor.fId2 = '';
                    this.rewardInfor.fIntegralRuleId2 = '';
                    this.rewardInfor.fTimeLimit2 = 1;
                    this.rewardInfor.fId3 = '';
                    this.rewardInfor.fIntegralRuleId3 = '';
                    this.rewardInfor.fId4 = '';
                    this.rewardInfor.fIntegralRuleId4 = '';
                    this.rewardForm = this.rewardInfor;
                }
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitRewardForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.saveBatch();
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
            resetRewardForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async saveBatch(){
                let params = {
                    fLevel: this.rewardForm.fLevel,
                    tHiddenIntegralRules: [],
                }
                let obj1 = {
                    fId: this.rewardForm.fId1,
                    fIntegralRuleId: this.rewardForm.fIntegralRuleId1,
                    fType: 1
                }
                params.tHiddenIntegralRules.push(obj1);
                let obj2 = {
                    fId: this.rewardForm.fId2,
                    fIntegralRuleId: this.rewardForm.fIntegralRuleId2,
                    fTimeLimit: this.rewardForm.fTimeLimit2,
                    fType: 3
                }
                params.tHiddenIntegralRules.push(obj2);
                let obj3 = {
                    fId: this.rewardForm.fId3,
                    fIntegralRuleId: this.rewardForm.fIntegralRuleId3,
                    fType: 2
                }
                params.tHiddenIntegralRules.push(obj3);
                let obj4 = {
                    fId: this.rewardForm.fId4,
                    fIntegralRuleId: this.rewardForm.fIntegralRuleId4,
                    fType: 4
                }
                params.tHiddenIntegralRules.push(obj4);
                let res = await LevelService.saveBatch(params);
                if (res.success) {
                    this.closeModal('rewardForm',this.rewardModal);
                    this.$message.success(res.msg);
                    this.getLevel();
                } else{
                    this.$message.warning(res.msg);
                };
            },
        },
        watch: {
            'levelForm': function(obj) {
                this.levelFormState = false;
                this.$nextTick(() => {
                    this.levelFormState = true;
                })
                this.$forceUpdate();
            },
            'rewardForm': function(obj) {
                this.rewardFormState = false;
                this.$nextTick(() => {
                    this.rewardFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .hazard-rank-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
        }
    }
    .el-popover {
        .reward {
            padding: 0px 10px;
            margin-top: 10px;
            line-height: 30px;
            .description {
                color: #c0c4cc;
                font-size: 12px;
            }
        }
    }
    .wpct-100 {
        width: 100%;
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .hazard-rank-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 220px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
    .integralRuleInfo {
        .el-scrollbar .el-select-dropdown__list .el-select-dropdown__item {
            height: 72px!important;
        }
    }
    .over-time-input {
        .el-input__inner {
            border: 1px solid #DCDFE6!important;
            padding: 0 0 0 15px!important;
            border-right: none!important;
        }
        .el-input.is-active .el-input__inner, .el-input__inner:focus {
            border-color: #DCDFE6!important;
        }
    }
</style>