/*
* @Author: 杨高杰
* @Date: 2019-07-24
* @Description: '积分管理'
*/
<template>
    <div class="point-management-page">
        <div class="container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="积分奖惩" name="first">
                    <div>
                        <el-form
                            :inline="true"
                            label-width="60px"
                            :model="formInline"
                            class="demo-form-inline search-form"
                        >
                            <el-form-item label="关键词">
                                <el-input
                                    class="input-father"
                                    clearable
                                    v-model="formInline.user"
                                    placeholder="可输入姓名,部门"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="findmanagement()">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            ref="multipleTable"
                            :data="departmentData"
                            class="defaultTab dictionaryTypeTab"
                            tooltip-effect="dark"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column label="序号" width="64" type="index"></el-table-column>
                            <el-table-column prop="username" label="姓名" width="120"></el-table-column>
                            <el-table-column prop="departmentName" label="部门" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fCardNumber" label="会员卡号" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fAllIntegral" label="名誉积分" show-overflow-tooltip></el-table-column>
                            <el-table-column
                                prop="fUseIntegral"
                                label="可兑换积分"
                                show-overflow-tooltip
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.fAllIntegral-scope.row.fUseIntegral}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" width="160">
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="pointDetail(scope.row.fId,scope.row.username,scope.row.departmentName)"
                                    >明细</el-button>
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
                </el-tab-pane>
                <el-tab-pane label="现金奖惩" name="second">
                    <div>
                        <el-form
                            :inline="true"
                            label-width="60px"
                            :model="formInline"
                            class="demo-form-inline search-form"
                        >
                            <el-form-item label="关键词">
                                <el-input
                                    class="input-father"
                                    clearable
                                    v-model="formInline.user"
                                    placeholder="可输入姓名,部门"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="findmanagement()">查询</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            ref="multipleTable"
                            :data="departmentData"
                            class="defaultTab dictionaryTypeTab"
                            tooltip-effect="dark"
                            border
                            stripe
                            style="width: 100%"
                        >
                            <el-table-column label="序号" width="64" type="index"></el-table-column>
                            <el-table-column prop="username" label="姓名" width="120"></el-table-column>
                            <el-table-column prop="departmentName" label="部门" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fCardNumber" label="会员卡号" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fAllMoney" label="总金额" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="fUseMoney" label="可用金额" show-overflow-tooltip></el-table-column>
                            <el-table-column fixed="right" label="操作" width="160">
                                <template slot-scope="scope">
                                    <el-button
                                        type="text"
                                        size="small"
                                        @click="pointDetail(scope.row.fId,scope.row.username,scope.row.departmentName)"
                                    >明细</el-button>
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
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 编辑弹窗 -->
        <TheDialog :modal="visible" :modalTitle="modalTitle" @closeModal="visible=false;">
            <div slot="custom-modal-content">
                <el-form
                    :model="departmentForm"
                    :rules="rules"
                    ref="departmentForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="姓名" prop="name">
                        <el-input
                            type="name"
                            placeholder="请输入规则类型名称"
                            v-model="departmentForm.name"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="部门" prop="department">
                        <el-input
                            type="department"
                            placeholder="请输入部门"
                            v-model="departmentForm.department"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="名誉积分" prop="department_m">
                        <el-input
                            type="department_m"
                            placeholder="请输入名誉积分"
                            v-model="departmentForm.department_m"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="可用积分" prop="department_k">
                        <el-input
                            type="department_k"
                            placeholder="请输入可用积分"
                            v-model="departmentForm.department_k"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitdev('departmentForm')">确定</el-button>
                        <el-button @click="no_submitdev()">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 明细弹窗 -->
        <TheDialog :modal="point" :modalTitle="pointTitle" @closeModal="point=false;">
            <div slot="custom-modal-content">
                <el-form ref="form" label-position="left">
                    <el-form-item label="姓名:">
                        <el-tag>{{name}}</el-tag>
                    </el-form-item>
                    <el-form-item label="部门:">
                        <el-tag type="success">{{department}}</el-tag>
                    </el-form-item>
                </el-form>
                <div class="block" style="padding-left: 8px;padding-top: 10px;">
                    <el-timeline>
                        <el-timeline-item
                            v-for="(activity, index) in activities"
                            :key="index"
                            icon="el-icon-medal"
                            v-if="activity.fMoneyType==false || activity.fChangeType==false"
                            color="#F56C6C"
                            size="large"
                            :timestamp="activity.fAddTime | times"
                        >
                            <span
                                v-if="activity.fIntegralNumber==0"
                            >{{activity.fName}}{{activity.fNote}}{{activity.fMoneyNumber}}{{activity.fMoneyType==false?'现金惩罚':activity.fMoneyType==true?'现金奖励':''}}元</span>
                            <span
                                v-if="activity.fMoneyNumber==0"
                            >{{activity.fName}}{{activity.fNote}}{{activity.fIntegralNumber}}{{activity.fChangeType==false?'积分惩罚':activity.fMoneyType==true?'积分奖励':''}}分</span>
                            <span v-if="activity.fMoneyNumber!=0&&activity.fIntegralNumber!=0">
                                {{activity.fName}} {{activity.fNote}} {{activity.fChangeType==false?'积分惩罚:':activity.fMoneyType==true?'积分奖励:':''}}{{activity.fIntegralNumber}}分
                                {{activity.fMoneyType==false?'现金惩罚:':activity.fMoneyType==true?'现金奖励:':''}}{{activity.fMoneyNumber}}元
                            </span>
                        </el-timeline-item>
                        <el-timeline-item
                            v-for="(activity, index) in activities"
                            :key="index"
                            icon="el-icon-medal"
                            v-if="activity.fMoneyType!=false || activity.fChangeType!=false"
                            color="#67C23A"
                            size="large"
                            :timestamp="activity.fAddTime | times"
                        >
                            <span
                                v-if="activity.fIntegralNumber==0"
                            >{{activity.fName}}{{activity.fNote}}{{activity.fMoneyNumber}}{{activity.fMoneyType==false?'现金惩罚':activity.fMoneyType==true?'现金奖励':''}}元</span>
                            <span
                                v-if="activity.fMoneyNumber==0"
                            >{{activity.fName}}{{activity.fNote}}{{activity.fIntegralNumber}}{{activity.fChangeType==false?'积分惩罚':activity.fMoneyType==true?'积分奖励':''}}分</span>
                            <span v-if="activity.fMoneyNumber!=0&&activity.fIntegralNumber!=0">
                                {{activity.fName}} {{activity.fNote}} {{activity.fChangeType==false?'积分惩罚:':activity.fMoneyType==true?'积分奖励:':''}}{{activity.fIntegralNumber}}分
                                {{activity.fMoneyType==false?'现金惩罚:':activity.fMoneyType==true?'现金奖励:':''}}{{activity.fMoneyNumber}}元
                            </span>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { managementService } from "@/api/personal-info"; //引入api
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
            visible: false, //编辑弹窗显隐
            modalTitle: "", //弹窗名字
            point: false, //明细显隐
            pointTitle: "", //明细标题
            activeName: "first", //选项卡选中的标识
            formInline: {
                user: null, //用户输入的内容
                region: null //选择的部门
            },
            departmentData: [],
            searchParam: {
                currentPage: 1,
                sum: 0,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10
            },
            departmentForm: {
                name: "杨高杰", //姓名
                department: "安环部", //部门
                department_m: "500", //名誉积分
                department_k: "300" //可兑换积分
            },
            //表单校验
            rules: {
                name: [
                    {
                        required: true,
                        message: "请填写姓名",
                        trigger: "change"
                    }
                ],
                department: [
                    {
                        required: true,
                        message: "请填写部门",
                        trigger: "blur"
                    }
                ],
                department_m: [
                    {
                        required: true,
                        message: "请填写名誉积分",
                        trigger: "blur"
                    },
                    {
                        validator: validateInt,
                        trigger: "blur"
                    }
                ],
                department_k: [
                    {
                        required: true,
                        message: "请填可兑换积分",
                        trigger: "blur"
                    },
                    {
                        validator: validateInt,
                        trigger: "blur"
                    }
                ]
            },
            //积分明细
            activities: [],
            name: "",
            department: "",
            value1: "",
            value2: ""
        };
    },
    filters: {
        times: function(value) {
            value = value.substring(0, 16).replace(/T/g, " ");
            return value;
        }
    },
    mounted() {
        this.managementAll();
    },
    methods: {
        //积分明细
        pointDetail(fid, fname, fdepent) {
            this.pointTitle = "积分明细";
            this.point = true;
            this.detail(fid);
            this.name = fname;
            this.department = fdepent;
        },
        //编辑的提交和取消
        submitdev(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        //取消提交
        no_submitdev() {
            this.visible = false;
        },
        //点击选项卡
        handleClick() {
            (this.formInline = {
                user: null, //用户输入的内容
                region: null //选择的部门
            }),
                (this.searchParam = {
                    currentPage: 1,
                    sum: this.searchParam.sum,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                });
        },
        findmanagement() {
            this.managementAll();
        },
        //删除当前
        remove() {
            this.$confirm("是否删除该成员?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    console.log("删除了");
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        //分业查询所有规则
        async managementAll() {
            const res = await managementService.managementAll({
                pageCurrent: this.searchParam.currentPage,
                pageSize: this.searchParam.pageSize,
                content: this.formInline.user,
                departmentName: this.formInline.region
            });
            if (res.success) {
                this.departmentData = res.obj.items;
                this.searchParam.sum = res.obj.itemTotal;
            } else {
                this.$message.warning(res.msg);
            }
        },
        //分页操作
        handleSizeChange(val) {
            this.searchParam.pageSize = val;
            this.managementAll();
        },
        handleCurrentChange(val) {
            this.searchParam.currentPage = val;
            this.managementAll();
        },
        //积分明细
        async detail(id) {
            const res = await managementService.detail(id);
            if (res.success) {
                this.activities = res.obj;
            } else {
                this.$message.warning(res.msg);
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .point-management-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding: 15px 10px;

            .rule_pagination {
                margin-top: 1.25rem;
                text-align: right;
            }
        }
    }
</style>
