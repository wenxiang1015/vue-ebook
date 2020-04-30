<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-mark></ebook-mark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookReader from "../../components/ebook/EbookReader";
import EbookTitle from "../../components/ebook/EbookTitle";
import EbookMenu from "../../components/ebook/EbookMenu";
import EbookMark from "../../components/ebook/EbookMark";
import EbookHeader from "../../components/ebook/EbookHeader"
import EbookFooter from "../../components/ebook/EbookFooter"
import { getReadTime, saveReadTime } from "../../utils/localStorage";
import { ebookMixin } from "../../utils/mixin";

export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookMark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY(v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.$refs.ebook.style.top = v + "px";
        } else {
          this.restore();
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.top = 0;
      //此处是为下拉收回的时候添加动画效果
      this.$refs.ebook.style.transition = "all .2s linear";
      //下拉的过程中会不断修改 top 值,transition 一直存在会使页面变得卡顿
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0;
      }
      this.task = setInterval(() => {
        readTime++;
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.ebook {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>