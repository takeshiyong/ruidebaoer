<!--  -->
<template>
  <div style="width: 100%;height: 100%;display: flex;justifyContent: center;alignItems: center;overflow:hidden;">
    <playVideo :channelId="channelId0" :tem="tem" :isBig="isBig"></playVideo>
  </div>
</template>

<script>
import playVideo from './playVideo';
export default {
  data () {
    return {
      heartbeat: null,
      index: 0,
      cycInterval: null,
      channelId0: '',
    };
  },
  components: {
    playVideo
  },
  props: {
    isBig: {
      type: Boolean,
      default: false
    },
    channels: {
      type: Array
    },
    cycTime: {
      type: Number
    },
    type: {
      type: String,
      default: 'big'
    },
  },
  components: {
    playVideo
  },
  computed: {},
  mounted() {
    this.channel = this.channels[0]; // 开始设置第一个channel
    this.setInitCycInterval();
  },
  destroyed() {
    this.removeHeartbeat();
    this.closeCyc();
  },
  methods: {
    closeCyc() {
      if (this.cycInterval) {
        clearInterval(this.cycInterval);
      }
    },
    // 设置循环计时器
    setInitCycInterval() {
      this.closeCyc();
      this.cycInterval = setInterval(()=>{
        // 计算真实显示通道号下标
        this.index++;
        let index = this.index % this.channels.length;
        this.setUrl(this.channels[index]);
      }, this.cycTime * 1000);
    },
    // 设置url
    setUrl(channel, flag) {
      this.channelId0 = channel;
    },   
  }
}
</script>
