/*
* @Author: 杨高杰
* @Date:   2019-09-02
* @Description:   api封装：安全管理
*/
import req from '@/utils/request';
//1.安全目标
export const basicService = {
     //获取全部人员
     getAllUser:()=>req.get('/user-service/employee/selectall'),
     //分页查询所有消息
     golasAll: (params) => req.post('/basis-security-service/securityTarget/selectByPage',params),
     //新建安全目标
     addgolas: (params) => req.post('/basis-security-service/securityTarget/insert',params),
     //删除安全目标
     deletgolas: param => req.post(`/basis-security-service/securityTarget/delete/${param}`),
     //查询安全目标信息
     findgolas: param => req.get(`/basis-security-service/securityTarget/selectById/${param}`),
     //修改目标
     updategolas: (params) => req.post('/basis-security-service/securityTarget/update',params),
}
//2.安全制度
export const ruleService = {
     //获取全部制度类型
     ruleall:()=>req.get('/basis-security-service/securitySystemType/selectAll'),
     //新增制度类型
     ruleinsert: (params) => req.post('/basis-security-service/securitySystemType/insert',params),
     //编辑制度类型
     ruleupdate: (params) => req.post('/basis-security-service/securitySystemType/update',params),
     //删除制度类型
     ruledelet:param => req.post(`/basis-security-service/securitySystemType/delete/${param}`),
     //获取全部制度
     systemall: (params) => req.post('/basis-security-service/securitySystem/selectByPage',params),
     //新建制度
     systemadd: (params) => req.post('/basis-security-service/securitySystem/insert',params),
     //编辑制度
     systemedio: (params) => req.post('/basis-security-service/securitySystem/update',params),
     //删除制度
     systemdelet: (params) => req.post('/basis-security-service/securitySystem/delete',params),
}
