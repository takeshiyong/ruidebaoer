/*
* @Author: 杨高杰
* @Date: 2019-08-01
* @Description: '课程管理'
*
* @Modified:
* 1. 2019-09-29 元实 加跳到题目管理页面的链接
*/
<template>
    <div class="courseware-page" id="pheight">
        <div class="container">
            <div class="course-header" v-if="courseShow">
                <el-form :inline="true" :model="course_f" class="demo-form-inline search-form">
                    <el-form-item label="课程名称" label-width="100px">
                        <el-input
                            class="input-father"
                            v-model="course_f.name"
                            placeholder="请输入课程名称"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="课程分类" label-width="100px">
                        <el-select
                            class="input-father"
                            clearable
                            v-model="course_f.cate"
                            placeholder="请选择课程分类"
                        >
                            <el-option
                                v-for="(val,index) in coursecates"
                                :key="index"
                                :label="val.fCourseTypeName"
                                :value="val.fCourseTypeId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="find_course">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="creat_course">新建课程</el-button>
                        <el-badge
                            class="item"
                            value="new"
                            :hidden="bageshow"
                            style="margin-left: 8px;"
                        >
                            <el-button
                                type="warning"
                                icon="el-icon-star-off"
                                circle
                                @click="isrecommendlist"
                            ></el-button>
                        </el-badge>
                    </el-form-item>
                </el-form>
            </div>
            <div class="course-content" v-if="courseShow">
                <el-table
                    :data="course_c"
                    border
                    style="width: 100%"
                    class="defaultTab dictionaryTypeTab"
                >
                    <el-table-column label="序号" width="64" type="index"></el-table-column>
                    <el-table-column prop="fCourseName" label="课程名称" width="240"></el-table-column>
                    <el-table-column prop="fCourseTypeName" label="所属分类" width="240"></el-table-column>
                    <el-table-column prop="fLabelList" label="课程标签" width="240">
                        <template slot-scope="scope">
                            <el-tag
                                style="margin-left: 5px;"
                                v-for="(item,index) in scope.row.fLabelList"
                                :key="index"
                                type="success"
                            >{{item.fLabelName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fChapterNum" label="章节数量" width="100"></el-table-column>
                    <el-table-column prop label="首页推荐" width="100">
                        <template slot-scope="scope">
                            <el-switch
                                :disabled="!scope.row.fIsPublish"
                                @change="isrecommendcourse(scope.row.fCourseId,scope.row.fIsRecommend)"
                                v-model="scope.row.fIsRecommend"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop label="课程发布" width="100">
                        <template slot-scope="scope">
                            <el-switch
                                @change="publish(scope.row.fCourseId,scope.row.fIsPublish)"
                                v-model="scope.row.fIsPublish"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fCourseCoverFile.fFileLocationUrl"
                        label="课程封面"
                        width="100"
                    >
                        <template slot-scope="scope">
                            <el-image
                                style="width: 30px; height:30px;cursor:pointer; "
                                :src="previewUrl+scope.row.fCourseCoverFile.fFileLocationUrl"
                                :preview-src-list="previewUrl+scope.row.fCourseCoverFile.fFileLocationUrl"
                            ></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="fCourseProfiles"
                        label="课程简介"
                        :show-overflow-tooltip="true"
                    ></el-table-column>
                    <el-table-column fixed="right" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="detail_c(scope.row)"
                            >详情</el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="edio(scope.row.fCourseId,scope.$index)"
                            >编辑</el-button>
                            <!--<router-link
                                :to="{
                                    path: '/questions',
                                    query: {
                                        courseId: scope.row.fCourseId
                                    }
                                }"
                                class="link-class">
                                题库
                            </router-link>-->
                            <el-button
                                type="text"
                                size="small"
                                @click="goToQuestions(scope.row.fCourseId)"
                            >题库</el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="removecourse(scope.row.fCourseId)"
                                style="color:#F56C6C;"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="course_pagination">
                    <el-pagination
                        id="page"
                        :current-page="searchParam.currentPage"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="searchParam.sum"
                        :page-size="searchParam.pageSize"
                        :page-sizes="searchParam.pageSizes"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    ></el-pagination>
                </div>
            </div>
            <!-- 详情 -->
            <div class="course-detail-header" v-if="!courseShow">
                <el-page-header @back="goBack" content="课程详情"></el-page-header>
            </div>
            <div class="course-detail-content" v-if="!courseShow">
                <el-row :gutter="20">
                    <el-col :span="8" class="scrool">
                        <el-form :inline="true" class="demo-form-inline">
                            <el-form-item>
                                <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="creat_coursedetail"
                                    style="margin-bottom: 0.9375rem;"
                                >新建章节</el-button>
                                <el-button
                                    type="primary"
                                    icon="el-icon-plus"
                                    @click="creat_detail"
                                    style="margin-bottom: 0.9375rem;"
                                >新建节点</el-button>
                            </el-form-item>
                        </el-form>
                        <el-tree
                            class="filter-tree"
                            :data="course_data"
                            :props="defaultProps"
                            :filter-node-method="filterNode"
                            @node-click="clktree"
                            default-expand-all
                            ref="tree"
                        >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="() => edittree(data)"
                                    >
                                        <i class="el-icon-edit"></i>
                                    </el-button>
                                    <el-button
                                        type="text"
                                        size="mini"
                                        @click.stop="() => removetree(data)"
                                    >
                                        <i class="el-icon-delete"></i>
                                    </el-button>
                                </span>
                            </span>
                        </el-tree>
                    </el-col>
                    <el-col :span="16">
                        <el-table
                            :data="course_c_detail"
                            border
                            stripe
                            style="width: 100%"
                            class="defaultTab dictionaryTypeTab"
                        >
                            <el-table-column label="序号" width="64" type="index"></el-table-column>
                            <el-table-column prop="fChapterTitle" label="节点名称"></el-table-column>
                            <el-table-column prop="fCoursewareProfiles" label="节点简介"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="160">
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="annex(scope.row.fCoursewareId)"
                                    >附件</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </div>
        </div>
        <!-- 新建课程弹窗-->
        <TheDialog :modal="coursem" :modalTitle="modalTitle" @closeModal="coursem=false">
            <div slot="custom-modal-content">
                <el-form
                    :model="courseform"
                    ref="courseform"
                    label-width="100px"
                    class="demo-form-inline"
                >
                    <el-row>
                        <el-col :span="8">
                            <div style="position:relative;">
                                <span style="color: red;position: absolute;top: 10px;left: 24px;fontSize: 12px">*</span>
                                <el-form-item label="课程封面" prop="fPictureUrl">   
                                    <el-upload
                                        class="avatar-uploader"
                                        accept="image/jpeg, image/gif, image/png, image/jpg"
                                        ref="upload"
                                        :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                                        :show-file-list="false"
                                        :on-success="handlersuccess"
                                        :before-upload="handbu"
                                    >
                                        <img v-if="imageUrl" :src="previewUrl+imageUrl" class="avatar" />
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item
                                label="课程名称"
                                label-width="100px"
                                prop="name"
                                :rules="[
                                    { required: true, message: '课程不能为空'},]"
                            >
                                <el-input
                                    type="name"
                                    maxlength="20"
                                    placeholder="请输入课程名称"
                                    v-model="courseform.name"
                                    class="input-w"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="课程分类"
                                prop="classification"
                                :rules="[{required: true,
                                 message: '请选择课程分类', trigger: 'change'},]"
                            >
                                <el-select
                                    v-model="courseform.classification"
                                    filterable
                                    placeholder="请选择"
                                    class="input-w"
                                >
                                    <el-option
                                        v-for="(val,index) in coursecates"
                                        :key="index"
                                        :label="val.fCourseTypeName"
                                        :value="val.fCourseTypeId"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="课程标签" prop="cates">
                                <el-select
                                    v-model="courseform.cates"
                                    multiple
                                    placeholder="请选择"
                                    class="input-w"
                                >
                                    <el-option
                                        v-for="item in options"
                                        :key="item.fLabelId"
                                        :label="item.fLabelName"
                                        :value="item.fLabelId"
                                    ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item
                        label="课程简介"
                        prop="detail"
                        :rules="[
                               { required: true, message: '课程简介不能为空'},]"
                    >
                        <el-input
                            type="textarea"
                            maxlength="200"
                            placeholder="请输入课程简介"
                            show-word-limit
                            v-model="courseform.detail"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            v-if="this.morb==0"
                            type="primary"
                            @click="submitcourrse('courseform')"
                        >创建</el-button>
                        <el-button
                            v-if="this.morb==1"
                            type="primary"
                            @click="ediocourrse('courseform')"
                        >编辑</el-button>
                        <el-button @click="resetcourrse('courseform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <el-dialog title="课程附件" :visible.sync="outerVisible">
            <el-tabs :tab-position="tabPosition">
                <el-tab-pane label="课程视频">
                    <el-table
                        :data="filevideo"
                        border
                        style="width: 100%;font-size:12px;color:#666;"
                        class="defaultTab dictionaryTypeTab"
                    >
                        <el-table-column label="序号" width="64" type="index"></el-table-column>
                        <el-table-column
                            label="文件名称"
                            min-width="100"
                            prop="fFileName"
                            :show-overflow-tooltip="true"
                        >
                            <template slot-scope="scope">
                                <a
                                    style="color: blue;cursor: pointer"
                                    @click="openFile(scope.row.fFileLocationUrl,scope.row.fCoursewareTitle)"
                                >{{scope.row.fFileName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!isRelease" label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    style="margin-right:4px;border-radius:0px;padding:5px 10px;background-color:#E5E5E5;border:0px;color:#333333;"
                                    class="fa fa-trash-o"
                                    size="small"
                                    @click="deleteFile(scope.row.fId)"
                                >&nbsp;删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button class="upt" type="primary" v-if="!isRelease" @click="innerVisible = true">上传视频</el-button>
                </el-tab-pane>
                <el-tab-pane label="课程资料">
                    <el-table
                        :data="filenote"
                        border
                        style="width: 100%;font-size:12px;color:#666;"
                        class="defaultTab"
                    >
                        <el-table-column label="序号" width="64" type="index"></el-table-column>
                        <el-table-column
                            label="文件名称"
                            min-width="100"
                            prop="fFileName"
                            :show-overflow-tooltip="true"
                        >
                            <template slot-scope="scope">
                                <a
                                    style="color: blue;cursor: pointer"
                                    @click="openFile(scope.row.fFileLocationUrl,scope.row.fCoursewareTitle)"
                                >{{scope.row.fFileName}}</a>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="!isRelease" label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button
                                    type="primary"
                                    style="margin-right:4px;border-radius:0px;padding:5px 10px;background-color:#E5E5E5;border:0px;color:#333333;"
                                    class="fa fa-trash-o"
                                    size="small"
                                    @click="deleteFile(scope.row.fId)"
                                >&nbsp;删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button class="upt" v-if="!isRelease" type="primary" @click="innerVisibles = true">上传资料</el-button>
                </el-tab-pane>
            </el-tabs>
            <el-dialog width="30%" title="上传视频" :visible.sync="innerVisible" append-to-body>
                <el-upload
                    class="upload-demo"
                    drag
                    accept=".avi, .wma, .mp4, .3GP, .AVI"
                    :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                    multiple
                    ref="upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="1"
                    :on-exceed="handleExceed"
                    :before-upload="handbus"
                    :file-list="fileList"
                    :on-success="handleSuccesssp"
                    :show-upload-list="true"
                    :on-error="handleErr"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                </el-upload>
                <div class="upload-wj">
                    <el-button type="primary" @click="creat_filesp()">确定</el-button>
                </div>
            </el-dialog>
            <el-dialog width="30%" title="上传文件" :visible.sync="innerVisibles" append-to-body>
                <el-upload
                    class="upload-demo"
                    drag
                    accept="image/jpeg, image/gif, image/png, .doc, .docx, .xls, xlsx, .pdf, .ppt, .avi, .wma, .mp4, .3GP"
                    :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                    multiple
                    ref="upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    :limit="10"
                    :on-exceed="handleExceedwj"
                    :before-upload="handbuwj"
                    :file-list="fileList"
                    :on-success="handleSuccesswj"
                    :show-upload-list="true"
                    :on-error="handleErrwj"
                >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                        将文件拖到此处，或
                        <em>点击上传</em>
                    </div>
                </el-upload>
                <div class="upload-wj">
                    <el-button type="primary" @click="creat_filewj()">确定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
        <!-- 首页推荐列表 -->
        <el-dialog title="课程推荐" :visible.sync="seerulecate" width="60%" center>
            <el-table
                :data="romForm"
                border
                style="width: 100%;font-size:12px;color:#666;"
                class="defaultTab dictionaryTypeTab"
            >
                <el-table-column label="序号" width="64" type="index"></el-table-column>
                <el-table-column
                    label="课程名称"
                    min-width="100"
                    width="200"
                    prop="fCourseName"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column prop="fCourseProfiles" label="课程简介" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column
                    label="设置置顶"
                    min-width="100"
                    prop="roof"
                    :show-overflow-tooltip="true"
                    width="180"
                >
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.$index==0"
                            type="danger"
                            @click="istop(scope.row.fCourseId)"
                        >已置顶</el-button>
                        <el-button
                            v-if="scope.$index==1"
                            type="danger"
                            @click="istop(scope.row.fCourseId)"
                        >已置顶</el-button>
                        <el-button
                            v-if="scope.$index>1"
                            type="primary"
                            @click="istop(scope.row.fCourseId)"
                        >置顶</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="course_pagination" style="text-align: right;margin-top: 0.625rem;">
                <el-pagination
                    id="page"
                    :current-page="searchParams.currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="searchParams.sum"
                    :page-size="searchParams.pageSize"
                    :page-sizes="searchParams.pageSizes"
                    @size-change="handleSizeChanges"
                    @current-change="handleCurrentChanges"
                ></el-pagination>
            </div>
        </el-dialog>
        <!-- 新建章节 -->
        <TheDialog :modal="chapter" :modalTitle="modalTitle" @closeModal="chapter=false;">
            <div slot="custom-modal-content">
                <el-form
                    :model="numberValidateForm"
                    ref="numberValidateForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item
                        label="章节名称"
                        prop="name"
                        :rules="[
                  { required: true, message: '名称不能为空'},
                   { min: 2, max: 18, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                 ]"
                    >
                        <el-input
                            maxlength="18"
                            type="typename"
                            placeholder="请输入章节名称"
                            v-model="numberValidateForm.name"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            v-if="this.modalTitle=='新建章节'"
                            type="primary"
                            @click="submitname('numberValidateForm')"
                        >提交</el-button>
                        <el-button
                            v-if="this.modalTitle=='编辑章节'"
                            type="primary"
                            @click="edioname('numberValidateForm')"
                        >编辑</el-button>
                        <el-button @click="resetForm('numberValidateForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 新建章节节点 -->
        <TheDialog
            :modal="chapter_detail"
            :modalTitle="modalTitle"
            @closeModal="chapter_detail=false;"
        >
            <div slot="custom-modal-content">
                <el-form
                    :model="detailForm"
                    :rules="rules"
                    ref="detailForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item
                        label="课程章节"
                        prop="classification"
                        :rules="[{required: true,
                 message: '请选择课程章节', trigger: 'change'},]"
                    >
                        <el-select
                            v-model="detailForm.classification"
                            filterable
                            placeholder="请选择"
                            class="input-w"
                        >
                            <el-option
                                v-for="item in options1"
                                :key="item.fChapterId"
                                :label="item.fChapterTitle"
                                :value="item.fChapterId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="节点名称"
                        prop="name"
                        :rules="[
                  { required: true, message: '节点名称不能为空'},
                  { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
                 ]"
                    >
                        <el-input
                            maxlength="18"
                            style="width: 50%;"
                            type="text"
                            placeholder="请输入节点名称"
                            v-model="detailForm.name"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="视频时长" prop="time">
                        <el-input
                            style="width: 50%;"
                            type="text"
                            placeholder="请输入预上传视频的时长"
                            v-model="detailForm.time"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="展示内容"
                        prop="zsnr"
                        :rules="[{required: true,
                 message: '请选择展示内容', trigger: 'change'},]"
                    >
                        <el-select
                            v-model="detailForm.zsnr"
                            filterable
                            placeholder="请选择展示内容"
                            class="input-w"
                        >
                            <el-option
                                v-for="item in options3"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="节点简介"
                        prop="desc"
                        :rules="[
                  { required: true, message: '节点简介名称不能为空'},
                 ]"
                    >
                        <el-input
                            type="textarea"
                            maxlength="60"
                            show-word-limit
                            v-model="detailForm.desc"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            v-if="this.modalTitle=='新建节点'"
                            type="primary"
                            @click="submitdetail('detailForm')"
                        >提交</el-button>
                        <el-button
                            v-if="this.modalTitle=='编辑节点'"
                            type="primary"
                            @click="ediodetail('detailForm')"
                        >编辑</el-button>
                        <el-button @click="detailForm('detailForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 查看图片 -->
        <el-dialog :show-close="true" :visible.sync="dialogVisible" append-to-body width="50%">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
        <!-- 查看视频 -->
        <el-dialog :show-close="true" :visible.sync="videoVisible" append-to-body width="30%">
            <video width="320" height="240" controls>
                <source :src="videourl" />
            </video>
        </el-dialog>
    </div>
