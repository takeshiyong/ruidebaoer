<!--  -->
<template>
<div class="videoSignleWrap">
  <playVideo :channelId="channelId" :tem="tem" :isBig="isBig"></playVideo>
  <div class="position-div-Control" v-if="isControl == 'true'">
    <div style="height:40px;lineHeight:40px;">
      <el-tooltip class="item" effect="dark" content="上" placement="right-end">
        <span @click="upFun">
          <!-- <i class="el-icon-back rotate90"></i> -->
          <img class="rotate180" src="./img/arrow.png" alt="">
        </span>
      </el-tooltip>

    </div>
    <div style="height:40px;lineHeight:40px;">
      <el-tooltip class="item" effect="dark" content="左" placement="right-end">
      <span style="float:left;marginLeft:12px;" @click="leftFun">
        <!-- <i class="el-icon-back"></i> -->
        <img class="rotate90" src="./img/arrow.png" alt="">
      </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="放大" placement="right-end">
        <span style="marginRight:4px;" @click="enLargeFun">
            <!-- <i class="el-icon-zoom-in"></i>  -->
            <img class="rotate270" src="./img/enlarge.png" alt="" style="marginTop:7px;">
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="缩小" placement="right-end">
        <span @click="shrinkFun">
          <!-- <i class="el-icon-zoom-out"></i>  -->
          <img class="rotate270" src="./img/shrink.png" alt="" style="marginTop:7px;">
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="右" placement="right-end">
        <span style="float:right;marginRight:12px;" @click="rightFun">
          <!-- <i class="el-icon-back rotate180"></i>  -->
          <img class="rotate270" src="./img/arrow.png" alt="">
        </span>
      </el-tooltip>
    </div>
    <div style="height:40px;lineHeight:50px;">
      <el-tooltip class="item" effect="dark" content="下" placement="right-end">
        <span @click="bottomFun">
          <!-- <i class="el-icon-back rotate270"></i> -->
          <img src="./img/arrow.png" alt="">
        </span>
      </el-tooltip>
    </div>
  </div>
</div>
</template>

<script>
import { channelService, cloudControl } from '@/api/video';
import { dictionaryitems } from '@/api/resource';
import playVideo from '../playVideo';
export default {
  data () {
    return {
      heartbeat: null,
      url: '',
      screenWidth: 0,
      screenHeight: 0,
      channelId: '',
      // rangeValue: 5,
      maxNum: 7,//海康的限制速率是1-7 大华的限制是1-8 默认是5（rangeValue）
      tem: Math.random().toString().replace(/\./g, ''),
    };
  },
  components: {playVideo},
  props: {
    isBig: {
      type: Boolean,
      default: false
    },
    channel: {
      type: String
    },
    fRealityChannel: {
      type: String
    },
    type: {
      type: String,
      default: 'big'
    },
    ptaControl: {
      type: Boolean,
      default: false
    },
    isControl: {
      type: String,
      default: 'false'
    },
    nvrIP: {
      type: String,
      default: ''
    }
  },
  watch: {
    'channel':function(newVal, oldVal) {
      console.log(newVal,'newVal');
      if (newVal || newVal == 0) {
        this.initVideo(this.channel, ()=>{
          this.setUrl(newVal);
          this.judgeIframe();
        });
      }
    },
  },
  components: { playVideo },

  mounted() {
    this.initVideo(this.channel, ()=>{
      this.setUrl(this.channel);
    });
  },
  destroyed() {
    this.removeHeartbeat();
  },
  methods: {
    setSize() {
      let parentDom = this.$refs.iframe.parentNode;
      this.screenWidth = parentDom.offsetWidth;
      let reduceHeight = 0;
      if (this.type == 'small') {
        reduceHeight = 22;
      }
      this.screenHeight = parentDom.offsetHeight - reduceHeight;
    },
    // 第一次开始视频流的接口
    async initVideo(channelId, fn) {
      if (!channelId && channelId != 0) return;
      fn && fn()
      const res = await Promise.all([channelService.initVideo(channelId),dictionaryitems.typepym('spbfcs')]);
      let time;
      if (res[1].success) {
          for(let item of res[1].obj) {
              if (item.fPym === 'specqqssjg') {
                  time = item.fItemValue * 1;
              }
          }
      }
      if (res[0].success) {
        if (!res[0].obj && time) {
          setTimeout(()=>{
            this.setUrl(this.channel);
          }, time*1000);
        }
      } else {
        if (!process.env.RE_REQUEST) return;
        // 第一次获取视频流地址失败 立刻重新调用
        this.initVideo(this.channel, ()=>{
          this.setUrl(this.channel);
          this.judgeIframe();
        });
      }
    },
    // 判断iframe加载是或否完成
    judgeIframe() {
      let iframe = document.getElementById("iframeVideo");
      if (!/*@cc_on!@*/0) { //如果不是IE，IE的条件注释
          iframe.onload = () => {
              this.completeIframe();
          };
      } else {
          iframe.onreadystatechange = () => { // IE下的节点都有onreadystatechange这个事件
              if (iframe.readyState == "complete"){
                  this.completeIframe();
              }
          };
      }
    },
    // iframe 加载完成之后
    completeIframe() {
      setTimeout(()=>{
        let iframeWindow = document.getElementById("iframeVideo").contentWindow;
      }, 200)
    },
    // 设置url
    setUrl(channel) {
      this.channelId = channel;
      this.url = `${process.env.PLAY_URL}/play.html?channel=${channel}&iframe=yes&muted=yes&stretch=yes&aspect=${this.screenWidth}x${this.screenHeight}&timestamp=${new Date().getTime()};`;
    },
    // 0:上  1：下  2：左  3：右   4：放大  5：缩小
    // 上
    async upFun() {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 0);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //左
    async leftFun() {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
       let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 2);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //右
    async rightFun() {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
       let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 3);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //下
    async bottomFun() {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 1);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //放大
    async enLargeFun() {
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 4);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    },
    //缩小
    async shrinkFun() {
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 5);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
    }
  }
}

</script>
<style lang='scss' scoped>
  .videoSignleWrap{
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow:hidden;
  }
  .iframeVideo{
    width: 100%;
    height: 100%;
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
    border-radius: 40%;
    background-image: url(./img/pie.png);
    background-repeat: no-repeat;
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