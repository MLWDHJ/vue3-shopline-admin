// 数据类型配置文件 - 用于管理和扩展不同类型的数据

// 主要数据类型
export const DATA_CATEGORIES = {
  TREND: 'trendData',      // 趋势数据
  RADAR: 'radarData',      // 雷达图数据
  CHART: 'chartData',      // 图表数据（预留）
  TABLE: 'tableData',      // 表格数据（预留）
  METRIC: 'metricData'     // 指标数据（预留）
}

// 趋势数据子类型
export const TREND_CATEGORIES = {
  SALES: 'salesTrend',
  USER_GROWTH: 'userGrowth',
  ORDER: 'orderTrend',
  TRAFFIC: 'trafficTrend'
}

// 雷达数据子类型
export const RADAR_CATEGORIES = {
  DIGITAL: 'digital',
  BEAUTY: 'beauty',
  SERVICE: 'service'
}

// 数据显示配置
export const DISPLAY_CONFIG = {
  // 趋势数据显示名称
  trendNames: {
    [TREND_CATEGORIES.SALES]: '销售趋势',
    [TREND_CATEGORIES.USER_GROWTH]: '用户增长',
    [TREND_CATEGORIES.ORDER]: '订单趋势',
    [TREND_CATEGORIES.TRAFFIC]: '流量趋势'
  },
  
  // 雷达数据显示名称
  radarNames: {
    [RADAR_CATEGORIES.DIGITAL]: '数字化业务',
    [RADAR_CATEGORIES.BEAUTY]: '美妆业务',
    [RADAR_CATEGORIES.SERVICE]: '服务业务'
  }
}

// 页面组件数据类型配置
export const PAGE_DATA_CONFIG = {
  // Home页面只显示趋势数据
  home: {
    allowedTypes: [DATA_CATEGORIES.TREND],
    allowedSubTypes: Object.values(TREND_CATEGORIES)
  },
  
  // 雷达图组件只使用雷达数据
  radar: {
    allowedTypes: [DATA_CATEGORIES.RADAR],
    allowedSubTypes: Object.values(RADAR_CATEGORIES)
  }
}

// 扩展示例：如果要添加新的数据类型
// 1. 在 DATA_CATEGORIES 中添加新类型
// 2. 创建对应的子类型常量
// 3. 在 DISPLAY_CONFIG 中添加显示名称
// 4. 在 PAGE_DATA_CONFIG 中配置哪些页面可以使用
// 5. 在 mock.json 中添加对应的数据结构
// 6. 在 mock.js 中添加对应的API函数
