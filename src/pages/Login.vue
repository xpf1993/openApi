<template>
  <div class="pbox" v-loading="loading">
    <!-- <img class="login_bg" src="@/assets/img/loginbg.png" /> -->
    <div class="login_box">
      <div class="login_box_line_box"><div class="login_box_line"></div></div>
      <div class="login_box_title">Document</div>
      <el-input
        class="login_box_play"
        size="medium"
        placeholder="请输入账号"
        v-model="uname"
        maxlength="20"
        clearable
      >
      </el-input>
      <el-input
        class="login_box_play"
        @keydown.enter.native="click_login"
        size="medium"
        placeholder="请输入密码"
        v-model="upass"
        maxlength="20"
        show-password
      ></el-input>
      <el-button
        class="login_box_play"
        size="medium"
        type="primary"
        :loading="isLoging"
        @click="click_login"
        >登 录</el-button
      >
    </div>
  </div>
</template>
<script>
import { Message } from "element-ui";
import { login } from "@/api/api.js";
import { encryptDes, decryptAes } from "@/utils/crypto";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      uname: "",
      upass: "",
      isLoging: false,
      publicKey: "",
    };
  },
  methods: {
    passFilter(value) {
      var bf = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var sf = "abcdefghijklmnopqrstuvwxyz";
      var nf = "0123456789";
      var tf = "@~!#$%^&*()_*.=+-";
      var flist = [];
      var vlist = value.split("");
      for (var i = 0; i < vlist.length; i++) {
        if (flist.length == 3) {
          continue;
        }
        if (flist.indexOf("bf") == -1) {
          if (bf.indexOf(vlist[i]) != -1) {
            flist.push("bf");
          }
        }
        if (flist.indexOf("sf") == -1) {
          if (sf.indexOf(vlist[i]) != -1) {
            flist.push("sf");
          }
        }
        if (flist.indexOf("nf") == -1) {
          if (nf.indexOf(vlist[i]) != -1) {
            flist.push("nf");
          }
        }
        if (flist.indexOf("tf") == -1) {
          if (tf.indexOf(vlist[i]) != -1) {
            flist.push("tf");
          }
        }
      }
      if (value.length < 8) {
        return "密码必须不少于8个字符";
      } else if (flist.length < 3) {
        return "密码必须为数字,大写字母,小写字母,特殊符,至少其中三种组成密码";
      } else {
        return "0";
      }
    },
    //登录点击
    click_login() {
      if (this.isLoging) {
        return;
      }
      if (this.uname.trim() == "") {
        Message({
          message: "请输入用户名",
          duration: 1500,
          type: "warning",
          showClose: true,
        });
        return;
      }
      if (this.upass.trim() == "") {
        Message({
          message: "请输入用密码",
          duration: 1500,
          type: "warning",
          showClose: true,
        });
        return;
      }
      // var pass_code=this.passFilter(this.upass.trim());
      // if(pass_code!="0"){
      //   Message({
      //     message: pass_code,
      //     duration: 1500,
      //     type: "warning",
      //     showClose: true,
      //   });
      //   return;
      // }
      this.isLoging = true;
      this.req_login();
    },
    //去登陆
    req_login() {
      // 传得参数对象
      let param = {
        userCode: encryptDes(this.uname),
        password: encryptDes(this.upass),
      };
      login(param)
        .then((res) => {
          this.isLoging = false;
          if (res.status == 200) {
            //登陆成功  保存登录的data 到session
            //res.data.ROLE = 4;
            if (res.data == null) {
              this.$message({
                type: "warning",
                message: res.msg,
              });
              return;
            }
            sessionStorage.clear();
            sessionStorage.setItem("password", this.upass);
            sessionStorage.setItem("userCode", this.uname);
            sessionStorage.setItem("token", res.data.token);
            //去首页
            this.$router.push("/home");
          }
        })
        .catch((res) => {
          this.isLoging = false;
        });
    },
  },
  created() {
    const userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    if (userinfo) {
      this.$router.push("/");
    }
  },
};
</script>
<style>
</style>
<style scoped>
.pbox {
  width: 100%;
  height: 100%;
  background-repeat: "no-repeat";
  background-size: 100% 100%;
  background: #007077;
}
.login_box {
  width: 400px;
  height: 350px;
  box-shadow: 0px 15px 61px 12px rgba(0, 0, 0, 0.26);
  opacity: 0.89;
  background: #eef8f9;
  border-radius: 5px;
  position: relative;
  top: 50%;
  /*Firefox*/
  left: -moz-calc(50% - 200px);
  /*chrome safari */
  left: -webkit-calc(50% - 200px);
  /*Standard */
  left: calc(50% - 200px);
  transform: translateY(-50%);
  text-align: center;
}
.login_box_line_box {
  width: 70%;
  text-align: left;
  padding-top: 30px;
  margin-left: 15%;
}
.login_box_line {
  width: 36px;
  height: 5px;
  /* background: #0b9782; */
}
.login_box_title {
  width: 70%;
  font-size: 22px;
  font-family: Adobe Heiti Std;
  font-weight: normal;
  color: #3a3a3a;
  text-align: left;
  margin-left: 15%;
  margin-top: 20px;
  text-align: center;
  margin-bottom: 10px;
}
.login_box_play {
  width: 70%;
  box-sizing: border-box;
  margin-top: 30px;
}
.login_box el-input {
  border-radius: 15px !important;
}
.login_bg {
  position: absolute;
  top: 0px;
  width: 40%;
}
</style>