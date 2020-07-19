/*
* @Author: 元实
* @Date:   2019-09-19
* @Description: '设备类型'
*/

<template>
    <div class="exampaper-page">
        <div class="container">
            <!-- 试卷页面头部-->
            <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="关键字" label-width="100px">
                        <el-input
                            v-model="selectionParams.paperTitleKeyWord"
                            autocomplete="off"
                            placeholder="请输入关键字"
                            clearable
                            class="input-item longer">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="关联课程" label-width="100px">
                        <el-select
                            v-model="selectionParams.courseIdList"
                            multiple
                            placeholder="请选择关联课程"
                            clearable
                            class="input-item longer">
                            <el-option
                                v-for="course in courses"
                                :key="course.fCourseId"
                                :label="course.fCourseName"
                                :value="course.fCourseId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="getExamPapers" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="addExamPaperRecord" size="small">新增</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click.stop="deleteExamPaperRecords" size="small">删除</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 试卷页面头部-->

            <!--试卷页面表格-->
            <el-table
                :data="examPapersData"
                class="defaultTab margin-top15"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh"
                @selection-change="selectExamPapers">

                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>

                <el-table-column
                    type="index"
                    label="序号"
                    width="60">
                </el-table-column>

                <el-table-column
                    label="标题"
                    prop="fTitle"
                    min-width="550">
                </el-table-column>

                <el-table-column
                    label="考试时长"
                    prop="fDuration"
                    width="100">
                </el-table-column>

                <el-table-column
                    label="是否启用"
                    prop="fIsUsed"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.fIsUsed === true" type="success">启用</el-tag>
                        <el-tag v-else type="danger">未启用</el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    fixed="right"
                    width="100">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editExamPaperRecord(scope.row.fId)" size="small">编辑</el-button>
                        <el-button type="text" @click="showExamPaperDetails(scope.row.fId)" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--试卷页面表格-->

            <!-- 试卷新增弹框-->
            <TheDialog
                :modal="isAddFormShown"
                :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                @closeModal="closeExamPaperDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="examPaperForm"
                        :model="examPaperForm"
                        :rules="examPaperRules"
                        class="demo-form-inline input-form">
                        <el-row>
                            <el-form-item
                                label="试卷标题"
                                label-width="100px"
                                prop="title">
                                <el-input
                                    v-model="examPaperForm.title"
                                    auto-complete="false"
                                    clearable
                                    class="middle-width"
                                    placeholder="请输入试卷标题">
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="是否启用"
                                label-width="100px"
                                prop="isUsed">
                                <el-switch
                                    v-model="examPaperForm.isUsed"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="是"
                                    inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="考试时长"
                                label-width="100px"
                                prop="duration">
                                <el-input
                                    type="number"
                                    min="0"
                                    v-model="examPaperForm.duration"
                                    auto-complete="false"
                                    clearable
                                    class="middle-width"
                                    placeholder="请输入考试时长">
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="满分"
                                label-width="100px"
                                prop="fullMarks">
                                <el-input
                                    type="number"
                                    min="0"
                                    v-model="examPaperForm.fullMarks"
                                    auto-complete="false"
                                    clearable
                                    class="middle-width"
                                    placeholder="请输入满分">
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="关联课程"
                                label-width="100px"
                                prop="courseIds">
                                <el-select
                                    v-model="examPaperForm.courseIds"
                                    multiple
                                    placeholder="请选择关联课程"
                                    clearable
                                    class="middle-width"
                                    @change="setQuestionList">
                                    <el-option
                                        v-for="course in courses"
                                        :key="course.fCourseId"
                                        :label="course.fCourseName"
                                        :value="course.fCourseId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="试卷题目"
                                label-width="100px"
                                prop="subjectIds">
                                <el-select
                                    v-model="examPaperForm.subjectIds"
                                    multiple
                                    placeholder="请选择试卷题目"
                                    clearable
                                    class="middle-width"
                                    @focus="checkCourseSelection">
                                    <el-option
                                        v-for="question in questions"
                                        :key="question.fId"
                                        :label="question.fContent"
                                        :value="question.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                            <el-button type="primary" @click.stop="submitExamPaperData">确定</el-button>
                            <el-button @click.stop="resetForm('examPaperForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 试卷新增弹框-->

            <!-- 试卷详情 -->
            <el-dialog
                title="试卷详情"
                :visible.sync="isDetailsShown"
                top="30px"
                width="600px">
                <div class="details-wrapper">
                    <!-- 详情列表 -->
                    <table class="details-table">
                        <thead>
                        <tr>
                            <th colspan="2">试卷详情</th>
                        </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>试卷标题</td>
                                <td>{{ examPaperDetails.tExaminationPaper.fTitle }}</td>
                            </tr>

                            <tr>
                                <td>是否启用</td>
                                <td>
                                    <el-tag v-if="examPaperDetails.tExaminationPaper.fIsUsed === true" type="success">启用</el-tag>
                                    <el-tag v-else type="danger">未启用</el-tag>
                                </td>
                            </tr>

                            <tr>
                                <td>考试时长</td>
                                <td>{{ examPaperDetails.tExaminationPaper.fDuration }}小时</td>
                            </tr>

                            <tr>
                                <td>满分</td>
                                <td>{{ examPaperDetails.tExaminationPaper.fFullMarks }}</td>
                            </tr>

                            <tr>
                                <td>关联课程</td>
                                <td>
                                    <div
                                        v-for="course in examPaperDetails.tCoursePapers"
                                        :key="course.fCourseId">{{ getCourseName(course.fCourseId) }}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>关联题目</td>
                                <td>
                                    <div
                                        v-for="question in examPaperDetails.tPaperSubjectRealtions"
                                        :key="question.fSubjectId">{{ getQuestionName(question.fSubjectId) }}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 详情列表 -->
                </div>
            </el-dialog>
            <!-- 试卷详情 -->
        </div>
    </div>
