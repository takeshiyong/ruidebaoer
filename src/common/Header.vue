<template>
    <div class="header-page">
        <HeaderTags/>
        <div class="message-div">
            <el-button round type="primary" icon="el-icon-message-solid" class="message-btn">
            </el-button>
        </div>
        <div class="user-div">
            <el-dropdown split-button type="primary" class="user-dropdown" @command="handleCommand">
                {{username}}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="updatePass">修改密码</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <el-dialog :visible.sync="updatePassModel" title="修改密码" width="600px" append-to-body class="over-dialog" :close-on-click-modal="false">
            <div class="dialog_title_line" style="border-top: 1px solid #ebeef5!important;margin-top: -26px;margin-left: -20px;margin-right: -20px;margin-bottom: 20px;"></div>
            <el-form  :model="userPassForm" :rules="userPassFormRules" ref="userPassForm" label-width="80px">
                <el-row>
                    <el-col :span="23">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="原密码" prop="oldPassword">
                                    <el-input type="password" size="small" v-model="userPassForm.oldPassword" placeholder="请填写原密码" :maxlength="64"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="新密码" prop="newPassword">
                                    <el-input type="password" size="small" v-model="userPassForm.newPassword" placeholder="请填写新密码" :maxlength="64"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <el-form-item label="确认密码" prop="rdNewPassword">
                            <el-input type="password" size="small" v-model="userPassForm.rdNewPassword" placeholder="请再次填写新密码" :maxlength="64"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click="submitUpdatePass('userPassForm')" size="small">确定</el-button>
                    <el-button @click="resetUpdatePass('userPassForm')" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { common } from '@/utils/common'; // common
    import HeaderTags from '../common/HeaderTags.vue'; // tags组件
    import { HomeService } from '@/api/personal-info' // api
    export default {
        data(){
            return {
                modalTitle: '', // 弹层标题
                updatePassModel: false, // 弹层Modal
                userPassInfor: {
                    oldPassword: '',
                    newPassword: '',
                    rdNewPassword: ''
                },
                userPassForm: {}, // 弹层表单
                userPassFormRules: {
                    oldPassword: [
                        { required: true, message: '请填写原密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请填写新密码', trigger: 'blur' }
                    ],
                    rdNewPassword: [
                        { required: true, message: '请填写确认密码', trigger: 'blur' }
                    ],
                },
            }
        },
        computed:{
            username(){
                let username = common.getStore('userName');
                return username;
            }
        },
        components:{
            HeaderTags,
        },
        methods: {
            /**
             * 用户名下拉菜单选择事件
             */
            handleCommand(command) {
                if(command == 'loginout'){
                    sessionStorage.removeItem('userName')
                    this.$router.push('/login');
                }
                if(command == 'updatePass'){
                    this.userPassInfor.oldPassword = '';
                    this.userPassInfor.newPassword = '';
                    this.userPassInfor.rdNewPassword = '';
                    this.userPassForm = this.userPassInfor;
                    this.updatePassModel = true;
                }
            },
            /**
             * 提交表单
             * @param name {object} 表单名称
             */
            submitUpdatePass(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.userPassForm.newPassword == this.userPassForm.rdNewPassword) {
                            this.UpdatePass();
                        }else{
                            this.$message.error('新密码与确认密码填写不一致！！');
                            return false;
                        }
                    } else {
                        this.$message.error('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 提交请求
             * @param {object}     提交的表单对象
             */
            async UpdatePass(){
                let postjson = {
                    oldPassWord:this.userPassForm.oldPassword,
                    newPassWord:this.userPassForm.newPassword
                };
                let res = await HomeService.updatePassword(postjson);

                if(res.success){
                    this.updatePassModel = false;
                    this.$message.success('您的密码修改成功！');
                    this.userPassForm = {};
                    this.loginout();
                    return;
                }else{
                    this.updatePassModel = false;
                    this.$message.error('您的密码修改失败！');
                    this.userPassForm = {};
                }
            },
            /**
             * 重置表单
             * @param name {object} 表单名称
             */
            resetUpdatePass(name){
                this.$refs[name].resetFields();
                this.updatePassModel = false;
            },
            /**
             * 退出登录
             */
            loginout(){
                sessionStorage.removeItem('userName')
                this.$router.replace({ path:'/login'});
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .header-page {
        height: 100%;
        .message-div {
            position: absolute;
            width: 70px;
            height: 60px;
            line-height: 60px;
            right: 120px;
            top: 0px;
            text-align: center;
            .message-btn {
                background: #fff;
                border: 1px solid #E3E9EE;
                padding: 10px;
                font-size: 20px;
                color: #324057;
                box-shadow: 0px 0px 3px 0px rgba(232, 152, 180,1);
            }
        }
        .user-div {
            position: absolute;
            width: 130px;
            height: 60px;
            line-height: 52px;
            right: 0px;
            top: 0px;
            text-align: center;
            .user-dropdown {
                .el-button--small {
                    padding: 12px 15px!important;
                }
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .header-page {
        .user-div {
            .user-dropdown {
                .el-button--small {
                    background: #324057!important;
                    border: 1px solid #324057!important;
                }
                .el-button--small:first-child {
                    padding: 12px 14px!important;
                    border-bottom-left-radius: 40px !important;
                    border-top-left-radius: 40px !important;
                }
                .el-button--small:last-child {
                    padding: 12px 2px!important;
                    border-bottom-right-radius: 30px !important;
                    border-top-right-radius: 30px !important;
                }

            }
        }
        .over-dialog .el-dialog__header {
            padding: 15px 20px 8px !important;
        }

        .over-dialog .el-dialog__title {
            font-size: 16px !important;
        }

        .over-dialog .el-dialog__headerbtn {
            top: 9px !important;
            font-size: 18px !important;
        }
    }
</style>