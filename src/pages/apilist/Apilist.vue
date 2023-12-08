<template>
  <div class="apilist" v-loading="loading">
    <div class="apilist_left">
      <div class="apilist_header">
        <div class="apilist_header_title">项目列表:</div>
      </div>
      <div class="apilist_box">
        <DataHint v-if="pro_list.length == 0" mes="暂无项目"></DataHint>
        <div
          class="pro_item"
          v-for="(item, index) in pro_list"
          :key="index"
          :class="pro_now_select_index == index ? 'pro_item_select' : ''"
          @click="click_pro_item(item, index)"
        >
          <div class="pro_item_name">{{ item.hospitalName }}</div>
        </div>
      </div>
    </div>
    <div class="apilist_center">
      <div class="apilist_header">
        <div class="apilist_header_title">类别列表:</div>
        <el-button
          class="search_button"
          style="float: right; margin-top: 10px; margin-right: 12px"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="click_type_add"
          >新增类别
        </el-button>
      </div>
      <div class="apilist_box" v-loading="type_loading">
        <DataHint v-if="type_list.length == 0" mes="无相关类别"></DataHint>
        <div
          class="pro_item"
          v-for="(item, index) in type_list"
          :key="index"
          :class="type_now_select_index == index ? 'pro_item_select' : ''"
          @click="click_type_item(item, index)"
        >
          <div class="pro_item_name">{{ item.interfaceTypeName }}</div>
          <el-button
            type="text"
            style="color: #f63b3b; vertical-align: top; margin-top: -4px"
            @click="click_type_delete(item)"
            >删除</el-button
          >
          <el-button
            type="text"
            style="
              color: #007077;
              margin-left: 8px;
              vertical-align: top;
              margin-top: -4px;
            "
            @click="click_type_update(item)"
            >编辑</el-button
          >
        </div>
      </div>
    </div>
    <div class="apilist_right">
      <div class="apilist_header">
        <div class="apilist_header_title">文档列表:</div>
        <el-button
          class="search_button"
          style="float: right; margin-top: 10px; margin-right: 12px"
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="click_api_add"
          >新增文档
        </el-button>
      </div>
      <div class="apilist_box" v-loading="api_loading">
        <el-table
          :data="api_list"
          height="100%"
          ref="table"
          class="open_table"
          :header-cell-style="{ background: '#F5F7F9', color: '#555555' }"
        >
          <DataHint slot="empty" mes="暂无文档记录"></DataHint>
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column label="接口名称">
            <template slot-scope="scope">
              <p style="color: #009fa2" v-html="scope.row.interfaceName"></p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <p style="color: #777777" v-html="scope.row.createTime"></p>
            </template>
          </el-table-column>
          <el-table-column label="修改时间">
            <template slot-scope="scope">
              <p style="color: #777777" v-html="scope.row.updataTime"></p>
            </template>
          </el-table-column>
          <el-table-column label="接口备注">
            <template slot-scope="scope">
              <p style="color: #777777" v-html="scope.row.interfaceNote"></p>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="scope">
              <el-button
                @click="click_api_delete(scope.row)"
                type="text"
                style="color: #dc1515"
                size="small"
                >删除</el-button
              >
              <el-button
                @click="click_api_update(scope.row)"
                type="text"
                style="color: #ff9900"
                size="small"
                >编辑</el-button
              >
              <el-button
                @click="click_api_detail(scope.row)"
                type="text"
                style="color: #007077"
                size="small"
                >详情</el-button
              >
               <el-button
                @click="click_api_share(scope.row)"
                type="text"
                style="color: #007077"
                size="small"
                >分享地址</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="isTypeEdit ? '修改类别' : '新增类别'"
      :visible.sync="type_window_show"
      :show-close="false"
      width="35%"
    >
      <el-form
        :model="type_detail"
        status-icon
        :rules="type_rules"
        ref="LeftForm"
        label-width="100px"
        class="demo-LeftForm"
      >
        <el-form-item label="类别名称" prop="interfaceTypeName">
          <el-input
            type="text"
            v-model="type_detail.interfaceTypeName"
            id="interfaceTypeName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            style="float: right"
            type="primary"
            @click="submitForm_api('LeftForm')"
            >确定</el-button
          >
          <el-button
            style="float: right; margin-right: 20px"
            @click="resetForm('LeftForm')"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-drawer
      :title="api_drawer_title"
      :visible.sync="api_drawer_open"
      style="font-size: 14px"
      direction="ltr"
      size="90%"
    >
      <ApiEdit
        v-if="api_drawer_open"
        :mdata="api_select_item"
        :edit_can="edit_can"
        @closedrawer="playdrawer"
      ></ApiEdit>
    </el-drawer>
  </div>
</template>

