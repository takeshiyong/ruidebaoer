// 摄像头nvr配置
<template>
    <div class="page">
        <div class="page_container ">
          <div class="nvrContent">
              <div class="formDiv">
                  <el-form :inline="true" :model="formInline" class="demo-form-inline">
                    <el-form-item label="提供商">
                        <el-select filterable v-model="formInline.fName" clearable placeholder="请选择提供商"  size="medium">
                            <el-option
                                v-for="item in providerList"
                                :key="item.fId"
                                :label="item.name"
                                :value="item.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="连接ip">
                        <el-input v-model="formInline.fIp" clearable placeholder="请填写连接ip" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.stop="getCheckInfo(true)" size="medium">搜索</el-button>
                        <el-button type="primary" @click.stop="addNvr" size="medium">新建</el-button>
                    </el-form-item>
                  </el-form>
              </div>
              <el-table :data="nvrList" class="defaultTab" stripe ref="nvrTable" highlight-current-row :max-height="docHeight - 350">
                  <!-- <el-table-column type="selection" width="55"></el-table-column> -->

                <el-table-column type="index" label="序号" width="55" :index="indexMethod"></el-table-column>
                <el-table-column
                  prop="fProvider"
                  label="提供商">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fProvider == 'DAHUA' ? '大华' : '海康'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  prop="fIpAddress"
                  label="连接ip">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fIpAddress || '--'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  prop="fPort"
                  label="端口">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fPort || '--'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  min-width="160"
                  prop="fPtzPort"
                  label="云台控制端口">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fPtzPort || '--'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  prop="fUserName"
                  label="用户名">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fUserName || '--'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  prop="fPassword"
                  label="密码">
                      <template  slot-scope="scope">
                          <div>{{scope.row.fPassword || '--'}}</div>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" :show-overflow-tooltip="true" width="120">
                      <template slot-scope="scope">
                          <el-button type="text" @click="editNvr(scope.row)">编辑</el-button>
                          <el-button type="text" @click="deleteNvr(scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <div class="block defaultPage" v-if="sum > 0">
                <el-pagination id="page"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="sum"
                    :page-sizes="pageSizes"
                    :page-size="pageSize">
                </el-pagination>
              </div>
          </div>
        </div>
        <TheDialog :modal='nvrModal' :modalTitle="modalTitle" @closeModal="closeModal">
          <div slot="custom-modal-content">
             <el-form ref="nvrRef" :model="nvrForm" :rules="nvrFormRules" label-width="120px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="提 供 商" prop="fProvider">
                                <el-select filterable v-model="nvrForm.fProvider" clearable placeholder="请选择提供商" style="width:100%;">
                                    <el-option
                                        v-for="item in providerList"
                                        :key="item.fId"
                                        :label="item.name"
                                        :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="连接ip" prop="fIpAddress">
                                <el-input v-model.trim="nvrForm.fIpAddress" clearable placeholder="请填写连接ip"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="端　口" prop="fPort">
                                <el-input v-model.trim="nvrForm.fPort" clearable placeholder="请填写端口"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="云台控制端口" prop="fPtzPort">
                                <el-input v-model.trim="nvrForm.fPtzPort" clearable placeholder="请填写云台控制端口"></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="用 户 名" prop="fUserName">
                                <el-input v-model.trim="nvrForm.fUserName" clearable placeholder="请填写用户名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密　　码" prop="fPassword">
                                <el-input v-model.trim="nvrForm.fPassword" clearable placeholder="请填写密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item >
                                <el-button type="primary" @click.stop="nvrFun">确定</el-button>
                                <el-button @click.stop="resetForm('nvrRef')">重置</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
             </el-form>
          </div>
        </TheDialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { common } from "@/utils/common";
