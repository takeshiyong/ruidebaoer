/*
* @Author: 元实
* @Date:   2019-08-29
* @Description: '区域管理'
*/

<template>
    <div class="area-page">
        <el-tabs v-model="tabName" type="border-card" @tab-click="handleMapTabClick">
            <!-- 区域类表 -->
            <el-tab-pane name="table" label="区域类表">
                <div class="container">
                    <!-- 区域管理页面头部-->
                    <el-form :inline="true" :model="selectionParams" class="demo-form-inline search-form">
                        <el-row>
                            <el-form-item label="搜索内容" label-width="100px">
                                <el-input
                                    v-model="selectionParams.content"
                                    autocomplete="off"
                                    placeholder="请输入搜索内容"
                                    clearable
                                    class="input-item longer">
                                </el-input>
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click.stop="goToPage(1)" size="small">搜索</el-button>
                                <el-button type="primary" icon="el-icon-plus" @click.stop="addAreaRecord" size="small">新增</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                    <!-- 区域管理页面头部-->

                    <!--区域信息表格-->
                    <el-table
                        :data="areasData"
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
                            label="区域名称"
                            prop="fAreaName">
                        </el-table-column>

                        <el-table-column
                            label="部门"
                            prop="fDepartmentName">
                        </el-table-column>

                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="editAreaInfo(scope.row)" size="small">编辑</el-button>
                                <!--<el-button type="text" @click="showAreaDetails(scope.row)" size="small">详情</el-button>-->
                                <el-button type="text" @click="deleteAreaInfo(scope.row)" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--区域信息表格-->

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

                    <!-- 区域新增弹框-->
                    <TheDialog
                        :modal="isAddFormShown"
                        :modalTitle="isEditMode ? editFormTitle : addFormTitle"
                        @closeModal="closeDialog">
                        <template v-slot:custom-modal-content>
                            <el-form
                                ref="addAreaForm"
                                class="demo-form-inline input-form"
                                :model="addAreaForm"
                                :rules="addAreaRules">
                                <el-row type="flex" justify="space-between">
                                    <el-form-item
                                        label="区域名称"
                                        label-width="100px"
                                        prop="fAreaName">
                                        <el-input
                                            v-model="addAreaForm.fAreaName"
                                            autocomplete="off"
                                            placeholder="请输入区域名称"
                                            clearable
                                            class="input-item longer">
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item
                                        label="部门"
                                        label-width="100px"
                                        prop="fDepartmentId">
                                        <el-cascader
                                            v-model="addAreaForm.fDepartmentId"
                                            clearable
                                            :options="departments"
                                            :props="departmentsProps1"
                                            :show-all-levels="false"
                                            class="select longer"
                                            placeholder="请选择部门">
                                        </el-cascader>
                                    </el-form-item>
                                </el-row>

                                <!-- 定位 -->
                                <el-container>
                                    <el-header class="dialog-sub-header">
                                        <i class="mandatory-field">*</i>区域定位
                                    </el-header>

                                    <el-row class="margin-top15">
                                        <div class="map-edit-wrapper" @dblclick="disableEditMode">
                                            <el-row type="flex" justify="end" class="map-buttons">
                                                <el-select
                                                    v-model="mapCity"
                                                    placeholder="城市"
                                                    clearable
                                                    class="margin-right15"
                                                    @change="changeLocation">
                                                    <el-option label="西安" value="西安"></el-option>
                                                    <el-option label="北京" value="北京"></el-option>
                                                </el-select>

                                                <template v-if="!isEditMode || isDeleted">
                                                    <el-tooltip effect="dark" content="画区域形状" placement="top">
                                                        <el-button type="primary" icon="el-icon-plus" circle @click="enableDrawingMode"></el-button>
                                                    </el-tooltip>
                                                </template>
                                                <el-tooltip effect="dark" content="编辑区域形状" placement="top">
                                                    <el-button type="primary" icon="el-icon-edit" circle @click="enableEditMode"></el-button>
                                                </el-tooltip>
                                                <el-tooltip effect="dark" content="清理地图" placement="top">
                                                    <el-button type="danger" icon="el-icon-delete" circle @click="deletePolygon"></el-button>
                                                </el-tooltip>
                                            </el-row>

                                            <div id="area-map" class="map"></div>
                                        </div>
                                    </el-row>
                                </el-container>
                                <!-- 定位 -->

                                <el-row  type="flex" justify="center" class="form-buttons margin-top15">
                                    <el-button type="primary" @click.stop="submitAreaData">确定</el-button>
                                    <el-button @click.stop="resetForm('addAreaForm')">重置</el-button>
                                </el-row>
                            </el-form>
                        </template>
                    </TheDialog>
                    <!-- 区域新增弹框-->
                </div>
            </el-tab-pane>
            <!-- 区域类表 -->

            <!-- 区域地图 -->
            <el-tab-pane name="map" label="区域地图">
                <div class="container">
                    <div id="allareas-map" class="map"></div>
                </div>
            </el-tab-pane>
            <!-- 区域地图 -->
        </el-tabs>
    </div>
