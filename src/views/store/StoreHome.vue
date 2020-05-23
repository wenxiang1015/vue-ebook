<template>
  <div class="store-home">
    <search-bar></search-bar>
    <!--  加载动画组件  -->
    <flap-card :data="random" ></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{'backgroundImage':`url(${banner})`}" ></div>
      </div>
      <guess-you-like :data="guessYouLike" ></guess-you-like>
      <recommend :data="recommend" class="recommend" ></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')" class="featured" ></featured>
      <div class="category-list-wrapper" v-for="(item,index) in categoryList" :key="index">
        <category-book :data="item" ></category-book>
      </div>
      <category class="categories" :data="categories" ></category>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar'
import FlapCard from "../../components/home/FlapCard";
import Scroll from '../../components/common/Scroll';
import GuessYouLike from "../../components/home/GuessYouLike";
import Recommend from "../../components/home/Recommend";
import { storeHomeMixin } from '../../utils/mixin'
import { home } from "../../api/store";
import Featured from "../../components/home/Featured";
import CategoryBook from "../../components/home/CategoryBook";
import Category from "../../components/home/Category";

export default {
  mixins: [storeHomeMixin],
  components:{
    Category,
    CategoryBook,
    Featured,
    Recommend,
    GuessYouLike,
    SearchBar,
    FlapCard,
    Scroll
  },
  methods:{
    onScroll(offsetY){
      this.setOffsetY(offsetY)
      if(offsetY>0){
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh();
    }
  },
  data() {
    return {
      scrollTop: 94,
      random: null, //随机推荐的书籍
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    };
  },
  mounted() {
    home().then(response=> {
      if(response && response.status === 200) {
        const data = response.data
        const randomList = data.random
        if(randomList){
          //生成一个 0 到 data.random.length 之间的随机数(Math.random() 生成一个 0-1 之间的随机数)
          const randomIndex = Math.floor(Math.random() * randomList.length);
          this.random = randomList[randomIndex];
        }
        this.banner = data.banner;
        this.guessYouLike = data.guessYouLike;
        this.recommend = data.recommend;
        this.featured = data.featured;
        this.categoryList = data.categoryList;
        this.categories = data.categories;
      }
    })
  }
};
</script>
<style lang='scss' scoped>
  @import "../../assets/styles/global";

  .store-home {
      width: 100%;
      height: 100%;
      .banner-wrapper {
        width: 100%;
        padding: px2rem(10);
        box-sizing: border-box;
        .banner-img {
          width: 100%;
          height: px2rem(150);
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
      }

      .recommend {
        margin-top: px2rem(20);
      }

      .featured {
        margin-top: px2rem(20);
      }

      .category-list-wrapper {
        margin-top: px2rem(20);
      }

      .categories {
        margin-top: px2rem(20);
      }
  }
</style>