</template>
<script>
    import { CoursefeilService } from "@/api/network-college"; //引入api
    import TheDialog from "@/components/TheDialog";
    export default {
    components: {
        TheDialog
    },
    data() {
        //校验正数
        let validateInt = (rule, value, callback) => {
            if (!value) {
                callback();
                return;
            }
            let reg = /^[1-9][0-9]*$/;
            if (!reg.test(value)) {
                callback(new Error("请填写正确的数值(大于0的整数值)"));
            } else {
                callback();
            }
        };
        return {
            /* 页面顶部搜索相关*/
            course_f: {
                name: null, //课程名称
                author: "", //课程作者
                cate: null //课程类型
            },
            /* 页面body表格相关*/
            course_c: [],
            romForm: [
                {
                    name: "如何使用料径识别", //课程名称
                    detail: "", //课程简介
                    roof: "" //课程置顶
                }
            ],
            /* 首页分页相关*/
            searchParam: {
                currentPage: 1,
                sum: 2,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10
            },
            /* 推荐分页相关*/
            searchParams: {
                currentPage: 1,
                sum: 2,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10
            },
            /*新建课程form表单*/
            courseform: {
                name: "", //课程名称
                author: "", //课程作者
                cates: [], //课程标签
                detail: "", //课程简介
                recommend: false, //编辑和新建的状态
                rlease: false, //发布的开关
                classification: "" //课程分类
            },
            numberValidateForm: {
                name: "", //新建章节名字
                detail: null
            },
            detailForm: {
                classification: "", //章节名称
                name: "", //节点名称
                time: "", //预上传视频时长
                zsnr: "",
                desc: ""
            },
            coursem: false, //弹窗的显隐
            modalTitle: "新建", //弹窗的标题
            courseShow: true, //控制列表和详情的切换
            filterText: "", //过滤找寻章节
            previewUrls: process.env.PREVIEW_API,
            outerVisible: false,
            tabPosition: "left",
            innerVisible: false,
            innerVisibles: false,
            dialogVisible: false, //预览图片的弹框
            dialogImageUrl: "",
            videoVisible: false, //视频预览
            videourl: "",
            //文件上传相关
            imageUrl: "", //图片路径
            imagecate: "", //图片格式
            imagename: "", //文件名字
            seerulecate: false, //课程推荐的显隐
            chapter: false, //章节的显隐
            chapter_detail: false, //新建章节节点的显隐
            coursecates: [], //课程类型
            fileTr: [], //附件表格
            bageshow: true,
            /*章节目录children数组表示小节*/
            course_data: [],
            defaultProps: {
                children: "children",
                label: "label"
            },
            /**课程是否发布的判断 */
            isRelease: false,
            /* 章节信息和增删改*/
            course_c_detail: [],
            options: [],
            options1: [],
            options3: [
                {
                    id: 0,
                    title: "视频"
                },
                {
                    id: 1,
                    title: "附件"
                }
            ],
            value1: [],
            value2: [],
            valuel: [],
            courseId: "", //课程id
            coursewareId: "", //节点id
            detaillist: [],
            filevideo: [], //课件视频
            filenote: [], //课件附件
            wjlist: [], //文件list
            morb: 0, //新建还是编辑的判断
            fileList: [],
            fileid: "", //文件id
            ediojzid: "", //编辑章节的时候传的id
            ediojdid: "", //编辑节点时候的id
            previewUrl: process.env.PREVIEW_API, //预览附件
            rules: {
                time: [
                    {
                        required: true,
                        message: "请填写视频时长",
                        trigger: "blur"
                    },
                    {
                        validator: validateInt,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {},
    mounted() {
        this.coursecate();
        this.courselist();
        this.courselable();
    },
    methods: {
        publish(id, type) {
            this.publishcourse(id, type);
        },
        /* 查询*/
        find_course() {
            this.courselist();
        },

        /* 新建课程*/
        creat_course() {
            this.coursem = true;
            this.modalTitle = "新建课程";
            this.morb = 0;
            this.imageUrl = "";
            this.imagename = "";
            this.imagecate = "";
            (this.videosc = ""),
                (this.courseform = {
                    name: "", //课程名称
                    author: "", //课程作者
                    cates: [], //课程标签
                    detail: "", //课程简介
                    recommend: false, //编辑和新建的状态
                    rlease: false, //发布的开关
                    classification: "" //课程分类
                });
        },
        edio(id, index) {
            this.courseId = id;
            this.modalTitle = "编辑课程";
            this.morb = 1;
            //处理标签数组回显
            let courlable = [];
            for (var i = 0; i < this.course_c[index].fLabelList.length; i++) {
                courlable.push(this.course_c[index].fLabelList[i].fLabelId);
            }
            this.courseform = {
                name: this.course_c[index].fCourseName, //课程名称
                cates: courlable, //课程标签
                detail: this.course_c[index].fCourseProfiles, //课程简介
                recommend: false, //编辑和新建的状态
                rlease: false, //发布的开关
                classification: this.course_c[index].fCourseTypeId //课程分类
            };
            this.imageUrl = this.course_c[
                index
            ].fCourseCoverFile.fFileLocationUrl;
            this.imagename = this.course_c[index].fCourseCoverFile.fFileName;
            this.imagecate = this.course_c[index].fCourseCoverFile.fFileTitle;
            this.fileid = this.course_c[index].fCourseCoverFile.fId;
            this.coursem = true;
        },
        //新建章节
        creat_coursedetail() {
            this.chapter = true;
            this.modalTitle = "新建章节";
            this.numberValidateForm = {
                name: ""
            };
        },
        //新建章节节点
        creat_detail() {
            this.chapter_detail = true;
            this.modalTitle = "新建节点";
            this.detailForm = {
                classification: "", //章节名称
                name: "", //节点名称
                time: "",
                zsjd: "",
                desc: ""
            };
        },
        /*提交新建课程表单*/
        submitcourrse(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.addcourse();
                } else {
                    
                    console.log("error submit!!", this.courseform);
                    return false;
                }
            });
        },
        submitname(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.coursezj();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /*提交编辑章节表单*/
        ediocourrse(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.updatecourse();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        /*提交新建章节节点表单*/
        submitdetail(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.addjd();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        annex(fid) {
            this.coursewareId = fid;
            this.allfile(fid);
            this.outerVisible = true;
        },
        /* 重置表单*/
        resetcourrse(formName) {
            this.$refs[formName].resetFields();
        },
        /*文件确定*/
        creat_filewj() {
            this.keepwj();
        },
        /*视频确定*/
        creat_filesp() {
            this.keepvideo();
        },
        /**
         * 上传成功后的钩子
         */
        handlersuccess(res, file) {
            if (res.success) {
                if (
                    res.data != null &&
                    res.data != undefined &&
                    JSON.stringify(res.data) != "{}"
                ) {
                    this.imageUrl = res.data.fFileLocationUrl;
                    this.imagename = res.data.fFileName;
                    this.imagecate = res.data.fFileTitle;
                }
            } else {
                this.$message.error("上传失败！");
            }
        },
        /**
         * 上传成功后的钩子
         */
        handbu(file) {
            if (file.size > 10 * 1024 * 1024) {
                this.$message.warning("文件超过10M！");
                return false;
            }
        },
        /* 分页操作*/
        handleSizeChange(val) {
            this.searchParam.pageSize = val;
            this.courselist();
        },
        handleCurrentChange(val) {
            this.searchParam.currentPage = val;
            this.courselist();
        },
        /* 推荐list分页操作*/
        handleSizeChanges(val) {
            this.searchParams.pageSize = val;
            this.isrecommendlist();
        },
        handleCurrentChanges(val) {
            this.searchParams.currentPage = val;
            this.isrecommendlist();
        },
        /* 查看课程详情*/
        detail_c(obj) {
            this.courseId = obj.fCourseId;
            this.isRelease = obj.fIsPublish;
            this.couesedetail(obj.fCourseId);
        },
        /* 课程推荐list*/
        recommend_course() {
            this.seerulecate = true;
        },
        /* 返回课程list*/
        goBack() {
            this.courseShow = !this.courseShow;
            this.course_c_detail = [];
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.fChapterTitle.indexOf(value) !== -1;
        },
        /* 删除某节课*/
        removecourse(fid) {
            this.$confirm("是否删除该课程?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deletecourse(fid);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        //查询课程类型
        async coursecate() {
            const res = await CoursefeilService.coursecate({});
            if (res.success) {
                this.coursecates = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //查询课程标签
        async courselable() {
            const res = await CoursefeilService.courselable({});
            if (res.success) {
                this.options = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //获取所有课程表格
        async courselist() {
            const res = await CoursefeilService.courselist({
                pageCurrent: this.searchParam.currentPage,
                pageSize: this.searchParam.pageSize,
                fCourseName: this.course_f.name,
                fCourseTypeId: this.course_f.cate
            });
            if (res.success) {
                this.course_c = res.obj.items;
                this.searchParam.sum = res.obj.itemTotal;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //新增课程
        async addcourse() {
            if (!this.imageUrl || !this.imagename) {
                this.$message.warning('请上传课程封面');
                return;
            }
            const res = await CoursefeilService.addcourse({
                coverFile: {
                    fCoursewareTitle: this.imagecate,
                    fFileLocationUrl: this.imageUrl,
                    fFileName: this.imagename,
                    fType: 1
                },
                fCourseDifficulty: 0,
                fCourseName: this.courseform.name,
                fCourseProfiles: this.courseform.detail,
                fCourseTypeId: this.courseform.classification,
                fLableIdList: this.courseform.cates
            });
            if (res.success) {
                this.coursem = false;
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑课程updatecourse
        async updatecourse() {
            const res = await CoursefeilService.updatecourse({
                coverFile: {
                    fCoursewareTitle: this.imagecate,
                    fFileLocationUrl: this.imageUrl,
                    fFileName: this.imagename,
                    fId: this.fileid,
                    fType: 1
                },
                fCourseDifficulty: 0,
                fCourseId: this.courseId,
                fCourseName: this.courseform.name,
                fCourseProfiles: this.courseform.detail,
                fCourseTypeId: this.courseform.classification,
                fLableIdList: this.courseform.cates
            });
            if (res.success) {
                this.coursem = false;
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //删除课程
        async deletecourse(id) {
            const res = await CoursefeilService.deletecourse(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //查询详情
        async couesedetail(id) {
            const res = await CoursefeilService.couesedetail(id);
            if (res.success) {
                this.courseShow = !this.courseShow;
                this.course_data = JSON.parse(
                    JSON.stringify(res).replace(
                        /fCoursewareTitle/g,
                        "fChapterTitle"
                    )
                ).obj.tChapterManagementDetailsList;
                this.defaultProps = {
                    children: "tCoursewareManagementDetailsList",
                    label: "fChapterTitle"
                };
                this.options1 = res.obj.tChapterManagementDetailsList;
                //循环把所有节点信息遍历出来
                let course_list = [];
                for (var i = 0; i < this.course_data.length; i++) {
                    for (
                        var j = 0;
                        j <
                        this.course_data[i].tCoursewareManagementDetailsList
                            .length;
                        j++
                    ) {
                        course_list.push(
                            this.course_data[i]
                                .tCoursewareManagementDetailsList[j]
                        );
                    }
                }
                this.course_c_detail = course_list;
            } else {
                this.$message.warning(res.msg);
            }
        },
        async couesedetails(id) {
            const res = await CoursefeilService.couesedetail(id);
            if (res.success) {
                this.course_data = JSON.parse(
                    JSON.stringify(res).replace(
                        /fCoursewareTitle/g,
                        "fChapterTitle"
                    )
                ).obj.tChapterManagementDetailsList;
                this.defaultProps = {
                    children: "tCoursewareManagementDetailsList",
                    label: "fChapterTitle"
                };
                this.options1 = res.obj.tChapterManagementDetailsList;
                //循环把所有节点信息遍历出来
                let course_list = [];
                for (var i = 0; i < this.course_data.length; i++) {
                    for (
                        var j = 0;
                        j <
                        this.course_data[i].tCoursewareManagementDetailsList
                            .length;
                        j++
                    ) {
                        course_list.push(
                            this.course_data[i]
                                .tCoursewareManagementDetailsList[j]
                        );
                    }
                }
                this.course_c_detail = course_list;
                //this.course_c_detail=JSON.parse(JSON.stringify(res).replace(/fCoursewareTitle/g, 'fChapterTitle')).obj.tCoursewareManagementDetailsList
            } else {
                this.$message.warning(res.msg);
            }
        },
        clktree(course_data) {
            //通过判断course_data对象中是否含有某个属性来达到点击处理父子节点显示不同数据效果
            if (
                course_data.hasOwnProperty(
                    "tCoursewareManagementDetailsList"
                ) == true
            ) {
                this.course_c_detail =
                    course_data.tCoursewareManagementDetailsList;
            } else {
                let list = [];
                this.detaillist = "";
                list.push(course_data);
                this.detaillist = list;
                this.course_c_detail = this.detaillist;
            }
        },
        //新建章节
        async coursezj() {
            const res = await CoursefeilService.coursezj({
                fChapterProfiles: "暂无数据",
                fChapterTitle: this.numberValidateForm.name,
                fCourseId: this.courseId
            });
            if (res.success) {
                this.$message({
                    message: "新建成功",
                    type: "success"
                });
                this.chapter = false;
                this.couesedetails(this.courseId);
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //删除章节和节点
        removetree(data) {
            //通过判断data对象中是否含有某个属性来达到点击处理不同的删除效果（章节和节点各自的删除）
            if (
                data.hasOwnProperty("tCoursewareManagementDetailsList") == true
            ) {
                this.$confirm("此操作将删除该章节, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.deleatzj(data.fChapterId);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            } else {
                this.$confirm("此操作将删除该节点, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.deleatjd(data.fCoursewareId);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消删除"
                        });
                    });
            }
        },
        //具体的删除节点和章节api方法
        //章节
        async deleatzj(id) {
            const res = await CoursefeilService.deleatzj(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.couesedetails(this.courseId);
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //节点
        async deleatjd(id) {
            const res = await CoursefeilService.deleatjd(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.couesedetails(this.courseId);
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //新建章节节点
        async addjd() {
            const res = await CoursefeilService.addjd({
                fChapterId: this.detailForm.classification,
                fCoursewareHourLong: this.detailForm.time,
                fCoursewareOpenType: this.detailForm.zsnr,
                fCoursewareProfiles: this.detailForm.desc,
                fCoursewareTitle: this.detailForm.name
            });
            if (res.success) {
                this.$message({
                    message: "新建成功",
                    type: "success"
                });
                this.chapter_detail = false;
                this.couesedetails(this.courseId);
                this.courselist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑章节和节点
        edittree(data) {
            //通过判断data对象中是否含有某个属性来达到点击处理不同的编辑效果（章节和节点各自的编辑）
            if (
                data.hasOwnProperty("tCoursewareManagementDetailsList") == true
            ) {
                this.chapter = true;
                this.modalTitle = "编辑章节";
                this.numberValidateForm.name = data.fChapterTitle;
                this.ediojzid = data.fChapterId;
            } else {
                this.chapter_detail = true;
                this.modalTitle = "编辑节点";
                this.ediojdid = data.fCoursewareId;
                this.detailForm = {
                    classification: data.fChapterId, //章节名称
                    name: data.fChapterTitle, //节点名称
                    time: data.fCoursewareHourLong, //预上传视频时长
                    zsnr: data.fCoursewareOpenType,
                    desc: data.fCoursewareProfiles
                };
            }
        },
        //编辑章节
        edioname() {
            this.ediozj();
        },
        async ediozj() {
            const res = await CoursefeilService.ediozj({
                fChapterProfiles: "暂无数据",
                fChapterId: this.ediojzid,
                fChapterTitle: this.numberValidateForm.name,
                fCourseId: this.courseId
            });
            if (res.success) {
                this.$message({
                    message: "编辑成功",
                    type: "success"
                });
                this.chapter = false;
                this.couesedetails(this.courseId);
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑节点
        ediodetail() {
            this.ediojd();
        },
        async ediojd() {
            const res = await CoursefeilService.ediojd({
                fChapterId: this.detailForm.classification,
                fCoursewareHourLong: this.detailForm.time,
                fCoursewareOpenType: this.detailForm.zsnr,
                fCoursewareProfiles: this.detailForm.desc,
                fCoursewareTitle: this.detailForm.name,
                fCoursewareId: this.ediojdid
            });
            if (res.success) {
                this.$message({
                    message: "编辑成功",
                    type: "success"
                });
                this.chapter_detail = false;
                this.couesedetails(this.courseId);
            } else {
                this.$message.warning(res.msg);
            }
        },
        //查询课件信息
        async allfile(id) {
            const res = await CoursefeilService.allfile(id);
            if (res.success) {
                this.filevideo = res.obj.showFile;
                this.filenote = res.obj.enclosureFile;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //视频文件上传
        handleRemove(file, fileList) {
            //上传文件失败操作
            let fileLists = this.fileList.map(data => data.uid);
            this.fileList.splice(fileLists.indexOf(file.uid), 1);
        },
        handlePreview(file) {},
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 1 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleErr(err, file, fileList) {},
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handbus(file) {},
        handleSuccesssp(res, file, fileList) {
            if (res.data != null && res.data != undefined) {
                res.data = JSON.parse(
                    JSON.stringify(res.data).replace(
                        /fFileTitle/g,
                        "fCoursewareTitle"
                    )
                );
                this.videosc = { fType: 2, ...res.data };
            } else {
                this.handleRemove(file);
                this.$message.warning("上传失败");
            }
        },
        //文件上传
        handleRemovewj(file, fileList) {
            //上传文件失败操作
            // let fileLists = this.fileList.map((data)=>(data.uid));
            // this.fileList.splice(fileLists.indexOf(file.uid), 1);
        },
        handleExceedwj(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleErrwj(err, file, fileList) {},
        beforeRemovewj(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handbuwj(file) {
            if (file.size > 10 * 1024 * 1024) {
                this.$message.warning("文件超过10M！");
                return false;
            }
        },
        handleSuccesswj(res, file, fileList) {
            if (res.data != null) {
                this.wjlist.push(res.data);
                this.wjlist = JSON.parse(
                    JSON.stringify(this.wjlist).replace(
                        /fFileTitle/g,
                        "fCoursewareTitle"
                    )
                );
            } else {
                this.handleRemove(file);
                this.$message.warning("上传失败");
            }
        },
        //视频上传确定
        async keepvideo() {
            const res = await CoursefeilService.keepvideo({
                fCoursewareId: this.coursewareId,
                showFile: this.videosc
            });
            if (res.success) {
                this.$message({
                    message: "新建成功",
                    type: "success"
                });
                this.innerVisible = false;
                this.fileList = [];
                this.allfile(this.coursewareId);
            } else {
                this.$message.warning(res.msg);
            }
        },
        //文件上传确定
        async keepwj() {
            const res = await CoursefeilService.keepwj({
                fCoursewareId: this.coursewareId,
                enclosureFile: this.wjlist
            });
            if (res.success) {
                this.$message({
                    message: "新建成功",
                    type: "success"
                });
                this.innerVisibles = false;
                this.fileList = [];
                this.allfile(this.coursewareId);
            } else {
                this.$message.warning(res.msg);
            }
        },
        //课程发布
        async publishcourse(id, type) {
            const res = await CoursefeilService.publishcourse({
                fCourseId: id,
                fIsPublish: type
            });
            if (res.success) {
                if (type == true) {
                    this.$message({
                        message: "发布成功",
                        type: "success"
                    });
                    this.courselist();
                } else {
                    this.$message("已取消发布");
                }
            } else {
                this.$message.warning(res.msg);
            }
        },
        //课程推荐
        async isrecommendcourse(id, type) {
            const res = await CoursefeilService.isrecommendcourse({
                fCourseId: id,
                fIsRecommend: type
            });
            if (res.success) {
                if (type == true) {
                    this.$message({
                        message: "推荐成功",
                        type: "success"
                    });
                    this.bageshow = false;
                    this.courselist();
                    this.isrecommendlist();
                } else {
                    this.$message("已取消推荐");
                }
            } else {
                this.$message.warning(res.msg);
            }
        },
        //课程推荐的列表isrecommendlist
        async isrecommendlist() {
            const res = await CoursefeilService.isrecommendlist({
                pageCurrent: this.searchParams.currentPage,
                pageSize: this.searchParams.pageSize
            });
            if (res.success) {
                this.seerulecate = true;
                this.romForm = res.obj.items;
                this.searchParams.sum = res.obj.itemTotal;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //课程推荐
        async istop(id) {
            const res = await CoursefeilService.istop(id);
            if (res.success) {
                this.$message({
                    message: "置顶成功",
                    type: "success"
                });
                this.isrecommendlist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //打开文件
        openFile(fileurl, filehz) {
            if (filehz == "jpg" || filehz == "png") {
                this.openPic(fileurl);
            } else if (
                filehz === "doc" ||
                filehz == "docx" ||
                filehz == "xlsx" ||
                filehz == "xls" ||
                filehz == "ppt"
            ) {
                window.open(
                    this.previewUrl + fileurl,
                    "",
                    "width=1000,height=880,top=80,left=450,toolbar=no, menubar=no, scrollbars=no, resizable=no"
                );
            } else if (
                filehz === "avi" ||
                filehz == "wma" ||
                filehz == "mp4" ||
                filehz == "3GP"
            ) {
                this.videourl = this.previewUrl + fileurl;
                this.videoVisible = true;
            }
        },
        //图片预览
        openPic(path) {
            this.dialogImageUrl = this.previewUrl + path;
            this.dialogVisible = true;
        },
        //附件视频删除
        deleteFile(id) {
            this.$confirm("此操作将删除该附件, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteFiles(id);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除"
                    });
                });
        },
        async deleteFiles(id) {
            const res = await CoursefeilService.deleteFile(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.allfile(this.coursewareId);
            } else {
                this.$message.warning(res.msg);
            }
        },

        /**
         * 跳到题目管理
         * @param {string} courseId ---　课程id
         * @author  元实
         */
        goToQuestions(courseId) {
            this.$router.push('/questions');
            sessionStorage.courseId = courseId;
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .courseware-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        .container {
            padding: 15px 10px;
            .course_pagination {
                margin-top: 1.25rem;
                text-align: right;
            }
        }
        .course-detail-content {
            padding: 20px;
            height: 100%;
            overflow-y: auto;
        }
    }
    .input-w {
        width: 50%;
    }
    .scrool {
        border-right: 1px solid #e1e5e8;
        padding: 20px;
        height: calc(100vh - 170px);
    }
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .upt {
        float: right;
        margin-top: 15px;
    }
    /deep/ .el-upload {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .upload-wj {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 15px;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 132px;
        height: 132px;
        line-height: 132px;
        text-align: center;
    }
    .avatar {
        width: 132px;
        height: 132px;
        display: block;
    }

    .link-class {
        font-size: 12px;
        color: #409EFF;
    }
</style>
