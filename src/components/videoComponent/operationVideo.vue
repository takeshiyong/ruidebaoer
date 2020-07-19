<!--  -->
<template>
  <div class="operation-div">
    <playVideo :tem="tem" :channelId="channelId0"></playVideo>
    <div v-show="toggleState" class="position-div">
      <div class="title">
        <div>
          <el-tooltip effect="dark" :content="'收起摄像头列表'" placement="top">
            <i @click.stop="toggleFold" class="el-icon-arrow-right"></i>
          </el-tooltip>
          <span >摄像头列表</span>
        </div>
        <div>
          <span v-if="isCycState">{{realCycTime}}s</span>
          <el-tooltip effect="dark" :content="isCycState?'关闭循环':'开启循环'" placement="top">
              <i :class="`redoublefont redoubleIcon ${isCycState?'redouble-loop':'redouble-no-loop'}`" @click="toggleCyc"></i>
          </el-tooltip>
        </div>
      </div>
      <div class="scroll-area">
        <div
          :class="`item ${item.fChannel==channel?'item-active': ''} ${item.fEnable?'':'disabled'}`"
          v-for="(item, index) in channelList"
          @click="manualToggle(item, index)"
          :key="item.fId"
        >
          <span style="width: 100%;">
            <div v-if="!item.fEnable" class="disabled-channel">
              <i class="redoublefont redouble-jinyong" style="color: red"></i>
              <i class="redoublefont redouble-shexiangtou pointStyle"></i>
            </div>
            <i v-else class="redoublefont redouble-shexiangtou pointStyle spli"></i>
            <span class="list-span">
              {{item.fName}}
            </span>
            <el-tooltip effect="dark" content="指定摄像头播放" placement="top">
              <i class="redoublefont redouble-guding" @click="fixedChannel($event, item)"></i>
            </el-tooltip>
          </span>
        </div>
      </div>
    </div>
    <div v-show="!toggleState" class="no-position-div">
      <el-tooltip effect="dark" :content="'展开摄像头列表'" placement="top">
        <i @click="toggleFold" class="el-icon-arrow-left"></i>
      </el-tooltip>
    </div>
    <div class="position-div-Control" v-if="ptaControl">
      <div style="height:40px;lineHeight:40px;">
        <el-tooltip class="item" effect="dark" content="上" placement="right-end">
          <span @mousedown="upFun(0)" @mouseup="upFun(1)">
            <!-- <i class="el-icon-back rotate90"></i> -->
            <img class="rotate180" src="./img/arrow.png" alt="">
          </span>
        </el-tooltip>

      </div>
      <div style="height:40px;lineHeight:40px;">
        <el-tooltip class="item" effect="dark" content="左" placement="right-end">
        <span style="float:left;marginLeft:12px;" @mousedown="leftFun(0)" @mouseup="leftFun(1)">
          <!-- <i class="el-icon-back"></i> -->
          <img class="rotate90" src="./img/arrow.png" alt="">
        </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="放大" placement="right-end">
          <span style="marginRight:4px;" @mousedown="enLargeFun(0)" @mouseup="enLargeFun(1)">
              <!-- <i class="el-icon-zoom-in"></i>  -->
              <img class="rotate270" src="./img/enlarge.png" alt="" style="marginTop:7px;">
          </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="right-end">
          <span @mousedown="shrinkFun(0)" @mouseup="shrinkFun(1)">
            <!-- <i class="el-icon-zoom-out"></i>  -->
            <img class="rotate270" src="./img/shrink.png" alt="" style="marginTop:7px;">
          </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="右" placement="right-end">
          <span style="float:right;marginRight:12px;" @mousedown="rightFun(0)" @mouseup="rightFun(1)">
            <!-- <i class="el-icon-back rotate180"></i>  -->
            <img class="rotate270" src="./img/arrow.png" alt="">
          </span>
        </el-tooltip>
      </div>
      <div style="height:40px;lineHeight:50px;">
        <el-tooltip class="item" effect="dark" content="下" placement="right-end">
          <span @mousedown="bottomFun(0)" @mouseup="bottomFun(1)">
            <!-- <i class="el-icon-back rotate270"></i> -->
            <img src="./img/arrow.png" alt="">
          </span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { cameraService, videoService, cloudControl } from '@/api/video';
