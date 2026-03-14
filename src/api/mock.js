// src/api/mock.js
import data from './mock.json'

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms))


export async function getBjAqiTrend() {
  await delay()
  return dataBJ
}

export async function getShAqiTrend() {
  await delay()
  return dataSH
}

export async function getGzAqiTrend() {
  await delay()
  return dataGZ
}
export async function getSalesTrend() {
  await delay()
  return data.trendData.salesTrend
}

export async function getUserGrowth() {
  await delay()
  return data.trendData.userGrowth
}

export async function getOrderTrend() {
  await delay()
  return data.trendData.orderTrend
}

export async function getTrafficTrend() {
  await delay()
  return data.trendData.trafficTrend
}

// 获取所有趋势数据（用于Home.vue的点击块）
export async function getAllTrends() {
  await delay()
  return data.trendData
}

// 获取完整数据（包含所有类型的数据）
export async function getAllData() {
  await delay()
  return data
}

// 获取雷达图数据
export async function getRadarData() {
  await delay()
  return data.radarData
}

// 获取特定业务类型的雷达图数据
export async function getRadarDataByType(type) {
  await delay()
  if (data.radarData && data.radarData[type]) {
    return data.radarData[type]
  }
  throw new Error(`Radar data for type "${type}" not found`)
}

// 获取南丁格尔玫瑰图数据
export async function getNightingaleData() {
  await delay()
  return data.nightingaleData
}

// 获取堆叠柱状图数据
export async function getBarChartData() {
  await delay()
  return data.barChartData
}

// 商品管理相关API
// 获取商品列表
export async function getProducts() {
  await delay()
  return data.products
}

// 创建商品
export async function createProduct(productData) {
  await delay()
  const newProduct = {
    ...productData,
    id: Math.max(...data.products.map(p => p.id)) + 1,
    sales: 0 // 新商品销量为0
  }
  data.products.push(newProduct)
  return newProduct
}

// 更新商品
export async function updateProduct(id, productData) {
  await delay()
  const index = data.products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('商品不存在')
  }
  
  data.products[index] = {
    ...data.products[index],
    ...productData,
    id // 保持原有ID
  }
  return data.products[index]
}

// 删除商品
export async function deleteProduct(id) {
  await delay()
  const index = data.products.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('商品不存在')
  }
  
  const deletedProduct = data.products.splice(index, 1)[0]
  return deletedProduct
}

// 根据ID获取单个商品
export async function getProductById(id) {
  await delay()
  const product = data.products.find(p => p.id === id)
  if (!product) {
    throw new Error('商品不存在')
  }
  return product
}

// 订单管理相关API
// 获取订单列表
export async function getOrders() {
  await delay()
  return data.orders
}

// 根据ID获取单个订单
export async function getOrderById(id) {
  await delay()
  const order = data.orders.find(o => o.id === id)
  if (!order) {
    throw new Error('订单不存在')
  }
  return order
}

// 更新订单状态
export async function updateOrderStatus(id, status) {
  await delay()
  const index = data.orders.findIndex(o => o.id === id)
  if (index === -1) {
    throw new Error('订单不存在')
  }
  
  data.orders[index].status = status
  return data.orders[index]
}

// 用户管理相关API
// 获取用户列表
export async function getUsers() {
  await delay()
  return data.users
}

// 根据ID获取单个用户
export async function getUserById(id) {
  await delay()
  const user = data.users.find(u => u.id === id)
  if (!user) {
    throw new Error('用户不存在')
  }
  return user
}

// 更新用户状态
export async function updateUserStatus(id, status) {
  await delay()
  const index = data.users.findIndex(u => u.id === id)
  if (index === -1) {
    throw new Error('用户不存在')
  }
  
  data.users[index].status = status
  return data.users[index]
}

// 数据类型配置 - 用于扩展和管理不同类型的数据
export const DATA_TYPES = {
  TREND: 'trendData',
  RADAR: 'radarData',
  NIGHTINGALE: 'nightingaleData',
  BAR_CHART: 'barChartData'
}

// 趋势数据类型配置
export const TREND_TYPES = {
  SALES: 'salesTrend',
  USER_GROWTH: 'userGrowth', 
  ORDER: 'orderTrend',
  TRAFFIC: 'trafficTrend'
}

// 雷达数据类型配置
export const RADAR_TYPES = {
  DIGITAL: 'digital',
  BEAUTY: 'beauty',
  SERVICE: 'service'
}

// 获取特定类型的数据
export async function getDataByType(dataType, subType = null) {
  await delay()
  
  if (!data[dataType]) {
    throw new Error(`Data type "${dataType}" not found`)
  }
  
  if (subType) {
    if (!data[dataType][subType]) {
      throw new Error(`Sub type "${subType}" not found in "${dataType}"`)
    }
    return data[dataType][subType]
  }
  
  return data[dataType]
}
