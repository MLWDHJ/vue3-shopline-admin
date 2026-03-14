<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ mode === 'add' ? '新增商品' : '编辑商品' }}</h3>
        <button @click="handleClose" class="close-btn">&times;</button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="form-label">商品名称 <span class="required">*</span></label>
            <input
              v-model="formData.name"
              type="text"
              class="form-input"
              placeholder="请输入商品名称"
              required
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">商品类目 <span class="required">*</span></label>
            <select v-model="formData.category" class="form-select" required>
              <option value="">请选择类目</option>
              <option value="electronics">电子产品</option>
              <option value="clothing">服装</option>
              <option value="books">图书</option>
              <option value="home">家居用品</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">商品价格 <span class="required">*</span></label>
              <input
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                class="form-input"
                placeholder="0.00"
                required
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">库存数量 <span class="required">*</span></label>
              <input
                v-model.number="formData.stock"
                type="number"
                min="0"
                class="form-input"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">商品状态</label>
            <select v-model="formData.status" class="form-select">
              <option value="active">上架</option>
              <option value="inactive">下架</option>
              <option value="draft">草稿</option>
            </select>
          </div>
          
          <div class="form-group">
            <label class="form-label">商品图片</label>
            <div class="image-upload">
              <div v-if="formData.image" class="image-preview">
                <img :src="formData.image" alt="商品图片" />
                <button type="button" @click="removeImage" class="remove-image-btn">
                  &times;
                </button>
              </div>
              <div v-else class="upload-placeholder">
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="file-input"
                />
                <div class="upload-text">
                  <div class="upload-icon">📷</div>
                  <p>点击上传图片</p>
                  <p class="upload-tip">支持 JPG、PNG 格式</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">商品描述</label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              placeholder="请输入商品描述"
              rows="4"
            ></textarea>
          </div>
        </form>
      </div>
      
      <div class="modal-footer">
        <button type="button" @click="handleClose" class="btn btn-secondary">
          取消
        </button>
        <button type="button" @click="handleSubmit" class="btn btn-primary">
          {{ mode === 'add' ? '新增' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'add' // 'add' | 'edit'
  }
});

// Emits
const emit = defineEmits(['close', 'submit']);

// 响应式数据
const fileInput = ref(null);
const formData = ref({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  status: 'active',
  image: '',
  description: ''
});

// 监听product变化，初始化表单数据
watch(() => props.product, (newProduct) => {
  if (newProduct) {
    formData.value = {
      name: newProduct.name || '',
      category: newProduct.category || '',
      price: newProduct.price || 0,
      stock: newProduct.stock || 0,
      status: newProduct.status || 'active',
      image: newProduct.image || '',
      description: newProduct.description || ''
    };
  } else {
    // 重置表单
    formData.value = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      status: 'active',
      image: '',
      description: ''
    };
  }
}, { immediate: true });

// 方法
const handleClose = () => {
  emit('close');
};

const handleOverlayClick = () => {
  handleClose();
};

const handleSubmit = () => {
  // 表单验证
  if (!formData.value.name.trim()) {
    alert('请输入商品名称');
    return;
  }
  
  if (!formData.value.category) {
    alert('请选择商品类目');
    return;
  }
  
  if (formData.value.price <= 0) {
    alert('请输入有效的商品价格');
    return;
  }
  
  if (formData.value.stock < 0) {
    alert('库存数量不能为负数');
    return;
  }
  
  // 提交表单数据
  const submitData = {
    ...formData.value,
    sales: props.product?.sales || 0, // 保持原有销量或设为0
    id: props.product?.id // 编辑时保持原有ID
  };
  
  emit('submit', submitData);
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件');
      return;
    }
    
    // 验证文件大小（限制为2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB');
      return;
    }
    
    // 创建预览URL
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.image = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.value.image = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};
</script>

<style scoped>
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
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* 图片上传样式 */
.image-upload {
  border: 2px dashed #ddd;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.image-upload:hover {
  border-color: #007bff;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}

.upload-placeholder {
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: background 0.3s;
}

.upload-placeholder:hover {
  background: #f8f9fa;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.upload-text {
  pointer-events: none;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-text p {
  margin: 5px 0;
  color: #666;
}

.upload-tip {
  font-size: 12px;
  color: #999;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 15px;
  }
}
</style>
