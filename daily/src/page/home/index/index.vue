<template>
  <div class="welcome-page">
    <div class="welcome-container">
      <div class="welcome-header">
        <h1 class="welcome-title">{{ title }}</h1>
        <p class="welcome-subtitle">{{ subtitle }}</p>
      </div>

      <div class="cards-grid">
        <div
          v-for="card in cards"
          :key="card.id"
          class="card-wrapper"
          @click="handleNavigate(card.path)"
        >
          <el-card class="navigation-card" shadow="hover">
            <div class="card-content">
              <div class="icon-container">
                <component :is="card.icon" class="card-icon" />
              </div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-description">{{ card.description }}</p>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, type Component } from 'vue';
import { useRouter } from 'vue-router';
import { Document, Edit, Setting } from '@element-plus/icons-vue';

interface NavigationCard {
  id: string;
  title: string;
  description: string;
  icon: Component;
  path: string;
}

interface WelcomePageProps {
  title?: string;
  subtitle?: string;
  cards?: NavigationCard[];
}

const props = withDefaults(defineProps<WelcomePageProps>(), {
  title: 'Welcome',
  subtitle: 'Choose an option to get started',
  cards: () => [
    {
      id: 'document-types',
      title: 'Document Types',
      description: 'Manage and organize your document templates',
      icon: markRaw(Document),
      path: '/document-types',
    },
    {
      id: 'quick-edit',
      title: 'Quick Edit',
      description: 'Quickly edit and update your documents',
      icon: markRaw(Edit),
      path: '/quick-edit',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure your preferences and options',
      icon: markRaw(Setting),
      path: '/settings',
    },
  ],
});

const router = useRouter();

const handleNavigate = (path: string) => {
  console.log(`Navigating to: ${path}`);
  router.push(path);
};
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background-color: var(--el-bg-color);
}

.welcome-container {
  width: 100%;
  max-width: 72rem;
}

.welcome-header {
  text-align: center;
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 0.75rem;
}

.welcome-subtitle {
  font-size: 1.125rem;
  color: var(--el-text-color-secondary);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.card-wrapper {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-wrapper:hover {
  transform: scale(1.05);
}

.navigation-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color);
}

.navigation-card:hover {
  border-color: var(--el-color-primary-light-5);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-content {
  text-align: center;
  padding: 1rem;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-container::before {
  content: '';
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: var(--el-color-primary-light-9);
  transition: all 0.3s ease;
}

.card-wrapper:hover .icon-container::before {
  background-color: var(--el-color-primary);
}

.card-icon {
  width: 2rem;
  height: 2rem;
  color: var(--el-color-primary);
  transition: all 0.3s ease;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-wrapper:hover .card-icon {
  color: var(--el-color-primary-light-9);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.875rem;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}
</style>
