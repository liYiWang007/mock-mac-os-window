<script setup>
import { onMounted, toRefs, ref,inject } from 'vue'
import useResize from '@/hooks/use-resize'
import useDrager from '@/hooks/use-drager.js'
import useHomeStore from '@/stores/home-store.js'

defineOptions({
  name: 'WindowTemp'
})
const props = defineProps({
  title: String,
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 400
  }
})
const { width, height, title } = toRefs(props)
const emit = defineEmits(['update:visible', 'update:width', 'update:height'])

const windowRef = ref()
const resizeRef = ref()
const dragRef = ref()
const { position } = useDrager(windowRef, dragRef)

const { resizeCursor } = useResize(windowRef, resizeRef, position, emit)
const handleCenter = () => {
  const windowX = window.innerWidth
  const windowY = window.innerHeight
  const { width, height } = windowRef.value.getBoundingClientRect()
  position.value = {
    x: Math.ceil((windowX - width) / 2),
    y: Math.ceil((windowY - height) / 2)
  }
}

// 获取位置
const taskIconElRef = inject('taskIconElRef')

const getPos=()=>{
  const windowRect=windowRef.value.getBoundingClientRect()
  const iconIndex=useHomeStore().taskbarList.findIndex(icon=>icon.title===title.value)
  const iconRect=resizeRef.value[iconIndex].getBoundingClientRect()
}
onMounted(() => {
  handleCenter()
})
</script>
<template>
  <div ref="windowRef" class="window"
       :style="{'--width':`${width}px`,'--height':`${height}px`,'--X':`${position.x}px`,'--Y':`${position.y}px`}">
    <div ref="resizeRef" class="resize-box" :style="{ '--resize-cursor':`${resizeCursor}`}"></div>
    <div ref="dragRef" class="window__header">{{ title }} 抓取此处可随意改变弹窗位置</div>
    {{position}}
    <hr>
    鼠标移动到四周可以拖动改变弹窗大小
    <hr>
    {{taskIconElRef}}
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
    cursor:var(--resize-cursor);
    z-index: -1;
    border-radius: 16px;
  }
  .resize-box{
  }
}
</style>
