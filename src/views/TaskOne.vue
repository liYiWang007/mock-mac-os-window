<script setup>
import { onMounted, ref } from 'vue'
import WindowTemp from '@/components/WindowTemp.vue'
import useWindow from '@/hooks/use-window.js'

defineOptions({
  name: 'TaskOne'
})
const { width, height } = useWindow()
</script>
<template>
  <window-temp class="task-one" title="任务一" v-model:width="width" v-model:height="height"></window-temp>
</template>

<style lang="scss">

</style>
