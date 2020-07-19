/*
* @Author: 元实
* @Date:   2019-09-23
* @Description: '砂石学院试题管理'
*/

<template>
    <div class="questions-page">
        <div class="container">
            <!-- 试题页面头部-->
            <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="关键字" label-width="100px">
                        <el-input
                            v-model="selectionParams.contentKeyWord"
                            autocomplete="off"
                            placeholder="请输入关键字"
                            clearable
                            class="input-item longer">
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="addQuestionRecord" size="small">新增</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click.stop="deleteQuestionRecords" size="small">删除</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 试题页面头部-->

            <!--试题页面表格-->
            <el-table
                :data="questionsData"
                class="defaultTab mt-15"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh"
                @selection-change="selectSubjects">

                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>

                <el-table-column
                    type="index"
                    label="序号"
                    width="60"
                    :index="indexRecord">
                </el-table-column>

                <el-table-column
                    label="题干"
                    min-width="550"
                    prop="fContent">
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="100"
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editQuestionsRecord(scope.row.fId)" size="small">编辑</el-button>
                        <el-button type="text" @click="showQuestionsDetails(scope.row.fId)" size="small">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--试题页面表格-->

            <!-- 分页-->
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
            <!-- 分页-->

            <!-- 试题新增弹框-->
            <TheDialog
                :modal="isAddFormShown"
                :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                @closeModal="closeQuestionDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="addQuestionForm"
                        class="demo-form-inline input-form"
                        :model="addQuestionForm"
                        :rules="addQuestionRules">
                        <el-row>
                            <el-form-item
                                label="关联课程"
                                label-width="100px"
                                prop="courseSubjectList">
                                <el-select
                                    v-model="addQuestionForm.courseSubjectList"
                                    multiple
                                    clearable
                                    placeholder="请选择关联课程">
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
                                label="题目内容"
                                label-width="100px"
                                prop="subjectContent">
                                <el-input
                                    type="textarea"
                                    v-model="addQuestionForm.subjectContent"
                                    :rows="3"
                                    resize="none"
                                    clearable
                                    placeholder="请输入题目内容"
                                ></el-input>
                            </el-form-item>
                        </el-row>

                        <el-container>
                            <el-header class="dialog-sub-header"><i class="mandatory-field">*</i>题目选项</el-header>

                            <el-row
                                type="flex"
                                justify="space-between"
                                v-for="(option, idx) in addQuestionForm.tSubjectOptionList"
                                :key="option.fOptiontName">
                                <el-form-item
                                    :label="option.fOptiontName"
                                    label-width="100px"
                                    :rules="{
                                        required: true,
                                        validator: (rule, value, callback) => validateOption(rule, value, idx, callback),
                                        trigger: 'blur'
                                    }"
                                    prop="tSubjectOptionList"
                                    class="option-content">
                                    <el-input
                                        type="textarea"
                                        v-model="addQuestionForm.tSubjectOptionList[idx].fOptiontContent"
                                        :rows="3"
                                        resize="none"
                                        clearable
                                        placeholder="请输入题目内容"
                                    ></el-input>
                                </el-form-item>

                                <i class="el-icon-delete option-delete" @click="deleteOption(idx)"></i>
                            </el-row>

                            <el-row>
                                <el-tooltip effect="dark" content="添加选项" placement="top">
                                    <el-button
                                        size="small"
                                        @click="addOption"
                                        class="button-plus mt-15">
                                        
                                        <i class="el-icon-plus"  style="color: #8c939d"></i>
                                    </el-button>
                                </el-tooltip>
                            </el-row>

                            <el-row class="mt-20">
                                <el-form-item
                                    label="正确答案"
                                    label-width="100px"
                                    prop="correctAnswer">
                                    <el-select
                                        v-model="addQuestionForm.correctAnswer"
                                        placeholder="请选择正确答案"
                                        clearable>
                                        <el-option
                                            v-for="option in addQuestionForm.tSubjectOptionList"
                                            :key="option.fOptiontName"
                                            :label="option.fOptiontName"
                                            :value="option.fOptiontName">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                        </el-container>

                        <el-container>
                            <el-header class="dialog-sub-header">题目图片</el-header>

                            <el-row class="mt-15">
                                <el-upload
                                    accept="image/jpeg, image/gif, image/png, image/jpg"
                                    :action="fileAPI + '/ikingtech/oss/api/upload/v1'"
                                    list-type="picture-card"
                                    :file-list="addQuestionForm.questionPhotos"
                                    :on-preview="handleEditImagePreview"
                                    :on-success="handleUploadImageSuccess"
                                    :before-remove="handleBeforeImageRemove"
                                    :on-remove="handleImageRemove"
                                    >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogEditImageVisible" append-to-body="">
                                    <img width="100%" :src="dialogEditFileUrl" alt="">
                                </el-dialog>
                            </el-row>
                        </el-container>

                        <el-row  type="flex" justify="center" class="form-buttons mt-15">
                            <el-button type="primary" @click.stop="submitQuestionsData">确定</el-button>
                            <el-button @click.stop="resetForm('addQuestionForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 试题新增弹框-->

            <!-- 题目管理详情 -->
            <el-dialog
                title="题目详情"
                :visible.sync="isDetailsShown"
                top="30px"
                width="600px">
                <div class="details-wrapper">
                    <!-- 详情列表 -->
                    <table class="details-table">
                        <thead>
                            <tr>
                                <th colspan="2">题目详情</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>关联课程</td>
                                <td>
                                    <div
                                    v-for="(course, idx) in subjectDetails.tCourseSubjectList"
                                    :key="course.fId">
                                        {{ getCourseName(course.fCourseId) }}
                                        <span v-if="subjectDetails.tCourseSubjectList.length > 1 && idx !== subjectDetails.tCourseSubjectList.length - 1">,</span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>题目内容</td>
                                <td>{{ subjectDetails.tSubject.fContent }}</td>
                            </tr>

                            <tr>
                                <td>题目选项</td>
                                <td>
                                    <div
                                        v-for="option in subjectDetails.tSubjectOptionList"
                                        :key="option.fOptiontName">
                                        <span class="mr-15">{{ option.fOptiontName }}.</span><span>{{ option.fOptiontContent }}</span>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>正确答案</td>
                                <td>{{ subjectDetails.tSubjectAnswerList[0].fAnswer }}</td>
                            </tr>

                            <tr>
                                <td>题目图片</td>
                                <td>
                                    <el-image
                                        v-for="photo in subjectDetails.tFileManagement"
                                        :src="previewUrl + photo.fFileLocationUrl"
                                        :alt="photo.fFileName"
                                        :key="photo.fId"
                                        @click="handleDetailsImagePreview(photo.fFileLocationUrl)"
                                        class="preview-image">
                                    </el-image>

                                    <el-dialog :visible.sync="dialogDetailsImageVisible" append-to-body="">
                                        <img width="100%" :src="dialogDetailsFileUrl" alt="">
                                    </el-dialog>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- 详情列表 -->
                </div>
            </el-dialog>
            <!-- 题目管理详情 -->

            <!-- 试题新增弹框-->
            <!--<TheDialog
                :modal="isDetailsShown"
                modalTitle="题目详情"
                @closeModal="closeDetailsDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        class="demo-form-inline input-form">
                        <el-row>
                            <el-form-item
                                label="关联课程"
                                label-width="100px">
                                <span
                                    v-for="(course, idx) in subjectDetails.tCourseSubjectList"
                                    :key="course.fId">
                                    {{ getCourseName(course.fCourseId) }}
                                    <span v-if="subjectDetails.tCourseSubjectList.length > 1 && idx !== subjectDetails.tCourseSubjectList.length - 1">,</span>
                                </span>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="题目内容"
                                label-width="100px">
                                <div>{{ subjectDetails.tSubject.fContent }}</div>
                            </el-form-item>
                        </el-row>

                        <el-container>
                            <el-header class="dialog-sub-header">题目选项</el-header>

                            <el-row
                                type="flex"
                                justify="space-between"
                                v-for="(option, idx) in subjectDetails.tSubjectOptionList"
                                :key="option.fOptiontName">
                                <el-form-item
                                    :label="option.fOptiontName"
                                    label-width="100px"
                                    class="option-content">
                                    <span>{{ option.fOptiontContent }}</span>
                                </el-form-item>
                            </el-row>

                            <el-row class="mt-20">
                                <el-form-item
                                    label="正确答案"
                                    label-width="100px">
                                   <span>{{ subjectDetails.tSubjectAnswerList[0].fAnswer }}</span>
                                </el-form-item>
                            </el-row>
                        </el-container>

                        <el-container>
                            <el-header class="dialog-sub-header">题目图片</el-header>

                            <el-row class="mt-15">
                                <img
                                    v-for="photo in subjectDetails.tFileManagement"
                                    :src="previewUrl + photo.fFileLocationUrl"
                                    :alt="photo.fFileName"
                                    :key="photo.fId"
                                    @click="handleDetailsImagePreview(photo.fFileLocationUrl)"
                                    class="thumb-photo">
                            </el-row>

                            <el-dialog :visible.sync="dialogDetailsImageVisible" append-to-body="">
                                <img width="100%" :src="dialogDetailsFileUrl" alt="">
                            </el-dialog>
                        </el-container>
                    </el-form>
                </template>
            </TheDialog>-->
            <!-- 试题新增弹框-->
        </div>
    </div>