</template>

<script>
    import { AreasManagmentService } from '@/api/areas-managment' // 请求api
    import { common } from '@/utils/common'; //公用的方法
    import TheDialog from '@/components/TheDialog';  // 侧滑组件
    import  BMap from 'BMap';  //百度地图api

    export default {
        components: {
            TheDialog,
        },

        data() {
            return {
                tabName: 'table',   //标签, table - 设备信息列表，map - 地图

                areasData: [], //所有的区域
                areasCoords: [], //所有区域定位信息
                areaCenters: [], //所有区域的中心点

                departments: [], //部门
                departmentsProps: {
                    children: 'children',
                    label: 'fName',
                    value: 'fName',
                    expandTrigger: 'hover',
                    emitPath: false
                },
                equipmentTypes: [],  //设备类型
                equipmentLevels: [], //设备级别

                selectionParams: { //搜索参数
                    content: '',  //搜索内容
                    departmentName: '', //部门名称
                    equipmentArea: '',  //设备区域
                    equipmentLevel: '',  //设备级别
                    equipmentName: '', //设备名称
                    equipmentState: '',  //设备状态
                    equipmentType: '',  //设备类型
                    fTypeId: ''  //积分规则类型
                },

                //地图 -->>
                longitude: null,     //区域经度
                latitude: null,         //区域纬度
                allAreasMap: null,    //展示所有区域的地图
                areaMap: null,  //添加、编辑、详情页的地图
                mapOverlay: null, //地图overlay
                drawingManager: null, //鼠标绘制工具
                //<<-- 地图

                paginator: {
                    currentPage: 1,  //当前页
                    pageSize: 10, //一页显示多少条
                    pageSizes: [10, 20, 40], //一页显示多少条
                    pagesQnty: 2, //页数
                    totalRecordsQnty: 0  //一共多少条数据
                },

                //新增/编辑区域form -->>
                isAddFormShown: false, //显示新增/编辑区域的弹框
                addFormTitle: '新增区域',   //新增区域弹框的抬头
                isEditMode: false, //编辑状态
                editFormTitle: '编辑区域', //编辑区域弹框的抬头

                departmentsProps1: {
                    children: 'children',
                    label: 'fName',
                    value: 'fId',
                    expandTrigger: 'hover',
                    emitPath: false
                },

                isDeleted: false, //区域是在地图上清理的
                areaCoordinates: [], //区域坐标

                mapCity: '', //在地图上显示的城市

                addAreaForm: {
                    fAreaName: '',     //区域名称
                    fDepartmentId: ''   //部门id
                },

                addAreaRules: {  //验证区域数据的规则
                    fAreaName: [
                        { required: true, message: '请输入区域名称', trigger: 'blur' }
                    ],

                    fDepartmentId: [
                        { required: true, message: '请选择部门', trigger: 'blur' }
                    ],
                },
                //<<-- 新增/编辑区域form
            }
        },

        mounted() {
            this.getDepartments();
            this.getAllAreas();

            this.allAreasMap = this.initMap('allareas-map', 20);
        },

        methods: {
            /**
             * 获取部门
             */
            async getDepartments() {
                let result = await AreasManagmentService.getDepartmentsData();

                if (result.success) {
                    this.departments = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备类型
             */
            async getEquipmentTypes() {
                let result = await AreasManagmentService.getEquipmentTypesData();

                if (result.success) {
                    this.equipmentTypes = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取设备级别
             */
            async getEquipmentLevel() {
                let result = await AreasManagmentService.getEquipmentLevelsData();

                if (result.success) {
                    this.equipmentLevels = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 获取所有区域信息
             */
            async getAllAreas() {
                let result = {};

                this.selectionParams.pageSize = this.paginator.pageSize;
                this.selectionParams.pageCurrent = this.paginator.currentPage;
                result = await AreasManagmentService.getAreasDataByPage(this.selectionParams);

                if (result.success) {
                    this.areasData = result.obj.items;
                    this.paginator.pagesQnty = result.obj.pageCount;
                    this.paginator.totalRecordsQnty = result.obj.itemTotal;
                } else {
                    this.$message.error(result.msg);
                }
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
                map.setCurrentCity('西安');
                map.enableScrollWheelZoom(true);

                return map;
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
             * 改一页的大小的时候，重新获取数据
             * @param size
             */
            changePageSize(size) {
                this.paginator.pageSize = size;
                this.getAllAreas();
            },

            /**
             * 跳到选择的页
             * @param {number} pageNum   -- 页数。 要是不传这个参数，刷新当前页
             */
            goToPage(pageNum) {
                if (pageNum) {
                    this.paginator.pageCurrent = pageNum;
                }
                this.getAllAreas();
            },

            /**
             * 展示新增区域的弹框，设置弹框中的数据
             */
            addAreaRecord() {
                this.clearFormFields();
                this.showAreaDialog();

                this.isEditMode = false;

                setTimeout(() => {
                    this.areaMap = this.initMap('area-map');
                    this.initDrawAreaMode();
                }, 500);
            },

            /**
             * 清理给form绑定的变量
             */
            clearFormFields() {
                this.addAreaForm.fDepartmentId = '';
                this.addAreaForm.fAreaName = '';
            },

            /**
             * 显示新增弹框
             */
            showAreaDialog() {
                this.isAddFormShown = true;
            },

            /**
             * 初始画多边形的功能
             */
            initDrawAreaMode() {
                //实例化鼠标绘制工具
                let drawingManager = new BMapLib.DrawingManager(this.areaMap, {
                    isOpen: false, //是否开启绘制模式
                    //enableDrawingTool: false, //是否显示工具栏
                    drawingToolOptions: {
                        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
                        offset: new BMap.Size(5, 5), //偏离值
                    },
                    polygonOptions:  {
                        strokeColor: 'red',    //边线颜色。
                        fillColor: 'red',      //填充颜色。当参数为空时，圆形将没有填充效果。
                        strokeWeight: 3,       //边线的宽度，以像素为单位。
                        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                        strokeStyle: 'solid' //边线的样式，solid或dashed。
                    },
                });

                drawingManager.addEventListener('overlaycomplete', this.handleOverlayComplete.bind(this));
                this.drawingManager = drawingManager;
            },

            /**
             * 画完后，保存overlay
             */
            handleOverlayComplete(event) {
                this.mapOverlay = event.overlay;
                this.getPolygonCoords();
            },

            /**
             * 获取多边形顶点
             */
            getPolygonCoords() {
                this.areaCoordinates = this.mapOverlay.getPath();
            },

            /**
             * 开启画多边形功能
             */
            enableDrawingMode() {
                this.drawingManager.open();
                this.drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);
            },

            /**
             * 开启编辑多边形功能
             */
            enableEditMode() {
                this.mapOverlay.enableEditing();
            },

            /**
             * 关闭编辑多边形功能
             */
            disableEditMode() {
                this.mapOverlay.disableEditing();
                this.getPolygonCoords();
            },

            /**
             * 删除多边形
             */
            deletePolygon() {
                this.areaMap.clearOverlays();
                this.initDrawAreaMode();
                this.isDeleted = true;
            },

            /**
             * 提交区域数据
             */
            submitAreaData() {
                if (this.areaCoordinates) {
                    this.addAreaForm.fLocationData = this.setAreaLocationString();
                }

                this.$refs.addAreaForm.validate(async valid => {
                    let page = 1;

                    let result = {};

                    if (valid) {
                        if (this.areaCoordinates.length > 50) {
                            this.$message.error('区域顶点不能多于50个！');
                            return;
                        }

                        delete this.addAreaForm.fDepartmentName;

                        if (!this.isEditMode) {
                            result = await AreasManagmentService.insertAreaRecord(this.addAreaForm);
                            page = 1;
                        } else {
                            result = await AreasManagmentService.updateAreaRecord(this.addAreaForm);
                            page = null;
                        }

                        if (result.success) {
                            this.closeDialog();
                            this.goToPage(page);
                        } else {
                            this.$message.error(result.msg);
                        }
                    } else {
                        this.$message.error('请输入区域数据');
                    }
                });
            },

            /**
             * 设置区域坐标字符串
             */
            setAreaLocationString() {
                let coords = this.areaCoordinates;
                let qnty = coords.length;
                let coordsString = '';

                for (let i = 0; i < qnty; i++) {
                    coordsString += coords[i].lng + ',' + coords[i].lat;

                    if (i !== qnty - 1) {
                        coordsString += ';';
                    }
                }

                return coordsString;
            },

            /**
             * 把区域在地图上展示
             * @param {string} coordString  -- 包括区域坐标的字符串
             * @param {Object} map  --　地图对象
             * @param {string} name -- 区域名称
             */
            showAreaOnMap(coordString, map, name) {
                let coords = this.parseCoordinatesString(coordString);
                let polygon = this.createPolygon(coords);

                if (map) {
                    map.addOverlay(polygon);

                    if (name) {
                        this.showAreaName(name, polygon);
                    }
                }

                return polygon;
            },

            /**
             * 把区域坐标的字符串分成做标数组
             * @param {string} coordString  -- 包括区域坐标的字符串
             */
            parseCoordinatesString(coordString) {
                let coordArray = [];
                let vertices = coordString.split(';');
                let qnty = vertices.length;

                for (let i = 0; i < qnty; i++) {
                    let vertexString = vertices[i];
                    let vertexArray = vertexString.split(',');

                    coordArray.push([
                        Number(vertexArray[0]),
                        Number(vertexArray[1])
                    ]);
                }

                return coordArray;
            },

            /**
             * 创建多边形
             * @param {Array}  coords  --- 多边形顶点坐标
             */
            createPolygon(coords) {
                let points = [];
                let qnty = coords.length;

                for (let i = 0; i < qnty; i++) {
                    points.push(new BMap.Point(coords[i][0], coords[i][1]));
                }

                return new BMap.Polygon(points, {
                    strokeColor: 'red',    //边线颜色。
                    fillColor: 'red',      //填充颜色。当参数为空时，圆形将没有填充效果。
                    strokeWeight: 3,       //边线的宽度，以像素为单位。
                    strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
                    fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
                    strokeStyle: 'solid' //边线的样式，solid或dashed。
                });
            },

            /**
             * 显示区域名称
             * @param {string} name -- 区域名称
             * @param {Object} polygon -- 多边形对象
             */
            showAreaName(name, polygon) {
                let center = this.getPolygonCenter(polygon);

                this.showLabel(name, this.allAreasMap, center);
            },

            /**
             * 获取多边形的中心点
             * @param {Object} polygon -- 多边形对象
             */
            getPolygonCenter(polygon) {
                let bounds = polygon.getBounds();
                let center = bounds.getCenter();

                this.areaCenters.push(center);

                return center;
            },

            /**
             * 在地图上展示标签
             * @param {string} text -- 要显示的文字
             * @param {Object} map -- 地图对象
             * @param {Object} point -- 显示文字的位置
             */
            showLabel(text, map, point) {
                let label = new BMap.Label(text , {
                    offset: new BMap.Size(-20,-20),
                    position: point
                });

                map.addOverlay(label);
            },

            /**
             * 刷新form
             * @param {string} formName  -- form名称
             */
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            /**
             * 关闭弹框
             */
            closeDialog() {
                this.isAddFormShown = false;
            },

            /**
             * 编辑区域数据
             * @param {Object} row   -- 一条数据
             */
            async editAreaInfo(row) {
                let id = row.fId;
                let result = await AreasManagmentService.getAreaData(id);

                this.isEditMode = true;

                if (result.success) {
                    this.addAreaForm = result.obj;
                    this.showAreaDialog();

                    setTimeout(() => {
                        this.areaMap = this.initMap('area-map');
                        this.initDrawAreaMode();
                        this.mapOverlay = this.showAreaOnMap(this.addAreaForm.fLocationData, this.areaMap);

                        let center = this.getPolygonCenter(this.mapOverlay);

                        this.areaMap.setCenter(center);
                    }, 500);
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 删除区域
             * @param {Object} row   --- 一条数据
             */
            deleteAreaInfo(row) {
                this.$confirm('确定删除区域？', '', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(async () => {
                    let result = await AreasManagmentService.deleteAreaRecord(row.fId);

                    if (result.success) {
                        this.goToPage(1);
                    } else {
                        this.$message.error(result.msg);
                    }
                });
            },

            /**
             * 转到地图页面的时候，展示所有的区域
             * @param {Object} tab --- 标签对象
             */
            async handleMapTabClick(tab) {
                if (tab.name === 'map') {
                    this.allAreasMap.clearOverlays();
                    await this.getAllAreasCoords();
                    this.showAllAreas();
                    setTimeout(() => {
                        this.centerMap();
                    }, 500);
                }
            },

            /**
             * 获取所有区域定位信息
             * @returns {Promise<void>}
             */
            async getAllAreasCoords() {
                let result = await AreasManagmentService.getAreasLocationsData();

                if (result.success) {
                    this.areasCoords = result.obj;
                } else {
                    this.$message.error(result.msg);
                }
            },

            /**
             * 在地图上展示所有的区域
             */
            showAllAreas() {
                let locations = this.areasCoords;
                let qnty = locations.length;

                for (let i = 0; i < qnty; i++) {
                    this.showAreaOnMap(locations[i].fLocationData, this.allAreasMap, locations[i].fAreaName);
                }
            },

            /**
             * 把第一个区域位置为地图的中间
             */
            centerMap() {
                let firstCenter = this.areaCenters[0];

                this.allAreasMap.panTo(firstCenter);
            },

            /**
             * 换城市
             * @param {string} city
             */
            changeLocation() {
                this.areaMap.setCenter(this.mapCity);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    .area-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;

        .container {
            padding: 15px 10px;
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

    .input-form {
        .input-volume {
            width: 200px;
        }

        .input-card {
            margin-bottom: 15px;
        }
    }

    .select,
    .input-item {
        &.longer {
            width: 220px;
        }
    }

    .dialog-sub-header {
        height: auto !important;
        padding: 20px 0 5px;
        margin-bottom: 15px;
        border-bottom: solid 1px #ebeef5;
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

    .map {
        width: 100%;
        height: 70vh;
    }

    .margin-top15 {
        margin-top: 15px;
    }

    .mandatory-field {
        color: #F56C6C;
        margin-right: 4px;
    }

    .margin-right15 {
        margin-right: 15px;
    }
</style>
