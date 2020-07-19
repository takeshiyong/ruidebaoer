/*
* @Author: 元实
* @Date:   2019-10-17
* @Description: '设备资料列表'
*/

<template>
    <div class="equipinfo-page">
        <div class="container">
            <el-row>
                <el-col :lg="6" :md="6" :sm="24" :xs="24">
                    <div class="left-div">
                        <div class="left-search">
                            <el-input
                                v-model="modelParams.keyword"
                                placeholder="搜索"
                                autocomplete="off"
                                clearable
                                @input="getEquipmentModel">
                                <el-button
                                    type="text"
                                    slot="suffix"
                                    class="el-icon-search left-search-btn"
                                    @click="getEquipmentModel"></el-button>
                            </el-input>

                            <el-button
                                type="primary"
                                icon="el-icon-plus"
                                @click.stop="addEquipModel"
                                class="mt-15 full-width">添加型号</el-button>

                            <div class="main mt-15">
                                <el-menu
                                    v-if="this.modelParams.keyword === ''"
                                    ref="modelsMenu"
                                    @open="showEquipmentModels">
                                    <el-submenu v-for="(equipType, typeIdx) in equipTypes" :index="`${typeIdx}`" :key="equipType.fId">
                                        <template slot="title">
                                            <i class="el-icon-monitor"></i>
                                            <span>{{ equipType.fTypeName }}</span>
                                        </template>

                                        <el-menu-item
                                            v-for="(equipModel, modelIdx) in equipType.models"
                                            :index="`${typeIdx}-${modelIdx}`"
                                            :key="equipModel.fId"
                                            @click="getModelFiles(equipModel)">
                                            {{ equipModel.fEquipmentType }}
                                        </el-menu-item>
                                    </el-submenu>
                                </el-menu>

                                <el-tree
                                    v-else
                                    :data="foundModels"
                                    :props="modelsProps"
                                    @node-click="getModelFiles"
                                    highlight-current
                                    node-key="fId">
                                    <span class="custom-tree-node" slot-scope="{ node, item }">
                                        <span><i class="redoublefont redouble-point point"></i>{{ node.label }}</span>
                                    </span>
                                </el-tree>
                            </div>
                        </div>
                    </div>
                </el-col>

                <el-col :lg="18" :md="18" :sm="24" :xs="24">
                    <div class="right-div">
                        <el-row>
                            <el-button type="primary" icon="el-icon-plus" @click.stop="addEquipDoc" size="small">添加</el-button>
                        </el-row>

                        <el-row class="mt-15">
                            <!--文件表格-->
                            <el-table
                                :data="files"
                                class="defaultTab"
                                highlight-current-row
                                stripe
                                style="width: 100%"
                                max-height="250vh">

                                <el-table-column
                                    label="文件名称"
                                    prop="fFileName"
                                    min-width="200">
                                    <template slot-scope="scope">
                                        <i :class="['file-icon', getFileTypeIcon(scope.row.fCoursewareTitle)]"></i>
                                        <span class="file-name">{{ scope.row.fFileName }}</span>
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    label="大小"
                                    prop="fTrainTypeId"
                                    width="130">
                                 </el-table-column>

                                <el-table-column
                                    label="上传时间"
                                    prop="fCreateTime"
                                    width="200">
                                </el-table-column>

                                <el-table-column
                                    label="操作"
                                    fixed="right"
                                    width="150">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small">
                                            <a :href="previewUrl + scope.row.fFileLocationUrl" target="_blank" style="color: #409EFF">下载</a>
                                        </el-button>
                                        <!--<el-button type="text" @click="previewFile(scope.row.fId)" size="small">预览</el-button>-->
                                        <el-button type="text" @click="deleteFile(scope.row.fId)" size="small">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!--文件表格-->

                            <!-- 文件表格分页-->
                            <div class="block defaultPage" v-if="paginator.pagesQnty > 0">
                                <el-pagination
                                    id="page"
                                    @size-change="changePageSize"
                                    @current-change="getModelFiles"
                                    :current-page.sync="paginator.currentPage"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="paginator.totalRecordsQnty"
                                    :page-count="paginator.pagesQnty"
                                    :page-sizes="paginator.pageSizes"
                                    :page-size="paginator.pageSize">
                                </el-pagination>
                            </div>
                            <!-- 文件表格分页-->
                        </el-row>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!-- 设备型号新增弹框-->
        <TheDialog
            :modal="isAddEquipModelFormShown"
            modalTitle="添加型号"
            @closeModal="closeAddEquipModelDialog">
            <template v-slot:custom-modal-content>
                <el-form
                    ref="addEquipModelForm"
                    class="demo-form-inline input-form"
                    :model="addEquipModelForm"
                    :rules="addEquipModelRules">
                    <el-row type="flex" justify="space-between">
                        <el-form-item
                            label="设备型号"
                            label-width="100px"
                            prop="fEquipmentType">
                            <el-input
                                v-model="addEquipModelForm.fEquipmentType"
                                autocomplete="off"
                                placeholder="请输入设备型号"
                                clearable
                                class="input-item longer">
                            </el-input>
                        </el-form-item>


                        <el-form-item
                            label="设备类型"
                            label-width="100px"
                            prop="fTypeId">
                            <el-select
                                v-model="addEquipModelForm.fTypeId"
                                placeholder="请选择设备类型"
                                clearable
                                class="input-item">
                                <el-option
                                    v-for="type in equipTypes"
                                    :key="type.fId"
                                    :label="type.fTypeName"
                                    :value="type.fId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                        <el-button type="primary" @click.stop="submitEquipModelData">确定</el-button>
                        <el-button @click.stop="resetForm('addEquipLevelForm')">重置</el-button>
                    </el-row>
                </el-form>
            </template>
        </TheDialog>
        <!-- 设备型号新增弹框-->

        <!-- 设备型号文件新增弹框-->
        <TheDialog
            :modal="isAddEquipDocFormShown"
            modalTitle="添加文件"
            @closeModal="closeAddEquipDocDialog">
            <template v-slot:custom-modal-content>
                <el-form
                    ref="addEquipDocForm"
                    class="demo-form-inline input-form"
                    :model="addEquipDocForm"
                    :rules="addEquipDocRules">
                    <el-row type="flex" justify="space-between">
                        <el-form-item
                            label="设备型号"
                            label-width="100px"
                            prop="tTypeModelId">
                            <el-select
                                v-model="addEquipDocForm.tTypeModelId"
                                placeholder="请选择设备型号"
                                clearable
                                class="input-item">
                                <el-option
                                    v-for="model in allEquipModels"
                                    :key="model.fId"
                                    :label="model.fEquipmentType"
                                    :value="model.fId">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="添加人名称"
                            label-width="100px"
                            prop="fName">
                            <el-select
                                v-model="addEquipDocForm.fName"
                                placeholder="请选择人员"
                                clearable
                                class="input-item">
                                <el-option
                                    v-for="person in personnel"
                                    :key="person.fId"
                                    :label="person.fUserName"
                                    :value="person.fUserName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-container class="margin-top15">
                            <el-header class="dialog-sub-header"><i class="mandatory-field">*</i>文件</el-header>

                            <el-upload
                                ref="upload"
                                drag
                                :action="fileAPI + '/ikingtech/oss/api/upload/v1'"
                                :before-remove="beforeRemoveDoc"
                                :on-remove="handleRemoveDoc"
                                :on-success="handleUploadDocSuccess"
                                multiple>
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖至此处或<em>点击</em></div>
                            </el-upload>
                        </el-container>
                    </el-row>

                    <el-row  type="flex" justify="center" class="form-buttons mt-15">
                        <el-button type="primary" @click.stop="submitEquipDocData">确定</el-button>
                        <el-button @click.stop="resetForm('addEquipLevelForm')">重置</el-button>
                    </el-row>
                </el-form>
            </template>
        </TheDialog>
        <!-- 设备型号文件新增弹框-->
    </div>
