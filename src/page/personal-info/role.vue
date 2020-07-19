/*
* @Author: 王侃
* @Date:   2019-07-23
* @Description: '角色权限'
*/
<template>
    <div class="role-page">
        <!-- 页面内容 -->
        <div class="container">
            <el-row>
                <el-col :lg="6" :md="8" :sm="10" :xs="24">
                    <div class="left-sidebar">
                        <div class="header">
                            <span>角色列表</span>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="text" icon="el-icon-delete" @click="deleteRole" class="opear-btn delete-btn"></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" content="修改" placement="top">
                                <el-button type="text" icon="el-icon-edit" @click="updateRole" class="opear-btn update-btn"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="新建" placement="top">
                                <el-button  type="text" icon="el-icon-plus" @click="insertRole" class="opear-btn insert-btn"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <el-menu :default-openeds= "['自定义角色']" class="el-menu-vertical-demo role-tree" :unique-opened="true"
                                @select="choseRole" background-color="rgba(255,255,255,1)" text-color="rgba(120,120,120,1)" active-text-color="rgba(120,120,120,1)">
                                <template v-for="(level_1_role, level_1_index) in roles">
                                    <template v-if="level_1_role.children.length > 0">
                                        <el-submenu :index="level_1_role.fRoleName">
                                            <template slot="title">
                                                <!--<i class="redoublefont redouble-point point"></i>-->
                                                <span class="menu-plus"></span>
                                                <span>{{level_1_role.fRoleName}}</span>
                                            </template>
                                            <template v-for="(level_2_role, level_2_index) in level_1_role.children">
                                                <el-menu-item :index="level_2_role.fId">
                                                    <i class="redoublefont redouble-point point"></i>
                                                    <span slot="title">{{level_2_role.fRoleName}}</span>
                                                </el-menu-item>
                                            </template>
                                        </el-submenu>
                                  </template>
                                  <template v-else>
                                        <el-menu-item :index="level_1_role.fRoleName">
                                            <i class="redoublefont redouble-point point"></i>
                                            <span slot="title">{{level_1_role.fRoleName}}</span>
                                        </el-menu-item>
                                  </template>
                                </template>
                            </el-menu>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="18" :md="16" :sm="14" :xs="24">
                    <div class="right-list">
                        <div class="header">
                            <span>权限列表</span>
                            <el-tooltip effect="dark" content="保存" placement="top">
                                <el-button type="text" class="opear-btn save-btn" @click="saveMenu"><i class="redoublefont redouble-baocun"></i></el-button>
                            </el-tooltip>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <el-tree ref="menu" node-key="fId" :data="limitMenus" :props="limitMenusProps" show-checkbox class="limitsTree"></el-tree>
                            <!--<TheLevelTable :data="limitMenus" :props="limitMenusProps"></TheLevelTable>-->
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='roleModal' :modalTitle="modalTitle" @closeModal="closeModal('roleForm',roleModal)">
            <div slot="custom-modal-content">
                <el-form v-if="roleFormState" :model="roleForm" :rules="roleFormRules" ref="roleForm" label-width="80px">
                    <el-row>
                        <el-col :span="23">
                            <el-form-item label="角色名称" prop="fRoleName">
                                <el-input v-model="roleForm.fRoleName" :maxlength="10" size="small" placeholder="请填写角色名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('roleForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('roleForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { RoleService } from '@/api/personal-info' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    import TheLevelTable from "@/components/TheLevelTable" // 侧滑组件
    export default {
        data() {
            // 校验
            let validateString = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('请填写角色名称'));
                } else {
                    callback();
                }
            };
            return {
                // **左侧角色列表
                roles: [], // 角色列表
                choseRoleId: '', // 选中角色id
                roleInfors: { // 角色信息对象
                    fId: '',
                    fIsDelete: '',
                    fRoleName: '',
                    fType: '',
                },
                roleInfor_clone: {}, // 角色信息对象

                // **右侧权限列表
                limitMenus: [], // 权限列表
                allMenu: [],      // 不是树结构
                limitMenusProps:{ // 树结构数据转换
                    children: 'children',
                    label: 'fName',
                    levelNames: ['一级', '二级', '权限配置']
                },

                setLimitsObj: { // 保存的权限对象
                    fMenuIdList: [],
                    fRoleId: '',
                },

                // 角色弹层
                modalTitle: '', // 弹层标题
                roleModal: false, // 弹层Modal
                roleForm: {}, // 弹层表单
                roleInfor: { // 初始化空表单
                    fId:'',
                    fIsDelete: '',
                    fRoleName:'',
                    fType:2
                },
                roleFormState: true,
                roleFormRules: { // 表单校验
                    fRoleName: [
                        { validator: validateString,required: true, trigger: 'blur' }
                    ],
                },
            }
        },
        components: {
            TheDialog,
            TheLevelTable
        },
        mounted: function(){
            this.init();
        },
        methods: {
            /**
             * 初始化页面
             */
            init(){
                // 获取角色列表
                this.getRole();
                // 获取权限列表
                this.getLimits();
            },
            /**
             * 获取角色列表
             * @returns {array| roles:角色列表}
             */
            async getRole() {
                let res = await RoleService.getRole();
                if (res.success) {
                    this.roles = res.obj;
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 获取角色列表
             * @returns {array| menuList:权限列表}
             */
            async getLimits() {
                let res = await RoleService.getLimitsMenus();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined) {
                        // 权限树倒序
                        if (res.obj.menuList != null && res.obj.menuList != undefined && res.obj.menuList.length > 0) {
                            this.limitMenus = res.obj.menuList;
                        } else {
                            this.limitMenus = [];
                        }
                    } else {
                        this.limitMenus = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 选中角色
             */
            choseRole(roleId) {
                this.choseRoleId = roleId;
                this.setLimitsObj.fRoleId = roleId;
                // 获取选中角色权限
                this.initRoleMenus(roleId);
                // 获取选中角色信息
                this.getChoseRole(roleId);
            },
            /**
             * 初始化选中角色权限菜单
             * @param roleId {string} 角色id
             */
            async initRoleMenus(roleId){
                let res = await RoleService.getRoleMenus(roleId);
                if (res.success) {
                    this.$refs.menu.setCheckedKeys(res.obj);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 保存权限
             */
            async saveMenu(){
                let res1 = await RoleService.getAllMenu();
                if (res1.success) {
                    this.allMenu = res1.obj;
                } else{
                    this.$message.warning(res1.msg);
                };
                let currentSelectMenu = this.$refs.menu.getCheckedNodes();
                if (currentSelectMenu != null && currentSelectMenu.length > 0) {
                    for (let menu of currentSelectMenu) {
                        this.getParentMenu(menu, this.allMenu);
                    };
                };
                let res = await RoleService.setLimits(this.setLimitsObj);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.choseRole(this.setLimitsObj.fRoleId);
                } else{
                    this.$message.warning(res.msg);
                };
                this.setLimitsObj.fMenuIdList = [];
            },
            /**
             * 遍历找寻父节点
             * @param menu {array} 子集合 menuList {array} 父集合
             */
            getParentMenu: function(menu, menuList){
                if (!menu) return;
                this. setLimitsObj.fMenuIdList.push(menu.fId);
                if (menu.fParentId == '-1') {
                    return;
                };
                for (let m of menuList){
                    if(m.fId == menu.fParentId) {
                        return this.getParentMenu(m,menuList);
                    };
                };
            },
            /**
             * 获取全部权限菜单(非树结构)
             * @returns {array| allMenu: 全部权限集合（非树结构）}
             */
            async getAllMenu(){
                let res = await RoleService.getAllMenu();
                if (res.success) {
                    this.allMenu = res.obj;
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 获取选中角色信息
             * @returns {object| roleInfors: 角色信息}
             */
            getChoseRole: function(id){
                for (let roleType of this.roles) {
                    for (let role of roleType.children) {
                        if (id == role.fId) {
                            this.roleInfors = role;
                            return;
                        };
                    };
                };
            },
            /**
             * 点击新建
             */
            insertRole(){
                // 初始化弹层
                this.modalTitle = '新建角色';
                this.roleModal = true;
                // 清空表单
                this.roleInfor.fId = '';
                this.roleInfor.fIsDelete = '';
                this.roleInfor.fRoleName = '';
                this.roleInfor.fType = 2;
                this.roleForm = this.roleInfor;
            },
            /**
             * 点击修改
             */
            updateRole(){
                if (this.choseRoleId == ''){
                    this.$message.warning('请选择编辑角色！')
                    return;
                }
                this.initRoleMenus(this.choseRoleId);
                this.getChoseRole(this.choseRoleId);
                if (this.roleInfors.fType != 2) {
                    this.$message.warning('系统角色不能编辑！')
                    return;
                };
                this.roleForm = this._.clone(this.roleInfors);
                // 初始化
                this.$nextTick(() => {
                    this.modalTitle = '编辑角色';
                    this.roleModal = true;
                })
            },
            /**
             * 点击删除
             */
            deleteRole(){
                if (this.roleInfors.fId == '' || this.roleInfors.fId == undefined) {
                    this.$message.warning('请选择删除角色！')
                    return;
                };
                if (this.roleInfors.fType != 2) {
                    this.$message.warning('系统角色不能删除！')
                    return;
                };
                this.$confirm(`此操作将删除当前角色，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await RoleService.deleteRoleForm(this.roleInfors.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getRole();
                        this.roleInfors = {};
                    } else{
                        this.$message.warning(res.msg);
                    };
                }).catch(() => {

                });
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建角色') {
                            this.insertRoleForm();
                        }
                        if (this.modalTitle == '编辑角色') {
                            this.updateRoleForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 重置表单
             * @param formName {object} 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 新增请求
             */
            async insertRoleForm(){
                let res = await RoleService.insertRoleForm(this.roleForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('roleForm',this.roleModal);
                    this.getRole();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             */
            async updateRoleForm(){
                let res = await RoleService.updateRoleForm(this.roleForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('roleForm',this.roleModal);
                    this.getRole();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.roleModal = false;
                this.$refs[form].resetFields();
            }
        },
        watch: {
            'roleForm': function(obj) {
                this.roleFormState = false;
                this.$nextTick(() => {
                    this.roleFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .role-page { // 角色权限
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container { // 页面容器
            .left-sidebar { // 左侧
                height: calc(100vh - 90px);
                border-right: 1px solid #F1F1F1;
                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
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
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    margin-top: 20px;
                    height: calc(100vh - 171px);
                    overflow-y: auto;
                    .point {
                        font-size: 24px;
                        color: #ccc;
                    }
                }
            }
            .right-list { // 右侧
                height: calc(100vh - 90px);

                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
                    font-size: 16px;
                    .opear-btn { // 操作按钮
                        color: #545454;
                        font-size: 17px;
                        float: left;
                    }
                    .save-btn { // 保存按钮
                        margin-right: 10px;
                        margin-top: -4px;
                    }
                }
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    height: calc(100vh - 191px);
                    overflow-y: auto;
                    padding: 20px;
                }
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .role-tree { // 角色列表样式
        border-right: none!important;
        .el-submenu__title {
            padding-left: 20px!important;
            height: 42px!important;
            line-height: 42px!important;
        }
        .el-menu-item {
            padding-left: 60px!important;
            height: 42px!important;
            line-height: 42px!important;
        }
        .el-submenu__icon-arrow, .el-icon-arrow-down {
            display: none!important;
        }
        .el-submenu__title:hover {
            background-color: #f5f7fa!important;
        }
        .el-menu-item:focus, .el-menu-item:hover {
            background-color: #f5f7fa!important;
        }
        .el-menu-item.is-active {
            background-color: rgba(241,241,241,1)!important;
            color: rgb(120, 120, 120)!important;
        }

        .el-submenu {
            .menu-plus {
                display: inline-block;
                width: 24px;
                margin-left: 4px;
                margin-right: 10px;
                font-size: 24px;
                color: #C0C4CC;
                cursor: pointer;
                -webkit-transform: rotate(0);
                transform: rotate(0);
                -webkit-transition: -webkit-transform .3s ease-in-out;
                transition: -webkit-transform .3s ease-in-out;
                transition: transform .3s ease-in-out;
                transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;
                transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;

                &:before {
                    content: '+';
                    padding-left: 4px;
                }
            }

            &.is-opened {
                .menu-plus {
                    -webkit-transform: rotate(45deg);
                    -moz-transform: rotate(45deg);
                    -ms-transform: rotate(45deg);
                    -o-transform: rotate(45deg);
                    transform: rotate(45deg);
                }
            }
        }
    }
    .limitsTree { // 权限列表样式
        border: none;
        background: transparent;
        .el-tree-node__content {
            height: 36px;
        }
    }
</style>