</template>

<script>
    import { QuestionsService } from '@/api/network-college' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                questionsData: [], //试题

                selectionParams: { //搜索参数
                    contentKeyWord: '', //关键字
                    courseId: '' //课程id
                },

                selectedSubjects: [], //选择的题目

                isAscendingOrder: true, ////添加时间排序: true - 上升的，false -下升的

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 1, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                isAddFormShown: false, //是否显示新增/编辑试题的弹框
                addFormTitle: '新增题目',   //新增试题弹框的抬头
                isEditMode: false, //编辑状态
                editFormTitle: '编辑题目', //编辑试题弹框的抬头
                courses: [], //所有课程
                subjectDetails: {
                    tFileManagement: [],
                    tSubjectAnswerList: [
                        {}
                    ],
                    tSubject: {},
                    tSubjectOptionList: []
                }, //题目详情

                //questionPhotos: [], //编辑的时候，包括已经保存好的图片
                fileAPI: process.env.FILE_API, //管理文件的借口url
                previewUrl: process.env.PREVIEW_API, //预览附件的借口url
                imageUrl: '',  //附件url
                dialogDetailsImageVisible: false, //是否放大详情照片
                dialogDetailsFileUrl: '', //放大的详情照片url
                dialogEditImageVisible: false, //是否放大编辑保养照片
                dialogEditFileUrl: '', //放大的编辑照片url

                addQuestionForm: {    //新增/编辑试题的对象
                    courseSubjectList: [], //关联课程的ids
                    //tFileManagement: [], //题目图片
                    questionPhotos: [], //题目图片
                    subjectContent: '', //题目内容
                    subjectId: '', //题目id
                    correctAnswer: '', //题目答案
                    tSubjectOptionList: [
                        {
                            fOptiontContent: '', //选项内容, 长度限制: 100
                            fOptiontName: 'A', //选项名, 长度限制: 20
                            fSort: 1 //选项排序
                        },

                        {
                            fOptiontContent: '', //选项内容, 长度限制: 100
                            fOptiontName: 'B', //选项名, 长度限制: 20
                            fSort: 2 //选项排序
                        }
                    ], //题目题目选项
                },

                addQuestionRules: { //验证题目数据的规则
                    courseSubjectList: [
                        {required: true, message: '请选择课程', trigger: 'blur'}
                    ],

                    subjectContent: [
                        {required: true, message: '请输入题目内容', trigger: 'blur'}
                    ],

                    correctAnswer: [
                        {required: true, message: '请输选择正确的答案', trigger: 'blur'}
                    ]
                },

                subjectOptionsRules: {
                    required: true,
                    validator: (rule, value, callback) => validateOption(rule, value, callback),
                    trigger: 'blur'
                },

                isDetailsShown: false, //是否显示详情页
            }
        },

        mounted() {
            this.getQuestionsData();
        },

        methods: {
            /**
             * 获取试题
             */
            async getQuestionsData() {
                let result = {};

                this.selectionParams.pageSize = this.paginator.pageSize;
                this.selectionParams.currentPage = this.paginator.currentPage;
                this.selectionParams.courseId = sessionStorage.courseId;
                sessionStorage.removeItem('courseId');
                result = await QuestionsService.getQuestionsDataByPage(this.selectionParams);

                if (result.success) {
                    this.questionsData = result.obj.items;
                    this.paginator.pagesQnty = Math.ceil(result.obj.itemTotal / this.paginator.pageSize);
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 试题顺序
             */
            setRecordsOrder() {
                this.isAscendingOrder = !this.isAscendingOrder;
                this.searchParams.sort = this.isAscendingOrder ? 0 : 1;

                this.getQuestionsData();
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getQuestionsData();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.pageCurrent = pageNum;
                }

                this.getQuestionsData();
            },

            /**
             * 给每一条数据设置序号
             */
            indexRecord(index) {
                let paginator = this.paginator;
                let calcIndex = ((paginator.currentPage - 1) * paginator.pageSize) + index + 1;

                return calcIndex;
            },

            /**
             * 在题目表格里选择
             */
            selectSubjects(subjects) {
                let qnty = subjects.length;

                this.selectedSubjects = [];
                for (let i = 0; i < qnty; i++) {
                    this.selectedSubjects.push(subjects[i].fId);
                }
            },

            /**
             * 删除选择的题目
             */
            async deleteQuestionRecords() {
                let result = await QuestionsService.deleteSubjectRecords(this.selectedSubjects);

                if (result.success) {
                    this.goToPage(1);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 展示新增/编辑题目的弹框，设置弹框中的数据
             */
            async addQuestionRecord() {
                this.clearFormFields();
                await this.getCourses();
                if (this.selectionParams.courseId) {
                    this.setDefaultCourse();
                }
                this.openQuestionDialog();

                this.isEditMode = false;
            },

            /**
             * 清理新增/编辑题目的对象
             */
            clearFormFields() {
                this.addQuestionForm.courseSubjectList = [];
                this.addQuestionForm.tFileManagement = [];
                this.addQuestionForm.subjectContent = '';
                this.addQuestionForm.correctAnswer = '';
                this.addQuestionForm.tSubjectOptionList = [
                    {
                        fOptiontContent: '',
                        fOptiontName: 'A',
                        fSort: 1
                    },

                    {
                        fOptiontContent: '',
                        fOptiontName: 'B',
                        fSort: 2
                    }
                ];
            },

            /**
             * 获取所有课程
             */
            async getCourses() {
                let result = await QuestionsService.getCoursesData();

                if (result.success) {
                    this.courses = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置课程id
             */
            setDefaultCourse() {
                this.addQuestionForm.courseSubjectList = [
                    this.selectionParams.courseId
                ];
            },

            /**
             * 展示弹框
             */
            openQuestionDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 关闭弹框
             */
            closeQuestionDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 添加选项
             */
            addOption() {
                let option = {};
                let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let qnty = this.addQuestionForm.tSubjectOptionList.length;

                if (qnty >= 26) {
                    this.$message.error('选项数量不能超过26个!');
                } else {
                    option.fOptiontName = letters[qnty];
                    option.fOptiontContent = '';
                    option.fSort = ++qnty;

                    this.addQuestionForm.tSubjectOptionList.push(option);
                }
            },

            /**
             * 验证选项的内容
             * @param {Object} rule ---　验证规则的对象
             * @param {Array} value --- 选项数组
             * @param {number} idx --- 选项索引
             * @param {Function} callback --- 函数
             */
            validateOption(rule, value, idx, callback) {
                if (
                    !value[idx].fOptiontContent ||
                    /^\s+$/.test(value[idx].fOptiontContent)) {
                    callback(new Error('请输入选项！'));
                } else {
                    callback();
                }
            },

            /**
             * 删除选项
             * @param {number} idx --- 选项数组中的idx
             */
            deleteOption(idx) {
                let options = this.addQuestionForm.tSubjectOptionList;
                let qnty = options.length;

                if (qnty <= 2) {
                    this.$message.error('最起码两个选项！');
                } else {
                    options.splice(idx, 1);
                    this.resetOptions();
                }
            },

            /**
             * 给选项设置选项名称
             */
            resetOptions() {
                let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                let options = this.addQuestionForm.tSubjectOptionList;
                let qnty = options.length;

                for (let i = 0; i < qnty; i++) {
                    options[i].fOptiontName = letters[i];
                    options[i].fSort = i + 1;
                }
            },

            /**
             * 放大详情图片
             */
            handleDetailsImagePreview(url) {
                this.dialogDetailsFileUrl = this.previewUrl + url;
                this.dialogDetailsImageVisible = true;
            },

            /**
             * 放大编辑图片
             */
            handleEditImagePreview(file) {
                this.dialogEditFileUrl = file.url;
                this.dialogEditImageVisible = true;
            },

            /**
             * 照片上载成功的话，把照片的数据保存到数组里
             */
            handleUploadImageSuccess(response, file, fileList) {
                this.imageUrl = URL.createObjectURL(file.raw);

                console.log('upload success', response, fileList);
                if (response.success) {
                    this.setQuestionsFileList(fileList);
                    console.log(this.addQuestionForm.questionPhotos);
                }
            },

            /**
             * 把附件列表的数据复制到新增试题form
             */
            setQuestionsFileList(fileList) {
                let questionsPhotos = [];
                let qnty = fileList.length;
                let photo = {};
                let response = {};

                questionsPhotos = [];
                for (let i = 0; i < qnty; i++) {
                    if (fileList[i].response) {
                        response = fileList[i].response.data;
                        photo = this.setPhotoListItem(response);
                    } else {
                        photo = fileList[i];
                    }

                    questionsPhotos.push(photo);
                }
                this.addQuestionForm.questionPhotos = questionsPhotos.slice();
            },

            /**
             * 设置图片对象
             * @param {Object} file --- 服务器返回的图片对象
             */
            setPhotoListItem(file) {
                return {
                    url: this.previewUrl + file.fFileLocationUrl,
                    fileLocationUrl: file.fFileLocationUrl,
                    name: file.fFileName,
                    coursewareTitle: file.fFileTitle || file.fCoursewareTitle,
                    type: 3
                };
            },

            /**
             * 是否删除照片？
             */
            handleBeforeImageRemove() {
                return this.$confirm('确定删除？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
            },

            /**
             * 删除照片
             */
            handleImageRemove(file, fileList) {
                this.setQuestionsFileList(fileList);
            },

            /**
             * 获取诈骗的路径
             * @param {string} url --　诈骗的url
             */
            getRelativeLocation(url) {
                let urlParts = url.split('/');

                urlParts.splice(0, 3);

                return '/' + urlParts.join('/');
            },

            /**
             * 提交试题数据
             */
            async submitQuestionsData() {
                this.$refs.addQuestionForm.validate(async valid => {
                    if (valid) {
                        let submittedData = this.setDataToSubmit();

                        let result = null;
                        let page;

                        if (!this.isEditMode) {
                            result = await QuestionsService.insertQuestionRecord(submittedData);
                            page = 1;
                        } else {
                            result = await QuestionsService.updateQuestionRecord(submittedData);
                            page = null;
                        }

                        if (!result.success) {
                            this.$message.error(result.msg);
                        } else {
                            this.closeQuestionDialog();
                            this.goToPage(page);
                        }
                    }
                });
            },

            /**
             * 设置要提交的数据
             */
            setDataToSubmit() {
                let data = {
                    tCourseSubjectList: this.setSubmittedRelatedCourses(),
                    tFileManagement: this.setSubmittedFileList(),
                    tSubject: {},
                    tSubjectAnswerList: this.setSubmittedAnswers(),
                    tSubjectOptionList: this.addQuestionForm.tSubjectOptionList
                };

                if (this.isEditMode) {
                    data.tSubject = this.subjectDetails.tSubject;
                    data.tSubject.fContent = this.addQuestionForm.subjectContent;
                } else {
                    data.tSubject = this.setSubmittedSubject();
                }

                return data;
            },

            /**
             * 设置关联
             */
            setSubmittedRelatedCourses() {
                let submittedCourses = [];
                let coursesList = this.addQuestionForm.courseSubjectList;
                let qnty = coursesList.length;

                for (let i = 0; i < qnty; i++) {
                    let course = { fCourseId: coursesList[i] };

                    submittedCourses.push(course);
                }

                return submittedCourses;
            },

            /**
             * 设置要提交的图片数组
             */
            setSubmittedFileList() {
                let files = this.addQuestionForm.questionPhotos;
                let qnty = files.length;
                let submittedFiles = [];

                for (let i = 0; i < qnty; i++) {
                    let submittedFile = {
                        fCoursewareTitle: files[i].coursewareTitle,
                        fFileLocationUrl: files[i].fileLocationUrl,
                        fFileName: files[i].name,
                        fType: 3
                    };

                    submittedFiles.push(submittedFile);
                }

                return submittedFiles;
            },

            /**
             * 设置题目对象
             */
            setSubmittedSubject() {
                return {
                    fContent: this.addQuestionForm.subjectContent,
                    fIsObjective: false,
                    fType: 1
                };
            },

            /**
             * 设置答案数组
             */
            setSubmittedAnswers() {
                return [
                    {
                        fAnswer: this.addQuestionForm.correctAnswer,
                        fSort: 1
                    }
                ];
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 编辑题目
             * @params {string} fId --- 题目的id
             */
            async editQuestionsRecord(fId) {
                let result = await QuestionsService.getQuestionRecordDetails(fId);

                if (result.success) {
                    this.isEditMode = true;
                    this.subjectDetails = result.obj;
                    this.clearFormFields();
                    this.getCourses();
                    this.setEditQuestionForm();
                    this.openQuestionDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置编辑题目form
             */
            setEditQuestionForm() {
                if (this.subjectDetails) {
                    this.addQuestionForm.courseSubjectList = this.getCourseIdsFromDetails(this.subjectDetails.tCourseSubjectList);
                    this.addQuestionForm.subjectContent = this.subjectDetails.tSubject.fContent;
                    this.addQuestionForm.subjectId = this.subjectDetails.tSubject.fId;
                    this.addQuestionForm.tSubjectOptionList = this.subjectDetails.tSubjectOptionList.slice();
                    this.addQuestionForm.questionPhotos = this.setEditFileList(this.subjectDetails.tFileManagement);
                    this.addQuestionForm.correctAnswer = this.subjectDetails.tSubjectAnswerList[0].fAnswer;
                }
            },

            /**
             * 设置编辑图片列表
             */
            setEditFileList(fileList) {
                let qnty = fileList.length;
                let files = [];

                for (let i = 0; i < qnty; i++) {
                    let file = this.setPhotoListItem(fileList[i]);

                    files.push(file);
                }

                return files;
            },

            /**
             * 从关联课程数组里获取fIds
             * @param {Array} courseSubjectList --- 关联课程数组
             */
            getCourseIdsFromDetails(courseSubjectList) {
                let courses = [];
                let qnty = courseSubjectList.length;

                for (let i = 0; i < qnty; i++) {
                    courses.push(courseSubjectList[i].fCourseId);
                }

                return courses;
            },

            /**
             * 显示详情页
             */
            async showQuestionsDetails(fId) {
                let result = await QuestionsService.getQuestionRecordDetails(fId);

                if (result.success) {
                    this.subjectDetails = result.obj;
                    this.getCourses();
                    this.isDetailsShown = true;
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
             * 关闭详情页
             */
            closeDetailsDialog() {
                this.isDetailsShown = false;
            },
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss">
    .questions-page {
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

    .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 15px;
        width: 24px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;

        .sort-caret {
            width: 0;
            height: 0;
            border: 5px solid transparent;
            position: absolute;
            left: 7px;

            &.ascending {
                top: -3px;
                border-bottom-color: #c0c4cc;

                &.active {
                    border-bottom-color: #409eff
                }
            }

            &.descending {
                bottom: -3px;
                border-top-color: #c0c4cc;

                &.active {
                    border-top-color: #409eff;
                }
            }
        }
    }

    .mt-15 {
        margin-top: 15px;
    }

    .mt-20 {
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

    .button-plus {
        width: 100%;
        height: 50px;
        font-size: 30px;
        color: #ebeef5;
        border: dashed 1px  #409eff;
    }

    .button-plus:hover {
        background-color: #ebeef5;
        border: solid 2px #ebeef5;
    }

    .button-plus:focus {
        color: #ebeef5;
        background-color: transparent;
        border: dashed 1px #ebeef5;
    }

    .option-content {
        width: 90%;
    }

    .option-delete {
        display: inline-block;
        height: 68px;
        line-height: 68px;
        cursor: pointer;
    }

    .thumb-photo {
        width: 147px;
        height: 147px;
        margin-right: 10px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
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

        .preview-image {
            width: 100px;
            cursor: pointer;
        }
    }
    
    .mr-15 {
        margin-right: 15px;
    }
</style>
