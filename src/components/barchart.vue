<template>
  <div class="chart-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-text">加载堆叠柱状图数据中...</div>
    </div>
    <!-- ECharts容器 -->
    <div v-else ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import { getBarChartData } from '@/api/mock';

// 使用ref来管理图表实例和DOM引用
const myChart = ref(null);
const chartRef = ref(null);

// 响应式数据
const barChartData = ref({});
const loading = ref(true);

// 防抖定时器
let resizeTimer = null;

// 处理堆叠柱状图数据的函数
const processStackedBarData = (rawData) => {
  const series = rawData.series || [];
  const stackInfo = {};
  
  // 计算堆叠信息
  for (let i = 0; i < series[0]?.data?.length || 0; ++i) {
    for (let j = 0; j < series.length; ++j) {
      const stackName = series[j].stack;
      if (!stackName) {
        continue;
      }
      if (!stackInfo[stackName]) {
        stackInfo[stackName] = {
          stackStart: [],
          stackEnd: []
        };
      }
      const info = stackInfo[stackName];
      const data = series[j].data[i];
      if (data && data !== '-') {
        if (info.stackStart[i] == null) {
          info.stackStart[i] = j;
        }
        info.stackEnd[i] = j;
      }
    }
  }
  
  // 处理圆角边框
  for (let i = 0; i < series.length; ++i) {
    const data = series[i].data;
    const info = stackInfo[series[i].stack];
    for (let j = 0; j < series[i].data.length; ++j) {
      const isEnd = info.stackEnd[j] === i;
      const topBorder = isEnd ? 20 : 0;
      const bottomBorder = 0;
      data[j] = {
        value: data[j],
        itemStyle: {
          borderRadius: [topBorder, topBorder, bottomBorder, bottomBorder]
        }
      };
    }
  }
  
  return series;
};

// 创建图表配置的函数
const createChartOption = () => {
  const processedSeries = processStackedBarData(barChartData.value);
  
  return {
    backgroundColor: 'white',
    title: {
      text: '业务数据统计分析',
      left: 'center',
      textStyle: {
        color: 'black'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      top: 'bottom',
      textStyle: {
        color: 'black'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: barChartData.value.categories || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: processedSeries
  };
};

// 调整图表大小的函数（带动画效果）
const handleResize = () => {
  if (myChart.value) {
    // 清除之前的定时器
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    
    // 延迟300ms后执行resize，带动画效果
    resizeTimer = setTimeout(() => {
      if (myChart.value) {
        myChart.value.resize({
          width: 'auto',
          height: 'auto',
          animation: {
            duration: 800,
            easing: 'cubicOut'
          }
        });
        console.log('堆叠柱状图尺寸已调整');
      }
    }, 300);
  }
};

// 获取堆叠柱状图数据
const fetchBarChartData = async () => {
  try {
    loading.value = true;
    const data = await getBarChartData();
    barChartData.value = data;
    console.log('堆叠柱状图数据获取成功:', data);
  } catch (error) {
    console.error('获取堆叠柱状图数据失败:', error);
    // 使用空数据作为备用
    barChartData.value = { series: [], categories: [] };
  } finally {
    loading.value = false;
  }
};

// 在组件挂载后初始化ECharts
onMounted(async () => {
  try {
    // 先获取数据
    await fetchBarChartData();
    
    // 等待DOM完全渲染
    await nextTick();
    
    if (!chartRef.value) {
      console.error('堆叠柱状图容器元素不存在');
      return;
    }
    
    const chartDom = chartRef.value;
    
    // 确保容器有尺寸
    console.log('堆叠柱状图容器尺寸:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
    
    if (chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
      console.warn('堆叠柱状图容器尺寸为0，延迟初始化');
      setTimeout(() => {
        initChart();
      }, 100);
      return;
    }
    
    initChart();
  } catch (error) {
    console.error('堆叠柱状图初始化失败:', error);
  }
});

// 初始化图表
const initChart = () => {
  const chartDom = chartRef.value;
  if (!chartDom) return;
  
  myChart.value = echarts.init(chartDom);
  
  // 使用动态生成的配置
  const option = createChartOption();
  if (option) {
    myChart.value.setOption(option);
    console.log('堆叠柱状图配置设置完成');
  }
  
  // 设置事件监听器
  setupEventListeners();
};

// 设置事件监听器
const setupEventListeners = () => {
  const chartDom = chartRef.value;
  if (!chartDom) return;
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize);
  
  // 使用ResizeObserver监听图表容器大小变化
  const resizeObserver = new ResizeObserver(() => {
    handleResize();
  });
  
  resizeObserver.observe(chartDom);
  
  // 添加MutationObserver来监听侧边栏展开/收起时的DOM变化
  const observeParentChanges = () => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const observer = new MutationObserver(() => {
        handleResize();
      });
      
      observer.observe(mainContent, {
        attributes: true,
        attributeFilter: ['style', 'class']
      });
      
      window.__barChartObserver = observer;
    }
  };
  
  observeParentChanges();
  
  window.__barResizeObserver = resizeObserver;
};

// 组件卸载时清理资源
onUnmounted(() => {
  if (myChart.value) {
    myChart.value.dispose();
    myChart.value = null;
  }
  
  // 清理事件监听器
  window.removeEventListener('resize', handleResize);
  
  // 清理ResizeObserver
  if (window.__barResizeObserver) {
    window.__barResizeObserver.disconnect();
    window.__barResizeObserver = null;
  }
  
  // 清理MutationObserver
  if (window.__barChartObserver) {
    window.__barChartObserver.disconnect();
    window.__barChartObserver = null;
  }
  
  // 清理防抖定时器
  if (resizeTimer) {
    clearTimeout(resizeTimer);
    resizeTimer = null;
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 450px; /* 匹配其他图表容器高度 */
  background-color: white;
  box-sizing: border-box;
  padding: 15px; /* 增加内边距 */
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden; /* 防止内容溢出 */
}

/* 在大屏幕上调整内边距 */
@media (min-width: 1400px) {
  .chart-container {
    padding: 20px; /* 大屏幕上增加内边距 */
  }
}

.chart-content {
  width: 100%;
  height: 100%;
  min-height: 350px;
  max-width: 100%; /* 确保不超出容器宽度 */
  max-height: 100%; /* 确保不超出容器高度 */
}

.loading-container {
  width: 100%;
  height: 100%;
  min-height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-text {
  color: #666;
  font-size: 16px;
}
</style>