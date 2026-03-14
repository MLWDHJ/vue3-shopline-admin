<template>
  <div class="home-container">
    <div class="data-selector">
      <div 
        v-for="(value, key) in filteredTrends" 
        :key="key" 
        class="datachoose"
        :class="{ active: selectedDataType === key }"
        @click="selectDataType(key)"
      >
        <h3>{{ getDisplayName(key) }}</h3>
      </div>
    </div>
    <!-- 图表插槽 -->
    <slot name="chart">
      <!-- 默认内容，如果没有传入插槽内容则显示 -->
      <LineChart :chart-data="currentChartData" :data-type="selectedDataType" />
    </slot>
    <div class="threechat">
      <div class="chatone">
        <LeidaChat />
      </div>
      <div class="chattwo">
        <NightingaleChart />
      </div>
      <div class="chatthree">
        <BarChart />
      </div>
    </div>
  </div>
</template>

<script setup>
import LineChart from '@/components/linechat.vue';
import LeidaChat from '@/components/leidachat.vue';
import NightingaleChart from '@/components/Nightingalechart.vue';
import BarChart from '@/components/barchart.vue';
import { onMounted, ref, computed } from 'vue';
import { getAllTrends, TREND_TYPES } from '@/api/mock';

// 定义响应式数据
const trends = ref({});
const selectedDataType = ref(TREND_TYPES.SALES); // 默认选择第一个
const currentChartData = ref([]);

// 数据类型显示名称映射 - 使用配置常量
const dataTypeNames = {
  [TREND_TYPES.SALES]: '销售趋势',
  [TREND_TYPES.USER_GROWTH]: '用户增长',
  [TREND_TYPES.ORDER]: '订单趋势',
  [TREND_TYPES.TRAFFIC]: '流量趋势'
};

// 允许显示的趋势数据类型（用于过滤）
const allowedTrendTypes = Object.values(TREND_TYPES);

// 过滤后的趋势数据 - 只显示允许的类型
const filteredTrends = computed(() => {
  const filtered = {};
  Object.keys(trends.value).forEach(key => {
    if (allowedTrendTypes.includes(key)) {
      filtered[key] = trends.value[key];
    }
  });
  return filtered;
});

// 获取显示名称
const getDisplayName = (key) => {
  return dataTypeNames[key] || key;
};

// 选择数据类型
const selectDataType = (dataType) => {
  selectedDataType.value = dataType;
  updateChartData();
};

// 更新图表数据
const updateChartData = () => {
  console.log('updateChartData - selectedDataType:', selectedDataType.value);
  console.log('updateChartData - trends.value:', trends.value);
  
  if (trends.value[selectedDataType.value]) {
    currentChartData.value = trends.value[selectedDataType.value];
    console.log('updateChartData - 设置的图表数据:', currentChartData.value);
  } else {
    console.log('updateChartData - 未找到对应数据');
  }
};

// 在组件挂载后获取数据
onMounted(async () => {
  try {
    const data = await getAllTrends();
    trends.value = data;
    
    // 设置默认数据为第一个数据类型
    updateChartData();
    
    console.log('获取到的趋势数据:', data);
    console.log('过滤后的数据类型:', Object.keys(filteredTrends.value));
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});
</script>

<style scoped>
.home-container {
  width: 100%;
  height: auto;
  padding: 20px 32px; /* 增加上下内边距 */
  max-width: 1600px; /* 增加最大宽度 */
  margin: 0 auto; /* 居中显示 */
  box-sizing: border-box;
}

/* 当侧边栏收起时，允许容器使用更多宽度 */
@media (min-width: 1200px) {
  .home-container {
    max-width: 1800px; /* 在大屏幕上允许更宽 */
    padding: 20px 40px; /* 增加左右内边距 */
  }
}
.data-selector {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
  margin:20px 0 20px 0;
  flex-wrap: wrap;
}

.datachoose {
  width: 300px;
  height: 108px;
  background: #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.datachoose:hover {
  background: #dee2e6;
}

.datachoose.active {
  background: #007bff;
  color: white;
}

.datachoose.active h3 {
  color: white;
}

.datachoose h3 {
  margin: 0;
  font-size: 14px;
  color: #495057;
}

.threechat {
  display: flex;
  gap: 30px; /* 增加间距 */
  margin-top: 30px; /* 增加上边距 */
  flex-wrap: wrap;
  justify-content: flex-start; /* 左对齐，但给图表三留更多空间 */
}

/* 在宽屏下调整间距 */
@media (min-width: 1400px) {
  .threechat {
    gap: 40px; /* 大屏幕上增加间距 */
    justify-content: space-between; /* 两端对齐 */
  }
}

/* 单独调整图表三的位置 */
.chatthree {
  margin-left: 20px; /* 给图表三增加左边距，向右移动 */
}

/* 在大屏幕上进一步调整图表三位置 */
@media (min-width: 1400px) {
  .chatthree {
    margin-left: auto; /* 大屏幕上将图表三推到最右侧 */
  }
}

.chatone, .chattwo, .chatthree {
  flex: 1;
  min-width: 380px; /* 进一步增加最小宽度 */
  min-height: 450px; /* 增加最小高度 */
  max-width: 550px; /* 增加最大宽度限制 */
}

/* 在大屏幕上允许图表容器更宽 */
@media (min-width: 1400px) {
  .chatone, .chattwo, .chatthree {
    max-width: 600px; /* 大屏幕上允许更宽 */
  }
}

@media (min-width: 1600px) {
  .chatone, .chattwo, .chatthree {
    max-width: 650px; /* 超大屏幕上允许更宽 */
  }
}

/* 所有图表容器现在都有内容，移除占位符样式 */
</style>