import playVideo from './playVideo';
export default {
  data () {
    return {
      isControl: 'true',
      channelList: [],
      channel: '',
      fRealityChannel: '',
      url0: '',
      url1: '',
      toggle: true,
      index: 0,
      isCycState: false,
      cycInterval: null,
      heartbeat: null,
      realCycTime: 0,
      keys: 0,
      toggleState: true,
      channelId0: '',
      channelId1: '',
      screenWidth: 0,
      screenHeight: 0,
      nvrIP: '',
      ptaControl: true,
      tem: Math.random().toString().replace(/\./g, '')
    };
  },
  props: {
    isCyc: {
      type: Boolean
    },
    cycTime: {
      type: Number
    },
    resouceId: {
      type: String
    },
    currentShowId: {
      type: String
    },
    defaultTime: {
      type: Number
    },
    keyss: {
      type: Number
    }
  },
  watch: {
    key:function (newVal) {
      this.keys = newVal;
    },
    
  },
  components: {
    playVideo
  },
  mounted() {
    this.getChannelList();
    this.isCycState = this.isCyc;
    this.realCycTime = this.cycTime;
    this.keys = this.keyss;
  },
  destroyed() {
    this.closeCyc();
  },
  methods: {
    // 固定摄像头播放
    async fixedChannel(e,item) {
      const res = await videoService.setCurrent({
        fVideoResourcesId: this.resouceId,
        fVideoId: item.fVideoId
      });
      if (res.success) {
        this.$emit('setCurrent');
        this.closeCyc();
        this.isCycState = false;
      } else {
        this.$message.warning(res.msg);
      }
    },
    // 切换循环状态
    toggleCyc() {
      if (!this.isCycState) {
        this.realCycTime = (!this.cycTime ? this.defaultTime : this.cycTime);
        this.setInitCycInterval();
      } else {
        this.closeCyc();
      }
      this.isCycState = !this.isCycState;
    },
    // 获取摄像头列表
    async getChannelList() {
      const res = await cameraService.select(this.resouceId);
      if (res.success) {
          this.channelList = res.obj;
          if (this.isCyc) {
            this.setUrl(this.channelList[0].fChannel);
            this.setInitCycInterval();
          } else {
            let arr = this.channelList.filter((data)=>(data.fVideoId === this.currentShowId));
            this.channel = arr.length ? arr[0].fChannel : this.channelList[0].fChannel;
            this.fRealityChannel = arr.length ? arr[0].fRealityChannel : this.channelList[0].fRealityChannel;
            this.nvrIP = arr.length ? arr[0].fIp : this.channelList[0].fIp;
            this.ptaControl = arr.length ? arr[0].fPtzControl : this.channelList[0].fPtzControl;
            //console.log('ptaControl1:', this.ptaControl, this.channel);
            this.setUrl(this.channel);
          }
      } else {
          this.$message.warning(res.msg);
      }
    },
    // 设置循环计时器
    setInitCycInterval() {
      this.closeCyc();
      this.cycInterval = setInterval(()=>{
        // 计算真实显示通道号下标
        this.index = this.index + 1;
        let index = this.index % this.channelList.length;
        this.setUrl(this.channelList[index].fChannel);
      }, this.realCycTime * 1000);
    },
    // 设置url
    setUrl(channel, flag) {
      this.channelId0 = channel;
    },
    // 关闭循环
    closeCyc() {
      if (this.cycInterval) {
        clearInterval(this.cycInterval);
      }
    },
    // 手动切换摄像头
    manualToggle(channelObj, index) {
      this.index = index;
      if (this.isCycState) {
        this.setInitCycInterval();
      }
      this.channel = channelObj.fChannel;
      this.fRealityChannel = channelObj.fRealityChannel;
      this.nvrIP = channelObj.fIp;
      this.ptaControl = channelObj.fPtzControl;
      this.setUrl(channelObj.fChannel);
    },
    toggleFold() {
      this.toggleState = !this.toggleState;
    },
    // 0:上  1：下  2：左  3：右   4：放大  5：缩小 
    // 0:开始 1:结束
    // 上
    async upFun(isStop) {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
      //console.log('通道：', this.channel);
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 0, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
      //console.log('上');
    },
    //左
    async leftFun(isStop) {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
       let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 2, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
      //console.log('左');
    },
    //右
    async rightFun(isStop) {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
       let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 3, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //下
    async bottomFun(isStop) {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 1, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //放大
    async enLargeFun(isStop) {
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 4, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //缩小
    async shrinkFun(isStop) {
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 5, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .operation-div {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow:hidden;
    .no-position-div {
      background-color: rgba(255,255,255,0.9);
      width: 30px;
      height: 30px;
      top: 12px;
      right: 0px;
      z-index: 999;
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        cursor: pointer;
        font-size: 18px;
      }
    }
    .position-div {
      background-color: rgba(255,255,255,0.9);
      width: 180px;
      height: calc(100vh / 3);
      top: 12px;
      right: 0px;
      z-index: 999;
      position: absolute;

      .item {
        display: flex;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        width: 100%;
        padding: 10px 10px;
        border-bottom: 1px solid #ccc;
        cursor: pointer;
        span {
          font-size: 14px;
          display: flex;
        }
        .spli {
          padding-left: 3px;
          width: 32px;
        }
        .list-span {
          flex: 1;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
        .redouble-guding {
          display: none;
        }
      }

      .item:hover {
        background-color: rgba(56,172,253,0.85);
        span {
          color: #fff;
        }
        .redouble-guding {
          display: inline-block;
        }
      }
      .item-active {
        background-color: rgba(56,172,253,0.85);
        span {
          color: #fff;
        }
      }
      .scroll-area {
        height: calc(100% - 41px);
        overflow-y: auto;
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        display: flex;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        width: 100%;
        padding: 10px 10px;
        border-bottom: 1px solid #ccc;
        i {
          cursor: pointer;
          font-size: 18px;
        }
        .redoubleIcon {
          font-size: 14px;
          cursor: pointer;
        }
        span {
          font-size: 14px;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          span {
            margin-right: 5px;
          }

        }
      }
    }

    .position-div-Control{
      background-color: transparent;
      width: 125px;
      height: 120px;
      bottom: 5px;
      left: 5px;
      z-index: 999;
      position: absolute;
      text-align: center;
      border-radius: 50%;
      background-image: url(./img/pie.png);
      background-repeat: no-repeat;
      i{
        font-size: 26px;
      }
    }
  }

  .disabled-channel {
    display: inline-block;
    position: relative;
    width: 35px;
    i {
      color: #333;

    }
    .redouble-jinyong{
      position: absolute;
      top: -12px;
      left: -7px;
      font-size: 40px;
      z-index: 99;
    }
    .redouble-shexiangtou {
      position: absolute;
      top: 0px;
      left: 3px;
      font-size: 20px;
    }
  }
  .rotate90{
    transform:rotate(90deg);
    -ms-transform:rotate(90deg); 	/* IE 9 */
    -moz-transform:rotate(90deg); 	/* Firefox */
    -webkit-transform:rotate(90deg); /* Safari 和 Chrome */
    -o-transform:rotate(90deg);
  }
  .rotate180{
    transform:rotate(180deg);
    -ms-transform:rotate(180deg); 	/* IE 9 */
    -moz-transform:rotate(180deg); 	/* Firefox */
    -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
    -o-transform:rotate(180deg);
  }
  .rotate270{
    transform:rotate(270deg);
    -ms-transform:rotate(270deg); 	/* IE 9 */
    -moz-transform:rotate(270deg); 	/* Firefox */
    -webkit-transform:rotate(270deg); /* Safari 和 Chrome */
    -o-transform:rotate(270deg);
  }
</style>