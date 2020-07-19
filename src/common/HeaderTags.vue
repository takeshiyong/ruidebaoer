<template>
    <div class="header-tags-page" v-if="showTags">
        <ul id="#anchor-ul" ref="anchorul">
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActiveLi(item.path)}" :key="index" :id="'#anchor' + index">
                <div :style="{borderRight:isActiveDiv(item.path)? 'none':'1px solid #DEE5EB'}" class="tags-li-div">
                    <router-link :to="item.path" class="tags-li-title">
                        {{item.title}}
                    </router-link>
                    <el-button v-if="isActiveBtn(item.path)" type="info" size="mini" icon="el-icon-close" circle class="tags-li-icon" @click="closeTags(index)"></el-button>
                </div>
            </li>
        </ul>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button round type="primary" icon="el-icon-s-tools" class="tag-set-btn">
                </el-button>
                <el-dropdown-menu size="small" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { HomeService } from '@/api/personal-info';
    import store from '../store/index.js'
    import bus from './bus';
    import { common } from '@/utils/common';
    export default {
        data() {
            return {
                tags: [],
                menuList: [],
                isScoll: false,
                num: 0,
                oneDistance: 0,
                sumDistance: 0,
            }
        },
        mounted: function(){
            if (this.tagsList.length == 0) {
                this.setTags(this.$route);
            }
        },
        methods: {
            isActiveLi(path) {
                if (this.isScoll) { // 有滚动条
                    this.$nextTick(()=>{
                        if (path === this.$route.path) {
                            if (this.tagsList.length != 0) {
                                // 获取ul的dom
                                let anchorul = this.$refs.anchorul;
                                // 获取当前选中tag的是第几个
                                let index = this.tagsList.findIndex(item => item.path === this.$route.path) + 1;
                                if (index == this.tagsList.length) { // 情况一:选中最后一个
                                    anchorul.scrollRight =  0;
                                }
                                // 情况二:选中第一个元素，滚动条置左
                                if (index == 1) {
                                    this.$nextTick(()=>{
                                        this.$refs.anchorul.scrollLeft = 0;
                                    })
                                }
                                // 情况三:选中中间元素，滚动条移动到对应位置
                                if (1< index < this.tagsList.length) {
                                    anchorul.scrollLeft = (this.sumDistance/this.tagsList.length)*index;
                                }
                            }
                        }
                    })
                }
                return path === this.$route.path;
            },
            isActiveDiv(path) {
                return path === this.$route.path;
            },
            isActiveBtn(path) {
                return path === this.$route.path;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                }else{
                    this.getFirstMenu(this.menuList);
                }
            },
            // 关闭全部标签
            closeAll(){
                this.$store.dispatch('setTagsList', []);
                this.getFirstMenu(this.menuList);
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    return item.path === this.$route.fullPath;
                })
                this.$store.dispatch('setTagsList', curItem);
            },
            // 设置标签
            async setTags(route) {
                let res = await HomeService.getMenu(2);
                if (res.success) {
                    if (res.obj != null && res.obj != undefined) {
                        this.menuList = res.obj.menuList;
                        this.getTitleId(this.menuList, route);
                    }else {
                        return;
                    }
                } else{
                    this.$message.warning(res.msg);
                };
            },
            // 遍历菜单树
            getTitleId(arr, route){
                for (let a of arr) {
                    if (a.fId != route.meta.title) {
                        if (a.children.length == 0){
                            continue;
                        }
                        this.getTitleId(a.children, route);
                    } else {
                        const isExist = this.tagsList.some(item => {
                            return item.path === route.path;
                        })
                        !isExist && this.tagsList.push({
                            title: a.fName,
                            fullPath: route.fullPath,
                            path: route.path,
                        })
                        return;
                    }
                }
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            },
            getFirstMenu(menuList){
                if (menuList == null || menuList == undefined || menuList.length == 0) {
                    return;
                }
                let a = 0;
                if (menuList[a].children != null && menuList[a].children != undefined && menuList[a].children.length != 0 ) {
                    this.getFirstMenu(menuList[a].children);
                } else {
                    this.$store.dispatch('setTagsList', []);
                    this.$router.push(menuList[a].fUrl);
                }
            },
        },
        computed: {
            ...mapGetters([
                'tagsList',
            ]),
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            },
            tagsList(val) {
                this.$nextTick(()=>{
                    if (val.length != 0) {
                        // 获取ul的dom
                        let anchorul = this.$refs.anchorul;
                        if (anchorul.scrollWidth > anchorul.offsetWidth) {
                            this.isScoll = true; // 确认有滚动
                            this.num += 1; // 获取加入元素个数
                            this.sumDistance = anchorul.scrollWidth - anchorul.offsetWidth; // 获取滚动条可移动总距离
                            this.oneDistance = (anchorul.scrollWidth - anchorul.offsetWidth)/this.num; // 获取滚动条平均每个元素移动距离
                        } else {
                            this.isScoll = false;
                        }
                    }
                })
            }
        },
        created:function() {
            this.$store.dispatch('setTagsList', []);
        },
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .header-tags-page {
        height: 60px;
        padding-right: 120px;
        ul {
            width: calc(100% - 120px);
            height: 100%;
            display: inline-block;
            white-space: nowrap;
            overflow-y: hidden;
            overflow-x: auto;
            .tags-li {
                display: inline-block;
                font-size: 14px;
                overflow: hidden;
                cursor: pointer;
                height: 60px;
                line-height: 60px;
                width: 120px;
                background: #fff;
                vertical-align: middle;
                white-space: nowrap;
                margin-top: -1px;
                .tags-li-div {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 5px 0 12px;
                    margin-top: 10px;
                    .tags-li-title {
                        float: left;
                        width: 70px;
                        text-align: center;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin-right: 10px;
                        color: #324057;
                    }
                    .tags-li-icon {
                        background: #A2BBE9;
                        color: #628DD9;
                        padding: 2px;
                        border: none;
                    }
                }
            }
            .tags-li:not(.active):hover {
                background: #EEF3F7;
            }
            .tags-li.active {
                color: #fff;
                font-weight: 700;
                background-color: #4477D2!important;
                .tags-li-title {
                    color: #fff;
                }
            }
        }
        ul::-webkit-scrollbar{
            height: 0;
        }
        .tags-close-box {
            position: absolute;
            right: 190px;
            top: 0px;
            box-sizing: border-box;
            text-align: center;
            width: 50px;
            height: 60px;
            line-height: 60px;
            .el-dropdown {
                .tag-set-btn {
                    padding: 11px!important;
                    font-size: 18px!important;
                    background: #324057;
                    border: 1px solid #324057;
                }
            }

        }
    }
</style>
