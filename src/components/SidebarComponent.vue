<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/home" class="nav-link" active-class="active">
            <span class="nav-icon">🏠</span>
            <span class="nav-text">首页</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/products" class="nav-link" active-class="active">
            <span class="nav-icon">📦</span>
            <span class="nav-text">商品管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/orders" class="nav-link" active-class="active">
            <span class="nav-icon">📋</span>
            <span class="nav-text">订单管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/users" class="nav-link" active-class="active">
            <span class="nav-icon">👥</span>
            <span class="nav-text">用户管理</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            <span class="nav-icon">ℹ️</span>
            <span class="nav-text">关于我们</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>

</script>

<style scoped>
.sidebar {
  height: 100%;
  background: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: #34495e;
  color: #ecf0f1;
  border-left-color: #3498db;
}

.nav-link.active {
  background: #34495e;
  color: #3498db;
  border-left-color: #3498db;
}

.nav-icon {
  font-size: 18px;
  margin-right: 20px;
  margin-left: -5px;
  width: 20px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}
</style>