<template>
  <div class="apiedit" v-loading="loading">
    <div class="apiedit_header">
      <span
        v-if="edit_can=='ok'"
        style="
          font-size: 14px;
          color: #777777;
          display: inline-block;
          margin-left: 4px;
        "
        >接口名称：</span
      >
      <el-input
        v-if="edit_can=='ok'"
        style="width: 200px"
        size="mini"
        placeholder="请输入接口名称"
        v-model="mdata.interfaceName"
        clearable
      >
      </el-input>
      <span
        style="
          font-size: 14px;
          color: #777777;
          display: inline-block;
          margin-left: 20px;
        "
        >备注：</span
      >
      <el-input 
        :disabled="edit_can=='no'"
        style="width: 300px"
        size="mini"
        placeholder="备注"
        v-model="mdata.interfaceNote"
        clearable
      >
      </el-input>
      <el-button
         v-if="edit_can=='ok'"
        class="search_button"
        style="float: right; margin-top: 4px; margin-right: 12px"
        type="primary"
        size="mini"
        @click="click_ok"
        >保存
      </el-button>
    </div>
    <div class="apiedit_content" id="apiedit_box"></div>
  </div>
</template>
<script>
import E from "wangeditor";
import { insetiinterface, updeteinterface } from "@/api/api.js";
export default {
  name: "ApiEdit",
  props: ["mdata","edit_can"],
  watch: {},
  data() {
    return {
      loading: false,
      now_text: "",
    };
  },
  methods: {
    //点击了保存
    click_ok() {
      if (this.mdata.interfaceName == "") {
        this.$message({
          type: "warning",
          message: "请请输入接口名称",
        });
        return;
      }
      if(this.mdata.interfaceId&&this.mdata.interfaceId!=""){
         this.req_updeteinterface();
      }else{
         this.req_insetiinterface();
      }
      
    },
    save_sucess() { 
      if(this.edit_can=="no"){ 
        this.$emit("closedrawer", "showclose");
      }else{
        this.$emit("closedrawer", "close");
      }
      
    },
    //新增接口
    req_insetiinterface() {
      this.loading = true;
      // 传得参数对象
      let param = {
        interfaceName: this.mdata.interfaceName,
        interfaceNote: this.mdata.interfaceNote,
        interfaceText: this.now_text,
        interfaceTypeId: this.mdata.interfaceTypeId
      };
      insetiinterface(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.save_sucess();
          }else{
              this.$message({
                type: "error",
                message: res.msg,
              });
          }
        })
        .catch((res) => {
          this.api_loading = false;
        });
    },
    //保存接口
    req_updeteinterface() {
      this.loading = true;
      // 传得参数对象
      let param = {
        interfaceId:this.mdata.interfaceId,
        interfaceName: this.mdata.interfaceName,
        interfaceNote: this.mdata.interfaceNote,
        interfaceText: this.now_text,
        interfaceTypeId: this.mdata.interfaceTypeId
      };
      updeteinterface(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.save_sucess();
          }else{
              this.$message({
                type: "error",
                message: res.msg,
              });
          }
        })
        .catch((res) => {
          this.api_loading = false;
        });
    },
    set_now_html(txt){
      this.now_text=txt;
    }
  },
  mounted() {
    var that=this;
    this.editor = new E("#apiedit_box");
    // 设置编辑区域高度为
    this.editor.config.height = window.innerHeight - 130;
    // 配置菜单栏
    this.editor.config.menus = [
      "head",
      "bold",
      "fontSize",
      "fontName",
      "italic",
      "underline",
      "strikeThrough",
      "indent",
      "lineHeight",
      "foreColor",
      "backColor",
      "link",
      "list",
      "todo",
      "justify",
      "quote",
      "emoticon",
      "table",
      "code",
      "splitLine",
      "undo",
      "redo",
    ];
    // 配置 onchange 回调函数
    this.editor.config.onchange = function (newHtml) {
      that.set_now_html(newHtml); 
    };
    // 配置触发 onchange 的时间频率，默认为 200ms
    this.editor.config.onchangeTimeout = 200; // 修改为 200
    this.editor.create();
    this.editor.txt.html(this.mdata.interfaceText); 
    if(this.edit_can=="no"){ 
        this.editor.disable()
    }
  },
  created() {},
  beforeDestroy() {},
};
</script>
<style scoped>
.apiedit {
  width: 100%;
  height: 100%;
  font-size: 14px;
  padding-left: 8px;
}
.apiedit_header {
  height: 40px;
  width: 100%;
}

.apiedit_header_title {
  display: inline-block;
  font-size: 14px;
  font-family: PingFang SC-中黑体, PingFang SC;
  font-weight: bold;
  color: #009fa2;
  box-sizing: border-box;
  padding-top: 8px;
}
.apiedit_content {
  width: 100%;
  /*Firefox*/
  height: -moz-calc(100% - 45px);
  /*chrome safari*/
  height: -webkit-calc(100% - 45px);
  /*Standard */
  height: calc(100% - 45px);
}
</style>