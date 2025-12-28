<script setup lang="ts">
import DataDownLoad from './button/DataDownLoad.vue';
import DataImport from './button/DataImport.vue';
import Language from './button/Language.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

</script>

<template>
  <el-scrollbar class="config-view">
    <div class="config-container">
      <!-- 标题区域 -->
      <div class="config-header">
        <h2 class="config-title">{{ t('settings') || '配置' }}</h2>
        <p class="config-subtitle">{{ t('settingsDesc') || '数据管理与系统设置' }}</p>
      </div>

      <!-- 功能卡片区域 -->
      <div class="config-cards">
        <!-- 语言切换卡片 -->
        <div class="config-card">
          <div class="card-icon language-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2"/>
              <path d="M12 2V22" stroke="currentColor" stroke-width="2"/>
              <path d="M2 12H22" stroke="currentColor" stroke-width="2"/>
              <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" stroke-width="2"/>
              <path d="M19.07 4.93L4.93 19.07" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ t('language') || '语言设置' }}</h3>
            <p class="card-desc">{{ t('languageDesc') || '切换系统显示语言' }}</p>
          </div>
          <div class="card-action">
            <Language></Language>
          </div>
        </div>

        <!-- 数据导入卡片 -->
        <div class="config-card">
          <div class="card-icon import-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 11L12 8L15 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ t('importData') || '数据导入' }}</h3>
            <p class="card-desc">{{ t('importDataDesc') || '从备份文件恢复数据' }}</p>
          </div>
          <div class="card-action">
            <DataImport></DataImport>
          </div>
        </div>

        <!-- 数据导出卡片 -->
        <div class="config-card">
          <div class="card-icon export-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 8L12 15L9 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ t('exportData') || '数据导出' }}</h3>
            <p class="card-desc">{{ t('exportDataDesc') || '导出数据到本地文件' }}</p>
          </div>
          <div class="card-action">
            <DataDownLoad></DataDownLoad>
          </div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<style scoped>
.config-view {
  height: 100%;
  width: 100%;
}

.config-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

/* 标题区域 */
.config-header {
  text-align: center;
  margin-bottom: 40px;
}

.config-title {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.config-subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

/* 卡片容器 */
.config-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 配置卡片 */
.config-card {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  gap: 20px;
}

.config-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

/* 卡片图标 */
.card-icon {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-icon svg {
  width: 28px;
  height: 28px;
}

.language-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.import-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.export-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 卡片内容 */
.card-content {
  flex: 1;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-desc {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.5;
}

/* 卡片操作区 */
.card-action {
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .config-container {
    padding: 20px;
  }

  .config-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .card-content {
    text-align: center;
  }
}
</style>