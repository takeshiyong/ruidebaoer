/*
* @Author: 元实
* @Date:   2019-09-04
* @Description:   api封装： 保养管理
*/

import req from '@/utils/request';

// 1.设备保养记录
export const CareRecordsService = {
    //查询设备类型
    getEquipmentTypesData: () => req.get('/device-service/equipmentTypeInfo/selectAll'),

    //获取所有的人员
    getAllPersonnelData: () => req.get('/user-service/employee/selectall'),

    //获取所有的设备
    getAllEquipmentData: () => req.get('/device-service/equipment/selectAll'),

    //查询设备级别
    getEquipmentLevelsData: () => req.post('/device-service/level/selectAll'),

    //查询部门
    getDepartmentsData: () => req.get('/user-service/departement/selectall'),

    //查询生产广商
    getManufacturersData: () => req.post('/device-service/manufacturer/selectAll'),

    //查询保养记录
    getCareRecordsData: (params) => req.post('/device-security-service/maintainRecordEquipment/selectMaintainRecordByAll', params),

    //查询保养记录详情
    getCareRecordDetails: (id) => req.get(`/device-security-service/maintainRecordEquipment/selectRecordDetailsDTOForPC/${id}`),

    //编辑保养记录
    updateCareRecord: (params) => req.post('/device-security-service/maintainRecordEquipment/updateEquipmentRecorfDTOForPC', params),

    //导出excel
    downloadDocument: () => req.get('/device-security-service/maintainRecordEquipment/exportExcel'),
}
