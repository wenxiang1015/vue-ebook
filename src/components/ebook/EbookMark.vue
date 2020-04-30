<template>
  <div class="ebook-mark" ref="ebookMark">
    <div class="ebook-mark-text-wrapper">
      <div class="ebook-mark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-mark-text">{{text}}</div>
    </div>
    <div class="ebook-mark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <bookmark :color="color" :height="35" :width="15"></bookmark>
    </div>
  </div>
</template>

<script>
import Bookmark from "../common/Bookmark";
import { realPx } from "../../utils/utils";
import { ebookMixin } from "../../utils/mixin";
import { getBookmark,saveBookmark } from "../../utils/localStorage"

const BLUE = "#346cbc";
const WHITE = "#fff";

export default {
  mixins: [ebookMixin],
  components: {
    Bookmark
  },
  data() {
    return {
      text: "",
      color: WHITE,
      isFixed: false //当前页是否书签
    };
  },
  methods:{
      addBookMark(cb){
        this.bookmark = getBookmark(this.fileName);
        if(!this.bookmark){
          this.bookmark = [];
        }
        const currentLocation = this.currentBook.rendition.currentLocation();
        const cfibase = currentLocation.start.cfi.replace(/!.*/,'')
        const cfistart = currentLocation.start.cfi.replace(/.*!/,'').replace(/\)$/,'')
        const cfiend = currentLocation.end.cfi.replace(/.*!/,'').replace(/\)$/,'')
        const cfirange = `${cfibase}!,${cfistart},${cfiend})`
        this.currentBook.getRange(cfirange).then(range=>{
          const text = range.toString().replace(/\s\s/g,'')//epubjs 中的空格是两个,和普通文本不一样
          this.bookmark.push({
            cfi: currentLocation.start.cfi,//判断当前页是否书签页的依据
            text: text
          })
          saveBookmark(this.fileName,this.bookmark);
          if(cb) cb();
        })
        
      },
      removeBookMark(cb){
        const currentLocation = this.currentBook.rendition.currentLocation();
        const startcfi = currentLocation.start.cfi
        this.bookmark = getBookmark(this.fileName);
        if(this.bookmark){
          this.bookmark = this.bookmark.filter(item=>item.cfi !== startcfi)
          saveBookmark(this.fileName,this.bookmark)
          this.setIsBookmark(false)
          if(cb) cb();
        }
      },
      beforeHeight(){
        if (this.isBookmark) {
          this.text = this.$t("book.pulldownDeleteMark");
          this.color = BLUE;
        } else {
          this.text = this.$t("book.pulldownAddMark");
          this.color = WHITE;
        }
        this.isFixed = this.isBookmark;
      },
      restore(){
          /**
           * 因为下拉的时候 transition 有个 0.2 秒的过渡动画,
           * 而这里是直接旋转回原位.所以等待 0.2 秒之后再归位,解决卡顿问题
           * */
          setTimeout(()=>{
            this.$refs.ebookMark.style.top = `${-this.height}px`
            this.$refs.iconDown.style.transform = 'rotate(0deg)'
          },200)
          if(this.isFixed){
              this.addBookMark(()=>this.setIsBookmark(this.isFixed))//先添加完再设置状态
          } else {
              this.removeBookMark(()=>this.setIsBookmark(this.isFixed))//先移除完再设置状态
          }
      }
  },
  computed: {
    height() {
      //吸顶值
      return realPx(35);
    },
    threshold() {
      //临界值
      return realPx(55);
    },
    fixedStyle(){
        return {
            position: 'fixed',
            top: 0,
            right: `px2rem(15)rem`,
            //获取不了 this.$refs.ebookBookmark (可能是因为 this.$refs 还没有创建完毕)
            //right: `${(window.innerWidth - this.$refs.ebookBookmark.clientWidth) / 2}px`,
        }
    }
  },
  watch: {
    offsetY(v) {
        //在分页未完成时 或 菜单弹出时 都是不可下拉的 也不能显示 bookmark
        if(!this.bookAvailable || this.menuVisible || this.settingVisible >= 0){
            return;
        }
      if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v >= this.height && v < this.threshold) {
        this.$refs.ebookMark.style.top = `${-v}px`;
        this.beforeHeight();
        const iconDown = this.$refs.iconDown; //transition 在 scss 中定义好了
        if (iconDown.style.transform === "rotate(180deg)") {
          iconDown.style.transform = "rotate(0deg)";
        }
      } else if (v >= this.threshold) {
        this.$refs.ebookMark.style.top = `${-v}px`;
        if (this.isBookmark) {
          this.text = this.$t("book.releaseDeleteMark");
          this.color = WHITE;
        } else {
          this.text = this.$t("book.releaseAddMark");
          this.color = BLUE;
        }
        this.isFixed = !this.isBookmark;
        const iconDown = this.$refs.iconDown;
        if (
          iconDown.style.transform === "" ||
          iconDown.style.transform === "rotate(0deg)"
        ) {
          iconDown.style.transform = "rotate(180deg)";
        }
      } else { //下拉收回是在 index.vue 中处理的,在 EbookReader.vue 捕获的 offsetY 
          this.restore();
      }
    },
    isBookmark(isBookmark){
      this.isFixed = isBookmark;
      if(isBookmark){
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/global";

.ebook-mark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(35);
  .ebook-mark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: 0;
    display: flex;
    .ebook-mark-down-wrapper {
      font-size: px2rem(14);
      color: white;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-mark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-mark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: 0;
    margin-right: px2rem(15);
  }
}
</style>