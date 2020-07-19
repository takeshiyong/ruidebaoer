/*
* @Author: 屈云峰
* @Date: 2019-07-23
* @Description: 'App版本管理'
*/
<template>
    <div class="integration-rule-page">
        <div class="container">
            <div>
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-plus" @click="maketype">新建版本</el-button>
                    </el-form-item>
                </el-form>
                <!-- <hr class="rule-line" /> -->
                <div class="tab_container">
                    <el-table
                        :data="tableData"
                        class="defaultTab dictionaryTypeTab"
                        border
                        stripe
                        style="width: 100%"
                        :max-height="700"
                    >
                        <el-table-column label="序号" width="64" type="index"></el-table-column>
                        <el-table-column label="APP类型" width="130">
                             <template slot-scope="scope">
                                <span>{{ scope.row.fType == 1 ? '安卓' : 'ios'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fVersion" label="版本号" width="180"></el-table-column>
                        <el-table-column prop="fUpdateInfo" label="更新信息" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <span>{{ scope.row.fUpdateInfo || '--'}}</span>
                            </template>
                        </el-table-column>
                        
                        <el-table-column prop="fUrl" label="下载地址" width="100" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <a :href="previewUrl+scope.row.fUrl" target="_blank" style="color: blue">下载</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fIsForceUpdate" label="是否强制更新" width="140">
                            <template slot-scope="scope">
                                <span>{{ scope.row.fIsForceUpdate?'是':'否'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="160">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="edio(scope.row)">编辑</el-button>
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="remove(scope.row.fId)"
                                    style="color:#F56C6C;  "
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 新建App版本 -->
        <TheDialog :modal="visible" :modalTitle="modalTitle" @closeModal="visible=false;">
            <div slot="custom-modal-content">
                <el-form
                    ref="ruleform"
                    :rules="rules"
                    :model="ruleform"
                    label-width="80px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="版本号" prop="fVersion">
                        <el-input
                            placeholder="请填写版本号"
                            v-model="ruleform.fVersion"
                            style="width: 33.3%;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="APP类型"
                        prop="fType"
                        label-width="80px"
                    >
                        <el-radio-group v-model="ruleform.fType">
                            <el-radio :label="1">安卓</el-radio>
                            <el-radio :label="2">ios</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item
                        label="强制更新"
                        prop="fIsForceUpdate"
                        label-width="80px"
                    >
                        <el-radio-group v-model="ruleform.fIsForceUpdate">
                            <el-radio :label="true">是</el-radio>
                            <el-radio :label="false">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="更新信息" prop="fUpdateInfo">
                        <el-input type="textarea" placeholder="请填写更新信息" maxlength="60" v-model="ruleform.fUpdateInfo"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件" prop="fUrl">
                        <el-upload
                            class="upload-demo"
                            drag
                            accept="image/jpeg, image/gif, image/png, .doc, .docx, .xls, xlsx, .pdf, .apk"
                            :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                            ref="upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :on-exceed="handleExceed"
                            :before-upload="handbu"
                            :file-list="fileList"
                            :on-success="handleSuccess"
                            :show-upload-list="true"
                            :on-error="handleErr"
                        >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">
                                将文件拖到此处，或
                                <em>点击上传</em>
                            </div>
                        </el-upload>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            v-if="bandc==1"
                            type="primary"
                            @click="creat_rule('ruleform')"
                        >创建</el-button>
                        <el-button
                            v-if="bandc==0"
                            type="primary"
                            @click="edit_rule('ruleform')"
                        >编辑</el-button>
                        <el-button @click="reset_rule('ruleform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { PointService, appService } from "@/api/personal-info"; //引入api
    import TheDialog from "@/components/TheDialog";
    export default {
    components: {
        TheDialog
    },
    data() {
        //校验正数
        let validateInt = (rule, value, callback) => {
            if (!value) {
                callback();
                return;
            }
            let reg = /^[1-9][0-9]*$/;
            if (!reg.test(value)) {
                callback(new Error("请填写正确的数值(大于0的整数值)"));
            } else {
                callback();
            }
        };
        return {
            previewUrl: process.env.PREVIEW_API, //预览附件
            visible: false, //新建类型的弹窗隐现
            visibles: false, //新建类型的弹窗隐现
            seerulecate: false, //积分规则类型的显隐
            modalTitle: "", //弹窗的标题
            centerDialogVisible: false, //tanceng
            catebadge: true, //规则类型的角标
            fileTr: [], //文件列表
            seecate: [], //规则类型
            bandc: 1, //编辑和创建规则的判断
            fid: "", //编辑的fid
            fileList: [],
            feilid: "", //规则id
            wjlist: null,
            formInline: {
                user: null, //用户输入的内容
                region: null //选择的类型
            },
            tableData: [],
            searchParam: {
                //分页相关
                currentPage: 1,
                sum: 0,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10
            },
            ruleform: {
                fId: "",
                fVersion: "", //版本号
                fFileName: "", //文件名称
                fType: 1, //app类型
                fIsForceUpdate: true, //是否强制更新
                fUpdateInfo: "", //更新信息
                fUrl: "", //下载地址
            },
            rules: {
                fVersion: [
                    {
                        required: true,
                        message: "请填写版本号",
                        trigger: "change"
                    }
                ],
                fType: [
                    {
                        required: true,
                        message: "请选择App类型",
                        trigger: "change"
                    }
                ],
                fIsForceUpdate: [
                    {
                        required: true,
                        message: "请选择是否强制更新",
                        trigger: "blur"
                    }
                ],
                fUrl: [
                    {
                        required: true,
                        message: "请上传附件",
                        trigger: "change"
                    }
                ],
            }
        };
    },
    mounted() {
        this.ruleAll();
        this.rulecateAll();
    },
    methods: {
        //新建类型
        maketype() {
            this.visible = true;
            this.modalTitle = "新建版本";
            this.ruleform = {
                fId: "",
                fVersion: "", //版本号
                fFileName: "", //文件名称
                fType: 1, //app类型
                fIsForceUpdate: true, //是否强制更新
                fUpdateInfo: "", //更新信息
                fUrl: "", //下载地址
            };
            this.fileList = [];
        },
        //编辑规则
        edio(row) {
            this.findRule(row);
            this.fid = row.fId;
            this.visible = true;
            this.modalTitle = "编辑版本";
            this.bandc = 0;
        },
        //提交类型
        submittype(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.addpointcate();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        //提交规则
        creat_rule(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.addPointrule(); //新建规则
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //编辑规则提交
        edit_rule(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.editorRule(); //编辑规则接口
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        reset_rule(formName) {
            this.$refs[formName].resetFields();
        },
        //点击附件
        annex(id) {
            this.centerDialogVisible = true;
            this.feilid = id;
            this.ruleFile();
        },
        //附件弹框的关闭
        closeFile() {
            this.centerDialogVisible = false;
        },
        seerule() {
            this.seerulecate = true;
            this.catebadge = true;
        },
        closecate() {
            this.seerulecate = false;
        },
        //删除改规则
        remove(rid) {
            this.$confirm("是否删除该条规则?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deleteRule(rid);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        //删除规则接口
        async deleteRule(id) {
            const res = await appService.deleteApp(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.ruleAll();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //文件上传
        handleRemove(file, fileList) {
            //上传文件失败操作
            let fileLists = this.fileList.map(data => data.uid);
            this.fileList.splice(fileLists.indexOf(file.uid), 1);
            this.ruleform = {
                    ...this.ruleform,
                    fFileName: '',
                    fUrl: ''
                }
        },
        handlePreview(file) {},
        handleExceed(files, fileList) {
            this.$message.warning('仅可以上传一个文件');
        },
        handleErr(err, file, fileList) {},
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handbu(file) {
            if (file.size > 100 * 1024 * 1024) {
                this.$message.warning("文件超过100M！");
                return false;
            }
        },
        handleSuccess(res, file, fileList) {
            if (res.data != null) {
                console.log(res.data, 'res.data');
                this.ruleform = {
                    ...this.ruleform,
                    fFileName: res.data.fFileName,
                    fUrl: res.data.fFileLocationUrl
                }
            } else {
                this.handleRemove(file);
                this.$message.warning("上传失败");
            }
        },
        //新建规则类型
        async addpointcate() {
            const res = await PointService.addPointcate({
                fTypeName: this.numberValidateForm.typename,
                fIsDelete: 0
            });
            if (res.success) {
                this.rulecateAll();
                this.visible = false;
                this.catebadge = false;
                this.$message.success(res.msg);
            } else {
                this.$message.warning(res.msg);
            }
        },
        //查询所有规则（表格）分页
        async ruleAll() {
            const res = await appService.selectAll();
            if (res.success) {
                this.tableData = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //分页操作
        handleSizeChange(val) {
            this.searchParam.pageSize = val;
            this.ruleAll();
        },
        handleCurrentChange(val) {
            this.searchParam.currentPage = val;
            this.ruleAll();
        },
        //新建规则
        async addPointrule() {
            const res = await appService.addApp(this.ruleform);
            if (res.success) {
                this.visible = false;
                this.ruleAll();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑规则
        async editorRule() {
            const res = await appService.updateApp(this.ruleform);
            if (res.success) {
                this.visible = false;
                this.ruleAll();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //查询所有积分规则类型
        async rulecateAll() {
            const res = await PointService.ruleCateAll();
            if (res.success) {
                this.seecate = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //删除规则类型
        deletecate(fid) {
            this.$confirm("是否删除该条规则类型?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deletepointcate(fid);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        async deletepointcate(id) {
            const res = await PointService.deletecate(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.rulecateAll();
                this.rulecateAll();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //回显编辑内容
        async findRule(row) {
            this.ruleform = {
                fId: row.fId,
                fVersion: row.fVersion, //版本号
                fFileName: row.fFileName, //文件名称
                fType: row.fType, //app类型
                fIsForceUpdate: row.fIsForceUpdate, //是否强制更新
                fUpdateInfo: row.fUpdateInfo, //更新信息
                fUrl: row.fUrl, //下载地址
            };
            this.fileList = [{name: row.fFileName, url: row.fUrl}];
        },
        //获取文件list
        async ruleFile() {
            const res = await PointService.ruleFile(this.feilid);
            if (res.success) {
                this.fileTr = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //删除文件list的某一条
        async deleteFile(id) {
            const res = await PointService.deletFile(id);
            if (res.success) {
                this.ruleFile();
            } else {
                this.$message.warning("请求失败");
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .integration-rule-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding: 15px 10px;

            .rule-line {
                border: none;
                height: 1px;
                background: #e2e3e5;
            }

            .tab_container {
                // margin-top: 16px;
            }

            .rule_pagination {
                margin-top: 1.25rem;
                text-align: right;
            }
        }
    }

    /deep/ .el-table thead {
        color: #909399;
        font-weight: 500;
    }
</style>
