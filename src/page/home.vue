/*
* @Author: 王侃
* @Date:   2019-07-22
* @Description: 'home页面'
*/
<template>
    <el-container class="wrapper">
        <Sidebar :isvisibility="isvisibility"/>
        <el-container class="content" :style="{width:isvisibility == 'visible'? 'calc(100% - 200px)':'100%'}">
            <el-header class="header">
                <Header/>
            </el-header>
            <el-main class="main">
                <img :src="isvisibility == 'hidden'?'static/img/home/shrink.png':'static/img/home/spread.png'" height="80" width="20" alt="" @click="isvisibility = isvisibility == 'visible'?'hidden':'visible'" class="unfold-pack">
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import Header from '../common/Header.vue';
    import Sidebar from '../common/Sidebar.vue';
    import bus from '../common/bus';
    import { mapMutations } from "vuex";
    export default {
        data(){
            return {
                tagsList: [],
                isvisibility: 'visible'
            }
        },
        components:{
            Header, Sidebar
        },
        mounted: function(){
            window.onresize = () => {
                return (() => {
                this.watchWindow(
                    document.documentElement.clientHeight,
                    document.documentElement.clientWidth
                );
                })();
            };
            this.watchWindow(
                document.documentElement.clientHeight,
                document.documentElement.clientWidth
            );
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })

            // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
            bus.$on('tags', msg => {
                let arr = [];
                for(let i = 0, len = msg.length; i < len; i ++){
                    msg[i].name && arr.push(msg[i].name);
                }
                this.tagsList = arr;
            }) 
        },
        methods: {
            ...mapMutations(["SET_DOCHEIGHT"]),
            watchWindow(height, width) {
                this.SET_DOCHEIGHT({height, width});
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .wrapper {
        .content {
            .header {
                padding: 0px;
                height: 60px;
                background: rgba(255,255,255,1);
                box-shadow: 0px 0px 9px 2px rgba(54,58,65,0.1);
                color: black;
                line-height: 60px;
            }
            .main {
                height: 100%;
                position: relative;
                background: #EDF0F5;
                padding: 15px;
                .unfold-pack { // 展开、收起图片
                    position: absolute;
                    top: 50%;
                    left: 0px;
                    -webkit-transition: all .3s ease-in-out;
                    -moz-transition: all .3s ease-in-out;
                    transition: all .3s ease-in-out;
                    z-index: 1;
                }
            }
        }
    }
</style>
