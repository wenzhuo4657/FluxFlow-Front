<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Document, FolderOpened, List, Lightning } from '@element-plus/icons-vue'

const { t } = useI18n()
</script>

<template>
  <div class="preview-container">
    <div class="preview-header">
      <h1 class="preview-title">{{ t('welcome') || 'Welcome to Daily Notes' }}</h1>
      <p class="preview-subtitle">{{ t('welcomeDesc') || 'Manage your daily records efficiently and stay organized' }}</p>
    </div>
    
    <div class="preview-content">
      <div class="preview-cards">
        <div class="preview-card">
          <div class="card-icon">
            <el-icon :size="32" color="#409EFF">
              <Document />
            </el-icon>
          </div>
          <h3 class="card-title">{{ t('documentTypes') || 'Document Types' }}</h3>
          <p class="card-desc">{{ t('totalTypes') || 'Total Types' }}: <span class="highlight">12</span></p>
        </div>
        
        <div class="preview-card">
          <div class="card-icon">
            <el-icon :size="32" color="#67C23A">
              <FolderOpened />
            </el-icon>
          </div>
          <h3 class="card-title">{{ t('recentDocs') || 'Recent Documents' }}</h3>
          <p class="card-desc">{{ t('totalDocs') || 'Total Docs' }}: <span class="highlight">42</span></p>
        </div>
        
        <div class="preview-card">
          <div class="card-icon">
            <el-icon :size="32" color="#E6A23C">
              <List />
            </el-icon>
          </div>
          <h3 class="card-title">{{ t('quickAction') || 'Quick Actions' }}</h3>
          <p class="card-desc">{{ t('totalItems') || 'Total Items' }}: <span class="highlight">156</span></p>
        </div>
      </div>
      
      <div class="preview-stats">
        <div class="stat-item">
          <div class="stat-value">24</div>
          <div class="stat-label">{{ t('today') || 'Today' }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">189</div>
          <div class="stat-label">{{ t('thisWeek') || 'This Week' }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">842</div>
          <div class="stat-label">{{ t('thisMonth') || 'This Month' }}</div>
        </div>
      </div>
      
      <div class="preview-tips">
        <h3 class="tips-title">
          <el-icon :size="20" color="#F56C6C">
            <Lightning />
          </el-icon>
          {{ t('tipTitle') || 'Tips' }}
        </h3>
        <p class="tips-content">{{ t('tipContent') || 'Use the quick actions above to navigate through different sections' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  min-height: calc(100vh - 100px);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.preview-header {
  text-align: center;
  margin-bottom: 40px;
}

.preview-title {
  font-size: 2.5rem;
  color: #303133;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.preview-subtitle {
  font-size: 1.2rem;
  color: #909399;
  margin: 0;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.preview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.preview-card {
  background: white;
  border-radius: 12px;
  padding: 30px 25px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-icon {
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.4rem;
  color: #303133;
  margin: 0 0 10px 0;
  font-weight: 500;
}

.card-desc {
  font-size: 1rem;
  color: #909399;
  margin: 0;
}

.highlight {
  color: #409EFF;
  font-weight: 600;
}

.preview-stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1rem;
  color: #909399;
}

.preview-tips {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  color: #303133;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.tips-content {
  font-size: 1rem;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-container {
    padding: 20px 15px;
  }
  
  .preview-title {
    font-size: 2rem;
  }
  
  .preview-cards {
    grid-template-columns: 1fr;
  }
  
  .preview-stats {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }
}
</style>