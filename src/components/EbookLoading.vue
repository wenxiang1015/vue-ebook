<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item,index) in data" :key="index">
        <div class="ebook-loading-line-wrapper" v-for="(subItem,subIndex) in item" :key="subIndex">
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mask" ref="mask"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from "../../utils/utils";

export default {
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}]
      ],
      maskWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 }
      ],
      lineWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 }
      ],
      add: true, //true 为添加蒙层宽度,减少线的宽度,反之亦然
      end: false //已经到头了,改变 add
    };
  },
  mounted() {
    this.task = setInterval(() => {
      this.$refs.mask.forEach((item, index) => {
        const mask = item;
        const line = this.$refs.line[index];
        let maskWidth = this.maskWidth[index];
        let lineWidth = this.lineWidth[index];
        if (index === 0) {
          if (this.add) {
            if (maskWidth.value < 16) {//边界控制
              maskWidth.value++;
              lineWidth.value--;
            }
          } else {
            if (lineWidth.value < 16) {
              maskWidth.value--;
              lineWidth.value++;
            }
          }
        } else {
          if (this.add) {
            if (maskWidth.value < 16) {
              let preMaskWidth = this.maskWidth[index - 1];
              if (preMaskWidth.value >= 8) {
                maskWidth.value++;
                lineWidth.value--;
              }
            }
          } else {
            if (lineWidth.value < 16) {
              let preLineWidth = this.lineWidth[index - 1];
              if (preLineWidth.value >= 8) {
                maskWidth.value--;
                lineWidth.value++;
              }
            }
          }
        }

        mask.style.width = `${px2rem(maskWidth.value)}rem`;
        mask.style.flex = `0 0 ${px2rem(maskWidth.value)}rem`;
        line.style.width = `${px2rem(lineWidth.value)}rem`;
        line.style.flex = `0 0 ${px2rem(lineWidth.value)}rem`;
        /**
         * 注意这里只监听了最后一条线的宽度变化,(注意不要同时监听六条线的变化,而是取最后一条线为基准)
         * 这里表示所有的 mask 和 line 增加或减少了 1px
         * */
        if (index === this.maskWidth.length - 1) {
          if (this.add) {
            if (maskWidth.value === 16) {
              this.end = true;
            }
          } else {
            if (maskWidth.value === 0) {
              this.end = true;
            }
          }
        }
        //最后一条线增加或减少到边界,这里才会执行一次
        if (this.end) {
          this.add = !this.add;
          this.end = false;
        }
      });
    }, 20);
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/global";

.ebook-loading {
  position: relative;
  z-index: 400;
  width: px2rem(63);
  height: px2rem(40);
  background: transparent;
  border: px2rem(1.5) solid #d7d7d7;
  border-radius: px2rem(3);
  .ebook-loading-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
    .ebook-loading-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        @include left;
        padding: 0 px2rem(7);
        box-sizing: border-box;
        .ebook-loading-line {
          flex: 0 0 px2rem(16);
          width: px2rem(16);
          height: px2rem(2);
          background: #d7d7d7;
        }
        .ebook-loading-mask {
          flex: 0 0 0;
          width: 0;
          height: px2rem(2);
        }
      }
    }

    .ebook-loading-center {
      position: absolute;
      left: 50%;
      top: 0;
      width: px2rem(1.5);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>