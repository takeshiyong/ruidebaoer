/*
* @Author: 杨高杰
* @Date:   2019-09-02
* @Description:   api封装：积分商城
*/
import req from '@/utils/request';
//1.商品信息
export const ShopService = {
   //查询全部商品类型
   shopcatelist:() => req.post('/integral-mall-service/TCommCategory/selctAll'),
   //新建商品类型
   addTCommCategory: (params) => req.post('/integral-mall-service/TCommCategory/addTCommCategory', params),
   //修改商品类型
   updateTCommCategory: (params) => req.post('/integral-mall-service/TCommCategory/updateTCommCategory', params),
   //删除商品类型
   deletcate: param => req.post(`/integral-mall-service/TCommCategory/delById/${param}`),
   //分页查询商品信息
   goodstable: (params) => req.post('/integral-mall-service/TCommodity/selectAllByPage', params),
   //新增商品
   addgoods: (params) => req.post('/integral-mall-service/TCommodity/addTCommodity', params),
   //删除商品
   deletgoods: param => req.get(`/integral-mall-service/TCommodity/delById/${param}`),
   //编辑商品
   ediogoods: (params) => req.post('/integral-mall-service/TCommodity/updateTCommodity', params),
   //配置管理员
   addshop: (params) => req.post('/integral-mall-service/commAdministrator/insertComm', params),
   //获取管理人员表格
   nameall: params => req.get('/integral-mall-service/commAdministrator/selectAllComm',),
   //删除管理人员
   namedelet: param => req.get(`/integral-mall-service/commAdministrator/updateComm/${param}`),
   //获取所有规则类型
   getIntegralRules:() => req.get('/user-service/integralRules/selectAll'),
   //获取商城配置信息/configuration/selectConfiguration
   selectConfiguration: param => req.get('/integral-mall-service/configuration/selectConfiguration'),
   //配置规则
   allConfiguration: (params) => req.post('/integral-mall-service/configuration/allConfiguration', params),
   //根据类型查询值
   selectByType: (type) => req.get(`/integral-mall-service/configuration/selectByType/${type}`),
}
//2.上下架管理
export const ShelfService = {
   //分页查询上下架商品信息
   shelflist: (params) => req.post('/integral-mall-service/TCommodity/selectByConditionCountPc', params),
   //批量上下架
   racks: (params) => req.post('/integral-mall-service/TCommDetai/saveList', params),
   //根据id查询上下架明细
   rackdetail: param => req.get(`/integral-mall-service/TCommDetai/selTCommDetailById/${param}`),
   //下架
   xiajia: param => req.get(`/integral-mall-service/TCommodity/ShellOffComm/${param}`),
   //删除
   delet: param => req.get(`/integral-mall-service/TCommDetai/delTCommDetailById/${param}`),
}
//3.订单信息
export const OrderService = {
   //分页查询订单信息
   orderall: (params) => req.post('/integral-mall-service/order/orderPcByPage', params),
   //订单核销
   orderstage: param => req.get(`/integral-mall-service/order/writeOffStatus/${param}`),


}
