/*
* @Author: 王侃
* @Date:   2019-07-23
* @Description: '菜单管理'
*/
<template>
    <div class="menus-page">
        <div class="container">
            <el-table :data="tableData" border size="small" highlight-current-row class="defaultTab menus-tab">
                <el-table-column type="index" label=" " width="45" align="center">
                </el-table-column>
                <el-table-column align="left" label="菜单名称" min-width="250">
                    <template slot-scope="scope">
                        <span class="table-column-name" v-for="i in 10"  v-if="scope.row.fLevel == i " :style="{marginLeft: leftpx*(i-1) + 'px'}" style="margin-left:30px;">
                            <i class="el-icon-minus" v-if="scope.row.fopen && scope.row.children != null && scope.row.children != undefined && scope.row.children.length != 0"  @click="close(scope.row)">
                            </i>
                            <i class="el-icon-plus" v-if="!scope.row.fopen && scope.row.children != null && scope.row.children != undefined && scope.row.children.length != 0" @click="open(scope.row)">
                            </i>
                            <span v-if="scope.row.fIsBtn" class="table-column-name">
                                {{ scope.row.fName }}
                            </span>
                            <span v-else-if="showBtn('updateMenu')" @click="changeName(scope.row,'edit')" class="table-column-name"
                                  style="font-size:14px;cursor: pointer;">
                                {{ scope.row.fName }}
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="fIcon" label="图标" width="60" align="center">
                    <template slot-scope="scope">
                        <i v-if="scope.row.fIcon != null" :class="'redoublefont '+ scope.row.fIcon " style="color:#20a0ff;font-size:18px;"></i>
                    </template>
                </el-table-column>
                <el-table-column label="菜单类型" align="left" min-width="250">
                    <template slot-scope="scope">
                        <span v-if="scope.row.fIsBtn === true">按钮</span>
                        <span v-else>菜单</span>
                    </template>
                </el-table-column>
                <el-table-column label="菜单排序" width="100" align="center">
                    <template slot-scope="scope">
                        <span class="primary span-button" v-if="scope.row.fSort > 1 && scope.row.fIsBtn === false && showBtn('upSorting')"
                              @click="changeSorts(scope,'up')"
                              title="向上排序"

                              >
                            <i class="el-icon-sort-up"></i>
                        </span>
                        <span class="primary span-button"
                              v-if="scope.row.fIsBtn === false &&  scope.row.fIsLast != true && showBtn('downwardSorting')"
                              @click="changeSorts(scope,'down')" title="向下排序">
                            <i class="el-icon-sort-down"></i>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <TheDialog :modal='menuModal' :modalTitle="modalTitle" @closeModal="closeModal('menuForm',menuModal)">
            <div slot="custom-modal-content">
                <el-form v-if="menuFormState" :model="menuForm" label-width="90px" ref="menuForm" :rules="menuFormRules">
                    <el-row>
                        <el-form-item label="父级节点" prop="fParentId">
                            <el-select filterable v-model="menuForm.fParentId" size="small" style="width:100%;" clearable
                                       placeholder="请选择父级节点">
                                <el-option v-for="item in parentMenus" :key="item.fId" :label="item.fName"
                                           :value="item.fId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="菜单名称" prop="fName">
                            <el-input type="input" v-model="menuForm.fName" size="small" style="width:100%;" filterable
                                      clearable placeholder="请填写菜单名称"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitmenu('menuForm')" size="small">确定</el-button>
                        <el-button @click="closemenu('menuForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import {HomeService,MenusService} from '@/api/personal-info' // api
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    let menusArray = [];
    let allDataId = [];
    let allDataOnceId = [];
    let sys = {};
    export default {
        computed: {
            // ...mapState({
            //   Breadcrumb: state => state.system.Breadcrumb,
            //   pageBtn: state => state.system.btn["060205"],
            //   pageHeight: state => state.system.pageHeight,
            // })
        },
        components: {
            // Help
            TheDialog
        },
        data() {
            let validateString = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('菜单名称不能为空！'));
                }else if (value.toString().replace(new RegExp(' ','gm'),'').length > 10) {
                    callback(new Error('菜单名称不能超过10个字符！'));
                }else {
                    callback();
                }
            };
            return {
                modalTitle: '编辑菜单名称',
                menuFormState: true,
                leftpx: 30,
                icontype: "",
                menuList: [],
                menus: [],
                num: 1,
                nameModal: false,
                newName: null,
                tableData: [],
                opened: false, //判断是否是展开操作
                newMenuInfo: {
                    no: "",
                    oldParentNo: "",
                    newParentNo: "",
                    newName: "",
                    type: "",
                    url: ""
                },
                ruleMenu: {},
                operateType: "add",
                parentList: [],
                allMenu: [],
                menuModal: false,
                menuForm: {

                },
                menuFormRules: {
                    fParentId: [
                        {required: true, message: '请选择父级节点', trigger: 'change'}
                    ],
                    fName: [
                        {required: true, validator:validateString, trigger: 'blur'},
                    ],
                },
                parentMenus: [],
            };
        },
        methods: {
            //展开
            open(data) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (data.fId == this.tableData[i].fId) {
                        this.tableData[i].fopen = true;
                    }
                    if (data.fId === this.tableData[i].fParentId) {
                        this.tableData[i].fopen = true;
                    }
                }
                menusArray = this.tableData;
                let menus = [];
                let that = this;
                menusArray.map(function (item1) {
                    if (item1.fParentId == '-1') {
                        let menu1 = item1;
                        menu1.children = item1.children;
                        menus.push(menu1);
                        allDataOnceId.push(menu1);
                    }
                    allDataId.push(item1.fId);
                });
                menus.map(function (item) {
                    let childrens1 = item.children;
                    let total = 0;
                    childrens1.map(function (item1) {
                        let count = 0;
                        if (item1.children != undefined && item1.children.length != 0) {
                            count = item1.children.length;
                        }
                        if (count == 0) {
                            count = 1;
                        }
                        item1.rowCount = count;
                        total += count;
                    });
                    item.rowCount = total;
                });
                this.tableData = [];
                this.menus = menus;
                //把拿到的数据封装成element-table的数据格式
                for (let i of menus.sort(this.sortArr("fSort"))) {
                    this.tableData.push(i);
                    for (let j of i.children.sort(this.sortArr("fSort"))) {
                        if (i.fopen) {
                            this.tableData.push(j);
                        }
                        for (let m of j.children.sort(this.sortArr("fSort"))) {
                            if (j.fopen) {
                                this.tableData.push(m);
                            }
                            for (let n of m.children.sort(this.sortArr("fSort"))) {
                                if (m.fopen) {
                                    this.tableData.push(n);
                                }
                                for (let h of n.children.sort(this.sortArr("fSort"))) {
                                    if (n.fopen) {
                                        this.tableData.push(h);
                                    }
                                    for (let k of h.children.sort(this.sortArr("fSort"))) {
                                        if (h.fopen) {
                                            this.tableData.push(k);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log('this.tableData', this.tableData)
            },
            //收起
            close(data) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (data.fParentId == '-1' && data.fId == this.tableData[i].fId) {
                        this.tableData[i].fopen = false;
                    }
                    if (data.fId === this.tableData[i].fId) {
                        this.tableData[i].fopen = false;
                    }

                }
                for (let j = 0; j < this.tableData.length; j++) {
                    if (data.fId === this.tableData[j].fParentId) {
                        for (var i = 0; i < this.tableData[j].children.length; i++) {
                            if (this.tableData[j].children[i].fParentId == this.tableData[j].fId) {
                                this.close(this.tableData[j]);
                            }
                        }
                        ;
                        this.tableData.splice(j, 1);
                        j--;
                    }
                }
            },
            //点击菜单名称
            changeName(data, status) {
                let parentData = {};
                this.parentMenus = [];
                if(data.fLevel == 1){
                    //添加默认菜单
                    let menu = {};
                    menu.fName = "默认";
                    menu.fId = "-1";
                    this.parentMenus.push(menu)
                }
                for (var i = 0; i < this.allMenu.length; i++) {
                    if (this.allMenu[i].fIsBtn === false && data.fId != this.allMenu[i].fId && this.allMenu[i].fLevel < data.fLevel) {
                        this.parentMenus.push(this.allMenu[i]);
                    }
                }
                this.menuForm = this._.clone(data);
                // 初始化
                this.$nextTick(() => {
                    this.menuModal = true;
                })
            },
            //提交修改
            async submitmenu(name) {
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
                    let res = await MenusService.updateMenu(this.menuForm);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getAllMenu();
                        this.menuModal = false;
                        this.$refs[name].resetFields();
                    } else {
                        this.$message.warning(res.msg);
                    }
                }
            },
            //重置按钮
            closemenu(name) {
                this.$refs[name].resetFields();
            },
            //关闭
            closeMenuModal(name) {
                this.menuModal = false;
                this.$refs[name].resetFields();
            },
            //移动顺序
            changeSorts(data, name) {
                let obj = {};
                let arr = [];
                for (var i = 0; i < this.tableData.length; i++) {
                    if (data.row.fLevel == this.tableData[i].fLevel && data.row.fParentId == this.tableData[i].fParentId) {
                        arr.push(this.tableData[i]);
                    }
                }
                ;
                if (name == 'up') {
                    let indexNo = -1;
                    for (var i = 0; i < arr.length; i++) {
                        if (data.row.fId == arr[i].fId) {
                            indexNo = i;
                            obj.beforeId = data.row.fId;
                            obj.beforeSort = data.row.fSort;
                        }
                    }
                    for (let a = 0; a < arr.length; a++) {
                        if (indexNo != -1 && arr[indexNo - 1] != null && arr[indexNo - 1] != undefined) {
                            if (arr[indexNo - 1].fId == arr[a].fId) {
                                obj.afterId = arr[a].fId;
                                obj.afterSort = arr[a].fSort;
                            }
                        }
                    }
                } else if (name == 'down') {
                    let indexNo = -1;
                    for (var i = 0; i < arr.length; i++) {
                        if (data.row.fId == arr[i].fId) {
                            indexNo = i;
                            obj.beforeId = data.row.fId;
                            obj.beforeSort = data.row.fSort;
                        }
                    }
                    ;
                    for (let a = 0; a < arr.length; a++) {
                        if (indexNo != -1 && arr[indexNo + 1] != null && arr[indexNo + 1] != undefined) {
                            if (arr[indexNo + 1].fId == arr[a].fId) {
                                obj.afterId = arr[a].fId;
                                obj.afterSort = arr[a].fSort;
                            }
                        }
                    }
                }
                this.changeSortSubmit(obj);
            },
            //调换菜单顺序接口
            async changeSortSubmit(obj) {
                if (obj.afterId == null || obj.afterId == undefined) {
                    this.$Message.warning("此菜单已经当前级别最底层菜单了，不能调换顺序!");
                    return;
                }
                let res = await MenusService.changeMenuSort(obj);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.getAllMenu();
                } else {
                    this.$message.warning(res.msg);
                }
                ;
            },
            //获得所有菜单
            async getAllMenu() {
                let res = await HomeService.getMenu(1);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length != 0) {
                        for (let o = 0; o < res.obj.menuList.length; o++) {
                            res.obj.menuList[o].fopen = true;
                            res.obj.menuList[o].fhide = false;
                        }
                        menusArray = res.obj.menuList;
                        this.menuList = res.obj.menuList;
                        this.formatMenu();
                    } else {
                        this.planeTypes = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //格式化数据
            formatMenu() {
                let menus = [];
                let that = this;
                menusArray.map(function (item1) {
                    if (item1.fParentId == '-1') {
                        let menu1 = item1;
                        menu1.children = item1.children;
                        menus.push(menu1);
                        allDataOnceId.push(menu1);
                    }
                    allDataId.push(item1.fId);
                });
                menus.map(function (item) {
                    let childrens1 = item.children;
                    let total = 0;
                    childrens1.map(function (item1) {
                        let count = 0;
                        if (item1.children != undefined && item1.children.length != 0) {
                            count = item1.children.length;
                        }
                        if (count == 0) {
                            count = 1;
                        }
                        item1.rowCount = count;
                        total += count;
                    });
                    item.rowCount = total;
                });
                this.tableData = [];
                this.menus = menus;
                this.allMenu = [];
                //把拿到的数据封装成element-table的数据格式
                for (let i of menus.sort(this.sortArr("fSort"))) {
                    if (i.fId == menus[menus.length - 1].fId) {
                        i.fIsLast = true;
                    }
                    this.tableData.push(i);
                    this.allMenu.push(i);
                    for (let j of i.children.sort(this.sortArr("fSort"))) {
                        j.fopen = true;
                        if (j.fId == i.children[i.children.length - 1].fId) {
                            j.fIsLast = true;
                        }
                        if (!j.fIsBtn) {
                            this.tableData.push(j);
                        }
                        this.allMenu.push(j);
                        for (let m of j.children.sort(this.sortArr("fSort"))) {
                            if (m.fId == j.children[j.children.length - 1].fId) {
                                m.fIsLast = true;
                            }
                            m.fopen = true;
                            if (!m.fIsBtn) {
                                this.tableData.push(m);
                            }
                            this.allMenu.push(m);
                            for (let n of m.children.sort(this.sortArr("fSort"))) {
                                if (n.fId == m.children[m.children.length - 1].fId) {
                                    n.fIsLast = true;
                                }
                                n.fopen = true;
                                this.allMenu.push(n);
                                if (!n.fIsBtn) {
                                    this.tableData.push(n);
                                }
                                for (let h of n.children.sort(this.sortArr("fSort"))) {
                                    if (h.fId == n.children[n.children.length - 1].fId) {
                                        h.fIsLast = true;
                                    }
                                    h.fopen = true;
                                    this.allMenu.push(h);
                                    if (!h.fIsBtn) {
                                        this.tableData.push(h);
                                    }
                                    for (let k of h.children.sort(this.sortArr("fSort"))) {
                                        if (k.fId == h.children[h.children.length - 1].fId) {
                                            k.fIsLast = true;
                                        }
                                        this.allMenu.push(k);
                                        this.tableData.push(k);
                                    }
                                }
                            }
                        }
                    }
                }
                menusArray = this.tableData;
                console.log('this.tableData', this.tableData);
            },
            //对拿到的数据按fsort排序
            sortArr(arr) {
                return function (a, b) {
                    var value1 = a[arr];
                    var value2 = b[arr];
                    return value1 - value2;
                };
            },
            closeModal(form, modalStatus){
                this.menuModal = false;
                this.$refs[form].resetFields();
            }

        },
        watch: {
            'menuForm': function(obj) {
                this.menuFormState = false;
                this.$nextTick(() => {
                    this.menuFormState = true;
                })
                this.$forceUpdate();
            },
        },
        mounted() {
            this.getAllMenu();
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .menus-page {
        .container {
            .menus-tab {
                .span-button {
                    cursor: pointer;
                }
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .menus-page {
        width: 100%;
        height: 100%;
        .container {
            .menus-tab {
                box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1)!important;
                border-radius:8px;
                .el-table__body-wrapper {
                    max-height: calc(100vh - 130px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
</style>