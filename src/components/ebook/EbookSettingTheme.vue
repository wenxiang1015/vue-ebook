<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible===1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item, index) in themeList"
          :key="index"
          @click="setTheme(index)"
        >
          <div
            class="preview"
            :style="{background: item.style.body.background}"
            :class="{'no-border': item.style.body.background !== '#fff'}"
          ></div>
          <div class="text" :class="{'selected': item.name === selectedTheme}">{{item.name}}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { themeList } from "../../utils/book";

export default {
  data() {
    return {};
  },
  mixins: [ebookMixin],
  mounted() {},
  computed: {
    themeList() {
      return themeList(this);
    }
  },
  methods:{
      setTheme(index){
          const theme = this.themeList[index];
          this.setSelectedTheme(theme.name);
      }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 101;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);

  .setting-theme {
    height: 100%;
    display: flex;

    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(5);
      box-sizing: border-box;
      .preview {
        flex: 1;
        border: px2rem(1) solid #ccc;
        box-sizing: border-box;
        &.no-border {
          border: none;
        }
      }
      .text {
        flex: 0 0 px2rem(20);
        font-size: px2rem(14);
        color: #ccc;
        @include center;
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>