/*
* @Author: 杨高杰
* @Date:   2019-08-29
* @Description: '订单管理'
*/
<template>
    <div class="patrol-page">
        <div class="container">
             <div>
                  <el-form :inline="true" class="demo-form-inline search-form" label-width="80px">
                      <el-form-item label="订单号">
                          <el-input placeholder="请输入订单号" clearable size="small" class="input-father" v-model="fName"></el-input>
                      </el-form-item>
                      <el-form-item label="订单日期">
                          <el-date-picker
                              class="input-father"
                              v-model="orderdata"
                              clearable
                              type="date"
                              placeholder="选择日期">
                          </el-date-picker>
                      </el-form-item>
                      <el-form-item label="订单状态">
                          <el-select v-model="stage" class="input-father" clearable placeholder="请选择">
                              <el-option
                                v-for="item in stagelist"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                              </el-option>
                            </el-select>
                      </el-form-item>
                      <el-form-item>
                          <el-button type="primary"><i class="el-icon-search"></i>搜索</el-button>
                          <el-button type="primary"><i class="el-icon-plus"></i>新建</el-button>
                      </el-form-item>
                  </el-form>
             </div>
             <div class="tab">
                  <el-table :data="ordertable" stripe class="defaultTab" highlight-current-row>
                      <el-table-column type="index" label="序号" width="60"></el-table-column>
                      <el-table-column prop="fPatrolTaskDate" label="订单编号" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskTitle" label="兑换人姓名" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="tEquipmentPatrolTaskUserList" label="兑换商品" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskDate" label="兑换时间" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskRecordNum" label="消耗积分" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolRecordNum" label="消耗现金" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fPatrolTaskState" label="订单状态" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <el-tag effect="dark">待核销</el-tag>
                          </template>
                      </el-table-column>

                      <el-table-column label="操作" width="200">
                          <template slot-scope="scope">
                              <el-button type="text">&nbsp;详情</el-button>
                              <el-button type="text">&nbsp;编辑</el-button>
                              <el-button type="text">&nbsp;删除</el-button>
                          </template>
                      </el-table-column>
                  </el-table>
                  <div class="rule_pagination">
                      <el-pagination
                          id="page"
                          :current-page="searchParam.currentPage"
                          layout="total, sizes, prev, pager, next, jumper"
                          :total="searchParam.sum"
                          :page-size="searchParam.pageSize"
                          :page-sizes="searchParam.pageSizes"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                      ></el-pagination>
                  </div>
             </div>
             <!-- 弹层 -->
             <!-- 1.侧滑弹层 -->
             <TheDialog :modal='divisionModal' :modalTitle="modalTitle" @closeModal="divisionModal=false">
                 <div slot="custom-modal-content">

                 </div>
             </TheDialog>
        </div>
    </div>
</template>
<script>
    import TheDialog from "@/components/TheDialog" // 侧滑组件
    export default {
        data() {
            return {
                fName: '', // 名称
                orderdata:'',//日期
                stage:'',//订单状态
                stagelist:[{
                  label:'待核销',
                  id:'0',
                },{
                  label:'已核销',
                  id:'1',
                }],
                searchParam: {
                    //分页相关
                    currentPage: 1,
                    sum: 0,
                    pageSizes: [10, 20, 30, 40],
                    pageSize: 10
                },
                ordertable:[],//表格数据
                divisionModal:false,//表单显示隐藏
                modalTitle:'',//标题
            }
        },
        components: {
            TheDialog,
        },
        }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .patrol-page {
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        .container {
            padding:15px 10px;
            .rule_pagination {
                margin-top: 1.25rem;
                text-align: right;
            }
        }
    }
</style>
<style rel="stylesheet/scss" lang="scss">
    .patrol-page {
        .container {
            .tab {
                .el-table__body-wrapper {
                    max-height: calc(100vh - 220px)!important;
                    overflow-y: auto!important;
                }
            }
        }
    }
</style>
