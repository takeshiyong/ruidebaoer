/*
* @Author: 杨高杰
* @Date:   2019-08-15
* @Description:   api封装：设备巡查
*/
import req from '@/utils/request';
//1.巡检路线
export const wayService = {
   //分页查询巡检路线
   waylist: (params) => req.post('/device-security-service/patrolRoute/page/selectListByCondition', params),
   //新建巡检路线
   addway: (params) => req.post('/device-security-service/patrolRoute/insert', params),
   //查询所有区域
   allarea:() => req.post('/device-service/area/selectAll'),
   //根据区域查询设备
   selectarea: param => req.get(`/device-service/equipment/selectByArea/${param}`),
   //查询所有设备
   allareaequ:() => req.post('/device-service/area/selectGroupByArea'),
   //编辑回显
   edioEquipment: param => req.post(`/device-security-service/patrolRoute/selectDetailsByfPatrolRouteId/${param}`),
   //添加机器
   addEquipmen: param => req.get(`/device-security-service/equipmentCheckItems/selectCheckItemsByfEquipmentId/${param}`),
   //删除某个路线
   deleteway: param => req.post(`/device-security-service/patrolRoute/deleteById/${param}`),
   //编辑确定
   wayedio: (params) => req.post('/device-security-service/patrolRoute/update', params),
}
//2.巡检项
export const itemService = {
   //查询设备大小类
   allequtree:() => req.get('/device-service/equipmentType/selectTree'),
   //分页查询表格信息
   itemlist: (params) => req.post('/device-security-service/equipmentCheckItems/page/selectListByCondition', params),
   //新增巡检项信息
   iteminsert: (params) => req.post('/device-security-service/equipmentCheckItems/insert', params),
   //编辑巡检项
   itemedio: (params) => req.post('/device-security-service/equipmentCheckItems/update', params),
   //删除巡检项
   itemdelete: param => req.post(`/device-security-service/equipmentCheckItems/deleteById/${param}`),
}
//3.巡检班次
export const classesService = {
   //查询全部班次
   classesall:() => req.get('/device-security-service/inspectionScheduling/selectAll'),
   //新增排班信息
   classesinsert: (params) => req.post('/device-security-service/inspectionScheduling/insert', params),
   //删除排班信息
   classesdelete: param => req.post(`/device-security-service/inspectionScheduling/delete/${param}`),
   //修改排班信息
   classesedio: (params) => req.post('/device-security-service/inspectionScheduling/update', params),
}
//4.巡检任务
export const patrolService = {
  //新增设备巡检任务
  patroladd: (params) => req.post('/device-security-service/equipmentPatrolTask/insert', params),
  //查询全部人员
  peopleall:() => req.get('/user-service/employee/selectall'),
  //全查巡检路线
  wayall: (params) => req.post('/device-security-service/patrolRoute/selectListByCondition', params),
  //巡检任务表格
  patroltable: (params) => req.post('/device-security-service/equipmentPatrolTask/page/selectListByCondition', params),
  //删除巡检任务
  patroldelete: param => req.post(`/device-security-service/equipmentPatrolTask/deleteById/${param}`),
  //编辑巡检任务
  patroledio:(params) => req.post('/device-security-service/equipmentPatrolTask/update', params),
  //查询巡检任务详情
  patroltask:(params) => req.post('/device-security-service/patrolRecord/selectListByCondition', params),
  //查询所有的检查项和设备
  equipmentCheckItem:(params) => req.post('/device-security-service/patrolEquipment/equipmentCheckItem', params),
}
