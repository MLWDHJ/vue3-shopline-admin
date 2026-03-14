<template>
  <div class="products-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>商品管理</h1>
    </div>

    <!-- 搜索条 -->
    <div class="search-bar">
      <div class="search-item">
        <label>商品名称：</label>
        <input 
          v-model="searchForm.name" 
          type="text" 
          placeholder="请输入商品名称"
          class="search-input"
        />
      </div>
      
      <div class="search-item">
        <label>商品类目：</label>
        <select v-model="searchForm.category" class="search-select">
          <option value="">全部类目</option>
          <option value="electronics">电子产品</option>
          <option value="clothing">服装</option>
          <option value="books">图书</option>
          <option value="home">家居用品</option>
        </select>
      </div>
      
      <div class="search-item">
        <label>价格区间：</label>
        <div class="price-range">
          <input 
            v-model="searchForm.priceMin" 
            type="number" 
            placeholder="最低价"
            class="search-input price-input"
          />
          <span class="price-separator">-</span>
          <input 
            v-model="searchForm.priceMax" 
            type="number" 
            placeholder="最高价"
            class="search-input price-input"
          />
        </div>
      </div>
      
      <div class="search-item">
        <label>商品状态：</label>
        <select v-model="searchForm.status" class="search-select">
          <option value="">全部状态</option>
          <option value="active">上架</option>
          <option value="inactive">下架</option>
          <option value="draft">草稿</option>
        </select>
      </div>
      
      <div class="search-actions">
        <button @click="handleSearch" class="btn btn-primary">搜索</button>
        <button @click="handleReset" class="btn btn-secondary">重置</button>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="action-bar">
      <button @click="handleAdd" class="btn btn-success">
        <span class="btn-icon">+</span>
        新增商品
      </button>
    </div>

    <!-- 商品表格 -->
    <div class="table-container">
      <table class="products-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>图片</th>
            <th>商品名称</th>
            <th>类目</th>
            <th>价格</th>
            <th>库存</th>
            <th>销量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in filteredProducts" :key="product.id">
            <td>{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td>
              <img 
                :src="product.image || '/placeholder-image.jpg'" 
                alt="商品图片"
                class="product-image"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ getCategoryName(product.category) }}</td>
            <td class="price">¥{{ product.price.toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ product.sales }}</td>
            <td>
              <span :class="['status-badge', `status-${product.status}`]">
                {{ getStatusName(product.status) }}
              </span>
            </td>
            <td class="actions">
              <button @click="handleEdit(product)" class="btn btn-sm btn-primary">编辑</button>
              <button @click="handleDelete(product)" class="btn btn-sm btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 空状态 -->
      <div v-if="filteredProducts.length === 0" class="empty-state">
        <p>暂无商品数据</p>
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

    <!-- 商品表单弹窗 -->
    <ProductForm
      v-if="showForm"
      :visible="showForm"
      :product="currentProduct"
      :mode="formMode"
      @close="handleFormClose"
      @submit="handleFormSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ProductForm from '@/components/ProductForm.vue';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/mock';

// 响应式数据
const products = ref([]);
const loading = ref(false);
const showForm = ref(false);
const currentProduct = ref(null);
const formMode = ref('add'); // 'add' | 'edit'

// 搜索表单
const searchForm = ref({
  name: '',
  category: '',
  priceMin: '',
  priceMax: '',
  status: ''
});

// 分页
const currentPage = ref(1);
const pageSize = ref(10);

// 计算属性
const filteredProducts = computed(() => {
  let filtered = products.value;
  
  // 名称搜索
  if (searchForm.value.name) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchForm.value.name.toLowerCase())
    );
  }
  
  // 类目筛选
  if (searchForm.value.category) {
    filtered = filtered.filter(p => p.category === searchForm.value.category);
  }
  
  // 价格区间筛选
  if (searchForm.value.priceMin) {
    filtered = filtered.filter(p => p.price >= Number(searchForm.value.priceMin));
  }
  if (searchForm.value.priceMax) {
    filtered = filtered.filter(p => p.price <= Number(searchForm.value.priceMax));
  }
  
  // 状态筛选
  if (searchForm.value.status) {
    filtered = filtered.filter(p => p.status === searchForm.value.status);
  }
  
  return filtered;
});

const totalItems = computed(() => filteredProducts.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

// 方法
const getCategoryName = (category) => {
  const categoryMap = {
    electronics: '电子产品',
    clothing: '服装',
    books: '图书',
    home: '家居用品'
  };
  return categoryMap[category] || category;
};

const getStatusName = (status) => {
  const statusMap = {
    active: '上架',
    inactive: '下架',
    draft: '草稿'
  };
  return statusMap[status] || status;
};

const handleSearch = () => {
  currentPage.value = 1;
  console.log('搜索条件:', searchForm.value);
};

const handleReset = () => {
  searchForm.value = {
    name: '',
    category: '',
    priceMin: '',
    priceMax: '',
    status: ''
  };
  currentPage.value = 1;
};

const handleAdd = () => {
  currentProduct.value = null;
  formMode.value = 'add';
  showForm.value = true;
};

const handleEdit = (product) => {
  currentProduct.value = { ...product };
  formMode.value = 'edit';
  showForm.value = true;
};

const handleDelete = async (product) => {
  if (confirm(`确定要删除商品"${product.name}"吗？`)) {
    try {
      await deleteProduct(product.id);
      await fetchProducts();
      alert('删除成功');
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败');
    }
  }
};

const handleFormClose = () => {
  showForm.value = false;
  currentProduct.value = null;
};

const handleFormSubmit = async (productData) => {
  try {
    if (formMode.value === 'add') {
      await createProduct(productData);
      alert('新增成功');
    } else {
      await updateProduct(currentProduct.value.id, productData);
      alert('更新成功');
    }
    
    await fetchProducts();
    handleFormClose();
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存失败');
  }
};

const fetchProducts = async () => {
  try {
    loading.value = true;
    const data = await getProducts();
    products.value = data;
  } catch (error) {
    console.error('获取商品列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 生命周期
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.products-container {
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
  min-width: 120px;
}

.price-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.price-input {
  width: 80px;
  min-width: 80px;
  flex-shrink: 0;
}

.price-separator {
  color: #666;
  font-weight: 500;
}

.search-actions {
  display: flex;
  gap: 10px;
}

/* 操作区样式 */
.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-end;
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

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #545b62;
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

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  font-weight: bold;
}

/* 表格样式 */
.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.products-table {
  width: 100%;
  border-collapse: collapse;
}

.products-table th,
.products-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.products-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.products-table tr:hover {
  background: #f8f9fa;
}

.product-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.price {
  font-weight: 600;
  color: #e74c3c;
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

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-draft {
  background: #fff3cd;
  color: #856404;
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
  
  .products-table {
    font-size: 12px;
  }
  
  .products-table th,
  .products-table td {
    padding: 8px 4px;
  }
}
</style>
