<template>
  <div class="bookmark" :style="style" ref="bookmark"></div>
</template>

<script>
import { px2rem } from '../../utils/utils';
export default {
    props:{
        width: Number,
        height: Number,
        color: String
    },
    computed: {
        style(){
            if(this.color){
                return {
                    borderColor: `${this.color} ${this.color} transparent ${this.color}`
                }
            } else {
                return {} //注意返回 空对象并不会覆盖默认样式
            }
        }
    },
    data(){
      return {
          bottomHeight: 5 //默认底部三角形的高度
      }  
    },
    methods:{
        refresh(){
            if(this.height&&this.width){
                this.$refs.bookmark.style.borderWidth=`${px2rem(this.height-this.bottomHeight)}rem 
                ${px2rem(this.width/2)}rem ${px2rem(5)}rem ${px2rem(this.width/2)}rem`
            }
        }
    },
  mounted() {
      this.refresh()
  }
};
</script>
<style lang='scss' scoped>
@import "@/assets/styles/global";

.bookmark {
  width: 0;
  height: 0;
  border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
  border-style: solid;
  border-color: white white transparent white;
}
</style>