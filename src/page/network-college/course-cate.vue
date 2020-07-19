<template>
    <div class="curriculum-page">
        <div class="container">
            <div>
                <el-form
                    :inline="true"
                    label-width="100px"
                    :model="formInline"
                    class="demo-form-inline search-form"
                >
                    <el-form-item label="课程分类名">
                        <el-input
                            class="input-father"
                            clearable
                            v-model="formInline.user"
                            placeholder="请输入分类名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="findcate">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click="makemanagement()">添加分类</el-button>
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
                    <el-table-column prop="fCourseTypeName" width="240" label="课程分类名"></el-table-column>
                    <!-- <el-table-column prop="fCourseTypeRemarks" label="分类下课程数">
                    </el-table-column>-->
                    <el-table-column prop="fCourseTypeRemarks" label="分类简介" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-tooltip
                                effect="dark"
                                :content="scope.row.fCourseTypeRemarks"
                                placement="top"
                            >
                                <span>{{scope.row.fCourseTypeRemarks}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="160">
                        <template slot-scope="scope">
                            <el-button
                                type="text"
                                size="small"
                                @click="edio(scope.row.fCourseTypeId)"
                            >编辑</el-button>
                            <el-button
                                type="text"
                                size="small"
                                @click="remove(scope.row.fCourseTypeId)"
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
        <!-- 添加会员弹窗 -->
        <TheDialog :modal="point" :modalTitle="pointTitle" @closeModal="point=false;">
            <div slot="custom-modal-content">
                <el-form
                    :model="tagForm"
                    :rules="rules"
                    ref="tagForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="tagForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="分类简介" prop="desc">
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
    import { CoursecateService } from "@/api/network-college"; //引入api
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
            cateid: "", //课程类型id
            formInline: {
                user: null, //用户输入的内容
                region: null //选择的部门
            },
            departmentData: [
            ],
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
        this.catelist();
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
                        this.addcate();
                    } else {
                        this.updatecate();
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
            this.catelist();
        },
        handleCurrentChange(val) {
            this.searchParam.currentPage = val;
            this.catelist();
        },
        //查询
        findcate() {
            this.catelist();
        },
        //编辑
        edio(id) {
            this.point = true;
            this.pointTitle = "编辑标签";
            this.btnname = "立即编辑";
            this.cateid = id;
            this.editcate(id);
        },
        //删除
        remove(id) {
            this.$confirm("是否删除该标签?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.deletecate(id);
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        },
        //新加标签
        async addcate() {
            const res = await CoursecateService.addcate({
                fCourseTypeName: this.tagForm.name,
                fCourseTypeRemarks: this.tagForm.desc
            });
            if (res.success) {
                this.$message({
                    message: "添加成功",
                    type: "success"
                });
                this.point = false;
                this.catelist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //分类表格
        async catelist() {
            const res = await CoursecateService.catelist({
                fCourseTypeName: this.formInline.user,
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
        //编辑分类确定
        async updatecate() {
            const res = await CoursecateService.updatecate({
                fCourseTypeName: this.tagForm.name,
                fCourseTypeRemarks: this.tagForm.desc,
                fCourseTypeId: this.cateid
            });
            if (res.success) {
                this.$message({
                    message: "编辑成功",
                    type: "success"
                });
                this.point = false;
                this.catelist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //删除分类
        async deletecate(id) {
            const res = await CoursecateService.deletecate(id);
            if (res.success) {
                this.$message({
                    message: "删除成功",
                    type: "success"
                });
                this.catelist();
            } else {
                this.$message.warning(res.msg);
            }
        },
        //编辑分类editcate
        async editcate(id) {
            const res = await CoursecateService.editcate(id);
            if (res.success) {
                this.tagForm = {
                    name: res.obj.fCourseTypeName,
                    desc: res.obj.fCourseTypeRemarks
                };
            } else {
                this.$message.warning(res.msg);
            }
        }
    }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .curriculum-page {
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
