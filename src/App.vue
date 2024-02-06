<script setup>
import { provide,ref } from 'vue'
import { RouterView } from 'vue-router'
import Taskbar from '@/components/Taskbar.vue'
// 任务栏的ref
const taskIconElRef = ref([])
provide('taskIconElRef', taskIconElRef)
</script>

<template>
  <Taskbar />
  <RouterView />
</template>
<style lang="scss">
#app{
  width: 100vw;
  height: 100vh;
  background: url("@/assets/images/sky-bg.jpg");
}
</style>
