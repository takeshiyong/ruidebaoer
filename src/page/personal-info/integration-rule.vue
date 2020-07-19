/*
* @Author: 杨高杰
* @Date: 2019-07-23
* @Description: '积分规则'
*/
<template>
    <div class="integration-rule-page">
        <div class="container">
            <div>
                <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="关键词">
                        <el-input v-model="formInline.user" placeholder="关键词"></el-input>
                    </el-form-item>
                    <el-form-item label="规则类型">
                        <el-select v-model="formInline.region" clearable placeholder="请选择规则类型">
                            <el-option
                                v-for="(val,index) in seecate"
                                :key="index"
                                :label="val.fTypeName"
                                :value="val.fId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="maketype">新建类型</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="makerule">新建规则</el-button>
                        <el-badge is-dot class="item" :hidden="catebadge">
                            <el-button type="primary" icon="el-icon-search" @click="seerule">查看规则类型</el-button>
                        </el-badge>
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
                    >
                        <el-table-column label="序号" width="64" type="index"></el-table-column>
                        <el-table-column prop="fTypeName" label="规则类型" width="180"></el-table-column>
                        <el-table-column prop="fName" label="规则明细" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="现金方式" width="180">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.fMoneyNumber>0"
                                >{{ scope.row.fMoneyType==false?'惩罚':scope.row.fMoneyType==true?'奖励':'--'}}</span>
                                <span v-if="scope.row.fMoneyNumber==0">---</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fMoneyNumber" label="规则现金数" width="160">
                            <template slot-scope="scope">
                                <span v-if="scope.row.fMoneyNumber>0">{{ scope.row.fMoneyNumber}}</span>
                                <span v-if="scope.row.fMoneyNumber==0">---</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fChangeType" label="积分方式" width="180">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.fIntegralNumber>0"
                                >{{ scope.row.fChangeType==false?'惩罚':scope.row.fChangeType==true?'奖励':'--'}}</span>
                                <span v-if="scope.row.fIntegralNumber==0">---</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="fIntegralNumber" label="规则积分数" width="160">
                            <template slot-scope="scope">
                                <span
                                    v-if="scope.row.fIntegralNumber>0"
                                >{{ scope.row.fIntegralNumber}}</span>
                                <span v-if="scope.row.fIntegralNumber==0">---</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="160">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="edio(scope.row.fId)">编辑</el-button>
                                <el-button type="text" size="small" @click="annex(scope.row.fId)">附件</el-button>
                                <el-button
                                    type="text"
                                    size="small"
                                    @click="remove(scope.row.fId)"
                                    style="color:#F56C6C;  "
                                >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="rule_pagination">
                        <el-pagination
                            id="page"
                            :current-page="searchParam.currentPage"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="searchParam.sum"
                            :page-size="searchParam.pageSize"
                            :page-sizes="searchParam.pageSizes"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                        ></el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新建类型 -->
        <TheDialog :modal="visible" :modalTitle="modalTitle" @closeModal="visible=false;">
            <div slot="custom-modal-content">
                <el-form
                    :model="numberValidateForm"
                    ref="numberValidateForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item
                        label="规则类型"
                        prop="typename"
                        :rules="[
             { required: true, message: '类型不能为空'},
            ]"
                    >
                        <el-input
                            type="typename"
                            placeholder="请输入规则类型名称"
                            v-model="numberValidateForm.typename"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submittype('numberValidateForm')">提交</el-button>
                        <el-button @click="resetForm('numberValidateForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 新建规则 -->
        <TheDialog :modal="visibles" :modalTitle="modalTitle" @closeModal="visibles=false;">
            <div slot="custom-modal-content">
                <el-form
                    ref="ruleform"
                    :rules="rules"
                    :model="ruleform"
                    label-width="80px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="规则类型" prop="region">
                        <el-select v-model="ruleform.region" placeholder="请选择规则类型">
                            <el-option
                                v-for="(val,index) in seecate"
                                :key="index"
                                :label="val.fTypeName"
                                :value="val.fId"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="结算方式" prop="num" label-width="80px">
                        <el-select v-model="ruleform.num" placeholder="请选择积分奖惩方式">
                            <el-option label="积分结算" :value="0"></el-option>
                            <el-option label="现金结算" :value="1"></el-option>
                            <el-option label="现金加积分结算" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="奖惩方式"
                        v-if="ruleform.num=='0' || ruleform.num=='2'"
                        prop="regions"
                        label-width="80px"
                    >
                        <el-select v-model="ruleform.regions" placeholder="请选择积分奖惩方式">
                            <el-option label="积分奖励" :value="true"></el-option>
                            <el-option label="积分惩罚" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="积分数"
                        v-if="ruleform.num=='0' || ruleform.num=='2'"
                        prop="integral"
                        label-width="80px"
                    >
                        <el-input
                            placeholder="请输入积分数"
                            v-model="ruleform.integral"
                            style="width: 33.3%;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="奖惩方式"
                        v-if="ruleform.num=='1' || ruleform.num=='2'"
                        prop="moneycate"
                        label-width="80px"
                    >
                        <el-select v-model="ruleform.moneycate" placeholder="请选择现金奖惩方式">
                            <el-option label="现金奖励" :value="true"></el-option>
                            <el-option label="现金惩罚" :value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="现金数"
                        v-if="ruleform.num=='1' || ruleform.num=='2'"
                        prop="money"
                        label-width="80px"
                    >
                        <el-input
                            placeholder="请输入现金数"
                            v-model="ruleform.money"
                            style="width: 33.3%;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="规则明细" prop="desc">
                        <el-input type="textarea" maxlength="60" v-model="ruleform.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件">
                        <el-upload
                            class="upload-demo"
                            drag
                            accept="image/jpeg, image/gif, image/png, .doc, .docx, .xls, xlsx, .pdf, .ppt"
                            :action="this.$feilapi+'/ikingtech/oss/api/upload/v1'"
                            multiple
                            ref="upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            :limit="3"
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
                        >立即创建</el-button>
                        <el-button
                            v-if="bandc==0"
                            type="primary"
                            @click="edit_rule('ruleform')"
                        >立即编辑</el-button>
                        <el-button @click="reset_rule('ruleform')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 文件上传的弹层 -->
        <el-dialog title="附件" :visible.sync="centerDialogVisible" width="30%" center>
            <el-table
                :data="fileTr"
                border
                style="width: 100%;font-size:12px;color:#666;"
                class="defaultTab"
            >
                <el-table-column label="序号" width="64" type="index"></el-table-column>
                <el-table-column
                    label="文件名称"
                    min-width="100"
                    prop="fFileName"
                    :show-overflow-tooltip="true"
                >
                    <template slot-scope="scope">
                        <a
                            style="color: blue;cursor: pointer"
                            :href="'http://192.168.1.220:8888/'+scope.row.fFileLocationUrl"
                        >{{scope.row.fFileName}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            style="margin-right:4px;border-radius:0px;padding:5px 10px;background-color:#E5E5E5;border:0px;color:#333333;"
                            class="fa fa-trash-o"
                            size="small"
                            @click="deleteFile(scope.row.fId)"
                        >&nbsp;删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" @click="closeFile('fileList')">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 查看规则类型 -->
        <el-dialog title="规则类型" :visible.sync="seerulecate" width="30%" center>
            <el-table
                :data="seecate"
                border
                style="width: 100%;font-size:12px;color:#666;"
                class="defaultTab"
            >
                <el-table-column label="序号" width="64" type="index"></el-table-column>
                <el-table-column
                    label="类型名称"
                    min-width="100"
                    prop="fTypeName"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            style="margin-right:4px;border-radius:0px;padding:5px 10px;background-color:#E5E5E5;border:0px;color:#333333;"
                            class="fa fa-trash-o"
                            size="small"
                            @click="deletecate(scope.row.fId)"
                        >&nbsp;删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button type="primary" @click="closecate()">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { PointService } from "@/api/personal-info"; //引入api
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
            tempRuleForm: null, // 临时存放修改数据
            formInline: {
                user: null, //用户输入的内容
                region: null //选择的类型
            },
            tableData: [
                {
                    date: "2016-05-02",
                    name: "安全积分",
                    integral: "5",
                    address: "发现隐患及时上报"
                },
                {
                    date: "2016-05-02",
                    name: "安全积分",
                    integral: "5",
                    address: "发现隐患及时上报"
                },
                {
                    date: "2016-05-02",
                    name: "安全积分",
                    integral: "5",
                    address: "发现隐患及时上报"
                },
                {
                    date: "2016-05-02",
                    name: "安全积分",
                    integral: "5",
                    address: "发现隐患及时上报"
                }
            ],
            searchParam: {
                //分页相关
                currentPage: 1,
                sum: 0,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10
            },
            numberValidateForm: {
                typename: "" //规则类型名称
            },
            ruleform: {
                regions: "", //选择奖惩方式
                region: "", //规则类型
                integral: "", //规则积分
                desc: "", //规则明细
                moneycate: "", //选择现金奖惩方式
                money: "", //现金数量
                num: ""
            },
            rules: {
                region: [
                    {
                        required: true,
                        message: "请选择规则类型",
                        trigger: "change"
                    }
                ],
                regions: [
                    {
                        required: true,
                        message: "请选择积分奖惩方式",
                        trigger: "change"
                    }
                ],
                integral: [
                    {
                        required: true,
                        message: "请填写积分",
                        trigger: "blur"
                    },
                    {
                        validator: validateInt,
                        trigger: "blur"
                    }
                ],
                desc: [
                    {
                        required: true,
                        message: "请填写规则",
                        trigger: "blur"
                    }
                ],
                moneycate: [
                    {
                        required: true,
                        message: "请选择现金奖惩方式",
                        trigger: "change"
                    }
                ],
                num: [
                    {
                        required: true,
                        message: "请选择结算方式",
                        trigger: "change"
                    }
                ],
                money: [
                    {
                        required: true,
                        message: "请填写现金数量",
                        trigger: "blur"
                    },
                    {
                        validator: validateInt,
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    mounted() {
        this.ruleAll();
        this.rulecateAll();
    },
    methods: {
        //搜索
        onSubmit() {
            this.ruleAll();
        },
        //新建类型
        maketype() {
            this.visible = true;
            this.modalTitle = "新建规则类型";
            this.numberValidateForm = {
                typename: ""
            };
        },
        //新建规则
        makerule() {
            this.visibles = true;
            this.modalTitle = "新建规则";
            this.bandc = 1;
            this.ruleform = {
                regions: "", //选择奖惩方式
                region: "", //规则类型
                integral: "", //规则积分
                desc: "", //规则明细
                money: "",
                moneycate: "",
                num: ""
            };
        },
        //编辑规则
        edio(fid) {
            this.findRule(fid);
            this.fid = fid;
            this.visibles = true;
            this.modalTitle = "编辑规则";
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
        // 重置
        reset_rule(formName) {
            if (formName == 'ruleform') {
                this.ruleform = this.tempRuleForm;
                return;
            }
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
            const res = await PointService.deleteRule(id);
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
        },
        handlePreview(file) {},
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleErr(err, file, fileList) {},
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        handbu(file) {
            if (file.size > 10 * 1024 * 1024) {
                this.$message.warning("文件超过10M！");
                return false;
            }
        },
        handleSuccess(res, file, fileList) {
            if (res.data != null) {
                let list = [];
                this.wjlist = "";
                list.push(res.data);
                this.wjlist = list;
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
            const res = await PointService.ruleAll({
                pageCurrent: this.searchParam.currentPage,
                pageSize: this.searchParam.pageSize,
                fTypeId: this.formInline.region,
                content: this.formInline.user
            });
            if (res.success) {
                this.tableData = res.obj.items;
                this.searchParam.sum = res.obj.itemTotal;
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
            const res = await PointService.addPointrule({
                fTypeId: this.ruleform.region,
                fChangeType: this.ruleform.regions,
                fName: this.ruleform.desc,
                fIntegralNumber: this.ruleform.integral,
                fMoneyType: this.ruleform.moneycate,
                fMoneyNumber: this.ruleform.money,
                fMoneyType: this.ruleform.moneycate,
                fMoneyNumber: this.ruleform.money,
                fIsEnable: 1,
                fIsDelete: 0,
                fileManagements: this.wjlist
            });
            if (res.success) {
                this.visibles = false;
                this.ruleAll();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑规则
        async editorRule() {
            const res = await PointService.editorRule({
                fId: this.fid,
                fTypeId: this.ruleform.region,
                fChangeType: this.ruleform.regions,
                fName: this.ruleform.desc,
                fIntegralNumber: this.ruleform.integral,
                fMoneyType: this.ruleform.moneycate,
                fMoneyNumber: this.ruleform.money,
                fIsEnable: 1,
                fIsDelete: 0,
                fileManagements: this.wjlist
            });
            if (res.success) {
                this.visibles = false;
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
        //根据id查询积分规则
        async findRule(id) {
            const res = await PointService.findRule(id);
            if (res.success) {
                let jcate = "";
                if (res.obj.fIntegralNumber == 0) {
                    jcate = 1;
                }
                if (res.obj.fMoneyNumber == 0) {
                    jcate = 0;
                }
                if (res.obj.fMoneyNumber != 0 && res.obj.fMoneyNumber != 0) {
                    jcate = 2;
                }
                this.ruleform = {
                    regions: res.obj.fChangeType, //选择奖惩方式
                    region: res.obj.fTypeId, //规则类型
                    integral: res.obj.fIntegralNumber, //规则积分
                    desc: res.obj.fName, //规则明细
                    moneycate: res.obj.fMoneyType,
                    money: res.obj.fMoneyNumber,
                    num: jcate
                };
                this.tempRuleForm = {
                    regions: res.obj.fChangeType, //选择奖惩方式
                    region: res.obj.fTypeId, //规则类型
                    integral: res.obj.fIntegralNumber, //规则积分
                    desc: res.obj.fName, //规则明细
                    moneycate: res.obj.fMoneyType,
                    money: res.obj.fMoneyNumber,
                    num: jcate
                };
            } else {
                this.$message.warning(res.msg);
            }
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
