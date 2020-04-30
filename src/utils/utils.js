export function px2rem(px) {
    return px/37.5;//37.5 为应用默认的 fontSize (mixin.scss 中的默认值)
}

// 应用中默认以 375 px 为屏幕宽度,该方法传入的宽度是基于 375 等分的,转换为实际的宽度
export function realPx(px){
    //这里对应 App.vue 中的设置
    const maxWidth = window.innerWidth > 500? 500 : window.innerWidth;
    return px * (maxWidth / 375)
}