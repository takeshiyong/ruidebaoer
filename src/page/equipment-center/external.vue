//对外展示资源
<template>
    <div class="page">
        <el-row>
          <!-- 资源组展示 -->
          <el-col :lg="5" :md="7" :sm="9" :xs="24">
            <div class="left-div">
              <div class="left-div-header">
                <span>资源组（{{resourceGrouplist.length}}）</span>
                <el-tooltip effect="dark" content="删除资源组" placement="top">
                    <el-button type="text" icon="el-icon-delete" @click="deleteResourceGroup" class="opearBtn ml10 mt-4"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑资源组" placement="top">
                    <el-button type="text" icon="el-icon-edit" @click="updateResourceGroup" class="opearBtn mt-4"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="新建资源组" placement="top">
                    <el-button type="text" icon="el-icon-plus" @click="addResourceGroup" class="opearBtn mt-4"></el-button>
                </el-tooltip>
              </div>
              <div class="header-line"></div>
              <div class="externalDiv">
                <div class="resourceDiv" v-for="item in resourceGrouplist" :key="item.fId" @click.stop="selectResourceGroup(item)" :style="{backgroundColor: item.fId === currentTree.fId ? '#188896' : '#fff',color: item.fId === currentTree.fId ? '#fff' : '#606266'}">
                  <i class="redoublefont redouble-point pointStyle"></i>{{item.fGroupName}}</div>
              </div>
            </div>
          </el-col>
          <el-col :lg="19" :md="17" :sm="15" :xs="24">
            <div class="right-div">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                  <el-form-item label="资源名称" class="mb12">
                      <el-input size="medium" v-model="formInline.fName" clearable placeholder="请填写资源名称"></el-input>
                  </el-form-item>
                  <el-form-item class="mb12">
                      <el-button type="primary" @click.stop="getCheckInfo(true)" size="medium">搜索</el-button>
                      <el-button type="primary" @click.stop="addExternal" size="medium" >新建</el-button>
                      <el-button type="primary" @click.stop="delExternal('batch')" size="medium" >删除</el-button>
                      <span class="tableOrPic">
                        <el-tooltip effect="dark" content="列表展示" placement="top">
                          <i class="redoublefont redouble-biaoge" @click.stop="switchTable" :style="{color:isTable ? '' : '#ccc'}"></i>
                        </el-tooltip>
                        /
                        <el-tooltip effect="dark" content="图表展示" placement="top">
                          <i class="redoublefont redouble-pic" @click.stop="switchPic" :style="{color:isTable ? '#ccc' : ''}"></i>
                        </el-tooltip>
                      </span>
                  </el-form-item>
              </el-form>
              <hr class="opear-line-container"/>
              <div class="tab_container">
                <!-- 表格展示 -->
                <el-table v-if="isTable" ref="markTable" stripe :data="externalLists" class="defaultTab resourceTab" highlight-current-row @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column type="index" label="序号" width="55" :index="indexMethod"></el-table-column>
                  <el-table-column prop="fName" label="资源名称" min-width="100" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span>{{scope.row.fName || '--'}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fCurrentShowUrl" label="资源URL" min-width="100" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span>{{scope.row.fCurrentShowUrl || '--'}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fItselfUrl" label="对外展示URL" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span style="cursor:pointer;color:#0294D7;" v-if="scope.row.fItselfUrl" @click.stop="previewResource(scope.row)">{{scope.row.fItselfUrl}}</span>
                        <span v-else>--</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fType" label="资源类型" min-width="100" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span>{{scope.row.fType == 1 ? "视频资源" : scope.row.fType == 2 ? "视频资源组" : scope.row.fType == 3 ? "第三方资源" : "--"}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fType" label="是否关联推送" min-width="120" :show-overflow-tooltip="true">
                      <template slot-scope="scope">
                        <span :style="{color: scope.row.fIsAssociatedPush ? '#00b589' : '#ff734b'}">{{scope.row.fIsAssociatedPush ? "是" : "否"}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="fShowVideoWay" label="视频加载方式" min-width="120" :show-overflow-tooltip="true">
                  </el-table-column>
                  <el-table-column label="操作" width="120">
                      <template slot-scope="scope">
                          <el-button type="text" @click="editExternal(scope.row)" size="small" >编辑</el-button>
                          <el-button type="text" @click="delExternal(scope.row)" size="small" >删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
                <div v-if="!isTable" class="resourcePicDiv">
                  <el-row :gutter="20">
                    <el-col :lg="6" :md="12" :sm="12" :xs="24" v-for="item in externalLists" :key="item.fId">
                      <div class="resourcePic">
                        <div class="resourcePic_content">
                          <iframe v-if="item.fType == 3" :src="item.fCurrentShowUrl" frameborder="0" scrolling="no"   style="border:none;width: 100%;height:100%;"></iframe>
                          <singlePlayVideo :playWay="item.fShowVideoWay" v-if="item.fType == 1" :channel="item.fChannel.toString()"></singlePlayVideo>
                          <multPlayVideo v-if="item.fType == 2" :channels="item.fChannels" :cycTime="cycTime"></multPlayVideo>
                          <div v-if="item.fType == null" class="nullData">暂无资源</div>
                        </div>
                        <div class="resourcePic_name">
                        <span style="float:left;marginLeft:10px;">
                          <el-checkbox v-model="item.checked"></el-checkbox>
                        </span>
                        <span style="float:left;marginLeft:10px;">{{item.fName}}</span>
                        <span style="float:right;marginRight:10px;">
                          <el-tooltip effect="dark" content="预览" placement="top">
                            <i v-if="item.fType == null" class="redoublefont redouble-quanping" style="color:#ccc;cursor:not-allowed;fontSize:17px;"></i>
                            <i v-else @click.stop="previewResource(item)" class="redoublefont redouble-quanping" style="color:#333;cursor:pointer;fontSize:17px;"></i>
                          </el-tooltip>
                        </span>
                        <span style="float:right;marginRight:10px;color:#333;">
                          <el-tooltip effect="dark" content="删除" placement="top">
                            <i @click.stop="delExternal(item)" class="el-icon-delete" style="fontSize:16px; color:#333;"></i>
                          </el-tooltip>
                        </span>
                        <span style="float:right;marginRight:10px;color:#333;">
                          <el-tooltip effect="dark" content="编辑" placement="top">
                            <i @click.stop="editExternal(item)" class="redoublefont redouble-shezhi" style="fontSize:20px;color:#333;"></i>
                          </el-tooltip>
                        </span>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <div class="block  defaultPage" v-if="sum > 0">
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

          </el-col>
        </el-row>
        <!-- 资源组 -->
        <TheDialog :modal='resourceGroupModal' :modalTitle="modalTitle" @closeModal="closeModal">
          <div slot="custom-modal-content">
            <el-form ref="resourceGroupRef" :model="resourceGroupForm" :rules="resourceGroupFormRules" label-width="135px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="资源组名称" prop="fGroupName">
                          <el-input v-model="resourceGroupForm.fGroupName" clearable placeholder="请填写资源组名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item>
                    <el-button type="primary" @click.stop="addresourceGroupFun">确定</el-button>
                    <el-button @click.stop="resetForm('resourceGroupRef')">重置</el-button>
                </el-form-item>
            </el-form>

          </div>
        </TheDialog>
        <!-- 资源 -->
        <TheDialog :modal='externalModal' :modalTitle="modalTitle" @closeModal="closeModal">
             <div slot="custom-modal-content">
                <el-form ref="externalRef" :model="externalForm" :rules="externalFormRules" label-width="135px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="资源名称" prop="fName">
                              <el-input v-model="externalForm.fName" clearable placeholder="请填写资源名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="关联推送" prop="fIsAssociatedPush">
                              <el-switch
                                v-model="externalForm.fIsAssociatedPush"
                                style="marginTop: -2px"
                                active-color="#13ce66"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否" class="account-swith">
                              </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="视频加载方式" prop="fShowVideoWay">
                              <el-radio-group v-model="externalForm.fShowVideoWay">
                                <el-radio :label="'RTMP'">rtmp</el-radio>
                                <el-radio :label="'FLV'">flv</el-radio>
                              </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24" v-if="modalTitle === '编辑对外展示资源'">
                          <el-form-item label="资源类型" prop="fType">
                            <el-radio-group v-model="externalForm.fType" @change="changefType('externalRef')">
                              <el-radio :label="1">视频资源</el-radio>
                              <el-radio :label="2">视频资源组</el-radio>
                              <el-radio :label="3">第三方资源</el-radio>
                            </el-radio-group>
                          </el-form-item>
                        </el-col>
                        <el-col :span="24" v-if="modalTitle === '编辑对外展示资源' && externalForm.fType == 3">
                          <el-form-item label="资源URL" prop="fCurrentShowUrl">
                            <el-input v-model.trim="externalForm.fCurrentShowUrl" clearable style="width:100%;" placeholder="请填写第三方资源URL"></el-input>
                          </el-form-item>
                        </el-col>
                        <div v-if="modalTitle === '编辑对外展示资源'">
                          <el-col :span="24" v-if="externalForm.fType == 2">
                            <el-form-item label="视频资源组" prop="fVideoResourceId" :rules="[
                              { required: true, message: '请选择视频资源组', trigger: ['blur'] }
                            ]">
                              <el-select v-model="externalForm.fVideoResourceId" clearable placeholder="请选择视频资源组" style="width:100%;">
                                <el-option
                                  v-for="item in videoShowResourceList"
                                  :key="item.fId"
                                  :label="item.fResourcesName"
                                  :value="item.fId">
                                </el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="24" v-if="externalForm.fType == 1">
                            <el-form-item label="视频资源" prop="fVideoResourceId" :rules="[
                              { required: true, message: '请选择视频资源', trigger: ['blur'] }
                            ]">
                               <el-cascader
                                clearable
                                placeholder="请选择视频资源"
                                :options="videoResourceList"
                                v-model="selectedOptions"
                                @change="changefVideoResourceId"
                                style="width:100%;"
                                >
                              </el-cascader>
                            </el-form-item>
                          </el-col>
                        </div>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click.stop="addExternalFun">确定</el-button>
                        <el-button @click.stop="resetForm('externalRef')">重置</el-button>
                    </el-form-item>
                </el-form>
             </div>
        </TheDialog>
    </div>
