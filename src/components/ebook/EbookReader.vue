<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import { getFontFamily, saveFontFamily,getFontSize,saveFontSize } from "../../utils/localStorage"
import Epub from "epubjs";
global.ePub = Epub;

export default {
  data() {
    return {};
  },
  mixins: [ebookMixin],
  methods: {
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
        this.hideMenuVisible();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
        this.hideMenuVisible();
      }
    },
    toggleMenuVisible() {
      if (this.menuVisible) {
        this.setSettingVisible(-1);
        this.setFontFamilyVisible(false);
      }
      this.setMenuVisible(!this.menuVisible);
    },
    hideMenuVisible() {
      this.setMenuVisible(false);
      this.setSettingVisible(-1);
      this.setFontFamilyVisible(false);
    },
    initEpub() {
      const url =
        process.env.VUE_APP_STATIC_URL + "epub/" + this.fileName + ".epub";
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        heigth: innerHeight,
        method: "default"
      });
      this.rendition.display().then(()=>{
        //初始化字体
        let font = getFontFamily(this.fileName);
        if(font){
          this.rendition.themes.font(font);
          this.setSelectedFontFamily(font);
        }else{
          this.rendition.themes.font(this.selectedFontFamily);
          saveFontFamily(this.fileName,this.selectedFontFamily);
        }
        //初始化缓存
        let fontSize = getFontSize(this.fileName);
        if(fontSize){
          this.rendition.themes.fontSize(fontSize);
          this.setSelectedFontSize(fontSize);
        }else{
          this.rendition.themes.fontSize(this.setSelectedFontSize);
          saveFontSize(this.fileName,this.setSelectedFontSize);
        }
      });
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        if (
          time < process.env.VUE_APP_TOUCH_DURATION &&
          offsetX > process.env.VUE_APP_TOUCH_DISPLACEMENT
        ) {
          this.prevPage();
        } else if (
          time < process.env.VUE_APP_TOUCH_DURATION &&
          offsetX < -process.env.VUE_APP_TOUCH_DISPLACEMENT
        ) {
          this.nextPage();
        } else {
          this.toggleMenuVisible();
        }
        event.preventDefault(); //取消事件默认行为
        event.stopPropagation(); //禁止事件传播
      });
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_STATIC_URL}fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_STATIC_URL}fonts/tangerine.css`),
          contents.addStylesheet(`${process.env.VUE_APP_STATIC_URL}fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_STATIC_URL}fonts/cabin.css`)
        ])
      });
    }
  },
  created() {},
  mounted() {
    const fileName = this.$route.params.fileName.split("|").join("/");
    this.setFileName(fileName).then(() => {
      this.initEpub();
    });
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/global";
</style>