<script>
import DataHint from "../../components/hint/DataHint.vue";
import ApiEdit from "../../components/apilist/ApiEdit.vue";
import {
  selectitemname,
  selectitemtype,
  insettypename,
  updetetypename,
  deleteTypename,
  selectinterface,
  insetiinterface,
  updeteinterface,
  deleteinterface,
} from "@/api/api.js";
export default {
  name: "Apilist",
  components: {
    DataHint,
    ApiEdit,
  },
  data() {
    return {
      loading: false,
      m_user_code: "",

      pro_list: [],
      pro_now_select_index: "-1",
      pro_now_select_item: null,

      type_loading: false,
      type_list: [],
      type_now_select_index: "-1",
      type_now_select_item: null,

      type_window_show: false,
      isTypeEdit: false, //是否是编辑
      type_detail: {},
      //字段输入校验
      type_rules: {
        interfaceTypeName: {
          required: true,
          message: "请输入类别名称",
          trigger: "blur",
        },
      },

      api_loading: false,
      api_list: [],
      api_select_item: null,

      api_drawer_title: "新增文档",
      api_drawer_open: false,
      edit_can: "ok", //编辑器是否可编辑
    };
  },
  methods: {
    //关闭新增和修改接口窗口
    playdrawer(type) {
      if (type == "close") {
        this.api_drawer_open = false;
        this.req_selectinterface();
      } else if (type == "showclose") {
        this.api_drawer_open = false;
      }
    },
    //新增接口
    click_api_add() {
      this.api_drawer_open = true;
      this.edit_can = "ok";
      this.api_select_item = {
        createTime: "",
        interfaceId: "",
        interfaceName: "",
        interfaceNote: "",
        interfaceText: "",
        interfaceTypeId: this.type_now_select_item.interfaceTypeId,
        updataTime: "",
      };
      this.api_drawer_title = "新增文档";
    },

    //编辑接口
    click_api_update(row) {
      this.api_drawer_open = true;
      this.edit_can = "ok";
      this.api_select_item = row;
      this.api_drawer_title = "修改文档";
    },

    //删除接口
    click_api_delete(row) {
      this.$confirm("删除此文档 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.get_deleteinterface(row.interfaceId);
        })
        .catch(() => {});
      
    },

    //查看接口
    click_api_detail(row) {
      this.api_drawer_open = true;
      this.edit_can = "no";
      this.api_drawer_title = row.interfaceName;
      this.api_select_item = row;
    },

    click_api_share(row){
       window.open(window.location.origin+"/open/#/api?key="+row.interfaceId);
    },

    //点击了一个项目
    click_pro_item(item, index) {
      this.pro_now_select_index = index;
      this.pro_now_select_item = item;
      this.type_list = [];
      this.type_now_select_index = -1;
      this.type_now_select_item = null;
      this.req_selectitemtype();
    },
    //点击了一个类别
    click_type_item(item, index) {
      this.type_now_select_index = index;
      this.type_now_select_item = item;
      this.api_list = [];
      this.req_selectinterface();
    },
    //新增类别
    click_type_add() {
      this.type_window_show = true;
      this.isTypeEdit = false;
      this.type_detail = {
        hospitalName: this.pro_now_select_item.hospitalName,
        hospitaId: this.pro_now_select_item.hospitaId,
        interfaceTypeId: "",
        interfaceTypeName: "",
        userCode: this.m_user_code,
      };
    },
    //编辑类别
    click_type_update(item) {
      this.type_window_show = true;
      this.isTypeEdit = true;
      this.type_detail = {
        hospitalName: item.hospitalName,
        hospitaId: item.hospitaId,
        interfaceTypeId: item.interfaceTypeId,
        interfaceTypeName: item.interfaceTypeName,
        userCode: this.m_user_code,
      };
    },
    //删除类别
    click_type_delete(item) {
      this.$confirm("删除此项目名称, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.get_deleteTypename(item.interfaceTypeId);
        })
        .catch(() => {});
    },
    //查询项目列表
    req_selectitemname() {
      this.loading = true;
      // 传得参数对象
      let param = {
        userCode: this.m_user_code,
      };
      selectitemname(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            if (res.data && res.data.length > 0) {
              this.pro_list = res.data;
              if (this.pro_list.length > 0) {
                this.click_pro_item(this.pro_list[0], 0);
              }
            }
          }
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    //查询类别列表
    req_selectitemtype() {
      this.type_loading = true;
      this.type_list=[];
      // 传得参数对象
      let param = {
        hospitaId: this.pro_now_select_item.hospitaId,
        userCode: this.m_user_code,
      };
      selectitemtype(param)
        .then((res) => {
          this.type_loading = false;
          if (res.status == 200) {
            if (res.data && res.data.length > 0) {
              this.type_list = res.data;
              if (this.type_list.length > 0) {
                this.click_type_item(this.type_list[0], 0);
              }
            }
          }
        })
        .catch((res) => {
          this.type_loading = false;
        });
    },
    //提交新增
    submitForm_api(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 传参
          var obj = {};
          obj.hospitaId = this.type_detail.hospitaId;
          obj.hospitalName = this.type_detail.hospitalName;
          obj.interfaceTypeId = this.type_detail.interfaceTypeId;
          obj.interfaceTypeName = this.type_detail.interfaceTypeName;
          obj.userCode = this.type_detail.userCode;

          if (!this.isTypeEdit) {
            // 新建的保存
            insettypename(obj).then((res) => {
              if (res.status == "200") {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                this.type_window_show = false;
                this.req_selectitemtype();
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            });
          } else {
            updetetypename(obj).then((res) => {
              if (res.status == "200") {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                this.req_selectitemtype();
                this.type_window_show = false;
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.type_window_show = false;
    },
    //删除项目
    get_deleteTypename(pid) {
      this.loading = true;
      // 传得参数对象
      let param = {
        interfaceTypeId: pid,
      };
      deleteTypename(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            if (res.data == null) {
              this.$message({
                type: "warning",
                message: res.msg,
              });
            } else {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.req_selectitemtype();
            }
          } else {
            this.$message({
              type: "warning",
              message: res.msg,
            });
          }
        })
        .catch((res) => {
          this.loading = false;
        });
    },

    //查询API列表
    req_selectinterface() {
      this.api_loading = true;
      this.api_list=[];
      // 传得参数对象
      let param = {
        hospitaId: this.pro_now_select_item.hospitaId,
        interfaceTypeId: this.type_now_select_item.interfaceTypeId,
        userCode: this.m_user_code,
      };
      selectinterface(param)
        .then((res) => {
          this.api_loading = false;
          if (res.status == 200) {
            if (res.data && res.data.length > 0) {
              this.api_list = res.data;
            }
          }
        })
        .catch((res) => {
          this.api_loading = false;
        });
    },
    //删除api
    get_deleteinterface(pid) {
      this.loading = true;
      // 传得参数对象
      let param = {
        interfaceId: pid,
      };
      deleteinterface(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.req_selectinterface();
          } else {
            this.$message({
              type: "warning",
              message: res.msg,
            });
          }
        })
        .catch((res) => {
          this.loading = false;
        });
    },
  },
  mounted() {},
  created() {
    this.m_user_code = sessionStorage.getItem("userCode");
    this.req_selectitemname();
  },
  beforeDestroy() {},
};
</script>
<style  scoped>
.apilist {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
.apilist_header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
  background: #f7f7f7;
}
.apilist_header_title {
  font-size: 14px;
  color: #555555;
  font-weight: bolder;
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
  margin-top: 14px;
}
.apilist_box {
  width: 100%;
  /*Firefox*/
  height: -moz-calc(100% - 50px);
  /*chrome safari*/
  height: -webkit-calc(100% - 50px);
  /*Standard */
  height: calc(100% - 50px);
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
}
.apilist_left {
  display: inline-block;
  vertical-align: top;
  width: 200px;
  height: 100%;
  box-sizing: border-box;
  overflow-y: hidden;
}
.apilist_center {
  display: inline-block;
  vertical-align: top;
  width: 250px;
  height: 100%;
  border-left: 1px solid #efefef;
  box-sizing: border-box;
  overflow-y: hidden;
}
.apilist_right {
  display: inline-block;
  vertical-align: top;
  /*Firefox*/
  width: -moz-calc(100% - 450px);
  /*chrome safari*/
  width: -webkit-calc(100% - 450px);
  /*Standard */
  width: calc(100% - 450px);
  height: 100%;
  box-sizing: border-box;
  border-left: 1px solid #efefef;
}

.pro_item {
  /*Firefox*/
  width: -moz-calc(100% - 16px);
  /*chrome safari*/
  width: -webkit-calc(100% - 16px);
  /*Standard */
  width: calc(100% - 16px);
  margin-left: 8px;
  margin-top: 8px;
  min-height: 35px;
  box-sizing: border-box;
  border: 1px solid #efefef;
  border-radius: 5px;
  padding-top: 8px;
  padding-bottom: 2px;
  cursor: pointer;
}
.pro_item:hover {
  background: #d2f1ea;
}
.pro_item_select {
  background: #d2f1ea;
  border: 1px solid #b3e9ed;
}
.pro_item_name {
  display: inline-block;
  vertical-align: top;
  /*Firefox*/
  width: -moz-calc(100% - 80px);
  /*chrome safari*/
  width: -webkit-calc(100% - 80px);
  /*Standard */
  width: calc(100% - 80px);
  font-size: 14px;
  margin-left: 8px;
  color: #777777;
}
</style>