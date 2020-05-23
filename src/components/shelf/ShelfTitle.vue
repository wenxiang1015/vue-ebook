<template>
    <transition name="fade">
        <div class="shelf-title" :class="{'hide-shadow': ifHideShadow}" v-show="shelfTitleVisible">
            <div class="shelf-title-text-wrapper">
                <div class="shelf-title-text">{{title}}</div>
                <div class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</div>
            </div>
            <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack">
                <span class="icon-back" @click="back"></span>
            </div>
            <div class="shelf-title-btn-wrapper"
                 :class="{'shelf-title-left':changeGroupLeft,'shelf-title-right': changeGroupRight}"
                 @click="changeGroup" v-if="showChangeGroup" >
                <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
            </div>
            <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
                <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
            </div>
            <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
                <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
            </div>
        </div>
    </transition>
</template>

<script>
    import {storeShelfMixin} from '../../utils/mixin'
    import {clearLocalForage} from "../../utils/localForage";
    import {clearLocalStorage, saveBookShelf} from "../../utils/localStorage";

    export default {
        mixins: [storeShelfMixin],
        props: {
            title: String,
        },
        computed: {
            showEdit(){
                return this.currentType === 1 || !this.isCategoryEmpty();
            },
            showClear(){
                return this.currentType === 1;
            },
            showBack(){
                return this.currentType === 2 && !this.isEditMode;
            },
            //this.currentType === 2 在 showChangeGroup 时已经判断过了
            changeGroupLeft(){
                return !this.isCategoryEmpty();
            },
            changeGroupRight(){
                return this.isCategoryEmpty();
            },
            //是否显示修复分组名按钮
            showChangeGroup(){
                return this.currentType === 2 && (this.isEditMode || this.isCategoryEmpty());
            },
            selectedText() {
                const num = this.shelfSelected ? this.shelfSelected.length : 0
                if (num <= 0) {
                    return this.$t('shelf.selectBook')
                } else if (num === 1) {
                    return this.$t('shelf.haveSelectedBook').replace('$1', num)
                } else {
                    return this.$t('shelf.haveSelectedBooks').replace('$1', num)
                }
            }
        },
        data() {
            return {
                ifHideShadow: true
            }
        },
        watch: {
            offsetY(v) {
                if (v > 0) {
                    this.ifHideShadow = false
                } else {
                    this.ifHideShadow = true
                }
            }
        },
        methods: {
            onComplete(){
                this.hidePopup();
                //删除空分类
                this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id))
                    .then(()=> {
                        saveBookShelf(this.shelfList);
                        this.$router.go(-1);
                        this.setIsEditMode(false);
                    });
            },
            deleteGroup(){
                if(!this.isCategoryEmpty()){
                    this.setShelfSelected(this.shelfCategory.itemList);// 将本分类中的书全部置为选中状态
                    this.moveOutOfGroup(this.onComplete);//将分类中的书移动到主书架
                } else {
                    this.onComplete();
                }
            },
            showDeleteGroup(){
              this.hidePopup();
              setTimeout(() =>{
                  this.popupMenu = this.popup({
                      title: this.$t('shelf.deleteGroupTitle'),
                      btn: [
                          {
                              text: this.$t('shelf.deleteGroup'),
                              click: () =>{
                                this.deleteGroup();
                              }
                          },
                          {
                              text: this.$t('shelf.cancel'),
                              click: () =>{
                                  this.hidePopup();
                              }
                          }
                      ]
                  }).show()
              },200)
            },
            hidePopup(){
                this.popupMenu.hide();
            },
            changeGroup(){
                this.popupMenu = this.popup({
                    btn: [
                        {
                            text: this.$t('shelf.editGroupName'),
                            click: () =>{
                                this.hidePopup();
                                this.dialog({
                                    showNewGroup: true,
                                    groupName: this.shelfCategory.title
                                }).show();
                            }
                        },
                        {
                            text: this.$t('shelf.deleteGroup'),
                            type: 'danger',
                            click: () =>{
                                this.showDeleteGroup();
                            }
                        },
                        {
                            text: this.$t('shelf.cancel'),
                            click: () =>{
                                this.hidePopup();
                            }
                        }
                    ]
                }).show()
            },
            isCategoryEmpty(){
                return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0;
            },
            onEditClick() {
                //取消时清空选中列表,将 shelfList 中的每一项 选中状态置为 false
                if (!this.isEditMode) {
                    this.setShelfSelected([])
                    this.shelfList.forEach(item => {
                        item.selected = false;
                        if (item.itemList) {
                            item.itemList.forEach(subItem => subItem.selected = false);
                        }
                    })
                }
                this.setIsEditMode(!this.isEditMode);
            },
            clearCache() {
                clearLocalStorage();
                clearLocalForage();
                this.setShelfList([]);
                this.setShelfSelected([]);
                this.getShelfList();
                this.simpleToast(this.$t('shelf.clearCacheSuccess'));
            },
            back() {
                this.$router.go(-1);
                this.setIsEditMode(false);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";

    .shelf-title {
        position: relative;
        z-index: 130;
        width: 100%;
        height: px2rem(42);
        background: white;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);

        &.hide-shadow {
            box-shadow: none;
        }

        .shelf-title-text-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(42);
            @include columnCenter;

            .shelf-title-text {
                font-size: px2rem(16);
                line-height: px2rem(20);
                font-weight: bold;
                color: #333;
            }

            .shelf-title-sub-text {
                font-size: px2rem(10);
                color: #333;
            }
        }

        .shelf-title-btn-wrapper {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            height: 100%;
            @include center;

            .shelf-title-btn-text {
                font-size: px2rem(14);
                color: #666;
            }

            .icon-back {
                font-size: px2rem(20);
                color: #666;
            }

            &.shelf-title-left {
                left: 0;
                padding-left: px2rem(15);
            }

            &.shelf-title-right {
                right: 0;
                padding-right: px2rem(15);
            }
        }
    }

</style>