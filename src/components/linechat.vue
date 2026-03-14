<template>
  <div class="chart-container">
    <!-- ECharts容器 -->
    <div ref="chartRef" class="chart-content"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts';
import { onMounted, onUnmounted, ref, nextTick, watch } from 'vue';

// 接收父组件传递的数据
const props = defineProps({
  chartData: {
    type: Array,
    default: () => []
  },
  dataType: {
    type: String,
    default: 'salesTrend'
  }
});

// 使用ref来管理图表实例和DOM引用
const myChart = ref(null);
const chartRef = ref(null);

// 防抖定时器
let resizeTimer = null;

// 数据类型配置
const dataTypeConfig = {
  salesTrend: {
    title: '销售趋势',
    color: '#007bff',
    valueKey: 'amount',
    unit: '元'
  },
  userGrowth: {
    title: '用户增长',
    color: '#28a745',
    valueKey: 'count',
    unit: '人'
  },
  orderTrend: {
    title: '订单趋势',
    color: '#ffc107',
    valueKey: 'count',
    unit: '单'
  },
  trafficTrend: {
    title: '流量趋势',
    color: '#dc3545',
    valueKey: 'pv',
    unit: 'PV'
  }
};

// 处理图表数据
const processChartData = () => {
  console.log('processChartData - props.chartData:', props.chartData);
  console.log('processChartData - props.dataType:', props.dataType);
  
  if (!props.chartData || props.chartData.length === 0) {
    console.log('processChartData - 数据为空');
    return {
      xAxisData: [],
      seriesData: [],
      title: '暂无数据'
    };
  }

  const config = dataTypeConfig[props.dataType] || dataTypeConfig.salesTrend;
  const xAxisData = props.chartData.map(item => item.month);
  const seriesData = props.chartData.map(item => item[config.valueKey]);

  console.log('processChartData - 处理后的数据:', {
    xAxisData,
    seriesData,
    title: config.title,
    color: config.color,
    unit: config.unit
  });

  return {
    xAxisData,
    seriesData,
    title: config.title,
    color: config.color,
    unit: config.unit
  };
};

// 调整图表大小的函数（带动画效果）
const handleResize = () => {
  if (myChart.value) {
    // 清除之前的定时器
    if (resizeTimer) {
      clearTimeout(resizeTimer);
    }
    
    // 延迟0.3秒后执行resize，带动画效果
    resizeTimer = setTimeout(() => {
      if (myChart.value) {
        // 强制重新计算并重绘图表，确保整体缩放
        myChart.value.resize({
          width: 'auto',
          height: 'auto',
          animation: {
            duration: 2000,
            easing: 'cubicOut'
          }
        });
        // 重新设置option以确保grid重新计算
        myChart.value.setOption(myChart.value.getOption(), {
          notMerge: false,
          lazyUpdate: false
        });
      }
    }, 300); // 延迟0.3秒
  }
};

// 在组件挂载后初始化ECharts
onMounted(async () => {
  try {
    // 等待DOM完全渲染
    await nextTick();
    
    if (!chartRef.value) {
      console.error('ECharts容器元素不存在');
      return;
    }
    
    const chartDom = chartRef.value;
    
    // 确保容器有尺寸
    console.log('容器尺寸:', chartDom.offsetWidth, 'x', chartDom.offsetHeight);
    
    if (chartDom.offsetWidth === 0 || chartDom.offsetHeight === 0) {
      console.warn('容器尺寸为0，延迟初始化');
      setTimeout(() => {
        initChart();
      }, 100);
      return;
    }
    
    // 初始化图表实例，但不立即设置数据
    myChart.value = echarts.init(chartDom);
    console.log('ECharts实例初始化完成');
    
    // 如果已经有数据，立即更新图表
    if (props.chartData && props.chartData.length > 0) {
      updateChart();
    }
    
    // 设置事件监听器
    setupEventListeners();
  } catch (error) {
    console.error('ECharts初始化失败:', error);
  }
});

// 初始化图表的函数（兼容旧的调用方式）
const initChart = () => {
  const chartDom = chartRef.value;
  if (!chartDom) return;
  
  if (!myChart.value) {
    myChart.value = echarts.init(chartDom);
  }
  
  if (props.chartData && props.chartData.length > 0) {
    updateChart();
  }
  
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
      
      window.__chartObserver = observer;
    }
  };
  
  observeParentChanges();
  
  // 为侧边栏切换按钮添加事件监听
  const toggleButtons = document.querySelectorAll('.sidebar-toggle');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      handleResize();
    });
  });
  
  window.__chartResizeObserver = resizeObserver;
};

// 更新图表数据
const updateChart = () => {
  console.log('updateChart - myChart.value:', myChart.value);
  if (!myChart.value) {
    console.log('updateChart - 图表实例不存在');
    return;
  }
  
  const chartData = processChartData();
  console.log('updateChart - 准备设置图表配置:', chartData);
  
  const option = {
    title: {
      text: chartData.title,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '15%',
      bottom: '3%',
      containLabel: true
    },
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function (params) {
        const point = params[0];
        return `${point.axisValue}<br/>${point.seriesName}: ${point.value}${chartData.unit}`;
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.xAxisData,
      axisLabel: {
        formatter: function (value) {
          return value.substring(5); // 只显示月份部分，如 "01"
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value) {
          return value + chartData.unit;
        }
      }
    },
    series: [{
      name: chartData.title,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: {
        width: 3,
        color: chartData.color
      },
      itemStyle: {
        color: chartData.color
      },
      areaStyle: {
        opacity: 0.3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: chartData.color + '80' },
          { offset: 1, color: chartData.color + '20' }
        ])
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          shadowBlur: 10,
          shadowColor: chartData.color
        }
      },
      data: chartData.seriesData
    }]
  };

  myChart.value.setOption(option, true);
  
  // 初始加载后强制调整图表大小，确保正确适应容器
  setTimeout(() => {
    if (myChart.value) {
      myChart.value.resize();
    }
  }, 100);
};

// 监听数据变化，更新图表
watch(() => [props.chartData, props.dataType], (newVal, oldVal) => {
  console.log('watch - 数据变化:', {
    newChartData: newVal[0],
    newDataType: newVal[1],
    oldChartData: oldVal?.[0],
    oldDataType: oldVal?.[1]
  });
  
  if (myChart.value) {
    console.log('watch - 调用updateChart');
    updateChart();
  } else {
    console.log('watch - 图表实例不存在，等待初始化');
  }
}, { deep: true, immediate: true });

// 组件卸载时清理资源
onUnmounted(() => {
  if (myChart.value) {
    myChart.value.dispose();
    myChart.value = null;
  }
  
  // 清理事件监听器
  window.removeEventListener('resize', handleResize);
  
  // 清理ResizeObserver
  if (window.__chartResizeObserver) {
    window.__chartResizeObserver.disconnect();
    window.__chartResizeObserver = null;
  }
  
  // 清理MutationObserver
  if (window.__chartObserver) {
    window.__chartObserver.disconnect();
    window.__chartObserver = null;
  }
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
  background-color: #f8f9fa;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* 移除transition，让图表自己控制动画 */
}

.chart-content {
  width: 100%;
  height: 100%;
  min-height: 400px;
}
</style>