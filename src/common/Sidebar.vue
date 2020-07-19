/*
* @Author: 王侃
* @Date:   2019-07-22
* @Description: 'Sidebar组件'
*/
<template>
    <div class="sidebar-page" :class="{'sidebar-page-collapse': isCollapse}">
        <div class="header">
            <img src="../assets/img/home/logo.png" height="45" width="45" alt="" class="logo">
            <img v-if="!isCollapse1" :style="{visibility: isvisibility}" src="../assets/img/home/company.png" height="40" width="110" alt="" class="title">
        </div>
        <el-menu class="sidebar" :collapse="isCollapse" :default-active="defaultActive" unique-opened router :background-color="backgroundColor" text-color="#99A0AB" active-text-color="#FFF" >
            <template v-for="item in menuList">
                <template v-if="item.children != null && item.children != undefined && item.children.length > 0">
                    <el-submenu :index="item.fUrl" :key="item.fUrl">
                        <template slot="title">
                            <i :class="item.fIcon" class="redoublefont icon-size"></i><span slot="title" class="icon-text">{{ item.fName }}</span>
                        </template>
                        <template v-for="(subItem,i) in item.children">
                            <template v-if="subItem.children != null && subItem.children != undefined && subItem.children.length > 0">
                                <el-submenu :index="subItem.fUrl" :key="subItem.fUrl">
                                    <template slot="title">
                                        <span style="font-size: 16px!important;paddingLeft: 5px">{{ subItem.fName }}</span>
                                    </template>
                                    <template v-for="(obj,i) in subItem.children">
                                        <template v-if="obj.children != null && obj.children != undefined && obj.children.length > 0">
                                            <el-submenu :index="obj.fUrl" :key="obj.fUrl">
                                                <template slot="title">
                                                    <span style="fontSize: 14px">{{ obj.fName }}</span>
                                                </template>
                                            </el-submenu>
                                        </template>
                                        <template v-else>
                                            <el-menu-item :index="obj.fUrl"  :key="obj.fUrl">
                                                <span slot="title" style="marginLeft: -5px;fontSize: 14px">{{ obj.fName }}</span>
                                            </el-menu-item>
                                        </template>
                                    </template>
                                </el-submenu>
                            </template>
                            <template v-else>
                                <el-menu-item :index="subItem.fUrl"  :key="subItem.fUrl">
                                    <span slot="title">&nbsp;{{ subItem.fName }}</span>
                                </el-menu-item>
                            </template>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.fUrl"  :key="item.fUrl">
                        <i :class="item.fIcon" class="redoublefont icon-size"></i><span slot="title" class="icon-text">{{ item.fName }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>

</template>
<script>
    // api
    import { HomeService } from '@/api/personal-info'
    import { common } from '@/utils/common';
    export default {
        data() {
            return {
                backgroundColor: '#324057',
                defaultActive: '',
                menuList: [],
                isCollapse: false,
                isCollapse1: false,
            }
        },
        props: {
            isvisibility: {
                type: String
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        mounted: function(){
            if ((this.$router.currentRoute.path + '') == '/home') {//1.未有token值，登录进来的菜单初始化
              this.initMenu();
            } else {//2.已有token值，直接地址栏进入系统获取菜单
              this.getMenu();
              this.defaultActive = this.$router.currentRoute.path + '';
            };
        },
        methods: {
            async getMenu(){
                let res = await HomeService.getMenu(2);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined) {
                        this.menuList = res.obj.menuList;
                        this.$store.dispatch('setMenuList', res.obj.menuList);
                        common.setStore('btnUrl', res.obj.btn_url);
                        common.setStore('menuUrl', res.obj.menu_url);
                    }else {
                        this.$message("当前无任何菜单权限，请联系管理员！");
                        return;
                    }

                } else{
                    this.$message.warning(res.msg);
                };
            },
            async initMenu(){
                let res = await HomeService.getMenu(2);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined) {
                        this.menuList = res.obj.menuList;
                        this.$store.dispatch('setMenuList', res.obj.menuList);
                        common.setStore('btnUrl', res.obj.btn_url);
                        common.setStore('menuUrl', res.obj.menu_url);
                        this.getFirstMenu(this.menuList);
                    } else {
                        this.$message("当前无任何菜单权限，请联系管理员！");
                        return;
                    }
                } else{
                    this.$message.warning(res.msg);
                };
            },
            // 递归寻找当前第一个菜单
            getFirstMenu(menuList){
                if (menuList == null || menuList == undefined || menuList.length == 0) {
                    this.$message("当前无任何菜单权限，请联系管理员！");
                    return;
                }
                let a = 0;
                if (menuList[a].children != null && menuList[a].children != undefined && menuList[a].children.length != 0 ) {
                    this.getFirstMenu(menuList[a].children);
                } else {
                    this.$router.replace({
                        path: menuList[a].fUrl
                    });
                    this.defaultActive = menuList[a].fUrl;
                }
            },
        },
        watch:{
            isvisibility(val) {
                if (val == 'hidden') {
                    setTimeout(()=>{
                        this.isCollapse = true;
                        this.isCollapse1 = true;
                    },10)
                } else {
                    this.isCollapse = false;
                    if (this.isCollapse == false) {
                        setTimeout(()=>{
                            this.isCollapse1 = false;
                        },300)
                    }
                }
            },
            $route(newValue){
                this.defaultActive = newValue.path;
            },
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .sidebar-page {
        background-color: #324057;
        .header { // header
            height: 60px;
            margin: 15px 10px 10px 10px;
            border-bottom: 1px solid #273449;
            .logo { // logo图
                border-radius: 5px;
            }
            .title { // logo描述
                float: right;
                margin-top: 2px;
                margin-right: 10px;
            }
        }
        .sidebar {
            border: none;
            overflow-y: scroll;
            height: calc(100vh - 85px);
            .icon-text {
                font-size: 16px!important;
                margin-left: 6px;
            }
        }
        .sidebar:not(.el-menu--collapse) {
            width: 200px;
        }
        .sidebar::-webkit-scrollbar{
            width: 0;
        }
        .sidebar .el-menu-item {
            font-size: 15px!important;
        }
        .sidebar .el-menu-item.is-active {
            background: #546B92!important;
            border-left: 4px solid #F6AD3C!important;
        }
        .sidebar .el-menu-item:hover{
            color: #fff!important;
            background: rgba(255,255,255,0.2)!important;
        }
    }
    .sidebar-page:not(.sidebar-page-collapse) {
        width: 200px;
        -webkit-transition: all .3s ease-in-out;
        -moz-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }
    .sidebar-page-collapse {
        width: 64px;
        -webkit-transition: all .3s ease-in-out;
        -moz-transition: all .3s ease-in-out;
        transition: all .3s ease-in-out;
    }

</style>