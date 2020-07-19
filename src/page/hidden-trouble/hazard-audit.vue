/*
* @Author: 王侃
* @Date:   2019-08-01
* @Description: '隐患审核': 安环部可看页面  隐患状态： “待审核”、“待研判”
*/
<template>
    <div class="hazard-review-page">
        <div class="container">
            <!-- 搜索条件 1.状态：待审核、待研判 2.时间段：上报时间 3.隐患级别 4.隐患类型-->
            <div class="search">
                <div class="state">
                    <el-button type="primary" plain :class="{'btn-chosed': state == '全部'}" @click="chosedState('全部')">全部</el-button>
                    <el-button type="primary" plain :class="{'btn-chosed': state == '待审核'}" @click="chosedState('待审核')">待审核</el-button>
                    <el-button type="primary" plain :class="{'btn-chosed': state == '待研判'}" @click="chosedState('待研判')">待研判</el-button>
                </div>
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="时间区域">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间" class="input-picker" @change="changeDate">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="隐患级别">
                        <el-select v-model="condition.fLevelId" placeholder="请选择隐患级别" filterable clearable class="input-father">
                            <el-option v-for="level in levels" :key="level.fId" :label="level.fLevelName" :value="level.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="隐患类型">
                        <el-select v-model="condition.fTypeId" placeholder="请选择隐患类型" filterable clearable class="input-father">
                            <el-option v-for="type in types" :key="type.fId" :label="type.fTypeName" :value="type.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getHiddenTrouble(1)"><i class="el-icon-search"></i>搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 列表内容 1.隐患级别 2.隐患类型 3.检查日期 4.检查地点 5.隐患描述 6.上报人
                 列表操作 1.审核 2.研判 -->
            <div class="tab">
                <el-table :data="hiddenTroubles" class="defaultTab hazard-review-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fState" label="状态" min-width="60">
                        <template slot-scope="scope">
                            <el-tag size="mini">{{scope.row.fState == '1'? '待审核':'待研判'}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fTypeName" label="隐患类型" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.fTypeName == '' || scope.row.fTypeName == undefined || scope.row.fTypeName == null? '--':scope.row.fTypeName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fContent" label="隐患描述" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fReportTime" label="检查日期" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fSite" label="检查地点" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fReportUserName" label="上报人" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="scope.row.fState == '1'?audit(scope.row):judged(scope.row)">&nbsp;{{scope.row.fState == '1'?'审核':'研判'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.审核 -->
        <TheDialog :modal='auditModal' modalTitle="隐患审核" @closeModal="closeModal('auditInfo',auditModal)">
            <div slot="custom-modal-content">
                <el-form label-width="160px">
                    <el-form-item label="隐患类型：">
                        <div>{{auditInfo.fTypeName}}</div>
                    </el-form-item>
                    <el-form-item label="隐患描述：">
                        <div>{{auditInfo.fContent}}</div>
                        <div v-for="(item, index) in auditInfo.reportImg" :key="index" style="display: inline-block; margin-right:10px;">
                            <div v-if="item.fType == 1" class="img-div">
                                <img :src="previewUrl+item.fFileLocationUrl" alt="">
                                <div class="img-action">
                                    <span class="preview-icon" @click="previewImg(previewUrl+item.fFileLocationUrl)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                </div>
                            </div>
                            <div v-if="item.fType == 2" class="video-div">
                                <video :src="previewUrl+item.fFileLocationUrl" autoplay="autoplay" preload="auto" controls="controls" loop="loop">
                                </video>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="检查日期：">
                        <div>{{auditInfo.fReportTime}}</div>
                    </el-form-item>
                    <el-form-item label="检查地点：">
                        <div>{{auditInfo.fSite}}</div>
                    </el-form-item>
                    <el-form-item label="上报人员：">
                        <div>{{auditInfo.fReportUserName}}</div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="passAudit(auditInfo)">审核通过</el-button>
                        <el-button size="small" @click="nopassAudit(auditInfo)">审核不通过</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 2.研判 -->
        <TheDialog :modal='judgedModal' modalTitle="隐患研判" @closeModal="closeModal('judgedForm',judgedModal)">
            <div slot="custom-modal-content">
                <el-form v-if="judgedFormState" :model="judgedForm" :rules="judgedFormRules" ref="judgedForm" label-width="160px">
                    <el-form-item label="隐患类型" prop="fTypeId">
                        <el-select filterable v-model="judgedForm.fTypeId" clearable placeholder="类型" class="wpx-400">
                            <el-option v-for="item in types" :key="item.fId" :label="item.fTypeName" :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="隐患照片">
                        <div v-for="(item, index) in pics" :key="index" style="display: inline-block; margin-right:10px;">
                            <div v-if="item.fType == 1" class="img-div">
                                <img :src="previewUrl+item.fFileLocationUrl" alt="">
                                <div class="img-action">
                                    <span class="preview-icon" @click="previewImg(previewUrl+item.fFileLocationUrl)">
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                </div>
                            </div>
                            <div v-if="item.fType == 2" class="video-div">
                                <video :src="previewUrl+item.fFileLocationUrl" autoplay="autoplay" preload="auto" controls="controls" loop="loop">
                                </video>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="隐患描述" prop="fContent">
                        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" v-model="judgedForm.fContent" class="wpx-400"></el-input>
                    </el-form-item>
                    <el-form-item label="隐患地点" prop="fSite">
                        <el-input placeholder="地点" clearable size="small" v-model="judgedForm.fSite" class="wpx-400" ></el-input>
                    </el-form-item>
                    <el-form-item label="隐患级别" prop="fLevelId">
                        <el-select filterable v-model="judgedForm.fLevelId" clearable placeholder="级别" class="wpx-400" >
                            <el-option v-for="item in levels" :key="item.fId" :label="item.fLevelName" :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="下发部门" prop="depIds">
                        <el-cascader @change="depChange" v-model="judgedForm.depIds" clearable change-on-select :options="deps" :props="depProps" :show-all-levels="false" placeholder="请选择部门" class="wpx-400"></el-cascader>
                    </el-form-item>
                    <el-form-item label="整改措施" prop="fMeasures">
                        <el-input type="textarea" v-model="judgedForm.fMeasures" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入内容" class="wpx-400" ></el-input>
                    </el-form-item>
                    <el-form-item label="整改期限" prop="fPlanFinishTime">
                        <el-date-picker v-model="judgedForm.fPlanFinishTime" type="datetime" placeholder="选择日期时间" align="right" :picker-options="pickerOptions"  class="wpx-400">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="重复隐患" prop="fIsRepeat">
                        <el-radio-group style="line-height:inherit!important;" v-model="judgedForm.fIsRepeat" class="wpx-400" >
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="前端显示" prop="fIsRelease">
                        <el-radio-group style="line-height:inherit!important;" v-model="judgedForm.fIsRelease" class="wpx-400" >
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="抄 送 人" prop="disposeUsers">
                          <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入姓名" v-model="judgedForm.disposeUsers" :titles="['人员列表', '抄送人']" :data="users" @change="disposeUsersChange">
                          </el-transfer>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="issue('judgedForm')">下发</el-button>
                        <el-button size="small" @click="reset('judgedForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>
<script>
    import { StartegyService } from '@/api/personal-info' // api
    import { LevelService, TypeService, HiddenTroubleService } from '@/api/hidden-trouble' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { common } from "@/utils/common"; // common
    export default {
        data() {
            var FDepId = (rule, value, callback) => {
                if (this.judgedForm.depIds.length == 0) {
                    callback(new Error('请选择部门'));
                }
                else {
                    callback();
                }
            };
            return {
                state: '全部',

                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },

                previewUrl: process.env.PREVIEW_API, // 文件ip
                dialogImageUrl: '', // 图片预览路径
                dialogVisible: false, // 图片预览弹窗

                fName: '',
                levels: [], // 隐患级别
                types: [], // 隐患类型
                // 条件对象
                condition: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页大小
                    fState: [1,2], // 状态集合
                    fLevelId: '', // 隐患级别id
                    fTypeId: '', // 隐患类型id
                    fReportBeginTime: '', // 上报开始时间
                    fReportEndTime: '', // 上报结束时间
                    fReportUserId: '', // 上报人id
                    fDutyDepId: '', // 责任部门id
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0,
                },
                hiddenTroubles: [], // 列表集合

                // 审核弹层
                auditModal: false, // 弹层Modal
                auditInfo: {}, // 上报隐患的详情

                // 研判弹层
                judgedModal: false, // 弹层Modal
                judgedFormState: true,
                judgedForm: {

                },
                judgedFormRules: {
                    fTypeId: [
                        { required: true, message: '请选择隐患类型', trigger: 'change' }
                    ],
                    fSite: [
                        { required: true, message: '请填写隐患地点', trigger: 'blur' }
                    ],
                    fContent: [
                        { required: true, message: '请填写隐患内容', trigger: 'blur' }
                    ],
                    fLevelId: [
                        { required: true, message: '请选择隐患级别', trigger: 'change' }
                    ],
                    depIds: [
                        { required: true, validator: FDepId,}
                    ],
                    fMeasures: [
                        { required: true, message: '请填写整改措施', trigger: 'blur' }
                    ],
                    fPlanFinishTime: [
                        { required: true, message: '请选择整改期限', trigger: 'change' }
                    ],
                    disposeUsers: [
                        { required: true, message: '请选择抄送人', trigger: 'change' }
                    ],
                },
                pics: [], // 隐患图片视频集合
                deps: [], // 部门集合
                depProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },

                auditObj: { // 审核对象
                    fAuditCause: '', // 不通过原因
                    fId: '', // 隐患id
                    fIsThrough: true // 是否通过
                },

                users: [], // 用户集合

                dateRange: ''
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
             * 按钮选择
             */
            chosedState(state){
                this.state = state;
                switch(state){
                    case '全部':
                        this.condition.fState = [1,2];
                        this.getHiddenTrouble(1);
                        break;
                    case '待审核':
                        this.condition.fState = [1];
                        this.getHiddenTrouble(1);
                        break;
                    case '待研判':
                        this.condition.fState = [2];
                        this.getHiddenTrouble(1);
                        break;
                }
            },
            /**
             * 时间区域change事件
             */
            changeDate(date){
                if (date != null) {
                    this.condition.fReportBeginTime = date[0];
                    this.condition.fReportEndTime = date[1];
                } else {
                    this.condition.fReportBeginTime = '';
                    this.condition.fReportEndTime = '';
                }
            },
            /**
             * 页面初始化
             */
            init(){
                // 获取隐患
                this.getHiddenTrouble(1);
                // 获取隐患级别
                this.getLevel();
                // 获取隐患类型
                this.getType();
                // 获取部门
                this.initDep();
                // 获取人员
                this.initUsers();
            },
            /**
             * 获取隐患列表（状态为“待审核”和“待研判”）
             * @return {Array}   查询的结果
             */
            async getHiddenTrouble(val){
                this.condition.currentPage = val;
                let res = await HiddenTroubleService.getHiddenTrouble(this.condition);
                if (res.success) {
                    this.condition.sum =res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.hiddenTroubles = res.obj.items;
                    } else {
                        this.hiddenTroubles = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.hiddenTroubles = [];
                };
            },
            /**
             * 获取隐患级别
             * @return {Array}   查询的结果
             */
            async getLevel(){
                let res = await LevelService.getLevel();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.levels = res.obj;
                    } else {
                        this.levels = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.levels = [];
                };
            },
            /**
             * 获取隐患类型
             * @return {Array}   查询的结果
             */
            async getType(){
                let res = await TypeService.getType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.types = res.obj;
                    } else {
                        this.types = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.types = [];
                };
            },
            /**
             * 获取部门树
             * @return {Array}   查询的结果
             */
            async initDep(){
                let res = await StartegyService.getDeps();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.deps = res.obj;
                    } else {
                        this.deps = [];
                    }
                } else {
                    console.log(res.msg);
                    this.deps = [];
                }
            },
            /**
             * 部门change事件
             */
            depChange(val){
                this.judgedForm.fDutyDepId = val[val.length - 1];
            },
            /**
             * 获取人员
             * @return {Array}   查询的结果
             */
            async initUsers(){
                let res = await StartegyService.getAllUser();
                if ( res.success ) {
                    if (res.obj != null && res.obj !=undefined && res.obj.length >0) {
                        res.obj.forEach((item, index) => {
                            item.label = item.fUserName;
                            item.key = index;
                            item.fUserName = item.fUserName;
                        })
                        this.users = res.obj;
                    } else {
                        this.users = [];
                    }
                } else {
                    this.users = [];
                }
            },
            /**
             * 获取隐患信息
             * @return {Object}   查询的结果
             */
            async getHiddenTroubleInfo(id){
                this.auditInfo = {};
                let res = await HiddenTroubleService.getHiddenTroubleInfo(id);
                if (res.success) {
                    this.auditInfo = res.obj;
                } else{
                    this.$message.warning(res.msg);
                    this.auditInfo = {};
                };
            },
            /**
             * 审核按钮
             */
            async audit(obj){
                // 初始化弹层
                this.auditModal = true;
                this.auditInfo = {};
                let res = await HiddenTroubleService.getHiddenTroubleInfo(obj.fId);
                if (res.success) {
                    this.auditInfo = res.obj;
                } else{
                    this.$message.warning(res.msg);
                    this.auditInfo = {};
                };
            },
            /**
             * 研判按钮
             */
            async judged(obj){
                let res = await HiddenTroubleService.getHiddenTroubleInfo(obj.fId);
                if (res.success) {
                    let param = { // 研判对象
                        fId: obj.fId,
                        fTypeId: res.obj.fTypeId, // 隐患类型id
                        fSite: res.obj.fSite, // 隐患地点
                        fContent: res.obj.fContent, // 隐患内容
                        fLevelId: '', // 隐患级别id
                        fDutyDepId: '', // 下发单位id
                        fMeasures: '', // 整改措施
                        fPlanFinishTime: '', // 整改期限
                        fIsRepeat: false, // 是否重复隐患
                        fIsRelease: true,// 是否前端显示
                        fDisposeUsers: [], // 抄送人
                        disposeUsers: [],
                        depIds: [],
                    };
                    this.judgedForm = this._.clone(param);
                    this.pics = res.obj.reportImg;

                    // 初始化弹层
                    this.judgedModal = true;
                } else{
                    this.$message.warning(res.msg);
                    this.judgedForm = {};
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                switch(form) {
                    case 'auditInfo':
                        this.auditModal = false;
                        break;
                    case 'judgedForm':
                        this.judgedModal = false;
                        this.$refs[form].resetFields();
                        break;
                }
            },
            // 图片预览
            previewImg(url){
                this.dialogImageUrl = url;
                this.dialogVisible = true;
            },
            /**
             * 审核通过按钮
             */
            passAudit(obj){
                let param = {
                    fAuditCause: '',
                    fId: obj.fId,
                    fIsThrough: true
                }
                this.auditObj = param;
                this.auditRequest(this.auditObj);
            },
            /**
             * 审核不通过按钮
             */
            nopassAudit(obj){
                this.$prompt('请输入原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    let param = {
                        fAuditCause: value,
                        fId: obj.fId,
                        fIsThrough: false
                    }
                    this.auditObj = param;
                    this.auditRequest(this.auditObj);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            },
            /**
             * 提交审核请求
             * @param {Object}   提交对象
             */
            async auditRequest(obj) {
                let res = await HiddenTroubleService.audit(obj);
                if (res.success) {
                    this.closeModal('auditInfo',this.auditModal)
                    this.$message.success(res.msg);
                    this.getHiddenTrouble(this.condition.currentPage);
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 下发隐患
             * @param formName {object} 表单名称
             */
            issue(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.judgedRequest(this.judgedForm);
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 提交研判请求
             * @param {Object}   提交对象
             */
            async judgedRequest(obj) {
                obj.fPlanFinishTime = common.YMDHMSParseTime(obj.fPlanFinishTime);
                let res = await HiddenTroubleService.judged(obj);
                if (res.success) {
                    this.closeModal('judgedForm',this.judgedModal)
                    this.$message.success(res.msg);
                    this.getHiddenTrouble(this.condition.currentPage);
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 重置表单
             * @param formName {object} 表单名称
             */
            reset(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 检索
             */
            filterMethod(query, item) {
                return item.fUserName.indexOf(query) > -1;
            },
            /**
             * 抄送人change事件
             */
            disposeUsersChange(arr){
                let params = [];
                let obj = {};
                for (let a of arr) {
                    obj.fUserId = this.users[a].fId;
                    params.push(obj);
                }
                this.judgedForm.fDisposeUsers = params;
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .hazard-review-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
            .search {
                .state {
                    margin-bottom: 10px;
                }
            }
        }
        .img-div {
            width: 148px;
            height: 148px;
            border-radius: 4px;
            position: relative;
            display: inline-block;
            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
            .img-action:hover {
                opacity: 1;
            }
            .img-action {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                border-radius: 4px;
                background-color: rgba(0,0,0,.5);
                transition: opacity .3s;
                .preview-icon {
                    font-size: 50px;
                    line-height: 148px;
                }
            }
        }
        .video-div {
            display: inline-block;
            video {
                border-radius: 4px;
                width: 280px;
                height: 148px;
                object-fit: fill;
            }
        }
    }
    .wpx-400 {
        width: 400px;
    }
</style>
<style lang="scss" scoped>
    .btn-chosed {
        background: #409EFF!important;
        color: #FFF!important;
    }
</style>