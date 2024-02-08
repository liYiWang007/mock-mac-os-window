<script setup>
import { onMounted,onUnmounted, toRefs, ref, inject } from 'vue'
import useResize from '@/hooks/use-resize'
import useDrager from '@/hooks/use-drager.js'
import useHomeStore from '@/stores/home-store.js'
import router from '@/router'

defineOptions({
  name: 'WindowTemp'
})
const props = defineProps({
  title: String,
  visible: Boolean
})
const { title } = toRefs(props)
const emit = defineEmits(['update:visible'])

const width=ref(700)
const height=ref(500)

const windowRef = ref()
const resizeRef = ref()
const dragRef = ref()
const { position } = useDrager(windowRef, dragRef)

const { resizeCursor } = useResize(windowRef, resizeRef, position, width,height)
const handleCenter = () => {
  const windowX = window.innerWidth
  const windowY = window.innerHeight
  const { width, height } = windowRef.value.getBoundingClientRect()
  position.value = {
    x: Math.ceil((windowX - width) / 2),
    y: Math.ceil((windowY - height) / 2)
  }
}

onMounted(() => {
  handleCenter()
})
onUnmounted(()=>{
  emit('update:visible', false)
})
</script>
<template>
    <div ref="windowRef" class="window" v-show="visible"
         :style="{'--width':`${width}px`,'--height':`${height}px`,'--X':`${position.x}px`,'--Y':`${position.y}px`}">
      <div ref="resizeRef" class="resize-box" :style="{ '--resize-cursor':`${resizeCursor}`}"></div>
      <div ref="dragRef" class="window__header">{{ title }} 抓取此处可随意改变弹窗位置</div>
      {{ position }}
      <hr>
      鼠标移动到四周可以拖动改变弹窗大小
      <hr>
    </div>
</template>

<style lang="scss">
.window {
  position: fixed;
  width: var(--width);
  height: var(--height);
  left: var(--X);
  top: var(--Y);
  border-radius: 16px;
  padding: 8px;
  box-sizing: border-box;
  background: #fff;

  .window__header {
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: pink;
    border-radius: 8px;
    text-indent: 2rem;
    cursor: pointer;
  }

  .resize-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: var(--resize-cursor);
    z-index: -1;
    border-radius: 16px;
  }

  //显示动画
  &.magic-in-animate {
    animation-name: magic-in;
    animation-duration: .3s;
    animation-timing-function: cubic-bezier(0.250, 0.460, 0.450, 0.940);
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
  }

  //退出动画
  &.magic-out-animate {
    animation-name: magic-out;
    animation-duration: .3s;
    animation-timing-function: cubic-bezier(0.250, 0.460, 0.450, 0.940);
    animation-iteration-count: 1;
  }
}
// 显示动画
@keyframes magic-in {
  0% {
    -webkit-clip-path: var(--clip-path-mini);
    transform: skewX(v-bind(magicSkewX)) scaleY(v-bind(magicScaleY)) translate(0, v-bind(magicHeight));
  }

  66% {
    transform: skewX(v-bind(magicSkewX)) scaleY(v-bind(magicScaleY)) translate(0, 0);
  }

  75% {
    -webkit-clip-path: var(--clip-path-half);
  }

  100% {
    transform: skewX(v-bind(magicSkewX)) scaleY(1) translateY(0);
    -webkit-clip-path: var(--clip-path-full);
  }
}
//隐藏动画
@keyframes magic-out {
  0% {
    transform: skewX(0) scale(1, 1) translateY(0);
    -webkit-clip-path: var(--clip-path-full);
  }

  66% {
    -webkit-clip-path: var(--clip-path-half);
    transform: skewX(v-bind(magicSkewX)) scaleY(v-bind(magicScaleY)) translate(0, 0);
  }
  90% {
    opacity: 1;
  }
  100% {
    -webkit-clip-path: var(--clip-path-mini);
    transform: skewX(v-bind(magicSkewX)) scaleY(v-bind(magicScaleY));
  }
}

</style>
