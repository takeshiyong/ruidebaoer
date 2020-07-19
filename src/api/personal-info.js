/*
* @Author: 王侃
* @Date:   2019-07-22 15:14:48
* @Description:   api封装： 1.login页面 2.home页面 3.系统设置各个页面
*/
import req from '@/utils/request';

// 1.login页面
export const LoginService = {
    login:(params)=>req.post('/user-service/user/login',params),
}

// 2.home页面
export const HomeService = {
    // 获取菜单
    getMenu:(param)=>req.get('/user-service/menu/get/current/' + param),
    // 修改密码
    updatePassword:(params)=>req.post('/user-service/user/updatepassword',params),
    // 登出
    signOut:(param)=>req.get('/user-service/user/signout'),
}

// 3.系统设置
// 3.1 部门组织
export const StartegyService = {
    // 获取部门类型
    getDepType:(param)=>req.get('/user-service/depType/selectAll'),
    // 新增
    insertDepType:(params)=>req.post('/user-service/depType/insert',params),
    // 修改
    updateDepType:(params)=>req.post('/user-service/depType/update',params),
    // 删除
    deleteDepType:(params)=>req.post('/user-service/depType/delete/'+params),
    // 排序
    updateSort:(params)=>req.post('/user-service/depType/updateSort',params),
    // 获取部门组织树
    getDeps:()=>req.get('/user-service/departement/selectall'),
    // 新增部门组织
    insertDep:(params)=>req.post('/user-service/departement/insert',params),
    // 修改部门组织
    updateDep:(params)=>req.post('/user-service/departement/update',params),
    // 删除部门组织
    deleteDep:(param)=>req.post('/user-service/departement/delete/' + param),
    // 获取部门组织下成员(分页)
    getDepUsers:(params)=>req.post('/user-service/employee/selectbypage',params),
    // 获取部门组织下成员（全部）
    getAllDepUsers:(params)=>req.get('/user-service/employee/selectbydepid/' + params),
    // 新增部门组织成员
    insertUser:(params)=>req.post('/user-service/employee/insert', params),
    // 修改部门组织成员
    updateUser:(params)=>req.post('/user-service/employee/update', params),
    // 删除部门组织成员
    deleteUser:(params)=>req.post('/user-service/employee/delete/' + params),
    // 获取全部成员
    getAllUser:()=>req.get('/user-service/employee/selectall'),
    // 通过部门id获取一系列父级id集合
    getParentIds:(params)=>req.get('/user-service/departement/selectparentidlist/' + params),
    // 批量删除人员
    deleteBatchUser:(params)=>req.post('/user-service/employee/deletebatch', params),
    // 根据人员id查询人员信息
    selectbyfid:(param)=>req.get("/user-service/employee/selectbyfid/"+param),
}
// 3.2用户账号
export const UsersService = {
    // 获取用户账号列表
    getUserAccount:(params)=>req.post('/user-service/user/selectbypage', params),
    // 新增用户账号
    insertUserInfo:(params)=>req.post('/user-service/user/insert', params),
    // 修改用户账号
    updateUserInfo:(params)=>req.post('/user-service/user/update', params),
    // 删除用户账号
    deleteAccount:(params)=>req.post('/user-service/user/delete/'+ params),
    // 重置密码
    resetPwd:(params)=>req.post('/user-service/user/reset/'+ params),
}
// 3.3角色权限
export const RoleService = {
    // 获取角色列表（树结构）
    getRole:(param)=>req.get('/user-service/role/get/tree'),
    // 获取角色列表（树结构）
    getAllRole:(param)=>req.get('/user-service/role/get/all'),
    // 获取权限菜单列表（树结构）
    getLimitsMenus:(param)=>req.get('/user-service/menu/get/current/1'),
    // 通过角色Id获取角色权限
    getRoleMenus:(param)=>req.get('/user-service/menu/get/froleid/' + param),
    // 设置权限
    setLimits:(params)=>req.post('/user-service/menu/save',params),
    // 获取全部菜单（不是树结构）
    getAllMenu:(param)=>req.get('/user-service/menu/get/all'),
    // 新增角色
    insertRoleForm:(params)=>req.post('/user-service/role/add',params),
    // 修改角色
    updateRoleForm:(params)=>req.post('/user-service/role/update',params),
    // 删除角色
    deleteRoleForm:(param)=>req.get('/user-service/role/delete/' + param),
    //加载用户可分配角色信息
    getUserRoles:()=>req.get('/user-service/role/selectroles'),
}
// 3.4数据字典
export const CatalogService = {
    // 获取字典类别
    getDictionaryCategory:(params)=>req.post('/user-service/dictionarycategory/selectall',params),
    // 添加字典类别
    insertDictionaryCategory:(params)=>req.post('/user-service/dictionarycategory/insert',params),
    // 修改字典类别
    updateDictionaryCategory:(params)=>req.post('/user-service/dictionarycategory/update',params),
    // 删除字典类别
    deleteDictionaryCategory:(params)=>req.get('/user-service/dictionarycategory/delete/' + params),
    // 获取字典类型
    getDictionaryType:(params)=>req.post('/user-service/dictionarytype/get/all',params),
    // 根据类型获取字典内容
    getDictionaryItems:(params)=>req.post('/user-service/dictionaryitems/get/typeid',params),
    // 新增类型
    insertDicItemsForm:(params)=>req.post('/user-service/dictionarytype/add',params),
    // 修改类型
    updateDicItemsForm:(params)=>req.post('/user-service/dictionarytype/update',params),
    // 删除类型
    deleteDicItems:(param)=>req.post('/user-service/dictionarytype/delete/' + param),
    // 新增内容
    insertDicContextForm:(params)=>req.post('/user-service/dictionaryitems/add',params),
    // 修改内容
    updateDicContextForm:(params)=>req.post('/user-service/dictionaryitems/update',params),
    // 删除内容
    deleteDicContext:(param)=>req.post('/user-service/dictionaryitems/delete/' + param),
    // 获取内容(类型下内容集合)
    getDictionaryContexts:(param)=>req.get('/user-service/dictionaryitems/get/pym/' + param),
    // 获取内容(具体的)
    getDictionaryContext:(param1, param2)=>req.get('/user-service/dictionaryitems/get/typeidandpym/' + param1 + '/user-service/' + param2),
}
// 3.5菜单管理
export const MenusService = {
    //改变菜单顺序
    changeMenuSort:(params)=>req.post('/user-service/menu/changesort',params),
    //修改菜单
    updateMenu:(params)=>req.post('/user-service/menu/update',params),
}
// 3.6.积分相关
export const PointService = {
    // 新加积分类型
    addPointcate:(params)=>req.post('/user-service/integralRulesType/add',params),
    //查询所有规则类型
    ruleCateAll: () => req.get('/user-service/integralRulesType/selectAll'),
    //删除积分类型
    deletecate: param => req.get(`/user-service/integralRulesType/logicDelete/${param}`),
    //分页查询所有规则
    ruleAll: (params) => req.post('/user-service/integralRules/selectLimit',params),
    //新建规则
     addPointrule:(params)=>req.post('/user-service/integralRules/add',params),
    //删除积分规则
    deleteRule: param => req.get(`/user-service/integralRules/logicDelete/${param}`),
    //编辑积分规则
    editorRule:(params)=>req.post('/user-service/integralRules/update',params),
    //根据id查询规则
    findRule:param => req.get(`/user-service/integralRules/selectAndTypeById/${param}`),
    //获取对应规则的附件列表
    ruleFile: param => req.get(`/user-service/fileManagement/selectByServiceId/${param}`),
    //删除某一条文件
    deletFile: param=>req.post(`/user-service/fileManagement/delete/${param}`),
    // 获取所有积分
    getIntegralRules:() => req.get('/user-service/integralRules/selectAll'),
}
//3.7积分管理
export const managementService = {
    //分页查询所有规则
    managementAll: (params) => req.post('/user-service/userMember/selectLimit',params),
    //获取积分明细
    detail: param => req.get(`/user-service/integralDetail/selectByMemberId/${param}`),
    //获取全部人员
    getAllUser:()=>req.get('/user-service/userMember/selectAllUserNoMember'),
    //删除
    delecte: param => req.get(`/user-service/userMember/logicDelete/${param}`),
    //添加会员
    addmemeber: (params) => req.post('/user-service/userMember/add',params),
}
// 3.8 App版本管理
export const appService = {
    // 查询所有版本信息
    selectAll: () => req.get('/user-service/appVersion/selectAll'),
    // 删除App版本信息
    deleteApp: (param) => req.post(`/user-service/appVersion/delete/${param}`),
    // 新增版本信息
    addApp: (param) => req.post(`/user-service/appVersion/insert`, param),
    // 修改版本信息
    updateApp: (param) => req.post(`/user-service/appVersion/update`, param),
}