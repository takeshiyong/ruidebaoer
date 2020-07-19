import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {   path: '/home',
            component: resolve => require(['../page/home.vue'], resolve),
            children: [
                // **人员信息中心
                { // 部门组织
                    path: '/startegy',
                    component: resolve => require(['../page/personal-info/startegy.vue'], resolve),
                    meta: { title: '08250562825f11e79e5d708bcda4b2f0' }
                },
                { // 用户账号
                    path: '/users',
                    component: resolve => require(['../page/personal-info/users.vue'], resolve),
                    meta: { title: '8c9ae607825f11e79e5d708bcda4b2f0' }
                },
                { // 角色权限
                    path: '/role',
                    component: resolve => require(['../page/personal-info/role.vue'], resolve),
                    meta: { title: '8c98cf8e825f11e79e5d708bcda4b2f0' }
                },
                { // 数据字典
                    path: '/catalog',
                    component: resolve => require(['../page/personal-info/catalog.vue'], resolve),
                    meta: { title: '8c9d0636825f11e79e5d708bcda4b2f0' }
                },
                { // 菜单管理
                    path: '/menus',
                    component: resolve => require(['../page/personal-info/menus.vue'], resolve),
                    meta: { title: '526bfa3590ba11e8bbc9708bcda4b3c7' }
                },
                { // 会员管理
                    path: '/member',
                    component: resolve => require(['../page/personal-info/member.vue'], resolve),
                    meta: { title: 'ae6cd694b4ce11e9a51d0242ac110004' }
                },
                 { // 积分管理
                    path: '/pointManagement',
                    component: resolve => require(['../page/personal-info/point-management.vue'], resolve),
                    meta: { title: '256aacdaad0c11e9b3350242ac110004' }
                },
                { // 积分规则
                    path: '/integrationRule',
                    component: resolve => require(['../page/personal-info/integration-rule.vue'], resolve),
                    meta: { title: '58b74218ad0c11e9b3350242ac110004' }
                },
                { // APP版本管理
                    path: '/appManagement',
                    component: resolve => require(['../page/personal-info/app-Management.vue'], resolve),
                    meta: { title: '1372c68ad8fa11e9a51d0242ac110004' }
                },
                // **设备中心
                { // 设备类型
                    path: '/equipmentType',
                    component: resolve => require(['../page/equipment-center/equipment-type.vue'], resolve),
                    meta: { title: '5ed490ffbfeb11e9a51d0242ac110004' }
                },
                { // 生产厂商
                    path: '/manufacturer',
                    component: resolve => require(['../page/equipment-center/manufacturer.vue'], resolve),
                    meta: { title: 'ae5b65b6bfeb11e9a51d0242ac110004' }
                },
                { // 设备信息
                    path: '/equipment',
                    component: resolve => require(['../page/equipment-center/equipment.vue'], resolve),
                    meta: { title: 'dc249aabad0c11e9b3350242ac110004' }
                },
                { // 区域管理
                    path: '/area',
                    component: resolve => require(['../page/equipment-center/area.vue'], resolve),
                    meta: { title: 'f368c1bbbfeb11e9a51d0242ac110004' }
                },
                { // 设备级别
                    path: '/equipmentLevel',
                    component: resolve => require(['../page/equipment-center/equipment-level.vue'], resolve),
                    meta: { title: '' }
                },
                { // 车间信息
                    path: '/workshop',
                    component: resolve => require(['../page/equipment-center/workshop.vue'], resolve),
                    meta: { title: 'f8fd478dad0c11e9b3350242ac110004' }
                },
                { // 设备资料列表
                    path: '/equipmentInfo',
                    component: resolve => require(['../page/equipment-center/equipment-info.vue'], resolve),
                    meta: { title: '' }
                },
                
                
                
                // **人员安全
                { // 工作状态
                    path: '/working',
                    component: resolve => require(['../page/personnel-security/working.vue'], resolve),
                    meta: { title: '433bb0ddad0d11e9b3350242ac110004' }
                },
                { // 人员奖惩
                    path: '/bonusPenalty',
                    component: resolve => require(['../page/personnel-security/bonus-penalty.vue'], resolve),
                    meta: { title: '5b005f8aad0d11e9b3350242ac110004' }
                },
                { // 人员考勤
                    path: '/attendance',
                    component: resolve => require(['../page/personnel-security/attendance.vue'], resolve),
                    meta: { title: '7625f2d8ad0d11e9b3350242ac110004' }
                },
                { // 人员绩效
                    path: '/performance',
                    component: resolve => require(['../page/personnel-security/performance.vue'], resolve),
                    meta: { title: '8bfca800ad0d11e9b3350242ac110004' }
                },
                // **设备安全
                { // 巡检班次
                    path: '/patrolDivision',
                    component: resolve => require(['../page/device-safety/patrol-division.vue'], resolve),
                    meta: { title: '1dea9880bfec11e9a51d0242ac110004' }
                },
                { // 设备检查项
                    path: '/checkItem',
                    component: resolve => require(['../page/device-safety/check-item.vue'], resolve),
                    meta: { title: '3e509cfbbfec11e9a51d0242ac110004' }
                },
                { // 设备巡检
                    path: '/patrol',
                    component: resolve => require(['../page/device-safety/patrol.vue'], resolve),
                    meta: { title: 'c96b4116ad0d11e9b3350242ac110004' }
                },
                { // 设备维修
                    path: '/service',
                    component: resolve => require(['../page/device-safety/maintenance.vue'], resolve),
                    meta: { title: '12d57886ad0e11e9b3350242ac110004' }
                },
                { // 巡检路线
                    path: '/way',
                    component: resolve => require(['../page/device-safety/equipmentway.vue'], resolve),
                    meta: { title: '06b1b316c4ac11e9a51d0242ac110004' }
                },
                /*{ // 设备维保
                    path: '/service',
                    component: resolve => require(['../page/device-safety/service.vue'], resolve),
                    meta: { title: '12d57886ad0e11e9b3350242ac110004' }
                },*/
                { // 设备保养
                    path: '/careItems',
                    component: resolve => require(['../page/device-safety/care-items.vue'], resolve),
                    meta: { title: '12d57886ad0e11e9b3350242ac110004' }
                },
                { // 保养记录
                    path: '/careRecords',
                    component: resolve => require(['../page/device-safety/care-records.vue'], resolve),
                    meta: { title: '12d57886ad0e11e9b3350242ac110004' }
                },
                // **环境安全
                { // 危险场所
                    path: '/hazardous',
                    component: resolve => require(['../page/environmental-safety/hazardous.vue'], resolve),
                    meta: { title: '40506c64ad0e11e9b3350242ac110004' }
                },
                // **视频监控管理
                { // 视频监控
                    path: '/video',
                    component: resolve => require(['../page/environmental-safety/video.vue'], resolve),
                    meta: { title: '575aea8ee99e11e9a51d0242ac110004' }
                },
                { // 料径识别配置
                    path: '/discern',
                    component: resolve => require(['../page/equipment-center/discern.vue'], resolve),
                    meta: { title: 'bab5030be02d11e9aa1100ff15ae1663' }
                },
                { // nvr配置
                    path: '/nvrEdit',
                    component: resolve => require(['../page/equipment-center/nvrEdit.vue'], resolve),
                    meta: { title: '97e3aecae02811e9aa1100ff15ae1663' }
                },
                { // 对外展示资源
                    path: '/external',
                    component: resolve => require(['../page/equipment-center/external.vue'], resolve),
                    meta: { title: 'b9951e92de7211e9828300ff15ae1663' }
                },
                { // 边坡监测
                    path: '/slope',
                    component: resolve => require(['../page/environmental-safety/slope.vue'], resolve),
                    meta: { title: '689265f6ad0e11e9b3350242ac110004' }
                },
                // **环保监测管理
                { // 监测点
                    path: '/monitor',
                    component: resolve => require(['../page/environmental-safety/environmental/monitor.vue'], resolve),
                    meta: { title: '83236045b97c11e996a000ff15ae1663' }
                },
                { // 监测点参数
                    path: '/monitorParam',
                    component: resolve => require(['../page/environmental-safety/environmental/monitor-param.vue'], resolve),
                    meta: { title: 'b521e03bb97c11e996a000ff15ae1663' }
                },
                { // 监测数据
                    path: '/monitorData',
                    component: resolve => require(['../page/environmental-safety/environmental/monitor-data.vue'], resolve),
                    meta: { title: 'e0caa4dfb97c11e996a000ff15ae1663' }
                },
                // **气象监测管理
                { // 气象城市
                    path: '/weatherCity',
                    component: resolve => require(['../page/environmental-safety/weather/weather-city.vue'], resolve),
                    meta: { title: '5862d3b9bb1e11e9a51d0242ac110004' }
                },
                { // 气象数据
                    path: '/weatherData',
                    component: resolve => require(['../page/environmental-safety/weather/weather-data.vue'], resolve),
                    meta: { title: '86de69d7bb1e11e9a51d0242ac110004' }
                },
                // **生产安全
                { // 安全物资
                    path: '/safetySupplies',
                    component: resolve => require(['../page/production-safety/safety-supplies.vue'], resolve),
                    meta: { title: 'b3609d0bad0e11e9b3350242ac110004' }
                },
                { // 安全检查
                    path: '/inspect',
                    component: resolve => require(['../page/production-safety/inspect.vue'], resolve),
                    meta: { title: 'd31961c4ad0e11e9b3350242ac110004' }
                },
                { // 事故管理
                    path: '/accident',
                    component: resolve => require(['../page/production-safety/accident.vue'], resolve),
                    meta: { title: 'fc2c4fdead0e11e9b3350242ac110004' }
                },
                { // 应急物资
                    path: '/emergencyResource',
                    component: resolve => require(['../page/production-safety/emergency-resource.vue'], resolve),
                    meta: { title: '0d596076ad0f11e9b3350242ac110004' }
                },
                { // 工作票
                    path: '/workTicket',
                    component: resolve => require(['../page/production-safety/work-ticket.vue'], resolve),
                    meta: { title: '1cc478c7ad0f11e9b3350242ac110004' }
                },
                // **基础安全
                { // 安全目标
                    path: '/target',
                    component: resolve => require(['../page/basic-security/target.vue'], resolve),
                    meta: { title: '46c35cd8ad0f11e9b3350242ac110004' }
                },
                { // 安全风险
                    path: '/risk',
                    component: resolve => require(['../page/basic-security/risk.vue'], resolve),
                    meta: { title: '56e5319fad0f11e9b3350242ac110004' }
                },
                { // 规章制度
                    path: '/system',
                    component: resolve => require(['../page/basic-security/system.vue'], resolve),
                    meta: { title: '65d6b80aad0f11e9b3350242ac110004' }
                },
                { // 安全档案
                    path: '/file',
                    component: resolve => require(['../page/basic-security/file.vue'], resolve),
                    meta: { title: '737f1f96ad0f11e9b3350242ac110004' }
                },
                { // 安全投入
                    path: '/investment',
                    component: resolve => require(['../page/basic-security/investment.vue'], resolve),
                    meta: { title: '823602fdad0f11e9b3350242ac110004' }
                },
                // **生产管理
                { // 产量（班组）
                    path: '/yield',
                    component: resolve => require(['../page/production/yield.vue'], resolve),
                    meta: { title: 'a767307aad0f11e9b3350242ac110004' }
                },
                { // 销量
                    path: '/sales',
                    component: resolve => require(['../page/production/sales.vue'], resolve),
                    meta: { title: 'b7aac61fad0f11e9b3350242ac110004' }
                },
                { // 货物管理
                    path: '/goods',
                    component: resolve => require(['../page/production/goods.vue'], resolve),
                    meta: { title: 'd329c6f8ad0f11e9b3350242ac110004' }
                },
                { // 能耗
                    path: '/dynamic',
                    component: resolve => require(['../page/production/dynamic.vue'], resolve),
                    meta: { title: 'e67e37c6ad0f11e9b3350242ac110004' }
                },
                // **积分商城
                { // 积分兑换商品
                    path: '/exchange',
                    component: resolve => require(['../page/points-mall/exchange.vue'], resolve),
                    meta: { title: '4233625dad1011e9b3350242ac110004' }
                },
                { // 商品上架下架
                    path: '/exhibit',
                    component: resolve => require(['../page/points-mall/exhibit.vue'], resolve),
                    meta: { title: '5544c1e1ad1011e9b3350242ac110004' }
                },
                { // 商品信息维护
                    path: '/commodity',
                    component: resolve => require(['../page/points-mall/commodity.vue'], resolve),
                    meta: { title: '687a6ba7ad1011e9b3350242ac110004' }
                },
                { // 订单管理
                    path: '/order',
                    component: resolve => require(['../page/points-mall/order.vue'], resolve),
                    meta: { title: 'c149f176cac211e9a51d0242ac110004' }
                },
                // **砂石学院
                { // 培训体系
                    path: '/train',
                    component: resolve => require(['../page/network-college/train.vue'], resolve),
                    meta: { title: '8d044980ad1011e9b3350242ac110004' }
                },
                { // 认证体系
                    path: '/authentication',
                    component: resolve => require(['../page/network-college/authentication.vue'], resolve),
                    meta: { title: '9e102035ad1011e9b3350242ac110004' }
                },
                { // 课件管理
                    path: '/courseware',
                    component: resolve => require(['../page/network-college/courseware.vue'], resolve),
                    meta: { title: 'ab5becb3ad1011e9b3350242ac110004' }
                },
                { // 课程管理
                    path: '/curriculum',
                    component: resolve => require(['../page/network-college/curriculum.vue'], resolve),
                    meta: { title: 'b967c40cad1011e9b3350242ac110004' }
                },
                { // 课程分类管理
                    path: '/coursecate',
                    component: resolve => require(['../page/network-college/course-cate.vue'], resolve),
                    meta: { title: '0be2d462b4cf11e9a51d0242ac110004' }
                },
                { // 课程标签管理
                    path: '/courselable',
                    component: resolve => require(['../page/network-college/course-lable.vue'], resolve),
                    meta: { title: '29307c5fb4cf11e9a51d0242ac110004' }
                },
                { // 考试管理
                    path: '/examination',
                    component: resolve => require(['../page/network-college/examination.vue'], resolve),
                    meta: { title: 'c6238c55ad1011e9b3350242ac110004' }
                },
                { // 报名管理
                    path: '/apply',
                    component: resolve => require(['../page/network-college/apply.vue'], resolve),
                    meta: { title: 'd3012f84ad1011e9b3350242ac110004' }
                },
                { // 证书管理
                    path: '/certificate',
                    component: resolve => require(['../page/network-college/certificate.vue'], resolve),
                    meta: { title: 'e7f38465ad1011e9b3350242ac110004' }
                },
                { // 试题管理
                    path: '/questions',
                    component: resolve => require(['../page/network-college/questions.vue'], resolve),
                    meta: { title: '38a7008be02e11e9aa1100ff15ae1663' }
                },
                { // 试卷管理
                    path: '/examPapers',
                    component: resolve => require(['../page/network-college/exam-papers.vue'], resolve),
                    meta: { title: '9f293613e02e11e9aa1100ff15ae1663' }
                },
                { // 培训记录
                    path: '/trainingsList',
                    component: resolve => require(['../page/network-college/trainings-list.vue'], resolve),
                    meta: { title: 'd1018bd3efef11e9a51d0242ac110004' }
                },
                { // 培训类型
                    path: '/trainingTypes',
                    component: resolve => require(['../page/network-college/training-types.vue'], resolve),
                    meta: { title: '628ea27cefef11e9a51d0242ac110004' }
                },
                // **隐患排查
                { // 隐患级别
                    path: '/hazardrank',
                    component: resolve => require(['../page/hidden-trouble/hazard-rank.vue'], resolve),
                    meta: { title: '9e51c3cfb81b11e9a51d0242ac110004' }
                },
                { // 隐患类型
                    path: '/hazardtype',
                    component: resolve => require(['../page/hidden-trouble/hazard-type.vue'], resolve),
                    meta: { title: 'ab031192b81b11e9a51d0242ac110004' }
                },
                { // 隐患班次
                    path: '/hazarddivision',
                    component: resolve => require(['../page/hidden-trouble/hazard-division.vue'], resolve),
                    meta: { title: 'bd0e4a54b81b11e9a51d0242ac110004' }
                },
                { // 奖惩规则
                    path: '/hazardreward',
                    component: resolve => require(['../page/hidden-trouble/hazard-reward.vue'], resolve),
                    meta: { title: 'd87419b6b81b11e9a51d0242ac110004' }
                },
                { // 上报通知人
                    path: '/notifier',
                    component: resolve => require(['../page/hidden-trouble/notifier.vue'], resolve),
                    meta: { title: 'de47f13eb81b11e9a51d0242ac110004' }
                },
                { // 隐患审核
                    path: '/hazardaudit',
                    component: resolve => require(['../page/hidden-trouble/hazard-audit.vue'], resolve),
                    meta: { title: 'f8dd2a10b81b11e9a51d0242ac110004' }
                },
                { // 隐患跟踪
                    path: '/hazardtrace',
                    component: resolve => require(['../page/hidden-trouble/hazard-trace.vue'], resolve),
                    meta: { title: '09f8441fb81c11e9a51d0242ac110004' }
                },
                { // 隐患日志
                    path: '/hazardlog',
                    component: resolve => require(['../page/hidden-trouble/hazard-log.vue'], resolve),
                    meta: { title: '2868fc3eb81c11e9a51d0242ac110004' }
                },
                // **会议管理
                { // 会议类型
                    path: '/meetingType',
                    component: resolve => require(['../page/meeting-management/meeting-type.vue'], resolve),
                    meta: { title: 'a6b6afa1be4911e99e0b00163e0a0691' }
                },
                { // 会议室
                    path: '/meetingRoom',
                    component: resolve => require(['../page/meeting-management/meeting-room.vue'], resolve),
                    meta: { title: 'af499a73be4a11e99e0b00163e0a0691' }
                },
                { // 会议列表
                    path: '/meeting',
                    component: resolve => require(['../page/meeting-management/meeting.vue'], resolve),
                    meta: { title: 'e9b7ebc1be4a11e99e0b00163e0a0691' }
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../page/login.vue'], resolve)
        },
    ]
})
