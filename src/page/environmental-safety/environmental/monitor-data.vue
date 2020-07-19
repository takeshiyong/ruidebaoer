/*
 * @Author: 赵磊
 * @Date:   2019-08-13
 * @Description: '监测数据'
 */
<template>
    <div class="monitor-data-page">
        <div class="container">
            <el-row>
                <el-col :lg="5" :md="7" :sm="9" :xs="24">
                    <div class="left-sidebar">
                        <div class="header">
                            <span>最新数据（{{newTime}}）</span>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <el-row style="padding: 0px 20px 0px 10px;">
                                <el-col :key="item.fId" :span="24/pointArr.length" v-for="item in pointArr" class="tips-view" >
                                    <div style="width: 100%;display: flex;align-items: center;justify-content: center" @click="changeCurrentPoint(item)">
                                        <div :class="`cricle-view ${activefId == item.fId ? 'cricle-view-active' : ''}`"/>
                                        <span :class="`tips-text ${activefId == item.fId ? 'tips-text-active' : ''}`">
                                            {{item.fName}}
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="content-view">
                                <div v-for="item in paramValue" :key="item.fId" class="content-item" @click="changStatistics(item)">
                                    <div>
                                        <img  v-if="item.name == 'pm2.5'" src="@/assets/img/weather/pm2.5.png" style="width: 40px;height: 40px"/>
                                        <img v-if="item.name == 'pm10'"  src="@/assets/img/weather/pm10.png" style="width: 40px;height: 40px"/>
                                        <img v-if="item.name == '温度'" src="@/assets/img/weather/wendu.png" style="width: 40px;height: 40px"/>
                                        <img v-if="item.name == '湿度'" src="@/assets/img/weather/shidu.png" style="width: 40px;height: 40px"/>
                                        <img v-if="item.name == '噪音'" src="@/assets/img/weather/zaoyin.png" style="width: 40px;height: 40px"/>
                                        <img v-if="item.name == '风力'" src="@/assets/img/weather/fengli.png" style="width: 40px;height: 40px"/>
                                        <span :style="`${paramActive == item.fId ? 'color: #68B7FD': ''}`">{{item.name}}({{item.unit}})</span>
                                    </div>
                                    <span  class="value" :style="`${paramActive == item.fId ? 'color: #68B7FD': ''}`">{{item.value}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="19" :md="7" :sm="9" :xs="24">
                    <div class="right-list">
                        <el-form :inline="true" :model="searchParam" class="demo-form-inline search-form" label-width="80px">
                            <el-form-item label="查询时间">
                                <el-date-picker
                                    v-model="searchParam.timeRange"
                                    type="datetimerange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']"
                                    :clearable="false"
                                    popper-class="disabled-clear"
                                    class="input-picker"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getPointStatistics(false,currentParam)">搜索</el-button>
                            </el-form-item>
                        </el-form>
                        <div id="echarts" class="echarts-div"></div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { monitorDataService } from '@/api/environmental-safety';
    import echarts from 'echarts';
    import moment from 'moment';
    export default {
        data () {
            return {
                pointArr: [],
                activefId: '',// 当前监测点id
                paramValue: [],
                newTime: '--',// 最新时间
                paramActive: '',// 当前参数od
                currentParam: {},// 当前参数
                searchParam: {
                    timeRange: [
                        new Date(new Date().getTime() - 8.64e7 * 1),
                        new Date()
                    ],
                },
            };
        },
        components: {
        },
        mounted() {
            this.init();
        },
        methods: {
            /**
             * 获取最新数据
             */
            init() {
                this.getAllSelect();
            },
            /**
             * 获取所有监测点
             */
            async getAllSelect() {
                let res = await monitorDataService.selectAllPoint();
                if (res.success) {
                    this.pointArr = res.obj;
                    if (res.obj.length > 0) {
                        this.activefId = res.obj[0].fId;
                        this.getPointDataById(res.obj[0]);
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 切换当前选中监测点
             */
            changeCurrentPoint (item) {
                if (this.activefId == item.fId) {
                    return;
                }
                this.activefId = item.fId;
                this.getPointDataById(item);
            },
            /**
             * 获取指定检测点的最新数据
             */
            async getPointDataById(item) {
                const res = await monitorDataService.selectDataByPoint(item.fId);
                if (res.success) {
                    this.newTime = res.obj.recentReportTime || '--';
                    let arr = [];
                    for (let obj in res.obj.paramValue) {
                        arr.push({name: obj, fId: res.obj.paramValue[obj].fId, value: res.obj.paramValue[obj].value,unit: res.obj.paramValue[obj].unit});
                    }
                    this.paramValue= arr;
                    if (arr.length > 0) {
                        this.getPointStatistics(false,arr[0]);
                        this.paramActive = arr[0].fId;
                        this.currentParam = arr[0];
                    }else{
                        this.getPointStatistics(true,arr[0]);
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 获取统计图数据
             */
            async getPointStatistics(clear,item) {
                if(clear){
                    let data = [];
                    this.initEcharts(data);
                }else{
                    const param ={};
                    param.monitorId = this.activefId;
                    param.paramId = item.fId;
                    param.searchBeginTime = moment(this.searchParam.timeRange[0].getTime()).format('YYYY-MM-DD HH:mm:ss');
                    param.searchEndTime = moment(this.searchParam.timeRange[1].getTime()).format('YYYY-MM-DD HH:mm:ss');
                    const res = await monitorDataService.selectStatustucs(param);
                    if (res.success) {
                        if(this.searchParam.timeRange[0].getTime() < this.searchParam.timeRange[1].getTime() - 8.64e7){
                            this.initScatter(res.obj);
                        }else{
                            this.initEcharts(res.obj);
                        }
                    } else {
                        this.$message.warning(res.msg);
                    }
                }
                return;
            },
            /**
             * 初始化趋势图
             */
            initEcharts(dataArray){
                let dateList = [];
                let dataList = [];
                for(let item of dataArray){
                    dateList.push(item.fReportTime);
                    dataList.push(item.fValue);
                }
                echarts.dispose(document.getElementById('echarts'));
                let myChart = echarts.init(document.getElementById('echarts'));
                let echartTitle = this.currentParam.name+'变化趋势图';
                let option = {
                    title: {
                        text: echartTitle,
                        left: 'center',
                        textStyle: {
                            fontSize: 22
                        }
                    },
                    grid: {
                        width: '80%',
                        left: '10%',
                        height: '67%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                    },
                    xAxis: {
                        name: '时间',
                        type: 'category',
                        boundaryGap: false,
                        data: dateList
                    },
                    yAxis: {
                        name: this.currentParam.name+'('+this.currentParam.unit+')',
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },
                    series: [
                        {
                            name:this.currentParam.name,
                            type:'line',
                            smooth:true,
                            symbol: 'none',
                            sampling: 'average',
                            itemStyle: {
                                color: 'rgb(93,155,218)'
                            },
                            areaStyle: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(93,147,201)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(243,251,254)'
                                }])
                            },
                            data: dataList
                        }
                    ]
                };
                myChart.setOption(option);
            },
            /**
             * 初始化散点图
             */
            initScatter(dataArray){
                let dataList = [];
                for(let item of dataArray){
                    let temp = [];
                    temp.push(item.fReportTime);
                    temp.push(item.fValue);
                    dataList.push(temp);
                }
                echarts.dispose(document.getElementById('echarts'));
                let myChart = echarts.init(document.getElementById('echarts'));
                let echartTitle = this.currentParam.name+'超标数据散点图';
                let option = {
                    title: {
                        text: echartTitle,
                        left: 'center',
                        textStyle: {
                            fontSize: 22
                        }
                    },
                    grid: {
                        width: '80%',
                        left: '10%',
                        height: '67%'
                    },
                    tooltip: {
                        trigger: 'axis',
                        position: function (pt) {
                            return [pt[0], '10%'];
                        },
                    },
                    xAxis: {
                        name: '时间',
                        type: 'category',
                        boundaryGap: false,
                        // data: dateList
                    },
                    yAxis: {
                        name: this.currentParam.name+'('+this.currentParam.unit+')',
                        type: 'value',
                        boundaryGap: [0, '100%']
                    },

                    series: [
                        {
                            name:this.currentParam.name,
                            type:'scatter',
                            symbolSize: 20,
                            data: dataList
                        }
                    ]
                };
                myChart.setOption(option);
            },
            /**
             * 切换参数显示不同统计图
             */
            changStatistics(item) {
                if (this.paramActive == item.fId) {
                    return;
                }
                this.paramActive = item.fId;
                this.currentParam = item;
                this.getPointStatistics(false,item);
            }
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .monitor-data-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            .left-sidebar { // 左侧
                height: calc(100vh - 90px);
                border-right: 1px solid #F1F1F1;
                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
                    font-size: 16px;
                }
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    padding: 20px 0px 0px 0px;
                    height: calc(100vh - 171px);
                    overflow-y: auto;
                    .cricle-view {
                        width: 15px;
                        height: 15px;
                        border-radius: 50px;
                        background-color: #969696;
                        margin-right: 10px
                    }
                    .cricle-view-active {
                        background-color: #68B7FD;
                    }
                    .tips-view {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        cursor: pointer;
                    }
                    .tips-text {
                        color: #969696;
                        font-size: 14px;
                    }
                    .tips-text-active {
                        color: #68B7FD;
                    }
                    .content-view {
                        height: calc(100vh - 240px);
                        margin-top: 10px;
                        display: flex;
                        flex-direction: column;
                        .content-item {
                            flex: 1;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 0 40px 0 25px;
                            cursor: pointer;
                            .value {
                                color: #000;
                                font-size: 18px;
                            }
                        }
                        .content-item:hover {
                            background-color: #f1f1f1
                        }
                        .content-item > div {
                            display: flex;
                            align-items: center;
                        }
                        .content-item > div > span {
                            font-size: 16px;
                            margin-left: 10px;
                        }
                    }
                }
            }
            .right-list { // 右侧
                height: calc(100vh - 130px) ;
                padding: 20px 20px;
                .echarts-div {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
</style>