/*
* @Author: 元实
* @Date:   2019-08-15
* @Description: '设备维修页面'
*/

<template>
    <div class="maintenance-page">
        <div v-if="!isDetailsShown" class="container">
            <!-- 设备维修页面头部-->
            <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                <el-row>
                    <el-form-item
                        label="开始时间"
                        label-width="100px"
                        prop="startTime">
                        <el-date-picker
                            size="medium"
                            v-model="selectionParams.fStateTime"
                            type="datetime"
                            class="date-picker "
                            placeholder="开始时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            clearable>
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item
                        label="结束时间"
                        label-width="100px"
                        prop="finishTime">
                        <el-date-picker
                            size="medium"
                            v-model="selectionParams.fEndTime"
                            type="datetime"
                            class="date-picker"
                            placeholder="结束时间"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            clearable>
                        </el-date-picker>
                    </el-form-item>

                     <el-form-item label="设备" label-width="100px">
                        <el-select
                            v-model="selectionParams.fEquipmentId"
                            placeholder="设备"
                            clearable
                            class="select longer">
                            <el-option label="所有设备" value=""></el-option>
                            <el-option
                                v-for="equipItem in equipment"
                                :key="equipItem.fId"
                                :label="equipItem.fEquipmentName"
                                :value="equipItem.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="设备级别" label-width="100px">
                        <el-select
                            v-model="selectionParams.fEquipmentLevel"
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

                    <el-form-item label="设备广商" label-width="100px">
                        <el-select
                            v-model="selectionParams.fManufacturer"
                            placeholder="设备广商"
                            clearable
                            class="select longer">
                            <el-option label="所有设备广商" value=""></el-option>
                            <el-option
                                v-for="manufacturer in manufacturers"
                                :key="manufacturer.fId"
                                :label="manufacturer.fManufacturerName"
                                :value="manufacturer.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="维修人" label-width="100px">
                        <el-select
                            v-model="selectionParams.fMaintenanceUserId"
                            placeholder="维修人"
                            clearable
                            class="select longer">
                            <el-option label="所有维修人" value=""></el-option>
                            <el-option
                                v-for="person in personnel"
                                :key="person.fId"
                                :label="person.fUserName"
                                :value="person.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="维修类型" label-width="100px">
                        <el-select
                            v-model="selectionParams.fMaintenanceType"
                            placeholder="维修类型"
                            clearable
                            class="select longer">
                            <el-option label="所有维修类型" value=""></el-option>
                            <el-option
                                v-for="type in maintenanceTypes"
                                :key="type.fId"
                                :label="type.fName"
                                :value="type.fId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                        <el-button type="primary" icon="el-icon-plus" @click.stop="addMaintenanceRecord" size="small">新增</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click.stop="editMaintenanceTypes" size="small">设备维修类型</el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!-- 销量页面头部-->

            <!--设备维修表格-->
            <el-table
                :data="maintenancePlanData"
                class="defaultTab"
                highlight-current-row
                stripe
                style="width: 100%"
                max-height="250vh">

                <el-table-column
                    label="设备"
                    prop="fEquipmentbName">
                </el-table-column>

                <el-table-column
                    label="开始时间"
                    prop="fBeginTime">
                </el-table-column>

                <el-table-column
                    label="结束时间"
                    prop="fEndTime">
                </el-table-column>

                <el-table-column
                    label="维修部门"
                    prop="fDepName">
                </el-table-column>

                <el-table-column
                    label="维修人"
                    prop="tMaintenanceUsers">
                    <template slot-scope="scope">
                        {{ concatMaintenancePersonsNames(scope.row.tMaintenanceUsers) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="维修类型"
                    prop="fMaintenanceTypeName">
                </el-table-column>

                <el-table-column
                    label="状态"
                    prop="state">
                    <template slot-scope="scope">
                        {{  showEquipmentMaintenanceState(scope.row.fState) }}
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showMaintenanceDetails(scope.row, scope.$index)" size="small">详情</el-button>
                        <!--<el-button type="text" @click="deleteMaintenanceRecord(scope.row.fId)" size="small">删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>
            <!--设备维修表格-->

            <!-- 销量页面表格分页-->
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
            <!-- 销量页面表格分页-->

            <!-- 设备维修计划新增弹框-->
            <TheDialog
                :modal="isAddFormShown"
                :modalTitle="addFormTitle"
                @closeModal="closeDialog(1)">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="addPlanForm"
                        class="demo-form-inline input-form"
                        :model="addMaintenanceDataForm"
                        :rules="addMainteananceRules">
                        <el-row type="flex" justify="space-between">
                            <el-form-item
                                label="设备"
                                label-width="100px"
                                prop="equipment">
                                <el-select
                                    v-model="addMaintenanceDataForm.equipment"
                                    placeholder="设备"
                                    class="select longer"
                                    clearable>
                                    <el-option
                                        v-for="equipItem in equipment"
                                        :key="equipItem.fId"
                                        :label="equipItem.fEquipmentName"
                                        :value="equipItem.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                label="验收人"
                                label-width="100px"
                                :model="addMaintenanceDataForm"
                                prop="acceptor">
                                <el-select
                                    v-model="addMaintenanceDataForm.acceptor"
                                    placeholder="验收人"
                                    class="select longer"
                                    clearable>
                                    <el-option
                                        v-for="acceptor in personnel"
                                        :key="acceptor.fId"
                                        :label="acceptor.fUserName"
                                        :value="acceptor.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row type="flex" justify="space-between">
                            <el-form-item
                                label="开始时间"
                                label-width="100px"
                                prop="startTime">
                                <el-date-picker
                                    size="medium"
                                    v-model="addMaintenanceDataForm.startTime"
                                    type="datetime"
                                    class="date-picker "
                                    placeholder="开始时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    clearable>
                                </el-date-picker>
                            </el-form-item>

                            <el-form-item
                                label="结束时间"
                                label-width="100px"
                                prop="finishTime">
                                <el-date-picker
                                    size="medium"
                                    v-model="addMaintenanceDataForm.finishTime"
                                    type="datetime"
                                    class="date-picker longer"
                                    placeholder="结束时间"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-row>

                        <el-row  type="flex" justify="space-between">
                            <el-form-item
                                label="维修部门"
                                label-width="100px"
                                :model="addMaintenanceDataForm"
                                prop="departments">
                                <el-cascader
                                    @change="selectDepartment"
                                    v-model="addMaintenanceDataForm.departments"
                                    clearable
                                    :options="departments"
                                    :props="departmentsProps"
                                    :show-all-levels="false"
                                    class="select longer"
                                    placeholder="请选择维修部门">
                                </el-cascader>
                            </el-form-item>

                            <el-form-item
                                label="维修人"
                                label-width="100px"
                                :model="addMaintenanceDataForm"
                                prop="maintPersonnel">
                                <el-select
                                    v-model="addMaintenanceDataForm.maintPersonnel"
                                    placeholder="维修人"
                                    class="select longer"
                                    @focus="checkDepartmentSelected"
                                    multiple
                                    clearable>
                                    <el-option
                                        v-for="(person, index) in maintPersonnel"
                                        :key="person.fId"
                                        :label="person.fUserName"
                                        :value="person.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="维修类型"
                                label-width="100px"
                                :model="addMaintenanceDataForm"
                                prop="maintenanceType">
                                <el-select
                                    v-model="addMaintenanceDataForm.maintenanceType"
                                    placeholder="维修类型"
                                    class="select longer"
                                    clearable>
                                    <el-option
                                        v-for="(type, index) in maintenanceTypes"
                                        :key="type.fId"
                                        :label="type.fName"
                                        :value="type.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-form-item
                                label="维修原因"
                                label-width="100px"
                                :model="addMaintenanceDataForm"
                                prop="reason"
                                class="textarea-item">
                                <el-input
                                    type="textarea"
                                    v-model="addMaintenanceDataForm.reason"
                                    :rows="3"
                                    resize="none"
                                    placeholder="维修原因"
                                    autocomplete="off"
                                    clearable>
                                </el-input>
                            </el-form-item>
                        </el-row>

                        <!-- 附件 -->
                        <el-container class="margin-top15">
                            <el-header class="dialog-sub-header">照片</el-header>

                            <el-row class="margin-top15">
                                <el-upload
                                   accept="image/jpeg, image/gif, image/png, image/jpg, .avi, .AVI, .wma, .mp4, .3GP"
                                    ref="upload"
                                   drag
                                    :action="fileAPI + '/ikingtech/oss/api/upload/v1'"
                                    :on-preview="handlePhotoCardPreview"
                                    :before-remove="beforeRemovePhoto"
                                    :on-remove="handleRemovePhoto"
                                    :on-success="handleUploadPhotoSuccess"
                                    multiple>
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖至此处或<em>点击</em></div>
                                </el-upload>
                            </el-row>
                        </el-container>
                        <!-- 附件 -->

                        <!-- 维修项 -->
                        <el-container class="margin-top15">
                            <el-header class="dialog-sub-header"><i class="mandatory-field">*</i>维修项</el-header>

                            <el-row class="margin-top15">
                                <div class="mainten-items">
                                    <Draggable v-model="addMaintenanceDataForm.maintenanceItems">
                                        <transition-group name="items-transition">
                                                <el-card
                                                v-for="(item, index) in addMaintenanceDataForm.maintenanceItems"
                                                :key="item.id"
                                                shadow="never"
                                                class="item-card margin-bottom15">
                                                <div class="card-head">
                                                    <span>维修项&nbsp;&nbsp;{{ index + 1 }}</span>

                                                    <el-tooltip effect="dark" content="删除" placement="top">
                                                        <el-button type="text" icon="el-icon-delete" class="operation-icon" @click="deleteMaintenanceItem(index)"></el-button>
                                                    </el-tooltip>
                                                </div>

                                                <div class="card-body">
                                                   <!-- <transition name="item-transition">-->
                                                    <template v-if="!isNewItemAdded[index]">
                                                        <el-row>
                                                            <el-form-item
                                                                :prop="'maintItemTextarea' + index"
                                                                :rules="{ required: true, validator: (rule, value, callback) => validateMaintItem(rule, index, callback), trigger: 'blur' }"
                                                                :model="addMaintenanceDataForm"
                                                                label="内容"
                                                                label-width="100px"
                                                                class="textarea-item">
                                                            <el-input
                                                                type="textarea"
                                                                v-model="item.fCount"
                                                                :rows="3"
                                                                resize="none"
                                                                autocomplete="off"
                                                                placeholder="请输入维修项内容"
                                                                clearable>
                                                            </el-input>
                                                            </el-form-item>
                                                        </el-row>
                                                    </template>

                                                    <template v-else>
                                                        <el-row>
                                                            {{ item.fCount }}
                                                        </el-row>
                                                    </template>
                                                    <!--</transition>-->
                                                </div>
                                            </el-card>
                                        </transition-group>
                                    </Draggable>
                                </div>
                            </el-row>

                            <el-row>
                                <el-tooltip effect="dark" content="新增维修项" placement="top">
                                    <el-button
                                        size="small"
                                        @click="createMaintenanceItem"
                                        class="button-plus margin-top15">
                                        <i class="el-icon-plus"></i>
                                    </el-button>
                                </el-tooltip>
                            </el-row>
                        </el-container>
                        <!-- 维修项 -->

                        <!-- 零件信息 -->
                        <el-container class="margin-top15">
                            <el-header class="dialog-sub-header">换件信息</el-header>

                            <el-row>
                                <div class="mainten-items">
                                    <Draggable v-model="addMaintenanceDataForm.maintenanceParts">
                                        <transition-group name="items-transition">
                                            <el-card
                                                v-for="(part, index) in addMaintenanceDataForm.maintenanceParts"
                                                :key="part.id"
                                                shadow="never"
                                                class="item-card margin-bottom15">
                                                <div class="card-head">
                                                    <span v-if="!isNewPartAdded[index]">零件&nbsp;&nbsp;{{ index + 1 }}</span>
                                                    <span v-else>{{ part.fPartName }}</span>

                                                    <el-tooltip effect="dark" content="删除" placement="top">
                                                        <el-button type="text" icon="el-icon-delete" class="operation-icon" @click="deleteMaintenancePart(index)"></el-button>
                                                    </el-tooltip>
<!--
                                                    <el-tooltip  effect="dark" content="修改" placement="top">
                                                        <el-button type="text" icon="el-icon-edit" class="operation-icon" @click="editMaintenancePart(index)"></el-button>
                                                    </el-tooltip>

                                                    <el-tooltip effect="dark" content="添加" placement="top">
                                                        <el-button  type="text" icon="el-icon-plus" class="operation-icon" @click="addMaintenancePart(index)"></el-button>
                                                    </el-tooltip>-->
                                                </div>

                                                <div class="card-body">
                                                    <!-- <transition name="item-transition">-->
                                                    <template v-if="!isNewPartAdded[index]">
                                                        <el-row>
                                                            <el-form-item
                                                                :prop="'maintPartTextarea' + index"
                                                                :rules="{ required: true, validator: (rule, value, callback) => validateMaintPart(rule, index, callback), trigger: 'blur' }"
                                                                :model="addMaintenanceDataForm"
                                                                label="零件名称"
                                                                label-width="100px">
                                                                <el-input
                                                                    v-model="part.fPartName"
                                                                    autocomplete="off"
                                                                    placeholder="请输入零件名称"
                                                                    clearable
                                                                    class="input-item">
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-row>

                                                        <el-row>
                                                            <el-form-item
                                                                :model="addMaintenanceDataForm"
                                                                label="换件原因"
                                                                label-width="100px"
                                                                class="textarea-item">
                                                                <el-input
                                                                    type="textarea"
                                                                    v-model="part.fCause"
                                                                    :rows="3"
                                                                    resize="none"
                                                                    autocomplete="off"
                                                                    placeholder="请输入换件原因"
                                                                    clearable>
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-row>

                                                        <el-row>
                                                            <el-form-item
                                                                :model="addMaintenanceDataForm"
                                                                :prop="'maintPartQntyInput' + index"
                                                                :rules="{ required: true, validator: (rule, value, callback) => validateMaintPartQnty(rule, index, callback), trigger: 'blur' }"
                                                                label="零件数量"
                                                                label-width="100px">
                                                                <el-input
                                                                    type="number"
                                                                    v-model="part.fNumber"
                                                                    autocomplete="off"
                                                                    placeholder="请输入零件数量"
                                                                    clearable
                                                                    class="input-item">
                                                                </el-input>
                                                            </el-form-item>
                                                        </el-row>
                                                    </template>

                                                    <template v-else>
                                                        <el-row v-if="part.fCause">
                                                            换件原因：{{ part.fCause }}
                                                        </el-row>

                                                        <el-row v-if="part.fNumber">
                                                            零件数量：{{ part.fNumber }}
                                                        </el-row>
                                                    </template>
                                                    <!--</transition>-->
                                                </div>
                                            </el-card>
                                        </transition-group>
                                    </Draggable>
                                </div>
                            </el-row>

                            <el-row>
                                <el-tooltip effect="dark" content="新增换件信息" placement="top">
                                    <el-button
                                        size="small"
                                        @click="createMaintenancePart"
                                        icon="el-icon-plus"
                                        class="button-plus margin-top15 margin-bottom15">
                                    </el-button>
                                </el-tooltip>
                            </el-row>
                        </el-container>
                        <!-- 零件信息 -->

                        <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                            <el-button type="primary" @click.stop="submitMaintenanceData">确定</el-button>
                            <el-button @click.stop="resetForm('addPlanForm')">重置</el-button>
                        </el-row>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 设备维修计划新增弹框-->

            <!-- 预览附件 -->
            <el-dialog :visible.sync="dialogImageVisible">
                <img width="100%" :src="dialogFileUrl" alt="">
            </el-dialog>
            <!-- 预览附件 -->

            <!-- 预览视频 -->
            <el-dialog :visible.sync="dialogVideoVisible">
                <video width="100%" alt="" controls>
                    <source :src="dialogFileUrl" />
                </video>
            </el-dialog>
            <!-- 预览视频 -->

            <!-- 设备维修类型弹框-->
            <TheDialog
                :modal="isTypeFormShown"
                modalTitle="设备维修类型"
                @closeModal="closeDialog(2)">
                <template v-slot:custom-modal-content>
                    <el-form
                        ref="maintenanceTypeForm"
                        class="demo-form-inline input-form"
                        :model="maintenanceTypesForm"
                        :rules="maintenanceTypesRules">
                        <div class="mainten-items">
                            <Draggable v-model="maintenanceTypes" @end="handleDragMaintenanceType">
                                <transition-group name="items-transition">
                                    <el-card
                                        v-for="(type, index) in maintenanceTypes"
                                        :key="type.fId"
                                        shadow="never"
                                        class="item-card margin-bottom15">
                                        <div class="card-head">
                                            <el-row>
                                                <span>维修类型&nbsp;&nbsp;{{ index + 1 }}</span>

                                                <el-tooltip effect="dark" content="删除" placement="top">
                                                    <el-button type="text" icon="el-icon-delete" class="operation-icon" @click="deleteMaintenanceType(index)"></el-button>
                                                </el-tooltip>

                                                <el-tooltip  effect="dark" content="修改" placement="top">
                                                    <el-button type="text" icon="el-icon-edit" class="operation-icon" @click="editMaintenanceType(index)"></el-button>
                                                </el-tooltip>

                                                <el-tooltip effect="dark" content="添加" placement="top">
                                                    <el-button  type="text" icon="el-icon-plus" class="operation-icon" @click="addMaintenanceType(index)"></el-button>
                                                </el-tooltip>
                                            </el-row>
                                        </div>

                                        <div class="card-body">
                                            <el-form-item
                                                v-if="!isNewTypeAdded[index]"
                                                :prop="'typeName' + index"
                                                :rules="{ validator: (rule, value, callback) => validateMaintType(rule, index, callback), trigger: 'blur' }"
                                                :model="maintenanceTypesForm"
                                                label="维修类型"
                                                label-width="100px">
                                                <el-input
                                                    v-model="type.fName"
                                                    auto-complete="off"
                                                    placehoder="请输入设备维修类型"
                                                    clearable
                                                    class="input-item">
                                                </el-input>
                                            </el-form-item>

                                            <template v-else="isNewTypeAdded[index]">
                                                {{ type.fName }}
                                            </template>
                                        </div>
                                    </el-card>
                                </transition-group>
                            </Draggable>

                            <el-row>
                                <el-tooltip effect="dark" content="新增设备维修类型" placement="top">
                                    <el-button
                                        type="primary"
                                        icon="el-icon-plus"
                                        @click="createMaintenanceType"
                                        class="button-plus">
                                    </el-button>
                                </el-tooltip>
                            </el-row>
                        </div>
                    </el-form>
                </template>
            </TheDialog>
            <!-- 设备维修类型弹框-->
        </div>

        <!--详情页-->
        <div v-if="isDetailsShown" class="container detailesPage">
            <el-page-header
                @back="toggleMaintenanceDetails"
                content="设备维修详情"
            ></el-page-header>

            <div class="container">

                <el-row>
                    设备：<span class="grey-font">{{ maintenanceDetailedRecord.fEquipmentbName }}</span>
                </el-row>

                <el-row class="margin-top15">
                    验收人：<span class="grey-font">{{ maintenanceDetailedRecord.fAcceptanceUserName }}</span>
                </el-row>

                <el-row class="margin-top15">
                    维修部门：<span class="grey-font">{{ maintenanceDetailedRecord.fDepName }}</span>
                </el-row>

                <el-row class="margin-top15">
                    维修人：<span class="grey-font">{{ maintPersonnelNames(maintenanceDetailedRecord.maintenanceUsers) }}</span>
                </el-row>

                <el-row class="margin-top15">
                    维修类型：<span class="grey-font">{{ maintenanceDetailedRecord.fMaintenanceTypeName }}</span>
                </el-row>

                <el-row class="margin-top15">
                    维修原因：<span class="grey-font">{{ maintenanceDetailedRecord.fCause }}</span>
                </el-row>

                <el-row class="margin-top15">
                    开始时间：<span class="grey-font">{{ maintenanceDetailedRecord.fBeginTime }}</span>
                </el-row>

                <el-row class="margin-top15">
                    结束时间：<span class="grey-font">{{ maintenanceDetailedRecord.fEndTime }}</span>
                </el-row>

                <!-- 维修附件 -->
                <el-container v-if="maintenanceDetailedRecord.tFileModels">
                    <el-header class="dialog-sub-header">附件</el-header>

                    <el-row class="margin-top15">
                        <el-col
                            :span="8"
                            v-for="(file, index) in maintenanceDetailedRecord.tFileModels"
                            :key="file.fId"
                            :offset="index > 0 ? 2 : 0">
                            <el-card
                                :body-style="{ padding: '0px' }">
                                <img
                                    v-if="file.fType === 1"
                                    :src="previewUrl + '/' + file.fFileLocationUrl"
                                    class="image"
                                    :title="file.fFileName"
                                    @click="handlePhotoCardPreview({
                                        response: {
                                            data: file
                                        }
                                    })">

                                <video
                                    v-if="file.fType === 2"
                                    @click="handlePhotoCardPreview({
                                        response: {
                                            data: file
                                        }
                                    })">
                                    <source :src="previewUrl + '/' + file.fFileLocationUrl" />
                                </video>
                            </el-card>
                        </el-col>
                    </el-row>

                    <!-- 预览附件 -->
                    <el-dialog :visible.sync="dialogImageVisible">
                        <img width="100%" :src="dialogFileUrl" alt="">
                    </el-dialog>
                    <!-- 预览附件 -->

                    <!-- 预览视频 -->
                    <el-dialog :visible.sync="dialogVideoVisible">
                        <video width="100%" alt="" controls>
                            <source :src="dialogFileUrl" />
                        </video>
                    </el-dialog>
                    <!-- 预览视频 -->
                </el-container>
                <!-- 维修附件 -->

                <!-- 维修项 -->
                <el-container>
                    <el-header class="dialog-sub-header">维修项</el-header>

                    <el-row class="margin-top15">
                        <div class="mainten-items">
                                    <el-card
                                        v-for="(item, index) in maintenanceDetailedRecord.maintenanceItems"
                                        :key="item.fId"
                                        shadow="never"
                                        class="item-card margin-bottom15">
                                        <div class="card-head">
                                            <span>维修项&nbsp;&nbsp;{{ index + 1 }}</span>
                                        </div>

                                        <div class="card-body grey-font">
                                                    {{ item.fCount }}
                                        </div>
                                    </el-card>
                        </div>
                    </el-row>
                </el-container>
                <!-- 维修项 -->

                <!-- 换件信息 -->
                <el-container v-if="maintenanceDetailedRecord.replaceParts.length">
                    <el-header class="dialog-sub-header">换件信息</el-header>

                    <el-row class="margin-top15">
                        <div class="mainten-items">
                            <el-card
                                v-for="(part, index) in maintenanceDetailedRecord.replaceParts"
                                :key="part.fId"
                                shadow="never"
                                class="item-card margin-bottom15">
                                <div class="card-body">
                                    <el-row>
                                        零件：<span class="grey-font">{{ part.fPartName }}</span>
                                    </el-row>

                                    <el-row v-if="part.fCause">
                                        换件原因： <span class="grey-font">{{ part.fCause }}</span>
                                    </el-row>

                                    <el-row v-if="part.fNumber">
                                        零件数量：<span class="grey-font">{{ part.fNumber }}</span>
                                    </el-row>
                                </div>
                            </el-card>
                        </div>
                    </el-row>
                </el-container>
                <!--换件信息 -->
            </div>
        </div>
        <!--详情页-->
    </div>