import { nvrEdit } from "@/api/nvrEdit";
import TheDialog from "@/components/TheDialog";
import _ from "lodash";
export default {
  components: {
    TheDialog
  },
  computed: {
    ...mapGetters(["docHeight"])
  },
  watch: {},
  data() {
    return {
      calPageSize: 1,
      calPageCurrent: 1,
      formInline: {
        fName: "",
        fIp: ""
      },
      searchFormline: {
        fName: "",
        fIp: ""
      },
      providerList: [
        {
          fId: "DAHUA",
          name: "大华"
        },
        {
          fId: "HIKVISION",
          name: "海康"
        }
      ],
      currentPage: 1,
      sum: 0,
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      nvrForm: {
        fIpAddress: "",
        fProvider: "",
        fUserName: "",
        fPort: "",
        fPtzPort: "",
        fPassword: "",
        fId: ""
      },
      nvrFormRules: {
        fIpAddress: [
          { required: true, message: "请填写连接ip", trigger: "change" }
        ],
        fProvider: [
          { required: true, message: "请选择提供商", trigger: "change" }
        ],
        fUserName: [
          { required: true, message: "请填写用户名", trigger: "change" }
        ],
        fPort: [{ required: true, message: "请填写端口", trigger: "change" }],
        fPtzPort: [
          { required: true, message: "请填写云台控制端口", trigger: "change" }
        ],
        fPassword: [{ required: true, message: "请填写密码", trigger: "change" }]
      },
      nvrList: [],
      nvrModal: false,
      modalTitle: "",
      currentItem: null
    };
  },
  mounted() {
    this.getCheckInfo();
  },
  methods: {
    indexMethod(index) {
      console.log(index);
      return index + this.calPageSize * (this.calPageCurrent - 1) + 1;
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getCheckInfo();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getCheckInfo();
    },
    /**
     * 查询
     */
    async getCheckInfo(flag) {
      if (flag) {
        this.currentPage = 1;
        this.searchFormline = {
          ...this.formInline
        };
      }
      let param = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        fProvider: this.searchFormline.fName,
        fIp: this.searchFormline.fIp
      };
      let res = await nvrEdit.findAll(param);
      if (res.success) {
          console.log(res.obj);
        this.calPageSize = res.obj.pageSize;
        this.calPageCurrent = res.obj.pageCurrent;
        this.sum = res.obj.itemTotal;
        this.nvrList = res.obj.items;
      } else {
        this.$message.warning(res.msg);
        this.nvrList = [];
      }
    },
    /**
     * 新建nvr配置
     */
    addNvr() {
      this.nvrModal = true;
      this.modalTitle = "新建nvr配置";
    },
    /**
     * 表单提交
     */
    nvrFun() {
      let flag = common.formCheck(this, "nvrRef");
      if (!flag) {
        return;
      }
      if (this.modalTitle === "新建nvr配置") {
        this.insertNvr();
      } else {
        this.updateNvr();
      }
    },
    /**
     * 新建nvr配置接口
     */
    async insertNvr() {
      let param = {
        ...this.nvrForm
      };
      let res = await nvrEdit.add(param);
      if (res.success) {
        this.$message.success(res.msg);
        this.getCheckInfo();
        this.closeModal();
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 修改nvr配置接口
     */
    async updateNvr() {
      let param = {
        ...this.nvrForm
      };
      let res = await nvrEdit.update(param);
      if (res.success) {
        this.$message.success(res.msg);
        this.getCheckInfo();
        this.closeModal();
      } else {
        this.$message.warning(res.msg);
      }
    },
    /*
        编辑nvr配置
        */
    editNvr(item) {
      this.currentItem = _.cloneDeep(item);
      this.nvrForm = _.cloneDeep(item);
      this.modalTitle = "编辑nvr配置";
      this.nvrModal = true;
    },
    /**
     * nvr配置详情
     */
    dteailNvr(item) {
      this.nvrForm = _.cloneDeep(item);
      this.modalTitle = "nvr配置详情";
      this.nvrModal = true;
    },
    /**
     * 删除nvr配置
     */
    deleteNvr(item) {
      this.$confirm(`您将删除nvr配置“${item.fIpAddress}”，是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          console.log(item);
          this.deleteNvrFun(item.fId);
        })
        .catch(() => {});
    },
    /**
     * 删除接口
     */
    async deleteNvrFun(fId) {
      console.log(fId);
      let res = await nvrEdit.delete(fId);
      if (res.success) {
        this.$message.success(res.msg);
        this.getCheckInfo();
      } else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 重置
     */
    resetForm(formName) {
      if (this.modalTitle === "新建nvr配置") {
        this.$refs[formName].resetFields();
      } else {
        this.nvrForm = { ...this.currentItem };
      }
    },
    /**
     * 关闭弹窗
     */
    closeModal() {
      this.nvrModal = false;
      this.nvrForm = {
        fIpAddress: "",
        fProvider: "",
        fUserName: "",
        fPort: "",
        fPtzPort: "",
        fPassword: "",
        fId: ""
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  padding: 0px 10px;
  .page_container {
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    padding: 20px;
    height: calc(100vh - 190px);
    hr {
      border: none;
      height: 1px;
      background: #e2e3e5;
    }
    .tab_container {
      margin-top: 16px;
    }
  }
}
.nvrContent {
  height: calc(100vh - 220px);
}
</style>