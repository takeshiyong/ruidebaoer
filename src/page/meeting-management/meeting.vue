/*
 * @Author: 王侃
 * @Date:   2019-08-14
 * @Description: '会议列表'
 */
<template>
    <div class="meeting-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="时间区域" label-width="100px">
                        <el-date-picker
                            v-model="dateRange"
                            type="daterange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间" class="input-picker">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getMeeting(1, 0, '')"><i class="el-icon-search"></i>搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-button-group class="state">
                    <el-button v-for="(item, index) in states" :key="index" :style="{color: item.color, background: item.background}" @click="chosedState(item)">
                        <el-badge :value="item.num" class="badge">
                            <span v-if="item.meetingState == 0">全部</span>
                            <span v-if="item.meetingState == 1">未开始</span>
                            <span v-if="item.meetingState == 2">进行中</span>
                            <span v-if="item.meetingState == 3">已结束</span>
                            <span v-if="item.meetingState == 4">已归档</span>
                            <span v-if="item.meetingState == 5">已取消</span>
                        </el-badge>
                    </el-button>
                </el-button-group>
                <el-button-group class="type">
                    <el-button v-for="(item, index) in types" :key="index" :style="{color: item.color, background: item.background}"  @click="choesdType(item)">
                        <el-badge :value="item.num" class="badge">
                            {{item.meetingTypeName}}
                        </el-badge>
                    </el-button>
                </el-button-group>
            </div>
            <div class="tab">
                <el-table :data="meetings" stripe class="defaultTab meeting-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
                    <el-table-column prop="fName" label="会议标题" min-width="120" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="开始时间" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fState == 1">{{scope.row.fBeginTime}}</span>
                            <span v-else>{{scope.row.fActualBeginTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="结束时间" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fState == 1">{{scope.row.fEndTime}}</span>
                            <span v-else>{{scope.row.fActualEndTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fMeetingTypeName" label="会议类型" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fMeetingRangeName" label="会议范围" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fMeetingRoomName" label="所在会议室" min-width="100" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fMeetingInitiatorName" label="发起人" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fState" label="会议状态" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fState == 1">未开始</span>
                            <span v-if="scope.row.fState == 2">进行中</span>
                            <span v-if="scope.row.fState == 3">已结束</span>
                            <span v-if="scope.row.fState == 4">已归档</span>
                            <span v-if="scope.row.fState == 5">已取消</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fContent" label="会议内容" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="重复规则" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            --
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="text" @click="getMeetingDetails(scope.row)">&nbsp;详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="meetingSizeChange" @current-change="getMeeting":current-page="condition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>
        <!-- 弹层 -->
        <TheDialog :modal='detailModal' modalTitle="会议详情" @closeModal="closeModal('detailInfo',detailModal)">
            <div slot="custom-modal-content">
                <el-form label-width="160px" style="width: 600px;">
                    <el-row style="margin-left:80px;text-align: center;border-bottom:2px solid #E5E5E5;padding-bottom: 10px;margin-bottom:10px;">
                        <el-col :span="6">
                            <div style="font-size:24px;">
                                <span v-if="mettingDetails.fState == 1">
                                    {{mettingDetails.a}}
                                </span>
                                <span v-else>
                                    {{mettingDetails.b}}
                                </span>
                            </div>
                            <div style="color: #CECECE;font-size:12px;">
                                开始时间
                            </div>
                        </el-col>
                        <el-col :span="12" style="line-height: 40px;">
                            <i class="el-icon-right"></i>
                        </el-col>
                        <el-col :span="6">
                            <div style="font-size:24px;">
                                <span v-if="mettingDetails.fState == 1">
                                    {{mettingDetails.c}}
                                </span>
                                <span v-else>
                                    {{mettingDetails.d}}
                                </span>
                            </div>
                            <div style="color: #CECECE;font-size:12px;">
                                结束时间
                            </div>
                        </el-col>
                    </el-row>
                    <el-form-item label="会议日期：">
                        <div>{{mettingDetails.e}}</div>
                    </el-form-item>
                    <el-form-item label="创 建 人：">
                        <div>{{mettingDetails.fMeetingInitiatorName}}</div>
                    </el-form-item>
                    <el-form-item label="记 录 人：">
                        <div>{{mettingDetails.fMeetingRecordName}}</div>
                    </el-form-item>
                    <el-form-item label="会议类型：">
                        <div>{{mettingDetails.fMeetingTypeName}}</div>
                    </el-form-item>
                    <el-form-item label="会议标题：">
                        <div>{{mettingDetails.fName}}</div>
                    </el-form-item>
                    <el-form-item label="会议内容：">
                        <div>{{mettingDetails.fContent}}</div>
                    </el-form-item>
                    <el-form-item label="会 议 室：">
                        <div>{{mettingDetails.fMeetingRoomName}}</div>
                    </el-form-item>
                    <el-form-item label="会议状态：">
                        <div v-if="mettingDetails.fState == 1">未开始</div>
                        <div v-if="mettingDetails.fState == 2">进行中</div>
                        <div v-if="mettingDetails.fState == 3">已结束</div>
                        <div v-if="mettingDetails.fState == 4">已归档</div>
                        <div v-if="mettingDetails.fState == 5">已取消</div>
                    </el-form-item>
                    <el-form-item label="系统文件：">
                        <div v-for="(item, index) of mettingFiles.filter(obj=>(obj.fFileType == 1))">
                        {{}}</div>
                        <div v-if="mettingFiles.filter(obj=>(obj.fFileType == 1)).length == 0">--</div>
                    </el-form-item>
                    <el-form-item label="会前附件：">
                        <div v-for="(item, index) of mettingFiles.filter(obj=>(obj.fFileType == 2))">
                            <a :href="previewUrl+item.fFileLocationUrl">{{previewUrl+item.fFileLocationUrl}}</a>
                        </div>
                        <div v-if="mettingFiles.filter(obj=>(obj.fFileType == 2)).length == 0">--</div>
                    </el-form-item>
                    <el-form-item label="会前图片：">
                        <div v-for="(item, index) of mettingFiles.filter(obj=>(obj.fFileType == 3))">
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
                        <div v-if="mettingFiles.filter(obj=>(obj.fFileType == 3)).length == 0">--</div>
                    </el-form-item>
                    <el-form-item label="会后附件：">
                        <div v-for="(item, index) of mettingFiles.filter(obj=>(obj.fFileType == 5))">
                        {{}}</div>
                        <div v-if="mettingFiles.filter(obj=>(obj.fFileType == 5)).length == 0">--</div>
                    </el-form-item>
                    <el-form-item label="会后图片：">
                        <div v-for="(item, index) of mettingFiles.filter(obj=>(obj.fFileType == 4 || obj.fFileType == 6))">
                        {{}}</div>
                        <div v-if="mettingFiles.filter(obj=>(obj.fFileType == 4 || obj.fFileType == 6)).length == 0">--</div>
                    </el-form-item>
                    <el-form-item label="会议范围：">
                        <div v-for="(item, index) in listRange" :key="index">{{item.fDeptName}}</div>
                    </el-form-item>
                    <el-form-item label="参 会 人：">
                        <span style="margin-right: 5px;" v-for="(item, index) in mettingPeople" :key="index">{{item.fEmpoloyeeName}}</span>
                    </el-form-item>
                    <el-form-item label="抄 送 人：">
                        <div style="margin-right: 5px;" v-for="(item, index) in mettingCopiers" :key="index">{{item.fEmployeeName}}</div>
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
    import { MeetingService } from '@/api/meeting-management' // api
    import { common } from "@/utils/common"; // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                previewUrl: process.env.PREVIEW_API, // 文件ip
                dialogImageUrl: '', // 图片预览路径
                dialogVisible: false, // 图片预览弹窗
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },

                states: [], // 会议状态集合
                types: [], // 会议类型集合

                condition: { // 分页对象
                    currentPage: 1, // 当前页
                    endTime: '', // 结束时间
                    fEmployeeId: '', // 当前登录人id
                    state: 0, // 会议状态
                    meetingTypeId: '', // 会议类型
                    pageSize: 10, // 每页显示条数
                    startTime: '', // 结束时间
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },

                meetings: [], // 列表集合

                // 详情弹层
                detailModal: false, // 弹层Modal
                mettingDetails: {}, // 会议基本信息
                mettingPeople: [], // 参会人
                mettingCopiers: [], // 抄送人
                mettingFiles: [], // 会议文件
                listRange: [], // 会议范围
            }
        },
        computed: {
            dateRange: { //搜索时间区域
                get() {
                    return [
                        this.condition.startTime,
                        this.condition.endTime
                    ];
                },

                set(dateRange) {
                    if (dateRange) {
                        this.condition.startTime = dateRange[0];
                        this.condition.endTime = dateRange[1];
                    }
                }
            },
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
                // 获取会议状态、会议状态个数 会议类型。会议类型个数
                this.getMeetingParam();
                // 获取会议列表
                this.getMeeting(1, 0, '');
            },
            /**
             * 获取会议状态、会议状态个数 会议类型。会议类型个数
             * @return {Object}   查询的结果
             */
            async getMeetingParam(){
                let param = {
                    endTime: '',
                    startTime: ''
                }
                let res = await MeetingService.getMeetingParam(param);
                if (res.success) {
                    // 处理会议状态数据
                    if (res.obj.selectMeetingStateCount.length > 0) {
                        let obj1 = {
                            meetingState: 0,
                            num: 0,
                            color: '#3a8ee6',
                            background: '#ecf5ff',
                        };
                        for (let item of res.obj.selectMeetingStateCount) {
                            item.color = '#606266';
                            item.background = '#FFF';
                            obj1.num += item.num;
                        }
                        this.states = [obj1, ...res.obj.selectMeetingStateCount];
                    } else {
                        let param1 = [
                            {
                                meetingState: 0,
                                num: 0,
                                color: '#3a8ee6',
                                background: '#ecf5ff',
                            }
                        ]
                        this.states = param1;
                    }
                    // 处理会议类型数据
                    if (res.obj.selectMeetingTypeCount.length > 0) {
                        for (let item of res.obj.selectMeetingTypeCount) {
                            item.color = '#606266';
                            item.background = '#FFF';
                        }
                        this.types = res.obj.selectMeetingTypeCount;
                    } else {
                        this.types = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    let param1 = [
                            {
                                meetingState: 0,
                                num: 0,
                                color: '#3a8ee6',
                                background: '#ecf5ff',
                            }
                        ]
                    this.states = param1;
                    this.types = [];
                }
            },
            /**
             * 获取会议列表
             * @param val {num} 页码数 state {num} 状态 type {string} 类型
             * @return {Array}   查询的结果
             */
            async getMeeting(val, state, type){
                this.condition.currentPage = val;
                this.condition.state = state;
                this.condition.meetingTypeId = type;

                if (this.condition.startTime != '') {
                    this.condition.startTime = common.YMDHMSParseTime(this.condition.startTime);
                }
                if (this.condition.endTime != '') {
                    this.condition.endTime = common.YMDHMSParseTime(this.condition.endTime);
                }
                let res = await MeetingService.getMeeting(this.condition);
                if (res.success) {
                    this.condition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.meetings = res.obj.items;
                    } else {
                        this.meetings = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.meetings = [];
                }
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            meetingSizeChange(num){
                this.condition.pageSize = num;
                this.getMeeting(1, 0, '');
            },
            /**
             * 计算表格数据序号
             */
            indexMethod(index){
                return index + this.condition.pageSize*(this.condition.currentPage-1)+1;
            },
            /**
             * 点击会议状态
             */
            chosedState(obj){
                // 选中状态样式
                for (let item of this.states) {
                    item.color = '#606266';
                    item.background = '#FFF';
                    if (item.meetingState == obj.meetingState) {
                        item.color = '#3a8ee6';
                        item.background = '#ecf5ff';
                    }
                }
                // 清空类型样式
                for (let item of this.types) {
                    item.color = '#606266';
                    item.background = '#FFF';
                }
                // 请求数据
                this.getMeeting(1, obj.meetingState, '');
            },
            /**
             * 点击会议类型
             */
            choesdType(obj){
                // 选中状态样式
                for (let item of this.types) {
                    item.color = '#606266';
                    item.background = '#FFF';
                    if (item.meetingTypeId == obj.meetingTypeId) {
                        item.color = '#3a8ee6';
                        item.background = '#ecf5ff';
                    }
                }
                // 清空类型样式
                for (let item of this.states) {
                    item.color = '#606266';
                    item.background = '#FFF';
                }
                // 请求数据
                this.getMeeting(1, '', obj.meetingTypeId);
            },
            /**
             * 获取会议信息
             * @return {Object}   查询的结果
             */
            async getMeetingDetails(obj){
                // 初始化弹层
                this.detailModal = true;
                this.mettingDetails = {}; // 会议基本信息
                this.mettingPeople = []; // 参会人
                this.mettingCopiers = []; // 抄送人
                this.mettingFiles = []; // 会议文件
                this.listRange = []; // 会议范围
                let res = await MeetingService.getMeetingDetails(obj.fId);
                if (res.success) {
                    if (res.obj.mettingDetails.fBeginTime != null) {
                        res.obj.mettingDetails.a = res.obj.mettingDetails.fBeginTime.substring(11, 16);
                    } else {
                        res.obj.mettingDetails.a = '--';
                    }
                    if (res.obj.mettingDetails.fActualBeginTime != null) {
                        res.obj.mettingDetails.b = res.obj.mettingDetails.fActualBeginTime.substring(11, 16);
                    } else {
                        res.obj.mettingDetails.b = '--';
                    }
                    if (res.obj.mettingDetails.fEndTime != null) {
                        res.obj.mettingDetails.c = res.obj.mettingDetails.fEndTime.substring(11, 16);
                    } else {
                        res.obj.mettingDetails.c = '--';
                    }
                    if (res.obj.mettingDetails.fActualEndTime != null) {
                        res.obj.mettingDetails.d = res.obj.mettingDetails.fActualEndTime.substring(11, 16);
                    } else {
                        res.obj.mettingDetails.d = '--';
                    }
                    if (res.obj.mettingDetails.fBeginTime != null) {
                        res.obj.mettingDetails.e = res.obj.mettingDetails.fBeginTime.substring(0, 10);
                    } else {
                        res.obj.mettingDetails.e = '--';
                    }
                    this.mettingDetails = res.obj.mettingDetails;
                    this.mettingPeople = res.obj.mettingPeople;
                    this.mettingCopiers = res.obj.mettingCopiers;
                    this.mettingFiles = res.obj.mettingFiles;
                    this.listRange = res.obj.listRange;
                } else{
                    this.$message.warning(res.msg);
                    this.mettingDetails = {}; // 会议基本信息
                    this.mettingPeople = []; // 参会人
                    this.mettingCopiers = []; // 抄送人
                    this.mettingFiles = []; // 会议文件
                    this.listRange = []; // 会议范围
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.detailModal = false;
            },
            // 图片预览
            previewImg(url){
                this.dialogImageUrl = url;
                this.dialogVisible = true;
            }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss" scoped>
    .meeting-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
            .state {
                margin-right: 10px;
            }
            .tab {
                .meeting-tab {
                    margin-top: 20px;
                }
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
            width: 100%;
            height: 100%;
            object-fit: fill;
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .badge {
        .el-badge__content.is-fixed {
            top: -2px!important;
            right: 4px!important;
        }
        .el-badge__content {
            height: 14px!important;
            line-height: 14px!important;
            padding: 0 2px!important;
        }
    }
</style>