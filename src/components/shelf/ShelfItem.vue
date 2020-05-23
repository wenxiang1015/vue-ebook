<template>
    <div class="shelf-item" :class="{'shelf-item-shadow': data.type === 1 || data.type === 2}" @click="onItemClick">
        <component class="shelf-item-comp" :class="{'is-edit': isEditMode && data.type === 2}" :is="item" :data="data" ></component>
        <div class="icon-selected" :class="{'is-selected': data.selected}" v-show="isEditMode && data.type === 1"></div>
    </div>
</template>

<script>
    import { storeShelfMixin } from "../../utils/mixin"
    import ShelfItemBook from "./ShelfItemBook"
    import ShelfItemAdd from "./ShelfItemAdd"
    import ShelfItemCategory from "./ShelfItemCategory"
    import {gotoStoreHome} from "../../utils/store";

    export default {
        mixins: [storeShelfMixin],
        props:{
            data: Object
        },
        computed: {
            item(){
                const type = this.data.type;
                if(type === 1){
                    return this.book;
                } else if(type === 2){
                    return this.category;
                } else {
                    return this.add;
                }
            }
        },
        data(){
            return {
                book: ShelfItemBook,
                add: ShelfItemAdd,
                category: ShelfItemCategory
            }
        },
        methods:{
            onItemClick(){
                const type = this.data.type;
                if(this.isEditMode){
                    this.data.selected = !this.data.selected;
                    if(this.data.selected) {
                        this.shelfSelected.pushWithoutDuplicate(this.data)
                        //this.setShelfSelected(this.shelfSelected)//TODO 是否需要存入 vuex
                    } else {
                        this.setShelfSelected(this.shelfSelected.filter(item => item.id != this.data.id))
                    }
                } else {
                    if(type === 1){
                        this.showBookDetail(this.data)
                    } else if(type === 2){
                        this.$router.push({
                            path: '/store/category',
                            query: {
                                title: this.data.title
                            }
                        })
                    } else {
                        gotoStoreHome(this)
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";

    .shelf-item {
        position: relative;
        width: 100%;
        height: 100%;
        &.shelf-item-shadow {
            box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200,200,200,.3);
        }

        .icon-selected {
            position: absolute;
            bottom: px2rem(2);
            right: px2rem(2);
            font-size: px2rem(18);
            color: rgba(0,0,0,.4);
            &.is-selected {
                color: $color-blue;
            }
        }

        .shelf-item-comp {
            opacity: 1;
            &.is-edit {
                opacity: .5;
            }
        }
    }
</style>