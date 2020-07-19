/*
* @Author: 屈云峰
* @Date:   2019-09-24
* @Description:   api封装： 对外展示资源接口
*/

import req from '@/utils/request';
// 资源组
export const resourceGroup = {
  // 全查资源组
  selectAll: () => req.get('/environment-security-service/resourcegroup/selectAll'), 
  // 添加资源组
  insert: param => req.post('/environment-security-service/resourcegroup/insert', param), 
  // 删除资源组信息
  delete: param => req.delete(`/environment-security-service/resourcegroup/delete/${param}`, param), 
  // 修改资源组信息
  update: param => req.post('/environment-security-service/resourcegroup/update', param), 
}
// 对外展示资源管理
export const external = {
  // 分页查询对外展示资源
  selectByPage: param => req.post('/environment-security-service/displayresourcesexternally/selectByPage', param), 
  // 新增对外展示资源
  insert: param => req.post('/environment-security-service/displayresourcesexternally/insert', param), 
  // 批量删除对外展示资源
  deleteBatch: param => req.post('/environment-security-service/displayresourcesexternally/deleteBatch', param), 
  // 修改对外展示资源
  update: param => req.put('/environment-security-service/displayresourcesexternally/update', param), 
  // 视频展示资源全查
  selectAllVideo: param => req.post('/environment-security-service/videoResources/selectAll', param), 
}
//公共接口 查询资源URL
export const resourceInfo = {
  selectResourceInfo: param => req.get(`/environment-security-service/commmon/selectResourceInfo/${param}`)
}
