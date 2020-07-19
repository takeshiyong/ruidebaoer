/*
* @Author: 王侃
* @Date:   2019-07-23
* @Description: '组织架构'
*/
<template>
    <div class="startegy-page">
        <div class="startegy-container" v-show="startegyState">
            <el-row>
                <el-col :lg="5" :md="7" :sm="9" :xs="24">
                    <div class="left-sidebar">
                        <div class="header">
                            <span>部门</span>
                            <el-tooltip effect="dark" content="类型配置" placement="top">
                                <el-button type="text" icon="el-icon-setting" class="opear-btn set-btn" @click="setType"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="text" icon="el-icon-delete" class="opear-btn delete-btn" @click="deleteDep"></el-button>
                            </el-tooltip>
                            <el-tooltip  effect="dark" content="修改" placement="top">
                                <el-button type="text" icon="el-icon-edit" class="opear-btn update-btn" @click="updateDep"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="新建" placement="top">
                                <el-button  type="text" icon="el-icon-plus" class="opear-btn insert-btn" @click="insertDep"></el-button>
                            </el-tooltip>
                        </div>
                        <div class="line"></div>
                        <div class="main">
                            <el-tree :data="deps" :props="depProps" @node-click="choseDep" highlight-current class="dep-tree" ref="tree" node-key="fId" :default-expanded-keys="[defaultDepId]">
                                <span class="custom-tree-node" slot-scope="{ node, deps }">
                                    <span slot="reference">
                                        {{ node.label }}
                                    </span>
                                </span>
                            </el-tree>
                        </div>
                    </div>
                </el-col>
                <el-col :lg="19" :md="17" :sm="15" :xs="24">
                    <div class="right-list">
                        <div class="all-user" v-show="allUserState">
                            <div class="description">
                                <p>
                                    全部人员
                                </p>
                            </div>
                            <div class="search">
                                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                    <el-form-item label="职务">
                                        <el-select filterable v-model="allUsersCondition.fPosition" clearable placeholder="职务" class="input-father">
                                            <el-option v-for="item in positions" :key="item.fItemValue" :label="item.fItemName" :value="item.fItemValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="姓名">
                                        <el-input v-model="allUsersCondition.fUserName" clearable placeholder="姓名" class="input-father"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="getAllUsers(1)"><i class="el-icon-search"></i>搜索</el-button>
                                        <el-button type="primary" @click="insertDepUser"><i class="el-icon-plus"></i>新建</el-button>
                                        <el-button type="primary" @click="deleteUsers"><i class="el-icon-delete"></i>删除</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="tab">
                                <el-table :data="allUser" stripe class="defaultTab allUserTab" highlight-current-row @selection-change="handleSelectionChange">
                                    <el-table-column type="selection" width="45"></el-table-column>
                                    <el-table-column type="index" label="序号" width="55" :index="indexMethodAllUser"></el-table-column>
                                    <el-table-column prop="fDepName" label="部门" min-width="80" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="fUserName" label="姓名" min-width="80" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="fSex" label="性别" min-width="70" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.fSex == 1? '男':'女'}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fPosition" label="职务" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.positionName == null ? '--':content.row.positionName}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="roles" label="系统角色" min-width="160" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span v-if="content.row.roles != null && content.row.roles != undefined && content.row.roles.length > 0" v-for="(item, index) in content.row.roles" :key="item.fId">
                                                <span>{{item.fRoleName}}</span>
                                                <span v-if="index+1 != content.row.roles.length">、</span>
                                            </span>
                                            <span v-if="content.row.roles == null || content.row.roles == undefined || content.row.roles.length == 0">--</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fPhone" label="电话" min-width="100" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.fPhone == null || content.row.fPhone == '' ? '--':content.row.fPhone}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fAddress" label="地址" min-width="120" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.fAddress == null || content.row.fAddress == '' ? '--':content.row.fAddress}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="120">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="updateDepUser(scope.row)" v-if="showBtn('updateUser')">&nbsp;编辑</el-button>
                                            <el-button type="text" @click="details(scope.row)" >&nbsp;详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="block defaultPage" v-if="allUsersCondition.sum > 0">
                                <el-pagination id="page"  @size-change="allUserSizeChange" @current-change="getAllUsers":current-page="allUsersCondition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="allUsersCondition.sum" :page-sizes="allUsersCondition.pageSizes" :page-size="allUsersCondition.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div class="dep-uesr" v-show="!allUserState">
                            <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin-top:10px;">
                                <el-row class="view-details-row" style="background:#dfe6ec;">
                                     <el-col :span="4" class="field-name" style="font-weight:700;font-size:16px;">
                                        “{{depInfor.fName}}”信息
                                     </el-col>
                                </el-row>
                                <el-row class="view-details-row">
                                    <el-col :span="4" class="field-name">
                                        单 位 类 型
                                    </el-col>
                                    <el-col :span="8" class="field-context">{{depInfor.fType}}</el-col>
                                    <el-col :span="4" class="field-name">
                                        联 系 电 话
                                    </el-col>
                                    <el-col :span="8" class="field-context">{{depInfor.fContactNumber == null || depInfor.fContactNumber == ''? '--':depInfor.fContactNumber}}</el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="4" class="field-name">
                                        备　　　注
                                    </el-col>
                                    <el-col :span="20" class="field-context">{{depInfor.fRemark == null || depInfor.fRemark == ''? '--':depInfor.fRemark}}</el-col>
                                </el-row>
                            </el-card>
                            <div class="search">
                                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                                    <el-form-item label="职务">
                                        <el-select filterable v-model="depUsersCondition.fPosition" clearable placeholder="职务" class="input-father">
                                            <el-option v-for="item in positions" :key="item.fItemValue" :label="item.fItemName" :value="item.fItemValue">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="姓名">
                                        <el-input v-model="depUsersCondition.fUserName" clearable placeholder="姓名" class="input-father"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="getDepUsers(1)"><i class="el-icon-search"></i>搜索</el-button>
                                        <el-button type="primary" @click="insertDepUser"><i class="el-icon-plus"></i>新建</el-button>
                                        <el-button type="primary" @click="init">查看全部人员</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="tab">
                                <el-table :data="depUsers" stripe highlight-current-row class="defaultTab depUserTab">
                                    <el-table-column type="index" label="序号" width="60" :index="indexMethodDepUser"></el-table-column>
                                    <el-table-column prop="fDepName" label="部门" min-width="80" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="fUserName" label="姓名" min-width="80" :show-overflow-tooltip="true">
                                    </el-table-column>
                                    <el-table-column prop="fSex" label="性别" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            {{content.row.fSex == 1? '男': '女'}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fPosition" label="职务" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.positionName == null ? '--':content.row.positionName}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="roles" label="系统角色" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span v-if="content.row.roles != null && content.row.roles != undefined && content.row.roles.length > 0" v-for="(item, index) in content.row.roles" :key="item.fId">
                                                <span>{{item.fRoleName}}</span>
                                                <span v-if="index+1 != content.row.roles.length">、</span>
                                            </span>
                                            <span v-if="content.row.roles == null || content.row.roles == undefined || content.row.roles.length == 0">--</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fPhone" label="电话" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.fPhone == null || content.row.fPhone == '' ? '--':content.row.fPhone}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="fAddress" label="地址" min-width="80" :show-overflow-tooltip="true">
                                        <template slot-scope="content">
                                            <span>{{content.row.fAddress == null || content.row.fAddress == '' ? '--':content.row.fAddress}}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="150">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="updateDepUser(scope.row)" v-if="showBtn('updateUser')">&nbsp;编辑</el-button>
                                            <el-button type="text" @click="deleteDepUser(scope.row)" v-if="showBtn('deleteUser')">&nbsp;删除</el-button>
                                            <el-button type="text" @click="details(scope.row)" >&nbsp;详情</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="block  defaultPage" v-if="depUsersCondition.sum > 0">
                                <el-pagination id="page"  @size-change="depUserSizeChange" @current-change="getDepUsers":current-page="depUsersCondition.currentPage" layout="total, sizes, prev, pager, next, jumper" :total="depUsersCondition.sum" :page-sizes="depUsersCondition.pageSizes" :page-size="depUsersCondition.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="type-container" v-show="!startegyState">
            <div class="description">
                <p>
                    部门类型配置
                    <el-tooltip effect="dark" content="返回" placement="top">
                        <el-button type="text" icon="el-icon-back" @click="back" class="back-btn"></el-button>
                    </el-tooltip>
                </p>
            </div>
            <div class="search">
                <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                    <el-form-item label="类型">
                        <el-input placeholder="请输入类型" clearable size="small" class="input-father" v-model="fName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getDepType"><i class="el-icon-search"></i>搜索</el-button>
                        <el-button type="primary" @click="insertDepType"><i class="el-icon-plus"></i>新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tab">
                <el-table :data="depTypes" class="defaultTab dep-type-tab" highlight-current-row row-key="fId">
                    <el-table-column type="index" label="序号" width="60"></el-table-column>
                    <el-table-column prop="fName" label="部门类型" min-width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button type="text" @click="updateDepType(scope.row)">&nbsp;编辑</el-button>
                            <el-button type="text" @click="deleteDepType(scope.row)">&nbsp;删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 弹层 -->
        <!-- 1.侧滑弹层 -->
        <!-- 部门类型 -->
        <TheDialog :modal='depTypeModal' :modalTitle="modalTitle" @closeModal="closeModal('depTypeForm',depTypeModal)">
            <div slot="custom-modal-content">
                <el-form v-if="depTypeFormState" :model="depTypeForm" :rules="depTypeFormRules" ref="depTypeForm" label-width="80px">
                    <el-row>
                        <el-col :span="23">
                            <el-form-item label="类型名称" prop="fName">
                                <el-input v-model="depTypeForm.fName" :maxlength="10" size="small" placeholder="请填写类型名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDepTypeForm('depTypeForm')" size="small">确定</el-button>
                        <el-button @click="resetDepTypeForm('depTypeForm')" size="small">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 部门 -->
        <TheDialog :modal='depModal' :modalTitle="modalTitle1" @closeModal="closeModal('depForm',depModal)">
            <div slot="custom-modal-content">
                <el-form v-if="depFormState" :model="depForm" :rules="depFormRules" ref="depForm" label-width="80px">
                    <el-row>
                        <el-col :span="12" v-if="modalTitle1 == '新建部门'">
                            <el-form-item label="上级部门" prop="governmentIds">
                                <el-cascader style="width: 100%" @change="parentDepChange" v-model="depForm.governmentIds" clearable change-on-select  :options="governments" :props="governmentProps" :show-all-levels="false" placeholder="请选择所属部门"></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门名称" prop="fName">
                                <el-input v-model="depForm.fName" placeholder="请填写部门名称" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="部门类型" prop="fTypeId">
                                <el-select filterable v-model="depForm.fTypeId" placeholder="请选择" style="width: 100%;" clearable>
                                    <el-option
                                      v-for="item in depTypes"
                                      :key="item.fId"
                                      :label="item.fName"
                                      :value="item.fId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="fContactNumber">
                                <el-input v-model="depForm.fContactNumber" placeholder="请填写联系电话" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" prop="fRemark">
                                <el-input type="textarea" maxlength="200" v-model="depForm.fRemark" :rows="2" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDepForm('depForm')">确定</el-button>
                        <el-button @click="resetDepForm('depForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 人员 -->
        <TheDialog :modal='userModal' :modalTitle="modalTitle2" @closeModal="closeModal('userForm',userModal)">
            <div slot="custom-modal-content">
                <el-form v-if="userFormState" ref="userForm" :model="userForm" :rules="userFormRules" label-width="80px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="" label-width="12px">
                                <el-switch
                                  v-model="userForm.fIsDutyUser"
                                  style="display: block;"
                                  active-color="#13ce66"
                                  inactive-color="#ff4949"
                                  active-text="是负责人"
                                  inactive-text="非负责人" class="account-swith">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="所属部门" prop="beDepIds">
                                 <el-cascader style="width: 100%" @change="beDepChange" v-model="userForm.beDepIds" clearable change-on-select :options="beDeps" :props="beDepProps" :show-all-levels="false" placeholder="请选择所属部门"  ></el-cascader>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="职　　务" prop="fPosition">
                                <el-select filterable style="width: 100%" v-model="userForm.fPosition" placeholder="职务" clearable>
                                    <el-option
                                      v-for="item in positions"
                                      :key="item.fItemValue"
                                      :label="item.fItemName"
                                      :value="item.fItemValue">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓　　名" prop="fUserName">
                                <el-input v-model="userForm.fUserName" placeholder="请填写姓名" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性　　别" prop="fSex">
                                <el-radio-group v-model="userForm.fSex" style="line-height:inherit!important;">
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系电话" prop="fPhone">
                                <el-input v-model="userForm.fPhone" placeholder="请填写联系电话" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="电子邮箱" prop="fEmali">
                                <el-input v-model="userForm.fEmali" placeholder="请填写电子邮箱" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="出生日期" prop="fBirthday">
                                <el-date-picker :editable="false" style="width: 100%;"
                                  v-model="userForm.fBirthday"
                                  type="date" clearable
                                  placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证号" prop="fCard">
                                <el-input v-model="userForm.fCard" placeholder="请填写身份证号" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="地　　址" prop="fAddress">
                                <el-input v-model="userForm.fAddress" placeholder="请填写地址" clearable></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button type="primary" @click="submitDepUser('userForm')">确定</el-button>
                        <el-button @click="resetDepUser('userForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </TheDialog>
        <!-- 人员详情 -->
        <TheDialog :modal='detailsModal' :modalTitle="modalTitle3" @closeModal="closeModal('userInfor',detailsModal)">
            <div slot="custom-modal-content">
                <span style="color:#1B548D;font-size:18px;font-weight:700;padding-left:8px;">
                    {{userInfor.fDepName}} - {{userInfor.fUserName}}
                </span>
                <hr style="margin-top: 10px;margin-bottom:8px;">
                <span style="padding-left:8px;">部门职务</span>
                <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin-top:10px;">
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            部　　门
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fDepName}}</el-col>
                        <el-col :span="4" class="field-name">
                            职　　务
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.positionName}}</el-col>
                    </el-row>
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            姓　　名
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fUserName}}</el-col>
                        <el-col :span="4" class="field-name">
                            性　　别
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fSex == 1 ? '男':'女'}}</el-col>
                    </el-row>
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            系统角色
                        </el-col>
                        <el-col :span="20" class="field-context">
                            <span v-if="userInfor.roles != null && userInfor.roles != undefined && userInfor.roles.length > 0" v-for="(item, index) in userInfor.roles" :key="item.fId">
                                <span>{{item.fRoleName}}</span>
                                <span v-if="index+1 != userInfor.roles.length">、</span>
                            </span>
                            <span v-if="userInfor.roles == null || userInfor.roles == undefined || userInfor.roles.length == 0">--</span></el-col>
                    </el-row>
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            是否责任人
                        </el-col>
                        <el-col :span="20" class="field-context">
                            <span>{{userInfor.fIsDutyUser? '是':'否'}}</span></el-col>
                    </el-row>
                </el-card>
                <hr style="margin-top: 10px;margin-bottom:8px;">
                <span style="padding-left:8px;">其他信息</span>
                <el-card :body-style="{ padding: '0px' }"  class="view-details-card" style="margin-top:10px;">
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            电　　话
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fPhone == null || userInfor.fPhone == ''? '--':userInfor.fPhone}}</el-col>
                        <el-col :span="4" class="field-name">
                            电子邮箱
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fEmali == null || userInfor.fEmali == ''? '--':userInfor.fEmali}}</el-col>
                    </el-row>
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            出生日期
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fBirthday == null || userInfor.fBirthday == ''? '--':fmt.YMDParseTime(userInfor.fBirthday)}}</el-col>
                        <el-col :span="4" class="field-name">
                            身份证号
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fCard == null || userInfor.fCard == ''? '--':userInfor.fCard}}</el-col>
                    </el-row>
                    <el-row class="view-details-row">
                        <el-col :span="4" class="field-name">
                            地　　址
                        </el-col>
                        <el-col :span="8" class="field-context">{{userInfor.fAddress == null || userInfor.fAddress == ''? '--':userInfor.fAddress}}</el-col>
                    </el-row>
                </el-card>
            </div>
        </TheDialog>
    </div>