</template>
<script>
import { common } from "@/utils/common";
import { external, resourceGroup } from "@/api/external";
import { videoAreaService } from '@/api/video';
import TheDialog from "../../components/TheDialog.vue";
import singlePlayVideo from '../../components/videoComponent/singlePlayVideo.vue';
import multPlayVideo from '../../components/videoComponent/multPlayVideo.vue';
export default {
  components: {
    TheDialog, singlePlayVideo, multPlayVideo
  },
  data() {
    return {
        calPageSize: 1,
        calPageCurrent: 1,
        cycTime: 30,//循环播放时间 秒为单位
        currentPage: 1, //分页初始值
        pageSizes:  [10,20,30,40],
        pageSize: 10,
        sum: 0,
        formInline: {
          fName: ""
        },
        searchName: "",
        selectedOptions: [],
        saveSelectedOptions: [],
        //资源组
        resourceGroupForm: {
          fGroupName: ""
        },
        resourceGroupFormRules:{
          fGroupName: [{ required: true, message: '请填写资源组名称', trigger: 'change  ' }]
        },
        //资源
        externalForm: {
          fName: "",
          fCurrentShowUrl: "",
          fItselfUrl: '',
          fType: '',
          fVideoResourceId: "",
          fIsAssociatedPush: false,
          fShowVideoWay: 'RTMP'
        },
        multipleSelection: [],
        externalLists: [],
        externalFormRules: {
          fName: [{ required: true, message: '请填写资源名称', trigger: 'change' }],
          fCurrentShowUrl: [{ required: true, message: '请填写资源URL', trigger: 'change' }],
          fType: [{ required: true, message: '请选择资源类型', trigger: 'change' }],
          // fVideoResourceId: [{ required: true, message: '请选择视频资源', trigger: 'change' }],
          fIsAssociatedPush: [{ required: true, message: '请选择是否关联推送', trigger: 'change' }],
          fShowVideoWay: [{ required: true, message: '请选择视频加载方式', trigger: 'change' }],
        },
        currentInfo: null, // 当前操作的资源数据
        resourceGroupModal: false,
        externalModal: false,
        modalTitle: "",
        videoShowResourceList: [],//展示视频资源
        videoResourceList: [],//视频资源
        resourceGrouplist: [],//资源组树结构
        currentTree: {},//当前选择的资源组节点
        isTable: true,//当前显示表格还是图
    };
  },
  mounted(){
    this.getResourceGroup();
    this.getVideoList();
    this.getAllVideoList();
  },
  methods: {
    changefType(formName) {
      this.externalForm.fVideoResourceId = "";
      this.externalForm.fCurrentShowUrl = "";
      this.selectedOptions = [];
      this.$refs[formName].clearValidate();
    },
    /**
     * 组装视频资源资源
     */
    formateVideoResource(arr) {
      let newArr = [];
      arr.forEach( element => {
        element.label = element.fName;
        element.value = element.fId;
        element.children = [];
        if(element.fVideoAreaList && element.fVideoAreaList.length > 0){
            element.fVideoAreaList.forEach( elementValue => {
              elementValue.label = elementValue.fName;
              elementValue.value = elementValue.fId;
              elementValue.children = [];
              element.children.push(elementValue);
              if (elementValue.fVideoChannelConfigList && elementValue.fVideoChannelConfigList.length > 0) {
                elementValue.fVideoChannelConfigList.forEach( thirdEle => {
                  thirdEle.label = thirdEle.fName;
                  thirdEle.value = thirdEle.fId;
                  elementValue.children.push(thirdEle);
                });
              }
            });
        }
        if(element.fVideoChannelConfigList && element.fVideoChannelConfigList.length > 0){
          element.fVideoChannelConfigList.forEach( ele => {
            ele.label = ele.fName;
            ele.value = ele.fId;
            element.children.push(ele);
          });
        }
        newArr.push(element);
      });
      this.videoResourceList = newArr;
    },
    /**
     * 添加资源组
     */
    addResourceGroup() {
      this.modalTitle = "新建资源组";
      this.resourceGroupModal = true;
    },
    /**
     *修改资源组
     */
    updateResourceGroup() {
      this.modalTitle = "编辑资源组";
      this.resourceGroupForm = { ...this.currentTree };
      this.resourceGroupModal = true;
    },
    /**
     * 确定添加，修改资源组
     */
    addresourceGroupFun() {
      let flag = common.formCheck(this, 'resourceGroupRef');
      if(!flag){
          return;
      }
      if(this.modalTitle === "新建资源组"){
        this.addResourceGroupFun();
      } else if(this.modalTitle === "编辑资源组"){
        this.updateResourceGroupFun();
      }
    },
    /**
     * 查询视频资源
     */
    async getVideoList() {
      let res = await videoAreaService.select(encodeURI(' '));
      if (res.success) {
        this.formateVideoResource(res.obj);
      } else {
        this.$message.warning(res.msg);
      }
    },
    async getAllVideoList() {
      let res = await external.selectAllVideo();
      if(res.success){
        this.videoShowResourceList = res.obj;
      }
    },
    /**
     * 查询资源组
     */
    async getResourceGroup() {
      let res = await resourceGroup.selectAll();
      if(res.success){
        this.resourceGrouplist = res.obj;
        if(!this.currentTree.fId){
          this.currentTree = { ...this.resourceGrouplist[0] };
        }
        this.getCheckInfo();
      } else{
        this.$message.warning(res.msg);
      }
    },
    /**
     * 新建资源组接口
     */
    async addResourceGroupFun() {
      let res = await resourceGroup.insert(this.resourceGroupForm);
      if(res.success){
        this.$message.success(res.msg);
        this.currentPage = 1;
        this.getResourceGroup();
        this.closeModal();
      }else{
        this.$message.warning(res.msg);
      }
    },
    /**
     * 修改资源组接口
     */
    async updateResourceGroupFun() {
      let res = await resourceGroup.update(this.resourceGroupForm);
      if(res.success){
        this.$message.success(res.msg);
        this.getResourceGroup();
        this.closeModal();
      }else{
        this.$message.warning(res.msg);
      }
    },
    /**
     * 删除资源组
     */
    deleteResourceGroup() {
      this.$confirm(`您将删除资源组“${this.currentTree.fGroupName}”，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(() => {
            this.deleteResourceGroupFun();
        }).catch(() => {
        });
    },
    async deleteResourceGroupFun(){
      let res = await resourceGroup.delete(this.currentTree.fId);
      if(res.success){
        this.$message.success(res.msg);
        this.currentTree = {};
        this.getResourceGroup();
      } else{
        this.$message.warning(res.msg);
      }
    },
    /**
     * 分页
     */
    handleSizeChange(val){
      this.pageSize = val;
      this.currentPage = 1;
      this.getCheckInfo();
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.getCheckInfo();
    },
    handleSelectionChange(val){
      this.multipleSelection =[ ...val ];
    },
    /**
     * 列表序号
     **/
    indexMethod(index){
      return index + this.calPageSize*(this.calPageCurrent-1)+1;
    },
    /**
     * 选择资源组
     */
    selectResourceGroup(item) {
      this.formInline.fName = "";
      this.currentTree = { ...item };
      this.currentPage = 1;
      this.getCheckInfo();
    },
    /**
     * 搜索对外展示资源 全查
     */
    async getCheckInfo(flag){
      if(flag){
        this.searchName = this.formInline.fName;
      }
      let param = {
        fName: this.searchName,
        fGroupId: this.currentTree.fId,
        currentPage: this.currentPage,
        pageSize: this.pageSize
      };
      let res = await external.selectByPage(param);
      if(res.success){
        this.sum = res.obj.itemTotal;
        res.obj.items.forEach( ele => {
          ele.checked = false;
        });
        this.externalLists = res.obj.items;
        this.calPageSize = res.obj.pageSize;
        this.calPageCurrent = res.obj.pageCurrent;
        //增加单选的属性，以便于删除
      } else {
        this.externalLists = [];
        this.$message.warning(res.msg);
      }
    },
    /**
     * 新建资源类型
     */
    addExternal(){
      this.modalTitle = "新建对外展示资源";
      this.externalForm = {
          fName: "",
          fCurrentShowUrl: "",
          fItselfUrl: '',
          fType: '',
          fVideoResourceId: "",
          fIsAssociatedPush: false,
          fShowVideoWay: 'RTMP'
      };
      this.externalModal = true;
    },
    addExternalFun(){
      let flag = common.formCheck(this, 'externalRef');
      if(!flag){
          return;
      }else{
          if(this.modalTitle === "新建对外展示资源"){
            this.addExternalInfo();
          }else {
            this.updateExternalInfo();
          }
      }
    },
    async addExternalInfo(){
      let param = { ...this.externalForm };
      param.fGroupId = this.currentTree.fId;
      let res = await external.insert(param);
      if(res.success){
        this.$message.success(res.msg);
        this.getCheckInfo();
        this.closeModal();
      }else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 修改资源类型
     */
    editExternal(itemInfo){
      this.currentInfo = { ...itemInfo };
      this.modalTitle = "编辑对外展示资源";
      this.externalForm = { ...itemInfo };
      if(itemInfo.fType == 1){  
        if(itemInfo.fPlaceId && itemInfo.fAreaId){
          this.selectedOptions = [itemInfo.fPlaceId, itemInfo.fAreaId, itemInfo.fVideoResourceId];
        } else{
          for(let i = 0 ; i < this.videoResourceList.length; i++){
            if(i > 2){//至多有三种没有区域生产场所的摄像头，所以至多循环三次
              break;
            }
            let item = this.videoResourceList[i];
            if(item.fcode){
              for(let cItem of item.children){
                if(cItem.fId === itemInfo.fVideoResourceId){
                  this.selectedOptions = [item.fId, itemInfo.fVideoResourceId];
                  break;
                }
              }
            }else{
              break;
            }
          }
        }
      }
      this.saveSelectedOptions = [ ...this.selectedOptions ];
      this.externalModal = true;
    },
    /**
     * 改变视频资源
     */
    changefVideoResourceId(val) {
      this.externalForm.fVideoResourceId = val[val.length - 1];
    },
    async updateExternalInfo(){
      let param = { ...this.externalForm };
      param.fGroupId = this.currentTree.fId;
      let res = await external.update(param);
      if(res.success){
        this.$message.success(res.msg);
        this.getCheckInfo();
        this.closeModal();
      }else {
        this.$message.warning(res.msg);
      }
    },
    /**
     * 删除数据
     */
    delExternal(type) {
        //若当前为图表表现形式，则需要重新组装数据
        if(!this.isTable && type === "batch"){
          this.multipleSelection = [];
          this.externalLists.forEach(ele => {
            if(ele.checked){
              this.multipleSelection.push(ele);
            }
          });
        }
        if(type === "batch"){
          if(this.multipleSelection.length === 0){
            this.$message.warning('请选择操作数据！');
            return;
          }
            // 批量删除
            this.$confirm(`您将删除${this.multipleSelection.length}条对外展示资源，是否继续?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
                this.delExternalFun(type);
            }).catch(() => {
              this.multipleSelection = [];
              this.$refs.markTable.clearSelection();
            });
        }else{
            this.$confirm(`您将删除对外展示资源“${type.fName}”，是否继续?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
              }).then(() => {
                  this.delExternalFun(type);
              }).catch(() => {
            });
        }
    },
    async delExternalFun(itemInfo){
      let param = [];
      if(itemInfo === "batch"){
        this.multipleSelection.forEach( ele => {
          param.push(ele.fId);
        });
      } else{
        param.push(itemInfo.fId);
      }
      let res = await external.deleteBatch(param);
      if(res.success){
        this.$message.success(res.msg);
        this.currentPage = 1;
        this.getCheckInfo();
        this.multipleSelection = [];
        this.$refs.markTable.clearSelection();
      }else {
        this.$message.warning(res.msg);
        this.multipleSelection = [];
        this.$refs.markTable.clearSelection();
      }
    },
    /**
     * 切换为表格
     */
    switchTable() {
      this.multipleSelection = [];
      this.getCheckInfo();
      this.isTable = true;
    },
    /**
     * 切换为图表
     */
    switchPic() {
      this.multipleSelection = [];
      this.getCheckInfo();
      this.isTable = false;
    },
    /**
     * 预览资源
     */
    previewResource(obj) {
      window.open(obj.fItselfUrl, '_blank');
    },
    resetForm(formName){
        if(this.modalTitle === '新建对外展示资源' || this.modalTitle === '新建资源组'){
        } else {
          if(this.modalTitle === '编辑资源组'){
            this.resourceGroupForm = { ...this.currentTree };
          }else {
            this.selectedOptions = [ ...this.saveSelectedOptions ];
            this.externalForm = { ...this.currentInfo };
            this.$refs[formName].resetFields();
          }
        }
        this.$refs[formName].resetFields();
    },
    closeModal(){
      this.modalTitle = "";
      this.selectedOptions = [];
      this.saveSelectedOptions = [];
      this.externalModal = false;
      this.resourceGroupModal = false;
      this.externalForm = {
        fName: "",
        fCurrentShowUrl: "",
        fItselfUrl: '',
        fType: '',
        fVideoResourceId: "",
        fIsAssociatedPush: false
      };
      this.resourceGroupForm = {
        fGroupName: ""
      };
    },
  },
  
};
</script>
<style lang="scss" scoped>
  .mt-4 {
    margin-top: -4px;
  }
  .ml10 {
    margin-left: 10px;
  }
  .mb12 {
    margin-bottom: 12px!important;
  }
  .page {
    padding: 0px 10px;
  }
  .left-div {
      background:rgba(255,255,255,1);
      height: calc(100vh - 150px) ;
      border-right: 1px solid #f1f1f1;
  }
  .externalDiv {
      padding: 20px 20px 0px 20px;
      height: calc(100vh - 230px);
      overflow-y: auto;
      .resourceDiv{
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #606266;
        cursor: pointer;
      }
      .resourceDiv:hover{
        background-color: #f5f7fa;
      }
  }
  .left-div-header {
      padding: 20px;
      font-weight:400;
      color:rgba(84,84,84,1);
      line-height:25px;
      font-size: 16px;
      .opearBtn {
          float: right;
          color: #545454;
          font-size: 17px;
      }
  }
  .header-line {
      margin: 0px 20px;
      margin-top: -6px;
      height: 1px;
      border-bottom: 1px solid rgba(226,227,229,1);
  }
  .pointStyle {
      font-size: 24px;
      color: #ccc!important;
      vertical-align: middle;
      margin-left: 4px;
      margin-right: 10px;
  }
  .opear-line-container {
      height: 1px;
      border: none;
      border-bottom: 1px solid #e2e3e5;
      margin-bottom: 10px;
  }
  .right-div {
    background:rgba(255,255,255,1);
    height: calc(100vh - 170px) ;
    padding: 10px 20px;
  }
  .colTitle{
    color: #333;
  }
  .cols_{
    border-top: 1px dashed #ccc;
    line-height: 33px;
  }
  .fColorStyle{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .markPointContent{
    max-height: calc(100vh - 330px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .iconDiv{
        border: 1px solid #ccc;
        border-radius: 6px;
        height: 160px;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .iconSpan{
        text-align: center;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
    }
    .iconSpan:hover{
        color: #F56C6C;
    }
    .showIconPreview{
        border: 1px solid #ccc;
        width: 100%;
        height: 160px;
        text-align: center;
        line-height: 160px;
        border-radius: 6px;
        i{
            font-size: 140px;
        }
    }
    .exampleSpan{
      color: #666;
      font-size: 12px;
      vertical-align: middle;
      line-height: 32px;
    }
    .tableOrPic{
      font-size:30px;
      vertical-align:middle;
      margin-left:10px;
      i{
        font-size: 30px;
        cursor: pointer;
      }
    }
    .resourcePicDiv{
      max-height: calc(100vh - 340px);
      overflow-y: auto;
      overflow-x: hidden;
      .resourcePic{
        height: 100%;
        height: 190px;
        margin-bottom: 10px;
        border: 1px solid #e2e3e5;
        .resourcePic_content{
          height: 160px;
        }
        .resourcePic_name{
          line-height: 30px;
          font-size: 14px;
          color: #0af;
          text-align: center;
        }
        .resourcePic_name:after{
          content: "";
          display: inline-block;
          clear: both;
        }
        .nullData{
          line-height: 160px;
          text-align: center;
          color: #ccc;
          font-size: 16px;
        }
      }
    }
  </style>
  <style>
    .resourceTab .el-table__body-wrapper {
        max-height: calc(100vh - 336px)!important;
        overflow-y: auto!important;
    }
  </style>