<template>
  <div class="users-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>用户管理</h1>
    </div>

    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="search-item">
        <label>搜索：</label>
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="昵称或手机号"
          class="search-input"
          @keyup.enter="handleSearch"
        />
      </div>
      
      <div class="search-item">
        <label>用户等级：</label>
        <select v-model="filterLevel" class="search-select">
          <option value="">全部等级</option>
          <option value="1">普通会员</option>
          <option value="2">银牌会员</option>
          <option value="3">金牌会员</option>
          <option value="4">钻石会员</option>
        </select>
      </div>
      
      <div class="search-item">
        <label>账号状态：</label>
        <select v-model="filterStatus" class="search-select">
          <option value="">全部状态</option>
          <option value="active">正常</option>
          <option value="frozen">已冻结</option>
        </select>
      </div>
      
      <div class="search-actions">
        <button @click="handleSearch" class="btn btn-primary">搜索</button>
        <button @click="handleReset" class="btn btn-secondary">重置</button>
      </div>
    </div>

    <!-- 用户表格 -->
    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>昵称</th>
            <th>手机号</th>
            <th>等级</th>
            <th>状态</th>
            <th>注册时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <div class="user-info">
                <img 
                  :src="user.avatar || 'https://via.placeholder.com/40'" 
                  alt="用户头像"
                  class="user-avatar"
                />
                <span>{{ user.nickname }}</span>
              </div>
            </td>
            <td>{{ user.phone }}</td>
            <td>
              <span :class="['level-badge', `level-${user.level}`]">
                {{ getLevelName(user.level) }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', `status-${user.status}`]">
                {{ getStatusName(user.status) }}
              </span>
            </td>
            <td>{{ formatDate(user.registerTime) }}</td>
            <td class="actions">
              <button 
                v-if="user.status === 'active'"
                @click="handleToggleStatus(user, 'frozen')" 
                class="btn btn-sm btn-warning"
              >
                冻结
              </button>
              <button 
                v-else
                @click="handleToggleStatus(user, 'active')" 
                class="btn btn-sm btn-success"
              >
                解冻
              </button>
              <button @click="handleViewDetail(user)" class="btn btn-sm btn-info">
                查看详情
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>暂无用户数据</p>
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

    <!-- 用户详情对话框 -->
    <div v-if="showDetail" class="modal-overlay" @click="showDetail = false">
      <div class="modal-content user-detail" @click.stop>
        <div class="modal-header">
          <h3>用户详情</h3>
          <button @click="showDetail = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-section">
            <img 
              :src="currentUser.avatar || 'https://via.placeholder.com/100'" 
              alt="用户头像"
              class="detail-avatar"
            />
            <h4>{{ currentUser.nickname }}</h4>
          </div>
          
          <div class="detail-section">
            <div class="detail-row">
              <span class="label">用户ID：</span>
              <span class="value">{{ currentUser.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">手机号：</span>
              <span class="value">{{ currentUser.phone }}</span>
            </div>
            <div class="detail-row">
              <span class="label">邮箱：</span>
              <span class="value">{{ currentUser.email || '未设置' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">等级：</span>
              <span :class="['level-badge', `level-${currentUser.level}`]">
                {{ getLevelName(currentUser.level) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">状态：</span>
              <span :class="['status-badge', `status-${currentUser.status}`]">
                {{ getStatusName(currentUser.status) }}
              </span>
            </div>
            <div class="detail-row">
              <span class="label">注册时间：</span>
              <span class="value">{{ formatDate(currentUser.registerTime) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">累计消费：</span>
              <span class="value amount">¥{{ currentUser.totalSpent.toFixed(2) }}</span>
            </div>
            <div class="detail-row">
              <span class="label">订单数量：</span>
              <span class="value">{{ currentUser.orderCount }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button 
            v-if="currentUser.status === 'active'"
            @click="handleToggleStatus(currentUser, 'frozen')" 
            class="btn btn-warning"
          >
            冻结账号
          </button>
          <button 
            v-else
            @click="handleToggleStatus(currentUser, 'active')" 
            class="btn btn-success"
          >
            解冻账号
          </button>
          <button @click="showDetail = false" class="btn btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getUsers, updateUserStatus } from '@/api/mock';

// 响应式数据
const users = ref([]);
const loading = ref(false);
const showDetail = ref(false);
const currentUser = ref(null);

// 搜索和筛选
const searchKeyword = ref('');
const filterLevel = ref('');
const filterStatus = ref('');

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性
const filteredUsers = computed(() => {
  let filtered = users.value;
  
  // 关键词搜索（昵称或手机号）
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(u => 
      u.nickname.toLowerCase().includes(keyword) ||
      u.phone.includes(keyword)
    );
  }
  
  // 等级筛选
  if (filterLevel.value) {
    filtered = filtered.filter(u => u.level === Number(filterLevel.value));
  }
  
  // 状态筛选
  if (filterStatus.value) {
    filtered = filtered.filter(u => u.status === filterStatus.value);
  }
  
  return filtered;
});

const totalItems = computed(() => filteredUsers.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 方法
const getLevelName = (level) => {
  const levelMap = {
    1: '普通会员',
    2: '银牌会员',
    3: '金牌会员',
    4: '钻石会员'
  };
  return levelMap[level] || '普通会员';
};

const getStatusName = (status) => {
  const statusMap = {
    active: '正常',
    frozen: '已冻结'
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

const handleSearch = () => {
  currentPage.value = 1;
  console.log('搜索关键词:', searchKeyword.value);
};

const handleReset = () => {
  searchKeyword.value = '';
  filterLevel.value = '';
  filterStatus.value = '';
  currentPage.value = 1;
};

const handleToggleStatus = async (user, newStatus) => {
  const action = newStatus === 'frozen' ? '冻结' : '解冻';
  if (confirm(`确定要${action}用户"${user.nickname}"吗？`)) {
    try {
      await updateUserStatus(user.id, newStatus);
      await fetchUsers();
      alert(`${action}成功`);
      if (showDetail.value) {
        showDetail.value = false;
      }
    } catch (error) {
      console.error(`${action}失败:`, error);
      alert(`${action}失败`);
    }
  }
};

const handleViewDetail = (user) => {
  currentUser.value = user;
  showDetail.value = true;
};

const fetchUsers = async () => {
  try {
    loading.value = true;
    const data = await getUsers();
    users.value = data;
  } catch (error) {
    console.error('获取用户列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 生命周期
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.users-container {
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

/* 搜索条样式 */
.search-bar {
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

.search-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.search-item label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.search-input, .search-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 180px;
}

.search-actions {
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
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #545b62;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover {
  background: #1e7e34;
}

.btn-warning {
  background: #ffc107;
  color: #333;
}

.btn-warning:hover {
  background: #e0a800;
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

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.users-table tr:hover {
  background: #f8f9fa;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.level-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.level-1 {
  background: #e9ecef;
  color: #495057;
}

.level-2 {
  background: #d6d8db;
  color: #495057;
}

.level-3 {
  background: #ffd700;
  color: #856404;
}

.level-4 {
  background: #e0f2ff;
  color: #0c5460;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-frozen {
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

.user-detail {
  width: 500px;
  max-width: 90vw;
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

.detail-section {
  margin-bottom: 20px;
  text-align: center;
}

.detail-section h4 {
  margin: 10px 0;
  color: #333;
}

.detail-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f0f0f0;
}

.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  width: 100px;
  color: #666;
  font-size: 14px;
}

.detail-row .value {
  flex: 1;
  color: #333;
  font-size: 14px;
}

.amount {
  color: #e74c3c;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .search-actions {
    justify-content: center;
  }
  
  .users-table {
    font-size: 12px;
  }
  
  .users-table th,
  .users-table td {
    padding: 8px 4px;
  }
}
</style>
