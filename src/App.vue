<template>
  <div id="app">
    <input ref="files" type="file" class="selectfiles" accept=".pdf" name="files" id="files" multiple @change="processFile($event)">
    <el-button size="small" type="primary" @click="upload">
      点此上传
    </el-button>
    <el-button size="small" type="primary" @click="switchDuplex">
      单双切换
    </el-button>
    <el-button size="small" type="primary" @click="addOneCopy">
      整体加一
    </el-button>
    <el-button size="small" type="primary" @click="subOneCopy">
      整体减一
    </el-button>
    <h3 style="text-align:center">共计 {{tableData.length}} 文件 {{totalSheetCount}} 张</h3>
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="name" label="文件名" min-width="110" align="center"></el-table-column>
      <el-table-column prop="copies" label="份数" width="150" align="center">
        <template slot-scope="scope">
          <el-input-number size="mini" v-model="scope.row.copies" controls-position="right" @change="handleCopiesChange($event, scope.$index)" :min="1" :max="100"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="pageCount" label="页数" width="110" align="center"></el-table-column>
      <el-table-column prop="preview" label="预览" width="120" align="center">
        <template slot-scope="scope">
          <pdf class="preview" :src="scope.row.address" @num-pages="updatePageCount($event, scope.$index)"></pdf>
        </template>
      </el-table-column>
      <el-table-column prop="pagesPerSheet" label="页每张" width="180" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.pagesPerSheet" @change="handlePagesPerSheetChange($event, scope.$index)">
            <el-option v-for="item in options" :key="item" :label="item+'页每张'" :value="item">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="duplexPrint" label="双面" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.duplexPrint === true"></span>
          <el-switch @change="handleDuplexPrintChange($event, scope.$index)" v-model="scope.row.duplexPrint" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="sheetsNeeded" label="张数" width="180" align="center"></el-table-column>
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
      totalSheetCount: 0
    }
  },
  methods: {
    upload() {
      this.$refs.files.click()
    },
    clean() {
      this.tableData = []
      this.totalSheetCount = 0
    },
    processFile(event) {
      this.clean()
      this.fileList = event.target.files
      this.tableData = []
      const URL = window.URL || window.webkitURL
      for (let item of this.fileList) {
        item.address = URL.createObjectURL(item)
        item.pageCount = 0
        item.copies = 1
        item.pagesPerSheet = 1
        item.duplexPrint = true
        item.sheetsNeeded = 0
        this.tableData.push(item)
      }
    },
    addOneCopy() {
      this.tableData = this.tableData.map((item) => {
        item.copies += 1
        return item
      })
      this.tableData.map((item, index) => {
        this.updateSheetsNeeded(index)
      })
    },
    subOneCopy() {
      this.tableData = this.tableData.map((item) => {
        if (item.copies > 1) {
          item.copies -= 1
        }
        return item
      })
      this.tableData.map((item, index) => {
        this.updateSheetsNeeded(index)
      })
    },
    switchDuplex() {
      this.tableData = this.tableData.map((item) => {
        item.duplexPrint = !item.duplexPrint
        return item
      })
      this.tableData.map((item, index) => {
        this.updateSheetsNeeded(index)
      })
    },
    updatePageCount(event, index) {
      if (event) {
        let newItem = this.tableData[index]
        newItem.pageCount = event
        this.$set(this.tableData, index, newItem)
        this.updateSheetsNeeded(index)
        this.updateTotalSheetCount()
      }
    },
    handlePagesPerSheetChange(event, index) {
      if (event) {
        let newItem = this.tableData[index]
        newItem.pagesPerSheet = event
        this.$set(this.tableData, index, newItem)
        this.updateSheetsNeeded(index)
      }
    },
    handleDuplexPrintChange(event, index) {
      let newItem = this.tableData[index]
      newItem.duplexPrint = event
      this.$set(this.tableData, index, newItem)
      this.updateSheetsNeeded(index)
    },
    handleCopiesChange(event, index) {
      let newItem = this.tableData[index]
      newItem.copies = event
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
      sheets *= newItem.copies
      newItem.sheetsNeeded = sheets
      this.$set(this.tableData, index, newItem)
      this.updateTotalSheetCount()
    },
    updateTotalSheetCount() {
      this.totalSheetCount = 0
      for (let item of this.tableData) {
        this.totalSheetCount += item.sheetsNeeded
      }
    }
  }
}
</script>

<style>
.preview {
  display: inline-block;
}
.selectfiles {
  display: none;
}
</style>
