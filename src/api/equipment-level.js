/*
* @Author: 元实
* @Date:   2019-09-02
* @Description:   api封装： 设备级别
*/

import req from '@/utils/request';

// 1.设备界别
export const EquipmentLevelService = {
    //分页查询设备
    getEquipmentDataByPage: (params) => req.post('/device-service/level/selectByPage', params),

    //添加设备级别
    insertEquipLevelRecord: (params) => req.post('/device-service/level/add', params),

    //编辑设备级别
    updateEquipLevelRecord: (params) => req.post('/device-service/level/update', params),

    //获取设备级别信息
    getEditEquipLevelData: (fId) => req.get(`/device-service/level/selectById/${fId}`),

    //删除设备级别
    deleteEquipLevelRecord: (fId) => req.get(`/device-service/level/logicDelete/${fId}`),

    //按设备级别获取设备信息
    getEquipmentByLevel: (fId) => req.get(`/device-service/equipment/selectByLevel/${fId}`),
}
