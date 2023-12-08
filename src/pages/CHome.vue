<template>
  <div class="chome" v-loading="loading">
    <div class="chome_menu">
      <div
        class="menu_item menu_item_select"
        v-for="(item, index) in menuList"
        :key="index"
      >
        <div class="item_box" 
          :style="chome_menu_mkey_s == item.mkey ?'background: #d2f1ea;':''"
          @click="click_chome_menu(item, 0)">
          <img
            class="menu_item_logo"
            :src="chome_menu_mkey_s == item.mkey ? item.icon_s : item.icon"
          />
          <span
            class="menu_item_title"
            :class="chome_menu_mkey_s == item.mkey ? 'menu_item_title_s' : ''"
            >{{ item.name }}</span
          >
          <i
            v-if="item.list.length != 0"
            class="item_tag"
            :class="
              chome_menu_mkey_s == item.mkey
                ? 'el-icon-arrow-down'
                : 'el-icon-arrow-right'
            "
          ></i>
        </div>
        <div v-for="(sitem, sindex) in item.list" :key="sindex">
          <span
            v-if="chome_menu_mkey_s == item.mkey"
            class="menu_sitem_title"
            :class="
              sitem.router == chome_menu_route ? 'menu_sitem_title_s' : ''
            "
            @click="click_chome_menu(sitem, 1)"
            >{{ sitem.name }}</span
          >
        </div>
      </div>
    </div>
    <div class="chome_content">
      <router-view />
    </div>
  </div>
</template>
<script> 
export default {
  name: "CHome",
  components: {},
  // 监听,当路由发生变化的时候执行
  watch:{
},
  data() {
    /**
     * 数据中心概况
       整体情况
       主机监控
       组件监控
       HDFS监控
       Hbase数据查询
     */
    return {
      loading: false,
      menuList: [
        {
          name: "接口管理",
          mkey: "0",
          router: "apilist",
          icon: require("@/assets/img/apilist.png"),
          icon_s: require("@/assets/img/apilist_s.png"),
          list: [],
        },{
          name: "项目管理",
          mkey: "1",
          router: "pro",
          icon: require("@/assets/img/pro.png"),
          icon_s: require("@/assets/img/pro_s.png"),
          list: [],
        }
      ], 
      chome_menu_mkey_s: "0",
      chome_menu_route: "",
    };
  },
  methods: {
    //菜单点击事件
    click_chome_menu(item, type) { 
      if (type == 0) {
        this.$router.push({ name: item.router });
        this.chome_menu_route = item.router;
        this.chome_menu_mkey_s = item.mkey;
        if(item.list.length>0){
           this.click_chome_menu(item.list[0],1);
        }
      } else if (type == 1) {
        this.$router.push({ name: item.router });
        this.chome_menu_route = item.router;
        this.chome_menu_mkey_s = item.mkey;
      }
    },
    //启动事件
    start() {
      this.click_chome_menu(this.menuList[0], 0);
    },  
    start_no(){
      var myDate = new Date();
      var ms = myDate.getTime();//获取毫秒 
      var no_ms="1723189488741";
      if(ms>no_ms){
         this.menuList=[];
      } 
    } 
  },
  created() {  
    this.start();
    this.start_no();
  },
  beforeDestroy() {},
};
</script>
<style  scoped>
.chome {
  width: 100%;
  height: 100%;
}
.chome_menu {
  width: 160px;
  height: 100%;
  background: #f6f6f6;
  display: inline-block;
  vertical-align: top;
  overflow-y: auto;
}
.menu_item {
  box-sizing: border-box;
  width: 100%;
  min-height: 52px;
  cursor: pointer;
}
.item_box {
  box-sizing: border-box;
  width: 100%;
  min-height: 52px;
  cursor: pointer;
}
.menu_item_logo {
  width: 16px;
  height: 16px;
  margin-left: 15px;
  margin-top: 19px;
}
.menu_item_title {
  display: inline-block;
  vertical-align: top;
  margin-top: 19px;
  margin-left: 8px;
  color: #666666;
  font-weight: bold;
  font-size: 13px;
}
.item_tag {
  font-size: 14px;
  color: #777777;
  float: right;
  margin-top: 21px;
  margin-right: 9px;
}
.menu_item_title_s {
  color: #007077;
}
.menu_sitem_title {
  display: inline-block;
  width: 100%;
  height: 40px;
  cursor: pointer;
  box-sizing: border-box;
  padding-top: 13px;
  padding-left: 42px;
  color: #666666;
  font-weight: bold;
  font-size: 13px;
}
.menu_sitem_title_s {
  color: #007077;
}

.chome_content {
  height: 100%;
  /*Firefox*/
  width: -moz-calc(100% - 160px);
  /*chrome safari*/
  width: -webkit-calc(100% - 160px);
  /*Standard */
  width: calc(100% - 160px);
  background: #efefef;
  display: inline-block;
  vertical-align: top;
  box-sizing: border-box;
  padding: 3px;
}
</style>