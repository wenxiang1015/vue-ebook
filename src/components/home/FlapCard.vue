<script src="../../utils/mixin.js"></script>
<template>
    <div class="flap-card-wrapper" v-show="flapCardVisible">
        <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation" >
            <div class="flap-card" v-for="(item,index) in flapCardList" :key="index" :style="{'zIndex': item.zIndex}">
                <div class="flap-card-circle">
                    <div class="flap-card-semi-circle flap-card-semi-circle-left"
                         :style="semiCircleStyle(item,'left')" ref="left"></div>
                    <div class="flap-card-semi-circle flap-card-semi-circle-right"
                         :style="semiCircleStyle(item,'right')" ref="right"></div>
                </div>
            </div>
            <div class="point-wrapper">
                <div class="point" v-for="item in pointList" :key="item" :class="{'animation':runPointAnimation}"></div>
            </div>
        </div>
        <div class="book-card" :class="{'animation': runBookCardAnimation }" v-show="runBookCardAnimation" >
            <div class="book-card-wrapper">
                <div class="img-wrapper">
                    <img class="img" :src="data?data.cover:''" >
                </div>
                <div class="content-wrapper">
                    <div class="title">{{data?data.title:''}}</div>
                    <div class="author sub-title-medium">{{data?data.author:''}}</div>
                    <div class="category">{{categoryText()}}</div>
                </div>
                <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
            </div>
        </div>
        <div class="close-btn-wrapper" @click="close">
            <span class="icon-close"></span>
        </div>
    </div>
</template>

