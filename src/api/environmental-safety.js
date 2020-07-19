/*
* @Author: 赵磊
* @Date:   2019-08-13 09:44:04
* @Description:   api封装： 环境安全
* 1.危险场所管理
* 2.视频监控管理
* 3.边坡监测管理
* 4.环保监测管理
* 5.气象监测管理
*/

import req from '@/utils/request';

// 1.危险场所管理

// 2.视频监控管理

// 3.边坡监测管理

// 4.环保监测管理
// 4.1监测点
export const MonitorService = {
    // 新增监测点
    addMonitor:(params)=>req.post('/environment-security-service/monitor/add',params),
    // 修改监测点
    updateMonitor:(params)=>req.post('/environment-security-service/monitor/update',params),
    // 批量删除监测点
    deleteMonitorByBatch:(params)=>req.post('/environment-security-service/monitor/deletebybatch',params),
    // 分页查询监测点
    selectMonitorsByPage:(params)=>req.post('/environment-security-service/monitor/selectbypage',params),
    // 查询全部
    selectAll:()=>req.get('/environment-security-service/monitor/selectall'),
}
// 4.2监测点参数
export const MonitorParamService = {
    // 新增监测点参数
    addMonitorParam:(params)=>req.post('/environment-security-service/monitorparam/add',params),
    // 修改监测点参数
    updateMonitorParam:(params)=>req.post('/environment-security-service/monitorparam/update',params),
    // 批量删除监测点参数
    deleteMonitorParamByBatch:(params)=>req.post('/environment-security-service/monitorparam/deletebatch',params),
    // 分页查询监测点参数
    selectMonitorParamsByPage:(params)=>req.post('/environment-security-service/monitorparam/selectbypage',params),
}
// 4.3监测数据
export const monitorDataService = {
    // 全查监测点
    selectAllPoint:()=>req.get('/environment-security-service//monitor/selectall'),
    // 查询监测点最新数据
    selectDataByPoint:(params)=>req.get(`/environment-security-service/monitordata/selectlastrecord/${params}`),
    // 获取统计图数据
    selectStatustucs: (params)=> req.post(`/environment-security-service/monitordata/statistics`, params)
}

// 5.气象监测管理
// 5.1气象城市
export const WeatherCityService = {
    // 新增城市
    addCity:(params)=>req.post('/environment-security-service/city/add',params),
    // 修改城市
    updateCity:(params)=>req.post('/environment-security-service/city/update',params),
    // 批量删除城市
    deleteCityByBatch:(params)=>req.post('/environment-security-service/city/deletebatch',params),
    // 分页查询城市
    selectCityByPage:(params)=>req.post('/environment-security-service/city/selectbypage',params),
}
// 5.2气象数据
export const weatherDataService = {
    // 全查气象城市
    selectAllCitys:()=>req.get('/environment-security-service/city/selectall'),
    // 查询城市最新天气数据
    selectRealTimeData:(params)=>req.get('/environment-security-service/meteorological/realTimeData/'+params),
    // 获取天气预报
    selectPrediction:(params)=>req.get('/environment-security-service/meteorological/prediction/'+params),
}