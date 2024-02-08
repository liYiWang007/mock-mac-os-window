<script setup>
import { onMounted, ref } from 'vue'
import WindowTemp from '@/components/WindowTemp.vue'

defineOptions({
  name: 'TaskOne'
})
const visible=ref(false)
onMounted(()=>{
  visible.value=true
})
</script>
<template>
  <window-temp class="task-one" title="任务一" v-model:visible="visible" ></window-temp>
</template>

<style lang="scss">

</style>
