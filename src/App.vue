<template>
  <LayoutContainer ref="layoutRef">
    <!-- 侧边栏内容通过插槽传入 -->
    <template #sidebar>
      <SidebarComponent />
    </template>
    
    <!-- 主内容区域通过插槽传入 -->
    <template #content>
      <MainContent :layout-ref="layoutRef" />
    </template>
  </LayoutContainer>
</template>

<script setup>
import { ref } from 'vue'
import LayoutContainer from './components/LayoutContainer.vue'
import SidebarComponent from './components/SidebarComponent.vue'
import MainContent from './components/MainContent.vue'

// 创建LayoutContainer的引用
const layoutRef = ref(null)



</script>
<style>
/* 添加一些全局样式确保内容可见 */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  overflow: hidden;
}
</style>
