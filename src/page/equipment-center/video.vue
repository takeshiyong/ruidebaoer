<template>
    <div class="page video-container">
        <el-row>
            <el-col :lg="5" :md="7" :sm="9" :xs="24">
                <div class="left-div">
                    <div class="left-div-header">
                        <span>视频监控列表</span>
                        <el-tooltip effect="dark" content="重启easyNvr" placement="top" v-if="showBtn('restartEasyNvr')">
                            <el-button type="text" icon="othereocfonts eoc-loop" class="opearBtn ml10 mt-4" @click="restartOpe('1')"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="重启数据采集点" placement="top" v-if="showBtn('restartData')">
                            <el-button type="text" icon="el-icon-refresh" class="opearBtn ml10 mt-4" @click="restartOpe('2')"></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="areaDto.fId && showBtn('deleteControlCamera')" effect="dark" :content="delTitle" placement="top">
                            <el-button type="text" icon="el-icon-delete" class="opearBtn ml10 mt-4" @click="handleDel"></el-button>
                        </el-tooltip>
                        <el-tooltip v-if="areaDto.fId && showBtn('updateControlCamera')" effect="dark" :content="editTitle" placement="top">
                            <el-button type="text" icon="el-icon-edit" class="opearBtn mt-4" @click="handleEdit"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" :content="addTitle" placement="top" v-if="showBtn('insertControlCamera')">
                            <el-button type="text" icon="el-icon-plus" class="opearBtn mt-4" @click="handleAdd"></el-button>
                        </el-tooltip>
                    </div>
                    <div class="header-line"></div>
                    <div style="display: flex;marginTop: 8px;marginBottom: 5px;marginRight: 20px;marginLeft: 20px">
                        <el-input
                            style="flex: 1"
                            prefix-icon="el-icon-search"
                            placeholder="请输入摄像头名称"
                            clearable
                            v-model.trim="searchName">
                        </el-input>
                        <el-button type="primary" icon="el-icon-search" style="marginLeft: 5px" @click="getVideoArea"></el-button>
                    </div>
                    <div class="left-div-header" style="height: calc(100vh - 256px);overflowY: auto;width:calc(100% - 40px);paddingTop: 0px;paddingBottom: 0px;">
                        <tree :treeData="videoArr" @showScreen="pushScreen" @clickLocation="clickLocation" @showVideo="showVideoUrl" @toggleExpends="toggleExpends" @dragStart="dragStart" @dragEnd="treeDrag"/>
                    </div>
                </div>
            </el-col>
            <el-col :lg="19" :md="17" :sm="15" :xs="24">
                <div class="right">
                    <el-tabs v-model="tabsName" ref="tabs" type="border-card" style="overflowY: hidden;box-shadow: none;">
                        <el-tab-pane name="resource" label="视频展示资源管理">
                            <div v-if="tabsName ==='resource'" class="right-div">
                                <el-tooltip class="tip-icon" effect="dark" content="新建视频展示资源" placement="top"  v-if="showBtn('insertVideoResource')">
                                    <el-button type="text" icon="el-icon-plus" class="opearBtn mt-4" @click="createNewVideo"></el-button>
                                </el-tooltip>
                                <div class="content-body">
                                    <div class="content-video">
                                        <draggable @end="videoListEnd" @start="videoListSort" @add="dragEnd" class="content-video" v-model="videoList" :options="{group:{name: 'people', put: 'baz', pull: ['people']}, sort: true}">
                                            <div v-for="(item, key) in videoList" :key="item.fId" class="video-item">
                                                <div class="video-content">
                                                    <div v-if="(!item.fIsCycle && !item.fCurrentShowVido) || (item.fIsCycle && item.fChannels.length <= 0)" class="no-channel" >
                                                        <div>
                                                            <span>未设置摄像头</span>
                                                        </div>
                                                    </div>
                                                    <div v-else-if="!item.fIsCycle && item.fCurrentShowVido" style="width:100%;height: 93%;backgroundColor: #000">
                                                        <singlePlayVideo playType="rtmp" type="small" :channel="item.fCurrentShowVidoChanel" ></singlePlayVideo>
                                                    </div>
                                                    <div v-else-if="item.fIsCycle && item.fChannels.length > 0" style="width:100%;height: 93%;backgroundColor: #000">
                                                        <multPlayVideo type="small" :channels="item.fChannels" :cycTime="item.fCycleTime"></multPlayVideo>
                                                    </div>
                                                    <draggable v-if="dragChannel" class="drawer-drag" @add="dragEnd($event, key)" v-model="item.list" :options="{group:{name: 'people2', put: ['people1'], pull: ['people']}, sort: false}">
                                                        <div class="details-placeholder">
                                                            <span>将摄像头拖拽入此处</span>
                                                        </div>
                                                    </draggable>
                                                </div>
                                                <div class="sub-prompt">
                                                    <span :title="item.fResourcesName">{{item.fResourcesName}}</span>
                                                    <div class="btn-group">
                                                        <el-tooltip effect="dark" :content="item.fIsCycle?'循环播放':'非循环播放'" placement="top" v-if="showBtn('circulate')">
                                                            <i :class="`eocfont ${item.fIsCycle?'eoc-loop':'eoc-no-loop'}`"  style="fontSize: 12px"></i>
                                                        </el-tooltip>
                                                        <el-tooltip effect="dark" :content="'推送大屏'" placement="top" v-if="showBtn('pushVideo')">
                                                            <i class="eocfont eoc-iconcopy click" style="fontSize: 12px;marginLeft:5px" @click="pushScreen(item, 1)"/>
                                                        </el-tooltip>
                                                        <i v-if="item.fChannels.length > 0 && showBtn('blowUp')" class="eocfont eoc-quanping click" style="fontSize: 16px" @click="handleCommand('size', item)"/>
                                                        <i class="eocfont eoc-shezhi click" style="fontSize: 16px" @click="handleCommand('update', item)" v-if="showBtn('setting')"/>
                                                        <i class="el-icon-delete click" style="fontSize: 14px" @click="handleCommand('del', item)" v-if="showBtn('deleteVideoResource')"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </draggable>
                                    </div>
                                    <div class="block defaultPage" v-if="pageParam.sum > 0">
                                        <el-pagination
                                            id="page"
                                            @current-change="getCurrentPage($event, 'pageParam')"
                                            :current-page="pageParam.currentPage"
                                            layout="total, prev, pager, next, jumper"
                                            :total="pageParam.sum"
                                            :page-size="pageParam.pageSize"
                                        >
                                        </el-pagination>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane name="GIS" label="地图定位">
                            <div class="right-div">
                                <videoGIS ref="videoGIS"></videoGIS>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane name="Monitor" label="监控报警">
                            <div class="right-div">
                                <div>
                                    <el-form :inline="true" :model="searchRealParam" class="demo-form-inline">
                                        <el-form-item label="摄像头IP">
                                            <el-input v-model="searchRealParam.fIp" clearable placeholder="请填写摄像头IP" size="medium"></el-input>
                                        </el-form-item>
                                        <el-form-item label="监控报警类型">
                                            <el-select filterable v-model="searchRealParam.fType" clearable placeholder="请选择监控报警类型" style="width: 100%">
                                                <el-option
                                                v-for="item in alarmType"
                                                :key="item.fItemValue"
                                                :label="item.fItemName"
                                                :value="item.fItemValue">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="报警状态">
                                            <el-radio-group v-model="searchRealParam.fIsOpenAlarm">
                                                <el-radio label="">全部</el-radio>
                                                <el-radio :label="true">开启</el-radio>
                                                <el-radio :label="false">关闭</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click.stop="getMonitorList(1, true)" size="medium">搜索</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                 <el-table stripe :data="monitorList"  ref="singleTable" class="defaultTab" highlight-current-row :max-height="docHeight - 400">
                                    <el-table-column type="index" label="序号" width="60">
                                        <template slot-scope="scope">
                                            <span>{{ scope.$index + 1 + (searchParam.tempCurrent - 1) * searchParam.tempSize }}</span>
                                        </template>
                                    </el-table-column>    
                                    <el-table-column min-width="150" prop="fName" label="摄像头名称">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.fName || '--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="150" prop="fIp" label="摄像头IP">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.fIp || '--'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="160" prop="fAlarmTypeName" label="监控报警类型">
                                        <template slot-scope="scope">
                                            <span>{{ scope.row.fAlarmTypeName || '--' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column min-width="160" prop="fIsOpenAlarm" label="监控报警状态">
                                        <template slot-scope="scope">
                                            <el-switch
                                                @change="changeMonitorState(scope.row)"
                                                v-model="scope.row.fIsOpenAlarm"
                                                active-color="#13ce66"
                                                inactive-color="#ff4949"
                                                active-text="开启"
                                                inactive-text="关闭"
                                                :active-value="true"
                                                :inactive-value="false">
                                            </el-switch>
                                        </template>
                                    </el-table-column>
                                 </el-table>
                                 <div class="block  defaultPage" v-if="searchParam.sum > 0">
                                    <el-pagination id="page"  
                                    @size-change="monitorPageSize" 
                                    @current-change="monitorCurrentPage" 
                                    :current-page="searchParam.currentPage" 
                                    layout="total, sizes, prev, pager, next, jumper" 
                                    :total="searchParam.sum" 
                                    :page-size="searchParam.pageSize"
                                    :page-sizes="searchParam.pageSizes">
                                    </el-pagination>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane name="video" v-if="showVideoPlay" label="监控视频" style="height:100%">
                            <span slot="label">视频监控 <i class="el-icon-close" @click="clickCloseVideo"></i></span>
                            <div class="right-div" style="overflow: hidden">
                                <singlePlayVideo playType="flv" v-if="videoType==='single'" :fRealityChannel="fRealityChannel" :channel="playChannelId" isControl='true' :ptaControl="ptaControl" :nvrIP="fIp"></singlePlayVideo>
                                <operationVideo :keyss="operatDto.key" v-else @setCurrent="setCurrent" :defaultTime="defaultCycTime" :cycTime="operatDto.cycTimes" :resouceId="operatDto.resouceId" :isCyc="operatDto.isCyc" :currentShowId="operatDto.currentShowId"></operationVideo>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <sliderWindow :modal='videoVisible' :modalTitle="videoTitle" @closeModal="videoVisible = false">
            <div slot="custom-modal-content">
                <el-form ref="insert" :model="videoDto" :rules="videoRules" label-width="110px">
                    <el-row :gutter="8">
                        <el-col :span="12">
                            <el-form-item label="资源名称" prop="fResourcesName">
                                <el-input v-model="videoDto.fResourcesName" placeholder="请填写资源名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="循环时间(s)" prop="fCycleTime">
                                <el-input @blur="changCycTime" :disabled="!videoDto.fIsCycle" v-model="videoDto.fCycleTime" placeholder="请填写循环时间" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否可用" prop="fIsAvailable">
                                <el-switch
                                    style="marginTop: -2px"
                                    v-model="videoDto.fIsAvailable"
                                    active-text="是"
                                    inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否循环" ref="fIsCycle" prop="fIsCycle">
                                <el-switch
                                    @change="changCycle"
                                    style="marginTop: -2px"
                                    v-model="videoDto.fIsCycle"
                                    active-text="是"
                                    inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="videoTitle!=='新建视频展示资源'" :span="24">
                            <el-form-item label="视频链接">
                                <el-input v-model="videoDto.fUrl" readonly disabled>
                                    <div slot="suffix" class="icon-tip" @click="handlePaste">
                                        <el-tooltip effect="dark" :content="'粘贴'" placement="top">
                                            <i class="eocfont eoc-paste" style="color: #333"></i>
                                        </el-tooltip>
                                    </div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <div v-if="videoTitle!=='新建视频展示资源'" style="padding: 0 0 0 30px;boxSizing: border-box;width: 100%;position: relative">
                        <span class="current-text">当前显示</span>
                        <el-table ref="table" @select="selectVideo" highlight-current-row :data="cameraList" class="defaultTab" :max-height="docHeight-450" stripe>
                            <el-table-column
                                label="当前显示"
                                :selectable="selectable"
                                type="selection"
                                align="center"
                                width="80">
                            </el-table-column>
                            <el-table-column type="index" label="序号" width="60"></el-table-column>
                            <el-table-column prop="fName" label="通道名称" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.fName || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fProvider" label="提供商" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.fProvider || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fChannel" label="通道号" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.fChannel || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="fType" label="摄像头类型" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ channelType[scope.row.fType] || '--' }}</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="fEnable" label="是否可用" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.fEnable ? '是' : '否'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" min-width="50">
                                <template slot-scope="scope">
                                    <el-button type="text" @click="delCamera(scope.row) ">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div style="marginTop: 20px;marginLeft: 30px;">
                        <el-button type="primary" @click.stop="handleUpdate">保存</el-button>
                        <el-button @click.stop="resetForm('insert')">重置</el-button>
                    </div>
                </el-form>
            </div>
        </sliderWindow>
        <sliderWindow :modal='areaVisible' :modalTitle="areaTitle" @closeModal="areaVisible = false">
            <div slot="custom-modal-content">
                <el-form ref="areaRef" :model="areaDto" :rules="areaRules" label-width="110px">
                    <el-row :gutter="8">
                        <el-col :span="12">
                            <el-form-item label="生产场所" prop="fProductionPlaceId">
                                <productionplaceSelect :value="areaDto.fProductionPlaceId" @changePlace="changePlace"></productionplaceSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="区域名称" prop="fName">
                                <el-input v-model="areaDto.fName" placeholder="请填写区域名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item style='display:block;text-align:left;'>
                        <el-button type="primary" @click.stop="handleArea">保存</el-button>
                        <el-button @click.stop="resetForm('areaRef')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </sliderWindow>
        <sliderWindow :modal='channelVisible' :modalTitle="channelTitle" @closeModal="channelVisible = false">
            <div slot="custom-modal-content">
                <el-form ref="channelRef" :model="channelDto" :rules="channelRules" label-width="110px">
                    <el-row :gutter="8">
                        <el-col :span="12">
                            <el-form-item label="区域" title="区域" prop="bindTreeId">
                                <areaSelect :width="247.5" :value="channelDto.bindTreeId" @change="changeChannelArea"></areaSelect>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Ip地址" title="Ip地址"  prop="ip">
                                <!-- <el-input v-model="channelDto.ip" placeholder="请填写Ip地址"></el-input> -->
                                <el-select filterable v-model="channelDto.ip" clearable placeholder="请选择Ip地址" style="width: 100%">
                                    <el-option
                                    v-for="item in ipList"
                                    :key="item.ipAddress"
                                    :label="item.ipAddress"
                                    :value="item.ipAddress">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="摄像机名称" title="摄像机名称" prop="name">
                                <el-input v-model="channelDto.name" placeholder="请填写摄像机名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="通道号"  title="通道号" prop="channel">
                                <el-input v-model="channelDto.channel" placeholder="请填写通道号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="nvr真实通道" title="nvr真实通道" prop="realityChannel">
                                <el-input v-model="channelDto.realityChannel" placeholder="请填写nvr真实通道"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col v-if="!channelDto.thirdDeviceInfo" :span="12">
                            <el-form-item label="类型" title="摄像头类型" prop="type">
                                <channelType :value="channelDto.type" @change="changeChannelType" :width="247.5"></channelType>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="是否启用"   prop="enable">
                                <el-switch
                                    style="marginTop: -2px"
                                    v-model="channelDto.enable"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-text="是"
                                    inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="是否控制" prop="ptzControl">
                                <el-switch
                                    style="marginTop: -2px"
                                    v-model="channelDto.ptzControl"
                                    :active-value="1"
                                    :inactive-value="0"
                                    active-text="是"
                                    inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item style='display:block;text-align:left;'>
                        <el-button type="primary" @click.stop="handleChannel">保存</el-button>
                        <el-button @click.stop="resetForm('channelRef')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </sliderWindow>
        <sliderWindow :modal='outsideVisible' width="950px" :modalTitle="'对外展示资源配置'" @closeModal="outsideVisible = false">
            <div slot="custom-modal-content">
                <p style="marginBottom: 10px">{{showCurrentResource.type}} {{showCurrentResource.name}} </p>
                <zk-table
                    ref="table"
                    sum-text="sum"
                    index-text="#"
                    :data="resourceTree"
                    :columns="columns"
                    :stripe="props.stripe"
                    :border="props.border"
                    :show-header="props.showHeader"
                    :show-summary="props.showSummary"
                    :show-row-hover="props.showRowHover"
                    :show-index="props.showIndex"
                    :tree-type="props.treeType"
                    :is-fold="props.isFold"
                    :expand-type="props.expandType"
                    :selection-type="props.selectionType">
                </zk-table>
                <el-row style="marginTop: 10px">
                    <el-col>
                        <el-button type="primary" @click="saveResource">确定</el-button>
                    </el-col>
                </el-row>
            </div>
        </sliderWindow>
    </div>
