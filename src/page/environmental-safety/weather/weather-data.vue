/*
 * @Author: 赵磊
 * @Date:   2019-08-13
 * @Description: '气象数据'
 */
<template>
    <div class="weather-data-page">
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
                                <el-col :key="item.fId" :span="24/cityArr.length" v-for="item in cityArr" class="tips-view" >
                                    <div style="width: 100%;display: flex;align-items: center;justify-content: center" @click="changeCurrentCity(item)">
                                        <div :class="`cricle-view ${activefId == item.fId ? 'cricle-view-active' : ''}`"/>
                                        <span :class="`tips-text ${activefId == item.fId ? 'tips-text-active' : ''}`">
                                          {{item.fCityName}}
                                        </span>
                                    </div>
                                </el-col>
                            </el-row>
                            <div class="content-view">
                                <div class="content-item">
                                    <div>
                                        <img src="@/assets/img/weather/tianqi.png" style="width: 40px;height: 40px"/>
                                        <span>天气: </span>
                                    </div>
                                    <span class="value">{{RealTimeData.weather == null ? '':RealTimeData.weather}}</span>
                                </div>
                                <div class="content-item">
                                    <div>
                                        <img src="@/assets/img/weather/wendu.png" style="width: 40px;height: 40px"/>
                                        <span>温度: </span>
                                    </div>
                                    <span class="value">{{RealTimeData.temperature == null ? '':RealTimeData.temperature+'℃'}}</span>
                                </div>
                                <div class="content-item">
                                    <div>
                                        <img src="@/assets/img/weather/shidu.png" style="width: 40px;height: 40px"/>
                                        <span>湿度: </span>
                                    </div>
                                    <span class="value">{{RealTimeData.humidity == null ? '':RealTimeData.humidity+'%RH'}}</span>
                                </div>
                                <div class="content-item">
                                    <div>
                                        <img src="@/assets/img/weather/fengxiang.png" style="width: 40px;height: 40px"/>
                                        <span>风向: </span>
                                    </div>
                                    <span class="value">{{RealTimeData.winddirection == null ? '':RealTimeData.winddirection}}</span>
                                </div>
                                <div class="content-item">
                                    <div>
                                        <img src="@/assets/img/weather/fengli.png" style="width: 40px;height: 40px"/>
                                        <span>风力: </span>
                                    </div>
                                    <span class="value">{{RealTimeData.windpower == null ? '':RealTimeData.windpower+'级'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="19" :md="7" :sm="9" :xs="24">
                    <div class="right">
                        <el-tabs v-model="tabsName" ref="tabs" type="border-card" class="weather-tabs">
                            <el-tab-pane name="weatherForecast" label="气象预报">
                                <div class="tab-content">
                                    <div v-if="casts.length > 0" style="padding: 0px 20px;">
                                        <el-row :gutter="20" v-for="(cast,index) in casts" :key="index">
                                            <el-col :span="3" style="font-size:20px;line-height: 28px;padding-top: 34px;text-align: center;">
                                                <div v-if="index == 0">今天</div>
                                                <div v-else-if="index == 1">明天</div>
                                                <div v-else-if="index == 2">后天</div>
                                                <div v-else>{{cast.week}}</div>
                                                <div style="font-size:14px;color: #727272;">
                                                    {{cast.date}}
                                                </div>
                                            </el-col>
                                            <el-col :span="21" style="border-bottom: 1px dashed #ccc;line-height: 100px;">
                                                <el-row :gutter="20">
                                                    <el-col :span="12">
                                                        <el-row>
                                                            <el-col :span="4">
                                                                白天：
                                                            </el-col>
                                                            <el-col :span="4" style="color:red;font-size:16px;">
                                                                {{cast.daytemp}}℃
                                                            </el-col>
                                                            <el-col :span="4">
                                                                <img v-if="cast.dayweather == '晴'|| cast.dayweather == '少云' || cast.dayweather == '有风' || cast.dayweather == '平静' || cast.dayweather == '微风' || cast.dayweather == '和风' || cast.dayweather == '清风' || cast.dayweather == '热'" src="@/assets/img/weather/晴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '晴间多云' || cast.dayweather == '多云'" src="@/assets/img/weather/多云.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雷阵雨' || cast.dayweather == '强阵雨' || cast.dayweather == '强雷阵雨' || cast.dayweather == '极端降雨'" src="@/assets/img/weather/雷阵雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大雨' || cast.dayweather == '中雨-大雨'" src="@/assets/img/weather/大雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大暴雨' || cast.dayweather == '暴雨-大暴雨'" src="@/assets/img/weather/大暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '暴雨' || cast.dayweather == '大雨-暴雨'" src="@/assets/img/weather/暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雷阵雨并伴有冰雹'" src="@/assets/img/weather/雷阵雨伴有冰雹.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '小雨' || cast.dayweather == '毛毛雨/细雨'" src="@/assets/img/weather/小雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '特大暴雨' || cast.dayweather == '大暴雨-特大暴雨'" src="@/assets/img/weather/特大暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阴'" src="@/assets/img/weather/阴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '中雨' || cast.dayweather == '雨' || cast.dayweather == '小雨-中雨'" src="@/assets/img/weather/中雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雨雪天气' || cast.dayweather == '雨夹雪' || cast.dayweather == '阵雨夹雪'" src="@/assets/img/weather/雨夹雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阵雨'" src="@/assets/img/weather/阵雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阵雪'" src="@/assets/img/weather/阵雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '暴雪' || cast.dayweather == '大雪-暴雪'" src="@/assets/img/weather/暴雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大雪' || cast.dayweather == '中雪-大雪'" src="@/assets/img/weather/大雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '冻雨'" src="@/assets/img/weather/冻雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '沙尘暴'" src="@/assets/img/weather/沙尘暴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '浮尘'" src="@/assets/img/weather/浮尘.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雾' || cast.dayweather == '浓雾' || cast.dayweather == '强浓雾' || cast.dayweather == '轻雾' || cast.dayweather == '大雾' || cast.dayweather == '特强浓雾'" src="@/assets/img/weather/雾.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '强沙尘暴'" src="@/assets/img/weather/强沙尘暴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '小雪'" src="@/assets/img/weather/小雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '霾' || cast.dayweather == '中度霾' || cast.dayweather == '重度霾' || cast.dayweather == '严重霾'" src="@/assets/img/weather/雾霾.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '强风/劲风' || cast.dayweather == '疾风' || cast.dayweather == '大风' || cast.dayweather == '烈风' || cast.dayweather == '扬沙'" src="@/assets/img/weather/扬沙.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雪' || cast.dayweather == '中雪' || cast.dayweather == '小雪-中雪'" src="@/assets/img/weather/中雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else src="@/assets/img/weather/无数据.png" height="40" width="40" alt="" class="mb_14">
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.dayweather}}
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.daywind}}
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.daypower}}级
                                                            </el-col>
                                                        </el-row>
                                                    </el-col>
                                                    <el-col :span="12">
                                                        <el-row>
                                                            <el-col :span="4">
                                                                夜晚：
                                                            </el-col>
                                                            <el-col :span="4" style="color:red;font-size:16px;">
                                                                {{cast.nighttemp}}℃
                                                            </el-col>
                                                            <el-col :span="4">
                                                                <img v-if="cast.dayweather == '晴'|| cast.dayweather == '少云' || cast.dayweather == '有风' || cast.dayweather == '平静' || cast.dayweather == '微风' || cast.dayweather == '和风' || cast.dayweather == '清风' || cast.dayweather == '热'" src="@/assets/img/weather/夜·晴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '晴间多云' || cast.dayweather == '多云'" src="@/assets/img/weather/夜·多云.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雷阵雨' || cast.dayweather == '强阵雨' || cast.dayweather == '强雷阵雨' || cast.dayweather == '极端降雨'" src="@/assets/img/weather/雷阵雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大雨' || cast.dayweather == '中雨-大雨'" src="@/assets/img/weather/大雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大暴雨' || cast.dayweather == '暴雨-大暴雨'" src="@/assets/img/weather/大暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '暴雨' || cast.dayweather == '大雨-暴雨'" src="@/assets/img/weather/暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雷阵雨并伴有冰雹'" src="@/assets/img/weather/雷阵雨伴有冰雹.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '小雨' || cast.dayweather == '毛毛雨/细雨'" src="@/assets/img/weather/小雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '特大暴雨' || cast.dayweather == '大暴雨-特大暴雨'" src="@/assets/img/weather/特大暴雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阴'" src="@/assets/img/weather/阴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '中雨' || cast.dayweather == '雨' || cast.dayweather == '小雨-中雨'" src="@/assets/img/weather/中雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雨雪天气' || cast.dayweather == '雨夹雪' || cast.dayweather == '阵雨夹雪'" src="@/assets/img/weather/雨夹雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阵雨'" src="@/assets/img/weather/夜·阵雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '阵雪'" src="@/assets/img/weather/夜·阵雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '暴雪' || cast.dayweather == '大雪-暴雪'" src="@/assets/img/weather/暴雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '大雪' || cast.dayweather == '中雪-大雪'" src="@/assets/img/weather/大雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '冻雨'" src="@/assets/img/weather/冻雨.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '沙尘暴'" src="@/assets/img/weather/沙尘暴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '浮尘'" src="@/assets/img/weather/浮尘.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雾' || cast.dayweather == '浓雾' || cast.dayweather == '强浓雾' || cast.dayweather == '轻雾' || cast.dayweather == '大雾' || cast.dayweather == '特强浓雾'" src="@/assets/img/weather/夜·雾.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '强沙尘暴'" src="@/assets/img/weather/强沙尘暴.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '小雪'" src="@/assets/img/weather/小雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '霾' || cast.dayweather == '中度霾' || cast.dayweather == '重度霾' || cast.dayweather == '严重霾'" src="@/assets/img/weather/雾霾.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '强风/劲风' || cast.dayweather == '疾风' || cast.dayweather == '大风' || cast.dayweather == '烈风' || cast.dayweather == '扬沙'" src="@/assets/img/weather/扬沙.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else-if="cast.dayweather == '雪' || cast.dayweather == '中雪' || cast.dayweather == '小雪-中雪'" src="@/assets/img/weather/中雪.png" height="40" width="40" alt="" class="mb_14">
                                                                <img v-else src="@/assets/img/weather/无数据.png" height="40" width="40" alt="" class="mb_14">
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.nightweather}}
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.nightwind}}
                                                            </el-col>
                                                            <el-col :span="4">
                                                                {{cast.nightpower}}级
                                                            </el-col>
                                                        </el-row>

                                                    </el-col>
                                                </el-row>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    import { weatherDataService } from '@/api/environmental-safety';
    export default {
        data () {
            return {
                cityArr: [],
                activefId: '',
                paramValue: [],
                newTime: '--',
                paramActive: '',
                tabsName: 'weatherForecast',
                RealTimeData: {},// 实时气象数据
                casts: [], // 天气预报
            }
        },
        components: {
        },
        mounted:function() {
            this.init();
        },
        methods: {
            /**
             * 获取最新数据
             */
            init() {
                this.getAllCitys();
            },
            /**
             * 获取所有气象城市
             */
            async getAllCitys() {
                let res = await weatherDataService.selectAllCitys();
                if (res.success) {
                    this.cityArr = res.obj;
                    if (res.obj.length > 0) {
                        this.activefId = res.obj[0].fId;
                        this.getWeatherDataByCode(res.obj[0]);
                        this.getForecast(res.obj[0]);
                    }
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 切换当前选中监测点
             */
            changeCurrentCity (item) {
                if (this.activefId == item.fId) {
                    return;
                }
                this.activefId = item.fId;
                this.getWeatherDataByCode(item);
                this.getForecast(item);
            },
            /**
             * 获取指定检测点的最新数据
             */
            async getWeatherDataByCode(item) {
                const res = await weatherDataService.selectRealTimeData(item.fCityAdcode);
                if (res.success && res.obj != null) {
                    this.newTime = res.obj[0].reporttime || '--';
                    this.RealTimeData = res.obj[0];
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 获取天气预报
             */
            async getForecast(item){
                let res = await weatherDataService.selectPrediction(item.fCityAdcode);
                if(res.success){
                    let a = 0;
                    if (res.obj.forecasts[a].casts.length > 0) {
                        for(let b of res.obj.forecasts[a].casts) {
                            switch(b.week) {
                                case '1':
                                    b.week = '星期一';
                                    break;
                                case '2':
                                    b.week = '星期二';
                                    break;
                                case '3':
                                    b.week = '星期三';
                                    break;
                                case '4':
                                    b.week = '星期四';
                                    break;
                                case '5':
                                    b.week = '星期五';
                                    break;
                                case '6':
                                    b.week = '星期六';
                                    break;
                                case '7':
                                    b.week = '星期日';
                                    break;
                            }
                        }
                        this.casts = res.obj.forecasts[a].casts;
                    }
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 切换参数显示不同统计图
             */
            changStatistics(item) {
                if (this.paramActive == item.fId) {
                    return;
                }
                this.paramActive = item.fId;
                this.getPointStatistics(item);
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .weather-data-page {
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
        }
        .tab-content {
            width: 100%;
            height: calc(100vh - 190px);
            justify-content: flex-start;
            align-items: flex-start;
            .time-header {
                display: flex;
                align-items: center;
            }
        }
        .right {
            .weather-tabs {
                box-shadow: none!important;
            }
            height: calc(100vh - 130px);
            padding: 10px 20px;
        }
    }
    .mb_14 {
        margin-bottom: -14px;
    }
</style>