<script>
    import {storeHomeMixin} from '../../utils/mixin'
    import {flapCardList} from '../../utils/localData'
    import { categoryText } from "../../utils/store"

    export default {
        mixins: [storeHomeMixin],
        props:{
          data: {
              type: Object,
              default: {}
          }
        },
        data() {
            return {
                flapCardList,
                front: 0,
                back: 1,
                intervalTime: 25,
                runFlapCardAnimation: false,//登场动画(不是卡片翻转动画,翻转动画是在 startFlapCardAnimation 中使用定时器手动旋转每一帧完成的)
                runPointAnimation: false,//烟花动画
                pointList: null,
                runBookCardAnimation: false,
                requestTime: 2500 //网络请求耗时
            }
        },
        watch: {
            flapCardVisible(v) {
                if (v) {
                    this.runFlapCardAnimation = true;
                    //.3s 是等待登场动画结束之后再执行翻转动画
                    this.animationTimeout = setTimeout(() => {
                        this.startFlapCardAnimation();
                        this.startPointAnimation();
                    }, 300)
                    //模拟网络请求
                    this.requestTimeout = setTimeout(()=>{
                        this.stopAnimation();
                        this.runBookCardAnimation = true
                    },this.requestTime)
                }
            }
        },
        methods: {
            close() {
                this.stopAnimation();
                this.setFlapCardVisible(false);
            },
            semiCircleStyle(item, direction) {
                return {
                    backgroundColor: `rgb(${item.r} ,${item.g} ,${item.b})`,
                    backgroundImage: direction === 'left' ? item.imgLeft : item.imgRight,
                    backgroundSize: item.backgroundSize
                }
            },
            //旋转的每一帧,type[front,back]
            rotate(index, type) {
                const item = this.flapCardList[index]
                let dom;
                if (type === 'front') {
                    dom = this.$refs.right[index]
                } else {
                    dom = this.$refs.left[index]
                }
                dom.style.transform = `rotateY(${item.rotateDegree}deg)`
                dom.style.backgroundColor = `rgb(${item.r} , ${item._g}, ${item.b})`
            },
            /**
             *  反转 180 度,从 180 度向 0 度旋转
             *  frontFlapCard 只显示 180 到 90 度的变化
             *  backFlapCard 只显示 90 到 0 度的变化
             *  一旦减少到 0 度,后续会在调用 next() 方法的时候归位还原
             */
            flapCardRotate() {
                const frontFlapCard = this.flapCardList[this.front];
                const backFlapCard = this.flapCardList[this.back];
                frontFlapCard.rotateDegree += 10
                frontFlapCard._g -= 5
                backFlapCard.rotateDegree -= 10
                //backFlapCard 旋转过 90 以下,颜色才开始变浅
                if (backFlapCard.rotateDegree < 90) {
                    backFlapCard._g += 5
                }

                //注意增加背面 FlapCard 的 zIndex,否则会被 frontFlapCard 遮盖
                if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
                    backFlapCard.zIndex += 2;
                }
                this.rotate(this.front, 'front')
                this.rotate(this.back, 'back')
                if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
                    this.next();
                }
            },
            /**
             * 处理 flapCardList
             * 1.重置正反面的 flapCard
             * 2.向下循环
             * 3.溢出时重新循环
             * 4.动态设置 flapCard 的 zIndex ,让每一项循环上浮到页面最顶层
             */
            next() {
                //重置正反面的 flapCard
                const frontFlapCard = this.flapCardList[this.front];
                const backFlapCard = this.flapCardList[this.back];
                frontFlapCard.rotateDegree = 0
                backFlapCard.rotateDegree = 0
                frontFlapCard._g = frontFlapCard.g
                backFlapCard._g = backFlapCard.g
                this.rotate(this.front, 'front')
                this.rotate(this.back, 'back')
                //向下循环
                this.front++
                this.back++
                //溢出时重新循环
                const len = this.flapCardList.length;
                if (this.front >= len) {
                    this.front = 0
                }
                if (this.back >= len) {
                    this.back = 0
                }
                // console.log(this.front,this.back)

                /**
                 * 动态设置 flapCard 的 zIndex ,让每一项循环上浮到页面最顶层
                 * 100 -> 96
                 * 99 -> 100
                 * 98 -> 99
                 * 97 -> 98
                 * 96 -> 97
                 */
                this.flapCardList.forEach((item, index) => {
                    item.zIndex = 100 - ((index - this.front + len) % len)
                })
                // console.log(flapCardList.map(item=>item.zIndex))
                this.prepare();
            },
            /**
             * 让背面的 FlapCard 与 正面的 FlapCard 重合
             * (实际旋转的时候2个 FlapCard 都在同步运动,只是转动到中轴的时候)
             * 改变 2个 FlapCard 的 zIndex
             */
            prepare() {
                const backFlapCard = this.flapCardList[this.back];
                //循环中的每个 FlapCard 依次旋转 180 度,从 180 向 0 度旋转
                backFlapCard.rotateDegree = 180
                //预先加深颜色 (只加深了 90 的颜色,backFlapCard 的zIndex 90 度之后才嗯显示出来)
                backFlapCard._g = backFlapCard.g - 5 * 9
                this.rotate(this.back, 'back')
            },
            reset() {
                this.front = 0
                this.back = 1
                this.flapCardList.forEach((item, index) => {
                    item.zIndex = 100 - index;
                    item._g = item.g;
                    item.rotateDegree = 0;
                    this.rotate(index, 'front');
                    this.rotate(index, 'back');
                })
                this.runBookCardAnimation = false
                this.runFlapCardAnimation = false
                this.runPointAnimation = false
            },
            //翻转动画
            startFlapCardAnimation() {
                this.prepare();
                this.task = setInterval(() => {
                    this.flapCardRotate()
                }, this.intervalTime)
            },
            //烟花动画
            startPointAnimation(){
                this.runPointAnimation = true;
                // .75s 是定义在 flapCard.scss 中的动画时间
                setTimeout(()=>{
                    this.runPointAnimation = false;
                },750);
            },
            stopAnimation() {
                this.runFlapCardAnimation = false;//关闭登场动画
                if (this.task) {
                    clearInterval(this.task)
                }
                if(this.animationTimeout){
                    clearTimeout(this.animationTimeout)
                }
                if(this.requestTimeout){
                    clearTimeout(this.requestTimeout)
                }
                this.reset()
            },
            categoryText(){
                if(this.data){
                    return categoryText(this.data.categoryText, this);
                } else {
                    return '';
                }
            }
        },
        created() {
            this.pointList = []
            for (let i = 0; i < 18; i++) {
                this.pointList.push(`point${i}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/styles/global";
    @import "../../assets/styles/flapCard";

    .flap-card-wrapper {
        z-index: 1000;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, .6);
        @include center;
        @include adsCenter;

        .flap-card-bg {
            position: relative;
            width: px2rem(64);
            height: px2rem(64);
            border-radius: px2rem(5);
            background: white;
            transform: scale(0);//默认不显示
            opacity: 0;//默认不显示

            &.animation {
                animation: flap-card-move .3s ease-in both;//both 让执行动画的主体维持在最后 100% 的状态
            }

            @keyframes flap-card-move {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 1;
                }
                75% {
                    transform: scale(.9);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .flap-card {
                width: px2rem(48);
                height: px2rem(48);
                @include adsCenter;

                .flap-card-circle {
                    display: flex;
                    width: 100%;
                    height: 100%;

                    .flap-card-semi-circle {
                        flex: 0 0 50%;
                        width: 50%;
                        height: 100%;
                        background-repeat: no-repeat;
                        backface-visibility: hidden; //转动到背面隐藏
                    }

                    .flap-card-semi-circle-left {
                        border-radius: px2rem(24) 0 0 px2rem(24);
                        background-position: center right;
                        transform-origin: right; //默认是中轴转动,改成围绕右侧转动
                    }

                    .flap-card-semi-circle-right {
                        border-radius: 0 px2rem(24) px2rem(24) 0;
                        background-position: center left;
                        transform-origin: left;
                    }
                }
            }

            .point-wrapper {
                z-index: 1500;
                @include adsCenter;
                .point {
                    border-radius: 50%;
                    @include adsCenter;
                    &.animation {
                        @for $i from 1 to length($moves){
                            &:nth-child(#{$i}){//css3 选择器 选择到每个子节点，调用定义好的 move 方法
                                @include move($i);
                            }
                        }
                    }
                }
            }
        }

        .book-card {
            position: relative;
            width: 65%;
            // height: 70%;
            box-sizing: border-box;
            border-radius: px2rem(15);
            background: white;
            &.animation {
                animation: scale .3s ease-in both;
                @keyframes scale {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            }
            .book-card-wrapper {
                width: 100%;
                height: 100%;
                margin-bottom: px2rem(30);
                @include columnTop;
                .img-wrapper {
                    width: 100%;
                    margin-top: px2rem(20);
                    @include center;
                    .img {
                        width: px2rem(90);
                        height: px2rem(130);
                    }
                }
                .content-wrapper {
                    padding: 0 px2rem(20);
                    margin-top: px2rem(20);
                    .title {
                        color: #333;
                        font-weight: bold;
                        font-size: px2rem(18);
                        line-height: px2rem(20);
                        max-height: px2rem(40);
                        text-align: center;
                        @include ellipsis2(2)
                    }
                    .author {
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                    .category {
                        color: #999;
                        font-size: px2rem(14);
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                }
                .read-btn {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 1100;
                    width: 100%;
                    border-radius: 0 0 px2rem(15) px2rem(15);
                    padding: px2rem(15) 0;
                    text-align: center;
                    color: white;
                    font-size: px2rem(14);
                    background: $color-blue;
                }
            }
        }

        .close-btn-wrapper {
            position: absolute;
            left: 0;
            bottom: px2rem(30);
            z-index: 1100;
            width: 100%;
            @include center;

            .icon-close {
                width: px2rem(45);
                height: px2rem(45);
                font-size: px2rem(25);
                border-radius: 50%;
                background: #333;
                color: white;
                @include center;
            }
        }
    }
</style>