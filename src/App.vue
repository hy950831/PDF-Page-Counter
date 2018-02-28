<template>
  <div id="app">
    <input type="file" name="files" id="files" multiple @change="processFile($event)">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="文件名" width="180"></el-table-column>
      <el-table-column prop="pageCount" label="页数" width="180">
      </el-table-column>
      <el-table-column prop="preview" label="预览" width="180">
        <template slot-scope="scope">
          <pdf class="preview" :src="scope.row.address" @num-pages="updatePageCount($event, scope.$index)"></pdf>
        </template>
      </el-table-column>
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
        item.pageCount = 0
        this.tableData.push(item)
      }
    },
    updatePageCount(event, index) {
      if (event) {
        let newItem = this.tableData[index]
        newItem.pageCount = event
        this.$set(this.tableData, index, newItem)
      }
    }
  }
}
</script>

<style>
.preview {
  display: inline-block;
  height: 200px;
}
</style>
