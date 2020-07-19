/*
 * @Author: 王侃
 * @Date:   2019-08-19
 * @Description: '会议室'
 */
<template>
    <div class="meeting-room-page">
        <div class="container">
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="名称">
                        <el-input placeholder="请输入名称" clearable size="small" class="input-father" v-model="condition.fRoomName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getMeetingRoom(1)"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertMeetingRoom"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="rooms" stripe class="defaultTab meeting-room-tab" highlight-current-row>
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fRoomName" label="会议室名称" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fBelongDeptName" label="所属部门" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="fState" label="状态" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="props">
                            <span>{{props.row.fState === 1? '空闲中':'使用中'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="fIsUse" label="是否可用" min-width="80" :show-overflow-tooltip="true">
                        <template slot-scope="props">
                            <span>{{props.row.fIsUse === true? '可用':'不可用'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateMeetingRoom(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteMeetingRoom(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="block defaultPage" v-if="condition.sum > 0">
                <el-pagination id="page"  @size-change="pageSizeChange" @current-change="getMeetingRoom":current-page="condition.pageCurrent" layout="total, sizes, prev, pager, next, jumper" :total="condition.sum" :page-sizes="condition.pageSizes" :page-size="condition.pageSize">
                </el-pagination>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <TheDialog :modal='roomModal' :modalTitle="modalTitle" @closeModal="closeModal('roomForm',roomModal)">
            <div slot="custom-modal-content">
                <el-form v-if="roomFormState" :model="roomForm" :rules="roomFormRules" ref="roomForm" label-width="100px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="" label-width="46px">
                                <el-switch
                                  v-model="roomForm.fIsUse"
                                  style="display: block;"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  active-text="可用"
                                  inactive-text="不可用" class="account-swith">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="会议室名称" prop="fRoomName">
                                <el-input v-model="roomForm.fRoomName" :maxlength="10" size="small" placeholder="请填写会议室名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属部门" prop="depIds">
                                <el-cascader size="small" style="width:100%;"
                                   :options="deps"
                                   v-model="roomForm.depIds"
                                   :props="depProps"
                                   @change="handleChangeDept"  placeholder="请选择部门" clearable change-on-select>
                                </el-cascader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('roomForm')" size="small">确定</el-button>
                        <el-button @click="resetForm('roomForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import { StartegyService } from '@/api/personal-info' // api
    import { RoomService } from '@/api/meeting-management' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            var FDepId = (rule, value, callback) => {
                if (this.roomForm.depIds.length == 0) {
                    callback(new Error('请选择部门'));
                }
                else {
                    callback();
                }
            };
            return {
                rooms: [], // 列表集合

                condition: { // 分页请求对象
                    fRoomName: '', // 会议室名称
                    pageCurrent: 1, // 当前页面
                    pageSize: 10, // 每页显示条数
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                roomModal: false, // 弹层Modal
                roomForm: {}, // 弹层表单
                roomInfor: { // 初始化空表单
                    fId: '', // id
                    fBelongDeptId: '', // 所属部门id
                    fIsUse: true, // 是否可用
                    fRoomName: '', // 会议室名称
                    depIds: [],
                    fIsDelete: false,
                },
                roomFormState: true,
                roomFormRules: { // 表单校验
                    depIds: [
                        { required: true, validator: FDepId,}
                    ],
                    fRoomName: [
                        { required: true, message: '请填写会议室名称', trigger: 'blur'}
                    ],
                },
                deps: [], // 部门集合
                depProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
            }
        },
        components: {
            TheDialog,
        },
        mounted: function(){
            this.init();
        },
        methods: {
            /**
             * 页面初始化
             */
            init(){
                // 获取部门
                this.initDep();
                // 获取会议室
                this.getMeetingRoom(1);
            },
            /**
             * 获取部门
             * @return {Array}   查询的结果
             */
            async initDep(){
                let res = await StartegyService.getDeps();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.deps = res.obj;
                    } else {
                        this.deps = [];
                    }
                } else {
                    console.log(res.msg);
                    this.deps = [];
                }
            },
            /**
             * 获取会议室
             * @return {Array}   查询的结果
             */
            async getMeetingRoom(val){
                this.condition.pageCurrent = val;
                let res = await RoomService.getMeetingRoomByPage(this.condition);
                if (res.success) {
                    this.condition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items != undefined && res.obj.items.length > 0) {
                        this.rooms = res.obj.items;
                    } else {
                        this.rooms = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.rooms = [];
                };
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            pageSizeChange(num){
                this.condition.pageSize = num;
                this.getMeetingRoom(1);
            },
            /**
             * 新增按钮
             */
            insertMeetingRoom(){
                // 初始化弹层
                this.modalTitle = '新建会议室';
                this.roomModal = true;
                // 清空表单
                this.roomInfor.fId = '';
                this.roomInfor.fBelongDeptId = '';
                this.roomInfor.fRoomName = '';
                this.roomInfor.fIsUse = true;
                this.roomInfor.fIsDelete = false;
                this.roomInfor.depIds = [];
                this.roomForm = this.roomInfor;
            },
            /**
             * 编辑按钮
             */
            async updateMeetingRoom(row){
                row.depIds = [];
                let res = await StartegyService.getParentIds(row.fBelongDeptId);
                if (res.success){
                    row.depIds = res.obj;
                    var cloneRow = {};
                    cloneRow = this._.clone(row);
                    this.roomForm = cloneRow;
                    // 初始化
                    this.$nextTick(()=>{
                        this.modalTitle = '编辑会议室';
                        this.roomModal = true;
                    })
                } else {
                    this.$message.warning(res.msg);
                }
            },
            /**
             * 删除按钮
             */
            deleteMeetingRoom(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await RoomService.deleteMeetingRoom(row.fId);
                        if (res.success) {
                            this.$message.success(res.msg);
                            this.init();
                        } else{
                            this.$message.warning(res.msg);
                        };
                }).catch(() => {

                });
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建会议室') {
                            this.insertMeetingRoomForm();
                        }
                        if (this.modalTitle == '编辑会议室') {
                            this.updateMeetingRoomForm();
                        }
                    } else {
                        this.$message.warning('必填项输入为空或错误！');
                        return false;
                    }
                })
            },
            /**
             * 重置表单
             * @param formName {object} 表单名称
             */
            resetForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 新增请求
             * @param {object}     提交的表单对象
             */
            async insertMeetingRoomForm(){
                let res = await RoomService.insertMeetingRoom(this.roomForm);
                if (res.success) {
                    this.closeModal('roomForm',this.roomModal);
                    this.$message.success(res.msg);
                    this.getMeetingRoom(1);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateMeetingRoomForm(){
                let res = await RoomService.updateMeetingRoom(this.roomForm);
                if (res.success) {
                    this.closeModal('roomForm',this.roomModal);
                    this.$message.success(res.msg);
                    this.getMeetingRoom(this.condition.pageCurrent);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                this.modalTitle = "";
                this.roomModal = false;
                this.$refs[form].resetFields();
            },
            /**
             * 改变部门
             */
            handleChangeDept(value) {
                if(value == ''){
                    this.roomForm.fBelongDeptId = '';
                    return;
                }
                this.roomForm.fBelongDeptId = value[value.length-1];
            },
        },
        watch: {
            'roomForm': function(obj) {
                this.roomFormState = false;
                this.$nextTick(() => {
                    this.roomFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .meeting-room-page {
        width: 100%;
        height: 100%;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .container {
            padding:15px 10px;
        }
    }
</style>