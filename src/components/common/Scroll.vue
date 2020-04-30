<template>
  <div class="scroll-wrapper" @scroll.passive="handleScroll" ref="scrollWrapper" >
    <slot></slot>
  </div>
</template>

<script>
import { realPx } from "../../utils/utils"

export default {
  props:{
    top: {
      type: Number,
      default: 0
    },
    bottom: {
      type: Number,
      default: 0
    }
  },
  methods: {
    //传递位移给父组件
    handleScroll(e){
      const offsetY = e.target.scrollTop||window.pageYOffset||document.body.scrollTop;
      if(this.$parent&&this.$parent.onScroll&&typeof(this.$parent.onScroll)==='function'){
        this.$parent.onScroll(offsetY);
      }
      // this.$emit('test',offsetY)//这里的 $emit 在父组件无法触发 TODO
    },
    refresh(){
      if(this.$refs.scrollWrapper){
        this.$refs.scrollWrapper.style.height = window.innerHeight - realPx(this.top) - realPx(this.bottom) + 'px';
        this.$refs.scrollWrapper.addEventListener('scroll',this.handleScroll)
      }
    }
  },
  mounted(){
    this.refresh()
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.scroll-wrapper {
  position: relative;
  z-index: 100;
  width: 100%;
  @include scroll;
}
</style>