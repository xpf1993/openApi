<template>
  <div class="home" v-loading="loading">
    <div class="home_header">
      <img class="home_header_logo" src="@/assets/logof.png" />
      <span class="home_header_title">Document</span>
      <!-- 退出登录 -->
      <el-tooltip
        class="item"
        effect="dark"
        content="退出登录"
        placement="bottom-end"
      >
        <div class="home_header_imgbox" @click="click_login_out">
          <img src="@/assets/img/loginout.png" />
        </div>
      </el-tooltip>
      <!-- 当前登录用户名 -->
      <span class="home_header_name">{{ username }}</span>
    </div>
    <div class="home_content">
      <router-view />
    </div>
  </div>
</template>

<script> 
export default {
  name: "Home",
  components: {},
  data() {
    return {
      loading: false,
      username:""
    };
  },
  methods: {
    click_login_out(){
        sessionStorage.clear();
        this.$router.push({ name: "login" });
    }
  },
  created() {
     this.$router.push({ name:"chome"});
     this.username=sessionStorage.getItem("userCode");
  },
  beforeDestroy() {},
};
</script>
<style  scoped>
.home {
  width: 100%;
  height: 100%;
}
.home_header {
  width: 100%;
  height: 50px;
  background: #007077;
  box-sizing: border-box;
  border-bottom:1px solid #efefef;
}
.home_header_logo {
  width: 25px;
  height: 25px;
  margin-left: 8px;
  margin-top: 12px;
}
.home_header_title {
  font-size: 16px;
  color: #ffffff;
  font-weight: bolder;
  display: inline-block;
  vertical-align: top;
  margin-left: 8px;
  margin-top: 14px;
}
.home_header_imgbox {
  float: right; 
  width: 28px;
  text-align: center;
  cursor: pointer;
  margin-right: 14px;
}
.home_header_imgbox img {
  width: 18px;
  height: 18px;
  margin-top: 18px;
}
.home_header_name {
  font-size: 16px;
  color: #ffffff;
  float: right;
  margin-top: 18px;
  margin-left: 6px;
  margin-right: 6px;
}  
.home_content {
  clear: both;
  width: 100%;
  /*Firefox*/
  height: -moz-calc(100% - 50px);
  /*chrome safari*/
  height: -webkit-calc(100% - 50px);
  /*Standard */
  height: calc(100% - 50px);
  background: #f6feff;
}
</style>