/*
* @Author: 王侃
* @Date:   2019-07-23
* @Description: '数据字典'
*/
<template>
    <div class="catalog-page">
        <div class="container">
            <el-row>
                <el-col :lg="6" :md="6" :sm="24" :xs="24">
                    <div class="left-div">
                        <div class="left-div-header">
                            <span>字典类别</span>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="text" icon="el-icon-delete" @click="deleteDicCategory" class="opear-btn delete-btn" v-if="showBtn('deleteDictCatalog')"></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" content="编辑" placement="top">
                                <el-button type="text" icon="el-icon-edit" @click="updateDicCategory" class="opear-btn update-btn" v-if="showBtn('updateDictCatalog')"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="新建" placement="top">
                                <el-button type="text" icon="el-icon-plus" @click="insertDicCategory" class="opear-btn insert-btn" v-if="showBtn('insertDictCatalog')"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="header-line"></div>
                        <div class="left-search">
                            <el-input v-model="dicCategoryReq.typeName">
                                <el-button type="text" slot="suffix" class="el-icon-search left-search-btn" @click="dicCategorySearch"></el-button>
                            </el-input>
                            <el-button @click="dicCategoryAllSearch" class="left-all-btn">全部类别({{count}})</el-button>
                        </div>
                        <div class="Category">
                            <el-tree :data="CategoryTreeData" :props="defaultProps" @node-click="handleNodeClick" highlight-current class="Category-tree" ref="tree" node-key="fId">
                                <span class="custom-tree-node" slot-scope="{ node, CategoryTreeData }">
                                    <span><i class="redoublefont redouble-point point"></i>{{ node.label }}</span>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="9" :md="9" :sm="24" :xs="24">
                    <div class="mid-div">
                        <div class="opear">
                            <el-form :inline="true" label-width="60px" class="demo-form-inline search-form">
                                <el-form-item label="类型">
                                    <el-input placeholder="请输入类型" clearable  size="small" class="input-father" v-model="req.typeName">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="" label-width="0px">
                                    <el-button type="primary" size="small"  @click="dictionaryTypeSearch"><i class="el-icon-search"></i>搜索</el-button>
                                    <el-button-group>
                                        <el-button type="primary" icon="el-icon-plus" @click="insertDicItems" v-if="showBtn('insertDictType')">新建</el-button>
                                        <el-button type="primary" icon="el-icon-edit" @click="updateDicItems" v-if="showBtn('updateDictType')">编辑</el-button>
                                        <el-button type="danger" icon="el-icon-delete" @click="deleteDicItems" v-if="showBtn('deleteDictType')">删除</el-button>
                                    </el-button-group>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-table :data="dictionaryTypeTr" class="defaultTab dictionaryTypeTab" highlight-current-row  @row-click="choseDictionaryTypeRow">
                            <el-table-column label="字典类型" min-width="90" prop="fDictionaryTypeName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="参数" min-width="80" prop="fPym" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="参数说明" min-width="100" prop="fDescription" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="系统预设" min-width="90" prop="fIsSysDefaultText">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.fIsSysDefault === true">是</span>
                                    <span v-else>否</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                <el-col :lg="9" :md="9" :sm="24" :xs="24">
                    <div class="right-div">
                        <div class="opear">
                            <el-form :inline="true" label-width="60px" class="demo-form-inline search-form">
                                <el-form-item label="内容">
                                    <el-input placeholder="请输入内容" clearable  size="small" class="input-father" v-model="dicContentReq.dicContent">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="" label-width="0px">
                                    <el-button type="primary" size="small"  @click="dictionaryItemSearch"><i class="el-icon-search"></i>搜索</el-button>
                                    <el-button-group>
                                        <el-button type="primary" icon="el-icon-plus" @click="insertDicContext" v-if="showBtn('insertDictContent')">新建</el-button>
                                        <el-button type="primary" icon="el-icon-edit" @click="updateDicContext" v-if="showBtn('updateDictContent')">编辑</el-button>
                                        <el-button type="danger" icon="el-icon-delete" @click="deleteDicContext" v-if="showBtn('deleteDictContent')">删除</el-button>
                                    </el-button-group>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-table :data="dictionaryItemsTr" class="defaultTab dictionaryItemsTab" highlight-current-row @row-click="choseDictionaryItemsRow">
                            <el-table-column label="字典内容" min-width="100" prop="fItemName" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="参数" min-width="100" prop="fPym" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="值" min-width="80" prop="fItemValue" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column label="备注" min-width="80" prop="fDescription" :show-overflow-tooltip="true"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹层 -->
        <!-- 0.类别弹层 -->
        <TheDialog :modal='dicCategoryModel' :modalTitle="dicCategoryModelTitle" @closeModal="closeModal('dicCategoryForm',dicCategoryModel)">
            <div slot="custom-modal-content">
                <el-form v-if="dicCategoryModelFormState" :model="dicCategoryForm" :rules="dicCategoryFormRules" ref="dicCategoryForm" label-width="80px">
                    <el-row>
                        <el-form-item label="类别名称" prop="fName">
                            <el-input size="small" v-model="dicCategoryForm.fName" :maxlength="50"
                                      placeholder="请填写类别名称(50个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDicCategory('dicCategoryForm')" size="small">确定</el-button>
                        <el-button @click="resetDicCategory('dicCategoryForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 1.类型弹层 -->
        <TheDialog :modal='dicItemsModel' :modalTitle="dicItemsModelTitle" @closeModal="closeModal('dicItemsForm',dicItemsModel)">
            <div slot="custom-modal-content">
                <el-form v-if="dicItemsFormState" :model="dicItemsForm" :rules="dicItemsFormRules" ref="dicItemsForm" label-width="80px">
                    <el-row>
                        <el-form-item label="类型名称" prop="fDictionaryTypeName">
                            <el-input size="small" v-model="dicItemsForm.fDictionaryTypeName" :maxlength="50"
                                      placeholder="请填写类型名称(50个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="参　　数" prop="fPym">
                            <el-input size="small" v-model="dicItemsForm.fPym" :maxlength="25"
                                      placeholder="请填写对应参数(25个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="参数说明" prop="fDescription">
                            <el-input size="small" v-model="dicItemsForm.fDescription" :maxlength="100"
                                      placeholder="请填写参数说明(100个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDicItems('dicItemsForm')" size="small">确定</el-button>
                        <el-button @click="resetDicItems('dicItemsForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 2.内容弹层 -->
        <TheDialog :modal='dicContextModel' :modalTitle="dicContextModelTitle" @closeModal="closeModal('dicContextForm',dicContextModel)">
            <div slot="custom-modal-content">
                <el-form v-if="dicContextFormState" :model="dicContextForm" :rules="dicContextFormRules" ref="dicContextForm" label-width="80px">
                    <el-row>
                        <el-form-item label="内容名称" prop="fItemName">
                            <el-input size="small" :maxlength="50" v-model="dicContextForm.fItemName"
                                      placeholder="请填写内容名称(50个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="参　　数" prop="fPym">
                            <el-input size="small" :maxlength="25" v-model="dicContextForm.fPym"
                                      placeholder="请填写对应参数(25个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="参 数 值" prop="fItemValue">
                            <el-input size="small" :maxlength="200" v-model="dicContextForm.fItemValue"
                                      placeholder="请填写参数值(200个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="参数说明" prop="fDescription">
                            <el-input size="small" :maxlength="100" v-model="dicContextForm.fDescription"
                                      placeholder="请填写参数说明(100个字符以内)"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDicContext('dicContextForm')" size="small">确定</el-button>
                        <el-button @click="resetDicContext('dicContextForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { CatalogService } from '@/api/personal-info' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                // 字典类型
                dictionaryTypeTr: [],
                // 字典内容
                dictionaryItemsTr: [],

                //数据字典类型搜索条件
                req: {
                    typeName: '',
                },
                realReq: {
                    typeName: '',
                },
                //数据字典内容搜索条件
                dicContentReq: {
                    dicContent: '',
                    typeId: '',
                },
                realDicContentReq: {
                    dicContent: '',
                    typeId: '',
                },
                dictionaryItemsObj: {},
                dictionaryTypeObj: {},

                // 类型弹层
                dicItemsModelTitle: '',
                dicItemsModel: false,
                dicItemsForm: {},
                dicItemsInfor: {
                    fDescription: '',
                    fDictionaryTypeName: '',
                    fId: '',
                    fPym: '',
                },
                dicItemsFormState: true,
                dicItemsFormRules: {
                    fDictionaryTypeName: [
                        {required: true, message: '请输入字典类型名称', trigger: 'blur'},
                    ],
                    fPym: [
                        {required: true, message: '请输入参数', trigger: 'blur'}
                    ],
                    fDescription: [
                        {required: true, message: '请输入参数说明', trigger: 'blur'}
                    ],
                },
                // 内容弹层
                dicContextModelTitle: '',
                dicContextModel: false,
                dicContextForm: {},
                dicContextInfor: {
                    fDescription: '',
                    fDictionaryTypeId: '',
                    fId: '',
                    fItemName: '',
                    fItemValue: '',
                    fCategoryId: '',
                    fPym: '',
                },
                dicContextFormState: true,
                dicContextFormRules: {
                    fItemName: [
                        {required: true, message: '请输入内容名称', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
                    ],
                    fPym: [
                        {required: true, message: '请输入参数', trigger: 'blur'},
                        {min: 1, max: 25, message: '长度在 1 到25 个字符', trigger: 'blur'}
                    ],
                    fItemValue: [
                        {required: true, message: '请输入参数值', trigger: 'blur'},
                        {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
                    ],
                    fDescription: [
                        {required: true, message: '请输入参数说明', trigger: 'blur'},
                        {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                },
                // 字典类别
                CategoryTreeData: [],
                count: '',
                defaultProps: {
                    children: [],
                    label: 'fName',
                },
                dicCategoryModel: false,
                dicCategoryModelTitle: '',
                dicCategoryForm: {},
                dicCategoryObj: {},
                dicCategoryInfor: {
                    fDescription: '',
                    fName: '',
                    fId: '',
                },
                dicCategoryModelFormState: true,
                //数据字典类别搜索条件
                dicCategoryReq: {
                    typeName: '',
                    fCategoryId: '',
                },
                dicCategoryFormRules: {
                    fName: [
                        {required: true, message: '请输入类别名称', trigger: 'blur'},
                        {max: 50, message: '备注不能超过 50 个字符', trigger: 'blur'}
                    ],
                    fDescription: [
                        {max: 100, message: '备注不能超过 100 个字符', trigger: 'blur'}
                    ]
                },
            }
        },
        // 组件
        components: {
            TheDialog,
        },
        props: {},
        mounted: function () {
            // 获取数据字典类别
            this.getDictionaryCategory();
            // 获取全部数据字典类型
            this.getDictionaryType(this.realReq);
        },
        methods: {
            //获取数据字典类别
            async getDictionaryCategory() {
                let res = await CatalogService.getDictionaryCategory(this.dicCategoryReq);
                if (res.success) {
                    this.count = res.obj.count;
                    if (res.obj.list != null && res.obj.list.length != 0) {
                        this.CategoryTreeData = res.obj.list;
                        if (this.dicCategoryModelTitle == '编辑字典类别') {
                            this.$nextTick(()=> {
                                this.$refs.tree.setCurrentKey(this.dicCategoryForm.fId);
                            })
                        }
                    } else {
                        this.CategoryTreeData = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 检索类别
            dicCategorySearch(){
                this.dicCategoryModelTitle = '';
                this.dicCategoryForm = {};
                this.getDictionaryCategory(this.dicCategoryReq);
            },
            dicCategoryAllSearch(){
                this.dicCategoryModelTitle = '';
                this.dicCategoryForm = {};
                this.dicCategoryObj = {};
                this.dicCategoryReq.typeName = '';
                this.dicCategoryReq.fCategoryId = '';
                this.getDictionaryCategory(this.dicCategoryReq);
            },
            /*1、数据字典类型模块*/
            //获取数据字典类型集合
            async getDictionaryType(req) {
                let res = await CatalogService.getDictionaryType(req);
                if (res.success) {
                    this.dictionaryTypeTr = res.obj;
                    this.dictionaryItemsTr = [];
                } else {
                    this.$message.warning(res.msg);
                };
            },
            //根据字典类型搜索 给数组动态的赋值的方式实现
            dictionaryTypeSearch() {
                this.realReq = {
                    ...this.req
                };
                this.getDictionaryType(this.realReq);
                this.dictionaryTypeObj = {};
                this.dictionaryItemsObj = {};
            },
            //选中数据字典类型
            choseDictionaryTypeRow(row) {
                this.dictionaryItemsObj = {};
                this.dictionaryTypeObj = row;
                this.dicContentReq.typeId = row.fId;
                this.realDicContentReq.typeId = row.fId;
                this.getDictionaryItems({...this.realDicContentReq, dicContent: this.dicContentReq.dicContent});
                this.dicContextInfor.fDictionaryTypeId = row.fId;
            },
            /*2、数据字典内容模块*/
            //获取数据字典内容集合
            async getDictionaryItems(req) {
                let res = await CatalogService.getDictionaryItems(req);
                if (res.success) {
                    this.dictionaryItemsTr = res.obj;
                } else {
                    this.$message.warning(res.msg);
                };
            },
            //根据字典内容搜索
            dictionaryItemSearch() {
                this.realDicContentReq = {
                    ...this.dicContentReq
                };
                this.getDictionaryItems(this.realDicContentReq);
                this.dictionaryItemsObj = {};
            },
            //选中数据字典内容
            choseDictionaryItemsRow(row) {
                this.dictionaryItemsObj = row;
            },
            filterTag(value, row) {
                return row.fIsSysDefaultText === value;
            },
            // 选中字典类别
            handleNodeClick(obj) {
                console.log('选中字典类别', obj);
                this.dicCategoryObj = obj;
                this.dicItemsForm.fCategoryId = obj.fId;
                this.req.fCategoryId = obj.fId;
                this.realReq.fCategoryId = obj.fId;
                this.getDictionaryType(this.realReq);
            },
            // -----------弹层部分
            // 字典类别 *增 *改 *删
            // 新增按钮
            insertDicCategory() {
                // 初始化弹层
                this.dicCategoryModelTitle = '新建字典类别';
                this.dicCategoryModel = true;
                // 清空表单
                this.dicCategoryInfor = {
                    fDescription: '',
                    fName: '',
                    fId: '',
                };
                this.dicCategoryForm = this.dicCategoryInfor;
            },
            // 修改按钮
            updateDicCategory() {
                if (this.dicCategoryObj.fId == '' || this.dicCategoryObj.fId == null || this.dicCategoryObj.fId == undefined) {
                    this.$message.warning('请选择字典类别！')
                    return;
                };
                for (let a of this.CategoryTreeData) {
                    if (a.fId == this.dicCategoryObj.fId) {
                        this.dicCategoryObj = a;
                    }
                }
                this.dicCategoryForm = this._.clone(this.dicCategoryObj);
                // 初始化
                this.$nextTick(() => {
                    this.dicCategoryModelTitle = '编辑字典类别';
                    this.dicCategoryModel = true;
                })
            },
            // 删除按钮
            deleteDicCategory() {
                if (this.dicCategoryObj.fId == '' || this.dicCategoryObj.fId == null || this.dicCategoryObj.fId == undefined) {
                    this.$message.warning('请选择删除字典类别！')
                    return;
                };
                this.$confirm(`此操作将删除当前字典类别，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await CatalogService.deleteDictionaryCategory(this.dicCategoryObj.fId);
                    if (res.success) {
                        this.$message(res.msg);
                        this.dicItemsForm.fCategoryId = '';
                        this.getDictionaryCategory();
                    } else {
                        this.$message.warning(res.msg);
                    };
                }).catch(() => {

                });
            },
            // 确定
            async submitDicCategory(name) {
                let canSubmit = false;
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        canSubmit = true;
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                });
                if (canSubmit) {
                    let res ;
                    let param = {
                        ...this.dicCategoryForm,
                    };
                    if (this.dicCategoryModelTitle == '新建字典类别') {
                        res = await CatalogService.insertDictionaryCategory(param);
                    }else if (this.dicCategoryModelTitle == '编辑字典类别') {
                        res = await CatalogService.updateDictionaryCategory(param);
                    }
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.dicCategoryModel = false;
                        this.$refs[name].resetFields();
                        //获取数据字典类型集合
                        this.getDictionaryCategory();
                        if (this.dicCategoryModelTitle == '新建字典类别') {
                            this.dicCategoryObj = {};
                        }
                    } else {
                        this.$message.warning(res.msg);
                    }
                }
            },
            // 重置
            resetDicCategory(formName) {
                this.$refs[formName].resetFields();
            },
            // 字典类型 *增 *改 *删
            // 新增按钮
            insertDicItems() {
                if (this.dicItemsForm.fCategoryId == null || this.dicItemsForm.fCategoryId == undefined ||  this.dicItemsForm.fCategoryId == ''){
                    this.$message.warning('请选择字典类别！')
                    return;
                }
                // 初始化弹层
                this.dicItemsModelTitle = '新建字典类型';
                this.dicItemsModel = true;
                // 清空表单
                this.dicItemsInfor.fDescription = '';
                this.dicItemsInfor.fDictionaryTypeName = '';
                this.dicItemsInfor.fId = '';
                this.dicItemsInfor.fPym = '';
                this.dicItemsInfor.fCategoryId = this.dicItemsForm.fCategoryId;
                this.dicItemsForm = this.dicItemsInfor;
            },
            // 修改按钮
            updateDicItems() {
                if (this.dictionaryTypeObj.fId == '' || this.dictionaryTypeObj.fId == null || this.dictionaryTypeObj.fId == undefined) {
                    this.$message.warning('请选择字典类型！')
                    return;
                }
                ;
                this.dicItemsForm = this._.clone(this.dictionaryTypeObj);
                // 初始化
                this.$nextTick(() => {
                    this.dicItemsModelTitle = '编辑字典类型';
                    this.dicItemsModel = true;
                })
            },
            // 删除按钮
            deleteDicItems() {
                if (this.dictionaryTypeObj.fId == '' || this.dictionaryTypeObj.fId == null || this.dictionaryTypeObj.fId == undefined) {
                    this.$message.warning('请选择删除字典类型！')
                    return;
                }
                this.$confirm(`此操作将删除当前字典类型，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await CatalogService.deleteDicItems(this.dictionaryTypeObj.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getDictionaryType(this.realReq);
                        this.dictionaryTypeObj = {};
                        this.dictionaryItemsObj = {};
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(() => {

                });
            },
            // 确定
            submitDicItems(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dicItemsModelTitle == '新建字典类型') {
                            this.insertDicItemsForm();
                        }
                        if (this.dicItemsModelTitle == '编辑字典类型') {
                            this.updateDicItemsForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            // 重置
            resetDicItems(formName) {
                this.$refs[formName].resetFields();
            },
            // 新增
            async insertDicItemsForm() {
                let res = await CatalogService.insertDicItemsForm(this.dicItemsForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.$refs['dicItemsForm'].resetFields();
                    this.dicItemsModel = false;
                    //获取数据字典类型集合
                    this.getDictionaryType(this.realReq);
                    this.dictionaryTypeObj = {};
                    this.dictionaryItemsObj = {};
                } else {
                    this.$message.warning(res.msg);
                }
                ;
            },
            // 修改
            async updateDicItemsForm() {
                let res = await CatalogService.updateDicItemsForm(this.dicItemsForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.$refs['dicItemsForm'].resetFields();
                    this.dicItemsModel = false;
                    //获取数据字典类型集合
                    this.getDictionaryType(this.realReq);
                    this.dictionaryTypeObj = {};
                    this.dictionaryItemsObj = {};
                } else {
                    this.$message.warning(res.msg);
                }
                ;
            },
            // 字典内容 *增 *改 *删
            // 新增按钮
            insertDicContext() {
                if (this.dictionaryTypeObj.fId == '' || this.dictionaryTypeObj.fId == null || this.dictionaryTypeObj.fId == undefined) {
                    this.$message.warning('请选择一项字典类型！')
                    return;
                }
                ;
                // 初始化弹层
                this.dicContextModelTitle = '新建字典内容';
                this.dicContextModel = true;
                // 清空表单
                this.dicContextInfor.fDescription = '';
                this.dicContextInfor.fId = '';
                this.dicContextInfor.fItemName = '';
                this.dicContextInfor.fItemValue = '';
                this.dicContextInfor.fPym = '';
                this.dicContextForm = this.dicContextInfor;
            },
            // 修改按钮
            updateDicContext() {
                if (this.dictionaryItemsObj.fId == '' || this.dictionaryItemsObj.fId == null || this.dictionaryItemsObj.fId == undefined) {
                    this.$message.warning('请选择一项字典内容！')
                    return;
                }
                ;
                this.dicContextForm = this._.clone(this.dictionaryItemsObj);
                // 初始化
                this.$nextTick(() => {
                    this.dicContextModelTitle = '编辑字典内容';
                    this.dicContextModel = true;
                })
            },
            // 删除按钮
            deleteDicContext() {
                if (this.dictionaryItemsObj.fId == '' || this.dictionaryItemsObj.fId == null || this.dictionaryItemsObj.fId == undefined) {
                    this.$message.warning('请选择所要删除的字典内容！')
                    return;
                }
                this.$confirm(`此操作将删除当前字典内容，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await CatalogService.deleteDicContext(this.dictionaryItemsObj.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getDictionaryItems(this.realDicContentReq);
                        this.dictionaryItemsObj = {};
                    } else {
                        this.$message.warning(res.msg);
                    }
                }).catch(() => {

                });
            },
            // 确定
            submitDicContext(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.dicContextModelTitle == '新建字典内容') {
                            this.insertDicContextForm();
                        }
                        if (this.dicContextModelTitle == '编辑字典内容') {
                            this.updateDicContextForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            // 重置
            resetDicContext(formName) {
                this.$refs[formName].resetFields();
            },
            // 新增
            async insertDicContextForm() {
                let res = await CatalogService.insertDicContextForm(this.dicContextForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.$refs['dicContextForm'].resetFields();
                    this.dicContextModel = false;
                    this.getDictionaryItems(this.realDicContentReq);
                    this.dictionaryItemsObj = {};
                } else {
                    this.$message.warning(res.msg);
                }
                ;
            },
            // 修改
            async updateDicContextForm() {
                let res = await CatalogService.updateDicContextForm(this.dicContextForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.$refs['dicContextForm'].resetFields();
                    this.dicContextModel = false;
                    this.getDictionaryItems(this.realDicContentReq);
                    this.dictionaryItemsObj = {};
                } else {
                    this.$message.warning(res.msg);
                };
            },
            // 侧滑关闭
            closeModal(form, modalStatus){
                if (form == 'dicContextForm') {
                    this.dicContextModel = false;
                    return;
                } else if (form == 'dicItemsForm') {
                    this.dicItemsModel = false;
                    return;
                } else if (form == 'dicCategoryForm'){
                    this.dicCategoryModel = false;
                    return;
                }
            }
        },
        watch: {
            'dicCategoryForm': function (obj) {
                this.dicCategoryModelFormState = false;
                this.$nextTick(() => {
                    this.dicCategoryModelFormState = true;
                })
                this.$forceUpdate();
            },
            'dicItemsForm': function (obj) {
                this.dicItemsFormState = false;
                this.$nextTick(() => {
                    this.dicItemsFormState = true;
                })
                this.$forceUpdate();
            },
            'dicContextForm': function (obj) {
                this.dicContextFormState = false;
                this.$nextTick(() => {
                    this.dicContextFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .catalog-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            .left-div {
                border-right: 1px solid #f1f1f1;
                height: calc(100vh - 90px);
                .left-div-header {
                    padding: 20px;
                    font-weight:400;
                    color:rgba(84,84,84,1);
                    line-height:25px;
                    font-size: 16px;
                    .opear-btn { // 操作按钮
                        float: right;
                        color: #545454;
                        font-size: 17px;
                    }
                    .insert-btn { // 新建按钮
                        margin-top: -4px;
                    }
                    .update-btn { // 修改按钮
                        margin-top: -4px;
                    }
                    .delete-btn { // 删除按钮
                        margin-top: -4px;
                        margin-left: 10px;
                    }
                }
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
                .Category {
                    padding: 0px 20px;
                    height: calc(100vh - 269px);
                    overflow-y: auto;
                    .point {
                        font-size: 24px;
                        color: #ccc;
                        vertical-align: middle;
                        margin-left: 10px;
                        margin-right: 10px;
                    }
                }
            }
            .mid-div {
                border-right: 1px solid #f1f1f1;
            }
            .mid-div, .right-div {
                height: calc(100vh - 130px);
                padding: 20px 15px;
                background: #fff;
                border-radius:8px;
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .catalog-page {
        .container {
            .left-div {
                .left-search {
                    .left-all-btn {
                        color: #545454!important;
                        width: 100%;
                        font-size: 14px;
                        border-radius: 4px!important;
                        margin: 6px 0px;
                    }
                    .left-all-btn:focus, .left-all-btn:hover {
                        color: #38acfd!important;
                        background-color: rgb(230, 250, 247);
                    }
                }
                .Category {
                    .Category-tree {
                        .el-tree-node__expand-icon {
                            display: none!important;
                        }
                        .el-tree-node__content {
                            height: 42px!important;
                            line-height: 42px!important;
                        }
                        .el-tree-node__children .dvIcon-point{
                            display: none!important;
                        }
                        .el-tree-node.is-current>.el-tree-node__content {
                            background-color: rgba(241,241,241,1)!important;
                            color: #333!important;
                        }
                        .custom-tree-node {
                            align-items: center;
                            justify-content: space-between;
                            font-size: 14px;
                            padding-right: 8px;
                        }
                    }
                }
            }
            .mid-div, .right-div {
                .opear {
                    .search-form {
                        .el-form-item__label {
                            background: rgba(241,244,249,1);
                            text-align: center!important;
                            border: 1px solid #E1E5E8;
                            border-right: none;
                            color: #324057!important;
                            height: 36px!important;
                            line-height: 36px!important;
                            border-top-left-radius: 4px;
                            border-bottom-left-radius: 4px;
                        }
                        .input-father {
                            width: 160px;
                            .el-input__inner {
                                border: 1px solid #E1E5E8!important;
                                border-left: none!important;
                                border-radius: 0!important;
                                height: 36px!important;
                                line-height: 36px!important;
                                border-top-right-radius: 4px!important;
                                border-bottom-right-radius: 4px!important;
                            }
                        }
                    }
                }
                .dictionaryTypeTab .el-table__body-wrapper, .dictionaryItemsTab .el-table__body-wrapper {
                    max-height: calc(100vh - 280px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
</style>