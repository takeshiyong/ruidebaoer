<!--  -->
<template>
  <div style="width:100%;overflowX:hidden">
    <div style="width: 100%;" v-for="(item, index) in treeData" :key="item.fId">
        <div :class="`tree-item ${item.current ? 'tree-item-active' : ''}`" :style="`paddingLeft: ${padding}px`" @click="toggleExpend(item, index)">
          <div class="text-overflow" :title="item.fName">
            <i v-if="item.fType === 1" class="redoublefont redouble-point pointStyle" style="paddingRight: 10px;color: #ccc!important"></i>
            <i v-else class="redoublefont redouble-biaoge pointStyle" style="margin-left: 10px;paddingRight: 17px;color: #ccc!important;font-size: 12px"></i>{{item.fName}}
          </div>
          <el-tooltip effect="dark" content="摄像头数量" placement="top">
            <span>{{item.fNum}}</span>
          </el-tooltip>
        </div>
        <div v-if="item.expend && item.fVideoChannelConfigList" v-for="(val, i) in item.fVideoChannelConfigList" :key="val.fId" :class="`tree-item tree-child ${val.current ? 'tree-item-active' : ''}`"  style="paddingLeft: 0px" @click="toggleExpend(val, index, i)">
          <draggable style="width: 100%" @end="dragEnd" @start="dragStart($event, val.treeData)" v-model="val.treeData" :options="{group:{name: 'people1', put: 'baz', pull: 'clone'},fallbackOnBody: false, sort: false}">
            <transition-group>
              <div class="camera-item" :style="`paddingLeft: ${padding + 46}px;`" v-for="data of val.treeData" :key="data.fId" >
                  <span class="camera-item">
                    <div v-if="!val.fEnable" class="disabled-channel">
                      <i class="redoublefont redouble-jinyong"></i>
                      <i class="redoublefont redouble-shexiangtou pointStyle"></i>
                    </div>
                    <i v-else class="redoublefont redouble-shexiangtou pointStyle spli" :style="`color: ${val.fState == 1 ? '#0DBC79!important': ''}`"></i>
                    <span class="drag-item" :style="`color: #333`" :title="val.fName">{{val.fName}}</span>
                    <div v-if="val.fEnable">
                      <el-tooltip effect="dark" content="推送大屏" placement="top">
                        <i class="redoublefont redouble-iconcopy showsss" style="z-index: 99" @click="showScreen($event, data)"></i>
                      </el-tooltip>
                      <i class="redoublefont redouble-bofang1 showss" style="z-index: 99" @click="showChannelVideo($event, data)"></i>
                    </div>
                  </span>
              </div>
            </transition-group>
          </draggable>
        </div>
        
        <div v-if="item.expend && item.cantEdit" v-for="(val, i) in item.fVideoAreaList" :key="val.fId" :class="`tree-item tree-child ${val.current ? 'tree-item-active' : ''}`"  style="paddingLeft: 0px" @click="toggleExpend(val, index, i)">
          <draggable @end="dragEnd" @start="dragStart($event, val.treeData)" v-model="val.treeData" :options="{group:{name: 'people1', put: 'baz', pull: 'clone'},fallbackOnBody: false, sort: false}" style="width: 100%">
            <transition-group>
              <div class="camera-item" :style="`paddingLeft: ${padding + 36}px;`" v-for="data of val.treeData" :key="data.fId" >
                <div class="camera-item">
                  <div v-if="!val.fEnable" class="disabled-channel">
                    <i class="redoublefont redouble-jinyong" style="color:red!important"></i>
                    <i class="redoublefont redouble-shexiangtou pointStyle"></i>
                  </div>
                  <i v-else class="redoublefont redouble-shexiangtou pointStyle spli" :style="`color: ${val.fState == 1 ? '#0DBC79!important': ''}`"></i><span class="drag-item" :style="`color: #333`" :title="val.fName">{{val.fName}}</span>
                  <div v-if="val.fEnable">
                    <el-tooltip effect="dark" content="推送大屏" placement="top">
                      <i class="redoublefont redouble-iconcopy item-showsss" style="z-index: 99" @click="showScreen($event, data)"></i>
                    </el-tooltip>
                    <i class="redoublefont redouble-bofang1 item-showss" style="z-index: 99" @click="showChannelVideo($event, data)"></i>
                  </div>
                </div>
              </div>
            </transition-group>
          </draggable>
        </div>

        <div v-if="item.expend && !item.cantEdit" v-for="(obj,idx) in item.fVideoAreaList" :key="obj.key">
          <div :class="`tree-item ${obj.current ? 'tree-item-active' : ''}`" :style="`paddingLeft: ${padding+26}px`"  @click="toggleExpend(obj, index, idx)">
            <div class="text-overflow" :title="obj.fName">
              <i class="redoublefont redouble-point pointStyle" style="paddingRight: 10px;"></i>{{obj.fName}}
            </div>
            <el-tooltip effect="dark" content="摄像头数量" placement="top">
              <span>{{obj.fNum}}</span>
            </el-tooltip>
          </div>
          <div v-if="obj.expend" v-for="(val, i) in obj.fVideoChannelConfigList" :key="val.fId" :class="`tree-item tree-child ${val.current ? 'tree-item-active' : ''}`"  style="paddingLeft: 0px" @click="toggleExpend(val, index, idx, i)">
            <draggable style="width: 100%" @end="dragEnd" @start="dragStart($event, val.treeData)" v-model="val.treeData" :options="{group:{name: 'people1', put: 'baz', pull: 'clone'},fallbackOnBody: false, sort: false}">
              <transition-group>
                <div class="camera-item" :style="`paddingLeft: ${padding + 46}px;`" v-for="data of val.treeData" :key="data.fId" >
                    <span class="camera-item">
                      <div v-if="!val.fEnable" class="disabled-channel">
                        <i class="redoublefont redouble-jinyong"></i>
                        <i class="redoublefont redouble-shexiangtou pointStyle"></i>
                      </div>
                      <i v-else class="redoublefont redouble-shexiangtou pointStyle spli" :style="`color: ${val.fState == 1 ? '#0DBC79!important': ''}`"></i><span class="drag-item" :style="`color: #333`" :title="val.fName">{{val.fName}}</span>
                      <div v-if="val.fEnable">
                        <el-tooltip effect="dark" content="推送大屏" placement="top">
                          <i class="redoublefont redouble-iconcopy showsss" style="z-index: 99" @click="showScreen($event, data)"></i>
                        </el-tooltip>
                        <i class="redoublefont redouble-bofang1 showss" style="z-index: 99" @click="showChannelVideo($event, data)"></i>
                      </div>
                    </span>
                </div>
              </transition-group>
            </draggable>
          </div>
        </div>

    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
