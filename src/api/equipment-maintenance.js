/*
* @Author: 元实
* @Date:   2019-08-21
* @Description:   api封装： 设备维修
*/

import req from '@/utils/request';

// 1.设备维修
export const MaintenanceService = {
    //查询维修类型
    getMaintenanceTypesData: () => req.get('/device-security-service/maintenanceType/selectAll'),

    //新建维修类型
    insertMaintenanceTypeData: (params) => req.post('/device-security-service/maintenanceType/insert', params),

    //修改维修类型
    updateMaintenanceTypeData: (params) => req.post('/device-security-service/maintenanceType/update', params),

    //删除维修类型
    deleteMaintenanceTypeData: (fId) => req.post(`/device-security-service/maintenanceType/delete/${fId}`),

    //获取部门
    getDepartmentsData: () => req.get('/user-service/departement/selectall'),

    //按照部门id ，获取人员
    getDepartmentPersonnelData: (depId) => req.get(`/user-service/employee/selectbydepid/${depId}`),

    //获取所有的人员
    getAllPersonnelData: () => req.get('/user-service/employee/selectall'),

    //获取所有的设备
    getAllEquipmentData: () => req.get('/device-service/equipment/selectAll'),

    //提交设备维修数据
    insertMaintenanceRecord: (params) => req.post('/device-security-service/equipmentbMaintenancePlan/insertRecord', params),

    //获取设备级别
    getAllEquipmentLevelsData: () => req.post('/device-service/level/selectAll'),

    //获取设备广商
    getAllManufacturesData: () => req.post('/device-service/manufacturer/selectAll'),

    //获取设备维修数据
    getMaintenanceData: (params) => req.post('/device-security-service/equipmentbMaintenancePlan/selectByPage', params),

    //获取设备维修详情数据
    getDetailedMaintenanceData: (fId) => req.get(`/device-security-service/equipmentbMaintenancePlan/selectById/${fId}`),

    //获取设备维修详情数据
    updateMaintenanceTypeOrder: (params) => req.post('/device-security-service/maintenanceType/updateSort', params),
}
