/*
* @Author: 元实
* @Date:   2019-08-26
* @Description: '设备信息，设备定位'
*/

<template>
    <div class="equipment-page">
        <el-tabs v-model="tabName" type="border-card" @tab-click="handleMapTabClick">
            <!-- 设备信息列表 -->
            <el-tab-pane name="table" label="设备信息类表">
                <div class="container">
                    <!-- 设备信息页面头部-->
                    <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                        <el-row>
                            <el-form-item label="设备名称" label-width="100px">
                                <el-input
                                    v-model="selectionParams.equipmentName"
                                    autocomplete="off"
                                    placeholder="请输入设备名称"
                                    clearable
                                    class="input-item longer">
                                </el-input>
                            </el-form-item>

                            <el-form-item label="设备类型" label-width="100px">
                                <el-select
                                    v-model="selectionParams.equipmentType"
                                    placeholder="设备类型"
                                    clearable
                                    class="select longer">
                                    <el-option label="所有设备类型" value=""></el-option>
                                    <el-option
                                        v-for="type in equipmentTypes"
                                        :key="type.fId"
                                        :label="type.fTypeName"
                                        :value="type.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="设备级别" label-width="100px">
                                <el-select
                                    v-model="selectionParams.equipmentLevel"
                                    placeholder="设备级别"
                                    clearable
                                    class="select longer">
                                    <el-option label="所有设备级别" value=""></el-option>
                                    <el-option
                                        v-for="level in equipmentLevels"
                                        :key="level.fId"
                                        :label="level.fLevelName"
                                        :value="level.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="设备区域" label-width="100px">
                                <el-select
                                    v-model="selectionParams.equipmentArea"
                                    placeholder="设备区域"
                                    clearable
                                    class="select longer">
                                    <el-option label="所有设备区域" value=""></el-option>
                                    <el-option
                                        v-for="area in areas"
                                        :key="area.fId"
                                        :label="area.fAreaName"
                                        :value="area.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="设备状态" label-width="100px">
                                <el-select
                                    v-model="selectionParams.equipmentState"
                                    placeholder="设备状态"
                                    clearable
                                    class="select longer">
                                    <el-option label="所有设备状态" value=""></el-option>
                                    <el-option
                                        label="开启"
                                        value="1">
                                    </el-option>
                                    <el-option
                                        label="关闭"
                                        value="0">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                                <el-button type="primary" icon="el-icon-plus" @click.stop="addEquipmentRecord" size="small">新增</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <!-- 设备信息页面头部-->

                    <!--设备信息表格-->
                    <el-table
                        :data="equipmentData"
                        class="defaultTab"
                        highlight-current-row
                        stripe
                        style="width: 100%"
                        max-height="250vh">

                        <el-table-column
                            type="index"
                            label="序号"
                            width="60"
                            :index="indexRecord">
                        </el-table-column>

                        <el-table-column
                            label="设备编号"
                            prop="fEquipmentModel">
                        </el-table-column>

                        <el-table-column
                            label="设备名称"
                            prop="fEquipmentName">
                        </el-table-column>

                        <el-table-column
                            label="设备类型"
                            prop="typeName">
                        </el-table-column>

                        <el-table-column
                            label="设备级别"
                            prop="levelName">
                        </el-table-column>

                        <el-table-column
                            label="设备区域"
                            prop="areaName">
                        </el-table-column>

                        <el-table-column
                            label="设备状态"
                            prop="state">
                            <template slot-scope="scope">
                               {{  showEquipmentState(scope.row.fStart) }}
                            </template>
                        </el-table-column>

                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="downqcode(scope.row)" size="small">二维码</el-button>
                                <el-button type="text" @click="editEquipmentInfo(scope.row)" size="small">编辑</el-button>
                                <el-button type="text" @click="showEquipmentDetails(scope.row)" size="small">详情</el-button>
                                <el-button type="text" @click="deleteEquipmentInfo(scope.row)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--设备信息表格-->

                    <!-- 分页-->
                    <div class="block defaultPage" v-if="paginator.pagesQnty > 0">
                        <el-pagination
                            id="page"
                            @size-change="changePageSize"
                            @current-change="goToPage"
                            :current-page.sync="paginator.currentPage"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="paginator.totalRecordsQnty"
                            :page-count="paginator.pagesQnty"
                            :page-sizes="paginator.pageSizes"
                            :page-size="paginator.pageSize">
                        </el-pagination>
                    </div>
                    <!-- 分页-->

                    <!-- 设备信息新增弹框-->
                    <TheDialog
                        :modal="isAddFormShown"
                        :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                        @closeModal="closeDialog">
                        <template v-slot:custom-modal-content>
                            <el-form
                                ref="addEquipForm"
                                class="demo-form-inline input-form"
                                :model="addEquipmentDataForm"
                                :rules="addEquipmentRules">
                                <el-row type="flex" justify="space-between">
                                    <el-form-item
                                        label="设备名称"
                                        label-width="100px"
                                        prop="fEquipmentName">
                                        <el-input
                                            v-model="addEquipmentDataForm.fEquipmentName"
                                            autocomplete="off"
                                            placeholder="请输入设备名称"
                                            clearable
                                            class="input-item longer">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item
                                        label="设备编号"
                                        label-width="100px"
                                        :model="addEquipmentDataForm"
                                        prop="fEquipmentModel">
                                        <el-input
                                            v-model="addEquipmentDataForm.fEquipmentModel"
                                            autocomplete="off"
                                            placeholder="请输入设备编号"
                                            clearable
                                            class="input-item longer">
                                        </el-input>
                                    </el-form-item>
                                </el-row>

                                <el-row type="flex" justify="space-between">
                                    <el-form-item
                                        label="设备类型"
                                        label-width="100px"
                                        :model="addEquipmentDataForm"
                                        prop="fEquipmentTypeInfoId">
                                        <el-select
                                            v-model="addEquipmentDataForm.fEquipmentTypeInfoId"
                                            placeholder="设备类型"
                                            clearable
                                            class="select longer"
                                            @change="getSpecialEquipmentParams">
                                            <el-option
                                                v-for="type in equipmentTypes"
                                                :key="type.fId"
                                                :label="type.fTypeName"
                                                :value="type.fId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>

                                    <el-form-item
                                        label="设备区域"
                                        label-width="100px"
                                        :model="addEquipmentDataForm"
                                        prop="fAreaId">
                                        <el-select
                                            v-model="addEquipmentDataForm.fAreaId"
                                            placeholder="设备区域"
                                            clearable
                                            class="select longer">
                                            <el-option
                                                v-for="area in areas"
                                                :key="area.fId"
                                                :label="area.fAreaName"
                                                :value="area.fId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-row>

                                <el-row type="flex" justify="space-between">
                                    <el-form-item
                                        label="设备级别"
                                        label-width="100px"
                                        props="equipLevel"
                                        :model="addEquipmentDataForm"
                                        prop="fLevelId">
                                        <el-select
                                            v-model="addEquipmentDataForm.fLevelId"
                                            placeholder="设备级别"
                                            clearable
                                            class="select longer">
                                            <el-option
                                                v-for="level in equipmentLevels"
                                                :key="level.fId"
                                                :label="level.fLevelName"
                                                :value="level.fId">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-row>

                                <!-- 照片 -->
                                <el-container>
                                    <el-header class="dialog-sub-header">
                                        <i class="mandatory-field">*</i>照片
                                    </el-header>

                                    <el-row class="margin-top15">
                                        <el-upload
                                            accept="image/jpeg, image/gif, image/png, image/jpg"
                                            ref="upload"
                                            :show-file-list="false"
                                            :action="fileAPI + '/ikingtech/oss/api/upload/v1'"
                                            :on-success="handleUploadPhotoSuccess"
                                            class="image-uploader">
                                            <img
                                                v-if="addEquipmentDataForm.fImageUrl"
                                                :src="previewUrl + addEquipmentDataForm.fImageUrl"
                                                class="image-small">
                                            <i v-else class="el-icon-plus image-uploader-icon"></i>
                                        </el-upload>
                                    </el-row>
                                </el-container>
                                <!-- 照片 -->

                                <!-- 定位 -->
                                <el-container>
                                    <el-header class="dialog-sub-header">
                                        设备位置
                                    </el-header>

                                    <el-row class="margin-top15">
                                        <el-form-item
                                            label="设备位置"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            prop="locationDescription">
                                            <el-input
                                                v-model="addEquipmentDataForm.locationDescription"
                                                autocomplete="off"
                                                placeholder="请输入设备位置描述"
                                                clearable
                                                class="input-item longer">
                                            </el-input>
                                        </el-form-item>
                                    </el-row>

                                    <el-row class="margin-top15">
                                        <div class="map-edit-wrapper">
                                            <el-row type="flex" justify="end" class="map-buttons">
                                                <el-select
                                                    v-model="mapCity"
                                                    placeholder="城市"
                                                    clearable
                                                    @change="changeLocation">
                                                    <el-option label="西安" value="西安"></el-option>
                                                    <el-option label="北京" value="北京"></el-option>
                                                </el-select>
                                            </el-row>

                                            <div id="equip-map" class="map"></div>
                                        </div>
                                    </el-row>
                                </el-container>
                                <!-- 定位 -->

                                <!-- 设备属性 -->
                                <el-container>
                                    <el-header class="dialog-sub-header">设备属性</el-header>
                                    <el-row class="margin-top15" type="flex" justify="space-between">
                                        <el-form-item
                                            label="设备型号"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            prop="fEquipmentType">
                                            <el-select
                                                v-model="addEquipmentDataForm.fEquipmentType"
                                                placeholder="请选择设备型号"
                                                clearable
                                                class="input-item">
                                                <el-option
                                                    v-for="model in allEquipModels"
                                                    :key="model.fId"
                                                    :label="model.fEquipmentType"
                                                    :value="model.fId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                        <el-form-item
                                            label="额定功率"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            prop="ratedPower">
                                            <el-input
                                                type="number"
                                                v-model="addEquipmentDataForm.fRatedPower"
                                                autocomplete="off"
                                                placeholder="请输入额定功率"
                                                clearable
                                                class="input-item longer">
                                            </el-input>
                                        </el-form-item>
                                    </el-row>

                                    <el-row class="margin-top15" type="flex" justify="space-between">
                                        <el-form-item
                                            label="生产能力"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            prop="productionCapacity">
                                            <el-input
                                                type="number"
                                                v-model="addEquipmentDataForm.fProductionCapacity"
                                                autocomplete="off"
                                                placeholder="请输入生产能力"
                                                clearable
                                                class="input-item longer">
                                            </el-input>
                                        </el-form-item>

                                        <el-form-item
                                            label="生产日期"
                                            label-width="100px"
                                            :model="addEquipmentDataForm">
                                            <el-date-picker
                                                size="medium"
                                                v-model="addEquipmentDataForm.fProductionDate"
                                                type="date"
                                                class="date-picker"
                                                placeholder="生产日期"
                                                value-format="yyyy-MM-dd"
                                                clearable>
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-row>

                                    <el-row
                                        v-if="addEquipmentDataForm.infoList &&  addEquipmentDataForm.infoList.length"
                                        class="margin-top15"
                                        type="flex"
                                        justify="space-between">
                                        <el-form-item
                                            v-for="(param, index) in addEquipmentDataForm.infoList"
                                            :label="param.attributeName"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            :prop="param.attributeName"
                                            :key="param.fId">
                                            <el-input
                                                v-model="addEquipmentDataForm.infoList[index].fValue"
                                                autocomplete="off"
                                                :placeholder="`请输入${param.attributeName},  ${param.fUnit || param.unit}`"
                                                clearable
                                                class="input-item longer">
                                            </el-input>
                                        </el-form-item>
                                    </el-row>
                                </el-container>
                                <!-- 设备属性 -->

                                <!-- 生产广商 -->
                                <el-container>
                                    <el-header class="dialog-sub-header">生产广商</el-header>
                                    <el-row class="margin-top15">
                                        <el-form-item
                                            label="制造商名称"
                                            label-width="100px"
                                            :model="addEquipmentDataForm"
                                            prop="fManufacturerId">
                                            <el-select
                                                v-model="addEquipmentDataForm.fManufacturerId"
                                                placeholder="制造商名称"
                                                clearable
                                                class="select longer"
                                                @change="selectManufacturer">
                                                <el-option
                                                    v-for="manufacturer in manufacturers"
                                                    :key="manufacturer.fId"
                                                    :label="manufacturer.fManufacturerName"
                                                    :value="manufacturer.fId">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>

                                        <el-row v-if="addEquipmentDataForm.manufacturerPhone" class="margin-top15">
                                            <span class="">制造商电话：</span><span class="">{{ addEquipmentDataForm.manufacturerPhone }}</span>
                                        </el-row>

                                        <el-row v-if="addEquipmentDataForm.manufacturerAddress" class="margin-top15">
                                            <span class="">制造商地址：</span><span class="">{{ addEquipmentDataForm.manufacturerAddress }}</span>
                                        </el-row>
                                    </el-row>
                                </el-container>
                                <!-- 生产广商 -->

                                <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                                    <el-button type="primary" @click.stop="submitEquipmentData">确定</el-button>
                                    <el-button @click.stop="resetForm('addEquipForm')">重置</el-button>
                                </el-row>
                            </el-form>
                        </template>
                    </TheDialog>
                    <!-- 设备维修计划新增弹框-->

                    <!-- 设备信息详情 -->
                    <el-dialog
                        title="设备信息详情"
                        :visible.sync="isDetailsShown"
                        top="30px"
                        width="600px">
                        <div class="details-wrapper">
                            <!-- 详情列表 -->
                            <table class="details-table">
                                <thead>
                                <tr>
                                    <th colspan="2">设备详情</th>
                                </tr>
                                </thead>

                                <tbody>
                                    <tr>
                                        <td>设备照片</td>
                                        <td>
                                            <el-image
                                                :src="previewUrl + equipmentDetails.fImageUrl"
                                                @click="handleImagePreview"
                                                class="preview-image">
                                            </el-image>

                                            <!-- 预览附件 -->
                                            <el-dialog :visible.sync="dialogImageVisible" append-to-body>
                                                <img width="100%" :src="dialogFileUrl" alt="">
                                            </el-dialog>
                                            <!-- 预览附件 -->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备编号</td>
                                        <td>{{ equipmentDetails.fEquipmentModel }}</td>
                                    </tr>

                                    <tr>
                                        <td>设备名称</td>
                                        <td>{{ equipmentDetails.fEquipmentName }}</td>
                                    </tr>

                                    <tr>
                                        <td>设备类型</td>
                                        <td>{{ getEquipTypeName(equipmentDetails.fEquipmentTypeInfoId) }}</td>
                                    </tr>

                                    <tr>
                                        <td>设备型号</td>
                                        <td>
                                            {{ equipmentDetails.fEquipmentType }}
                                            <el-button type="text" @click="showModelParams" size="big">查看参数</el-button>

                                            <!-- 预览附件 -->
                                            <el-dialog
                                                title="设备型号详情"
                                                :visible.sync="dialogModelParamsVisible"
                                                append-to-body
                                                width="600px">
                                                <table class="details-table">
                                                    <thead>
                                                    <tr>
                                                        <th colspan="2">设备型号参数</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                    <tr>
                                                        <td>额定功率</td>
                                                        <td>{{ equipmentDetails.fRatedPower != undefined ?  equipmentDetails.fRatedPower : '--' }}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>生产能力</td>
                                                        <td>{{ equipmentDetails.fProductionCapacity != undefined ? equipmentDetails.fProductionCapacity : '--' }}</td>
                                                    </tr>

                                                    <tr v-for="param in equipmentDetails.infoList">
                                                        <td>{{ param.attributeName }}</td>
                                                        <td>{{ param.fValue ? param.fValue + param.unit : '--' }}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </el-dialog>
                                            <!-- 预览附件 -->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>生产日期</td>
                                        <td>
                                            {{  equipmentDetails.fProductionDate || '--'  }}
                                            <!--<el-button type="text" @click="" size="big">查看参数</el-button>-->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>制造商</td>
                                        <td>
                                            {{ equipmentDetails.manufacturerName }}
                                            <el-button type="text" @click="showManufacturerInfo" size="big">查看详情</el-button>

                                            <!-- 预览附件 -->
                                            <el-dialog
                                                title="制造商详情"
                                                :visible.sync="dialogManufacturerVisible"
                                                append-to-body
                                                width="600px">
                                                <table class="details-table">
                                                    <thead>
                                                    <tr>
                                                        <th colspan="2">制造商详情</th>
                                                    </tr>
                                                    </thead>

                                                    <tbody>
                                                        <tr>
                                                            <td>制造商电话</td>
                                                            <td>{{ equipmentDetails.manufacturerPhone != undefined ?  equipmentDetails.manufacturerPhone : '--' }}</td>
                                                        </tr>

                                                        <tr>
                                                            <td>制造商地址</td>
                                                            <td>{{ equipmentDetails.manufacturerAddress != undefined ? equipmentDetails.manufacturerAddress : '--' }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </el-dialog>
                                            <!-- 预览附件 -->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>运行时间 (h)</td>
                                        <td>
                                            {{  equipmentDetails.runtime  }}
                                            <!--<el-button type="text" @click="" size="big">查看参数</el-button>-->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备区域</td>
                                        <td>{{getAreaName(equipmentDetails.fAreaId) }}</td>
                                    </tr>

                                    <tr v-if="isLocationDetailsShown">
                                        <td>定位信息</td>
                                        <td>
                                            {{ equipmentDetails.fLocationDescription ||  '' }}
                                            <el-button type="text" @click="showLocationMap" size="big">查看地图</el-button>

                                            <!-- 预览附件 -->
                                            <el-dialog :visible.sync="dialogMapVisible" append-to-body>
                                                <div id="details-map" class="map"></div>
                                            </el-dialog>
                                            <!-- 预览附件 -->
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备维修</td>
                                        <td>
                                            0次
                                            <el-button type="text" @click="" size="big">查看详情</el-button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备保养</td>
                                        <td>
                                            0次
                                            <el-button type="text" @click="" size="big">查看详情</el-button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备巡检</td>
                                        <td>
                                            0次
                                            <el-button type="text" @click="" size="big">查看详情</el-button>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>设备报警</td>
                                        <td>
                                            0次
                                            <el-button type="text" @click="" size="big">查看详情</el-button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- 详情列表 -->
                        </div>
                    </el-dialog>
                    <!-- 设备信息详情 -->
                </div>
            </el-tab-pane>
            <!-- 设备信息列表 -->

            <!-- 设备定位地图 -->
            <el-tab-pane name="map" label="设备定位">
                <div class="container">
                    <div id="allequip-map" class="map"></div>
                </div>
            </el-tab-pane>
            <!-- 设备定位地图 -->
        </el-tabs>
        <!-- 查看我二维码 -->
        <el-dialog :show-close="true" title="设备信息" :visible.sync="dialogVisible" append-to-body width="800px">
               <div  ref="courseInfo" >
               <table  border="1" width="100%" cellspacing="0" cellpadding="20">
                   <tr>
                     <td class="tdbody">设备名称：</td>
                     <td  colspan="2" class="tdpding">{{equentdetail.name}}</td>
                   </tr>
                   <tr>
                     <td class="tdbody">设备型号：</td>
                     <td colspan="2" class="tdpding">{{equentdetail.cate}}</td>
                   </tr>
                   <tr>
                     <td class="tdbody">安装地点：</td>
                     <td class="tdpding">{{equentdetail.area}}</td>
                     <td rowspan="3" style="width:130px;"><div id="qrcode" ref="qrcode"></div><!-- 创建一个div，并设置id为qrcode --></td>
                   </tr>
                   <tr>
                     <td class="tdbody">设备级别：</td>
                     <td class="tdpding">{{equentdetail.dengji}}</td>
                   </tr>
                   <tr>
                     <td class="tdbody">设备编号：</td>
                     <td class="tdpding">{{equentdetail.number}}</td>
                   </tr>
               </table>
               </div>
              <el-button type="primary" @click="downcode" style="margin-left: 90%;margin-top: 15px;">下载</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import { EquipmentService } from '@/api/equipment' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件
    import  BMap from 'BMap';  //百度地图api
    import QRCode from 'qrcodejs2'  // 引入qrcode
    import html2canvas from "html2canvas"
    export default  {
        components: {
            TheDialog,
        },

        data() {
            return {
                tabName: 'table',   //标签, table - 设备信息列表，map - 地图
                dialogVisible:false,//二维码弹层
                equmentid:'',
                equipmentData: [],  //设备信息
                equipment: [],   //设备
                equipmentsCoords: [], //所有的设备定位
                equipmentTypes: [],  //设备类型
                equipmentLevels: [], //设备级别
                allEquipModels: [], //所有设备型号
                areas: [], //区域
                manufacturers: [], //生产广商

                selectionParams: { //搜索参数
                    equipmentName: '', //设备名称
                    fEquipmentModel: '',   //设备
                    equipmentType: '', //设备类型
                    equipmentLevel: '',  //设备级别
                    equipmentArea: '', //设备区域
                    equipmentState: null //设备状态
                },

                //新增设备信息form -->>
                isAddFormShown: false,        //显示新增/编辑设备信息的弹框
                addFormTitle: '新增设备信息',   //新增设备信息弹框的抬头
                isEditMode: false,  //编辑状态
                editFormTitle: '编辑设备信息', //编辑设备信息弹框的抬头

                mapCity: '', //在地图上显示的城市

                addEquipmentDataForm: {
                    fEquipmentName: '',    //设备名称
                    fEquipmentType: '', //设备型号
                    fEquipmentTypeInfoId: '', //设备类型
                    fEquipmentModel: '', //设备编号
                    fLevelId: '', //设备级别id
                    fAreaId: '', //区域id
                    fImageUrl: '', //图片url
                    locationData: '', //设备定位信息
                    fRatedPower: null, //额定功率，
                    fProductionCapacity: null, //生产能力,
                    fProductionDate: '', //生产日期,
                    fManufacturerId: '', //生产广商id,
                    manufacturerAddress: '', //生产广商地址
                    manufacturerPhone: '', //生产广商电话
                    infoList: []
                },

                addEquipmentRules: { //验证设备信息数据的规则
                    fEquipmentName: [
                        { required: true, message: '请输入设备名称', trigger: 'blur' }
                    ],

                    fEquipmentModel: [
                        { required: true, message: '请输入设备编号', trigger: 'blur' }
                    ],

                    fEquipmentTypeInfoId: [
                        { required: true, message: '请选择设备类型', trigger: 'blur' }
                    ],

                    fAreaId: [
                        { required: true, message: '请选择设备区域', trigger: 'blur' }
                    ],

                    fLevelId: [
                        { required: true, message: '请选择设备级别', trigger: 'blur' }
                    ],

                    fManufacturerId: [
                        { required: true, message: '请选择制造商', trigger: 'blur' }
                    ],

                    fEquipmentType: [
                        { required: true, message: '请输入设备型号', trigger: 'blur' }
                    ]
                },
                //<<-- 新增设备信息form

                //地图 -->>
                longitude: null,     //经度
                latitude: null,         //纬度
                allEquipMap: null,    //展示所有设备的地图
                equipMap: null,  //添加、编辑、详情页的地图
                //<<-- 地图

                fileAPI: process.env.FILE_API, //管理文件的借口url
                previewUrl: process.env.PREVIEW_API, //预览附件的借口url
                imageUrl: '',  //附件url
                dialogImageVisible: false, //是否放大附件
                dialogFileUrl: '', //放大的附件url

                dialogModelParamsVisible: false, //是否显示设备型号详情
                dialogManufacturerVisible: false, //是否显示制造商的信息
                dialogMapVisible: false,  //是否显示设备定位地图

                equipmentDetails: {}, //设备信息详情

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                isDetailsShown: false, //是否显示详情页
                isLocationDetailsShown: true ,//设备信息详情列表上显示定位信息
                equentdetail:{
                  name:'',
                  cate:'',
                  area:'',
                  dengji:'',
                  number:''
                }
            };
        },

        async mounted() {
            this.getEquipmentTypes();
            this.getEquipmentLevel();
            this.getAreas();
            this.getAllEquipment();

            this.allEquipMap = this.initMap('allequip-map', 15);
        },

        methods: {
           //点击二维码
            downqcode(row){
              this.equmentid=row.fId
              this.equentdetail={
                name:row.fEquipmentName,
                cate:row.typeName,
                area:row.areaName,
                dengji:row.levelName,
                number:row.levelName
              }
              this.$nextTick(function () {
                    this.qrcode()
              })
              this.dialogVisible=true
            },
            //下载二维码
            downcode(){
               // let mycanvas=document.getElementById("qrcode").getElementsByTagName('canvas')
               // let a=document.createElement('a')
               // a.href=mycanvas[0].toDataURL('image/png')
               // a.download="机器二维码"
               // a.click()
               html2canvas(this.$refs.courseInfo,{
                   backgroundColor: null
               }).then((canvas) => {
                   let dataURL = canvas.toDataURL("image/png");
                   let a=document.createElement('a')
                   a.href= dataURL;
                   a.download="机器二维码"
                   a.click()
               });
               this.$message({
                   message: '正在下载...',
                   type: 'success'
               });
            },
            /**
             * 生成二维码的方法
             */
            qrcode() {
                 this.$nextTick(()=>{
                         document.getElementById("qrcode").innerHTML = "";
                         let qrcode = new QRCode(this.$refs.qrcode, {
                             text: this.equmentid, // 二维码地址
                             width: 200,
                             height: 200,
                             colorDark: '#000000',
                             colorLight: '#ffffff',
                             correctLevel: QRCode.CorrectLevel.H
                         })

                     })
               },
            /**
             * 获取所有设备信息
             */
            async getAllEquipment() {
                let result = {};

                this.selectionParams.pageSize = this.paginator.pageSize;
                this.selectionParams.pageCurrent = this.paginator.currentPage;
                result = await EquipmentService.getEquipmentDataByPage(this.selectionParams);

                if (result.success) {
                    this.equipmentData = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备类型
             */
            async getEquipmentTypes() {
                let result = await EquipmentService.getEquipmentTypesData();

                if (result.success) {
                    this.equipmentTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取区域
             */
            async getAreas() {
                let result = await EquipmentService.getAreasData();

                if (result.success) {
                    this.areas = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备级别
             */
            async getEquipmentLevel() {
                let result = await EquipmentService.getEquipmentLevelsData();

                if (result.success) {
                    this.equipmentLevels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 给每一条数据设置序号
             */
            indexRecord(index) {
                let paginator = this.paginator;
                let calcIndex = ((paginator.currentPage - 1) * paginator.pageSize) + index + 1;

                return calcIndex;
            },

            /**
             * 显示设备状态
             * @param {number} state -- 设备状态：0 - 关闭 , 1 - 开启　
             */
            showEquipmentState(state) {
                switch (state) {
                    case 0: return '关闭';
                    case 1: return '开启';
                }
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.currentPage = pageNum;
                }
                this.getAllEquipment();
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getAllEquipment();
            },

            /**
             * 初始百度地图
             */
            initMap(id, zoom) {
                let map = new BMap.Map(id);

                if (this.longitude && this.latitude) {
                    map.centerAndZoom(new BMap.Point(this.longitude, this.latitude), zoom || 100);
                } else {
                    map.centerAndZoom(new BMap.Point(116.404, 39.915), zoom || 100);
                }
                map.enableScrollWheelZoom(true);

                return map;
            },

            /**
             * 展示新增设备信息的弹框, 设置弹框中的数据
             */
            async addEquipmentRecord() {
                this.showEquipmentDialog();

                await this.getEquipmentTypes();
                await this.getEquipmentLevel();
                await this.getAreas();
                await this.getManufacturers();
                this.getEquipmentModels();

                this.clearEquipmentRecord();

                this.isEditMode = false;

                setTimeout(() => {
                    this.equipMap = this.initMap('equip-map');
                    this.initEquipmentMapFunctions();
                }, 500);
            },

            /**
             * 获取设备生产广商
             */
            async getManufacturers() {
                let result = await EquipmentService.getManufacturersData();

                if (result.success) {
                    this.manufacturers = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取所有的设备型号
             */
            async getEquipmentModels() {
                let result = await EquipmentService.getAllModels();

                if (result.success) {
                    this.allEquipModels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 清理数据
             */
            clearEquipmentRecord() {
                let equipRecord = this.addEquipmentDataForm;

                equipRecord.fEquipmentName = '';
                equipRecord.fEquipmentType = '';
                equipRecord.fEquipmentTypeInfoId = '';
                equipRecord.fEquipmentModel = '';
                equipRecord.fLevelId = '';
                equipRecord.fAreaId = '';
                equipRecord.fImageUrl = '';
                equipRecord.locationData = '';
                equipRecord.fRatedPower = null;
                equipRecord.fProductionCapacity = null;
                equipRecord.fProductionDate = '';
                equipRecord.fManufacturerId = '';
                equipRecord.manufacturerAddress = '';
                equipRecord.manufacturerPhone = '';
                equipRecord.infoList = [];
            },

            /**
             * 显示新增弹框
             */
            showEquipmentDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 初始化地图操作
             */
            initEquipmentMapFunctions() {
                let setEquipPosition = this.setEquipPosition;

                this.equipMap.addEventListener('click', (event) => {
                    if (this.isEditMode && this.longitude && this.latitude) {
                        this.$confirm('确定修改设备定位吗？', '', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() =>  setEquipPosition(event));
                    } else {
                        setEquipPosition(event);
                    }
                });
            },

            /**
             * 点击地图的时候，添加标注
             * @param {Object} event  -- 百度地图事件对象
             */
            setEquipPosition(event) {
                this.equipMap.clearOverlays();
                this.longitude = event.point.lng;
                this.latitude = event.point.lat;
                this.addMarkerOnMap(event.point.lng, event.point.lat, this.equipMap);
                this.addEquipmentDataForm.locationData = this.longitude + ',' + this.latitude;
            },

            /**
             * 新增标注
             * @param {number}  lng --- 经度
             * @param {number}  lat --- 维度
             * @param {Object} map --- 百度地图
             * @param {boolean} fixed --- 是否可以拖动
             * @param {string} title  --- 标注的标题
             */
            addMarkerOnMap(lng, lat, map, fixed, title) {
                let newPoint = new BMap.Point(lng, lat);
                let marker = new BMap.Marker(newPoint);  // 创建标注

                if (!fixed) {
                    marker.enableDragging();
                    marker.addEventListener('dragend', this.handleMarkerDragEnd.bind(this));
                }

                if (title) {
                    let label = new BMap.Label(title, {
                        offset: new BMap.Size(0,-20),
                        position: newPoint
                    });

                    marker.setLabel(label);
                }
                map.addOverlay(marker);
            },

            /**
             * 处理标注拖动结束的事件
             */
            handleMarkerDragEnd(event) {
                if (this.isEditMode) {
                    this.$confirm('确定修改设备定位吗？', '', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() =>  {
                        this.longitude = event.point.lng;
                        this.latitude = event.point.lat;
                        this.addEquipmentDataForm.locationData = this.longitude + ',' + this.latitude;
                    }).catch(() => {
                        this.equipMap.clearOverlays();
                        this.addMarkerOnMap(this.longitude, this.latitude, this.equipMap);
                    });
                } else {
                    this.longitude = event.point.lng;
                    this.latitude = event.point.lat;
                }
            },

            /**
             * 获取设备特殊属性
             * @param {string} typeId -- 设备类型id
             */
            async getSpecialEquipmentParams(typeId) {
                let result = await EquipmentService.getEquipmentParamsData(typeId);

                if (result.success) {
                    this.addEquipmentDataForm.infoList = this.setSpecialParamsForForm(result.obj);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 设置添加设备form里的字段
             */
            setSpecialParamsForForm(data) {
                let qnty = data.length;
                let params = [];

                for (let i = 0; i < qnty; i++) {
                    let param = {
                        attributeName: data[i].fAttributeName,
                        fAttributeId: data[i].fId,
                        fEquipmentId: data[i].fEquipmentTypeInfoId,
                        fUnit: data[i].fUnit,
                        fValue: null
                    }

                    params.push(param);
                }

                return params;
            },

            /**
             * 关闭弹框
             */
            closeDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 处理上载附件成功的状态
             */
            handleUploadPhotoSuccess(result, file) {
                this.imageUrl = URL.createObjectURL(file.raw);

                if (result.success) {
                    this.addEquipmentDataForm.fImageUrl = result.data.fFileLocationUrl;
                }
            },

            /**
             * 选择生产广商
             */
            selectManufacturer(manufactId) {
                let manufacturers = this.manufacturers;
                let qnty = manufacturers.length;

                for (let i = 0; i < qnty; i++) {
                    if (manufacturers[i].fId === manufactId) {
                        this.addEquipmentDataForm.manufacturerPhone = manufacturers[i].fPhone;
                        this.addEquipmentDataForm.manufacturerAddress = manufacturers[i].fManufacturerAddress;
                        return;
                    }
                }
            },

            /**
             * 提交设备数据
             */
            submitEquipmentData() {
                this.setEquipmentIdForSpecialParams();

                let equipData = this.addEquipmentDataForm;

                this.$refs.addEquipForm.validate(async valid => {
                    let page = 1;

                    if (!equipData.fImageUrl) {
                        this.$message.error('请上传一张设备图片');
                        return;
                    }

                    let result = {};

                    if (valid) {
                        if (!this.isEditMode) {
                            result = await EquipmentService.insertEquipmentRecord(this.addEquipmentDataForm);
                            page = 1;
                        } else {
                            result = await EquipmentService.updateEquipmentRecord(this.addEquipmentDataForm);
                            page = null;
                        }

                        if (!result.success) {
                            this.$message.error(result.msg);
                        } else {
                            this.closeDialog(1);
                            this.goToPage(page);
                        }
                    } else {
                        this.$message.error('请输入设备信息数据');
                    }
                });
            },

            /**
             * 给每个特殊属性设置设备id
             */
            setEquipmentIdForSpecialParams() {
                let equipment = this.addEquipmentDataForm;
                let params = equipment.infoList;
                let qnty = params.length;

                for (let i = 0; i < qnty; i++) {
                    params[i].fEquipmentId = equipment.fId;
                }
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 编辑设备信息
             * @param {Object} row  -- 一条数据
             */
            async editEquipmentInfo(row) {
                await this.getEquipmentTypes();
                await this.getEquipmentLevel();
                await this.getAreas();
                await this.getManufacturers();
                this.getEquipmentModels();

                let id = row.fId;
                let result = await EquipmentService.getEditDetailesData(id);

                if (result.success) {
                    this.addEquipmentDataForm = result.obj;
                    this.parseLocation(result.obj.locationData);
                    this.isEditMode = true;
                    this.showEquipmentDialog();

                    setTimeout(() => {
                        this.equipMap = this.initMap('equip-map');
                        this.addMarkerOnMap(this.longitude, this.latitude, this.equipMap);
                        this.initEquipmentMapFunctions();
                    }, 500);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 分列定位字符串
             * @param {string} location --- “经度，维度”
             */
            parseLocation(location) {
                if (location) {
                    let coords = location.split(',');

                    this.longitude = Number(coords[0]);
                    this.latitude = Number(coords[1]);
                } else {
                    this.longitude = null;
                    this.latitude = null;
                }
            },

            /**
             * 显示维修详情
             * @param {Object} row   --- 一条数据
             */
            async showEquipmentDetails(row) {
                let id = row.fId;
                let details = await EquipmentService.getEquipmentDetailesData(id);

                if (details.success) {
                    this.equipmentDetails = details.obj;
                    await this.getLocationInfo(id);
                    this.toggleEquipmentDetails();
                } else {
                    this.$message.error(details.msg);
                }
            },

            /**
             * 获取定位数据
             */
            async getLocationInfo(id) {
                let result = await EquipmentService.getEquipmentLocationDetails(id);

                if (result.success) {
                    if (result.obj) {
                        this.isLocationDetailsShown = true;
                        this.equipmentDetails.fLocationData = result.obj.fLocationData;
                        this.equipmentDetails.fLocationDescription = result.obj.fLocationDescription;
                    } else {
                        this.isLocationDetailsShown = false;
                    }
                } else {
                    this.isLocationDetailsShown = false;
                }
            },

            /**
             * 显示/关闭详情页
             */
            toggleEquipmentDetails() {
                this.isDetailsShown = !this.isDetailsShown;
            },

            /**
             * 获取设备类型名称
             * @param {string} id  --- 设备类型id
             */
            getEquipTypeName(id) {
                let types = this.equipmentTypes;
                let qnty = types.length;

                for (let i = 0; i < qnty; i++) {
                    if (types[i].fId === id) {
                        return types[i].fTypeName;
                    }
                }

                return '';
            },

            /**
             * 获取设备区域名称
             * @param {string} id  --- 设备区域id
             */
            getAreaName(id) {
                let areas = this.areas;
                let qnty = areas.length;

                for (let i = 0; i < qnty; i++) {
                    if (areas[i].fId === id) {
                        return areas[i].fAreaName;
                    }
                }

                return '';
            },

            /**
             * 放大图片
             */
            handleImagePreview() {
                this.dialogFileUrl = this.previewUrl + this.equipmentDetails.fImageUrl;
                this.dialogImageVisible = true;
            },

            /**
             * 展示设备参数
             */
            showModelParams() {
                this.dialogModelParamsVisible = true;
            },

            /**
             * 展示制造商的信息
             */
            showManufacturerInfo() {
                this.dialogManufacturerVisible = true;
            },

            /**
             * 展示详情页的地图
             */
            showLocationMap() {
                this.dialogMapVisible = true;

                let location = this.equipmentDetails.fLocationData.split(',');
                this.longitude = Number(location[0]);
                this.latitude = Number(location[1]);

                setTimeout(() => {
                    let map = this.initMap('details-map');
                    this.addMarkerOnMap(this.longitude, this.latitude, map, true);
                }, 500);
            },

            /**
             * 删除设备信息
             * @param {Object} row -- 一条数据
             * @param {number} index -- 一条数据的索引
             */
            deleteEquipmentInfo(row) {
                this.$confirm('确定删除设备信息？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await EquipmentService.deleteEquipmentData(row.fId);

                    if (result.success) {
                        this.goToPage(1);
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 转到地图页面的时候，展示所有的设备位置
             * @param {Object} tab --- 标签对象
             */
            async handleMapTabClick(tab) {
                if (tab.name === 'map') {
                    this.allEquipMap.clearOverlays();
                    await this.getAllEquipmentsCoords();
                    setTimeout(() => {
                        this.showAllEquipmentsMarkers();
                        this.centerMap();
                    }, 500);
                }
            },

            /**
             * 获取所有设备定位信息
             */
            async getAllEquipmentsCoords() {
                let result = await EquipmentService.getEquipmentLocationData();

                if (result.success) {
                    this.equipmentsCoords = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 在地图上显示所有设备的位置
             */
            showAllEquipmentsMarkers() {
                let locations = this.equipmentsCoords;
                let qnty = locations.length;

                this.allEquipMap.clearOverlays();

                for (let i = 0; i < qnty; i++) {
                    let location = locations[i].fLocationData.split(',');
                    let long = Number(location[0]);
                    let lat = Number(location[1]);

                    this.addMarkerOnMap(long, lat, this.allEquipMap, true, locations[i].fEquipmentName);
                }
            },

            /**
             * 把第一个设备位置为地图的中间
             */
            centerMap() {
                let firstLocationString = this.equipmentsCoords[0].fLocationData;
                let firstLocationArray = firstLocationString.split(',');
                let long = Number(firstLocationArray[0]);
                let lat = Number(firstLocationArray[1]);


                this.allEquipMap.panTo(new BMap.Point(long, lat));
            },

            /**
             * 换城市
             * @param {string} city
             */
            changeLocation() {
                this.equipMap.setCenter(this.mapCity);
            }
        }
    }
</script>


<style rel="stylesheet/scss" lang="scss">
    .equipment-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
        }
    }

    .search-form {
        .el-form-item__label {
            background: rgba(241,244,249,1);
            text-align: center !important;
            border: 1px solid #E1E5E8;
            border-right: none;
            color: #324057 !important;
            height: 36px !important;
            line-height: 36px !important;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
        }

        .select,
        .input-item {
            .el-input__inner {
                height: 36px !important;
                border-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }

    .map {
        width: 100%;
        height: 70vh;
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
    }

    .image-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .image-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .image-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .image-small {
        width: 178px;
        height: 178px;
        display: block;
    }

    .select,
    .input-item {
        &.longer {
            width: 220px;
        }
    }

    .mandatory-field {
        color: #F56C6C;
        margin-right: 4px;
    }

    .margin-top15 {
        margin-top: 15px;
    }

    .detailesPage {
        height: 85vh;

        .container {
            height: calc(100% - 60px);
            overflow-y: auto;
        }
    }

    .details-wrapper {
        height: calc(100vh - 220px);
        overflow-y: auto;
    }

    .details-table {
        margin: 20px auto 0 auto;
        border-collapse: collapse;

        thead {
            border: solid 1px #e1e5e8;
            background: #f1f4f9;

            th {
                padding: 10px 15px;
            }
        }

        tbody {
            td {
                width: 220px;
                padding: 6px 15px;
                border: solid 1px #e1e5e8;

                &:nth-child(odd) {
                    text-align: right;
                }
            }
        }

        .preview-image {
            cursor: pointer;
        }
    }

    .map-edit-wrapper {
        position: relative;
        width: 85%;
        margin: 0 auto;

        > .map-buttons {
            position: absolute;
            top: 0;
            right: 0;
            padding: 15px;
            z-index: 999;
        }
    }
    #qrcode {
        margin:0 auto;
        img {
          width: 132px;
          height: 132px;
          background-color: #fff; //设置白色背景色
          padding: 6px; // 利用padding的特性，挤出白边
          margin: 0 auto;
        }
      }
      .tdbody{
         width: 160px;
         text-align: center;
         font-weight: 800;
         height: 40px;
      }
      .tdcentent{
        width: 70%;
        text-align: left;
        font-weight: 800;
        height: 40px;
        padding-left:10px;
      }
      .tdcentents{
        width: 40%;
        text-align: left;
        font-weight: 800;
        height: 40px;
        padding-left:10px;
      }
      .tdpding{
        padding-left: 10px;
      }
</style>
