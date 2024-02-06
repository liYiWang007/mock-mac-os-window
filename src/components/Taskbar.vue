<script setup>
import { inject } from 'vue'
import useHomeStore from '@/stores/home-store.js'
defineOptions({
  name: 'Taskbar'
})
const taskIconElRef = inject('taskIconElRef')

</script>
<template>
  <div class="taskbar">
    <div class="taskbar-in">
      <div  class="taskbar__item" v-for="(item,index) in useHomeStore().taskbarList" :ref="el=>(taskIconElRef[index]=el)" :key="item.id" @click="useHomeStore().setActivePath(item)">
        <img :src="item.icon" alt="" />
      </div>
    </div>
  </div>

</template>

<style lang="scss">
.taskbar {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  padding-bottom: 10px;
  z-index: 99;

  .taskbar-in {
    display: flex;
    min-width: 38px;
    height: 38px;
    padding: 8px;
    border-radius: 8px;
    //background: rgba(0,0,0,.3);
    background: rgba(255, 255, 255, .3);
    box-shadow: 1px 1px 0 0 rgba(255, 255, 255, .5) inset, -1px -1px 0 0 rgba(0, 0, 0, .3) inset;
  }

  .taskbar__item {
    --width: 36px;
    width: var(--width);
    transform-origin: bottom;
    cursor: pointer;
    font-size: 0;

    img {
      width: var(--width);
      height: var(--width);
      background: #fff;
      border-radius: 4px;
      transform-origin: bottom;
    }

    p {
      text-align: center;
      font-size: 12px;
      line-height: 16px;
    }

    & + .taskbar__item {
      margin-left: 10px;
    }

    &:hover {
      transform: scale(1.2);
    }
  }
}
</style>
