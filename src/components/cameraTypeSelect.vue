<!--  -->
<template>
  <el-select filterable :value="value" @change="change" clearable placeholder="请选择分类" :style="width ? `width: ${width}px` : ''">
    <el-option
      v-for="item in options"
      :key="item.fId"
      :label="item.fSiteName"
      :value="item.fId">
    </el-option>
  </el-select>
</template>

<script>
import { AreasManagmentService } from '@/api/areas-managment' // 请求api
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
    this.getPlace();
  },

  methods: {
    // 获取生产场所
    async getPlace() {
      const res = await AreasManagmentService.getAllAreasData('');
      if (res.success) {
        this.options = res.obj
      }
    },
    change(data) {
      this.$emit('changePlace', data);
    }
  }
}

</script>
<style lang='scss' scoped>
</style>