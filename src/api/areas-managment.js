/*
* @Author: 元实
* @Date:   2019-08-29
* @Description:   api封装： 区域管理
*/

import req from '@/utils/request';

// 1.设备信息
export const AreasManagmentService = {
    //分页查询的区域
    getAreasDataByPage: (params) => req.post('/device-service/area/selectByPage', params),

    //全查区域
    getAllAreasData: () => req.post('/device-service/area/selectAll'),

    //查询部门
    getDepartmentsData: () => req.get('/user-service/departement/selectall'),

    //查询设备类型
    getEquipmentTypesData: () => req.get('/device-service/equipmentTypeInfo/selectAll'),

    //查询设备级别
    getEquipmentLevelsData: () => req.post('/device-service/level/selectAll'),

    //添加区域
    insertAreaRecord: (params) => req.post('/device-service/area/add', params),

    //编辑区域
    updateAreaRecord: (params) => req.post('/device-service/area/update', params),

    //删除区域
    deleteAreaRecord: (fId) => req.get(`/device-service/area/logicDelete/${fId}`),

    //获取区域数据
    getAreaData: (fId) => req.get(`/device-service/area/selectById/${fId}`),

    //获取区域定位信息
    getAreasLocationsData: () => req.post('/device-service/area/selectAllAreaLocation')
}
