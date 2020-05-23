<template>
    <div class="store-shelf">
        <shelf-title :title="shelfCategory.title" ></shelf-title>
        <Scroll :top="0" :bottom="scrollBottom" class="store-shelf-scroll-wrapper" @onScroll="onScroll"
                v-if="shelfCategory.itemList && shelfCategory.itemList.length >0" ref="scroll">
            <shelf-list :top="42" :data="shelfCategory.itemList" ></shelf-list>
        </Scroll>
        <div class="store-shelf-empty-view" v-else>
            {{$t('shelf.groupNone')}}
        </div>
        <shelf-footer></shelf-footer>
    </div>
</template>

<script>
    import ShelfTitle from "../../components/shelf/ShelfTitle";
    import ShelfList from "../../components/shelf/ShelfList";
    import Scroll from "../../components/common/Scroll";
    import { storeShelfMixin } from "../../utils/mixin"
    import ShelfFooter from "../../components/shelf/ShelfFooter";

    export default {
        mixins: [storeShelfMixin],
        components: {
            ShelfFooter,
            Scroll,
            ShelfTitle,
            ShelfList
        },
        watch: {
          isEditMode(v){
              this.scrollBottom = v ? 48 : 0
              this.$nextTick(()=>{
                  if(this.$refs.scroll){
                      this.$refs.scroll.refresh()
                  }
              })
          }
        },
        data(){
            return {
                scrollBottom: 0
            }
        },
        methods: {
            onScroll(offsetY){
                this.setOffsetY(offsetY);
            }
        },
        mounted() {
            this.getCategoryList(this.$route.query.title);
            this.setCurrentType(2);
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";

    .store-shelf {
        position: relative;
        z-index: 100;
        width: 100%;
        height: 100%;
        background-color: white;

        .store-shelf-scroll-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 101;
        }

        .store-shelf-empty-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: px2rem(14);
            color: #333;
            @include center;
        }
    }

</style>