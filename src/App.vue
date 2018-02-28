<template>
  <div id="app">
    <input type="file" name="files" id="files" multiple @change="processFile($event)">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="文件名" width="180"></el-table-column>
      <el-table-column prop="pageCount" label="页数" width="180"></el-table-column>
      <el-table-column prop="preview" label="预览" width="180">
        <template slot-scope="scope">
          <pdf class="preview" :src="scope.row.address" @num-pages="updatePageCount($event, scope.$index)"></pdf>
        </template>
      </el-table-column>
      <el-table-column prop="pagesPerSheet" label="页每张" width="180">
        <template slot-scope="scope">
          <el-select v-model="scope.row.pagesPerSheet" @change="handlePagesPerSheetChange($event, scope.$index)">
            <el-option v-for="item in options" :key="item" :label="item+'页每张'" :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="duplexPrint" label="双面" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.duplexPrint === true"></span>
          <el-switch @change="handleDuplexPrintChange($event, scope.$index)" v-model="scope.row.duplexPrint" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sheetsNeeded" label="张数" width="180"></el-table-column>

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
      options: [1, 2, 4, 6],
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
        item.pagesPerSheet = 1
        item.duplexPrint = true
        item.sheetsNeeded = 0
        this.tableData.push(item)
      }
    },
    updatePageCount(event, index) {
      if (event) {
        let newItem = this.tableData[index]
        newItem.pageCount = event
        newItem.sheetsNeeded = event
        this.$set(this.tableData, index, newItem)
      }
    },
    handlePagesPerSheetChange(event, index) {
      if (event) {
        let newItem = this.tableData[index]
        newItem.pagesPerSheet = event
        this.$set(this.tableData, index, newItem)
      }
      this.updateSheetsNeeded(index)
    },
    handleDuplexPrintChange(event, index) {
      let newItem = this.tableData[index]
      newItem.duplexPrint = event
      this.$set(this.tableData, index, newItem)
      this.updateSheetsNeeded(index)
    },
    updateSheetsNeeded(index) {
      let newItem = this.tableData[index]
      let sheets = newItem.pageCount
      sheets = Math.ceil(sheets / newItem.pagesPerSheet)
      if (newItem.duplexPrint) {
        sheets = Math.ceil(sheets / 2)
      }
      newItem.sheetsNeeded = sheets
      this.$set(this.tableData, index, newItem)
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
