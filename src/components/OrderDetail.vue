<template>
  <div v-if="visible" class="detail-overlay" @click="handleClose">
    <div class="detail-sidebar" @click.stop>
      <div class="detail-header">
        <h3>订单详情</h3>
        <button @click="handleClose" class="close-btn">&times;</button>
      </div>
      
      <div class="detail-body">
        <!-- 订单基本信息 -->
        <div class="info-section">
          <h4>订单信息</h4>
          <div class="info-row">
            <span class="label">订单号：</span>
            <span class="value">{{ order.orderNumber }}</span>
          </div>
          <div class="info-row">
            <span class="label">下单时间：</span>
            <span class="value">{{ formatDate(order.createTime) }}</span>
          </div>
          <div class="info-row">
            <span class="label">订单状态：</span>
            <span :class="['status-badge', `status-${order.status}`]">
              {{ getStatusName(order.status) }}
            </span>
          </div>
          <div class="info-row">
            <span class="label">订单金额：</span>
            <span class="value amount">¥{{ order.amount.toFixed(2) }}</span>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="info-section">
          <h4>商品信息</h4>
          <div class="products-list">
            <div v-for="item in order.items" :key="item.id" class="product-item">
              <img :src="item.image" alt="商品图片" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ item.name }}</div>
                <div class="product-meta">
                  <span>¥{{ item.price.toFixed(2) }}</span>
                  <span>×{{ item.quantity }}</span>
                </div>
              </div>
              <div class="product-total">
                ¥{{ (item.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>
        </div>

        <!-- 收货地址 -->
        <div class="info-section">
          <h4>收货地址</h4>
          <div class="address-info">
            <div class="info-row">
              <span class="label">收货人：</span>
              <span class="value">{{ order.shippingAddress.receiver }}</span>
            </div>
            <div class="info-row">
              <span class="label">联系电话：</span>
              <span class="value">{{ order.shippingAddress.phone }}</span>
            </div>
            <div class="info-row">
              <span class="label">收货地址：</span>
              <span class="value">{{ order.shippingAddress.address }}</span>
            </div>
          </div>
        </div>

        <!-- 用户信息 -->
        <div class="info-section">
          <h4>用户信息</h4>
          <div class="info-row">
            <span class="label">用户名：</span>
            <span class="value">{{ order.userName }}</span>
          </div>
          <div class="info-row">
            <span class="label">用户ID：</span>
            <span class="value">{{ order.userId }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-footer">
        <button 
          @click="handleStatusChange('shipped')" 
          class="btn btn-primary"
          v-if="order.status === 'paid'"
        >
          标记为已发货
        </button>
        <button 
          @click="handleStatusChange('completed')" 
          class="btn btn-success"
          v-if="order.status === 'shipped'"
        >
          标记为已完成
        </button>
        <button 
          @click="handleStatusChange('cancelled')" 
          class="btn btn-danger"
          v-if="order.status === 'pending' || order.status === 'paid'"
        >
          取消订单
        </button>
        <button @click="handleClose" class="btn btn-secondary">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    required: true
  }
});

// Emits
const emit = defineEmits(['close', 'update-status']);

// 方法
const handleClose = () => {
  emit('close');
};

const handleStatusChange = (newStatus) => {
  if (confirm(`确定要将订单状态改为"${getStatusName(newStatus)}"吗？`)) {
    emit('update-status', props.order.id, newStatus);
  }
};

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
</script>

<style scoped>
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.detail-sidebar {
  width: 500px;
  max-width: 90vw;
  background: white;
  height: 100vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.detail-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.detail-header h3 {
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
  background: #e9ecef;
  color: #333;
}

.detail-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.info-section:last-child {
  border-bottom: none;
}

.info-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.info-row {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.info-row .label {
  width: 80px;
  color: #666;
  font-size: 14px;
}

.info-row .value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.amount {
  color: #e74c3c;
  font-weight: 600;
  font-size: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
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

/* 商品列表样式 */
.products-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.product-meta {
  font-size: 12px;
  color: #666;
  display: flex;
  gap: 10px;
}

.product-total {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #e74c3c;
  font-size: 14px;
}

/* 地址信息 */
.address-info {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.detail-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
  background: #f8f9fa;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .detail-sidebar {
    width: 100vw;
  }
  
  .detail-footer {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
