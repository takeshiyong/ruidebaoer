/*
 * @Author: 王侃
 * @Date:   2019-08-06
 * @Description: '隐患日志': 安环部可看页面 隐患状态： “审核未通过”、“销号”
 */
<template>
    <div class="hazard-log-page">
        <div class="container">
            <!-- 搜索条件 1.状态：审核未通过、销号 2.时间段 3.隐患级别 4.隐患类型-->
            <div class="search">
                <div class="state">
                    <el-button type="primary" plain :class="{'btn-chosed': state == '全部'}" @click="chosedState('全部')">全部</el-button>
                    <el-button type="primary" plain :class="{'btn-chosed': state == '审核未通过'}" @click="chosedState('审核未通过')">审核未通过</el-button>
                    <el-button type="primary" plain :class="{'btn-chosed': state == '销号'}" @click="chosedState('销号')">销号</el-button>
                    <el-button type="primary" plain :class="{'btn-chosed': state == '重复隐患'}" @click="chosedState('重复隐患')">重复隐患</el-button>
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
                        <el-select v-model="condition.fTypeId" placeholder="请选择隐患级别" filterable clearable class="input-father">
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
                 列表操作 1.详情 -->
            <div class="tab">
                <el-table :data="hiddenTroubles" class="defaultTab hazard-review-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" :index="indexMethod" width="60"></el-table-column>
                    <el-table-column prop="fState" label="状态" min-width="60">
                        <template slot-scope="scope">
                            <el-tag size="mini" v-if="scope.row.fState == '0'">审核未通过</el-tag>
                            <el-tag size="mini" v-if="scope.row.fState == '6'">销号</el-tag>
                            <el-tag size="mini" v-if="scope.row.fState == '10'">重复隐患</el-tag>
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
                            <el-button type="text" @click="detail(scope.row)">&nbsp;详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="pageSizeChange" @current-change="getHiddenTrouble":current-page="condition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>
        <!-- 弹层 -->
        <TheDialog :modal='detailModal' modalTitle="隐患详情" @closeModal="closeModal('detailInfo',detailModal)">
            <div slot="custom-modal-content">
                <el-form label-width="160px" class="detail-form">
                    <h5 class="mb-10">隐患上报信息</h5>
                    <hr class="mb-10">
                    <el-form-item label="隐患类型：">
                        <div>{{detailInfo.fTypeName}}</div>
                    </el-form-item>
                    <el-form-item label="隐患描述：">
                        <div>{{detailInfo.fContent}}</div>
                    </el-form-item>
                    <el-form-item label="隐患图片：">
                        <div v-for="(item, index) in detailInfo.reportImg" :key="index" style="display: inline-block; margin-right:10px;">
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
                        <div>{{detailInfo.fReportTime}}</div>
                    </el-form-item>
                    <el-form-item label="检查地点：">
                        <div>{{detailInfo.fSite}}</div>
                    </el-form-item>
                    <el-form-item label="上报人员：">
                        <div>{{detailInfo.fReportUserName}}</div>
                    </el-form-item>

                    <div v-if="showDetail == '销号'">
                        <h5 class="mb-10 mt-10">整改通知单</h5>
                        <hr class="mb-10">

                        <el-form-item label="整改通知单：">
                            <div>{{detailInfo.fNo}}</div>
                        </el-form-item>
                        <el-form-item label="主送单位：">
                            <div>{{detailInfo.fIssueUserDepName}}</div>
                        </el-form-item>
                        <el-form-item label="抄送人：">
                            <span v-for="(item, index) in detailInfo.fCopyUsers" :key="index" class="user-span">{{item.fUserName}}</span>
                        </el-form-item>
                        <el-form-item label="隐患级别：">
                            <div>{{detailInfo.fLevelName}}</div>
                        </el-form-item>
                        <el-form-item label="隐患类型：">
                            <div>{{detailInfo.fTypeName}}</div>
                        </el-form-item>
                        <el-form-item label="整改期限：">
                            <div>{{detailInfo.fPlanFinishTime}}</div>
                        </el-form-item>
                        <el-form-item label="隐患图片：">
                            <div v-for="(item, index) in detailInfo.reportImg" :key="index" style="display: inline-block; margin-right:10px;">
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
                        <el-form-item label="隐患地点：">
                            <div>{{detailInfo.fSite}}</div>
                        </el-form-item>
                        <el-form-item label="存在问题：">
                            <div>{{detailInfo.fContent}}</div>
                        </el-form-item>
                        <el-form-item label="整改措施：">
                            <div>{{detailInfo.fMeasures}}</div>
                        </el-form-item>

                        <h5 class="mb-10 mt-10">整改情况</h5>
                        <hr class="mb-10">

                        <el-form-item label="整改图片：">
                            <div v-for="(item, index) in detailInfo.finishImg" :key="index" style="display: inline-block; margin-right:10px;">
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
                        <el-form-item label="附件：">
                            <div v-for="(item, index) of finishImg.filter(obj=>(obj.fType == 2))">
                                <a :href="previewUrl+item.fFileLocationUrl">{{previewUrl+item.fFileLocationUrl}}</a>
                            </div>
                            <div v-if="finishImg.filter(obj=>(obj.fType == 2)).length == 0">--</div>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <div>{{detailInfo.fRemark}}</div>
                        </el-form-item>
                        <el-form-item label="隐患整改人：">
                            <span v-for="(item, index) in detailInfo.fDisposeUsers" :key="index" class="user-span">{{item.fUserName}}</span>
                        </el-form-item>
                    </div>

                    <h5 class="mb-10 mt-10">隐患相关操作人</h5>
                    <hr class="mb-10">

                    <el-form-item label="相关操作人：">
                        <el-row>
                            <el-col :span="8">
                                类型
                            </el-col>
                            <el-col :span="8">
                                人员
                            </el-col>
                            <el-col :span="8">
                                时间
                            </el-col>
                        </el-row>
                        <div v-for="(item, index) in deciding" :key="index" style="margin-bottom: 10px;">
                            <el-row v-if="!(item.fDealNumber > 1)">
                                <el-col :span="8">
                                    上报人
                                </el-col>
                                <el-col :span="8">
                                    {{detailInfo.fReportUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{detailInfo.fReportTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="!(item.fDealNumber > 1)">
                                <el-col :span="8">
                                    审核人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fAuditUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fAuditTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="showDetail == '销号'">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}研判人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fIssueUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fIssueTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState > 3 && item.fState != 9 && item.fState !=7">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}确认人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fDutyUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fAcceptTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState == 7">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}拒绝人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fDutyUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fAcceptTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState == 10">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}撤销人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fRevocationUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fRevocationTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState == 5 || item.fState == 6 || item.fState == 8">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}完成提交人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fActualFinishUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fActualFinishTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState == 8">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}复查不通过人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fReviewUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fReviewTime}}
                                </el-col>
                            </el-row>
                            <el-row v-if="item.fState == 6">
                                <el-col :span="8">
                                    {{item.fDealNumber > 1? item.fDealNumber+'次': ''}}复查通过人
                                </el-col>
                                <el-col :span="8">
                                    {{item.fReviewUserName}}
                                </el-col>
                                <el-col :span="8">
                                    {{item.fReviewTime}}
                                </el-col>
                            </el-row>
                        </div>
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
    import { LevelService, TypeService, HiddenTroubleService } from '@/api/hidden-trouble' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import { common } from "@/utils/common"; // common
    export default {
        data() {
            return {
                state: '全部',
                showDetail: '审核未通过',

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

                levels: [], // 隐患级别
                types: [], // 隐患类型
                // 条件对象
                condition: {
                    currentPage: 1, // 当前页
                    pageSize: 10, // 每页大小
                    fState: [0,6,10], // 状态集合
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

                // 详情弹层
                detailModal: false, // 弹层Modal
                detailInfo: {}, // 隐患的详情
                finishImg: [], // 附件

                deciding: [], // 处理信息

                dateRange: '',
            }
        },
        components: {
            TheDialog
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
                        this.condition.fState = [0,6];
                        this.getHiddenTrouble(1);
                        break;
                    case '审核未通过':
                        this.condition.fState = [0];
                        this.getHiddenTrouble(1);
                        break;
                    case '销号':
                        this.condition.fState = [6];
                        this.getHiddenTrouble(1);
                        break;
                    case '重复隐患':
                        this.condition.fState = [10];
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
            },
            /**
             * 获取隐患列表 （状态为“审核未通过”和“销号”）
             * @return {Array}     查询的结果
             */
            async getHiddenTrouble(val){
                this.condition.currentPage = val;

                if (this.condition.fReportBeginTime != '') {
                    this.condition.fReportBeginTime = common.YMDHMSParseTime(this.condition.fReportBeginTime);
                }
                if (this.condition.fReportEndTime != '') {
                    this.condition.fReportEndTime = common.YMDHMSParseTime(this.condition.fReportEndTime);
                }

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
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            pageSizeChange(num){
                this.condition.pageSize = num;
                this.getHiddenTrouble(1);
            },
            /**
             * 计算表格数据序号
             */
            indexMethod(index){
                return index + this.condition.pageSize*(this.condition.currentPage-1)+1;
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
             * 详情按钮
             */
            async detail(obj){
                // 初始化弹层
                this.detailModal = true;
                this.detailInfo = {};
                let res = await HiddenTroubleService.getHiddenTroubleInfo(obj.fId);
                if (res.success) {
                    this.detailInfo = res.obj;
                    if (obj.fState == 0) {
                        this.showDetail = '审核未通过';
                        this.finishImg = [];
                    } else if (obj.fState == 10){
                        this.showDetail = '重复隐患';
                        this.finishImg = [];
                    }else {
                        this.showDetail = '销号';
                        this.finishImg = this.detailInfo.finishImg;
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.detailInfo = {};
                };
                let res1 = await HiddenTroubleService.getDeciding(obj.fId);
                if (res1.success) {
                    this.deciding = res1.obj;
                } else {
                    this.$message.warning(res1.msg);
                    this.deciding = [];
                }
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.detailModal = false;
            },
            /**
             * 图片预览
             */
            previewImg(url){
                this.dialogImageUrl = url;
                this.dialogVisible = true;
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .hazard-log-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow: 0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius: 8px;
        .container {
            padding: 15px 10px;
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
    .mt-10 {
        margin-top: 10px;
    }
    .mb-10 {
        margin-bottom: 10px;
    }
    .user-span {
        margin-right: 5px;
    }
</style>
<style lang="scss" scoped>
    .btn-chosed {
        background: #409EFF!important;
        color: #FFF!important;
    }
</style>
<style lang="scss">
    .detail-form .el-form-item {
        margin-bottom: 0px!important;
    }
</style>