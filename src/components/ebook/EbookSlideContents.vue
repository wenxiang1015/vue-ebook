<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          type="text"
          class="slide-contents-search-input"
          v-model="searchText" 
          :placeholder="$t('book.searchHint')"
          @keyup.enter.exact="search()"
          @click="showCancelBtn()"
        />
      </div>
      <div
        class="slide-contents-search-cancel"
        v-if="searchVisible"
        @click="hideCancelBtn()"
      >{{$t('book.cancel')}}</div>
    </div>

    <div class="slide-contents-book-wrapper" v-show="!searchVisible" >
      <div class="slide-contents-book-img-wrapper">
        <img :src="cover" alt="" class="slide-contents-book-img">
      </div>
      <div class="slide-conetents-book-info-wrapper">
        <div class="slide-contents-book-title" v-if="metadata" >
          <span class="slide-contents-book-title-text" >{{metadata.title}}</span>
        </div>
        <div class="slide-contents-book-author" v-if="metadata" >
          <span class="slide-contents-book-author-text" >{{metadata.creator}}</span>
        </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{progress + '%'}}</span>
          <span class="progress-text">{{$t('book.haveRead2')}}</span>
        </div>
        <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>

    <scroll class="slide-contents-list" :top="156" :bottom="48" v-show="!searchVisible" >
      <div class="slide-contents-item" v-for="(item,index) in navigation" :key="index" >
        <span class="slide-contents-item-label" 
        :class="{'selected': section === index}" 
        :style="contentsItemStyle(item)" 
        @click="displayNavigation(item.href)" >{{item.label}}</span>
        <span class="slide-contents-item-page">{{item.page}}</span>
      </div>
    </scroll>

    <scroll class="slide-search-list" :top="66" :bottom="48" v-show="searchVisible" >
      <div class="slide-search-item" v-for="(item,index) in searchList" :key="index" @click="displayNavigation(item.cfi,true)" v-html="item.excerpt" ></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from "../../utils/mixin";
import Scroll from "../common/Scroll"
import { px2rem } from '../../utils/utils';

export default {
  mixins: [ebookMixin],
  components :{
    Scroll
  },
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    };
  },
  methods: {
    search(){
      if(this.searchText&&this.searchText.length>0){
        this.doSearch(this.searchText).then(list => {
          this.searchList = list;
          this.searchList.map(item => {
            item.excerpt = item.excerpt.replace(this.searchText,
            `<span class="content-search-text">${this.searchText}</span>`)
            return item;
          })
        })
      }
    },
    doSearch(q) {
        return Promise.all(
            this.currentBook.spine.spineItems.map(
              section => section.load(this.currentBook.load.bind(this.currentBook))
              .then(section.find.bind(section, q))
              .finally(section.unload.bind(section)))
        ).then(results => Promise.resolve([].concat.apply([], results)));
    },
    // onScroll(offsetY){
    //   console.log(offsetY)
    // },
    displayNavigation(target,highlight = false){
      this.display(target,()=>{
        this.hideMenuVisible()
        if(highlight){
          this.currentBook.rendition.annotations.highlight(target);//高亮
        }
      })
    },
    contentsItemStyle(item){
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    },
    showCancelBtn() {
      this.searchVisible = true;
    },
    hideCancelBtn() {
      this.searchVisible = false;
      this.searchText = '';
      this.searchList = null;
    }
  },
  mounted() {
  }
};
</script>
<style lang='scss' scoped>
@import "../../assets/styles/global";

.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;

    .slide-contents-search-input-wrapper {
      flex: 1;
      border: px2rem(1) solid #d7d6dc;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }

    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-conetents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        /**
          rem 以 375 为屏幕宽度,
          30 是 slide-contents-book-wrapper 左右 padding,
          45 是 左边 slide-contents-book-img-wrapper 宽度,
          70 是 右边 slide-contents-book-progress-wrapper 宽度
          20 是 slide-conetents-book-info-wrapper 左右 padding 
          (375 * 0.85) - 30 - 45 -70 -20 = 153.75
         */ 
        // width: px2rem(153.75);
        font-size: px2rem(14);
        @include left;
        .slide-contents-book-title-text{
          @include ellipsis2(3);
        }
      }
      .slide-contents-book-author {
        // width: px2rem(153.75);
        font-size: px2rem(12);
        line-height: px2rem(14);
        margin-top: px2rem(5);
        @include left;
        .slide-contents-book-author-text {
          @include ellipsis2(2);
        }
      }
    }

    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        margin-top: px2rem(5);
        font-size: px2rem(12);
      }
    }
  }

  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        /**
          ellipsis 需要指定一个宽度, 使用 flex 可以自动计算宽度
          ,因为多级目录导致子目录和父目录长度不一致
        */
        flex: 1;
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }

  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>