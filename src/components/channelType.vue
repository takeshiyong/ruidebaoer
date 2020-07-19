<!--  -->
<template>
  <el-select filterable :value="value" @change="change" clearable placeholder="请选择摄像头类型" :style="width ? `width: ${width}px` : ''">
    <el-option
      v-for="item in options"
      :key="item.fId"
      :label="item.fItemName"
      :value="item.fItemValue">
    </el-option>
  </el-select>
</template>

<script>
    import { CatalogService } from '@/api/personal-info' // api
export default {
  data () {
    return {
      options: []
    };
  },
  props: {
    value: {
      type: String
    },
    width: {
      type: Number
    }
  },
  components: {},

  computed: {},

  mounted() {
    this.getPosition();
  },

  methods: {
    // 获取摄像头类型数据
    async getPosition() {
      const res = await signinService.getDictionaryItems('sxtlx');
      if (res.success) {
        console.log(res.obj);
        this.options = res.obj
      }
    },
    change(data) {
      this.$emit('change', data);
    }
  }
}

</script>
<style lang='scss' scoped>
</style>