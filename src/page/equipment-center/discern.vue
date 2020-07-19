// 摄像头nvr配置
<template>
    <div class="page">
        <div class="page_container ">
          <div class="nvrContent">
              <div class="formDiv" style="marginBottom: 10px">
                  <el-button type="primary" @click.stop="addNvr" size="medium">新建</el-button>
              </div>
              <el-table :data="nvrList" class="defaultTab" stripe ref="nvrTable" highlight-current-row :max-height="docHeight - 350">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->

                <el-table-column type="index" label="序号" width="55" :index="indexMethod"></el-table-column>
                <el-table-column
                  prop="fName"
                  label="摄像头名称">
                  </el-table-column>
                  <el-table-column
                  prop="fChannel"
                  label="摄像头通道号">
                  </el-table-column>
                  <el-table-column
                  prop="fState"
                  label="是否在线">
                    <template  slot-scope="scope">
                      <div>{{scope.row.fState==1 ? '在线' : '不在线'}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                  prop="fIsMonitoring"
                  label="是否监控报警">
                    <template  slot-scope="scope">
                      <el-switch
                        v-model="scope.row.fIsMonitoring"
                        active-text="是"
                        inactive-text="否"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="changeMonitor($event, scope.row)"
                        :active-value="true"
                        :inactive-value="false"
                        >
                      </el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" :show-overflow-tooltip="true" width="120">
                      <template slot-scope="scope">
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
                            <el-form-item label="摄像头" prop="fVideoId">
                                <el-select filterable v-model="nvrForm.fVideoId" clearable placeholder="请选择提供商" style="width:100%;">
                                    <el-option
                                        v-for="item in providerList"
                                        :key="item.fId"
                                        :label="item.fName"
                                        :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="连接ip" prop="fIsMonitoring">
                                <el-switch
                                  v-model="nvrForm.fIsMonitoring"
                                  active-text="是"
                                  inactive-text="否"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  :active-value="true"
                                  :inactive-value="false"
                                  >
                                </el-switch>
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
import { discernService, channelService } from "@/api/video";
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
      currentPage: 1,
      sum: 0,
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      nvrForm: {
        fId: "",
        fIsMonitoring: true, // 是否监控报警
        fVideoId: "", // 摄像头id
      },
      nvrFormRules: {
        fIsMonitoring: [
          { required: true, message: "请选择是否监控报警", trigger: "change" }
        ],
        fVideoId: [
          { required: true, message: "请选择摄像头", trigger: "change" }
        ]
      },
      nvrList: [],
      nvrModal: false,
      modalTitle: "",
      currentItem: null,
      providerList: []
    };
  },
  mounted() {
    this.getCheckInfo();
    this.getChannel();
  },
  methods: {
    // 修改监控报警
    async changeMonitor(val, item) {
      const res = await discernService.update({
        ...item,
        fIsMonitoring: val
      });
      if (res.success) {
        this.$message.success('修改成功');
        this.getCheckInfo();
      } else {
        this.$message.warning(res.msg);
      }
    },
    indexMethod(index) {
      console.log(index);
      return index + this.calPageSize * (this.calPageCurrent - 1) + 1;
    },
    // 查询所有摄像头
    async getChannel() {
      const res = await channelService.selectByType(0);
      console.log(res,'查询所有摄像头')
      if (res.success) {
        this.providerList = [...res.obj, ];
      } 
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
      let res = await discernService.selectAll();
      console.log(res.obj);
      if (res.success) {
        this.nvrList = res.obj;
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
      this.modalTitle = "新建料径识别摄像头";
    },
    /**
     * 表单提交
     */
    nvrFun() {
      let flag = common.formCheck(this, "nvrRef");
      if (!flag) {
        return;
      }
      if (this.modalTitle === "新建料径识别摄像头") {
        this.insertNvr();
      } else {
        this.updateNvr();
      }
    },
    /**
     * 新建料径识别摄像头
     */
    async insertNvr() {
      let param = {
        ...this.nvrForm
      };
      let res = await discernService.insert(param);
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
      this.$confirm(`您将删除料径识别摄像头“${item.fName}”，是否继续?`, "提示", {
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
      let res = await discernService.delete(fId);
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