<!--  -->
<template>
<div class="videoSignleWrap">
  <iframe id="iframeVideo" :width="screenWidth" :height="screenHeight" ref="iframe" frameborder="no" :src="url" allowfullscreen  allow="autoplay; fullscreen"></iframe>
  <div class="position-div-Control" v-if="ptaControl && isControl == 'true'">
    <div style="height:40px;lineHeight:40px;">
        <el-tooltip class="item" effect="dark" content="上" placement="right-end">
          <span @mousedown="upFun(0)" @mouseup="upFun(1)">
            <img class="rotate180" src="./img/arrow.png" alt="">
          </span>
        </el-tooltip>

      </div>
      <div style="height:40px;lineHeight:40px;">
        <el-tooltip class="item" effect="dark" content="左" placement="right-end">
        <span style="float:left;marginLeft:12px;" @mousedown="leftFun(0)" @mouseup="leftFun(1)">
          <img class="rotate90" src="./img/arrow.png" alt="">
        </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="放大" placement="right-end">
          <span style="marginRight:4px;" @mousedown="enLargeFun(0)" @mouseup="enLargeFun(1)">
              <img class="rotate270" src="./img/enlarge.png" alt="" style="marginTop:7px;">
          </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="right-end">
          <span @mousedown="shrinkFun(0)" @mouseup="shrinkFun(1)">
            <img class="rotate270" src="./img/shrink.png" alt="" style="marginTop:7px;">
          </span>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="右" placement="right-end">
          <span style="float:right;marginRight:12px;" @mousedown="rightFun(0)" @mouseup="rightFun(1)">
            <img class="rotate270" src="./img/arrow.png" alt="">
          </span>
        </el-tooltip>
      </div>
      <div style="height:40px;lineHeight:50px;">
        <el-tooltip class="item" effect="dark" content="下" placement="right-end">
          <span @mousedown="bottomFun(0)" @mouseup="bottomFun(1)">
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
import playVideo from './playVideo';
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
      StreamType: '',
    };
  },
  components: {playVideo},
  props: {
    channel: {
      type: String
    },
    fStreamType: {
      type: String,
      default: ''
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
    },
    playWay: {
      type: String,
      default: 'RTMP'
    },
    playType: {
      type: String,
      default: ''
    }
  },
  watch: {
    'fStreamType': function (newVal, oldVal) {
      if (newVal && newVal != oldVal) {
        this.StreamType = newVal
        console.log(newVal, '123123')
      }
    },
    'channel':function(newVal, oldVal) {
      if (newVal || newVal == 0) {
          this.setUrl(newVal);
          this.judgeIframe();
      }
    },
  },
  components: { playVideo },

  mounted() {
    this.StreamType = this.fStreamType
    console.log(this.StreamType, 'StreamType');
    this.setSize();
    this.setUrl(this.channel);
    this.judgeIframe();
    window.addEventListener("resize", this.resizeFun);
  },
  destroyed() {
    window.removeEventListener("resize", this.resizeFun);
  },
  methods: {
    // 切换码流
    async changeStreamType(e) {
      console.log('切换码流', e)
    },
    resizeFun() {
      let nowDate = new Date().getTime();
      global[`single${this.channel}`] = nowDate;
      setTimeout(()=>{
          let nowDate = new Date().getTime();
          if (global[`single${this.channel}`] && nowDate - global[`single${this.channel}`] > 200) {
              this.changeLayerSize();
          }
      }, 300)
    },
    setSize() {
      let parentDom = this.$refs.iframe.parentNode;
      this.screenWidth = parentDom.offsetWidth;
      let reduceHeight = 0;
      if (this.type == 'small') {
        reduceHeight = 22;
      }
      this.screenHeight = parentDom.offsetHeight - reduceHeight;
    },
    changeLayerSize() {
        const mobsf = this.$refs.iframe.parentNode;
        this.screenWidth = mobsf.offsetWidth;
        let reduceHeight = 0;
        if (this.type == 'small') {
          reduceHeight = 20;
        }
        this.screenHeight = mobsf.offsetHeight - reduceHeight;
        this.changeSize(this.screenWidth,this.screenHeight);
    },
    changeSize(width,height){
        let type = '';
        if (this.playType) {
          if (this.playType === 'flv') {
            type = '';
          } else if (this.playType === 'rtmp') {
            type = '&protocol=RTMP';
          }
        } else {
          type = this.playWay === 'RTMP' ? '&protocol=RTMP': '';
        }
        this.url = `${process.env.PLAY_URL}/play.html?channel=${this.channelId}${type}&iframe=yes&muted=yes&stretch=yes&aspect=${width}x${height};`;
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
      let iframeWindow = document.getElementById("iframeVideo").contentWindow;
      this.channelId = channel;
      let type = '';
      if (this.playType) {
        if (this.playType === 'flv') {
          type = '';
        } else if (this.playType === 'rtmp') {
          type = '&protocol=RTMP';
        }
      } else {
        type = this.playWay === 'RTMP' ? '&protocol=RTMP': '';
      }
      this.url = `${process.env.PLAY_URL}/play.html?channel=${channel}${type}&iframe=yes&muted=yes&stretch=yes&aspect=${this.screenWidth}x${this.screenHeight}&timestamp=${new Date().getTime()};`;
    },
    // 0:上  1：下  2：左  3：右   4：放大  5：缩小
    // 上
    async upFun(isStop) {
      if(!this.ptaControl) {
        this.$message.warning('此摄像头不可控制！');
        return;
      }
      let res = await cloudControl.cloudControlOpe(this.nvrIP, this.fRealityChannel, 0, isStop);
      if(res.success){

      }else{
        this.$message.warning(res.msg);
      }
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