/*
* @Author: 王侃
* @Date:   2019-07-29 10:38:37
* @Description:   api封装： 隐患排查治理 1.隐患级别 2.隐患类型 3.隐患排查治理
*/
import req from '@/utils/request';

// 1.隐患级别
export const LevelService = {
    // 获取隐患级别
    getLevel:(param)=>req.get('/production-security-service/hiddenTroubleLevel/selectAll'),
    // 新增
    insertLevel:(params)=>req.post('/production-security-service/hiddenTroubleLevel/insert',params),
    // 修改
    updateLevel:(params)=>req.post('/production-security-service/hiddenTroubleLevel/update',params),
    // 删除
    deleteLevel:(params)=>req.post('/production-security-service/hiddenTroubleLevel/delete/'+params),
    // 排序
    updateSort:(params)=>req.post('/production-security-service/hiddenTroubleLevel/updateSort',params),
    // 获取隐患级别的奖惩规则
    getReward:(param)=>req.get('/production-security-service/HiddenIntegralRule/selectByLevel/'+param),
    // 保存隐患级别的奖惩规则
    saveBatch:(params)=>req.post('/production-security-service/HiddenIntegralRule/saveBatch',params),
}

// 2.隐患类型
export const TypeService = {
    // 获取隐患类型
    getType:(param)=>req.get('/production-security-service/hiddenTroubleType/selectAll'),
    // 新增
    insertType:(params)=>req.post('/production-security-service/hiddenTroubleType/insert',params),
    // 修改
    updateType:(params)=>req.post('/production-security-service/hiddenTroubleType/update',params),
    // 删除
    deleteType:(params)=>req.post('/production-security-service/hiddenTroubleType/delete/'+params),
}

// 3.隐患班次
export const DivisionService = {
    // 获取隐患班次
    getDivision:(param)=>req.get('/production-security-service/scheduling/selectAll'),
    // 新增
    insertDivision:(params)=>req.post('/production-security-service/scheduling/insert',params),
    // 修改
    updateDivision:(params)=>req.post('/production-security-service/scheduling/update',params),
    // 删除
    deleteDivision:(params)=>req.post('/production-security-service/scheduling/delete/'+params),
}
// 4.上报通知人
export const NotifierService = {
    // 获取上报通知人
    getNotifier:(param)=>req.get('/production-security-service/hiddenTroubleNoticeUser/selectAll'),
    // 新增
    insertNotifier:(params)=>req.post('/production-security-service/hiddenTroubleNoticeUser/insert',params),
    // 删除
    deleteNotifier:(params)=>req.post('/production-security-service/hiddenTroubleNoticeUser/delete/'+params),
}

// 5.隐患信息管理
export const  HiddenTroubleService = {
    // 获取隐患列表
    getHiddenTrouble:(params)=>req.post('/production-security-service/hiddenTrouble/selectByPage',params),
    // 根据隐患id查询隐患信息
    getHiddenTroubleInfo:(param)=>req.get('/production-security-service/hiddenTrouble/selectHiddenTroubleInfoById/'+param),
    // 审核
    audit:(params)=>req.post('/production-security-service/hiddenTrouble/audit',params),
    // 研判
    judged:(params)=>req.post('/production-security-service/hiddenTrouble/readHiddenTrouble',params),
    // 4.2隐患跟踪

    // 审查
    review:(params)=>req.post('/production-security-service/hiddenTrouble/reviewHiddenTrouble',params),



    // 获取隐患处理信息
    getDeciding:(params)=>req.get('/production-security-service/hiddenTroublePlan/selectByHiddenTroubleId/'+params),


}