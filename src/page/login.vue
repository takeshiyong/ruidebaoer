/*
* @Author: 王侃
* @Date:   2019-07-22
* @Description: '登录页面'
*/
<template>
    <div class="login-page">
        <div class="container">
            <div class="login-form">
                <h3 class="title">
                    瑞 德 宝 尔  •  智 慧 矿 山 云 平 台
                </h3>
                <div class="input-div">
                    <i class="redoublefont redouble-yonghuzhuzhanghaoguanli"></i>
                    <el-input @change.native="changeText" v-model="fLoginName" outcompete="off" placeholder="请输入账号" @keyup.enter.native="login" clearable></el-input>
                </div>
                <div class="input-div">
                    <i class="redoublefont redouble-suoding"></i>
                    <el-input type="password" v-model="fPassWord" outcompete="off" placeholder="请输入密码" @keyup.enter.native="login" clearable></el-input>
                </div>
                <el-button type="primary" class="login-btn" @click="login">登 录</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import { LoginService } from '@/api/personal-info' // api
    import {common} from '@/utils/common' // common
    export default {
        data() {
            return {
                fLoginName: 'admin', // 账号，默认为'admin'
                fPassWord: '', // 密码
            }
        },
        mounted: function(){

        },
        methods: {
            changeText(event) {
                console.log(event)
            },
            /**
             * 登录
             * @returns {string|*}
             */
            async login(){
                // 非空判断
                if(!this.fLoginName || this.fLoginName.trim().length==0){
                    this.$message({
                        message: "账号不能为空！",
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return;
                }
                if(!this.fPassWord || this.fPassWord.trim().length==0){
                    this.$message({
                        message: "密码不能为空！",
                        type: 'error',
                        duration: 5 * 1000
                    });
                    return;
                }
                // 封装对象
                let param =  {
                    fLoginName: this.fLoginName,
                    fPassWord: this.fPassWord
                }
                // 请求登录
                let res = await LoginService.login(param);
                if(res.success){
                    // 获取Token值
                    common.setToken(res.obj.webtoken);
                    // 获取用户id
                    common.setStore('userId', res.obj.fId);
                    // 获取用户名
                    common.setStore('userName', res.obj.fUserName);
                    // 页面跳转
                    this.$router.replace({ path: '/home' });
                } else {
                    this.$message.error(res.msg);
                }
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    $bg: #2d3a4b; // 背景色变量
    $title_color: #eee; // title颜色变量
    $icon_color: #889aa4; // icon颜色变量
    .login-page {
        position: fixed;
        height: 100%;
        width: 100%;
        background-color: $bg;
        .container {
            .login-form { // 登录表单
                position: absolute;
                left: 0;
                right: 0;
                width: 450px;
                padding: 35px 35px 15px 35px;
                margin: 120px auto;
                .title { // 标题
                    font-size: 26px;
                    color: $title_color;
                    margin: 0px auto 40px auto;
                    text-align: center;
                    font-weight: bold;
                }
                .input-div { // 账号、密码input
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    color: #454545;
                    display: inline-block;
                    width: 100%;
                    margin: 10px 0;
                    .redoublefont {
                        padding: 6px 5px 6px 15px;
                        color: $icon_color;
                        vertical-align: middle;
                        width: 30px;
                        display: inline-block;
                        font-size: 26px;
                    }
                }
                .login-btn {
                    width: 100%;
                    margin-top: 15px;
                    font-size: 16px;
                    padding: 10px!important;
                }
            }
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    $bg: #2d3a4b; // 背景色变量
    $input_color: #eee; // input字体颜色
    .login-page {
        .el-input {
            display: inline-block;
            height: 47px;
            width: 85%;
            input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $input_color;
                height: 47px;
                &:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
                    -webkit-text-fill-color: #fff !important;
                }
            }
        }
    }
</style>
