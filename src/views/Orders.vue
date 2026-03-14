<template>
  <div class="orders-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>订单管理</h1>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-bar">
      <div class="filter-item">
        <label>时间范围：</label>
        <div class="date-range">
          <input 
            v-model="filterForm.startDate" 
            type="date" 
            class="filter-input"
          />
          <span class="date-separator">至</span>
          <input 
            v-model="filterForm.endDate" 
            type="date" 
            class="filter-input"
          />
        </div>
      </div>
      
      <div class="filter-item">
        <label>订单状态：</label>
        <select v-model="filterForm.status" class="filter-select">
          <option value="">全部状态</option>
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="shipped">已发货</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>
      
      <div class="filter-item">
        <label>最小金额：</label>
        <input 
          v-model.number="filterForm.minAmount" 
          type="number" 
          placeholder="0"
          class="filter-input amount-input"
        />
      </div>
      
      <div class="filter-actions">
        <button @click="handleFilter" class="btn btn-primary">筛选</button>
        <button @click="handleResetFilter" class="btn btn-secondary">重置</button>
      </div>
    </div>

    <!-- 订单表格 -->
    <div class="table-container">
      <table class="orders-table">
        <thead>
          <tr>
            <th>订单号</th>
            <th>用户</th>
            <th>金额</th>
            <th>状态</th>
            <th>下单时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td class="order-number">{{ order.orderNumber }}</td>
            <td>{{ order.userName }}</td>
            <td class="amount">¥{{ order.amount.toFixed(2) }}</td>
            <td>
              <span :class="['status-badge', `status-${order.status}`]">
                {{ getStatusName(order.status) }}
              </span>
            </td>
            <td>{{ formatDate(order.createTime) }}</td>
            <td class="actions">
              <button @click="handleViewDetail(order)" class="btn btn-sm btn-info">
                查看详情
              </button>
              <button 
                @click="handleChangeStatus(order)" 
                class="btn btn-sm btn-primary"
                :disabled="order.status === 'completed' || order.status === 'cancelled'"
              >
                修改状态
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <p>暂无订单数据</p>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button 
        @click="currentPage--" 
        :disabled="currentPage <= 1"
        class="btn btn-secondary"
      >
        上一页
      </button>
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页，总计 {{ totalItems }} 条
      </span>
      <button 
        @click="currentPage++" 
        :disabled="currentPage >= totalPages"
        class="btn btn-secondary"
      >
        下一页
      </button>
    </div>

    <!-- 订单详情侧边弹窗 -->
    <OrderDetail
      v-if="showDetail"
      :visible="showDetail"
      :order="currentOrder"
      @close="handleCloseDetail"
      @update-status="handleUpdateStatus"
    />

    <!-- 修改状态对话框 -->
    <div v-if="showStatusDialog" class="modal-overlay" @click="showStatusDialog = false">
      <div class="modal-content status-dialog" @click.stop>
        <div class="modal-header">
          <h3>修改订单状态</h3>
          <button @click="showStatusDialog = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>选择新状态：</label>
            <select v-model="newStatus" class="form-select">
              <option value="pending">待支付</option>
              <option value="paid">已支付</option>
              <option value="shipped">已发货</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="showStatusDialog = false" class="btn btn-secondary">取消</button>
          <button @click="confirmStatusChange" class="btn btn-primary">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import OrderDetail from '@/components/OrderDetail.vue';
import { getOrders, updateOrderStatus } from '@/api/mock';

// 响应式数据
const orders = ref([]);
const loading = ref(false);
const showDetail = ref(false);
const showStatusDialog = ref(false);
const currentOrder = ref(null);
const newStatus = ref('');

// 筛选表单
const filterForm = ref({
  startDate: '',
  endDate: '',
  status: '',
  minAmount: ''
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性
const filteredOrders = computed(() => {
  let filtered = orders.value;
  
  // 时间范围筛选
  if (filterForm.value.startDate) {
    filtered = filtered.filter(o => 
      new Date(o.createTime) >= new Date(filterForm.value.startDate)
    );
  }
  if (filterForm.value.endDate) {
    filtered = filtered.filter(o => 
      new Date(o.createTime) <= new Date(filterForm.value.endDate + 'T23:59:59')
    );
  }
  
  // 状态筛选
  if (filterForm.value.status) {
    filtered = filtered.filter(o => o.status === filterForm.value.status);
  }
  
  // 最小金额筛选
  if (filterForm.value.minAmount) {
    filtered = filtered.filter(o => o.amount >= filterForm.value.minAmount);
  }
  
  return filtered;
});

const totalItems = computed(() => filteredOrders.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 方法
const getStatusName = (status) => {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const handleFilter = () => {
  currentPage.value = 1;
  console.log('筛选条件:', filterForm.value);
};

const handleResetFilter = () => {
  filterForm.value = {
    startDate: '',
    endDate: '',
    status: '',
    minAmount: ''
  };
  currentPage.value = 1;
};

const handleViewDetail = (order) => {
  currentOrder.value = order;
  showDetail.value = true;
};

const handleCloseDetail = () => {
  showDetail.value = false;
  currentOrder.value = null;
};

const handleChangeStatus = (order) => {
  currentOrder.value = order;
  newStatus.value = order.status;
  showStatusDialog.value = true;
};

const confirmStatusChange = async () => {
  try {
    await updateOrderStatus(currentOrder.value.id, newStatus.value);
    await fetchOrders();
    showStatusDialog.value = false;
    alert('状态更新成功');
  } catch (error) {
    console.error('更新状态失败:', error);
    alert('更新状态失败');
  }
};

const handleUpdateStatus = async (orderId, status) => {
  try {
    await updateOrderStatus(orderId, status);
    await fetchOrders();
    handleCloseDetail();
    alert('状态更新成功');
  } catch (error) {
    console.error('更新状态失败:', error);
    alert('更新状态失败');
  }
};

const fetchOrders = async () => {
  try {
    loading.value = true;
    const data = await getOrders();
    orders.value = data;
  } catch (error) {
    console.error('获取订单列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 生命周期
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.orders-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}

/* 筛选条样式 */
.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.filter-input, .filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  color: #666;
}

.amount-input {
  width: 120px;
}

.filter-actions {
  display: flex;
  gap: 10px;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 表格样式 */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.orders-table tr:hover {
  background: #f8f9fa;
}

.order-number {
  font-family: monospace;
  color: #007bff;
  font-weight: 500;
}

.amount {
  font-weight: 600;
  color: #e74c3c;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-paid {
  background: #d1ecf1;
  color: #0c5460;
}

.status-shipped {
  background: #cce5ff;
  color: #004085;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.page-info {
  color: #666;
  font-size: 14px;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.status-dialog {
  width: 400px;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .filter-actions {
    justify-content: center;
  }
  
  .orders-table {
    font-size: 12px;
  }
  
  .orders-table th,
  .orders-table td {
    padding: 8px 4px;
  }
}
</style>
