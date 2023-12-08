<template>
  <div class="hint">
    <img class="hint_img" src="@/assets/img/nodata.png" />
    <div class="hint_mes">{{ mes }}</div>
  </div>
</template>
<script>
export default {
  name: "DataHint",
  props: ["mes"],
  data() {
    return {};
  },
};
</script>
<style scoped>
.hint {
  width: 100%;
  height: 100%;
  font-size: 14px;
  text-align: center;
  padding-top: 20px;
  box-sizing: border-box;
}
.hint_mes {
  color: #cecece;
}
.hint_img{
  width: 120px;
}
</style>