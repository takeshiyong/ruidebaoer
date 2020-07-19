<template>
    <div class="curriculum-page">
        <div class="container">
            <el-tabs type="border-card" v-model="activeName" @tab-click="leave">
                <el-tab-pane
                    v-for="(val, index) in depentlist"
                    :key="index"
                    :label="val.fRemark"
                    @tab-click="leave"
                >
                    <el-form :model="formInline" label-position="left">
                        <el-form-item label="业务类型:">
                            <el-tag>{{ val.fRemark }}</el-tag>
                        </el-form-item>
                        <el-form-item label="部门配置:">
                            <el-select v-model="formInline.depent" placeholder="请选择规则类型">
                                <el-option
                                    v-for="(val, index) in deptypelist"
                                    :key="index"
                                    :label="val.fName"
                                    :value="val.fId"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" @click="onsub(val.fLevel, val.fType)">确定</el-button>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import { GoodService } from "@/api/production"; //引入api
    export default {
        data() {
            return {
                activeName: "",
                formInline: {
                    depent: ""
                },
                depentlist: ["班组1", "班组2", "班组3"],
                deptypelist: [],
                id: ""
            };
        },
        mounted() {
            this.leavetype();
            this.depType();
        },
        methods: {
            onsub(id, tye) {
                this.adddeptype(id, tye);
            },
            //获取所有业务类型
            async leavetype() {
                const res = await GoodService.leavetype();
                if (res.success) {
                    this.depentlist = res.obj;
                    this.id = res.obj[0].fLevel;
                    this.selectType(this.id);
                } else {
                    this.$message.warning(res.msg);
                }
            },
            leave(tab, event) {
                this.id = this.depentlist[this.activeName].fLevel;
                this.selectType(this.id);
            },
            //查询所有部门
            async depType() {
                const res = await GoodService.depType();
                if (res.success) {
                    this.deptypelist = res.obj;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //根据id查询部门配置
            async selectType(ids) {
                const res = await GoodService.selectType(ids);
                if (res.success) {
                    this.formInline.depent = res.obj.fId;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            //点击确定进行配置
            async adddeptype(id, tye) {
                const res = await GoodService.adddeptype({
                    fLevel: this.formInline.depent,
                    fType: tye
                });
                if (res.success) {
                    this.$message({
                        message: "新建成功",
                        type: "success"
                    });
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
