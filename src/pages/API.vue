<template>
  <div class="api" v-loading="loading">
    <div class="apiedit_header">
      <div
       v-if="data"
        style="
          font-size: 16px;
          color: #ffffff;
          display: inline-block;
          font-weight: bolder;
    margin-top: 12px;
    margin-left: 12px;
        "
        >文档 ： {{data.interfaceName}}</div
      >
    </div>
    <div class="apiedit_content" id="apiedit_box"></div>
  </div>
</template>
<script>
import E from "wangeditor";
import { selectinterfaceLink } from "@/api/api.js";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      data:null
    };
  },
  methods: {
    //获取url参数列表
    getUrlParam(key) {
      var value = "";
      let geturl = window.location.href;
      if (geturl.indexOf("?") != -1) {
        let getqyinfo = geturl.split("?")[1];
        if (getqyinfo&&getqyinfo!=""&&getqyinfo.indexOf("&") == -1 && getqyinfo.indexOf("=") != -1) {
          value = getqyinfo.split("=")[1];
        }
      }

      return value;
    },
    setEdit() {
      var that = this;
      this.editor = new E("#apiedit_box");
      // 设置编辑区域高度为
      this.editor.config.height = window.innerHeight - 55;
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
      this.editor.create();
      this.editor.txt.html(this.data.interfaceText);
      this.editor.disable();
    },
    //查询API列表
    req_selectinterfaceLink() {
      var id = this.getUrlParam();
      if (id == "") {
        this.$message({
          type: "error",
          message: "非法参数",
        });
        return;
      }
      this.loading = true;
      // 传得参数对象
      let param = {
        interfaceid: id,
      };
      selectinterfaceLink(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
             if(res.data&&res.data.length>0){
                this.data=res.data[0];
                this.setEdit();
             }
          }
        })
        .catch((res) => {
          this.loading = false;
        });
    },
  },

  mounted() {
    this.req_selectinterfaceLink();
  },
  created() {},
};
</script>
<style>
</style>
<style scoped>
.api {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.apiedit_header {
  height: 40px;
  width: 100%;
  background: #007077;
}
.apiedit_content {
  width: 100%;
  /*Firefox*/
  height: -moz-calc(100% - 45px);
  /*chrome safari*/
  height: -webkit-calc(100% - 45px);
  /*Standard */
  height: calc(100% - 45px);
  font-size: 14px;
}
</style>