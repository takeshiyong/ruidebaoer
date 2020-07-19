/*
* @Author: 元实
* @Date:   2019-08-27
* @Description:   api封装： 设备信息，定位
*/

import req from '@/utils/request';

// 1.设备信息
export const EquipmentService = {
    //分页查询设备
    getEquipmentDataByPage: (params) => req.post('/device-service/equipment/selectByPage', params),

    //查询设备类型
    getEquipmentTypesData: () => req.get('/device-service/equipmentTypeInfo/selectAll'),

    //查询区域
    getAreasData: () => req.post('/device-service/area/selectAll'),

    //查询设备级别
    getEquipmentLevelsData: () => req.post('/device-service/level/selectAll'),

    //查询设备级别
    getEquipmentParamsData: (typeId) => req.get(`/device-service/equipmentAttribute/selectByTypeId/${typeId}`),

    //查询生产广商
    getManufacturersData: () => req.post('/device-service/manufacturer/selectAll'),

    //添加设备信息
    insertEquipmentRecord: (params) => req.post('/device-service/equipment/add', params),

    //编辑设备信息
    updateEquipmentRecord: (params) => req.post('/device-service/equipment/update', params),

    //获取预更新设备详情信息
    getEditDetailesData: (fId) => req.get(`/device-service/equipment/preUpdate/${fId}`),

    //获取设备信息详情
    getEquipmentDetailesData: (fId) => req.get(`/device-service/equipment/selectDetailsByFId/${fId}`),

    //删除设备信息
    deleteEquipmentData: (fId) => req.get(`/device-service/equipment/deleteEquipment/${fId}`),

    //获取设备定位信息
    getEquipmentLocationData: () => req.get('/device-service/location/selectAll'),

    //获取设备定位信息详情
    getEquipmentLocationDetails: (fId) => req.get(`/device-service/location/selectByEquipmentId/${fId}`),

    //获取对应设备类型的设备型号
    getAllModels: () => req.post('/device-service/typeModel/selectAll'),
};

// 2.设备资料列表
export const EquipmentInfoService = {
    //获取设备类型
    getEquipmentTypes: () => req.get('/device-service/equipmentTypeInfo/selectAll'),

    //获取对应设备类型的设备型号
    getEquipmentModelsForType: params => req.post('/device-service/typeModel/select', params),

    //获取对应设备类型的设备型号
    getEquipmentModel: params => req.post('/device-service/typeModel/search', params),

    //获取对应设备类型的设备型号
    getModelFiles: params => req.post('/device-service/equipmentKnowledgeFile/select', params),

    //添加设备型号
    insertEquipModel: params => req.post('/device-service/typeModel/insert', params),

    //获取对应设备类型的设备型号
    getAllModels: () => req.post('/device-service/typeModel/selectAll'),

    //添加设备文件
    insertEquipDoc: params => req.post('/device-service/equipmentKnowledgeFile/insert', params),

    //获取所有的人员
    getAllPersonnel: () => req.get('/user-service/employee/selectall'),

    //删除设备文件
    deleteDocument: fId => req.get(`/device-service/equipmentKnowledgeFile/delete/${fId}`),
}


