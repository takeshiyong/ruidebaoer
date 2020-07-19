/*
* @Author: 元实
* @Date:   2019-09-04
* @Description:   api封装： 保养管理
*/

import req from '@/utils/request';

// 1.设备保养
export const CareService = {
    //查询设备类型
    getEquipmentTypesData: () => req.get('/device-service/equipmentTypeInfo/selectAll'),

    //查询设备保养项
    getCareItemsData: (params) => req.post('/device-security-service/maintainItems/selectByPage', params),

    //查询维护要点
    getProtectEssentialsData: (params) => req.post('/device-security-service/maintainPoints/selectByPage', params),

    //添加设备保养项
    insertCareItemRecord: (params) => req.post('/device-security-service/maintainItems/add', params),

    //删除设备保养项
    deleteCareItemRecord: (fId) => req.get(`/device-security-service/maintainItems/logicDelete/${fId}`),

    //添加维护要点
    insertProtectRecord: (params) => req.post('/device-security-service/maintainPoints/add', params),

    //删除维护要点
    deleteProtectRecord: (fId) => req.post(`/device-security-service/maintainPoints/logicDelete/${fId}`),
}
