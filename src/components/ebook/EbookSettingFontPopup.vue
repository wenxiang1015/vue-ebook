<template>
  <transition name="popup-slide-up" >
  <div class="ebook-popup-list" v-show="fontFamilyVisible">
    <div class="ebook-popup-title">
      <div class="ebook-popup-title-icon" @click="hide">
        <span class="icon-down2"></span>
      </div>
      <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
    </div>
    <div class="ebook-popup-list-warpper">
      <div class="ebook-popup-item" v-for="(item,index) in fontFamilyList" :key="index" 
      :class="{'selected':selectedFontFamily===item.font}" @click="setFontFamily(item.font)">
        <div class="ebook-popup-item-text" >{{item.font}}</div>
        <div class="ebook-popup-item-check" v-if="selectedFontFamily===item.font">
          <span class="icon-check"></span>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import { FONT_FAMILY_LIST } from '../../utils/book'
import { ebookMixin } from "../../utils/mixin";
import { saveFontFamily } from '../../utils/localStorage'

export default {
  data() {
    return {
      fontFamilyList: FONT_FAMILY_LIST
    };
  },
  mixins: [ebookMixin],
  methods: {
    hide() {
      this.setFontFamilyVisible(false);
    },
    setFontFamily(font){
      this.setSelectedFontFamily(font);
      saveFontFamily(this.fileName,font);
      //需要在 epubjs 钩子函数中( EbookReader 组件) 中预先加载字体资源
      this.currentBook.rendition.themes.font(font);//设置字体
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.ebook-popup-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  background-color: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-popup-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    text-align: center;
    @include center;
    .ebook-popup-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      font-weight: bold;
      @include center;
    }
    .ebook-popup-title-text {
      font-size: px2rem(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-warpper {
    .ebook-popup-item {
      display: flex;
      padding: px2rem(15);
      .ebook-popup-item-text{
        flex: 1;
        text-align: left;
        font-size: px2rem(14);
      }
      .ebook-popup-item-check{
        flex: 1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: bold;
      }
    }
  }
}

.selected {
  color: #346cb9;
  font-weight: bold;
}

</style>