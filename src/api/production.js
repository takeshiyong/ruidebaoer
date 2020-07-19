/*
* @Author: 王侃
* @Date:   2019-08-08 16:53:18
* @Description:   api封装：生产管理  1.产量 2.销量 3.货物管理 4.能耗
*/
import req from '@/utils/request';

// 1.产量
export const ProductVolumeService = {
    //查询货物类型
    getGoodsTypesData: () => req.get('/production-service/outPut/select/typeid'),

    //查询货物类型
    getDepartmentsData: () => req.get('/production-service/outPut/selectAllTeamAndId'),

    //查询产量数据
    getProductVolumeData: (params) => req.post('/production-service/outPut/selectByDate', params),

    //新增产量数据
    insertProductVolumeData: (params) => req.post('/production-service/outPut/allInsert', params),

    //获取详情产量数据
    getDetailedData: (params) => req.post('/production-service/outPut/selectByDetails', params),

    //修改产量数据
    updateProductVolumeData: (params) => req.post('/production-service/outPut/updateDetail', params),
}
// 2.销量
export const SalesVolumeService = {
    //查询货物类型
    getGoodsTypesData: () => req.get('/production-service/Goods/selectAllGoodsTypeAndId'),

    //查询货物类型
    getDepartmentsData: () => req.get('/production-service/SaleOut/HttpSelSaleDepAndId'),

    //查询销量数据
    getSalesVolumeData: (params) => req.post('/production-service/SaleOut/selectByPage', params),

    //新增销量数据
    insertSalesVolumeData: (params) => req.post('/production-service/SaleOut/insertSaleList', params),

    //获取详情销量数据
    getDetailedData: (params) => req.post('/production-service/SaleOut/saleDetailBydate', params),

    //修改销量数据
    updateSalesVolumeData: (params) => req.post('/production-service/SaleOut/updateBypart', params),
}
// 3.货物管理
export const GoodService = {
  //货物类型
   goodtype:() => req.get('/production-service/GoodsType/selectAll'),
  //分页查询所有表格
   goodlist:(params)=>req.post('/production-service/Goods/selectByCondition',params),
  //新加货物类型
   addgoodtype:(params)=>req.post('/production-service/GoodsType/insertGoodsType',params),
  //修改货物类型
   ediotype:(params)=>req.post('/production-service/GoodsType/updateByPrimaryKeySelective',params),
  //删除货物类型/GoodsType/deleteByPrimaryKey
   delettype:param=>req.get(`/production-service/GoodsType/deleteByPrimaryKey/${param}`),
  //新建货物
   addgoods:(params)=>req.post('/production-service/Goods/insertGoods',params),
  //删除货物
   deletgood:param=>req.get(`/production-service/Goods/deleteByPrimaryKey/${param}`),
  //根据id查找货物
  findgood:(params)=>req.post('/production-service/Goods/selectByPrimaryKey',params),
  //编辑货物
  ediogood:(params)=>req.post('/production-service/Goods/updateGoods',params),
  //货物配置/leaveType/selectAll
  leavetype:param=>req.get('/production-service/leaveType/selectAll'),
  //查询所有部门类型
  depType:param=>req.get('/user-service/depType/selectAll'),
  //根据id查询配置部门
  selectType:param=>req.get(`/user-service/depType/selectById/${param}`),
  //配置业务部门
  adddeptype:(params)=>req.post('/production-service/leaveType/insert',params),

  // 部门类型
  // @author 元实
  getDepartmentTypes: () => req.get('/user-service/depType/selectAll'),

    // 提交级别类型数据
    // @author 元实
    insertConfigurationData: (param) => req.post('/production-service/leaveType/allLevelType', param),

    // 获取级别类型数据
    // @author 元实
    getConfiguration: () => req.get('/production-service/leaveType/selectAll'),

    // 编辑级别类型数据
    // @author 元实
    updateConfigurationData: (param) => req.post('/production-service/leaveType/update', param),
}

// 4.能耗
export const DynamicService = {
    // **能耗类型
    // 获取能耗类型
    getType:(param)=>req.get('/production-service/energyType/selectAll'),
    // 新增
    insertType:(params)=>req.post('/production-service/energyType/insert',params),
    // 修改
    updateType:(params)=>req.post('/production-service/energyType/update',params),
    // 删除
    deleteType:(params)=>req.get('/production-service/energyType/delete/'+params),
    // 分页获取能耗
    getEnergy:(params)=>req.post('/production-service/energy/selectByPage',params),
    // 获取车间
    getWorkshop:(params)=>req.get('/production-service/energy/selectWorkshopAndId'),
    //获取详情能耗数据
    getDetailedData: (params) => req.post('/production-service/energy/selectDetails', params),
    //新增能耗数据
    insertEnergyVolumeData: (params) => req.post('/production-service/energy/allInsert', params),
    //修改能耗数据
    updateEnergyVolumeData: (params) => req.post('/production-service/energy/updateDetail', params),
}