</template>

<script>
    import { MaintenanceService } from '@/api/equipment-maintenance' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件
    import Draggable from 'vuedraggable';

    export default {
        components: {
            TheDialog,
            Draggable
        },

        data() {
            /**
             * 验证开始时间
             * @param {Object} rule  -- 验证规则
             * @param {Object} time   -- Date对象的实例
             * @param {Function} callback   -- 显示验证效果
             * @returns {boolean}  -- true - 正常, false - 有问题
             */
            const validateStartTime = (rule, time, callback) => {
                let maintForm = this.addMaintenanceDataForm;

                if (!time) {
                    callback('请输入开始时间');
                    return false;
                }

                if (maintForm.finishTime) {
                    if (time >= maintForm.finishTime) {
                        callback('开始时间不能大于等于结束时间');
                        return false;
                    }
                }

                callback();
                return true;
            };
            /**
             * 验证结束时间
             * @param {Object} rule  -- 验证规则
             * @param {Object} time   -- Date对象的实例
             * @param {Function} callback   -- 显示验证效果
             * @returns {boolean}  -- true - 正常, false - 有问题
             */
            const validateFinishTime = (rule, time, callback) => {
                let maintForm = this.addMaintenanceDataForm;


                if (!time) {
                    callback('请输入结束时间');
                    return false;
                }

                if (maintForm.startTime) {
                    if (time <= maintForm.startTime) {
                        callback('结束时间不能小于等于开始时间');
                        return false;
                    }
                }

                callback();
                return true;
            };

            return {
                maintenancePlanData: [], //设备维修计划数据
                equipment: [],  //设备
                equipmentLevels: [], //设备级别
                manufacturers: [], //设备广商
                maintPersonnel: [], //维修人
                personnel: [], //验收人
                maintenanceTypes: [
                    {
                        fId: '',
                        fName: ''
                    }
                ], //维修类型
                maintenanceDetailedRecord: {}, //设备维修详情数据


                selectionParams: {   //搜索参数
                    fStateTime: '', //开始时间
                    fEndTime: '', //结束时间
                    fEquipmentId: '',   //设备id
                    fMaintenanceUserId: '', //维修人id
                    fEquipmentLevel: '', //设备级别
                    fManufacturer: '',  //设备广商
                    fMaintenanceType: '',  //设备类型
                    fPageSize: 10
                },

                fileAPI: process.env.FILE_API, //管理文件的借口url
                previewUrl: process.env.PREVIEW_API, //预览附件的借口url
                imageUrl: '',  //附件url
                dialogImageVisible: false, //是否放大附件
                dialogVideoVisible: false, //是否放大视频
                dialogFileUrl: '', //放大的附件url


                //新增维修计划form -->>
                isAddFormShown: false,   //是否显示新增维修设备计划的弹框
                addFormTitle: '新增',  //弹框抬头
                isAddMaintenanceItemShown: false, //显示添加维修
                isNewItemAdded: [false], //新的维修项是否添加好了
                maintenanceItemId: 0, //维修项id
                isNewPartAdded: [], //换件信息是否添加好了
                departments: [], // 部门集合
                departmentsProps: {
                    children: 'children',
                    label: 'fName',
                    value: 'fId',
                    expandTrigger: 'hover',
                    emitPath: false
                },

                addMaintenanceDataForm: {  //新增维修计划form
                    equipment: null,   //设备id
                    maintPersonnel: [], //维修人
                    acceptor: '',  //验收人
                    startTime: null, //维修开始时间
                    finishTime: null, //维修结束时间
                    departments: [], //维修部门
                    reason: '', //维修原因
                    maintenanceType: '', //设备维修类型
                    maintenancePhotos: [], //维修附件
                    maintenanceItems: [
                        {
                            id: 0,
                            fCount: ''
                        }
                    ],
                    maintenanceParts: []
                },

                addMainteananceRules: {   //验证设备维修数据的规则
                    equipment: [
                        { required: true, message: '请选择设备', trigger: 'blur' }
                    ],

                    maintPersonnel: [
                        { required: true, message: '请选择维修人', trigger: 'blur' }
                    ],

                    acceptor: [
                        { required: true, message: '请选择验收人', trigger: 'blur' }
                    ],

                    startTime: [
                        { required: true, validator: validateStartTime, trigger: 'change' }
                    ],

                    finishTime: [
                        { required: true, validator: validateFinishTime, trigger: 'change' }
                    ],

                    departments: [
                        { required: true, message: '请选择部门', trigger: 'blur' }
                    ],

                    maintenanceType: [
                        { required: true, message: '请选择维修类型', trigger: 'blur' }
                    ],

                    reason: [
                        { required: true, message: '请输入维修原因', trigger: 'blur' }
                    ]
                },
               //<<-- 新增维修计划form

                //维修类型form -->>
                isTypeFormShown: false,   //是否显示结束维修设备的弹框

                isNewTypeAdded: [false],  //新的维修类型是否添加好了

                maintenanceTypesForm: {  //设备维修类型form
                    typeName: ''
                },
                //<<-- 结束维修form

                pickerOptions1: {   //开始时间
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },

                pickerOptions2: { //结束时间
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
                    }
                },

                maintenanceTypesRules: {  //验证设备维修类型的规则
                    typeName: [
                        { required: true, message: '请输入设备维修类型', trigger: 'blur' }
                    ]
                },

                isDetailsShown: false, //是否显示详情页

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },
            };
        },

        created() {
            this.getEquipment();
            this.getEquipmentLevels();
            this.getManufacturers();
            this.getAllPersonnel();
            this.getMaintenanceTypes();
            this.getMaintenancePlan();
         },

        methods: {
            /**
             * 获取设备
             */
            async getEquipment() {
                let result = await MaintenanceService.getAllEquipmentData();

                if (result.success) {
                    this.equipment = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备类型
             */
            async getEquipmentLevels() {
                let result = await MaintenanceService.getAllEquipmentLevelsData();

                if (result.success) {
                    this.equipmentLevels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备广商
             */
            async getManufacturers() {
                let result = await MaintenanceService.getAllManufacturesData();

                if (result.success) {
                    this.manufacturers = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备维修类型
             */
            async getMaintenanceTypes() {
                let result = await MaintenanceService.getMaintenanceTypesData();

                if (result.success) {
                    this.maintenanceTypes = result.obj;

                    let qnty = this.maintenanceTypes.length;
                    for (let i = 0; i < qnty; i++) {
                        this.maintenanceTypes[i].isEdited = false;
                        this.isNewTypeAdded[i] = true;
                    }
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备维修计划数据
             */
            async getMaintenancePlan() {
                let result = {};

                this.selectionParams.fPageSize = this.paginator.pageSize;
                this.selectionParams.fCurrtentPage = this.paginator.currentPage;
                result = await MaintenanceService.getMaintenanceData(this.selectionParams);
                if (result.success) {
                    this.maintenancePlanData = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
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
                this.getMaintenancePlan();
            },

            /**
             * 维修人的名字连在一起
             */
            concatMaintenancePersonsNames(maintenancePersons) {
                let qnty = maintenancePersons.length;
                let names = [];

                for (let i = 0; i < qnty; i++) {
                    names.push(maintenancePersons[i].fUserName);
                }

                return names.join(',');
            },

            /**
             * 展示设备维修状态
             * @param {number} stateId    -- 状态id
             */
            showEquipmentMaintenanceState(stateId) {
                switch (stateId) {
                    case 1: return '未开始'; break;

                    case 2: return '进行中'; break;

                    case 3: return '已结束'; break;

                    default: return '';
                }
            },

            /**
             * 新增设备维修记录
             */
            async addMaintenanceRecord() {
                this.showsEquipMaintenanceDialog();

                await this.getEquipment();
                await this.getAllPersonnel();
                await this.getDepartment();
                await this.getMaintenanceTypes();

                this.clearMaintenanceRecord();
            },
            /**
             * 选择维修人的时候， 查看维修部门是否选好的
             */
            checkDepartmentSelected() {
                let maintenanceForm = this.addMaintenanceDataForm;

                if (!maintenanceForm.departments.length) {
                    this.$message.error('请选择维修部门');
                }
            },

            /**
             * 获取维修人员
             * @param {string} depId -- 部门id
             */
            async getMaintenancePersonnel(depId) {
                let result = await MaintenanceService.getDepartmentPersonnelData(depId);

                if (result.success) {
                    this.maintPersonnel = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取验收人
             */
           async getAllPersonnel() {
                let result = await MaintenanceService.getAllPersonnelData();

                if (result.success) {
                    this.personnel = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取部门
             */
            async getDepartment() {
                let result = await MaintenanceService.getDepartmentsData();

                if (result.success) {
                    this.departments = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 清理设备维修记录
             */
            clearMaintenanceRecord() {
                let record = this.addMaintenanceDataForm;
                
                record.equipment = null;
                record.departments = '';
                record.maintPersonnel = [];
                record.acceptor = '';
                record.reason = '';
                record.startTime = null;
                record.finishTime = null;
                record.maintenancePhotos = [];
                record.maintenanceItems = [{
                    id: 0,
                    fCount: ''
                }];
                record.maintenanceParts = [];
                this.isNewItemAdded = [];
                this.isNewPartAdded = [];
            },

            /**
             * 显示新增弹框
             */
            showsEquipMaintenanceDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 关闭弹框
             * @param {number} dialogType    -- 1 - 新增计划, 2 - 输入结束维修的数据, 3 - 详情
             */
            closeDialog(dialogType) {
                switch (dialogType) {
                    case 1: this.isAddFormShown = false; break;

                    case 2: this.isTypeFormShown = false; break;
                }
            },

            /**
             * 处理选择部门的方法
             * @param {string} depId  -- 部门id
             */
            selectDepartment(depIds) {
                this.getMaintenancePersonnel(depIds);
            },

            /**
             * 处理上载附件成功的状态
             */
            handleUploadPhotoSuccess(result, file, fileList) {
                this.imageUrl = URL.createObjectURL(file.raw);

                if (result.success) {
                    this.setMaintenanceFileList(fileList);
                }
            },

            /**
             * 把附件列表的数据复制到新增设备维修form
             */
            setMaintenanceFileList(fileList) {
                let maintenancePhotos = [];
                let qnty = fileList.length;

                maintenancePhotos = [];
                for (let i = 0; i < qnty; i++) {
                    if (!fileList[i].response) {
                          return;
                    }

                    let response = fileList[i].response.data;

                    maintenancePhotos.push({
                        fFileLocationUrl: response.fFileLocationUrl,
                        fFileName: response.fFileName,
                        fCoursewareTitle: response.fFileTitle,
                        fType: this.getFileType(response.fFileTitle)
                    });
                }
                this.addMaintenanceDataForm.maintenancePhotos = maintenancePhotos.slice();
            },

            /**
             * 返回文件类型
             * @param {string} format  -- 文件格式
             * @returns {number} -- 1 - 附件，2 - 视频， 3 - 其他的
             */
            getFileType(format) {
                switch (format) {
                    case 'jpeg':
                    case 'gif':
                    case 'png':
                    case 'jpg': return 1;

                    case 'avi':
                    case 'AVI':
                    case 'wma':
                    case 'mp4':
                    case '3GP': return 2;

                    default: return 3;
                }
            },

            /**
             * 预览添加的附件
             */
            handlePhotoCardPreview(file) {
                let data = file.response.data;
                this.dialogFileUrl = this.previewUrl + data.fFileLocationUrl;
                let type = 0;

                if (data.fType) {
                    type = data.fType;
                } else {
                    type = this.getFileType(file.response.data.fFileTitle);
                }
                
                if (type === 1) {
                    this.dialogImageVisible = true;
                } else if (type === 2) {
                    this.dialogVideoVisible = true;
                }
            },

            /**
             * 确定是否要删除文件
             */
            beforeRemovePhoto(file) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },

            /**
             * 删除附件
             */
            handleRemovePhoto(file, fileList) {
                this.setMaintenanceFileList(fileList);
            },

            /**
             * 新建设备维修项
             */
            createMaintenanceItem() {
                let items = this.addMaintenanceDataForm.maintenanceItems;

                items.push({
                    id: ++this.maintenanceItemId,
                    fCount: ''
                });
                this.isNewItemAdded.push(false);
            },

            /**
             * 添加设备维修项
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            addMaintenanceItem(index) {
                let items = this.addMaintenanceDataForm.maintenanceItems;

                this.$refs.addPlanForm.validateField('maintItemTextarea' + index);
                if (items[index].fCount) {
                    this.isNewItemAdded.splice(index, 1, true);
                }
            },

            /**
             * 验证设备维修项的输入的数据是否为空
             * @param {Object} rule   -- vue-elements验证的验证规则对象
             * @param {number} index   -- 维修项内容的输入框的索引
             * @param {Function} callback -- vue-elements验证的callback
             */
            validateMaintItem(rule, index, callback) {
                let items = this.addMaintenanceDataForm.maintenanceItems;

                if (!items[index].fCount) {
                    callback(new Error('请输入维修项内容'));
                } else {
                    callback();
                }
            },

            /**
             * 删除设备维修项
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            deleteMaintenanceItem(index) {
                let items = this.addMaintenanceDataForm.maintenanceItems;

                if (index) {
                    items.splice(index, 1);
                    this.isNewItemAdded.splice(index, 1);
                } else {
                    this.$message.error('必须新建最少一个设备维修项');
                }
            },

            /**
             * 编辑设备维修项
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            editMaintenanceItem(index) {
                this.isNewItemAdded.splice(index, 1, false);
            },

            /**
             * 新增换件信息
             */
            createMaintenancePart() {
                let details = this.addMaintenanceDataForm.maintenanceParts;

                this.isNewPartAdded.push(false);
                details.push({
                    id: details.length,
                    fPartName: '',
                    fCause: '',
                    fNumber: null
                });
            },

            /**
             * 验证零件名称
             */
            validateMaintPart(rule, index, callback) {
                let parts = this.addMaintenanceDataForm.maintenanceParts;

                if (!parts[index].fPartName) {
                    callback(new Error('请输入零件名称'));
                } else {
                    callback();
                }
            },

            /**
             * 验证设备零件数量
             */
            validateMaintPartQnty(rule, index, callback) {
                let parts = this.addMaintenanceDataForm.maintenanceParts;

                if (!parts[index].fNumber) {
                    callback(new Error('请输入零件数量'));
                } else {
                    callback();
                }
            },

            /**
             * 添加零件信息
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            addMaintenancePart(index) {
                let parts = this.addMaintenanceDataForm.maintenanceParts;

                this.$refs.addPlanForm.validateField('maintPartTextarea' + index);
                this.$refs.addPlanForm.validateField('maintPartQntyInput' + index);
                if (parts[index].fPartName && parts[index].fNumber) {
                    this.isNewPartAdded.splice(index, 1, true);
                }
            },

            /**
             * 删除设备维修项
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            deleteMaintenancePart(index) {
                let parts = this.addMaintenanceDataForm.maintenanceParts;

                parts.splice(index, 1);
                this.isNewPartAdded.splice(index, 1);
            },

            /**
             * 编辑设备维修项
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            editMaintenancePart(index) {
                this.isNewPartAdded.splice(index, 1, false);
            },

            /**
             * 提交设备维修计划数据
             */
            submitMaintenanceData() {
                let submitRecord = {};

                this.$refs['addPlanForm'].validate(async valid => {
                    if (valid) {
                        submitRecord = this.setSubmitRecord();
                        if (!submitRecord.maintenanceItems[0].fCount) {
                            this.$message.error('必须新建最少一个设备维修项');
                            return;
                        }

                        let result = await MaintenanceService.insertMaintenanceRecord(submitRecord);

                        if (!result.success) {
                            this.$message.error(result.msg);
                        } else {
                            this.closeDialog(1);
                            this.goToPage(1);
                        }
                    }
                });
            },

            /**
             * 设置要提交的数据
             */
            setSubmitRecord() {
                let record = this.addMaintenanceDataForm;

                return {
                    fAcceptanceUserId: record.acceptor,
                    fBeginTime: record.startTime,
                    fCause: record.reason,
                    fCreateTime: common.YMDHMSParseTime(Date.now()),
                    fDepId: record.departments,
                    fEndTime: record.finishTime,
                    fEquipmentbId: record.equipment,
                    fMaintenanceTypeId: record.maintenanceType,
                    fState: 0,
                    fUserIds: record.maintPersonnel,
                    fileModels: record.maintenancePhotos,
                    maintenanceItems: record.maintenanceItems,
                    replaceParts: record.maintenanceParts
                };
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 显示修改设备维修类型的弹框
             */
            async editMaintenanceTypes() {
                this.isTypeFormShown = true;
                await this.getMaintenanceTypes();
            },

            /**
             * 验证设备维修类型
             */
            validateMaintType(rule, index, callback) {
                let types = this.maintenanceTypes;

                if (!types[index].fName) {
                    callback(new Error('请输入维修类型'));
                } else {
                    callback();
                }
            },

            /**
             * 新增设备维修类型
             */
            async addMaintenanceType(index) {
                let types = this.maintenanceTypes;
                let result = null;

                this.$refs.maintenanceTypeForm.validateField('typeName' + index);
                if (types[index].fName) {
                    this.isNewTypeAdded.splice(index, 1, true);
                }

                if (!types[index].isEdited) {
                    result = await this.submitMaintenanceType(0, index);
                } else {
                    result = await this.submitMaintenanceType(1, index);
                }

                if (result.success) {
                    this.getMaintenanceTypes();
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 提交新增的维修类型
             * @param {number} operationType -- 0 - 新增，1 - 修改
             * @param {number} idx -- maintenanceTypes数组的索引，指要提交的数据
             */
            async submitMaintenanceType(operationType, idx) {
                let typeData = this.setMaintenanceTypeData(operationType, idx);
                let result = null;

                if (operationType === 0) {
                    result = await MaintenanceService.insertMaintenanceTypeData(typeData);
                } else {
                    result = await MaintenanceService.updateMaintenanceTypeData(typeData)
                }

                return result;
            },

            /**
             * 设置维修类型数据
             * @param {number} operationType -- 0 - 新增，1 - 修改
             * @param {number} idx -- maintenanceTypes数组的索引，指要提交的数据
             */
            setMaintenanceTypeData(operationType, idx) {
                let data = {
                    fIsDelete: true,
                    fName: this.maintenanceTypes[idx].fName
                };

                if (operationType === 1) {
                    data.fId = this.maintenanceTypes[idx].fId;
                }

                return data;
            },

            /**
             * 新建设备维修类型
             */
            createMaintenanceType() {
                let types = this.maintenanceTypes;
                let qnty = types.length;

                types.push({
                    fId: (qnty + 1) + '',
                    fName: ''
                });
                this.isNewItemAdded.push(false);
            },

            /**
             * 删除设备维修类型
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            async deleteMaintenanceType(index) {
                let types = this.maintenanceTypes;

                if (index !== undefined) {
                    types.splice(index, 1);

                    if (this.isNewTypeAdded[index]) {
                        let result = await MaintenanceService.deleteMaintenanceTypeData(types[index].fId);

                        if (result.success) {
                            this.getMaintenanceTypes();
                            this.isNewTypeAdded.splice(index, 1);
                        } else {
                            this.$message.error(result.msg);
                        }
                    }
                }
            },

            /**
             * 编辑设备维修类型
             * @param {number}  index   -- 设备维修项数组中的索引
             */
            async editMaintenanceType(index) {
                this.isNewTypeAdded.splice(index, 1, false);
                this.maintenanceTypes[index].isEdited = true;
            },

            /**
             * 处理改设备维修顺序
             */
            async handleDragMaintenanceType() {
                let typeOrderRecord = this.setTypeOrderRecord();
                let result = null;

                result = await MaintenanceService.updateMaintenanceTypeOrder(typeOrderRecord);
                if (!result.success) {
                   this.$message.error(result.msg);
                }
            },

            /**
             * 设备维修顺序数据
             */
            setTypeOrderRecord() {
                let types = this.maintenanceTypes;
                let qnty = types.length;
                let record = {
                    tMaintenanceTypes: []
                };

                for (let i = 0; i < qnty; i++) {
                    let typeOrderItem = {
                        fId: types[i].fId,
                        fSort: i + 1
                    };

                    record.tMaintenanceTypes.push(typeOrderItem);
                }

                return record;
            },

            /**
             * 获取设备维修详情记录
             * @returns {Promise<void>}
             */
            async getDetailedMaintenanceRecord(fId) {
                let result = await MaintenanceService.getDetailedMaintenanceData(fId);


                if (result.success) {
                    this.maintenanceDetailedRecord = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 显示维修详情
             * @param row
             * @param index
             */
            async showMaintenanceDetails(row, index) {
                await this.getDetailedMaintenanceRecord(row.fId);
                this.toggleMaintenanceDetails();
            },

            /**
             * 显示/关闭详情页
             */
            toggleMaintenanceDetails() {
                this.isDetailsShown = !this.isDetailsShown
            },

            /**
             *  把维修人的名字放在一个字符串里
             *  @param {Array}  userNames -- 维修人的名字
             */
            maintPersonnelNames(userNames) {
                if (userNames) {
                    let userNamesQnty = userNames.length;
                    let names = [];

                    for (let i = 0; i < userNamesQnty; i++) {
                        names.push(userNames[i].fUserName);
                    }

                    return names.join(', ');
                }

                return '';
            },

            /**
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getMaintenancePlan();
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .maintenance-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

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

        .date-picker {
            border-left: 0;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;

            .el-input__inner {
                border-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        .select,
        .input-volume {
            .el-input__inner {
                height: 36px !important;
                border-left: 0;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }

        .textarea-item {
            .el-form-item__label {
                display: block;
                height: 80px !important;
            }

            textarea {
                height: 80px;
                border-left: none;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }

    .margin-bottom15 {
        margin-bottom: 15px;
    }

    .margin-top15 {
        margin-top: 15px;
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
    }

    .items-transition-enter, .items-transition-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }

    .mainten-items {
        /*padding: 20px 60px*/;
    }

    .item-card {
        border: solid 2px #ebeef5 !important;
    }

    .card-head {
        border-bottom: solid 1px #ebeef5;

        &:after {
            display: block;
            height: 0;
            width: 0;
            content: '';
            clear: both;
        }

        .operation-icon  {
            margin-left: 10px;
            float: right;
            color: #545454;
            font-size: 17px;
        }
    }

    .card-body {
        padding-top: 15px;
    }

    .item-transition-enter-active, .item-transition-enter-active {
        transition: opacity .3s ease;
    }

    .item-transition-enter, .item-transition-leave-to {
        opacity: 0;
    }

    .mandatory-field {
        color: #F56C6C;
        margin-right: 4px;
    }

    .detailesPage {
        height: 85vh;

        .container {
            height: calc(100% - 60px);
            overflow-y: auto;
        }
    }

    .input-item {
        .el-input__inner {
            height: 36px !important;
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 132px;
        height: 132px;
        line-height: 132px;
        text-align: center;
    }

    .avatar {
        width: 132px;
        height: 132px;
        display: block;
    }

    .image {
        width: 100%;
        display: block;
    }

    .select.longer {
        width: 220px;
    }

    .select.long {
        width: 310px;
    }

    .grey-font {
        color: #666;
    }

    .button-plus {
        width: 100% !important;
        height: 65px !important;
        font-size: 45px !important;
        color: #ebeef5 !important;
        background-color: transparent !important;
        border: dashed 1px #ebeef5 !important;
    }

    .button-plus:hover {
        background-color: #ebeef5 !important;
        border: solid 2px #ebeef5 !important;
    }

    .button-plus:focus {
        color: #ebeef5 !important;
        background-color: transparent !important;
        border: dashed 1px #ebeef5 !important;
    }
</style>