</template>

<script>
    import { ExamPaperService } from '@/api/network-college' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            const checkIfGreaterThenZero = (rule, value, callback) => {
                if (value < 0) {
                    callback(new Error('不能小于0！'));
                } else {
                    callback();
                }
            };

            return {
                examPapersData: [], //所有试卷
                courses: [], //所有课程

                selectionParams: { //搜索参数
                    courseIdList: [], //关联课程
                    paperTitleKeyWord: '' //关键字
                },

                selectedExamPapers: [], //在表中选择的试卷

                isAddFormShown: false, //是否显示新增/编辑试卷的弹框
                addFormTitle: '新增试卷',   //新增试卷弹框的抬头
                isEditMode: false, //编辑状态
                editFormTitle: '编辑试卷', //编辑试卷弹框的抬头
                courses: [], //所有课程
                questions: [], //所有和课程有关联的试题
                examPaperDetails: {
                    tCoursePapers: [],
                    tExaminationPaper: {},
                    tPaperSubjectRealtions: []
                }, //试卷详情

                examPaperForm: { //新增/编辑试卷的对象
                    title: '', //试卷标题
                    isUsed: false, //是否启用
                    duration: null, //考试时长
                    fullMarks: null, //满分
                    courseIds: [], //课程ids
                    subjectIds: [] //题目ids
                },

                examPaperRules: {
                    title: [
                        { required: true, message: '请输入试卷标题！', trigger: 'blur' }
                    ],

                    duration: [
                        { validator: checkIfGreaterThenZero, trigger: 'change' }
                    ],

                    fullMarks: [
                        { validator: checkIfGreaterThenZero, trigger: 'change' }
                    ],

                    courseIds: [
                        { required: true, message: '请选择关联课程！', trigger: 'blur' }
                    ],

                    subjectIds: [
                        { required: true, message: '请选择题目！', trigger: 'blur' }
                    ],
                },

                isDetailsShown: false //是否展示详情
            };
        },

        mounted() {
            this.getCourses();
            this.getExamPapers();
        },

        methods: {
            /**
             * 获取所有课程
             */
            async getCourses() {
                let result = await ExamPaperService.getCoursesData();

                if (result.success) {
                    this.courses = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取试卷
             */
            async getExamPapers() {
                let result = await ExamPaperService.getExamRecords(this.selectionParams);

                if (result.success) {
                    this.examPapersData = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 在试卷表格里选择
             */
            selectExamPapers(examPapers) {
                let qnty = examPapers.length;

                this.selectedExamPapers = [];
                for (let i = 0; i < qnty; i++) {
                    this.selectedExamPapers.push(examPapers[i].fId);
                }
            },

            /**
             * 展示新增/编辑试卷的弹框，设置弹框中的数据
             */
            addExamPaperRecord() {
                this.clearFormFields();
                this.getCourses();
                this.openExamPaperDialog();

                this.isEditMode = false;
            },

            /**
             * 清理试卷form数据
             */
            clearFormFields() {
                this.examPaperForm = { //新增/编辑试卷的对象
                    title: '', //试卷标题
                    isUsed: false, //是否启用
                    duration: null, //考试时长
                    fullMarks: null, //满分
                    courseIds: [], //课程ids
                    subjectIds: [] //题目ids
                };
            },

            /**
             * 展示弹框
             */
            openExamPaperDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 关闭弹框
             */
            closeExamPaperDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 按照选择的课程，获取题目
             * @param {Array} courses --- 课程ids
             */
            async setQuestionList(courses) {
                let result = await ExamPaperService.getQuestionsData({
                    courseIdList: courses
                });

                if (result.success) {
                    this.questions = result.obj;

                    if (!this.questions.length) {
                        this.$message.info('没有关联题目！');
                    }
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置课程id数组
             * @params {Array} courseIds --- 课程对象数组
             */
            setCoursesIds(coursesIds) {
                const qnty = coursesIds.length;
                let courses = [];

                for (let i = 0; i < qnty; i++) {
                    courses.push(coursesIds[i].fCourseId);
                }

                return courses;
            },

            /**
             * 查看课程是否选好的
             */
            checkCourseSelection() {
                if (!this.examPaperForm.courseIds.length) {
                    this.$message.error('请选择关联课程！');
                }
            },

            /**
             * 提交试卷数据
             */
            submitExamPaperData() {
                this.$refs.examPaperForm.validate(async valid => {
                    if (valid) {
                        const submittedExamPaper = this.setSubmittedExamPaper();
                        let result = {};

                        if (!this.isEditMode) {
                            result = await ExamPaperService.insertExamPaper(submittedExamPaper);
                        } else {
                            result = await ExamPaperService.updateExamPaper(submittedExamPaper);
                        }

                        if (result.success) {
                            this.closeExamPaperDialog();
                            this.getExamPapers();
                        } else {
                            this.$message.error(result.msg);
                        }
                    } else {
                        this.$message.error('请输入数据！');
                    }
                });
            },

            /**
             * 设置要提交的数据
             */
            setSubmittedExamPaper() {
                let submittedExamPaper = {};
                const examPaperForm = this.examPaperForm;

                if (!this.isEditMode) {
                    submittedExamPaper.tExaminationPaper = {
                        fTitle: examPaperForm.title,
                        fIsUsed: examPaperForm.isUsed,
                        fDuration: examPaperForm.duration,
                        fFullMarks: examPaperForm.fullMarks
                    };
                } else {
                    submittedExamPaper.tExaminationPaper = Object.assign(this.examPaperDetails.tExaminationPaper, {
                            fTitle: examPaperForm.title,
                            fIsUsed: examPaperForm.isUsed,
                            fDuration: examPaperForm.duration,
                            fFullMarks: examPaperForm.fullMarks
                        });
                }
                submittedExamPaper.tCoursePapers = this.setSubmittedCourses();
                submittedExamPaper.tPaperSubjectRealtions = this.setSubmittedSubjects();

                return submittedExamPaper;
            },

            /**
             * 设置要提交的关联课程数据
             */
            setSubmittedCourses() {
                const courses = this.examPaperForm.courseIds;
                const qnty = courses.length;
                let submittedCourses = [];

                for (let i = 0; i < qnty; i++) {
                    submittedCourses.push({
                        fCourseId: courses[i]
                    });
                }

                return submittedCourses;
            },

            /**
             * 设置提交的题目数据
             */
            setSubmittedSubjects() {
                const questions = this.examPaperForm.subjectIds;
                const qnty = questions.length;
                let submittedQuestions = [];

                for (let i = 0; i < qnty; i++) {
                    submittedQuestions.push({
                        fSubjectId: questions[i],
                        fSort: i + 1
                    });
                }

                return submittedQuestions;
            },

            /**
             * 删除选择的试卷
             */
            async deleteExamPaperRecords() {
                const examPapers = this.selectedExamPapers;
                let result = await ExamPaperService.deleteExamPapers(examPapers);

                if (result.success) {
                    this.getExamPapers();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 编辑试卷
             * @param {string} fId --- 试卷id
             */
            async editExamPaperRecord(fId) {
                const result = await ExamPaperService.getExamPaperDetails(fId);

                if (result.success) {
                    this.isEditMode = true;
                    await this.getCourses();
                    this.examPaperDetails = result.obj;
                    this.setExamPaperForm();
                    await this.setQuestionList(this.examPaperForm.courseIds);
                    this.openExamPaperDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置试卷数据
             */
            setExamPaperForm() {
                let examPaper = this.examPaperForm;
                let details = this.examPaperDetails;

                examPaper.title = details.tExaminationPaper.fTitle;
                examPaper.duration = details.tExaminationPaper.fDuration;
                examPaper.fullMarks = details.tExaminationPaper.fFullMarks;
                examPaper.isUsed = details.tExaminationPaper.fIsUsed;
                examPaper.courseIds = this.getCourseIdsFromDetails();
                examPaper.subjectIds = this.getSubjectIdsFromDetails();
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 从关联课程数组里获取fIds
             */
            getCourseIdsFromDetails() {
                let courses = [];
                let courseList = this.examPaperDetails.tCoursePapers;
                let qnty = courseList.length;

                for (let i = 0; i < qnty; i++) {
                    courses.push(courseList[i].fCourseId);
                }

                return courses;
            },

            /**
             * 从关联课程数组里获取fIds
             */
            getSubjectIdsFromDetails() {
                let subjects = [];
                let subjectList = this.examPaperDetails.tPaperSubjectRealtions;
                let qnty = subjectList.length;

                for (let i = 0; i < qnty; i++) {
                    subjects.push(subjectList[i].fSubjectId);
                }

                return subjects;
            },

            /**
             * 试卷详情
             * @param {string} fId --- 试卷id
             */
            async showExamPaperDetails(fId) {
                const result = await ExamPaperService.getExamPaperDetails(fId);

                if (result.success) {
                    await this.getCourses();
                    console.log(this.courses);
                    await this.setQuestionList(this.setCoursesIds(this.courses));
                    this.examPaperDetails = result.obj;
                    this.openExamPaperDetailsDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 按照课程id，　获取课程名称
             * @param {string} courseId --- 课程id
             */
            getCourseName(courseId) {
                let qnty = this.courses.length;

                for (let i = 0; i < qnty; i++) {
                    if (this.courses[i].fCourseId === courseId) {
                        return this.courses[i].fCourseName;
                    }
                }

                return '';
            },

            /**
             * 按照题目id，　获取题目名称
             * @param {string} questionId --- 题目id
             */
            getQuestionName(questionId) {
                let qnty = this.questions.length;

                for (let i = 0; i < qnty; i++) {
                    if (this.questions[i].fId === questionId) {
                        return this.questions[i].fContent;
                    }
                }

                return '';
            },

            /**
             * 显示试卷详情
             */
            openExamPaperDetailsDialog() {
                this.isDetailsShown = true;
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .exampaper-page {
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

    .details-table {
        margin: 20px auto 0 auto;
        border-collapse: collapse;

        thead {
            border: solid 1px #e1e5e8;
            background: #f1f4f9;

            th {
                padding: 10px 15px;
            }
        }

        tbody {
            td {
                width: 220px;
                padding: 6px 15px;
                border: solid 1px #e1e5e8;

                &:nth-child(odd) {
                    text-align: right;
                }
            }
        }
    }

    .middle-width {
        width: 60%;
    }
</style>
