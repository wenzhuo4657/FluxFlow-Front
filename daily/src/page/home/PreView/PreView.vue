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
  padding: 40px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: calc(100vh - 100px);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

.preview-container::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 15s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(-30px, 30px) rotate(180deg);
  }
}

.preview-header {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
  animation: fadeInDown 0.8s ease-out;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-title {
  font-size: 3rem;
  color: #ffffff;
  margin: 0 0 15px 0;
  font-weight: 700;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.preview-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 300;
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  position: relative;
  z-index: 1;
}

.preview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 35px 30px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.preview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.preview-card:hover::before {
  left: 100%;
}

.preview-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.15);
}

.card-icon {
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.card-title {
  font-size: 1.5rem;
  color: #303133;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.card-desc {
  font-size: 1.1rem;
  color: #606266;
  margin: 0;
  font-weight: 400;
}

.highlight {
  color: #667eea;
  font-weight: 700;
  font-size: 1.3rem;
}

.preview-stats {
  display: flex;
  justify-content: center;
  gap: 60px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  text-align: center;
  position: relative;
  padding: 15px 25px;
  transition: transform 0.3s ease;
}

.stat-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}

.stat-item:hover::after {
  width: 80%;
}

.stat-item:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
  animation: countUp 1s ease-out;
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-label {
  font-size: 1.1rem;
  color: #606266;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.preview-tips {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 35px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-left: 5px solid #F56C6C;
  animation: fadeInUp 0.8s ease-out 0.6s both;
  transition: all 0.3s ease;
}

.preview-tips:hover {
  transform: translateX(5px);
  border-left-width: 8px;
}

.tips-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.4rem;
  color: #303133;
  margin: 0 0 15px 0;
  font-weight: 600;
}

.tips-content {
  font-size: 1.1rem;
  color: #606266;
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .preview-container {
    padding: 30px 20px;
  }
  
  .preview-title {
    font-size: 2.2rem;
  }
  
  .preview-subtitle {
    font-size: 1.1rem;
  }
  
  .preview-cards {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .preview-stats {
    flex-direction: column;
    gap: 30px;
    align-items: center;
    padding: 30px 20px;
  }
  
  .stat-value {
    font-size: 2.5rem;
  }
  
  .preview-card {
    padding: 25px 20px;
  }
}
</style>