</template>
<script>
    // api
    import { videoService,monitorService, cameraService, videoAreaService, channelService, resourceService } from '@/api/video';
    import { dictionaryitems } from '@/api/resource';
    import { nvrEdit } from '@/api/nvrEdit';
    import { collectRest } from '@/api/common';
    import { mapGetters } from 'vuex';
    import tree from './videoComponent/tree';
    // 侧滑组件
    import sliderWindow from "@/common/sliderWindow";
    // 删除组件
    import deleteModel from '@/common/deleteModel.vue'
    import areaSelect from '@/component/areaSelect.vue';
    import productionplaceSelect from '@/component/productionplaceSelect';
    import areaByProductionSelect from '@/component/areaByProductionSelect';
    import channelType from '@/component/channelType';
    import draggable from 'vuedraggable';
    import Sortable from 'sortablejs';
    import singlePlayVideo from './videoComponent/singlePlayVideo.vue';
    import multPlayVideo from './videoComponent/multPlayVideo.vue';
    import operationVideo from './videoComponent/operationVideo.vue';
    import videoGIS from '@/GIScomponent/videoGIS.vue';
    import _ from 'lodash';

    export default {
        data(){
            let validateInt = (rule, value, callback) => {
                if(value === "" || value === null || value === undefined){
                    callback('请填写循环时间');
                    return;
                }
                let reg = /^[1-9][0-9]*$/;
                if (!reg.test(value) && value*1 !== 0) {
                    callback(new Error('请填写正确的整数值'));
                } else {
                    callback();
                }
            };
            let checkIp = (rule, value, callback) => {
                let reg = /([1-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])){3}/;
                if (value && !reg.test(value)) {
                    callback(new Error('请填写正确的Ip地址'));
                } else {
                    callback();
                }
            };
            let checkPort = (rule, value, callback) => {
                if (value && (isNaN(value*1) || (!isNaN(value*1) && value*1 < 0))) {
                    callback(new Error('请填写正确的端口号'));
                } else {
                    callback();
                }
            };
            return {
                listLoading: false,
                monitorList: [],
                value5: true,
                searchParam: {
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10,20,30,40],
                    pageSize: 10,
                    tempCurrent: 1,
                    tempSize: 10,
                    fIp: "",
                    fIsOpenAlarm: "",
                    fType: "",
                },
                searchRealParam: {
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10,20,30,40],
                    pageSize: 10,
                    tempCurrent: 1,
                    tempSize: 10,
                    fIp: "",
                    fIsOpenAlarm: "",
                    fType: "",
                },
                props: {
                    stripe: false,
                    border: false,
                    showHeader: true,
                    showSummary: false,
                    showRowHover: true,
                    showIndex: false,
                    treeType: true,
                    isFold: true,
                    expandType: false,
                    selectionType: true,
                },
                data: [
                ],
                columns: [
                    {
                        label: '资源名称',
                        prop: 'fName',
                        minWidth: '200px',
                        type: 'template',
                        template: 'likes',
                    },
                    {
                        label: '资源类型',
                        prop: 'fType',
                        minWidth: '50px',
                    },
                    {
                        label: '资源URL',
                        prop: 'fCurrentShowUrl',
                    },
                ],
                channelType: {
                    1: '高点',
                    2: '移动作业',
                    3: '无人机',
                    4: '普通摄像头'
                },
                searchName: '',
                areaDto: {
                    fProductionPlaceId: '',
                    fName: ''
                },
                channelTitle: '',
                channelVisible: false,
                delTitle: '',
                areaVisible: false,
                cameraList: [],
                areaTitle: '',
                cameraVisible: false,
                channelRules: {
                    bindTreeId: [
                        { required: true, message: '请选择区域', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '请填写摄像机名称', trigger: 'blur' },
                    ],
                    channel: [
                        { required: true, message: '请填写通道号', trigger: 'blur' },
                    ],
                    realityChannel: [
                        { required: true, message: '请填写Nvr真实通道', trigger: 'blur' },
                    ],
                    ip: [
                        { required: true, message: '请选择Ip地址', trigger: 'change' },
                    ],
                    port: [
                        { validator: checkPort, trigger: 'blur'},
                    ],
                    protocol: [
                        { required: true, message: '请填写摄像机接入协议', trigger: 'blur' },
                    ],
                    rtsp: [
                        { required: true, message: '请填写rtsp地址', trigger: 'blur' },
                    ],
                    allowMonitoringAlarm: [
                        {required: true, message: '请选择能否监控报警', trigger: 'blur' }
                    ]
                },
                videoRules:  {
                    fResourcesName: [
                        { required: true, message: '请填写资源名称', trigger: 'blur' },
                        { min: 0, max: 30, message: '长度在不能超过30个字符', trigger: 'blur' }
                    ],
                    fIsCycle: [
                        { required: true, message: '请选择是否循环', trigger: 'blur' },
                    ],
                    fIsAvailable: [
                        { required: true, message: '请选择是否可用', trigger: 'blur' },
                    ],
                    fCycleTime: [
                        { validator: validateInt, trigger: 'blur' }
                    ]
                },
                areaRules: {
                    fProductionPlaceId: [
                        { required: true, message: '请选择生产场所', trigger: 'blur' },
                    ],
                    fName: [
                        { required: true, message: '请填写区域名称', trigger: 'blur' },
                        { min: 0, max: 30, message: '长度在不能超过30个字符', trigger: 'blur' }
                    ],
                },
                value2: true,
                videoVisible: false,
                // 部门树
                videoArr: [],
                condition1: {},
                currentItem: {
                    type: ''
                },
                addTitle: '新建区域', // 新建按钮标题
                editTitle: '编辑区域', // 编辑按钮标题
                delTitle: '删除区域', // 删除按钮标题
                pageParam: {
                    currentPage: 1,
                    sum: 0,
                    pageSize: 12
                },
                videoList: [],
                videoTitle: '',
                videoDto: {
                    fIsCycle: false,
                    fIsAvailable: false,
                },
                videoParam: {
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                dragType: '',
                currentShowVido: '', // 当前播放
                moveObj: {},
                channelDto: {
                    fProductionPlaceId: '',
                    bindTreeId: '',
                    enable: false,
                    ptzControl: false,
                    allowMonitoringAlarm: false,
                    alarmType: ''
                },
                tempChannel: {},
                updateId: '',
                showVideoPlay: false,
                tabsName: 'resource',
                playChannelId: '',
                fRealityChannel: '',
                fIp: "",
                ptaControl: "",
                videoType: '',
                operatDto: {
                    cycTimes: 0,
                    resouceId: '',
                    isCyc: false,
                    currentShowId: '',
                    key: 0
                },
                defaultCycTime: 0,
                tmpCycTime: 0,
                minCycTime: 0,
                dragFlag: false,
                tempTypeId: '',
                dragChannel: false,
                updateType: '',
                outsideVisible: false,
                resourceTree: [],
                showCurrentResource: {
                    name: '',
                    type: ''
                },
                ipList: [],
                currentResourceVideoIp: '',
                alarmType: []
            }
        },
        components: {
            sliderWindow, tree, draggable, productionplaceSelect, areaSelect,
            areaByProductionSelect, channelType,singlePlayVideo, multPlayVideo,
            operationVideo, videoGIS
        },
        computed: {
            ...mapGetters(["docHeight"])
        },
        mounted: function(){
            // 初始化
            this.init();
            this.getDefaultTime();
            window.addEventListener('message', this.receiveData);
            // 获取系统监控类型
            this.getAlarmType();
            // 获取监控报警列表
            this.getMonitorList(1);
        },
        destroyed() {
            window.removeEventListener('message', this.receiveData);
        },
        methods: {
            // 修改监控报警状态
            async changeMonitorState(row) {
                if (this.listLoading) {
                    return;
                }
                let isOpen = !row.fIsOpenAlarm
                let res = null;
                this.listLoading = true;
                if (isOpen) {
                    res = await monitorService.close(row.fId);
                } else {
                    res = await monitorService.start(row.fId);
                }
                this.listLoading = false;
                if (res.success) {
                    this.$message.success(res.msg);
                    this.getVideoArea();
                } else {
                    row.fIsOpenAlarm = isOpen
                    this.$message.warning(res.msg);
                }
            },
            monitorPageSize(val) {
                this.searchParam.pageSize = val;
                this.getMonitorList(1);
            },
            monitorCurrentPage(val) {
                this.searchParam.currentPage = val;
                this.getMonitorList();
            },
            // 获取监控报警列表
            async getMonitorList(page, flag) {
                if (page) {
                    this.searchParam.currentPage = page;
                }
                if (flag) {
                    this.searchParam = this.searchRealParam;
                }
                console.log(this.searchParam);
                const res = await monitorService.getList(this.searchParam);
                console.log('getMonitor', res);
                if (res.success) {
                    this.searchParam.sum = res.obj.itemTotal;
                    this.searchParam.tempCurrent = res.obj.pageCurrent;
                    this.searchParam.tempSize = res.obj.pageSize;
                    this.monitorList = res.obj.items;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            async getAlarmType() {
                const res= await dictionaryitems.typepym('video_alarm_type')
                console.log('res', res);
                if (res.success) {
                    if (res.obj) {
                        this.alarmType = res.obj;
                    }
                }
            },
            /**
             * 查询IP
             */
            async getIp() {
                let res = await nvrEdit.selectAll();
                if(res.success){
                    if(this.channelTitle == '新建摄像头' || this.channelTitle == '编辑摄像头'){
                        this.channelVisible = true;
                    }
                    this.ipList = res.obj;
                } else{
                    this.$message.warning(res.msg);
                    this.ipList = [];
                }
            },
            // 推送上大屏
            pushScreen(data, type) {
   //console.log(data);
                this.outsideVisible = true;
                this.getResourceTree();
                this.showCurrentResource = {
                    name: type ? data.fResourcesName : data.fName,
                    type: type ? '视频展示资源:' : '摄像头:',
                    id: type ? data.fId : data.fId,
                }

            },
            async saveResource() {
                let checkArr = this.$refs.table.getCheckedProp();
                let tempArr = [];
                for (let item of this.resourceTree) {
                    tempArr.push({type: 'group', id: item.fId});
                    for (let obj of item.resourceList) {
                        tempArr.push({id: obj.fId});
                    }
                }
                let ids = [];
                for (let i of checkArr) {
                    if (tempArr[i].type !== 'group') {
                        ids.push(tempArr[i].id);
                    }
                }
                let param = {
                    fResourceIds: ids,
                    fType: this.showCurrentResource.type === '视频展示资源:' ? 2 : 1,
                    fVideoResourceId: this.showCurrentResource.id
                };
                const res = await resourceService.multiScreen(param);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.outsideVisible = false;
                } else {
                    this.$message.warning(res.msg);
                }
            },
            async getResourceTree() {
                const res = await resourceService.getTree();
                if (res.success) {
                    for (let item of res.obj) {
                        item.fType = '--';
                        item.fCurrentShowUrl = '--';
                        item.fName = item.fGroupName;
                        item.children = item.resourceList;
                        if (item.children) {
                            for (let obj of item.children) {
                                switch(obj.fType) {
                                    case 1 :
                                    obj.fType = '视频资源';
                                    break;
                                    case 2 :
                                    obj.fType = '视频展示资源';
                                    break;
                                    case 3 :
                                    obj.fType = '第三方资源';
                                    break;
                                    default:
                                    obj.fType = '--';
                                }
                                obj.fCurrentShowUrl = obj.fCurrentShowUrl || '--'
                            }
                        }
                    }
                    this.resourceTree = res.obj;
       //console.log('this.resourceTree',this.resourceTree)
                } else {
                    this.$message.warning(res.msg);
                }
            },
            receiveData(event) {
                let data = event.data;
                if (data === 'videoSuccess') {
                    this.getVideoArea();
                }
            },
            treeDrag() {
                this.dragChannel = false;
            },
            setCurrent() {
                this.getVideoList();
            },
            // 获取默认时间
            async getDefaultTime() {
                const res = await dictionaryitems.typepym('spbfcs');
                if (res.success) {
                    for(let item of res.obj) {
                        if (item.fPym === 'spbfzxxhsj') {
                            this.minCycTime = item.fItemValue * 1;
                            let validateInt = (rule, value, callback) => {
                                if(value === "" || value === null || value === undefined){
                                    callback('请填写循环时间');
                                    return;
                                }
                                let reg = /^[1-9][0-9]*$/;
                                if (!reg.test(value) && value*1 !== 0) {
                                    callback(new Error('请填写正确的整数值'));
                                } else if (value*1 < this.minCycTime) {
                                    callback(new Error(`循环时间不能小于${this.minCycTime}秒`));
                                } else {
                                    callback();
                                }
                            };
                            this.videoRules.fCycleTime = [
                                { validator: validateInt, trigger: 'blur' }
                            ];
                        }
                        if (item.fPym === 'spbfmrxhsj') {
                            this.defaultCycTime = item.fItemValue * 1;
                        }
                    }
                }
            },
            // 关闭视频监控页面
            clickCloseVideo() {
                this.showVideoPlay = false;
                setTimeout(()=>{
                    this.tabsName = 'resource';
                }, 200)

            },
            showVideoUrl(url) {
                // let routeData2 = this.$router.resolve({
                //     path: "/videoPlay",
                // });
                // window.open(routeData2.href, '视频监控', "height=360, width=640, toolbar=yes, location=yes, directories=no, status=no, menubar=yes, scrollbars=yes, resizable=no, copyhistory=yes");
                this.playChannelId = url.fChannel;
                this.fRealityChannel = url.fRealityChannel;
                this.ptaControl = url.fPtzControl;
                this.fIp = url.fIp;

                this.showVideoPlay = true;
                this.tabsName = 'video';
                //console.log('路径：', this.playChannelId, url);
                // this.$nextTick( () => {
                    console.log('路径：', url);

                // });
                this.videoType = 'single';
            },
            showVideoBySize(item) {
                this.showVideoPlay = true;
                this.tabsName = 'video';
                this.operatDto = {
                    cycTimes: item.fCycleTime,
                    resouceId: item.fId,
                    isCyc: item.fIsCycle,
                    currentShowId: item.fCurrentShowVido,
                    key: new Date().getTime()
                }
                this.videoType = 'mual';
            },
            // 修改是否循环状态
            changCycle(value) {
                if (!value) {
                    this.videoDto.fCycleTime=0;
                    this.videoRules.fCycleTime = [

                    ];
                } else {
                    this.videoDto.fCycleTime=this.tmpCycTime?this.tmpCycTime:this.defaultCycTime;
                    let validateInt = (rule, value, callback) => {
                        if(value === "" || value === null || value === undefined){
                            callback('请填写循环时间');
                            return;
                        }
                        let reg = /^[1-9][0-9]*$/;
                        if (!reg.test(value) && value*1 !== 0) {
                            callback(new Error('请填写正确的整数值'));
                        } else if (value*1 < this.minCycTime) {
                            callback(new Error(`循环时间不能小于${this.minCycTime}秒`));
                        } else {
                            callback();
                        }
                    };
                    this.videoRules.fCycleTime = [
                        { validator: validateInt, trigger: 'blur' }
                    ];
                }
                this.$refs.insert.clearValidate();
            },
            changCycTime(e) {
                let value = e.target.value;
                if (value && !isNaN(value*1)) {
                    this.tmpCycTime = e.target.value;
                }
            },
            changeChannelArea(val) {
                this.channelDto.bindTreeId = val;
            },
            rowDrop() {
                this.$nextTick(()=>{
                    const tbody = document.querySelector('.el-table__body-wrapper tbody')
                    if (!tbody) {
                        return;
                    }
                    const _this = this
                    Sortable.create(tbody, {
                        onEnd({ newIndex, oldIndex }) {
                            const currRow = _this.cameraList.splice(oldIndex, 1)[0]
                            _this.cameraList.splice(newIndex, 0, currRow);
                            if (newIndex === oldIndex) {
                                return;
                            }
                            _this.updateTableSort();
                        }
                    })
                })
            },
            // 摄像头修改&新建 数据获取
            handleChannel() {
                this.$refs.channelRef.validate(async (valid) => {
                    if (valid) {
                        if (this.channelTitle === '编辑摄像头') {
                            this.updateChannel();
                        }
                        if (this.channelTitle === '新建摄像头') {
                            this.createChannel();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                });
            },
            // 摄像头新建
            async createChannel() {
                const res = await channelService.insert(this.channelDto);
                if (res.success) {

                    this.$message.success(res.msg);
                    this.channelVisible = false;
                    this.getVideoArea();
                    this.$refs.videoGIS.refreshData();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 摄像头修改
            async updateChannel() {
                const res = await channelService.update(this.channelDto);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.channelVisible = false;
                    this.updateId = this.channelDto.id;
                    this.getVideoArea(this.channelDto.id);

                } else {
                    this.$message.warning(res.msg);
                }
            },
            async getVideoArea(id, isDel) {
                let firstArr = [];
                let secondArr = [];
                let currentObj = {first: -1, second: -1, third: -1};
                for (let [index, item] of this.videoArr.entries()) {
                    if (item.expend) {
                       firstArr.push(index);
                    }
                    if (item.current) {
                        currentObj.first = index;
                    }
                    if ((item.fVideoAreaList && item.fVideoAreaList.length <= 0) || !item.fVideoAreaList) {
                        continue;
                    }
                    for (let [idx, obj] of item.fVideoAreaList.entries()) {
                        if (obj.expend) {
                            secondArr.push(idx);
                        }
                        if (obj.current) {
                            currentObj.first = index;
                            currentObj.second = idx;
                        }
                        if ((obj.fVideoChannelConfigList && obj.fVideoChannelConfigList.length <= 0) || !obj.fVideoChannelConfigList) {
                            continue;
                        }
                        for (let [key, val] of obj.fVideoChannelConfigList.entries()) {
                            if (val.current) {
                                currentObj.first = index;
                                currentObj.second = idx;
                                currentObj.third = key;
                            }
                            val.treeData = [val];
                        }
                    }
                }
                const res = videoAreaService.select({
                    fVideoName: this.searchName
                });
                const res1 = videoAreaService.selectByType({
                    fName: this.searchName,
                    fType: 2
                }); // 移动作业
                const res2 = videoAreaService.selectByType({
                    fName: this.searchName,
                    fType: 3
                }); // 无人机
                const res3 = videoAreaService.selectByType({
                    fName: this.searchName,
                    fType: 1
                }); // 高点
                const resall = await Promise.all([res, res1, res2, res3]);
                let arr = [];
                if (resall[1].success) {
                    arr = resall[1].obj;
                    for (let val of arr) {
                        if (this.updateType === 'channel' && val.fId === this.channelDto.id) {
               //console.log('val', val)
                            this.tempChannel = val;
                        }
                        val.treeData = [val];
                    }
                } else {
                    this.$message.warning(resall[1].msg);
                }
                let arr1 = [];
                if (resall[2].success) {
                    arr1 = resall[2].obj;
                    for (let val of arr1) {
                        if (this.updateType === 'channel' && val.fId === this.channelDto.id) {
                            this.tempChannel = val;
                        }
                        val.treeData = [val];
                    }
                } else {
                    this.$message.warning(resall[2].msg);
                }
                let arr2 = [];
                if (resall[3].success) {
                    arr2 = resall[3].obj;
                    for (let val of arr2) {
                        if (this.updateType === 'channel' && val.fId === this.channelDto.id) {
                            this.tempChannel = val;
                        }
                        val.treeData = [val];
                    }
                } else {
                    this.$message.warning(resall[3].msg);
                }
                let arrMove = {fName: '移动作业设备', fId: new Date().getTime(), cantEdit: true, fNum: arr.length, fVideoAreaList: arr, fcode: '2'};
                let noMove = {fName: '无人机设备', fId: new Date().getTime()+10, cantEdit: true, fNum: arr1.length, fVideoAreaList: arr1, fcode: '3'};
                let highMove = {fName: '高点设备', fId: new Date().getTime()+20, cantEdit: true, fNum: arr2.length, fVideoAreaList: arr2, fcode: '1'};
                if (resall[0].success) {
                    let arr1 = resall[0].obj
                    if (arrMove.fVideoAreaList.length !== 0 || (this.searchName.length === 0 && arrMove.fVideoAreaList.length === 0)) {
                        arr1.unshift(arrMove);
                    }
                     if (noMove.fVideoAreaList.length !== 0 || (this.searchName.length === 0 && noMove.fVideoAreaList.length === 0)) {
                        arr1.unshift(noMove);
                    }
                    if (highMove.fVideoAreaList.length !== 0 || (this.searchName.length === 0 && highMove.fVideoAreaList.length === 0)) {
                        arr1.unshift(highMove);
                    }
                    this.videoArr = arr1;
                    this.handleVideoConfigList(id, currentObj, firstArr, secondArr, isDel);
                } else {
                    this.$message.warning(resall[0].msg);
                }
            },
            handleVideoConfigList(id, currentObj, firstArr, secondArr, isDel) {
                if (currentObj.third != -1) {
                    if (this.videoArr[currentObj.first] && this.videoArr[currentObj.first].fVideoAreaList[currentObj.second] && this.videoArr[currentObj.first].fVideoAreaList[currentObj.second].fVideoChannelConfigList[currentObj.third]) {
                        this.videoArr[currentObj.first].fVideoAreaList[currentObj.second].fVideoChannelConfigList[currentObj.third].current = true;
                    }
                }
                if (currentObj.third == -1 && currentObj.second != -1) {
                    if (this.videoArr[currentObj.first] && this.videoArr[currentObj.first].fVideoAreaList[currentObj.second]) {
                        this.videoArr[currentObj.first].fVideoAreaList[currentObj.second].current = true;
                    }
                }
                if (currentObj.third == -1 && currentObj.second == -1 && currentObj.first != -1) {
                    if (this.videoArr[currentObj.first]) {
                        this.videoArr[currentObj.first].current = true;
                    }
                }
                for (let [index, item] of this.videoArr.entries()) {

                    if (firstArr.indexOf(index) != -1) {
                        item.expend = true;
                    }
                    if ((item.fVideoAreaList && item.fVideoAreaList.length <= 0) || !item.fVideoAreaList) {
                        continue;
                    }
                    for (let [idx, obj] of item.fVideoAreaList.entries()) {
                        if (this.updateType === 'area' && obj.fId === this.areaDto.fId) {
                            this.areaDto = obj;
                        }
                        if (secondArr.indexOf(idx) != -1) {
                            obj.expend = true;
                        }
                        if ((obj.fVideoChannelConfigList && obj.fVideoChannelConfigList.length <= 0) || !obj.fVideoChannelConfigList) {
                            continue;
                        }
                        for (let [key, val] of obj.fVideoChannelConfigList.entries()) {
                            if (this.updateType === 'channel' && val.fId === this.channelDto.id) {
                                this.tempChannel = val;
                            }
                            if (val.id === this.updateId) {
                                val.current = true;
                                console.log('val', val);
                   //console.log('val.fPtzControl', val.fPtzControl);
                                this.channelDto = {
                                    ...this.channelDto,
                                    bindTreeId: val.fBindTreeId,
                                    channel: val.fChannel,
                                    enable: val.fEnable,
                                    id: val.fId,
                                    ip: val.fIp,
                                    name: val.fName,
                                    onvif: val.fOnvif,
                                    password: val.fPassword,
                                    port: val.fPort,
                                    protocol: val.fProtocol,
                                    provider: val.fProvider,
                                    ptzControl: val.fPtzControl?1:0,
                                    realityChannel: val.fRealityChannel,
                                    rtsp: val.fRtsp,
                                    type: val.fType,
                                    userName: val.fUserName,
                                    thirdDeviceInfo: val.thirdDeviceInfo,
                                    alarmType: val.alarmType
                                };
                            }
                            val.treeData = [val];
                        }
                    }
                }
            },
            // 变更摄像头顺序
            async updateTableSort() {
                const res = await cameraService.updateSort({
                    list: this.cameraList.map((data, key)=>({fId: data.fId, fSort: key + 1}))
                });
                if (res.success) {
                    this.$message.success('摄像头排序修改成功!');
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // ======1.页面初始化
            // 1.1初始化
            init(){
                // this.getIp();
                // 获取视频展示资源第一页数据
                this.getVideoList();
                this.getVideoArea();
            },
            selectable(row, index) {
                return !this.videoDto.fIsCycle;
            },
            videoListSort() {
                this.dragType = 'videoList';
                this.dragFlag = true;
            },
            dragStart(item) {
                this.dragType = 'cameraList';
                this.moveObj = item[0];
                this.dragChannel = true;
            },
            dragEnd(event, key) {
                if (this.dragType === 'cameraList') {
                    this.videoListInsertCamera(event.newIndex, key);
                }
                this.dragChannel = false;
            },
            videoListEnd(item, news) {
                this.dragFlag = false;
                if (this.dragType === 'videoList' && item.newIndex !== item.oldIndex) {
                    this.updateVideoList()
                    return;
                }
            },
            // 添加摄像头进视频资源管理
            async videoListInsertCamera(index, key) {
                const res = await cameraService.insert({
                    fVideoResourcesId: this.videoList[key].fId,
                    fVideoId: this.moveObj.fId
                });
                if (res.success) {
                    this.$message.success(res.msg);
                    this.getVideoList();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 修改视频展示列表数据顺序
            async updateVideoList() {
                const res = await videoService.updateSort({
                    list: this.videoList.map((data, key)=>({
                        fId: data.fId,
                        fSort: this.pageParam.currentPage * (key+1)
                    }))
                });
                if (res.success) {
                    this.$message.success('视频展示资源顺序修改成功！');
                } else {
                    this.$message.warning(res.msg);
                }
            },
            handleDel() {
                if (this.delTitle === '删除区域') {
                    this.$confirm(`您将删除该区域信息, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const res = await videoAreaService.delete(this.areaDto.fId);
                        if (res.success) {
                            this.$message.success('删除成功！');
                            this.getVideoArea('', true);
                        } else {
                            this.$message.warning(res.msg);
                        }
                    });
                    return;
                }
                if (this.delTitle === '删除摄像头') {
                    this.$confirm(`您将删除该摄像头信息, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        const res = await channelService.delete(this.currentItem.fId);
                        if (res.success) {
                            this.$message.success('删除成功！');
                            this.getVideoArea('', true);
                            this.$refs.videoGIS.refreshData();
                        } else {
                            this.$message.warning(res.msg);
                        }
                    });
                }
            },
            changePlace(e) {
                this.areaDto.fProductionPlaceId = e;
            },
            handleAdd() {
                if (this.addTitle === '新建摄像头') {
                    this.getIp();
                    this.channelTitle = '新建摄像头';
                    this.channelDto = {
                        fProductionPlaceId: this.areaDto.fProductionPlaceId,
                        fName: '',
                        channel: '',
                        enable: false,
                        id: '',
                        ip: '',
                        name: '',
                        onvif: '',
                        password: '',
                        port: '',
                        protocol: '',
                        provider: '',
                        ptzControl: '',
                        realityChannel: '',
                        rtsp: '',
                        type: this.tempTypeId || '1',
                        userName: '',
                        bindTreeId: this.areaDto.fProductionPlaceId ? this.areaDto.fId : '',
                        enable: false,
                        ptzControl: false,
                        allowMonitoringAlarm: false,
                        alarmType: ''
                    };
                    return;
                }
                this.areaVisible = true;
                this.areaTitle = '新建区域';
            },
            // 点击修改内容
            handleCommand(type, item) {
                if (type === 'del') {
                    this.delVideoList(item);
                } else if (type === 'update') {
                    this.videoTitle = '编辑视频展示资源';
                    this.videoDto = {
                        ...item,
                        fCycleTime: !item.fIsCycle?0:item.fCycleTime
                    };
                    this.videoVisible = true;
                    this.currentShowVido = item.fCurrentShowVido;
                    this.currentResourceVideoIp = item.fCurrentShowVido;
                    this.getVideoListById(item.fId);
                    this.rowDrop();
                    this.tmpCycTime = item.fCycleTime;
                    if (this.videoDto.fIsCycle) {
                        let validateInt = (rule, value, callback) => {
                            if(value === "" || value === null || value === undefined){
                                callback('请填写循环时间');
                                return;
                            }
                            let reg = /^[1-9][0-9]*$/;
                            if (!reg.test(value) && value*1 !== 0) {
                                callback(new Error('请填写正确的整数值'));
                            } else if (value*1 < this.minCycTime) {
                                callback(new Error(`循环时间不能小于${this.minCycTime}秒`));
                            } else {
                                callback();
                            }
                        };
                        this.videoRules.fCycleTime = [
                            { validator: validateInt, trigger: 'blur' }
                        ];
                    } else {
                        this.videoRules.fCycleTime = [];
                    }
                } else if (type === 'size') {
                    this.showVideoBySize(item);
                }
            },
            selectVideo(selection, row) {
                let arr = selection.filter((data) => (data.fId === row.fId));
                this.$refs.table.clearSelection();
                if (arr.length > 0) {
                    this.currentShowVido = row.fVideoId;
                    this.$refs.table.toggleRowSelection(arr[0], true);
                } else {
                    this.currentShowVido = null;
                }
            },
            delCamera(row) {
                this.$confirm(`您将删除该摄像头信息, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await cameraService.delete(row.fId);
                    if (res.success) {
                        this.$message.success('删除成功！');
                        this.getVideoListById(this.videoDto.fId);
                    } else {
                        this.$message.warning(res.msg);
                    }
                });
            },
            async getVideoListById(fid) {
                const res = await cameraService.select(fid);
                if (res.success) {
                    this.cameraList = res.obj;
                    let arr = this.cameraList.filter((data)=>(data.fVideoId === this.currentShowVido));
                    this.$nextTick(()=>{
                        if (arr.length > 0) {
                            this.$refs.table.toggleRowSelection(arr[0], true);
                        }
                    })
                } else {
                    this.$message.warning(res.msg);
                }
            },
            // 打开新建视频展示资源页面
            createNewVideo() {
                this.videoVisible = true;
                this.videoTitle = '新建视频展示资源';
                this.videoDto = {
                    fIsCycle: false,
                    fIsAvailable: false,
                    fResourcesName: '',
                    fCycleTime: 0
                };
                this.videoRules.fCycleTime = [];
            },
            handleUpdate() {
                if (this.videoTitle === '新建视频展示资源') {
                    this.insertVideo();
                    return;
                }
                if (this.videoTitle === '编辑视频展示资源') {
                    this.$refs.insert.validate(async (valid) => {
                        if (valid) {
                            let fn = () => {
                                this.videoVisible = false;
                                this.getVideoList();
                            };
                            this.updateVideo(fn)
                        } else {
                            this.$message.warning('必填项输入为空或错误！');
                            return false;
                        }
                    });
                }
            },
            // 编辑区域
            handleArea() {
                if (this.areaTitle === '新建区域') {
                    this.insertArea();
                    return;
                }
                if (this.areaTitle === '编辑区域') {
                    this.areaUpdate();
                }
            },
            handlePaste() {
                this.copy(this.videoDto.fUrl);
            },
            copy(str){
                let textArea = document.createElement("textarea")
                textArea.style.position = 'fixed'
                textArea.style.top = 0
                textArea.style.left = 0
                textArea.style.width = '2em'
                textArea.style.height = '2em'
                textArea.style.padding = 0
                textArea.style.border = 'none'
                textArea.style.outline = 'none'
                textArea.style.boxShadow = 'none'
                textArea.style.background = 'transparent'
                textArea.value = str
                document.body.appendChild(textArea)
                textArea.select()
                try {
                    document.execCommand('copy');
                    this.$message.success('粘贴成功');
                } catch (err) {
                    this.$message.success('粘贴失败,可手动粘贴');
                }
                document.body.removeChild(textArea)
            },
            insertArea() {
                this.$refs.areaRef.validate(async (valid) => {
                    if (valid) {
                        const res = await videoAreaService.insert(this.areaDto);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.areaVisible = false;
                            this.resetForm('areaRef');
                            this.getVideoArea();
                        } else {
                            this.$message.warning(res.msg);
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                });
            },
            areaUpdate() {
                this.$refs.areaRef.validate(async (valid) => {
                    if (valid) {
                        this.areaDto.fVideoChannelConfigList && delete this.areaDto.fVideoChannelConfigList;
                        const res = await videoAreaService.update(this.areaDto);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.areaVisible = false;
                            this.updateId = this.areaDto.fId;
                            this.resetForm('areaRef');
                            this.getVideoArea();
                        } else {
                            this.$message.warning(res.msg);
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                });
            },
            // 更新视频展示资源数据
            async updateVideo(fn) {
                const res = await videoService.update({...this.videoDto, fCurrentShowVido: this.currentShowVido});
                if (res.success) {
                    fn();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            insertVideo() {
                this.$refs.insert.validate(async (valid) => {
                    if (valid) {
                        const res = await videoService.insert(this.videoDto);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.videoVisible = false;
                            this.resetForm('insert');
                            this.pageParam.currentPage = 1;
                            this.getVideoList();
                            // this.
                        } else {
                            this.$message.warning(res.msg);
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                });
            },
            getCurrentPage(page, type) {
                this[type].currentPage = page;
                if (type === 'pageParam') {
                    this.getVideoList();
                } else if (type === 'videoParam') {
                    this.getVideoListById(this.videoDto.fId);
                }
            },
            async getVideoList() {
                const res = await videoService.select(this.pageParam);
                if (res.success) {
                    this.videoList = res.obj.items;
                    this.pageParam.sum = res.obj.itemTotal;
                    this.$forceUpdate();
                } else {
                    this.$message.warning(res.msg);
                }
            },
            delVideoList(row) {
                this.$confirm(`您将删除这条视频展示资源, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await videoService.delete(row.fId);
                    if (res.success) {
                        this.$message.success('删除成功！');
                        if (this.videoList.length === 1) {
                            this.pageParam.currentPage = 1;
                        }
                        this.getVideoList();
                    } else {
                        this.$message.warning(res.msg);
                    }
                });
            },
            handleSizeChange(size, type) {
                this[type].currentPage = 1;
                this[type].pageSize = size;
                if (type === 'pageParam') {
                    this.getVideoList();
                } else if (type === 'videoParam') {
                    this.getVideoListById(this.videoDto.fId);
                }
            },
            handleEdit() {
                if (this.editTitle === '编辑区域') {
                    this.areaVisible = true;
                    this.areaTitle = '编辑区域';
                    return;
                }
                if (this.editTitle === '编辑摄像头') {
                    this.getIp();
                    this.channelTitle = '编辑摄像头';
                    this.channelDto = {
                        ...this.channelDto,
                        bindTreeId: this.tempChannel.fBindTreeId,
                        channel: this.tempChannel.fChannel,
                        enable: this.tempChannel.fEnable,
                        id: this.tempChannel.fId,
                        ip: this.tempChannel.fIp,
                        name: this.tempChannel.fName,
                        onvif: this.tempChannel.fOnvif,
                        password: this.tempChannel.fPassword,
                        port: this.tempChannel.fPort,
                        protocol: this.tempChannel.fProtocol,
                        provider: this.tempChannel.fProvider,
                        ptzControl: this.tempChannel.fPtzControl?1:0,
                        realityChannel: this.tempChannel.fRealityChannel,
                        rtsp: this.tempChannel.fRtsp,
                        type: this.tempChannel.fType,
                        userName: this.tempChannel.fUserName,
                        fProductionPlaceId: this.tempChannel.fProductionPlaceId,
                        thirdDeviceInfo: this.tempChannel.thirdDeviceInfo,
                        allowMonitoringAlarm: this.tempChannel.fAllowMonitoringAlarm ||false,
                        alarmType: this.tempChannel.fAlarmType
                    };
                    return;
                }
            },
            toggleExpends(item, index, idx, i) {
                //console.log('item', item);
                // 递归处理展开
                console.log(item);
                if (idx != null) {
                    this.areaDto = {...item};
                    this.editTitle = '编辑区域';
                    this.delTitle = '删除区域';
                } else {
                    this.areaDto = {
                        fProductionPlaceId: '',
                        fName: ''
                    };
                }
                if (item.fVideoAreaList && !item.cantEdit) {
                    this.areaDto = {
                        fProductionPlaceId: item.fId,
                        fName: ""
                    };
                }
                this.currentItem = item;
                if (item.fProductionPlaceId) {
                    this.channelDto = {
                        ...this.channelDto,
                        fProductionPlaceId: item.fProductionPlaceId,
                        bindTreeId: item.fId,
                    };
                }
                if (item.fBindTreeId) {
                    this.areaDto = {
                        ...this.areaDto,
                        fId: item.fBindTreeId,
                    };
                }
                if (item.fChannel) {
                    this.tempChannel = item;
                }
                if (item.fName === '高点设备' || item.fName === '无人机设备' || item.fName === '移动作业设备') {
                    this.tempTypeId = item.fcode;
                } else {
                    this.tempTypeId = '4';
                }
                this.judgeAddTitle(item);
                this.recursion(this.videoArr, item);
                if (i != null) {
                    this.videoArr[index].fVideoAreaList[idx].fVideoChannelConfigList[i].current = true;
                    this.$forceUpdate();
                    return;
                }
                if (idx != null) {
                    this.videoArr[index].fVideoAreaList[idx].current = true;
                    this.videoArr[index].fVideoAreaList[idx].expend = !this.videoArr[index].fVideoAreaList[idx].expend;
                    this.$forceUpdate();
                    return;
                }
                this.videoArr[index].current = true;
                this.videoArr[index].expend = !this.videoArr[index].expend;
                this.$forceUpdate();
            },
            recursion(arr, obj) {
                for (let item of arr) {
                    item.current = false;
                    for (let obj of item.fVideoAreaList) {
                        obj.current = false;
                        if (obj.fVideoChannelConfigList) {
                            for (let val of obj.fVideoChannelConfigList) {
                                val.current = false;
                            }
                        }
                    }
                }
            },
            judgeAddTitle(item) {
                if (item.fChannel) {
                    // 摄像头数据
                    this.addTitle = '新建摄像头';
                    this.editTitle = '编辑摄像头';
                    this.delTitle = '删除摄像头';
                    this.updateType = 'channel';
                } else if (item.fProductionPlaceId) {
                    // 区域数据
                    this.addTitle = '新建摄像头';
                    this.editTitle = '编辑区域';
                    this.delTitle = '删除区域';
                    this.updateType = 'area';
                } else {
                    // 生产场所数据
                    this.addTitle = '新建区域';
                    this.editTitle = '';
                    this.delTitle = '';
                    this.updateType = 'place';
                }
                if (item.fName === '高点设备' || item.fName === '无人机设备' || item.fName === '移动作业设备') {
                    this.addTitle = '新建摄像头';
                    this.editTitle = '';
                    this.delTitle = '';
                }
            },
            resetForm(name) {
                this.$refs[name].resetFields();
                if(name == 'insert'){
                    this.$refs.table && this.$refs.table.clearSelection();
                    this.currentShowVido = this.currentResourceVideoIp;
                    let arr = this.cameraList.filter((data)=>(data.fVideoId === this.currentShowVido));
                    this.$nextTick(()=>{
                        if (arr.length > 0) {
                            this.$refs.table.toggleRowSelection(arr[0], true);
                        }
                    })
                }
            },
            changeChannelPlace(val) {
                if (!val || this.channelDto.fProductionPlaceId !== val) {
                    this.channelDto.bindTreeId = '';
                }
                this.channelDto.fProductionPlaceId = val;
            },
            changeChannelType(val) {
                this.channelDto.fProductionPlaceId = "";
                this.channelDto.bindTreeId = "";
                this.channelDto.type = val;
            },
            switchPlayShow(key, flag) {
                this.videoList[key].flag = flag;
                this.$forceUpdate();
            },
            // 点击定位图标 设置定位信息或修改定位信息
            clickLocation(data) {
                this.$refs.videoGIS.getGIScontent(data);
                this.tabsName = 'GIS';
            },

            //重启
            restartOpe(flag) {
                let tipContents = flag == '1' ? '是否重启"easyNvr"?' : '是否重启"数据采集点"?';
                this.$confirm(tipContents, '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                    }).then(async() => {
                        let res = null;
                        if(flag == '1'){
                            /**
                            * easyNvr通道重新配置标志
                            */
                            res = await collectRest.restart('EASY_NVR');
                        }else if(flag == '2'){
                            /**
                            * 重启数据采集服务器
                            */
                            res = await collectRest.restart('VIDEO_SDK');
                        }
                        if(res.success){
                            this.$message.success(res.msg);
                        } else{
                            this.$message.warning(res.msg);
                        }
                    }).catch(() => {
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .ml10 {
        margin-left: 10px;
    }
    .mt-4 {
        margin-top: -4px;
    }
    .page {
        padding: 0px 10px;
    }
    .left-div {
        background:rgba(255,255,255,1);
        // box-shadow:5px 6px 6px rgba(110,110,110,0.14);
        height: calc(100vh - 150px) ;
        border-right: 1px solid #f1f1f1;
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
    .right {
        background:rgba(255,255,255,1);
        height: calc(100vh - 170px);
        padding: 10px 20px;
    }
    .btn-search {
        background-color: rgba(47,53,65,1)!important;
        color: #FFF!important;
        border: 0px!important;
        i {
            font-size: 12px!important;
            margin-right: 4px;
        }
    }
    .right-search {
        margin-top: 20px;
    }
    .header-line {
        margin: 0px 20px;
        margin-top: -6px;
        height: 1px;
        border-bottom: 1px solid rgba(226,227,229,1);
    }
    .pointStyle {
        font-size: 24px;
        color: #1E1E1E!important;
        vertical-align: middle;
        margin-left: 4px;
        margin-right: 10px;
    }
    .content-body {
        width: 100%;
        height: calc(100vh - 210px);
        padding: 0px 1px;
        box-sizing: border-box;
        .content-video {
            width: 100%;
            max-height: calc(100vh - 290px);
            overflow-y: auto;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-content: flex-start;
            box-sizing: border-box;
        }
        .video-item {
            width: 401px;
            // border: 1px solid #c9c9c9;
            height: 351px;
            margin-right: 8px;
            margin-bottom: 9px;
            position: relative;
            display: flex;
            flex-direction: column;
            .no-channel {
                width: 100%;
                height: calc(100% - 3px);
                display: flex;
                div {
                    width: 100%;
                    height: calc(100% - 25px);
                    background-color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    span {
                        color: #fff;
                        font-size: 14px;
                    }
                }
            }
            .video-content {
                flex: 1;
                .drawer-drag {
                    z-index: 90;
                    position: absolute;
                    bottom: -47px;
                    left: -1px;
                    width: 100%;
                    height: 45px;
                    background-color: #F7F7F7;
                    border: 1px solid #ccc;
                    // box-shadow: 5px 6px 6px rgba(110,110,110,0.14);
                    .details-placeholder {
                        font-size: 16px;
                        display: inline-block;
                        line-height: 45px;
                        span {
                            color: #bababa;
                            position: absolute;
                            top: 0;
                            left: 10px;
                        }
                    }
                }
            }
            .sub-prompt {
                display: flex;
                width: 100%;
                height: 25px;
                background: #2F3031;
                justify-content: space-between;
                align-items: center;
                padding: 0 10px;
                box-sizing: border-box;
                position: absolute;
                bottom: 3px;
                span {
                    display: inline-block;
                    color: #fff;
                    font-size: 12px;
                    flex: 1;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .btn-group {
                    width: 35%;
                    height: 100%;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;

                    i {
                        color: #fff;
                        margin-left: 4px;
                        cursor: pointer;
                    }
                    i:nth(1) {
                        cursor: none;
                    }
                    .click:hover {
                        color: #3EAEFC;
                    }
                }
            }
        }
        .video-detail {
            width: 24%;
            border: 1px solid #c9c9c9;
            box-shadow: 1px 1px 2px #888888;

            margin-right: 10px;
            margin-bottom: 10px;
            position: relative;
            .suggest {
                height: 35px;
                width: 100%;
                border-top: 1px solid #c9c9c9;
                box-sizing: border-box;
                padding: 5px 10px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: absolute;
                bottom: 0;
                .video-title {
                    font-size: 14px;
                    line-height: 35px;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 55%;
                }
                .icon-menu {
                    display: inline-block;
                    padding: 5px 0 5px 5px;
                    font-size: 25px;
                    color: #4e4747;
                    cursor: pointer;
                }
            }
            .loop-tip {
                width: 100%;
                position: absolute;
                left: 0;
                top: 0;
                height: 40px;
                background-color: rgba(0, 0, 0, 0.4);
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 15px;
                box-sizing: border-box;
                i {
                    cursor: pointer;
                    color: #fff;
                }
                span {
                    font-size: 24px;
                    color: #fff;
                }
            }

            .details {
                height: calc(100% - 45px);
                width: 100%;
                img {
                    width: 100%;
                    height: 100%;
                }
                .eoc-bofang {
                    display: none;
                }
                .drag-details {
                    & + div {
                        z-index: 80;
                        position: absolute;
                        top: 38px;
                        width: 100%;
                        height: calc(100% - 85px);
                        background-color: rgba($color: #333, $alpha: 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        span {
                            color: #fff;
                            font-size: 14px;
                        }
                    }
                }


            }
            .drag-details {
                position: absolute;
                top: 20px;
                z-index: 20;
            }

        }
    }

    .right-div {
        background:rgba(255,255,255,1);
        height: calc(100vh - 250px) ;
        position: relative;
        .tip-icon {
            position: absolute;
            right: 0px;
            top: -46px;
            z-index: 999;
        }
        .all-user {
            .all-user-description {
                background: #F0F2FA;
                padding: 10px;
                .description {
                    font-size: 12px;
                    line-height: 20px;
                    color: rgba(84,84,84,1);
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    word-break:break-all;
                    word-wrap:break-word;
                }
            }
            .all-user-opear {
                margin-top: 10px;
                .opear-search-container {
                    display: inline-block;
                    line-height: 32px;
                    padding-left: 10px;
                }
                .opear-btn {
                    background-color: rgba(47,53,65,1)!important;
                    color: #FFF!important;
                    border: 0px!important;
                    i {
                        font-size: 12px!important;
                        margin-right: 4px;
                    }
                }
            }
            .opear-line-container {
                height: 1px;
                border: none;
                border-bottom: 1px solid #e2e3e5;
                margin-bottom: 10px;
            }
            .all-user-container {
                margin-top: 20px;
                margin-right: -20px;
                padding-right: 20px;
                height: calc(100vh - 253px);
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
        .dep-user {
            .dep-user-description {
                background: #F0F2FA;
                padding: 10px;
                .description {
                    font-size: 12px;
                    line-height: 20px;
                    color: rgba(84,84,84,1);
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    word-break:break-all;
                    word-wrap:break-word;
                }
            }
            .depInfor {
                background: #F0F2FA;
                margin: 10px 0px;
                padding: 10px;
                .remark {
                    font-size: 14px;
                    line-height: 28px;
                    color: rgba(84,84,84,1);
                    letter-spacing: 2px;
                    word-break:break-all;
                    word-wrap:break-word;
                    .remark-title {
                        color: rgba(84,84,84,1);
                        font-size: 17px;
                    }
                }
            }
            .dep-user-opear {
                margin-top: 10px;
                .opear-search-container {
                    display: inline-block;
                    line-height: 32px;
                    padding-left: 10px;
                }
                .opear-btn {
                    background-color: rgba(47,53,65,1)!important;
                    color: #FFF!important;
                    border: 0px!important;
                    i {
                        font-size: 12px!important;
                        margin-right: 4px;
                    }
                }
            }
            .opear-line-container {
                height: 1px;
                border: none;
                border-bottom: 1px solid #e2e3e5;
                margin-bottom: 10px;
            }
            .dep-user-container {
                margin-top: 20px;
                margin-right: -20px;
                padding-right: 20px;
                height: calc(100vh - 253px);
                overflow-y: auto;
                overflow-x: hidden;
            }
        }
    }
    .current-text {
        position: absolute;
        display: inline-block;
        width: 80px;
        height: 30px;
        background-color: #F6F6F6;
        z-index: 999;
        font-size: 15px;
        color: #535353;
        font-weight: bolder;
        top: 9px;
        left: 40px;
    }
    .video-tip {
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .icon-tip {
        cursor: pointer;
        i {
            color: #333;
        }
    }
</style>
<style>
    .zk-table--level-2-cell {
        margin-left: 12px!important;
    }
    /* 重写组件中的样式 */
    .allUserTab .el-table__body-wrapper {
        max-height: calc(100vh - 380px)!important;
        overflow-y: auto!important;
    }
    .depUserTab .el-table__body-wrapper {
        max-height: calc(100vh - 420px)!important;
        overflow-y: auto!important;
    }
    .treeMenu {
        border-right: none!important;
    }
    .treeMenu .el-menu-item {
        padding-left: 20px!important;
        height: 42px!important;
        line-height: 42px!important;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .treeMenu .el-menu-item:focus, .treeMenu .el-menu-item:hover {
        background-color: rgba(47,53,65,1)!important;
        color: rgba(255,255,255,1)!important;
    }
    .treeMenu .el-menu-item.is-active {
        background-color: rgba(47,53,65,1)!important;
        color: rgba(255,255,255,1)!important;
    }
    .staffTab .el-table__body-wrapper {
        max-height: calc(100vh - 440px)!important;
        overflow-y: auto!important;
    }
    .custom-tree-node {
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
    .dept-tree .el-tree-node__expand-icon {
        display: none!important;
    }
    .dept-tree .el-tree-node__content {
        height: 42px!important;
        line-height: 42px!important;
    }
    .dept-tree .el-tree-node__children .dvIcon-point{
        display: none!important;
    }
    .dept-tree .el-tree-node.is-current>.el-tree-node__content {
        background-color: rgba(47,53,65,1)!important;
        color: rgba(255,255,255,1)!important;
    }
    .search-form .el-form-item--small.el-form-item {
        margin-bottom: 10px!important;
    }
    .video-container .el-tabs__content {
        overflow: visible!important;
        height: calc(100vh - 250px);
    }
    .othereocfonts{
        font-family: "eocfont" !important;
        font-size: 13px;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>