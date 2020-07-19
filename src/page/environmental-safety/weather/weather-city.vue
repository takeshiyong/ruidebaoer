/*
 * @Author: 赵磊
 * @Date:   2019-08-13
 * @Description: '气象城市'
 */
<template>
    <div class="weather-city-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input v-model="condition.nameKeyWord" placeholder="请输入名称" clearable class="input-father"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="getCitys"><i class="el-icon-search" style="marginRight: 5px"></i>搜索</el-button>
                        <el-button type="primary"  @click="insertCity" >
                            <i class="el-icon-plus" style="marginRight: 5px" ></i>新建
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="citys" stripe class="defaultTab cityTab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="100" :index="indexMethod"></el-table-column>
                    <el-table-column prop="fProvince" label="所在省" min-width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fCityName" label="城市名" min-width="200" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column  label="当前启用" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{scope.row.fIsCurrentCity == 1 ? '是':'否'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateCity(scope.row)" >&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteCity(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="handlerSizeChange" @current-change="handlerPageChange" :current-page="condition.currentPage"
                layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes"
                :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>

        <TheDialog :modal='cityModal' :modalTitle="modalTitle" @closeModal="closeModal('cityForm',cityModal)">
            <div slot="custom-modal-content">
                <el-form :model="cityForm" :rules="cityFormRules" ref="cityForm" label-width="90px" v-if="modalTitle == '新建气象城市' || modalTitle == '编辑气象城市'">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="当前启用" class="param-switch">
                                <el-switch
                                  v-model="cityForm.fIsCurrentCity"
                                  style="display: block;"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  active-text="是"
                                  inactive-text="否">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="名  称" prop="fCityName">
                                <el-input size="small" placeholder="请填写城市名称" :disabled="modalTitle == '编辑气象城市'" :maxlength="20"  v-model="cityForm.fCityName" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所 在 省" prop="fProvince">
                                <el-input size="small" placeholder="请填写所在省名称" :maxlength="10"  v-model="cityForm.fProvince" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('cityForm')" size="small">{{modalTitle == '新建气象城市'? '立即创建':'保存'}}
                        </el-button>
                        <el-button @click="resetForm('cityForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>
<script>
    import { WeatherCityService } from '@/api/environmental-safety'// 环保监测
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data(){
            var FCityName = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('城市名不能为空'));
                } else {
                    callback();
                }
            };
            var FIsCurrentCity = (rule, value, callback) => {
                if (value === null) {
                    callback(new Error('是否当前启用不能为空'));
                } else {
                    callback();
                }
            };
            return {
                calPageSize: 1,
                calPageCurrent: 1,
                // 分页条件
                condition:{
                    currentPage: 1, // 当前页
                    nameKeyWord: '', // 名称关键字
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40], // 显示条数大小
                    sum: 0, // 总条数
                },
                citys: [],// 环保监测点参数
                cityModal: false,  // 侧滑弹层显示与否状态
                modalTitle: '',   // 弹层标题
                cityInfor: {
                    fProvince: '',// 所在省
                    fCityName: '',// 城市名
                    fIsCurrentCity: false,// 是否当前启用城市
                },
                cityForm:{

                },
                // 校验规则
                cityFormRules: {
                    fCityName: [
                        { required: true, validator: FCityName,}
                    ],
                    fIsCurrentCity: [
                        { required: true, validator: FIsCurrentCity,}
                    ]
                },
            }
        },
        components:{
            TheDialog
        },
        mounted: function(){
            this.getCitys();// 获取监测点参数
        },
        methods:{
            /**
             * 1.访问接口方法
             */
            /**
             * 1.1获取环保监测点参数
             */
            async getCitys(){
                let res = await WeatherCityService.selectCityByPage(this.condition);
                if (res.success) {
                    if (res.obj != null){
                        this.condition.sum = res.obj.itemTotal;
                        if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length >0) {
                            this.citys = res.obj.items;
                            this.calPageSize = res.obj.pageSize;
                            this.calPageCurrent = res.obj.pageCurrent;
                        } else {
                            this.citys = [];
                        }
                    } else {
                        this.$message.warning(res.msg);
                        this.citys = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.citys = [];
                }
            },
            /**
             * 1.2 新增监测点
             */
            async insertCitySave(){
                let res = await WeatherCityService.addCity(this.cityForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('cityForm',this.cityModal);
                    this.getCitys();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.3修改监测点
             */
            async updateMonitorSave(){
                let res = await WeatherCityService.updateCity(this.cityForm);
                if (res.success){
                    this.$message.success(res.msg);
                    this.closeModal('cityForm',this.cityModal);
                    this.getCitys();
                } else {
                    this.$message.warning(res.msg)
                }
            },
            /**
             * 1.4 删除
             */
            deleteCity(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前气象城市，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    var fIdList = [];
                    fIdList.push(row.fId);
                    let res = await WeatherCityService.deleteCityByBatch(fIdList);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.getCitys();
                        } else{
                            this.$message.warning(res.msg);
                        };
                }).catch(() => {

                });
            },
            /**
             * 2. 逻辑控制方法
             */
            /**
             * 2.1列表序号
             */
            indexMethod(index){
                return index + this.calPageSize*(this.calPageCurrent-1)+1;
            },
            /**
             * 2.2 改变分页大小
             */
            handlerSizeChange(val){
                this.condition.pageSize = val;
                this.getCitys();
            },
            /**
             * 2.3 改变当前页
             */
            handlerPageChange(val){
                this.condition.currentPage = val;
                this.getCitys();
            },
            /**
             * 2.4 新建气象城市
             */
            insertCity(){
                // 初始化弹层
                this.modalTitle = '新建气象城市';
                this.cityModal = true;
                // 清空form表单
                this.cityInfor.fProvince= '',
                this.cityInfor.fCityName= '',
                this.cityInfor.fIsCurrentCity= false,
                this.cityForm = this.cityInfor;
            },
            /**
             * 2.5修改监测点参数
             */
            async updateCity(row){
                // 查询人员信息来获得部门id(未存部门id)
                if(row.tEnvAlarmPersonList != null && row.tEnvAlarmPersonList.length != 0){
                    const deptId = await this.getUserInfoByUserId(row.tEnvAlarmPersonList[0].fEmployeeId)
                    this.getDutyUsers(deptId, 'change');// 查询部门下人员
                    row.deptIds = [];
                    let res = await StartegyService.getParentIds(deptId);
                    if (res.success){
                        row.deptIds = res.obj;
                    }else{
                        row.deptIds = [];
                    }
                }
                var cloneRow = {};
                cloneRow = JSON.parse(JSON.stringify(row))
                var personArray = cloneRow.tEnvAlarmPersonList;
                if(personArray != null && personArray.length != 0){
                    for(var person of personArray){
                        if(typeof(person) == 'object'){
                            var alarmPerson = person.fEmployeeId;
                            personArray.splice(personArray.indexOf(person),1,alarmPerson);
                        }
                    }
                }
                this.cityForm = cloneRow;
                // 初始化
                this.$nextTick(()=>{
                    this.modalTitle = "编辑气象城市";
                    this.cityModal = true;
                })
            },
            /**
             * 2.6 改变部门
             */
            handleChangeDept(value) {
                if(value == ''){
                    this.dutyUsers = [];
                    this.cityForm.tEnvAlarmPersonList = [];
                    return;
                }
                this.cityForm.tEnvAlarmPersonList = [];
                this.getDutyUsers(value[value.length-1], 'change');
            },
            /**
             * 2.7 重置表单
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 2.8 弹层保存
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == "新建气象城市") {
                            this.insertCitySave();
                        }
                        if (this.modalTitle == "编辑气象城市") {
                            this.updateMonitorSave();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 2.9 关闭弹层
             */
            closeModal(form, modalStatus){
                this.cityModal = false;
                this.$refs[form].resetFields();
                this.modalTitle = "";
            }
        },
        watch:{

        }

    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .weather-city-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px;
        }
    }
</style>

<style rel="stylesheet/scss" lang="scss">
    .weather-city-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 260px)!important;
                    overflow-y: auto!important;
                }
            }
        }
        .param-switch {
            .el-switch {
                .el-switch__label * {
                    font-size: 14px!important;
                }
            }
        }
    }
</style>
<style>
    .param-switch .el-switch {
        line-height: 25px!important;
    }
</style>