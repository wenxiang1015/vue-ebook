<template>
  <div class="store">
      <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
  @import "../../assets/styles/global";

  .store {
      background-color: white;
      width: 100%;
      height: 100%;
  }
</style>