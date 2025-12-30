<template>
  <div class="welcome-page">
    <div class="background-gradient"></div>
    <div class="background-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="welcome-container">
      <div class="welcome-header">
        <div class="title-decoration">
          <div class="decoration-line"></div>
        </div>
        <h1 class="welcome-title">{{ title }}</h1>
        <p class="welcome-subtitle">{{ subtitle }}</p>
      </div>

      <div class="cards-grid">
        <div
          v-for="(card, index) in cards"
          :key="card.id"
          class="card-wrapper"
          :style="{ animationDelay: `${index * 0.1}s` }"
          role="button"
          tabindex="0"
          :aria-label="`Navigate to ${card.title}`"
          @click="handleNavigate(card.path)"
          @keydown.enter="handleNavigate(card.path)"
          @keydown.space.prevent="handleNavigate(card.path)"
        >
          <el-card class="navigation-card">
            <div class="card-glass-effect"></div>
            <div class="card-content">
              <div class="icon-container">
                <div class="icon-background"></div>
                <component :is="card.icon" class="card-icon" />
              </div>
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-description">{{ card.description }}</p>
              <div class="card-arrow">
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
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
import { Document, Edit, Setting, ArrowRight } from '@element-plus/icons-vue';

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

const handleNavigate = async (path: string) => {
  try {
    await router.push(path);
  } catch (error) {
    // Navigation error (e.g., user aborted navigation)
    console.error('Navigation failed:', error);
  }
};
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* 渐变背景 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0.05;
  z-index: 0;
}

/* 动态背景形状 */
.background-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--el-color-primary-light-7) 0%, var(--el-color-primary-light-9) 100%);
  animation: float 20s infinite ease-in-out;
  opacity: 0.3;
  will-change: transform;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: -50px;
  animation-delay: -5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: 30%;
  animation-delay: -10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(30px, -30px) rotate(90deg);
  }
  50% {
    transform: translate(-20px, 20px) rotate(180deg);
  }
  75% {
    transform: translate(20px, 30px) rotate(270deg);
  }
}

.welcome-container {
  width: 100%;
  max-width: 72rem;
  position: relative;
  z-index: 1;
}

.welcome-header {
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeInDown 0.8s ease-out;
}

.title-decoration {
  margin-bottom: 1.5rem;
  position: relative;
}

.decoration-line {
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  margin: 0 auto;
  border-radius: 2px;
  position: relative;
}

.decoration-line::before,
.decoration-line::after {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--el-color-primary);
  border-radius: 50%;
  top: -2px;
  animation: pulse 2s infinite;
}

.decoration-line::before {
  left: -4px;
}

.decoration-line::after {
  right: -4px;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.welcome-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--el-text-color-primary) 0%, var(--el-color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.welcome-subtitle {
  font-size: 1.25rem;
  color: var(--el-text-color-secondary);
  font-weight: 400;
  animation: fadeInUp 0.8s ease-out 0.4s both;
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .welcome-title {
    font-size: 3.5rem;
  }
}

.card-wrapper {
  cursor: pointer;
  animation: fadeInUp 0.8s ease-out both;
  position: relative;
}

.card-wrapper:focus-visible {
  outline: 2px solid var(--el-color-primary);
  outline-offset: 2px;
  border-radius: 16px;
}

.card-wrapper:focus {
  outline: none;
}

.navigation-card {
  height: 100%;
  border: none;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

/* 玻璃态效果 */
.card-glass-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  pointer-events: none;
  z-index: 0;
}

.navigation-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.card-wrapper:hover .navigation-card::before {
  transform: scaleX(1);
}

.card-wrapper:hover .navigation-card {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  background: rgba(255, 255, 255, 0.95);
}

.card-wrapper:active .navigation-card {
  transform: translateY(-4px);
  transition: all 0.1s ease;
}

.card-content {
  text-align: center;
  padding: 2.5rem 2rem;
  position: relative;
  z-index: 2;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  width: 80px;
  height: 80px;
  margin-left: auto;
  margin-right: auto;
}

.icon-background {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: rotate(45deg);
}

.card-wrapper:hover .icon-background {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  transform: rotate(45deg) scale(1.1);
}

.card-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--el-color-primary);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

.card-wrapper:hover .card-icon {
  color: #ffffff;
  transform: scale(1.1);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin-bottom: 0.75rem;
  letter-spacing: -0.01em;
  transition: color 0.3s ease;
}

.card-wrapper:hover .card-title {
  color: var(--el-color-primary);
}

.card-description {
  font-size: 0.9375rem;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
}

.card-wrapper:hover .card-description {
  color: var(--el-text-color-secondary);
}

.card-arrow {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.card-wrapper:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.arrow-icon {
  font-size: 1.25rem;
  color: var(--el-color-primary);
  transition: transform 0.3s ease;
}

.card-wrapper:hover .arrow-icon {
  transform: translateX(5px);
}

/* 响应式优化 */
@media (max-width: 767px) {
  .welcome-title {
    font-size: 2rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .card-content {
    padding: 2rem 1.5rem;
  }

  .icon-container {
    width: 70px;
    height: 70px;
  }

  .card-icon {
    width: 2rem;
    height: 2rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .card-description {
    font-size: 0.875rem;
  }
}
</style>
