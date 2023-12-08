<template>
  <div class="pro" v-loading="loading">
    <div class="pro_header">
      <el-button
        class="search_button"
        style="margin-top: 5px; margin-left: 12px"
        type="primary"
        size="mini"
        icon="el-icon-plus"
        @click="click_add"
        >新增项目
      </el-button>
    </div>
    <div class="pro_box">
      <el-table
        :data="pro_list"
        height="100%"
        ref="table"
        class="open_table"
        :header-cell-style="{ background: '#F5F7F9', color: '#555555' }"
      >
        <DataHint slot="empty" mes="暂无项目信息"></DataHint>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <p style="color: #009fa2" v-html="scope.row.hospitalName"></p>
          </template>
        </el-table-column>
        <el-table-column label="成员">
          <template slot-scope="scope">
            <p style="color: #009fa2" v-html="scope.row.member"></p>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              @click="click_edit(scope.row)"
              type="text"
              style="color: #ff9900"
              size="small"
              >编辑</el-button
            >
            <el-button
              @click="click_delete(scope.row)"
              type="text"
              style="color: #dc1515"
              size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="isLeftDetailEdit ? '修改项目' : '新增项目'"
      :visible.sync="detail_window_show"
      :show-close="false"
      width="35%"
    >
      <el-form
        :model="right_detail"
        status-icon
        :rules="detail_Lefts"
        ref="LeftForm"
        label-width="100px"
        class="demo-LeftForm"
      >
        <el-form-item label="项目名称" prop="hospitalName">
          <el-input 
            type="text"
            v-model="right_detail.hospitalName"
            id="hospitalName"
          ></el-input>
        </el-form-item>
        <el-form-item label="参与人员" prop="member">
          <el-select
            v-model="right_detail.member"
            multiple
            id="member"
            placeholder="请选择"
          >
            <el-option
              v-for="item in user_list"
              :key="item.userCode"
              :label="item.userName"
              :value="item.userCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            style="float: right"
            type="primary"
            @click="submitForm_detail('LeftForm')"
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
  </div>
</template>

<script>
import DataHint from "../../components/hint/DataHint.vue";
import {
  selectitemname,
  insetitemname,
  updeteitemname,
  deleteitemname,
  selectmember,
} from "@/api/api.js";
export default {
  name: "Pro",
  components: {
    DataHint,
  },
  data() {
    return {
      loading: false,
      pro_list: [],
      user_list: [],
      m_user_code: "",

      detail_window_show: false,
      isLeftDetailEdit: false, //是否是编辑
      right_detail: {},
      //字段输入校验
      detail_Lefts: {
        hospitalName: {
          required: true,
          message: "请输入项目名称",
          trigger: "blur",
        },
        member: {
          required: true,
          message: "请选择参与人员",
          trigger: "blur",
        },
      },
    };
  },
  methods: {
    //逗号转数组
    strToArayy(str) {
      var list = [];
      if (str == null || str == "") {
        return list;
      }
      if (str.indexOf(",") != -1) {
        return str.split(",");
      } else {
        list.push(str);
        return list;
      }
    },
    //数组转逗号分隔
    ArayyToStr(list) {
      var str = "";
      if (list == null || list == "" || list.length == 0) {
        return str;
      }
      for (var i = 0; i < list.length; i++) {
        if (i == 0) {
          str = list[i];
        } else {
          str = str + "," + list[i];
        }
      }
      return str;
    },
    //点击新增
    click_add() {
      this.detail_window_show = true;
      this.isLeftDetailEdit = false;
      this.right_detail = {
        hospitalName: "",
        hospitaId: "",
        member: [this.m_user_code],
        userCode: this.m_user_code,
      };
    },
    //点击修改
    click_edit(item) {
      this.detail_window_show = true;
      this.isLeftDetailEdit = true;
      this.right_detail = {
        hospitalName: item.hospitalName,
        hospitaId: item.hospitaId,
        member: this.strToArayy(item.member),
        userCode: this.m_user_code,
      };
    },
    //点击删除
    click_delete(row) {
      this.$confirm("删除此项目名称, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.get_deleteitemname(row.hospitaId);
        })
        .catch(() => {}); 
    },
    //提交新增
    submitForm_detail(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.right_detail.member.indexOf(this.m_user_code) == -1) {
            this.$message({
              type: "warning",
              message: "项目必须包含当前登陆人，已自动添加",
            });
            this.right_detail.member.push(this.m_user_code);
          }
          // 传参
          var obj = {};
          obj.hospitaId = this.right_detail.hospitaId;
          obj.hospitalName = this.right_detail.hospitalName;
          obj.member = this.ArayyToStr(this.right_detail.member);
          obj.userCode = this.right_detail.userCode;

          if (!this.isLeftDetailEdit) {
            // 新建的保存
            insetitemname(obj).then((res) => {
              if (res.status == "200") {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                this.detail_window_show = false;
                this.req_selectitemname();
                this.$refs[formName].resetFields();
              } else {
                this.$message({
                  type: "warning",
                  message: res.msg,
                });
              }
            });
          } else {
            updeteitemname(obj).then((res) => {
              if (res.status == "200") {
                this.$message({
                  type: "success",
                  message: res.msg,
                });
                this.req_selectitemname();
                this.detail_window_show = false;
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
      this.detail_window_show = false;
    },
    //查询列表
    req_selectitemname() {
      this.loading = true;
      this.pro_list=[];
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
            }
          }
        })
        .catch((res) => {
          this.loading = false;
        });
    },
    //删除项目
    get_deleteitemname(pid) {
      this.loading = true;
      // 传得参数对象
      let param = {
        hospitaId: pid,
      };
      deleteitemname(param)
        .then((res) => {
          this.loading = false;
          if (res.status == 200) {
            if(res.data==null){
               this.$message({
              type: "warning",
              message: res.msg,
            }); 
            }else{
               this.$message({
              type: "success",
              message: "删除成功!",
            }); 
            } 
            this.req_selectitemname();
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
    //查询人员列表
    req_selectmember() {
      // 传得参数对象
      let param = {};
      selectmember(param)
        .then((res) => {
          if (res.status == 200) {
            if (res.data && res.data.length > 0) {
              this.user_list = res.data;
            }
          }
        })
        .catch((res) => {});
    },
  },
  mounted() {},
  created() {
    this.m_user_code = sessionStorage.getItem("userCode");
    this.req_selectitemname();
    this.req_selectmember();
  },
  beforeDestroy() {},
};
</script>
<style  scoped>
.pro {
  width: 100%;
  height: 100%;
  background: #ffffff;
}
.pro_header {
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
}
.pro_box {
  width: 100%;
  /*Firefox*/
  height: -moz-calc(100% - 50px);
  /*chrome safari*/
  height: -webkit-calc(100% - 50px);
  /*Standard */
  height: calc(100% - 50px);
  border-bottom: 1px solid #efefef;
  box-sizing: border-box;
}
</style>