</template>

<script>
    import Sortable from "sortablejs" // sortablejs
    import { StartegyService, CatalogService } from '@/api/personal-info' // api
    import { common } from '@/utils/common' // common
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            let Name = (rule, value, callback) => {
                if (value === null || value.toString().replace(new RegExp(' ','gm'),'') === '') {
                    callback(new Error('请填写类型名称'));
                } else {
                    callback();
                }
            };
            var GovernmentIds = (rule, value, callback) => {
                if (this.depForm.governmentIds.length == 0) {
                    callback(new Error('请选择部门'));
                } else {
                    callback();
                }
            };
            var BeDepIds = (rule, value, callback) => {
                if (this.userForm.beDepIds.length == 0) {
                    callback(new Error('请选择部门'));
                } else {
                    callback();
                }
            };
            return {
                startegyState: true, // 默认页面
                allUserState: true, // 默认预测

                // *****部门类型
                fName: '', // 名称
                depTypes: [], // 列表集合

                // 侧滑弹层
                modalTitle: '', // 弹层标题
                depTypeModal: false, // 弹层Modal
                depTypeForm: {}, // 弹层表单
                depTypeInfor: { // 初始化空表单
                    fId:'', //id
                    fIsDelete: true, // 是否可删除
                    fName:'', // 类型名称
                    fSort:0 // 排序
                },
                depTypeFormState: true,
                depTypeFormRules: { // 表单校验
                    fName: [
                        { validator: Name,required: true, trigger: 'blur' }
                    ],
                },
                // 部门信息
                depInfor: {
                    fId: '',
                    fName: '',  // 部门名称
                    fTypeId: '',   // 部门类型id
                    fContactNumber: '', // 联系电话
                    fRemark: '', // 备注
                    fType: '',
                },

                // *****部门
                defaultDepId: '', // 默认展开id
                // 部门树
                depProps: {
                    children: 'children',
                    label: 'fName'
                },
                deps: [], // 部门集合

                // 侧滑弹层
                depModal: false,  // 侧滑弹层显示与否状态
                modalTitle1: '',   // 弹层标题
                governments: [], // 部门集合
                governmentProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
                depFormState: true,
                depFormRules: {
                    governmentIds: [
                        { required: true, validator: GovernmentIds}
                    ],
                    fName: [
                        { required: true, message: '请填写部门名称', trigger: 'blur'}
                    ],
                    fTypeId: [
                        { required: true, message: '请选择部门类型', trigger: 'change' }
                    ]
                },
                depEmptyForm: {
                    fId: '',
                    fParentId: '', // 父级id
                    fName: '',  // 部门名称
                    fTypeId: '',   // 部门类型id
                    fContactNumber: '', // 联系电话
                    fRemark: '', // 备注
                    fSort: 0,
                    fIsDelete: true,
                    governmentIds: [],
                },
                depForm: {

                },

                // *****人员
                positions: [], // 职务集合
                // 全部人员分页条件
                allUsersCondition: {
                    currentPage: 1,
                    fDeptId: '',
                    fPosition: '',
                    fUserName: '',
                    pageSize: 10,
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },
                allUser: [], // 全部人员集合

                // 侧滑弹层
                userModal: false,  // 侧滑弹层显示与否状态
                modalTitle2: '',   // 弹层标题
                beDeps: [], // 部门集合
                beDepProps: {
                    chidren: 'children',
                    label: 'fName',
                    value: 'fId'
                },
                userFormState: true,
                userFormRules: {
                    fUserName: [
                        { required: true, message: '请填写姓名', trigger: 'blur' },
                        { min: 0, max: 10, message: '长度应小于等于 10 个字符', trigger: 'blur' }
                    ],
                    fPhone: [
                        { min: 0, max: 11, message: '长度应小于等于 11 个字符', trigger: 'blur' }
                    ],
                    fEmali: [
                        { min: 0, max: 32, message: '长度应小于等于 32 个字符', trigger: 'blur' }
                    ],
                    fCard: [
                        { min: 0, max: 18, message: '长度应小于等于 18 个字符', trigger: 'blur' }
                    ],
                    fAddress: [
                        { min: 0, max: 50, message: '长度应小于等于 50 个字符', trigger: 'blur' }
                    ],
                    beDepIds: [
                        { required: true, validator: BeDepIds}
                    ],
                    fPosition: [{ required: true, message: '请选择职务', trigger: 'change' }]
                },
                userEmptyForm: {
                    fAddress: '',   // 地址
                    fBirthday: '',  // 出生日期
                    fCard: '',      // 身份号码
                    fDeptId: '',    // 所属部门
                    fEmali: '',     // emali
                    fId: '',
                    fPhone: '',     // 电话
                    fPosition: '',  // 职务
                    fSex: 1,        // 性别
                    fUserName: '',  // 姓名
                    beDepIds: [],
                    fIsDutyUser: false,
                },
                userForm: {

                },
                ids: [], // 人员ids

                // 部门人员分页条件
                depUsersCondition: {
                    currentPage: 1,
                    fDeptId: '',
                    fPosition: '',
                    fUserName: '',
                    pageSize: 10,
                    pageSizes: [10,20,30,40],
                    sum: 0,
                },
                depUsers: [], // 部门人员集合

                detailsModal: false,  // 侧滑弹层显示与否状态
                modalTitle3: '',   // 弹层标题
                // 人员详情
                userInfor: {},
            }
        },
        components: {
            TheDialog,
        },
        mounted: function(){
            this.init();
            this.rowDrop();
        },
        methods: {
            /**
             * 页面初始化
             */
            init(){
                // 获取部门类型
                this.getDepType();
                // 获取部门
                this.getDeps();
                // 获取职务
                this.getPosition();
                // 获取全部人员
                this.getAllUsers(1);
            },
            /**
             * 行拖拽
             */
            rowDrop() {
                const tbody = document.querySelector('.dep-type-tab .el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody, {
                    onEnd({ newIndex, oldIndex }) {
                        const currRow = _this.depTypes.splice(oldIndex, 1)[0]
                        _this.depTypes.splice(newIndex, 0, currRow)
                        _this.depTypes.some((item, index, arr) => { // item为数组中的元素，index为下标，arr为目标数组
                            item.fSort = index + 1;
                        })
                        _this.updateSort(_this.depTypes); // 提交请求
                    }
                })
            },
            /**
             * 获取部门类型
             * @return {Array}   查询的结果
             */
            async getDepType(){
                let res = await StartegyService.getDepType();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        if (this.fName != '') {
                            this.depTypes = common.fuzzyQuery(res.obj, this.fName, 'fName');
                        } else {
                            this.depTypes = res.obj;
                        }
                    } else {
                        this.depTypes = [];
                    }
                } else{
                    this.$message.warning(res.msg);
                    this.depTypes = [];
                };
            },
            /**
             * 新增按钮
             */
            insertDepType(){
                // 初始化弹层
                this.modalTitle = '新建部门类型';
                this.depTypeModal = true;
                // 清空表单
                this.depTypeInfor.fId = '';
                this.depTypeInfor.fIsDelete = true;
                this.depTypeInfor.fName = '';
                this.depTypeInfor.fSort = 0;
                this.depTypeForm = this.depTypeInfor;
            },
            /**
             * 编辑按钮
             */
            updateDepType(row){
                this.depTypeForm = this._.clone(row);
                this.modalTitle = '编辑部门类型';
                this.depTypeModal = true;
            },
            /**
             * 删除按钮
             */
            deleteDepType(row){
                if (row.fId == '' || row.fId == null || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前数据，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await StartegyService.deleteDepType(row.fId);
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
            submitDepTypeForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle == '新建部门类型') {
                            this.insertDepTypeForm();
                        }
                        if (this.modalTitle == '编辑部门类型') {
                            this.updateDepTypeForm();
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
            resetDepTypeForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 新增请求
             * @param {object}     提交的表单对象
             */
            async insertDepTypeForm(){
                let res = await StartegyService.insertDepType(this.depTypeForm);
                if (res.success) {
                    this.closeModal('depTypeForm',this.depTypeModal);
                    this.$message.success(res.msg);
                    this.getDepType();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateDepTypeForm(){
                let res = await StartegyService.updateDepType(this.depTypeForm);
                if (res.success) {
                    this.closeModal('depTypeForm',this.depTypeModal);
                    this.$message.success(res.msg);
                    this.getDepType();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 排序请求
             * @param {object}     提交的表单对象
             */
            async updateSort(arr){
                let param = {
                    tDepTypes: arr
                };
                let res = await StartegyService.updateSort(param);
                if (res.success) {
                    this.$message.success(res.msg);
                } else{
                    this.$message.warning(res.msg);
                    this.getLevel();
                };
            },
            /**
             * 侧滑弹层关闭
             */
            closeModal(form, modalStatus){
                switch(form) {
                    case 'depTypeForm':
                        this.modalTitle = "";
                        this.depTypeModal = false;
                        break;
                    case 'depForm':
                        this.modalTitle1 = "";
                        this.depModal = false;
                        break;
                    case 'userForm':
                        this.modalTitle2 = "";
                        this.userModal = false;
                        break;
                    case 'userInfor':
                        this.modalTitle3 = "";
                        this.detailsModal = false;
                        break;
                }
                this.$refs[form].resetFields();
            },
            /**
             * 返回按钮
             */
            back(){
                this.startegyState = true;
            },
            /**
             * 获取部门
             * @return {Array}   查询的结果
             */
            async getDeps(){
                let res = await StartegyService.getDeps();
                if (res.success) {
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        let a = 0;
                        this.defaultDepId = res.obj[a].fId;
                        this.governments = res.obj;
                        this.deps = res.obj;
                        this.beDeps = res.obj;
                    } else {
                        this.governments = [];
                        this.deps = [];
                        this.beDeps = [];
                    }
                } else {
                    this.governments = [];
                    this.deps = [];
                    this.beDeps = [];
                }
            },
            /**
             * 配置按钮
             */
            setType(){
                this.startegyState = false;
            },
            /**
             * 新增按钮
             */
            insertDep(){
                // 清空部门树选中状态
                this.getDeps();
                // 初始化弹层
                this.modalTitle1 = '新建部门';
                this.depModal = true;
                // 清空form表单
                this.depEmptyForm.fId = '';
                this.depEmptyForm.fParentId = '';
                this.depEmptyForm.fName = '';
                this.depEmptyForm.fTypeId = '';
                this.depEmptyForm.fContactNumber = '';
                this.depEmptyForm.fRemark = '';
                this.depEmptyForm.fSort = 0;
                this.depEmptyForm.fIsDelete = true;
                this.depForm = this.depEmptyForm;
            },
            /**
             * 编辑按钮
             */
            updateDep(){
                if (this.depInfor.fId == '' || this.depInfor.fId == null || this.depInfor.fId == undefined) {
                    return this.$message.warning('请选择编辑部门！')
                };
                this.depForm = this._.clone(this.depInfor);
                // 初始化
                this.$nextTick(()=>{
                    this.modalTitle1 = "编辑部门";
                    this.depModal = true;
                })
            },
            /**
             * 删除按钮
             */
            deleteDep(){
                if (this.depInfor.fId == '' || this.depInfor.fId == undefined) {
                    this.$message.warning('请选择删除部门！')
                    return;
                };
                this.$confirm(`此操作将删除当前部门，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await StartegyService.deleteDep(this.depInfor.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.init();
                        this.depInfor = {};
                    } else{
                        this.$message.warning(res.msg);
                    };
                }).catch(() => {

                });
            },
            /**
             * 选中部门事件
             */
            choseDep(info){
                if (this.depTypes.findIndex(item => item.fId === info.fTypeId) < 0) {
                    return this.$message.warning("部门丢失部门类型属性");
                }
                // 赋值“部门信息”
                let index = this.depTypes.findIndex(item => item.fId === info.fTypeId);
                info.fType = this.depTypes[index].fName;
                this.depInfor = info;
                if (this.allUserState) {
                    this.allUserState = !this.allUserState;
                }
                this.depUsersCondition.fDeptId = info.fId;
                // 获取“部门人员”
                this.getDepUsers(1);
            },
            /**
             * 上级部门change事件
             */
            parentDepChange(val){
                this.depForm.fParentId = val[val.length - 1];
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitDepForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle1 == '新建部门') {
                            this.insertDepForm();
                        }
                        if (this.modalTitle1 == '编辑部门') {
                            this.updateDepForm();
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
            resetDepForm(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 新增请求
             * @param {object}     提交的表单对象
             */
            async insertDepForm(){
                let res = await StartegyService.insertDep(this.depForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('depForm',this.depModal);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateDepForm(){
                let res = await StartegyService.updateDep(this.depForm);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('depForm',this.depModal);
                    this.init();
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 获取职务
             * @return {Array}   查询的结果
             */
            async getPosition(){
                let res = await CatalogService.getDictionaryContexts('position');
                if (res.success){
                    if (res.obj != null && res.obj != undefined && res.obj.length > 0) {
                        this.positions = res.obj;
                    } else {
                        this.positions = [];
                    }
                } else {
                    this.positions = [];
                }
            },
            /**
             * 获取全部人员
             * @return {Array}   查询的结果
             */
            async getAllUsers(val){
                this.allUsersCondition.currentPage = val;
                let res = await StartegyService.getDepUsers(this.allUsersCondition);
                if ( res.success ) {
                    this.allUsersCondition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items !=undefined && res.obj.items.length >0) {
                        this.allUser = res.obj.items;
                        this.allUserState = true;
                    } else {
                        this.allUser = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.allUser = [];
                }
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            allUserSizeChange(num){
                this.allUsersCondition.pageSize = num;
                this.getAllUsers(1);
            },
            /**
             * 计算表格数据序号
             */
            indexMethodAllUser(index){
                return index + this.allUsersCondition.pageSize*(this.allUsersCondition.currentPage-1)+1;
            },
            /**
             * 所属部门change事件
             */
            beDepChange(val){
                this.userForm.fDeptId = val[val.length - 1];
            },
            /**
             * 新增按钮
             */
            async insertDepUser(){
                if (!this.allUserState) { // 部门下新增
                    // 获取部门id上一系列父级id集合
                    let res = await StartegyService.getParentIds(this.depInfor.fId);
                    if (res.success){
                        this.userEmptyForm.beDepIds = res.obj;
                        this.userEmptyForm.fAddress = '';
                        this.userEmptyForm.fBirthday = '';
                        this.userEmptyForm.fCard = '';
                        this.userEmptyForm.fDeptId = this.depInfor.fId;
                        this.userEmptyForm.fEmali = '';
                        this.userEmptyForm.fId = '';
                        this.userEmptyForm.fPhone = '';
                        this.userEmptyForm.fPosition = '';
                        this.userEmptyForm.fSex = 1;
                        this.userEmptyForm.fUserName = '';
                        this.userEmptyForm.fIsDutyUser = false;
                        this.userForm = this.userEmptyForm;
                        // 初始化弹层
                        this.modalTitle2 = '新建人员';
                        this.userModal = true;
                    }
                } else { // 全部人员下新增
                    this.userEmptyForm.fAddress = '';
                    this.userEmptyForm.fBirthday = '';
                    this.userEmptyForm.fCard = '';
                    this.userEmptyForm.fDeptId = this.depInfor.fId;
                    this.userEmptyForm.fEmali = '';
                    this.userEmptyForm.fId = '';
                    this.userEmptyForm.fPhone = '';
                    this.userEmptyForm.fPosition = '';
                    this.userEmptyForm.fSex = 1;
                    this.userEmptyForm.fUserName = '';
                    this.userEmptyForm.beDepIds = [];
                    this.userEmptyForm.fIsDutyUser = false;
                    this.userForm = this.userEmptyForm;
                    // 初始化弹层
                    this.modalTitle2 = '新建人员';
                    this.userModal = true;
                }
            },
            /**
             * 编辑按钮
             */
            async updateDepUser(row){
                // 获取部门id上一系列父级id集合
                let res = await StartegyService.getParentIds(row.fDeptId);
                if (res.success){
                    row.beDepIds = res.obj;
                    this.userForm = this._.clone(row);
                    this.modalTitle2 = '编辑人员';
                    this.userModal = true;
                }
            },
            /**
             * 多选框
             */
            handleSelectionChange(val){
                this.ids = [];
                for (let item of val) {
                    this.ids.push(item.fId);
                }
            },
            /**
             * 删除按钮
             */
            deleteUsers(){
                if (this.ids.length > 0) {
                    this.$confirm(`您将删除${this.ids.length}条人员信息，是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.del();
                        }).catch(() => {
                        });
                } else {
                    return this.$message.warning('请选择删除人员');
                }
            },
            /**
             * 批量删除请求
             * @param {array}     ids
             */
            async del() {
                let res = await StartegyService.deleteBatchUser(this.ids);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.getAllUsers(1);
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 删除按钮
             */
            deleteDepUser(row){
                if (row.fId == '' || row.fId == undefined) {
                    return;
                };
                this.$confirm(`此操作将删除当前人员，是否继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let res = await StartegyService.deleteUser(row.fId);
                    if (res.success) {
                        this.$message.success(res.msg);
                        this.getDepUsers(1);
                    } else{
                        this.$message.warning(res.msg);
                    };
                }).catch(() => {

                });
            },
            /**
             * 详情按钮
             */
            details(row){
                this.userInfor = row;
                this.detailsModal = true;
                this.modalTitle3 = '人员详情';
            },
            /**
             * 提交表单
             * @param formName {object} 表单名称
             */
            submitDepUser(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.modalTitle2 == "新建人员") {
                            this.insertDepUserForm();
                        }
                        if (this.modalTitle2 == "编辑人员") {
                            this.updateDepUserForm();
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
            resetDepUser(formName){
                this.$refs[formName].resetFields();
            },
            /**
             * 新增请求
             * @param {object}     提交的表单对象
             */
            async insertDepUserForm(){
                let param = {
                    ...this.userForm
                };
                if(param.fBirthday){
                    param.fBirthday =  common.YMDHMSParseTime(param.fBirthday);
                }
                let res = await StartegyService.insertUser(param);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('userForm',this.depModal);
                    if (!this.allUserState) {
                        this.getDepUsers(1);
                    } else {
                        this.getAllUsers(1);
                    }
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 修改请求
             * @param {object}     提交的表单对象
             */
            async updateDepUserForm(){
                let param = {
                    ...this.userForm
                };
                if(param.fBirthday){
                    param.fBirthday =  common.YMDHMSParseTime(param.fBirthday);
                }
                let res = await StartegyService.updateUser(param);
                if (res.success) {
                    this.$message.success(res.msg);
                    this.closeModal('userForm',this.depModal);
                    if (!this.allUserState) {
                        this.getDepUsers(this.depUsersCondition.currentPage);
                    } else {
                        this.getAllUsers(this.allUsersCondition.currentPage);
                    }
                } else{
                    this.$message.warning(res.msg);
                };
            },
            /**
             * 获取部门人员
             * @return {Array}   查询的结果
             */
            async getDepUsers(val){
                this.depUsersCondition.currentPage = val;
                let res = await StartegyService.getDepUsers(this.depUsersCondition);
                if ( res.success ) {
                    this.depUsersCondition.sum = res.obj.itemTotal;
                    if (res.obj.items != null && res.obj.items !=undefined && res.obj.items.length > 0) {
                        this.depUsers = res.obj.items;
                    } else {
                        this.depUsers = [];
                    }
                } else {
                    this.$message.warning(res.msg);
                    this.depUsers = [];
                }
            },
            /**
             * 分页改变条数
             * @param num {num} 每页显示条数
             */
            depUserSizeChange(num){
                this.depUsersCondition.pageSize = num;
                this.getDepUsers(1);
            },
            /**
             * 计算表格数据序号
             */
            indexMethodDepUser(index){
                return index + this.depUsersCondition.pageSize*(this.depUsersCondition.currentPage-1)+1;
            },

        },
        watch: {
            'depTypeForm': function(obj) {
                this.depTypeFormState = false;
                this.$nextTick(() => {
                    this.depTypeFormState = true;
                })
                this.$forceUpdate();
            },
            'depForm': function(obj) {
                this.depFormState = false;
                this.$nextTick(() => {
                    this.depFormState = true;
                })
                this.$forceUpdate();
            },
            'userForm': function(obj) {
                this.userFormState = false;
                this.$nextTick(() => {
                    this.userFormState = true;
                })
                this.$forceUpdate();
            },
        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .startegy-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        background: #fff;
        box-shadow:0px 0px 9px 2px rgba(54,58,65,0.1);
        border-radius:8px;
        .startegy-container {
            .left-sidebar { // 左侧
                height: calc(100vh - 90px);
                border-right: 1px solid #F1F1F1;
                .header { // 头部
                    padding: 20px;
                    color: rgba(84,84,84,1);
                    line-height: 25px;
                    font-size: 16px;
                    .opear-btn { // 操作按钮
                        float: right;
                        color: #545454;
                        font-size: 17px;
                    }
                    .insert-btn { // 新建按钮
                        margin-top: -4px;
                    }
                    .update-btn { // 修改按钮
                        margin-top: -4px;
                    }
                    .delete-btn { // 删除按钮
                        margin-top: -4px;
                    }
                    .set-btn { // 配置按钮
                        margin-top: -4px;
                        margin-left: 10px;
                    }
                }
                .line { // 标题下划线
                    margin: 0px 20px;
                    margin-top: -6px;
                    height: 1px;
                    border-bottom: 1px solid rgba(226,227,229,1);
                }
                .main { // 内容
                    padding: 20px 20px 0px 20px;
                    height: calc(100vh - 171px);
                    overflow-y: auto;
                    .point {
                        font-size: 24px;
                        color: #ccc!important;
                        vertical-align: middle;
                        margin-left: 4px;
                        margin-right: 10px;
                    }
                }
            }
            .right-list { // 右侧
                height: calc(100vh - 110px) ;
                padding: 10px 20px;
                .all-user {
                    .description {
                        background: #F0F2FA;
                        padding: 10px;
                        margin-bottom: 10px;
                        p {
                            font-size: 12px;
                            line-height: 20px;
                            color: rgba(84,84,84,1);
                            font-size: 18px;
                            font-weight: 700;
                            letter-spacing: 2px;
                            word-break:break-all;
                            word-wrap:break-word;
                        }
                    }
                }
                .dep-uesr {
                    .search {
                        margin-top: 10px;
                    }
                }
            }
        }
        .type-container {
            padding: 15px 10px;
            .description {
                background: #F0F2FA;
                padding: 10px;
                margin-bottom: 10px;
                p {
                    font-size: 12px;
                    line-height: 20px;
                    color: rgba(84,84,84,1);
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: 2px;
                    word-break: break-all;
                    word-wrap: break-word;
                    .back-btn {
                        margin-left: 5px;
                        margin-right: 10px;
                        float: left;
                        margin-top: -8px;
                        font-size: 16px;
                    }
                }
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .startegy-page {
        .startegy-container {
            .dep-tree {
                .el-icon-caret-right {
                    width: 24px;
                    margin-left: 4px;
                    margin-right: 10px;
                    font-size: 24px;

                    &:before {
                        content: '+';
                        padding-left: 4px;
                    }

                    &.expanded {
                        -webkit-transform: rotate(45deg);
                        -moz-transform: rotate(45deg);
                        -ms-transform: rotate(45deg);
                        -o-transform: rotate(45deg);
                        transform: rotate(45deg);
                    }

                    &.is-leaf {
                        margin-left: 4px;
                        margin-right: 10px;
                        padding-left: 0;
                        color: #ccc!important;
                        vertical-align: middle;

                        &:before {
                            font-family: "redoublefont" !important;
                            font-size: 24px;
                            font-style: normal;
                            -webkit-font-smoothing: antialiased;
                            -moz-osx-font-smoothing: grayscale;
                            content: "\e7a5";
                        }
                    }
                }

                .el-tree-node__content {
                    height: 42px!important;
                    line-height: 42px!important;
                }
                .el-tree-node__children .dvIcon-point{
                    display: none!important;
                }
                .el-tree-node.is-current>.el-tree-node__content {
                    background-color: rgba(241,241,241,1)!important;
                    color: #333!important;
                }
                .custom-tree-node {
                    align-items: center;
                    justify-content: space-between;
                    font-size: 14px;
                    padding-right: 8px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
        .type-container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 260px)!important;
                    overflow-y: auto!important;
                }
            }
        }
        .account-swith {
            .el-switch__label * {
                font-size: 14px!important;
            }
        }
    }
</style>
