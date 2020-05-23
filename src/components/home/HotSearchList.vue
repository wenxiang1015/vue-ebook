<template>
    <transition name="hot-search-move">
        <scroll class="hot-search-wrapper" :top="52" @onScroll="onScroll" ref="scroll">
            <hot-search :label="$t('home.hotSearch')" :btn="$t('home.change')"
                        :hot-search="searchList.hotSearch"></hot-search>
            <div class="line"></div>
            <hot-search :label="$t('home.historySearch')" :btn="$t('home.clear')"
                        :hot-search="searchList.historySearch"></hot-search>
        </scroll>
    </transition>
</template>

<script>
    import Scroll from "../common/Scroll";
    import HotSearch from "./HotSearch";
    import { storeHomeMixin } from '../../utils/mixin'
    import { searchList } from '../../utils/localData'

    export default {
        mixins: [storeHomeMixin],
        components: {
            HotSearch,
            Scroll
        },
        data() {
            return {
                searchList
            }
        },
        methods: {
            onScroll(offsetY){
                this.setHotSearchOffsetY(offsetY)
            },
            reset(){
                this.$refs.scroll.scrollTo(0,0);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";

    .hot-search-wrapper {
        width: 100%;
        height: 100%;
        background: white;
        overflow-x: hidden;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        &::-webkit-scrollbar {
            display: none;
        }
        .line {
            width: 100%;
            height: 0;
            border-top: px2rem(1) solid #eee;
            margin: px2rem(10) 0;
        }
    }

</style>