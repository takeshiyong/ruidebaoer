/*
* @Author: 王侃
* @Date:   2019-08-19 17:15:28
* @Description:   api封装： 设备中心 1.设备大类 2.设备类型 3.设备类型属性 4.设备信息 5.生产厂商 6.区域管理 7.车间信息管理
*/

import req from '@/utils/request';

// 1.设备大类
export const GeneraService = {
    // 获取设备大类
    getGenera:(params)=>req.get('/device-service/equipmentType/selectAll'),
    // 获取设备大类信息
    getGeneraInfo:(params)=>req.get('/device-service/equipmentType/selectById/'+params),
    // 新增
    insertGenera:(params)=>req.post('/device-service/equipmentType/insert',params),
    // 修改
    updateGenera:(params)=>req.post('/device-service/equipmentType/update',params),
    // 删除
    deleteGenera:(params)=>req.post('/device-service/equipmentType/delete/'+params),
}
// 2.设备类型
export const TypeService = {
    // 获取设备类型
    getType:(params)=>req.get('/device-service/equipmentTypeInfo/selectAll'),
    // 获取设备类型信息
    getTypeInfo:(params)=>req.get('/device-service/equipmentTypeInfo/selectById/'+params),
    // 获取设备类型（通过设备大类id）
    selectByType:(params)=>req.get('/device-service/equipmentTypeInfo/selectByType/'+params),
    // 新增
    insertType:(params)=>req.post('/device-service/equipmentTypeInfo/insert',params),
    // 修改
    updateType:(params)=>req.post('/device-service/equipmentTypeInfo/update',params),
    // 删除
    deleteType:(params)=>req.post('/device-service/equipmentTypeInfo/delete/'+params),
}
// 3.设备类型属性
export const AttributeService = {
    // 获取设备类型属性
    getAttribute:(params)=>req.get('/device-service/equipmentAttribute/selectAll'),
    // 获取设备类型属性信息
    getAttributeInfo:(params)=>req.get('/device-service/equipmentAttribute/selectByTypeId/'+params),
    // 新增
    insertAttribute:(params)=>req.post('/device-service/equipmentAttribute/insert',params),
    // 修改
    updateAttribute:(params)=>req.post('/device-service/equipmentAttribute/update',params),
    // 删除
    deleteAttribute:(params)=>req.post('/device-service/equipmentAttribute/delete/'+params),
}
// 4.设备信息

// 5.生产厂商
export const ManufacturerService = {
    // 获取生产厂商(不分页)
    getManufacturer:(params)=>req.post('/device-service/manufacturer/selectAll'),
    // 获取生产厂商(分页)
    getManufacturerByPage:(params)=>req.post('/device-service/manufacturer/selectByPage',params),
    // 新增
    insertManufacturer:(params)=>req.post('/device-service/manufacturer/add',params),
    // 修改
    updateManufacturer:(params)=>req.post('/device-service/manufacturer/update',params),
    // 删除
    deleteManufacturer:(params)=>req.get('/device-service/manufacturer/logicDelete/'+params),
}
// 6.区域管理

// 7.车间信息管理