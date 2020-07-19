/*
* @Author: 屈云峰
* @Date:   2019-09-24
* @Description:   api封装： 视频管理
*/

import req from '@/utils/request';

// 料径识别摄像头管理
export const discernService = {
  // 删除料径识别摄像头信息
  delete: fId => req.post(`/environment-security-service/identifyVideo/delete/${fId}`),
  // 添加料径识别摄像头
  insert: params => req.post(`/environment-security-service/identifyVideo/insert`, params),
  // 查询全部料径识别摄像头信息
  selectAll: params => req.get(`/environment-security-service/identifyVideo/selectAll`),
  // 根据区域id查询料径识别摄像头信息
  selectByArea: fAreaId => req.get(`/environment-security-service/identifyVideo/selectByAreaId/${fAreaId}`),
  // 修改料径识别摄像头
  update: params => req.post(`/environment-security-service/identifyVideo/update`, params),
}

// 视频展示资源管理
export const videoService = {
  // 分页查询视频展示资源
  select: param => req.post(`/environment-security-service/videoResources/selectByPage`, param),
  // 新增视频展示资源
  insert: param => req.post(`/environment-security-service/videoResources/insert`, param),
  // 修改视频展示资源
  update: param => req.post(`/environment-security-service/videoResources/update`, param),
  // 删除视频展示资源
  delete: param => req.delete(`/environment-security-service/videoResources/delete/${param}`),
  // 修改视频展示资源排序
  updateSort: param => req.post(`/environment-security-service/videoResources/sorting`, param),
  // 设置展示资源显示摄像头
  setCurrent: param => req.post(`/environment-security-service/videoResources/showVido`, param)
}

// 外部资源接口
export const resourceService = {
  // 查询树结构资源组
  getTree: param => req.get(`/environment-security-service/resourcegroup/selectReSourceTree`),
  // 多选上屏操作
  multiScreen: param => req.post(`/environment-security-service/displayresourcesexternally/putScreen`, param)
}

// 循环视频资源管理
export const cameraService = {
  // 添加循环视频资源
  insert: param => req.post(`/environment-security-service/cycleVideoInfo/insert`, param),
  // 循环显示摄像头信息排序
  updateSort: param => req.post(`/environment-security-service/cycleVideoInfo/sorting`, param),
  // 根据视频显示资源id查询循环摄像头信息
  select: param => req.get(`/environment-security-service/cycleVideoInfo/selectByVideoResourcesId/${param}`),
  // 删除循环视频资源
  delete: param => req.delete(`/environment-security-service/cycleVideoInfo/deleteById/${param}`),
};

export const monitorService = {
  getList: param => req.post(`/environment-security-service/videoChannelConfig/selectAlarmVideoInfo`, param),
  start: param => req.get(`/video/startMonitoringAlarm/${param}`,'', process.env.THIRD_API),
  close: param => req.get(`/video/closeMonitoringAlarm/${param}`,'', process.env.THIRD_API),
}

// 摄像头分类管理
export const videoAreaService = {
  // 查询摄像头分类信息 !树结构
  select: param => req.get(`/environment-security-service/videoArea/selectAreaTreeInfo?fName=${param}`),
  // 新增摄像头分类
  insert: param => req.post(`/environment-security-service/videoArea/insert`, param),
  // 修改摄像头分类信息
  update: param => req.put(`/environment-security-service/videoArea/update`, param),
  // 删除摄像头分类信息
  delete: param => req.delete(`/environment-security-service/videoArea/delete/${param}`),
  // 根据上级分类id查询视频摄像头分类信息
  selectById: param => req.get(`/environment-security-service/videoArea/selectByProductionId/${param}`),
};

// 摄像头信息管理
export const channelService = {
  // 根据通道号查询摄像头信息
  select: fChannel => req.get(`/environment-security-service/videoChannelConfig/selectByChannel/${fChannel}`),
  // 新增摄像头信息
  insert: param => req.post(`/environment-security-service/videoChannelConfig/insert`, param),
  // 修改摄像头信息
  update: param => req.post(`/environment-security-service/videoChannelConfig/update`, param),
  // 删除摄像头信息
  delete: param => req.post(`/environment-security-service/videoChannelConfig/delete/${param}`),
  // 激活EasyNvr通道
  keepHeart: fChannel => req.get(`/environment-security-service/videoChannelConfig/resetChannelStream/${fChannel}`),
  // 激活EasyNvr通道
  initVideo: fChannel => req.get(`/environment-security-service/videoChannelConfig/resetChannelStream/${fChannel}`),
  // 根据禁用状态查询所有摄像头信息 0、全查 1、可用 2、禁用
  selectByType: fState => req.get(`/environment-security-service/videoChannelConfig/selectByState/${fState}`),
  // 切换码流
  changeSteamType: param => req.post(`/environment-security-service/videoChannelConfig/switchVideoStream?fVideoId=${param.fVideoId}&fVideoSteam=${param.fVideoSteam}`),
  // 查询通道在线状态
  checkOnline: param => req.get(`/environment-security-service/easynvr/api/v1/getchannels?channel=${param}`,)
};

// 云控制
export const cloudControl = {
  cloudControlOpe: (nvrip, channel, command, isStop) => req.post(`/videocontrol/ptzControl/${nvrip}/${channel}/${command}/${isStop}`,),
}