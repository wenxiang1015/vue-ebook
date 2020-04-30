<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script >

/**
 * dom 加载完毕之后 设置字体大小 (rem 的值相当于根元素 font-size 值的倍数.
 *  1rem = 根元素font-size ,2rem = 根元素font-size * 2)
 * 设置 viewport 是为了解决禁止程序在移动端的自行缩放,影响体验
 */
document.addEventListener('DOMContentLoaded',()=>{
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize //防止字体过大,设置上限
  html.style.fontSize = fontSize + 'px'

  const viewport = document.querySelector('meta[name=viewport]')
  viewport.setAttribute('content','width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no')
})
</script>

<style scoped>

  #app {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: #7d8188;
    overflow: hidden;
  }

</style>
