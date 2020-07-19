/*
* @Author: 元实
* @Date:   2019-09-05
* @Description: '保养记录'
*/

<template>
    <div class="carerecords-page">
        <div class="container">
            <!-- 保养记录页面头部-->
            <el-form :inline="true" :model="searchParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item label="开始时间" label-width="100px">
                        <el-date-picker
                            v-model="searchParams.startTime"
                            size="medium"
                            type="datetime"
                            class="date-picker"
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间" label-width="100px">
                        <el-date-picker
                            v-model="searchParams.endTime"
                            size="medium"
                            type="datetime"
                            class="date-picker"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="保养人" label-width="100px">
                        <el-select
                            v-model="searchParams.userId"
                            placeholder="保养人"
                            clearable
                            class="select longer">
                            <el-option label="所有保养人" value=""></el-option>
                            <el-option
                                v-for="person in personnel"
                                :key="person.fId"
                                :label="person.fUserName"
                                :value="person.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="保养设备" label-width="100px">
                        <el-select
                            v-model="searchParams.maintainEquipmentId"
                            placeholder="保养设备"
                            clearable
                            class="select longer">
                            <el-option label="所有设备" value=""></el-option>
                            <el-option
                                v-for="equipItem in equipment"
                                :key="equipItem.fId"
                                :label="equipItem.fEquipmentName"
                                :value="equipItem.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="设备级别" label-width="100px">
                        <el-select
                            v-model="searchParams.equipmentLevelId"
                            placeholder="设备级别"
                            clearable
                            class="select longer">
                            <el-option label="所有设备级别" value=""></el-option>
                            <el-option
                                v-for="level in equipmentLevels"
                                :key="level.fId"
                                :label="level.fLevelName"
                                :value="level.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="保养级别" label-width="100px">
                        <el-select
                            v-model="searchParams.maintainLevel"
                            placeholder="保养级别"
                            clearable
                            class="select longer">
                            <el-option label="所有保养级别" value=""></el-option>
                            <el-option label="日常保养" value="0"></el-option>
                            <el-option label="周保养" value="1"></el-option>
                            <el-option label="月保养" value="2"></el-option>
                            <el-option label="年保养" value="3"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item
                        label="设备部门"
                        label-width="100px">
                        <el-cascader
                            v-model="searchParams.departmentId"
                            clearable
                            :options="departments"
                            :props="departmentsProps"
                            :show-all-levels="false"
                            class="select longer"
                            placeholder="请选择设备部门">
                        </el-cascader>
                    </el-form-item>

                    <el-form-item label="设备厂" label-width="100px">
                        <el-select
                            v-model="searchParams.manufacturerId"
                            placeholder="设备厂"
                            clearable
                            class="select longer">
                            <el-option label="所有设备厂" value=""></el-option>
                            <el-option
                                v-for="manufacturer in manufacturers"
                                :key="manufacturer.fId"
                                :label="manufacturer.fManufacturerName"
                                :value="manufacturer.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 保养记录页面头部-->

            <el-tabs
                v-model="equipmentTypeId"
                type="card"
                @tab-click="changeTab">
                <el-tab-pane label="全部" name=""></el-tab-pane>

                <el-tab-pane
                    v-for="type in equipmentTypes"
                    :label="type.fTypeName"
                    :key="type.fId"
                    :name="type.fId"></el-tab-pane>
            </el-tabs>

            <el-row type="flex" justify="end">
                <a
                    :href="BASE_API + '/device-security-service/maintainRecordEquipment/exportExcel'"
                    class="el-button el-button-default el-button--small">
                    <i class="el-icon-download"></i>
                    导出excel
                </a>
                <el-button @click="setRecordsOrder">
                    添加时间
                    <span class="caret-wrapper">
                        <i class="sort-caret ascending" :class="isAscendingOrder ? 'active' : ''"></i>
                        <i class="sort-caret descending" :class="!isAscendingOrder ? 'active' : ''"></i>
                    </span>
                </el-button>
            </el-row>

            <!--设备保养表格-->
            <el-table
                :data="careRecords"
                class="defaultTab margin-top15"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="45vh">

                <el-table-column
                    label="设备名称"
                    prop="fEquipmentName">
                </el-table-column>

                <el-table-column
                    label="设备级别"
                    prop="fLevelName">
                </el-table-column>

                <el-table-column
                    label="设备部门"
                    prop="fDepartmentName">
                </el-table-column>

                <el-table-column
                    label="保养时间"
                    prop="fTime">
                </el-table-column>

                <el-table-column
                    label="保养级别"
                    prop="maintainLevel">
                    <template slot-scope="scope">
                        {{ getMaintenanceLevelName(scope.row.maintainLevel) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="保养人"
                    prop="fUserName">
                </el-table-column>

                <el-table-column
                    label="设备厂"
                    prop="fManufacturerName">
                </el-table-column>

                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showCareRecordDetails(scope.row.fMaintainRecordEquipmentId)" size="small">详情</el-button>
                        <el-button type="text" @click="editCareRecord(scope.row.fMaintainRecordEquipmentId)" size="small">编辑</el-button>
                        <!--<el-button type="text" @click="deleteCareRecord(scope.row.fId)" size="small">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <!--设备保养表格-->

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

            <!-- 新增保养项弹框-->
            <TheDialog
                :modal="isEditFormShown"
                modalTitle="编辑保养记录"
                @closeModal="closeDialog">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="editCareRecordForm"
                        class="demo-form-inline input-form"
                        :model="editCareRecordForm">
                        <el-row type="flex" justify="space-between">
                            <el-form-item
                                label="设备名称"
                                label-width="100px">
                                <el-select
                                    v-model="editCareRecordForm.equipmentId"
                                    placeholder="保养设备"
                                    class="select longer">
                                    <el-option
                                        v-for="equipItem in equipment"
                                        :key="equipItem.fId"
                                        :label="equipItem.fEquipmentName"
                                        :value="equipItem.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                label="保养时间"
                                label-width="100px">
                                <el-date-picker
                                    v-model="editCareRecordForm.maintainDate"
                                    size="medium"
                                    type="datetime"
                                    class="date-picker longer"
                                    placeholder="保养时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-row>

                        <el-row type="flex" justify="space-between">
                            <el-form-item label="保养级别" label-width="100px">
                                <el-select
                                    v-model="editCareRecordForm.maintainLevel"
                                    placeholder="保养级别"
                                    class="select longer">
                                    <el-option label="日常保养" :value="0"></el-option>
                                    <el-option label="周保养" :value="1"></el-option>
                                    <el-option label="月保养" :value="2"></el-option>
                                    <el-option label="年保养" :value="3"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="保养人" label-width="100px">
                                <el-select
                                    v-model="editCareRecordForm.userId"
                                    placeholder="保养人"
                                    clearable
                                    class="select longer">
                                    <el-option
                                        v-for="person in personnel"
                                        :key="person.fId"
                                        :label="person.fUserName"
                                        :value="person.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <!-- 照片 -->
                        <el-container>
                            <el-header class="dialog-sub-header">照片</el-header>

                            <el-row class="margin-top15">
                                <el-upload
                                    accept="image/jpeg, image/gif, image/png, image/jpg"
                                    :action="fileAPI + '/ikingtech/oss/api/upload/v1'"
                                    list-type="picture-card"
                                    :file-list="editImagesList"
                                    :limit="9"
                                    :on-preview="handleEditImagePreview"
                                    :on-success="handleUploadImageSuccess"
                                    :before-remove="handleBeforeImageRemove"
                                    :on-remove="handleImageDelete">
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                                <el-dialog :visible.sync="dialogEditImageVisible" append-to-body="">
                                    <img width="100%" :src="dialogEditFileUrl" alt="">
                                </el-dialog>
                            </el-row>
                        </el-container>
                        <!-- 照片 -->

                        <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                            <el-button type="primary" @click.stop="submitCareRecordData">确定</el-button>
                            <el-button @click.stop="resetForm('addCareItemForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 编辑保养记录弹框-->

            <!-- 保养记录详情 -->
            <el-dialog
                title="保养记录详情"
                :visible.sync="isDetailsShown"
                top="30px"
                width="1000px">
                <div class="details-wrapper">
                <!-- 详情列表 -->
                <table class="details-table">
                    <thead>
                        <tr>
                            <th colspan="2">保养记录详情</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="careRecordDetails.fileManagementList && careRecordDetails.fileManagementList.length">
                            <td>设备照片</td>
                            <td>
                                <el-image
                                    v-for="(image,index) in careRecordDetails.fileManagementList"
                                    :src="previewUrl + image.fFileLocationUrl"
                                    :key="index"
                                    @click="handleDetailsImagePreview(image.fFileLocationUrl)"
                                    class="preview-image">
                                </el-image>

                                <!-- 预览附件 -->
                                <el-dialog :visible.sync="dialogDetailsImageVisible" append-to-body>
                                    <img width="100%" :src="dialogDetailsFileUrl" alt="">
                                </el-dialog>
                                <!-- 预览附件 -->
                            </td>
                        </tr>

                        <tr>
                            <td>设备名称</td>
                            <td>{{ careRecordDetails.fEquipmentName }}</td>
                        </tr>

                        <tr>
                            <td>设备级别</td>
                            <td>{{ careRecordDetails.fLevelName }}</td>
                        </tr>

                        <tr>
                            <td>设备部门</td>
                            <td>{{ careRecordDetails.fDepartmentName }}</td>
                        </tr>

                        <tr>
                            <td>设备厂</td>
                            <td>{{ careRecordDetails.fManufacturerName }}</td>
                        </tr>

                        <tr v-if="careRecordDetails.itemsList && careRecordDetails.itemsList.length">
                            <td>保养项</td>
                            <td>
                                  <el-button type="text" @click="showCareItems" size="big">查看保养项</el-button>

                                <!-- 预览附件 -->
                                <el-dialog
                                    title="保养项"
                                    :visible.sync="isCareItemsShown"
                                    append-to-body
                                    width="600px">
                                     <el-card
                                         v-for="(item,index) in careRecordDetails.itemsList"
                                         shadow="never"
                                         :key="index"
                                         class="item-card margin-bottom15">
                                         <div class="card-head">
                                             <span>{{ item.fMaintainItemsTitle }}</span>
                                         </div>

                                        <div class="card-body grey-font">
                                            <p><span>如有必要：</span><span>{{ item.fMaintainItemsOperate }}</span></p>
                                            <p><span>保养备注：</span><span>{{ item.fMaintainItemsRemarks }}</span></p>
                                        </div>
                                    </el-card>
                                </el-dialog>
                                <!-- 预览附件 -->
                            </td>
                        </tr>

                        <tr>
                            <td>保养时间</td>
                            <td>{{ careRecordDetails.fTime }}</td>
                        </tr>

                        <tr>
                            <td>保养级别</td>
                            <td>{{ getMaintenanceLevelName(careRecordDetails.maintainLevel) }}</td>
                        </tr>

                        <tr>
                            <td>保养人</td>
                            <td>
                                {{  careRecordDetails.fUserName  }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <!-- 详情列表 -->
                </div>
            </el-dialog>
            <!-- 保养记录详情 -->
        </div>
    </div>
</template>

<script>
    import { CareRecordsService } from '@/api/care-records' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
            return {
                personnel: [],  //人员
                equipment: [],  //设备
                equipmentLevels: [],  //设备类型
                equipmentTypes: [],  //设备类型
                manufacturers: [], //设备制造广商
                departments: [], //部门
                careRecords: [], //保养记录

                searchDates: [], //查询日期
                equipmentTypeId: '', //设备类型id
                searchParams: {  //查询筛选条件
                    departmentId: '', //部门id
                    endTime: '',  //保养结束时间
                    equipmentLevelId: '',　//设备级别id
                    equipmentTypeId: '', //设备类型id
                    maintainEquipmentId: '', //保养设备id
                    maintainLevel: '', //保养级别
                    manufacturerId: '',　//设备厂id
                    pageCurrent: 0,
                    pageSize: 0,
                    sort: 0, //按照添加记录时间排序：0 -
                    startTime: '', //保养开始时间
                    userId: '' //保养人
                },

                departmentsProps: {   //部门cascader的设置
                    children: 'children',
                    label: 'fName',
                    value: 'fId',
                    expandTrigger: 'hover',
                    emitPath: false
                },

                isAscendingOrder: true, //添加时间排序: true - 上升的，false -下升的

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                isEditFormShown: false, //是否显示编辑保养记录的弹框

                fileAPI: process.env.FILE_API, //管理文件的借口url
                previewUrl: process.env.PREVIEW_API, //预览附件的借口url
                imageUrl: '',  //附件url
                dialogDetailsImageVisible: false, //是否放大详情照片
                dialogDetailsFileUrl: '', //放大的详情照片url
                dialogEditImageVisible: false, //是否放大编辑保养照片
                dialogEditFileUrl: '', //放大的编辑照片url

                //编辑保养记录
                editImagesList: [], //可编辑的照片列表
                dialogVisible: false, //编辑的时候图片是否放大

                editCareRecordForm: { //编辑保养数据
                    equipmentId: '', //设备id
                    maintainLevel: null, //保养级别
                    fileManagements: [], //保养照片
                    maintainDate: '', //保养日期
                    maintainRecordContent: '',　//保养记录内容
                    userId: ''　//保养人id
                },

                isDetailsShown: false, //是否显示保养记录详情
                isCareItemsShown: false, //是否展示保养项

                careRecordDetails: {}, //保养记录详情

                BASE_API: process.env.BASE_API
            };
        },

        mounted() {
            this.getPersonnel();
            this.getEquipmentTypes();
            this.getEquipment();
            this.getEquipmentLevel();
            this.getDepartments();
            this.getManufacturers();
            this.getCareRecords();
        },

        methods: {
            /**
             * 获取验收人
             */
            async getPersonnel() {
                let result = await CareRecordsService.getAllPersonnelData();

                if (result.success) {
                    this.personnel = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备类型
             */
            async getEquipmentTypes() {
                let result = await CareRecordsService.getEquipmentTypesData();

                if (result.success) {
                    this.equipmentTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备
             */
            async getEquipment() {
                let result = await CareRecordsService.getAllEquipmentData();

                if (result.success) {
                    this.equipment = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备级别
             */
            async getEquipmentLevel() {
                let result = await CareRecordsService.getEquipmentLevelsData();

                if (result.success) {
                    this.equipmentLevels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取部门
             */
            async getDepartments() {
                let result = await CareRecordsService.getDepartmentsData();

                if (result.success) {
                    this.departments = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备生产广商
             */
            async getManufacturers() {
                let result = await CareRecordsService.getManufacturersData();

                if (result.success) {
                    this.manufacturers = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 选择tab的时候，获取保养记录数据
             */
            changeTab() {
                this.getCareRecords();
            },

            /**
             * 选择时间区域的时候，设置查询条件中的startTime和endTime
             * @param {Array} dates -- 开始日期、结束日期
             */
            handleDateRangeChange(dates) {
                console.log('---');
                if (dates) {
                    this.searchParams.startTime = common.YMDParseTime(dates[0]);
                    this.searchParams.endTime = common.YMDParseTime(dates[1]);
                } else {
                    this.searchParams.startTime = '';
                    this.searchParams.endTime = '';
                }
            },

            /**
             * 获取保养记录
             * @returns {Promise<void>}
             */
            async getCareRecords() {
                let result = {};

                this.searchParams.pageSize = this.paginator.pageSize;
                this.searchParams.pageCurrent = this.paginator.currentPage;
                if (this.equipmentTypeId !== '0') {
                    this.searchParams.equipmentTypeId = this.equipmentTypeId;
                } else {
                    this.searchParams.equipmentTypeId = null;
                }

                this.careRecords = [];

                result = await CareRecordsService.getCareRecordsData(this.searchParams);

                if (result.success) {
                    this.careRecords = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取保养级别的名称
             * @param {number} levelId -- 保养级别的id
             */
            getMaintenanceLevelName(levelId) {
                switch (levelId) {
                    case 0: return '日常保养';
                    case 1: return '周保养';
                    case 2: return '月保养';
                    case 3: return '年保养';
                }
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getCareRecords();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.pageCurrent = pageNum;
                }
                this.getCareRecords();
            },

            /**
             * 编辑保养记录
             * @param {number} id  -- 保养记录id
             */
            async editCareRecord(id) {
                let result = await CareRecordsService.getCareRecordDetails(id);

                if (result.success) {
                    this.setEditCareRecordForm(result.obj);
                    this.showEditCareRecordDialog();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 初始化要编辑的数据
             * @param {Object} record -- 保养记录详情
             */
            setEditCareRecordForm(record) {
                this.editCareRecordForm.maintainEquipmentId = record.fMaintainRecordEquipmentId;
                this.editCareRecordForm.equipmentName = record.fEquipmentName;
                this.editCareRecordForm.equipmentId = record.fEquipmentId;
                this.editCareRecordForm.maintainLevel = record.maintainLevel;
                this.editCareRecordForm.maintainDate = record.fTime;
                this.editCareRecordForm.maintainRecordContent = record.fMaintainRecordContent;
                this.editCareRecordForm.userId = record.fUserId;
                this.editCareRecordForm.userName = record.fUserName;
                this.editCareRecordForm.fileManagements = this.setEditRecordImageList(record.fileManagementList);

                this.setPreviewEditImagesList(record.fileManagementList);
            },

            /**
             * 设置编辑数据form中的照片列表
             * @param {Array} fileList -- 照片对象的数组
             */
            setEditRecordImageList(fileList) {
                let qnty = fileList.length;
                let files = [];

                for (let i = 0; i < qnty; i++) {
                    files.push({
                        fFileLocationUrl: fileList[i].fFileLocationUrl,
                        fFileName: fileList[i].fFileName,
                        fType: fileList[i].fType,
                        fFileTitle: this.getFileTitle(fileList[i].fFileName)
                    });
                }

                return files;
            },

            /**
             * 获取照片格式
             * @param {string} fileName -- 照片名称
             */
            getFileTitle(fileName) {
                let parsedName = fileName.split('.');

                return parsedName[1];
            },

            /**
             * 设置在编辑保养弹框上展示的照片列表
             */
            setPreviewEditImagesList(files) {
                let qnty = files.length;

                this.editImagesList = [];

                for (let i = 0; i < qnty; i++) {
                    let Image = {
                        name: files[i].fFileName,
                        url: this.previewUrl + files[i].fFileLocationUrl
                    };

                    this.editImagesList.push(Image);
                }
            },

            /**
             * 展示编辑保养记录弹框
             */
            showEditCareRecordDialog() {
                this.isEditFormShown = true;
            },

            /**
             * 关闭弹框
             */
            closeDialog() {
                this.isEditFormShown = false;
            },

            /**
             * 提交保养记录数据
             */
            async submitCareRecordData() {
                let result = null;

                result = await CareRecordsService.updateCareRecord(this.editCareRecordForm);

                if (result.success) {
                    this.closeDialog();
                    this.goToPage();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 展示保养记录详情
             */
            async showCareRecordDetails(id) {
                let details = await CareRecordsService.getCareRecordDetails(id);

                if (details.success) {
                    this.careRecordDetails = details.obj;
                    this.isDetailsShown = true;
                } else {
                    this.$message.error(details.msg);
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
                let fileManagements = this.editCareRecordForm.fileManagements;

                response.data.fType = 3;
                fileManagements.push(response.data);

                /*if (fileList.length >= 9) {
                    document.getElementsByClassName('el-upload')[0].style.display = 'none';
                }*/
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
            handleImageDelete(file, fileList) {
                let qnty = fileList.length;

                /*if (qnty === 8) {
                    document.getElementsByClassName('el-upload')[0].style.display = 'inline-block';
                }*/

                this.editCareRecordForm.fileManagements = [];
                for (let i = 0; i < qnty; i++) {
                    this.editCareRecordForm.fileManagements.push({
                        fFileLocationUrl: this.getRelativeLocation(fileList[i].url),
                        fFileTitle: this.getFileTitle(fileList[i].name),
                        fFileName: fileList[i].name,
                        fType: 3
                    });
                }
            },

            /**
             * 获取诈骗的路径
             * @param {string} url --　诈骗的url
             */
            getRelativeLocation(url) {
                let urlParts = url.split('/');

                urlParts.splice(0, 3);

                console.log('/' + urlParts.join('/'));
                return '/' + urlParts.join('/');
            },

            /**
             * 展示保养项
             */
            showCareItems() {
                this.isCareItemsShown= true;
            },

            /**
             * 改保养记录顺序
             */
            setRecordsOrder() {
                this.isAscendingOrder = !this.isAscendingOrder;
                this.searchParams.sort = this.isAscendingOrder ? 0 : 1;

                this.getCareRecords();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .carerecords-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding: 15px 10px;
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


        .date-picker {
            .el-input__inner {
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

    .select,
    .input-item {
        &.longer {
            width: 220px;
        }
    }

    .margin-top15 {
        margin-top: 15px;
    }

    .details-wrapper {
        height: calc(100vh - 220px);
        overflow-y: auto;
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
    }

    .item-card {
        border: solid 2px #ebeef5 !important;
    }

    .card-head {
        border-bottom: solid 1px #ebeef5;

        &:after {
            display: block;
            height: 0;
            width: 0;
            content: '';
            clear: both;
        }
    }

    .card-body {
        padding-top: 15px;
    }

    .grey-font {
        color: #666;
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
                width: 500px;
                padding: 6px 15px;
                border: solid 1px #e1e5e8;

                &:nth-child(odd) {
                    text-align: right;
                }
            }
        }

        .preview-image {
            width: 100px;
            height: 100px;
            margin-right: 10px;
            cursor: pointer;
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

    .margin-bottom15 {
        margin-bottom: 15px;
    }
</style>
