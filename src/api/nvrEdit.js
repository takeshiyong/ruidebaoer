// nvr配置
import request from '@/utils/request';

// easynvr配置
export const nvrEdit = {
  // 查询全部nvr信息
  selectAll: () => request.get(`/environment-security-service/videoConnectPoolConfig/selectAll`),
  // 分页条件查询
  findAll: param => request.post(`/environment-security-service/videoConnectPoolConfig/selectBySearch`, param),
  // 新增nvr配置信息
  add: param => request.post(`/environment-security-service/videoConnectPoolConfig/insert`, param),
  // 修改nvr配置信息
  update: param => request.post(`/environment-security-service/videoConnectPoolConfig/update`, param),
  // 删除nvr配置信息
  delete: fId => request.post(`/environment-security-service/videoConnectPoolConfig/delete/${fId}`,),
}