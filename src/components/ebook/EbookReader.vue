<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import {
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from "../../utils/localStorage";
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
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideMenuVisible();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
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
    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        heigth: innerHeight,
        method: "default"
      });
      const cfi = getLocation(this.fileName);
      this.display(cfi, () => {
        //初始化字体
        let font = getFontFamily(this.fileName);
        if (font) {
          this.rendition.themes.font(font);
          this.setSelectedFontFamily(font);
        } else {
          this.rendition.themes.font(this.selectedFontFamily);
          saveFontFamily(this.fileName, this.selectedFontFamily);
        }
        //初始化缓存
        let fontSize = getFontSize(this.fileName);
        if (fontSize) {
          this.rendition.themes.fontSize(fontSize);
          this.setSelectedFontSize(fontSize);
        } else {
          this.rendition.themes.fontSize(this.setSelectedFontSize);
          saveFontSize(this.fileName, this.setSelectedFontSize);
        }
        //初始化主题
        let selectedTheme = getTheme(this.fileName);
        //如果缓存中没有主题,启动的时候默认也不给主题
        if (!selectedTheme) {
          selectedTheme = this.themeList[0].name;
          saveTheme(this.fileName, selectedTheme);
        }
        this.setSelectedTheme(selectedTheme);
        this.themeList.forEach(theme => {
          this.rendition.themes.register(theme.name, theme.style);
        });
        this.rendition.themes.select(this.selectedTheme);
        //初始化全局样式(主题)
        this.setGlobalStyle();
      });
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}fonts/tangerine.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}fonts/cabin.css`
          )
        ]);
      });
    },
    //初始化手势
    initGesture() {
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
    },
    initEpub() {
      const url =
        process.env.VUE_APP_STATIC_URL + "epub/" + this.fileName + ".epub";
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition();
      this.initGesture();
      this.book.ready
        .then(() => {
          //这里只是粗略的分页,不是很精确,没有考虑静态资源文件(图片,文章大标题等等)
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );
        })
        .then(() => {
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    }
  },
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
