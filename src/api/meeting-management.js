/*
* @Author: 王侃
* @Date:   2019-08-16 14:59:13
* @Description:   api封装： 安全会议 1.会议类型 2.会议室 3.会议列表
*/

import req from '@/utils/request';

// 1.会议类型
export const TypeService = {
    // 获取会议类型
    getType:(param)=>req.get('/production-security-service/TMettingType/selectAll'),
    // 新增
    insertType:(params)=>req.post('/production-security-service/TMettingType/addMettingType',params),
    // 修改
    updateType:(params)=>req.post('/production-security-service/TMettingType/updateMettingType',params),
    // 删除
    deleteType:(params)=>req.get('/production-security-service/TMettingType/deleteByPrimaryKey/'+params),
}

// 2.会议室
export const RoomService = {
    // 获取会议室（不分页）
    getMeetingRoom:(params)=>req.get('/production-security-service/TMettingRoom/selectAll'),
    // 获取会议室（分页）
    getMeetingRoomByPage:(params)=>req.post('/production-security-service/TMettingRoom/selAllMettingTypeBypage',params),
    // 获取会议室信息
    getMeetingRoomInfo:(params)=>req.get('/production-security-service/TMettingRoom/sellectTMettingRoomByFid/'+params),
    // 新增
    insertMeetingRoom:(params)=>req.post('/production-security-service/TMettingRoom/insertTMettingRoom',params),
    // 修改
    updateMeetingRoom:(params)=>req.post('/production-security-service/TMettingRoom/updateTMettingRoom',params),
    // 删除
    deleteMeetingRoom:(params)=>req.get('/production-security-service/TMettingRoom/delTMettingRoomByFid/'+params),
}

// 3.会议列表
export const MeetingService = {
    // 获取会议状态、会议状态个数 会议类型、会议类型个数
    getMeetingParam:(params)=>req.post('/production-security-service/meeting/meetingListCount',params),
    // 获取会议列表
    getMeeting:(params)=>req.post('/production-security-service/meeting/meetingList',params),
    // 获取会议详情
    getMeetingDetails:(params)=>req.get('/production-security-service/meeting/details/'+params),
}