</template>

<script>
    import { EquipmentInfoService } from '@/api/equipment' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件

    export default {
        components: {
            TheDialog
        },

        data() {
          return {
              equipTypes: [], //设备类型
              equipModels: [], //设备型号
              selectedTypeIdx: null, //选择的设备类型的索引

              selectModelsParams: { //获取对应设备类型的设备型号的请求属性
                  currentPage: 1,
                  pageSize: 100,
                  fId: ''　//设备类型id
              },

              modelParams: { //设备型号的请求属性
                  currentPage: 1,
                  pageSize: 100,
                  keyword: ''　//关键词
              },

              isSearchModelResult: false, //是否用搜索功能找到的设备型号
              foundModels: [], //搜索的设备型号
              modelsProps: {
                  children: [],
                  label: 'fEquipmentType',
              },

              files: [], //对应设备型号的文件
              fileParams: {  //获取文件的请求参数
                  currentPage: 1,
                  fId: '',　//
                  keyword: '', //关键词
                  pageSize: 10,
                  typeModelId: '' //
              },

              isAddEquipModelFormShown: false, //新增设备型号的弹框是否显示的
              addEquipModelForm: { //新增设备型号的参数
                  fEquipmentType: '', //设备型号
                  fTypeId: ''　//设备类型
              },
              addEquipModelRules: { //验证新增设备型号参数
                  fEquipmentType: [
                      { required: true, message: '请输入设备型号', trigger: 'blur' }
                  ],

                  fTypeId: [
                      { required: true, message: '请选择设备类型', trigger: 'blur' }
                  ]
              },

              isAddEquipDocFormShown: false, //新增设备文件的弹框是否显示的
              allEquipModels: [], //所有的设备型号
              personnel: [], //所有的人员
              fileAPI: process.env.FILE_API, //管理文件的借口url
              previewUrl: process.env.PREVIEW_API, //预览附件的借口url
              imageUrl: '',  //附件url
              dialogImageVisible: false, //是否放大附件
              dialogVideoVisible: false, //是否放大视频
              dialogFileUrl: '', //放大的附件url
              addEquipDocForm: { //新增设备文件的form
                  tTypeModelId: '', //设备型号
                  fName: '' //添加人名称
              },
              addEquipDocFiles: [], //设备文件对象数组
              addEquipDocRules: {
                  tTypeModelId: [
                      { required: true, message: '请选择设备型号', trigger: 'blur' }
                  ],

                  fName: [
                      { required: true, message: '请选择添加的人', trigger: 'blur' }
                  ]
              },

              paginator: {
                  currentPage: 1,  //当前页
                  pageSize: 10, //一页显示多少条
                  pageSizes: [10, 20, 40], //一页显示多少条
                  pagesQnty: 2, //页数
                  totalRecordsQnty: 0  //一共多少条数据
              },
          };
        },

        mounted() {
            this.getEquipmentTypes();
        },

        methods: {
            /**
             * 获取设备类型
             */
            async getEquipmentTypes() {
                let result = await EquipmentInfoService.getEquipmentTypes();

                if (result.success) {
                    this.equipTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             *　显示设备型号
             * @param {number} itemIdx  --- 选择的菜单的项
             */
            async showEquipmentModels(itemIdx) {
                let typeId = this.equipTypes[itemIdx].fId;

                this.selectedTypeIdx = itemIdx;
                this.selectModelsParams.fId = typeId;

                let models = await this.getEquipmentModelsForType();
                let type = Object.assign({}, this.equipTypes[itemIdx]);

                this.equipTypes.splice(itemIdx, 1, Object.assign({}, type, { models: models }));
            },

            /**
             * 获取对应设备类型的设备型号
             * @returns {Promise<void>}
             */
            async getEquipmentModelsForType() {
                let result = await EquipmentInfoService.getEquipmentModelsForType(this.selectModelsParams);

                if (result.success) {
                    return result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备型号
             * @returns {Promise<void>}
             */
            async getEquipmentModel() {
                let result = await EquipmentInfoService.getEquipmentModel(this.modelParams);

                if (result.success) {
                    this.isSearchModelResult = true;
                    this.foundModels = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取对应设备型号的文件
             * @params {Object} model --- 设备型号对象
             * @returns {Promise<void>}
             */
            async getModelFiles(model) {
                let result = null;

                if (model) {
                    this.fileParams.typeModelId = model.fId;
                }
                this.fileParams.currentPage = this.paginator.currentPage;
                this.fileParams.pageSize = this.paginator.pageSize;
                result = await EquipmentInfoService.getModelFiles(this.fileParams);
                if (result.success) {
                    this.isSearchModelResult = true;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.files = result.obj.items;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取对应文件格式的class
             * @param {string} type  --- 文件格式
             */
            getFileTypeIcon(type) {
                switch (type) {
                    case 'doc':
                    case 'docx': return 'icon-doc';

                    case 'pdf': return 'icon-pdf';

                    case 'exel': return 'icon-exel';

                    case 'jpg':
                    case 'jpeg':
                    case 'png':
                    case 'bmp': return 'icon-image';

                    default: return '';
                }
            },

            /**
             * 删除文件
             * @param {string} fId --- 文件fId
             */
            async deleteFile(fId) {
                this.$confirm('确定删除文件？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await EquipmentInfoService.deleteDocument(fId);

                    if (result.success) {
                        this.getModelFiles();
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 添加设备型号
             */
            addEquipModel() {
                this.openAddEquipModelDialog();
                this.clearAddEquipModelForm();
            },

            /**
             * 打开新增设备型号的弹框
             */
            openAddEquipModelDialog() {
                this.isAddEquipModelFormShown = true;
            },

            /**
             * 清理添加设备型号数据
             */
            clearAddEquipModelForm() {
                this.addEquipModelForm.fEquipmentType = '';
                this.addEquipModelForm.fTypeId = '';
            },

            /**
             * 关闭新增设备型号的弹框
             */
            closeAddEquipModelDialog() {
                this.isAddEquipModelFormShown = false;
            },

            /**
             * 提交设备型号数据
             */
            submitEquipModelData() {
                this.$refs.addEquipModelForm.validate(async valid => {
                    if (valid) {
                        let result = await EquipmentInfoService.insertEquipModel(this.addEquipModelForm);

                        if (result.success) {
                            if (this.selectModelsParams.fId === this.addEquipModelForm.fTypeId) {
                                let models = await this.getEquipmentModelsForType();
                                let type = Object.assign({}, this.equipTypes[this.selectedTypeIdx]);

                                this.equipTypes.splice(this.selectedTypeIdx, 1, Object.assign({}, type, { models: models }));
                            }
                            this.closeAddEquipModelDialog();
                        } else {
                            this.$message.error(result.msg);
                        }
                    }
                });
            },

            /**
             * 添加文件
             */
            addEquipDoc() {
                this.openAddEquipDocDialog();
                this.clearAddEquipDocForm();
                this.getAllModels();
                this.getAllPersonnel();
            },

            /**
             * 打开新增设备文件的弹框
             */
            openAddEquipDocDialog() {
                this.isAddEquipDocFormShown = true;
            },

            /**
             * 清理添加文件数据
             */
            clearAddEquipDocForm() {
                this.addEquipDocForm.tTypeModelId = '';
                this.addEquipDocForm.fName = '';
            },

            /**
             * 关闭新增设备文件的弹框
             */
            closeAddEquipDocDialog() {
                this.isAddEquipDocFormShown = false;
            },

            /**
             * 获取所有的设备型号
             */
            async getAllModels() {
                let result = await EquipmentInfoService.getAllModels();

                if (result.success) {
                    this.allEquipModels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取人员
             */
            async getAllPersonnel() {
                let result = await EquipmentInfoService.getAllPersonnel();

                if (result.success) {
                    this.personnel = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 处理上载文件成功的状态
             * @param result
             * @param file
             * @param fileList
             */
            handleUploadDocSuccess(result, file, fileList) {
                if (result.success) {
                    this.setAddEquipDocFormFields(result);
                }
            },

            /**
             * 设置文件属性
             * @param {Object} file --- 文件对象
             */
            setAddEquipDocFormFields(file) {
                let fileUploadRespose = file.data;

                if (fileUploadRespose) {
                    let file = {
                        fCoursewareTitle: fileUploadRespose.fFileTitle,
                        fFileLocationUrl: fileUploadRespose.fFileLocationUrl,
                        fFileName: fileUploadRespose.fFileName,
                        fType: this.getFileType(fileUploadRespose.fFileTitle)
                    };

                    this.addEquipDocFiles.push(file);
                }
            },

            /**
             * 获取文件类型
             * @param {string} fileExtention --- 文件附名
             */
            getFileType(fileExtention) {
                switch (fileExtention) {
                    case 'jpeg':
                    case 'gif':
                    case 'png':
                    case 'jpg': return 1;

                    case 'avi':
                    case 'AVI':
                    case 'wma':
                    case 'mp4':
                    case '3GP': return 2;

                    default: return 3;
                }
            },

            /**
             * 确定是否要删除文件
             * @param {string} fileName ---　文件名称
             */
            beforeRemoveDoc(fileName) {
                return this.$confirm(`确定移除 ${fileName.name}？`);
            },

            /**
             * 删除文件
             * @param {Object} file --- 文件对象
             * @param {Array} fileList ---　文件对象数组
             */
            handleRemoveDoc(file, fileList) {
                const qnty = fileList.length;

                this.addEquipDocFiles = [];
                console.log(qnty, fileList);
                for (let i = 0; i < qnty; i++) {
                    let fileData = fileList[i].response;
                    this.setAddEquipDocFormFields(fileData);
                }
            },

            /**
             * 提交文件数据
             */
            submitEquipDocData() {
                this.$refs.addEquipDocForm.validate(async valid => {
                    if (valid) {
                        if (!this.addEquipDocFiles.length) {
                            this.$message.error('请添加文件！');
                            return;
                        }

                        this.setModelPersonForSubmit();

                        let result = await EquipmentInfoService.insertEquipDoc(this.addEquipDocFiles);

                        if (result.success) {
                            this.closeAddEquipDocDialog();
                            if (this.fileParams.typeModelId) {
                                this.getModelFiles();
                            }
                        } else {
                            this.$message.error(result.msg);
                        }
                    } else {
                        //this.$message.error('请输入设备型号数据');
                    }
                });
            },

            /**
             * 给要提交的数据设置设备型号
             */
            setModelPersonForSubmit() {
                const modeId = this.addEquipDocForm.tTypeModelId;
                const name = this.addEquipDocForm.fName;
                const qnty = this.addEquipDocFiles.length;

                for (let i = 0; i < qnty; i++) {
                    this.addEquipDocFiles[i].tTypeModelId = modeId;
                    this.addEquipDocFiles[i].fName = name;
                }
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getModelFiles();
            },
        }
    }

</script>

<style lang="scss">
    .equipinfo-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding:15px 10px;

            .left-div {
                border-right: 1px solid #f1f1f1;
                height: calc(100vh - 90px);

                .header-line {
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }

                .left-search {
                    padding: 20px;
                    .left-search-btn {
                        font-size: 18px;
                        line-height: 12px!important;
                        color: #545454!important;
                    }
                }

            }

            .right-div {
                height: calc(100vh - 130px);
                padding: 20px 15px;
                background: #fff;
                border-radius:8px;
            }

            .el-menu {
                border-right: none;

                &.el-menu--inline {
                    //display: none !important;
                }
            }

            .el-tree-node {
                padding: 5px 0;
            }
        }
    }

    .mt-15 {
        margin-top: 15px;
    }

    .full-width {
        width: 100%;
    }

    .file-icon {
        display: inline-block;
        width: 25px;
        height: 25px;
        margin-right: 10px;
        vertical-align: middle;
    }

    .icon-doc {
        background: url('data:image/png;base64,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') center no-repeat;
        -webkit-background-size: auto 100%;
        background-size: auto 100%;
    }

    .icon-pdf {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFE0lEQVR4Xu2bfWxTVRTAz5smGI2t/uHWbqsfAV1YF1BnFjucirJSZmAGafljNEyyYhZB99HFhUS+VkyUFYuSBRhgxj7MtjJ0iaE6AfWPlcBEIu3WKRJj62gbNembHyuwPnMbWtrX99q99tX11fuS/bG+e84953fPPee8LwJYjr15+dUEwCYgYA3bmP/qd/Xg4MRDFcuK0zEfwaR0ryR/NwHwdjomTEZn87Vf4XJf36klNTVVycjHk4kBEFx5Aj7he6JU9CEA6LjU1dXzRG2tNhVddNkYAO0S6RgAUcrnJKnqCgFAesbN5oNytbo+VZ0heYYIkM4SBJHD1wR86IkEgPRd7u01LNmwgZctyhAB+RQfRvOpgw7A7/PBWEdH3TPbth1NdR5BAkBOz/h88F1Xd035m1v7UoEgWADIaT9JUpPDwy8v1WqHk4UgaADI6d8cjhsXTKbHqw4dGk8GguABIKd/d0xen+ztKV5mMPzEFUJWAAhC+OHHmYmTQ0UVra2/cIGQNQCQ0+6Ll6Y/Ll2d1wSuf+YKIasAIKevnLK4z1StevA1gBtzgZB1AJDTV0dGnN1K5cM7AQKJIGQlAOT0z2fOXn3kxRcWZgWA9UNmKFQoEvkSc/6cyTSiaGxUxhMURAQ8t2snPLVZxxkAErjQcfBk2ev1a9mEBQHg7oICqB87nxQAJPT98Z6upRu1tUwKBAEAGf6Yeh2s/mB/0hBGWt5qVba/9y5dgWAAIMMLKytBtccAYlkhZxDoCtJqNG5d3tZ2IFJYUACQ4X/dvAn3L5bDnaJ7oejZCk4gZny+wEvvGO4QNICQ8f7ZAPw9m7DMxwDa84c3atEFFwGclpxhsN49hQFkxRZINhJwBOAtgHMAToI4CUYQwH0AvZy0SzLvyVCyJY9JDpdBXAZxGcRlEJdBXAZvE8B9AO4DaARwIzTHTnCBWAS5xfIofN5xO/h9ZEwDxjTWabUmbPBkLE+D/NMkeG32hPJp7QQ1J8wgK499XEU6nWBpaALn6Gh4fraxXrsdLh7uBPvAYIyt1R8dg0WqlaxOGqUF8wsAvbk1atwH1nZj2BBZeTko9E2QK5dD9wol+JzO4Dn62NwSOYhkMpBrNEEn7f0DYGlojHJIM2QO/j+wdl1SjrIJ8XYtwAQATYrCfYtjIgoO21g0vmS9Blaa3o+BKVgAyCntl18A6XTBp69uYowA+uogZ1HUHChafHvbCDUCxDIZ1J0/N+cIiIyCgVfU4dwhiAhAexf9hY4HSuRQqquDBeL7oLOsLFwR4m0BJItyh+bEIHze0Ai2W/oQANYqQJJR0cIlSfCaA+gTky5XsDx9tX1HOAEyJUG63KJVKqg+dhToEXCXSAxnt++I8c9P+ua/DCZa1UirE41dvnsXPKmrgyNlT4fBCWIL0MsgWyjGAxDKGagxiix5/wsAaO+rTPuCPUF3pTIqrLMKwJZJB3htNnDd6g5RskROo9LnJ6eD5TKyc0SRlPEAVPtNcMViQS8mJkzCpZt1sJDW1qJrBpfVCrb+fsbrB4W+Ga6TJHx7uDOhfi4DeKsCXCbNpLEYAL4tjm+L49vikTmJ6bO5PwmCuCeTEhdftlAUNd3iuSaKD0Ai/YYAgtsLeHxZmG49FJzWe6ZWxAVglEiqKMj5LN22zIf+HAg83+R2fx0XADqZaR9P8wKLgjf0nqkP6boYvx4PQsiT6gCIFoKAR3kxYL6UUJSdgEBbs8fTz2TCvxBBxV9125qBAAAAAElFTkSuQmCC') center no-repeat;
    }

    .icon-exel {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFeUlEQVR4Xu2bfUwTZxjAn8NhIjD4Q4y6D2AwRRp1MOtGZB8mQrO5DUG3Ukfq2JwLTWaXBQxsiaaRf7ak7o+5pMvMkk0aAT8orgiLRZHNYlRk0TnUzSrINupgyTYompb1lue2G6V3ba93x9Zr3kv6T+99vn7v+z7Pc++1FIS4ir+o2AB+6jUKoDTUmP/q+6o8raMyd6NmNuxRfEpLjup2Aw07Z8OgGJ3HNzTBYVe77aWHX9goRj6cDAcAzjzlp9rkNiRFHwLAy37TYS3N1uil6AqW5QAosVX0AUWtktOIVF0sANTz2ZWDDa+qKnZJ1cnK8wDQ/QkUJMhlQA49gQAmfB6wfm/bbliu/0gO3VwAbTpaDsVy6ggEgHoRwsHr9te3qjZ/KtWOIgGwENoHuyo3Ly07IAWCYgFg0L/cGfNbBqyrTeq3+8VCUDQADPrm+LCveaAt/91C44AYCIoHgEEPjg977bdPqoxLqlzRQogLABj00PiPd3tGz+S+kqO9FQ2EuAGAQX/987mxOqc544z20B2hEOIKAAbtdPe53/ppX8YF9Sc+IRDiDgAGfdbdP1y4yJ4FlMkfCUJcAsCgO4ZOXn4ua92KuADQWPIhLExaECkWzv0DV1sdlXmbwj5GK2IF1BZUgybj6agBoMChH9pt2qWhH6MVAWB+Yho0rf9YFAAUOjbo+Pz5hzRVfAoUAQAdX3d/EdSp3xQN4YOL++pr8t94P1iBYgD4aT8ULiiA7QVbReWDUI/RigHAzpzXexeyUh6A5DlJoL4vP6oVMeH1+I2rts0JFFIcANb5qSkf+LzeqADg4NMv22fErFgAUUf+j4CjrJkAiIstQFaASAJkC5AcQJIgqQKkCgQQII1QcDUpicFXYyIrHq8YKYOkDJIySMogKYOkDE4TIH0A6QOCCAhthJITkyAlMRluT47yNhx893PSMsE9OQoe32TE3gbfBC2clw4o4/p9CFx/DAmSi6RYtkaoPOdZ0OduAsOpd3ghmJ/YBQjB0F3/r0/4YyfL5f1gc3WG9VO/7EUoz36GAcxeeKzd6uoE67UjkWIMe182ABgcBgk0DbXOhhmzgwEgHPz+0tj0L1cQQOO1I9B49XBIJ9csVoPpsRpmXKurg9G7Ml3FvBrTPPgUmM7tgd6RPtEQZAOAHuDytKx9D47f6gHzN3+/ukJnzUU7eQMVAsD0eA0z87Wnd3OCROhCtk84OrICQEO4FQzLtzAAnCPnAd/kXvr1CpjO7uH4IRRAdmomGE7VSw6WD4TsANAIztrK+XlMLkiZmwLV3XW8zgsBwG4BTJY2VwcDE5OgXNesAMCladXsheR7kjj7PtBxIQDYbWRYsQVyUjMZcYSB28x2o1PyqpgVAOw28ExNwvXfBmGHs4F3woQCYIWxFOKKKFq8mllhWAn0DqMkCLIDYBMhzg7OEibFUJk+WgCBFNnkinYs3+4XvSNkBYBLHwPGmWfrfagSiB5LAYDyTNkF4K0QQonICgCT3yPpKqjurp/RDKGj2akZnOUqBADqxJUUXOsRNlaYXvcFMPdbhMbLGScbAHam+RoTNikG5wMEcHFsgPkEXh6fB2w3vmS+Qni433FM78h5pgKwjdC9c5M5sKMlIRuA2kcNzKyH6urQaczk2NCwzQuT2dOyOD5jcgvsG7Drw+S3ZpGaGYvPAQgCbYV69hAKQjYAQg3G2jgCgJwKk1NhciocmJf4zgQnAGD6JCLWspgEf2igx7vKWlLDAihu031FATwpwU7MitI0faKrvKU4wgrQrgdIOBazUUhxLIFa6yht6gkLAG/G2p+npcTMytI0bewqb9kbrIv33+M4qPiobhvlhx1AwRI5HPgfdXznB2g4UdbcwufDX7US8l+kP3ocAAAAAElFTkSuQmCC') center no-repeat;
    }

    .icon-image {
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEVElEQVR4Xu2bWUwTQRjHv5HgAViuUosHclXAA4kaqfGIKGoLeEaJog+S6IMafdBEX/RJTTQx8UETfTDRFwuJMSYaKRFvYmgxHogJURElggjlkNYVLMU1s7qmbrel25217rrz2J3vP/P95ptvp9/uIvDTVtVbTOg72okQbPDX52/9fiK7oGl2rH66FOMhPlFzveUA0OiUFAOGolk1fzPUOFpurtRllIRiH8jGB8Aqe8XiUQAPSQ8kRg8DwK3a8faSWZdZLkaLa+sDwGSz3EQIFZEcRKwWCwDr3O9pPVugTd0rVpO19wFgtle0AkAKqQFI6HgD+AXhcIE29TgJbT4AHQCgJyFOSoML4IvHDVZH89bSiTMsYseQJQDsNDU8RNd2t64z6w3XxUCQLQAGgsdNNzg7TQsTU26FCkHWALDTrQP97nv9HVnlyTnvQ4EgewDY6Q+DrgEb1WEo1Wa1C4WgCADY6bZBJ9U5RKXO00zsFgJBMQCw081UX48hOj4JEKKDhaAoANjpp/2fmufGJRv+WwDY8UaXozFXo8sNBoLiIoB1+jXVa8+KSTSOBEEWAE7mLINZ43Uj+eJz/Xb3+/MrktJ2BTKUBYCdKXmwXp8tGAA2eNT74fSixJT9/oxlAUAbORbO5RZDdERkSBCeOTuPzYnVH+EzlgUAPPGlCVPgYObCkABgo2ufXpVuSM6+whWQDQA88ZyoODhoWAwTxkQLBoH/PNU7P5YsS0it8jb2LYjYLR8RoGTBI/wlA7fHDVPHxEBURATMTRBWthjwuAd3ZxjHBQRgtlf8c/UAPrae4SHAMIS2B0t2/LHostoCQp3l62/N36ICUMQWCDUa1AhQt4CaA9QkqCZBLwLqOYB7O5HLSTDst8GfBYqga49BzbfR5Qiqn5hOxM4B3Od1YibF2hbVV5KQCaihAiB1EGIj4FDTXWh0dYlaOVZLlhHAAtCNjoZZGh3Y+trwk1tBQGQPoOVrH1zMWwMxEZHQ+Y2C8oYb/xcA7PSlvNWM03j1Nz256gMgPSoOFsRPhsvtL32uyT4CcA7At8VcjQ5eOLt8cgKu5p6daWJqeduf/4yOLjf1G4QiAASK+f3p+VCoTfvd5cvwEJR6RYmiAWDHMQBuw5HARoGiAGCH1+qnwekWO+PziZzlTHLkNu/bp2IAcFcbJ0d/NXycDNmEqAgA/kLdX26o62uHo29qmcuKACD06S017IaWr5+VA0DQyYfTWdYRUNP9jjn9iWnbJs1kzGX5X0CM41xbFYBaD1ALIiR3FK+WWhEiVRHCb26Rbvh4LHUjFgFST1QqfRUAqS0g1QpJratGgBoBI7wfYLJVvEEIMqUOxbDo07TLaizTeI/N93QYv025MSwTlHhQGuBOdf6WwsAAbJVGQHSdxHMJjzyil1rnlz0ICABf/Nc+niZDi95nzS87w9Xi/XqcgfC40kx/p/cggGIyEwiPCg1wBdHogtW4mffbwh8dx2Zfhb4muAAAAABJRU5ErkJggg==') center no-repeat;
        background-size: auto 100%;
    }

    .file-name {
        vertical-align: middle;
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

    .main {
        height: 70vh;
        overflow-y: auto;
    }
</style>
