<template>
  <div id="app">
    <input type="file" name="files" id="files" multiple @change="processFile($event)">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="文件名" width="180"></el-table-column>
      <el-table-column prop="pages" label="页数" width="180">
        <template slot-scope="scope">
          <pdf class="" :src="scope.row.address"></pdf>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
  name: 'pageCounter',
  components: {
    pdf
  },
  data() {
    return {
      visible: false,
      tableData: [],
      fileList: []
    }
  },
  methods: {
    processFile(event) {
      this.fileList = event.target.files
      this.tableData = []
      const URL = window.URL || window.webkitURL
      for (let item of this.fileList) {
        item.address = URL.createObjectURL(item)
        this.tableData.push(item)
      }
      console.log(this.tableData)
    }
  }
}
</script>

<style>

</style>
