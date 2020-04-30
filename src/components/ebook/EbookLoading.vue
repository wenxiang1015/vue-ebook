<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div class="ebook-loading-item" v-for="(item,index) in lines" :key="index">
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
      lines: [
        [
          { lineWidth:16,maskWidth:0 }, 
          { lineWidth:16,maskWidth:0 }, 
          { lineWidth:16,maskWidth:0 }
        ],
        [
          { lineWidth:16,maskWidth:0 }, 
          { lineWidth:16,maskWidth:0 }, 
          { lineWidth:16,maskWidth:0 }
        ]
      ],
      /**
       * 以最后一条线的运动轨迹来判断所有线的运动轨迹是否全部结束了(单向位移px2rem(16))
       * true 为 maskWidth +1, lineWidth - 1 
       */
      flag: true 
    };
  },
  mounted() {
    let array = this.lines.flat(Infinity);

    this.task = setInterval(() => {
      this.$refs.mask.forEach((item,index)=>{
        let mask = item;
        let line = this.$refs.line[index]
        if(index===0){//第一个没有前一个做参照,需要特殊处理
          if(this.flag){//mask 向左
            if(array[index].maskWidth < 16){ //边界控制
              array[index].maskWidth++;
              array[index].lineWidth--;
            }
          } else {
            if(array[index].lineWidth < 16){ 
              array[index].maskWidth--;
              array[index].lineWidth++;
            }
          }
        } else {
          if(this.flag){//mask 向左
            if(array[index].maskWidth < 16){ //边界控制
              if(array[index-1].maskWidth>=8){//判断前一个是否已经移动 px2rem(8) 了
                array[index].maskWidth++;
                array[index].lineWidth--;
              }
            }
          } else {
            if(array[index].lineWidth < 16){ 
              if(array[index-1].lineWidth>=8){
                array[index].maskWidth--;
                array[index].lineWidth++;
              }
            }
          }
        }

        mask.style.width = `${px2rem(array[index].maskWidth)}rem`;
        mask.style.flex = `0 0 ${px2rem(array[index].maskWidth)}rem`;
        line.style.width = `${px2rem(array[index].lineWidth)}rem`;
        line.style.flex = `0 0 ${px2rem(array[index].lineWidth)}rem`;

        if(index === (array.length - 1) ){//以最后一条线的运动轨迹为参照
          if(this.flag){
            if(array[index].maskWidth === 16){
              this.flag = !this.flag
            }
          }else{
            if(array[index].lineWidth === 16){
              this.flag = !this.flag
            }
          }
        }

      })
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