/*
* @Author: 杨高杰
* @Date: 2019-08-02
* @Description: '课程标签管理'
*/
<template>
    <div class="apply-page">
        <div class="container">
            <div>
                <el-form
                    :inline="true"
                    label-width="60px"
                    :model="formInline"
                    class="demo-form-inline search-form"
                >
                    <el-form-item label="标签名">
                        <el-input
                            class="input-father"
                            clearable
                            v-model="formInline.user"
                            placeholder="请输入标签名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="findlable">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="makemanagement()">添加标签</el-button>
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
                    <el-table-column prop="fLabelName" label="标签名">
                        <template slot-scope="scope">
                            <el-tag type="success">{{scope.row.fLabelName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fLabelRemarks" label="标签简介" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tooltip
                                effect="dark"
                                :content="scope.row.fLabelRemarks"
                                placement="top"
                            >
                                <span>{{scope.row.fLabelRemarks}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="edio(scope.row.fLabelId)">编辑</el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="remove(scope.row.fLabelId)"
                                style="color:#F56C6C;"
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
        <!-- 添加标签弹窗 -->
        <TheDialog :modal="point" :modalTitle="pointTitle" @closeModal="point=false;">
            <div slot="custom-modal-content">
                <el-form
                    :model="tagForm"
                    :rules="rules"
                    ref="tagForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="标签名称" prop="name">
                        <el-input v-model="tagForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标签简介" prop="desc">
                        <el-input
                            type="textarea"
                            maxlength="50"
                            show-word-limit
                            v-model="tagForm.desc"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="subtagForm('tagForm')">{{this.btnname}}</el-button>
                        <el-button @click="resettagForm('tagForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { CourseService } from "@/api/network-college"; //引入api
    import TheDialog from "@/components/TheDialog";
    export default {
        components: {
            TheDialog
        },
        data() {
            return {
                point: false, //弹窗显示隐藏
                pointTitle: "", //弹窗标题
                btnname: "", //按钮名
                lableid: "", //标签id
                formInline: {
                    user: null, //用户输入的内容
                    region: null //选择的部门
                },
                departmentData: [], //表格数据
                searchParam: {
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                tagForm: {
                    name: "",
                    desc: ""
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: "请输入活动名称",
                            trigger: "blur"
                        },
                        {
                            min: 2,
                            max: 20,
                            message: "长度在 2 到 20 个字符",
                            trigger: "blur"
                        }
                    ],
                    desc: [
                        {
                            required: true,
                            message: "请填写活动形式",
                            trigger: "blur"
                        }
                    ]
                },
                namevalue: ""
            };
        },
        mounted() {
            this.lablelist();
        },
        methods: {
            //打开新建弹框
            makemanagement() {
                this.point = true;
                this.pointTitle = "新建标签";
                this.btnname = "立即创建";
                this.tagForm = {
                    name: "",
                    desc: ""
                };
            },

            reset_rule() {
                this.tagForm = {
                    name: "",
                    desc: ""
                };
            },
            //提交表单
            subtagForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.btnname == "立即创建") {
                            this.addlabel();
                        } else {
                            this.updatelable();
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //重置表单
            resettagForm(formName) {
                this.$refs[formName].resetFields();
            },
            //分页操作
            handleSizeChange(val) {
                this.searchParam.pageSize = val;
                this.lablelist();
            },
            handleCurrentChange(val) {
                this.searchParam.currentPage = val;
                this.lablelist();
            },
            findlable() {
                this.lablelist();
            },
            //编辑
            edio(id) {
                this.point = true;
                this.pointTitle = "编辑标签";
                this.btnname = "立即编辑";
                this.lableid = id;
                this.editlable(id);
            },
            remove(id) {
                this.$confirm("是否删除该标签?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.deletelable(id);
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消操作"
                        });
                    });
            },
            //新加标签
            async addlabel() {
                const res = await CourseService.addlabel({
                    fLabelName: this.tagForm.name,
                    fLabelRemarks: this.tagForm.desc,
                    fLabelType: 0
                });
                if (res.success) {
                    this.$message({
                        message: "添加成功",
                        type: "success"
                    });
                    this.point = false;
                    this.lablelist();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //标签表格
            async lablelist() {
                const res = await CourseService.lablelist({
                    fLabelName: this.formInline.user,
                    pageCurrent: this.searchParam.currentPage,
                    pageSize: this.searchParam.pageSize
                });
                if (res.success) {
                    this.departmentData = res.obj.items;
                    this.searchParam.sum = res.obj.itemTotal;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //编辑标签确定
            async updatelable() {
                const res = await CourseService.updatelable({
                    fLabelName: this.tagForm.name,
                    fLabelRemarks: this.tagForm.desc,
                    fLabelId: this.lableid,
                    fLabelType: 0
                });
                if (res.success) {
                    this.$message({
                        message: "编辑成功",
                        type: "success"
                    });
                    this.point = false;
                    this.lablelist();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //删除标签
            async deletelable(id) {
                const res = await CourseService.deletelable(id);
                if (res.success) {
                    this.$message({
                        message: "删除成功",
                        type: "success"
                    });
                    this.lablelist();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //编辑标签
            async editlable(id) {
                const res = await CourseService.editlable(id);
                if (res.success) {
                    this.tagForm = {
                        name: res.obj.fLabelName,
                        desc: res.obj.fLabelRemarks
                    };
                } else {
                    this.$message.warning(res.msg);
                }
            }
        }
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .apply-page {
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
