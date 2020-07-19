/*
* @Author: 元实
* @Date:   2019-10-08
* @Description: '培训记录页面'
*/

<template>
    <div class="training-page">
        <div class="container">
            <!-- 培训记录页面头部-->
            <el-form :inline="true" :model="searchParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="时间" label-width="100px">
                        <el-date-picker
                            size="medium"
                            v-model="trainingDates"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="起始时间"
                            end-placeholder="结束时间"
                            class="date-picker"
                            @change="selectDates">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="类型" label-width="100px">
                        <el-select
                            v-model="searchParams.trainPlanTypeId"
                            placeholder="请选择培训类型"
                            clearable
                            class="input-item">
                            <el-option value="" label="全部">全部</el-option>
                            <el-option
                                v-for="type in trainingTypes"
                                :key="type.fId"
                                :label="type.fTypeName"
                                :value="type.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="创建人" label-width="100px">
                        <el-select
                            v-model="searchParams.createrId"
                            placeholder="请选择创建人"
                            clearable
                            class="input-item">
                            <el-option label="全部" value="">全部</el-option>
                            <el-option
                                v-for="person in personnel"
                                :key="person.fId"
                                :label="person.fUserName"
                                :value="person.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="状态" label-width="100px">
                        <el-select
                            v-model="searchParams.state"
                            placeholder="请选择培训状态"
                            clearable
                            class="select">
                            <el-option :value="null" label="全部">全部</el-option>
                            <el-option :value="[1]" label="已创建">已创建</el-option>
                            <el-option :value="[2]" label="进行中">进行中</el-option>
                            <el-option :value="[3]" label="已完成">已完成</el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="标题" label-width="100px">
                        <el-input
                            v-model="searchParams.nameKeyWord"
                            autocomplete="off"
                            placeholder="请输入标题"
                            clearable
                            class="input-item longer">
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 培训记录页面头部-->

            <!--培训记录页面表格-->
            <el-table
                :data="trainings"
                class="defaultTab margin-top15"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh">

                <el-table-column
                    label="标题"
                    prop="fName"
                    min-width="200">
                </el-table-column>

                <el-table-column
                    label="类型"
                    prop="fTrainTypeId"
                    width="130">
                    <template slot-scope="scope">
                        {{ getTrainingTypeName(scope.row.fTrainTypeId) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="人数"
                    prop="fPersonNumber"
                    width="75">
                </el-table-column>

                <el-table-column
                    label="课程数"
                    prop="fPersonNumber"
                    width="75">
                </el-table-column>

                <el-table-column
                    label="起止时间"
                    width="180">
                    <template slot-scope="scope">
                        {{ getDate(scope.row.fBeginTime) }} - {{ getDate(scope.row.fEndTime) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="创建人"
                    prop="fCreateUserName"
                    width="100">
                </el-table-column>

                <el-table-column
                    label="状态"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.fState === 1">已创建</el-tag>
                        <el-tag v-if="scope.row.fState === 2" type="warning">进行中</el-tag>
                        <el-tag v-if="scope.row.fState === 3" type="success">已完成</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    fixed="right"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showTrainingDetails(scope.row.fId)" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 培训记录页面表格分页-->
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
            <!-- 培训记录页面表格分页-->
            <!--培训记录页面表格-->

            <!-- 培训记录详情 -->
            <el-dialog
                title="培训详情"
                :visible.sync="isDetailsShown"
                top="30px"
                width="850px">
                <div class="details-wrapper">
                    <el-card shadow="none" class="details-head">
                        <p>
                            <span class="details-label">标题：</span>
                            <span class="details-text">{{ trainingDetails.tTrainPlan.fName }}</span>
                        </p>
                        <p>
                            <span class="details-label">类型：</span>
                            <span class="details-text">{{ getTrainingTypeName(trainingDetails.tTrainPlan.fTrainTypeId) }}</span>
                        </p>
                        <p>
                            <span class="details-label">创建人：</span>
                            <span class="details-text">{{ trainingDetails.tTrainPlan.fCreateUserName }}</span>
                        </p>
                        <p>
                            <span class="details-label">课程：</span>
                            <span
                                v-for="(course, index) in trainingDetails.tTrainCourseDtoList"
                                :key="course.fCourseId"
                                class="details-text">
                                {{ getCourseName(course.fCourseId) }}
                                <span v-if="(index + 1) < trainingDetails.tTrainCourseDtoList.length">,</span>
                            </span>
                        </p>
                        <p>
                            <span class="details-label">起止时间：</span>
                            <span class="details-text">{{ getDate(trainingDetails.tTrainPlan.fBeginTime) }} - {{ getDate(trainingDetails.tTrainPlan.fEndTime) }}</span>
                        </p>
                    </el-card>

                    <el-table
                        :data="trainingEmployees"
                        class="defaultTab margin-top15"
                        highlight-current-row
                        stripe
                        style="width: 100%"
                        max-height="250vh">

                        <el-table-column
                            label="姓名"
                            prop="fTrainEmployeeName"
                            width="150">
                        </el-table-column>

                        <el-table-column
                            label="单位"
                            prop="fName"
                            width="130">
                        </el-table-column>

                        <el-table-column
                            label="学习情况"
                            width="529">
                            <template slot-scope="scope">
                                <el-progress
                                    :percentage="calculateFinishedPercentage(
                                        scope.row.courseTimeLong,
                                        scope.row.learnedCourseWareTimeLong
                                    )"
                                    :color="scope.row.courseTimeLong === scope.row.learnedCourseWareTimeLong ? '#67c23a' : '#f56c6c'"></el-progress>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-dialog>
            <!-- 培训记录详情 -->
        </div>
    </div>
</template>

<script>
    import { TrainingsService } from '@/api/network-college' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                trainings: [], //培训
                trainingTypes: [], //培训类型
                personnel: [], //人员

                trainingDates: [], //培训开始和结束时间
                searchParams: {
                    nameKeyWord: '', //培训标题
                    trainPlanTypeId: '', //培训类型id
                    searchBeginTime: '', //培训开始时间
                    searchEndTime: '', //培训结束时间
                    state: null, //培训状态
                    createrId: '' //培训创建人
                },

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                courses: [], //全部课程
                trainingDetails: {
                    tTrainCourseDtoList: [], //培训关联课程
                    tTrainEmployeeList: [], //培训关联人员
                    tTrainPlan: {} //培训详情
                }, //培训详情
                isDetailsShown: false, //是否显示详情页
                trainingEmployees: [] //培训关联人员
            };
        },

        mounted() {
            this.getTrainingsTypes();
            this.getPersonnel();
            this.getTrainingRecords();
        },

        methods: {
            /**
             * 获取培训类型
             */
            async getTrainingsTypes() {
                let result = await TrainingsService.getTrainingTypes();

                if (result.success) {
                    this.trainingTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取人员
             */
            async getPersonnel() {
                let result = await TrainingsService.getPersonnel();

                if (result.success) {
                    this.personnel = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备维修计划数据
             */
            async getTrainingRecords() {
                let result = {};

                this.searchParams.pageSize = this.paginator.pageSize;
                this.searchParams.currentPage = this.paginator.currentPage;
                result = await TrainingsService.getTrainingRecords(this.searchParams);
                if (result.success) {
                    this.trainings = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 按照培训类型id获取培训类型名称
             * @param {string} typeId -- 培训类型id
             */
            getTrainingTypeName(typeId) {
                const types = this.trainingTypes;
                const qnty = types.length;

                for (let i = 0; i < qnty; i++) {
                    if (types[i].fId === typeId) {
                        return types[i].fTypeName;
                    }
                }

                return '';
            },


            /**
             * 从时间字符串中获取日期字符串
             * @param {string} dateTimeStr --- 时间字符串
             * @returns {string} 日期字符串
             */
            getDate(dateTimeStr) {
                return common.YMDFormat(dateTimeStr);
            },

            /**
             * 选择培训时间段的时候，设置searchParams里的开始时间和结束时间
             * @param dates
             */
            selectDates(dates) {
                this.searchParams.searchBeginTime = common.YMDHMSParseTime(dates[0]);
                this.searchParams.searchEndTime = common.YMDHMSParseTime(dates[1]);
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.currentPage = pageNum;
                }
                this.getTrainingRecords();
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getTrainingRecords();
            },

            /**
             * 展示培训详情
             * @param {string} trainingId
             */
            async showTrainingDetails(trainingId) {
                await this.getDetailedTrainingRecord(trainingId);
                await this.getAttendingEmployees(trainingId);
                await this.getCourses();
                this.toggleTrainingDetails();
            },

            /**
             * 获取培训详情记录
             * @param {string} recordId --- 培训记录id
             * @returns {Promise<void>}
             */
            async getDetailedTrainingRecord(recordId) {
                let result = await TrainingsService.getDetailedTrainingRecord(recordId);


                if (result.success) {
                    this.trainingDetails = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取培训详情记录
             * @param {string} trainingId --- 培训记录id
             * @returns {Promise<void>}
             */
            async getAttendingEmployees(trainingId) {
                let result = await TrainingsService.getAttendingEmployees(trainingId);

                if (result.success) {
                    this.trainingEmployees = [];
                    this.trainingEmployees = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取全部课程
             */
            async getCourses() {
                let result = await TrainingsService.getCourses();


                if (result.success) {
                    this.courses = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 显示/关闭详情页
             */
            toggleTrainingDetails() {
                this.isDetailsShown = !this.isDetailsShown
            },

            /**
             * 按照课程id, 获取课程名称
             * @param {string} courseId --- 课程id
             */
            getCourseName(courseId) {
                const courses = this.courses;
                const qnty = courses.length;

                for (let i = 0; i < qnty; i++) {
                    if (courses[i].fCourseId === courseId) {
                        return courses[i].fCourseName;
                    }
                }

                return '';
            },

            /**
             * 算已完成的课程的比率
             * @param {number} coursesQnty ---　课程数
             * @param {number} completedCoursesQnty　--- 已完成的课程数
             */
            calculateFinishedPercentage(coursesQnty, completedCoursesQnty) {
                console.log(coursesQnty, completedCoursesQnty);
                if (completedCoursesQnty) {
                    return Math.floor(completedCoursesQnty / coursesQnty * 100);
                } else {
                    return 0;
                }
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .training-page {
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

        .date-picker {
            border-left: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
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

    .margin-top15 {
        margin-top: 15px;
    }

    .margin-top20 {
        margin-top: 20px;
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
    }

    .mandatory-field {
        color: #F56C6C;
        margin-right: 4px;
    }

    .details-wrapper {
        height: calc(100vh - 220px);
        overflow-y: auto;
    }

    .details-head {
        p {
            margin-bottom: 6px;
        }
    }
    
    .details-label {
        color: #000;
        font-size: 14px;
    }
    
    .details-text {
        color: #666;
        font-size: 14px;
    }
</style>
