<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div 
      class="sidebar" 
      :class="{ 'sidebar-open': isSidebarOpen }"
    >
      <slot name="sidebar"></slot>
    </div>
    
    <!-- 主内容区域 -->
    <div 
      class="main-content" 
      :class="{ 'content-shifted': isSidebarOpen }"
    >
      <!-- 主内容插槽 -->
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
const isSidebarOpen = ref(false)

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 暴露属性和方法供父组件访问
defineExpose({
  isSidebarOpen,
  toggleSidebar
})
</script>

<style scoped>
.layout-container {
  display: flex;
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 300px;
  height: 100vh;
  background: #f8f9fa;
  border-right: 1px solid #dee2e6;
  z-index: 1; /* 侧边栏z-index较低，默认在主内容下方 */
  box-sizing: border-box;
}

.main-content {
  background: #ffffff;
  position: fixed;
  left: 55px;
  right: 0; /* 恢复到屏幕右边缘，让head占满宽度 */
  height: 100vh;
  transition: left 0.3s ease; /* 只需要left的过渡效果 */
  box-sizing: border-box;
  overflow-y: auto;
  z-index: 50; /* 主内容z-index较高，默认覆盖侧边栏 */
}

.content-shifted {
  left: 300px; /* 主内容区域左侧位置移动300px */
}
</style>