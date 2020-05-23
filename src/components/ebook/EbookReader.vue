<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="mask" @click="onMaskClick" @touchmove="move" @touchend="moveEnd" 
    @mousedown.left.stop.prevent="onMouseEnter" @mousemove.left.stop.prevent="onMouseMove" @mouseup.left.stop.prevent="onMouseEnd" ></div>
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
import { flatten } from "../../utils/book"
import {getLocalForage} from "../../utils/localForage";

global.ePub = Epub;

export default {
  data() {
    return {};
  },
  mixins: [ebookMixin],
  methods: {
    /**
     * 浏览器监听鼠标下拉步骤:
     * 1.鼠标进入
     * 2.鼠标进入及进入后的移动
     * 3.鼠标从移动状态松手
     * 4.鼠标还原
     */
    onMouseEnter(e){
      this.mouseState = 1;
      this.mouseStartTime = e.timeStamp 
    },
    onMouseMove(e){
      if(this.mouseState === 1){
        this.mouseState = 2;
      } else if(this.mouseState === 2) {//鼠标按下并且移动了的状态
        if(this.firstOffsetY){
          let offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
    },
    onMouseEnd(e){
      if(this.mouseState === 2){
        this.setOffsetY(0);
        this.firstOffsetY = null;
        this.mouseState = 3;
      } else {//鼠标点击事件(按下没有移动)
        this.mouseState = 4;
      }
      const time = e.timeStamp - this.mouseStartTime;
      if(time < 100){ //防止用户手抖,点击时误移动
        this.mouseState = 4;
      }
    },
    move(e){
      if(this.firstOffsetY){
        let offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd(){
      this.setOffsetY(0)
      this.firstOffsetY = null;
    },
    onMaskClick(e){
      //如果鼠标按下并移动了，证明不是单纯的点击事件
      if(this.mouseState && (this.mouseState ===2 || this.mouseState === 3)){
        return;
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if(offsetX > 0 && offsetX < width * 0.3){
        this.prevPage()
      } else if(offsetX > width * 0.7){
        this.nextPage()
      } else {
        this.toggleMenuVisible();
      }
    },
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
    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        heigth: innerHeight,
        method: "default",//微信支持
        // flow: 'scrolled' //滚动模式暂不支持微信 和 safari 浏览器
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
            `${process.env.VUE_APP_STATIC_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}/fonts/tangerine.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_STATIC_URL}/fonts/cabin.css`
          )
        ]);
      });
    },
    /**
     * rendition 对象没有提供 touchmove 事件监听
     * 且这里的事件在新版 epubjs 监听是无效的 (0.3.71版本可监听)
     * 故采用蒙板监听事件
     */
    //初始化手势
    // initGesture() {
    //   this.rendition.on("touchstart", event => {
    //     this.touchStartX = event.changedTouches[0].clientX;
    //     this.touchStartTime = event.timeStamp;
    //   });
    //   this.rendition.on("touchend", event => {
    //     const offsetX = event.changedTouches[0].clientX - this.touchStartX;
    //     const time = event.timeStamp - this.touchStartTime;
    //     if (
    //       time < process.env.VUE_APP_TOUCH_DURATION &&
    //       offsetX > process.env.VUE_APP_TOUCH_DISPLACEMENT
    //     ) {
    //       this.prevPage();
    //     } else if (
    //       time < process.env.VUE_APP_TOUCH_DURATION &&
    //       offsetX < -process.env.VUE_APP_TOUCH_DISPLACEMENT
    //     ) {
    //       this.nextPage();
    //     } else {
    //       this.toggleMenuVisible();
    //     }
    //     event.preventDefault(); //取消事件默认行为
    //     event.stopPropagation(); //禁止事件传播
    //   });
    // },
    //解析图书元信息(介绍)
    parseBook(){
      this.book.loaded.cover.then(cover=>{
        this.book.archive.createUrl(cover).then(url=>{
          this.setCover(url);
        })
      })
      this.book.loaded.metadata.then(metadata=>{
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav=>{
        //扁平化处理,递归循环出每个子项,一直到每个子项的 subitems = [] 
        const navItem = flatten(nav.toc);
        function findLevel(item,level=0){
          let parent = navItem.filter(parentItem=>parentItem.id === item.parent)[0];
          return !item.parent ? level : findLevel(parent,++level )
        }
        navItem.forEach(item=>{
          item.level = findLevel(item)
        })
        this.setNavigation(navItem);
      })
    },
    initEpub(url) {
      this.book = new Epub(url);
      this.setCurrentBook(this.book);
      this.initRendition();
      // this.initGesture();
      this.parseBook();
      this.book.ready
        .then(() => {
          //这里只是粗略的分页,不是很精确,没有考虑静态资源文件(图片,文章大标题等等)
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );
        })
        .then(locations => {
          this.navigation.forEach(nav=>{
            nav.pageList = [];
          })
          locations.forEach(item=>{
            const loc = item.match(/\[(.*)]!/)[1]
            this.navigation.forEach(nav=>{
              if(nav.href){
                const href = nav.href.match(/^(.*)\.html$/)[1]
                if(href === loc){
                  nav.pageList.push(item);//将 location 对应到 navigation 中去
                }
              }
            })
            let currentPage = 1;
            this.navigation.forEach(nav=>{
              nav.page = currentPage;
              currentPage += nav.pageList.length + 1
            })
          })
          this.setPagelist(locations);
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    }
  },
  mounted() {
    const books = this.$route.params.fileName.split('|')
    const fileName = books[1];
    getLocalForage(fileName,(err,blob) => {
      if(!err && blob) {
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        this.setFileName(books.join('/')).then(() => {
          const url = process.env.VUE_APP_STATIC_URL + "/epub/" + this.fileName + ".epub";
          this.initEpub(url)
        })
      }
    })
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/global";

.ebook-reader {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .read {

  }
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>
