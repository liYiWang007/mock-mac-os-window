<script setup>
import { provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import taskbar from '@/components/Taskbar.vue'
import router from '@/router/index.js'
import useHomeStore from '@/stores/home-store.js'
import { hasClass, removeClass, getAngle } from '@/assets/js/dom.js'


// 任务栏的ref
const taskIconElRef = ref([])
provide('taskIconElRef', taskIconElRef)

// 设置动画的发生位置
const magicScaleY = ref(1)
const magicSkewX = ref('0deg')
const magicBoxSkewX = ref('-30deg')
const magicPathList = ref([])
const windowRef = ref()

const getMagicPos = () => {
  // 路由路径获取逻辑：进入模块时获取 router的fullPath，关闭时获取modelValue
  const _currentPath = router.currentRoute.value.fullPath
  const _windowRect = windowRef.value.getBoundingClientRect()
  // 1.获取任务栏对应图标的位置
  const _index = useHomeStore().taskbarList.findIndex(item => item.path === _currentPath)
  const _iconRect = taskIconElRef.value?.[_index]?.getBoundingClientRect()

  // 弹窗变形参数:y轴放大=图标的y坐标 - taskbar的paddingTop - 弹窗底部到顶部的距离 之差 除以窗口高度 加 1
  const _scaleY = ((_iconRect.top - 8 - _windowRect.bottom) / _windowRect.height) + 1
  magicScaleY.value = _scaleY > 1 ? _scaleY : 1

  // 弹窗变形参数:弹窗底部右边的坐标(百分比)=图标宽度 除以窗口宽度
  let _magicRight = 1
  // 弹窗变形参数:弹窗底部右边的坐标(百分比)=(窗口宽度-图标宽度之差) 除以窗口宽度
  let _magicLeft = (_windowRect.width - _iconRect.width) / _windowRect.width
  // 判断弹窗相对于小图标靠左，居中or靠右
  let angle = 0
  if (_windowRect.x < _iconRect.x && _windowRect.right < _iconRect.right) {
    // 靠左
    /* 原点 (_windowRect.right,_windowRect.y)
    *  起始点（_windowRect.right,_iconRect.y)
    *  终点（_iconRect.right,_iconRect.y)
    * */
    const _endX = _iconRect.width / 2 + _iconRect.x
    angle = 360 - getAngle(_windowRect.right, _windowRect.y, _windowRect.right, _iconRect.y, _endX, _iconRect.y)
    magicBoxSkewX.value = `${angle}deg`
  } else if (_windowRect.x > _iconRect.x) {
    // 靠右
    // 弹窗变形参数:弹窗底部右边的坐标(百分比)=图标宽度 除以窗口宽度
    _magicRight = _iconRect.width / _windowRect.width
    // 弹窗变形参数:弹窗靠左时 最后一个点在 （0%，100%）
    _magicLeft = 0
    // 原点 (_windowRect.x,_iconRect.x)
    angle = -getAngle(_windowRect.x, _windowRect.y, _windowRect.x, _iconRect.x, _iconRect.x, _iconRect.y)
    magicBoxSkewX.value = `${-angle}deg`
  } else {
    // 弹窗变形参数:弹窗底部右边的坐标(百分比)=图标的x坐标 -  弹窗的左侧坐标 + 图标的宽度 之和 除以窗口宽度 乘以100
    _magicRight = (_iconRect.left - _windowRect.left + _iconRect.width) / _windowRect.width
    // 弹窗变形参数:弹窗底部左边边的坐标(百分比)=图标的x坐标 -  弹窗的左侧坐标 之差 除以窗口宽度 乘以100
    _magicLeft = (_iconRect.left - _windowRect.left) / _windowRect.width
  }
  magicSkewX.value = `${angle}deg`
  let _magicHeight = height.value
  let _magicWidth = width.value
  if (_windowRect.bottom > _iconRect.top - 8) {
    _magicHeight = (_iconRect.top)
  }
  if (hasClass(windowRef.value, 'is-fullscreen')) {
    _magicWidth = window.innerWidth
  } else if (hasClass(windowRef.value, 'is-half-screen')) {
    _magicWidth = window.innerWidth / 2
  }
  const _right = Math.floor(_magicRight * _magicWidth)
  const _left = Math.floor(_magicLeft * _magicWidth)
  magicPathList.value = [
    `path('M 0 0 L ${_magicWidth} 0 C ${_magicWidth} ${_magicHeight * 0.25} ${_magicWidth} ${_magicHeight * 0.66} ${_magicWidth} ${_magicHeight} L 0 ${_magicHeight} C 0 ${_magicHeight * 0.66} 0 ${_magicHeight * 0.25} 0 0 Z')`,
    `path('M 0 0 L ${_magicWidth} 0 C ${_magicWidth} ${_magicHeight * 0.25} ${((_magicWidth - _right) * 0.25) + _right} ${_magicHeight * 0.66} ${_right} ${_magicHeight} L ${_left} ${_magicHeight} C ${_left * 0.8} ${_magicHeight * 0.66} 0 ${_magicHeight * 0.25} 0 0 Z')`,
    `path('M ${_left * 0.5} 0 L ${((_magicWidth - _right) * 0.6) + _right} 0 C ${(_magicWidth - _right) * 0.6 + _right} ${_magicHeight * 0.25} ${((_magicWidth - _right) * 0.15) + _right} ${_magicHeight * 0.66}  ${_right} ${_magicHeight} L ${_left}  ${_magicHeight} C ${_left * 0.75} ${_magicHeight * 0.66} ${_left * 0.8} ${_magicHeight * 0.25} ${_left * 0.5} 0 Z')`,
    `path('M ${_left * 0.95} ${_magicHeight * 0.95} L ${((_magicWidth - _right) * 0.05) + _right} ${_magicHeight * 0.95} C ${_right} ${_magicHeight * 0.97} ${_right} ${_magicHeight * 0.98} ${_right} ${_magicHeight} L ${_left}  ${_magicHeight} C ${_left} ${_magicHeight * 0.98} ${_left * 0.95} ${_magicHeight * 0.97} ${_left * 0.95} ${_magicHeight * 0.95} Z')`
  ]
}


const handleBeforeEnter = () => {
}
const handleEnter = () => {
}
const handleLeave = () => {
}
</script>

<template>
  <taskbar/>

  <Transition @before-enter="handleBeforeEnter"
              @enter="handleEnter"
              @after-enter="removeClass(windowRef, 'magic-in-animate')"
              @before-leave="getMagicPos"
              @leave="handleLeave"
  >
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component ref="windowRef" :is="Component"/>
      </keep-alive>
    </router-view>
  </Transition>

</template>
<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/images/sky-bg.jpg");
}
</style>
