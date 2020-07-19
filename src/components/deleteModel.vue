<template>
  <div>
    <el-dialog
      :visible.sync="deleteObj.deleteModel"
      width="360">
      <div style="text-align:center">
        <p style="color:#535353;font-size:18px;font-weight:700;">{{deleteObj.prompt}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteObj.deleteModel = false">取 消</el-button>
        <el-button type="primary" @click="del">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

  export default {
    data () {
      return {
      }
    },
    props: {
      deleteObj: {
        // type: Object
      },
    },
    methods: {
      del(){
        this.deleteObj.del.del();
      },
    }
  }
</script>