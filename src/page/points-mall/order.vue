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
                      <el-form-item>
                          <el-button type="success">总支出：{{moneyall}}</el-button>
                          <el-button type="success">消耗积分：{{ruleall}}</el-button>
                      </el-form-item>
                      <el-form-item label="订单号">
                          <el-input placeholder="请输入订单号" clearable size="small" class="input-father" v-model="fName"></el-input>
                      </el-form-item>
                      <el-form-item label="订单状态">
                          <el-select v-model="stage" class="input-father" clearable placeholder="请选择订单状态">
                              <el-option
                                v-for="item in stagelist"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                              </el-option>
                            </el-select>
                      </el-form-item>
                      <el-form-item label="商品名称">
                          <el-input placeholder="请输入商品名称" clearable size="small" class="input-father" v-model="fshopName"></el-input>
                      </el-form-item>
                      <!-- <el-form-item label="商品类别">
                          <el-select v-model="shopcate" class="input-father" clearable placeholder="请选择商品类别">
                              <el-option
                                v-for="item in stagelist"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                              </el-option>
                            </el-select>
                      </el-form-item> -->
                      <el-form-item>
                          <el-button type="primary" @click="findorder"><i class="el-icon-search"></i>搜索</el-button>
                      </el-form-item>
                  </el-form>
             </div>

             <div class="tab">
                  <el-table :data="ordertable" stripe class="defaultTab" highlight-current-row>
                      <el-table-column type="index" label="序号" width="60"></el-table-column>
                      <el-table-column prop="fOrderNumber" label="订单编号" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="userName" label="兑换人姓名" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fMemberId" label="会员编号" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fCommName" label="商品名称" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fShelfOnPrice" label="商品价格" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fIntegralNumber" label="商品积分" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fCommodityNumber" label="兑换数量" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fStartTime" label="订单时间" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fValidTime" label="核销时间" min-width="80" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="sumMoney" label="合计价值" min-width="40" :show-overflow-tooltip="true">
                      </el-table-column>
                      <el-table-column prop="fIsConversion" label="订单状态" min-width="80" :show-overflow-tooltip="true">
                          <template slot-scope="scope">
                              <el-tag v-if="scope.row.fIsConversion==1" effect="dark">待核销</el-tag>
                              <el-tag type='info' v-if="scope.row.fIsConversion==2" effect="dark">已核销</el-tag>
                              <el-tag type='danger' v-if="scope.row.fIsConversion==3" effect="dark">已国企</el-tag>
                          </template>
                      </el-table-column>

                      <el-table-column  fixed="right" label="操作" width="200">
                          <template slot-scope="scope">
                              <el-button v-if="scope.row.fIsConversion==1" type="text" @click="verification(scope.row.fOrderNumber)">&nbsp;核销</el-button>
                              <el-button v-if="scope.row.fIsConversion==2 || scope.row.fIsConversion==3" type="text" disabled>&nbsp;已核销</el-button>
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
    import { OrderService } from '@/api/integral-shop' // api
    export default {
        data() {
            return {
                fName: '', // 名称
                fshopName:'',//商品名称
                stage:'',//订单状态
                shopcate:'',//商品类型
                moneyall:'',//总现金
                ruleall:'',//总积分
                stagelist:[{
                  label:'待核销',
                  id:'1',
                },{
                  label:'已核销',
                  id:'2',
                },{
                  label:'已过期',
                  id:'3',
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
        mounted() {
            this.orderall()
        },
        methods:{
          /*查询*/
          findorder(){
              this.orderall()
          },
          /*核销*/
          verification(id){
              this.$confirm('是否核销该订单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }).then(() => {
                         this.orderstage(id)
                      }).catch(() => {
                        this.$message({
                          type: 'info',
                          message: '已取消操作'
                        });
                      });
          },
          /* 分页操作*/
          handleSizeChange(val) {
              this.searchParam.pageSize = val;
              this.orderall()
          },
          handleCurrentChange(val) {
              this.searchParam.currentPage = val;
              this.orderall()
          },
           /**
            * 获取订单table
            * @return {Array}   查询的结果
            */
           async orderall(){
               let res = await OrderService.orderall({
                  "currentPage":this.searchParam.currentPage,
                  "pageSize":this.searchParam.pageSize,
                  "orderNumber":this.fName,
                  "conversion":this.stage,
                  commodityName:this.fshopName
               });
               if (res.success) {
                   this.moneyall=res.obj.addUpMoney
                   this.ruleall=res.obj.consumptionPoints
                   this.ordertable=res.obj.pageRes.items;
                   this.searchParam.sum = res.obj.pageRes.itemTotal;
               } else{
                   this.$message.warning(res.msg);
               };
           },
           //核销
           async orderstage(id){
               let res = await OrderService.orderstage(id);
               if (res.success) {
                   this.$message({
                     type: 'success',
                     message: '核销成功!'
                   });
                   this.orderall()
               } else{
                   this.$message.warning(res.msg);
               };
           },
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
