<template>
    <div class="main-content">
        <div class="head" :class="{ 'head-shifted': layoutRef && layoutRef.isSidebarOpen }">
            <button @click="toggleSidebar" class="sidebar-toggle">
            {{ layoutRef && layoutRef.isSidebarOpen ? '<-' : '->' }}
        </button>
        <div class="title">
            首页
        </div>
        </div>
        <!-- 路由视图，用于渲染当前路由对应的组件 -->
        <div class="view"><router-view /></div>
    </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import router from '@/router'

// 定义props接收layoutRef
const props = defineProps({
  layoutRef: {
    type: Object,
    default: null
  }
})

// 切换侧边栏显示/隐藏
const toggleSidebar = () => {
  if (props.layoutRef) {
    props.layoutRef.toggleSidebar()
  }
}
</script>

<style scoped>
.head {
    display: flex;
    align-items: center;
    height: 50px;
    background: #e9ecef;
    position: fixed; /* 固定定位 */
    top: 0; /* 固定在顶部 */
    left: 55px; /* 默认侧边栏宽度 */
    right: 0; /* 延伸到右边 */
    z-index: 1000; /* 确保在其他内容之上 */
    transition: left 0.3s ease; /* 平滑过渡效果 */
}

/* 当侧边栏展开时，调整头部位置 */
.head-shifted {
    left: 300px !important; /* 侧边栏展开时的位置 */
}
.sidebar-toggle {
    height: 50px;
    width: 50px;
    background: #e9ecef;
    color: black;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: left 0.3s ease;
    outline: none; /* 移除轮廓线 */
    user-select: none; /* 防止文本选择 */
}

.sidebar-toggle:hover {
    background: #dde1e5;
}
.title {
    text-decoration: none;
    color: #97a8be;
    font-size: 14px;
}
.view {
    width: 100%;
    height: calc(100% - 50px); /* 减去头部高度 */
    background-color: #f0f2f5;
    box-sizing: border-box;
    overflow: auto;
    padding: 0 32px; /* 给content区域添加左右32px边距 */
    margin-top: 50px; /* 为固定头部留出空间 */
}
</style>