export default {
  name: 'tree',
  data () {
    return {
    };
  },
  props: {
    treeData: Array,
    padding: {
      type: Number,
      default: 0
    }
  },
  components: {draggable},

  computed: {},

  mounted() {},

  methods: {
    toggleExpend(item, index, idx, i) {
      this.$emit('toggleExpends', item, index, idx, i);
      this.$forceUpdate()
    },
    getUesrObjs(data) {
      this.$emit('getUesrObj', data)
    },
    endUserObjs(event) {
      this.$emit('endUserObj', event)
    },
    dragStart(event, item) {
      this.$emit('dragStart', item);
    },
    dragEnd(event) {
      this.$emit('dragEnd', event);
    },
    showChannelVideo(event, item) {
      this.$emit('showVideo', item);
    },
    clickLocation(event, item) {
      this.$emit('clickLocation', item);
    },
    showScreen(event, item) {
      this.$emit('showScreen', item)
    }
  }
}

</script>
<style lang='scss' scoped>
  .drag-item {
    font-size: 14px;
    color: #606266;
    display: inline-block;
    width:100%;
    padding-left: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    word-wrap:break-word
  }
  .text-overflow{
    width:100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    word-wrap:break-word
  }
.tree-item {
    padding: 3px 5px 3px 15px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    justify-content: space-between;

    .tree-stop {
      display: inline-block;
      width: 0px;
      height: 0px;
      border-left: 3px solid  transparent;
      border-right: 3px solid transparent;
      border-top: 6px solid #C0C4CC;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .tree-start {
      display: inline-block;
      width: 0px;
      height: 0px;
      border-top: 3px solid transparent;
      border-bottom: 3px solid transparent;
      border-left: 6px solid #C0C4CC;
      position: absolute;
      top: 10px;
      left: 10px;
    }
    .tree-child {
      padding-left: 20px;
    }
  }
  .showss {
    display: none;
    color: #ccc;
  }
  .showsss {
    display: none;
    color: #ccc;
  }
  .item-showss {
    display: none;
    color: #ccc;
  }
  .item-showsss {
    display: none;
    color: #ccc;
  }
  .tree-item:hover {
    background-color: #f5f7fa;
    .item-showss {
      position: absolute;
      right: 30px;
      top: 5px;
      display: inline-block;
    }
    .item-showsss {
      position: absolute;
      right: 60px;
      top: 5px;
      display: inline-block;
    }
    .showss {
      position: absolute;
      right: 30px;
      top: 5px;
      display: inline-block;
    }
    .showsss {
      position: absolute;
      right: 58px;
      top: 5px;
      display: inline-block;
    }
  }
  .tree-item-active {
    background-color: #f1f1f1!important;
    color: #333!important;
  }
  .pointStyle {
    font-size: 24px;
    color: #ccc!important;
    vertical-align: middle;
    margin-left: 4px;
  }
  .camera-item {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding-right: 10px;
  }
  .disabled-channel {
    display: inline-block;
    position: relative;
    width: 38px;
    .redouble-jinyong{
      position: absolute;
      top: 1px;
      left: -4px;
      font-size: 40px;
      z-index: 99;
      color: #ccc!important;
    }
    .redouble-shexiangtou {
      position: absolute;
      top: 0px;
      left: 3px;
      font-size: 20px;
    }
  }
  .no-location {
    position: relative;

  }

</style>