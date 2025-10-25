<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-950 via-purple-900 to-indigo-900 overflow-hidden relative">
    <!-- Enhanced Animated Background -->
    <div class="absolute inset-0">
      <!-- Matrix-style background text -->
      <div class="matrix-text">
        <div v-for="i in 8" :key="i" class="matrix-line" :style="getMatrixStyle(i)">
          {{ matrixTexts[i % matrixTexts.length] }}
        </div>
      </div>
      
      <!-- Floating orbs with enhanced animation -->
      <div v-for="i in 6" :key="i" class="floating-orb enhanced" :class="`orb-${i}`"></div>
      
      <!-- Animated grid with parallax -->
      <div class="parallax-grid" :style="{ transform: `translateY(${scrollY * 0.5}px)` }"></div>
      
      <!-- Enhanced particle system -->
      <div class="particles">
        <div v-for="i in 30" :key="i" class="particle enhanced" :style="getEnhancedParticleStyle(i)"></div>
      </div>

      <!-- Floating icons -->
      <div class="floating-icons">
        <div v-for="(icon, index) in floatingIcons" :key="index" class="floating-icon" :style="getIconStyle(index)">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon.path"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Navigation with glass effect -->
    <nav class="relative z-10 p-6 flex justify-between items-center nav-fade-in">
      <div class="flex items-center space-x-3 logo-container" @mouseover="logoHover = true" @mouseleave="logoHover = false">
        <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center logo-bounce" :class="{ 'logo-hovered': logoHover }">
          <svg class="w-8 h-8 text-blue-600 logo-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
        </div>
        <span class="text-2xl font-bold text-white glow-text">PC Optimizer Pro</span>
      </div>
      <router-link to="/login" class="glass-button admin-login">
        Admin Login
        <div class="button-glow"></div>
      </router-link>
    </nav>

    <!-- Enhanced Hero Section with Fancy Animated Title -->
    <section class="relative z-10 pt-20 pb-32 text-center hero-section">
      <div class="container mx-auto px-6">
        <div class="max-w-6xl mx-auto">
          <!-- Revolutionary 3D Animated Title -->
          <div class="hero-title-container perspective-1000">
            <h1 class="hero-title-3d">
              <!-- Optimize with multi-layer animation -->
              <span class="word-container">
                <span class="word-3d optimize-word">
                  <span class="letter" style="--delay: 0s">O</span>
                  <span class="letter" style="--delay: 0.1s">p</span>
                  <span class="letter" style="--delay: 0.2s">t</span>
                  <span class="letter" style="--delay: 0.3s">i</span>
                  <span class="letter" style="--delay: 0.4s">m</span>
                  <span class="letter" style="--delay: 0.5s">i</span>
                  <span class="letter" style="--delay: 0.6s">z</span>
                  <span class="letter" style="--delay: 0.7s">e</span>
                </span>
                <!-- Floating particles around "Optimize" -->
                <div class="word-particles">
                  <div v-for="i in 12" :key="i" class="word-particle" :style="getWordParticleStyle(i)"></div>
                </div>
              </span>

              <!-- "Your" with elegant transition -->
              <span class="word-container">
                <span class="word-3d your-word">
                  <span class="letter" style="--delay: 0.8s">Y</span>
                  <span class="letter" style="--delay: 0.9s">o</span>
                  <span class="letter" style="--delay: 1.0s">u</span>
                  <span class="letter" style="--delay: 1.1s">r</span>
                </span>
                <!-- Animated connection line -->
                <div class="connection-line"></div>
              </span>

              <!-- "PC" with spectacular effects -->
              <span class="word-container pc-container">
                <span class="word-3d pc-word">
                  <span class="letter pc-letter" style="--delay: 1.2s">P</span>
                  <span class="letter pc-letter" style="--delay: 1.3s">C</span>
                </span>
                <!-- Holographic effect -->
                <div class="hologram-effect"></div>
                <!-- Energy rings around PC -->
                <div class="energy-rings">
                  <div class="energy-ring ring-1"></div>
                  <div class="energy-ring ring-2"></div>
                  <div class="energy-ring ring-3"></div>
                </div>
              </span>
            </h1>

            <!-- Animated tagline with typewriter -->
            <div class="hero-tagline">
              <div class="tagline-container">
                <span class="tagline-text">{{ currentTagline }}</span>
                <span class="tagline-cursor">█</span>
              </div>
              <div class="tagline-glow"></div>
            </div>

            <!-- Floating tech icons around title -->
            <div class="floating-tech-icons">
              <div v-for="(icon, index) in techIcons" :key="index" 
                   class="floating-tech-icon" 
                   :style="getTechIconStyle(index)">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icon.path"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Elegant subtitle with morphing animation -->
          <div class="subtitle-morphing">
            <p class="morphing-text">
              {{ currentMorphingText }}
            </p>
          </div>

          <!-- Spectacular call-to-action section -->
          <div class="cta-spectacular">
            <div class="cta-container">
              <h3 class="cta-title">Ready to Experience the Transformation?</h3>
              <div class="transformation-preview">
                <div class="before-after">
                  <div class="state-card before-state">
                    <div class="state-icon">😴</div>
                    <div class="state-label">Before</div>
                    <div class="state-desc">Slow & Cluttered</div>
                  </div>
                  <div class="transformation-arrow">
                    <div class="arrow-container">
                      <svg class="transformation-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                      <div class="magic-sparkles">
                        <div v-for="i in 6" :key="i" class="sparkle" :style="getSparkleStyle(i)">✨</div>
                      </div>
                    </div>
                  </div>
                  <div class="state-card after-state">
                    <div class="state-icon">⚡</div>
                    <div class="state-label">After</div>
                    <div class="state-desc">Fast & Optimized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Enhanced PowerShell Command Section -->
          <div class="command-container slide-in-up" @mouseenter="commandHover = true" @mouseleave="commandHover = false">
            <div class="terminal-window" :class="{ 'terminal-glow': commandHover }">
              <div class="terminal-header">
                <div class="terminal-buttons">
                  <div class="terminal-button red pulse"></div>
                  <div class="terminal-button yellow pulse" style="animation-delay: 0.5s"></div>
                  <div class="terminal-button green pulse" style="animation-delay: 1s"></div>
                </div>
                <span class="terminal-title">Windows PowerShell - Administrator</span>
                <div class="terminal-status">
                  <span class="status-dot online"></span>
                  <span class="text-green-400 text-xs">CONNECTED</span>
                </div>
              </div>
              
              <div class="terminal-body">
                <div class="command-line">
                  <span class="prompt">PS C:\Windows\System32&gt;</span>
                  <span class="command-text">{{ displayCommand }}</span>
                  <span v-if="showCommandCursor" class="command-cursor">█</span>
                </div>
                
                <!-- Copy button with ripple effect -->
                <button @click="copyCommand" class="copy-button" :class="{ 'copied': justCopied }">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!justCopied" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ copyText }}</span>
                  <div class="ripple-effect" :class="{ 'active': showRipple }"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Usage Steps with staggered animation -->
          <div class="grid md:grid-cols-3 gap-8 mb-16 mt-20">
            <div v-for="(step, index) in steps" :key="index" 
                 class="step-card enhanced" 
                 :style="{ animationDelay: `${index * 0.2}s` }"
                 @mouseenter="stepHover[index] = true" 
                 @mouseleave="stepHover[index] = false">
              <div class="step-number-3d">{{ index + 1 }}</div>
              <div class="step-icon" :class="{ 'icon-bounce': stepHover[index] }">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="step.icon"/>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-white mb-4">{{ step.title }}</h3>
              <p class="text-blue-200">{{ step.description }}</p>
              <div class="card-glow" :class="{ 'active': stepHover[index] }"></div>
            </div>
          </div>

          <!-- Scroll indicator -->
          <div class="scroll-indicator bounce-arrow">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with scroll animations -->
    <section class="relative z-10 py-20 bg-black/20 backdrop-blur-sm" ref="featuresSection">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16 section-fade-in">
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 gradient-text-pulse">
            What PC Optimizer Pro Can Do
          </h2>
          <p class="text-xl text-blue-200 max-w-4xl mx-auto">
            Comprehensive system optimization with advanced features for both casual users and power users
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div v-for="(feature, index) in features" :key="index" 
               class="feature-card-3d" 
               :style="{ animationDelay: `${index * 0.1}s` }"
               @mouseenter="featureHover[index] = true"
               @mouseleave="featureHover[index] = false">
            <div class="feature-icon-3d" :class="feature.iconClass">
              <svg class="w-8 h-8 icon-float" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.iconPath"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">{{ feature.title }}</h3>
            <ul class="text-blue-200 space-y-2 text-sm">
              <li v-for="item in feature.items" :key="item" class="feature-item">
                <span class="bullet">●</span> {{ item }}
              </li>
            </ul>
            <div class="feature-glow" :class="{ 'active': featureHover[index] }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Performance Stats with animated counters -->
    <section class="relative z-10 py-20" ref="statsSection">
      <div class="container mx-auto px-6">
        <div class="text-center mb-16 section-fade-in">
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 gradient-text-animated">
            Proven Results
          </h2>
          <p class="text-xl text-blue-200">
            Real performance improvements you can measure
          </p>
        </div>

        <div class="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div v-for="(stat, index) in stats" :key="index" 
               class="stat-card-enhanced"
               :style="{ animationDelay: `${index * 0.2}s` }">
            <div class="stat-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="stat.iconPath"/>
              </svg>
            </div>
            <div class="stat-number counting-number" :data-target="stat.target">
              {{ animatedStats[stat.key] }}{{ stat.suffix }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-desc">{{ stat.description }}</div>
            <div class="stat-progress">
              <div class="progress-bar" :style="{ width: `${(animatedStats[stat.key] / stat.target) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive Demo Section -->
    <section class="relative z-10 py-20 bg-black/20">
      <div class="container mx-auto px-6">
        <div class="max-w-5xl mx-auto text-center">
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6 gradient-text-animated">
            See It In Action
          </h2>
          <p class="text-xl text-blue-200 mb-12">
            Watch how PC Optimizer Pro transforms your system
          </p>

          <div class="demo-terminal" @click="startDemo">
            <div class="terminal-header">
              <div class="terminal-buttons">
                <div class="terminal-button red"></div>
                <div class="terminal-button yellow"></div>
                <div class="terminal-button green"></div>
              </div>
              <span class="terminal-title">PC Optimizer Pro - Live Demo</span>
            </div>
            
            <div class="terminal-content">
              <div v-for="(line, index) in demoLines" :key="index" 
                   class="demo-line" 
                   :class="getDemoLineClass(line)"
                   :style="{ animationDelay: `${index * 0.5}s` }">
                {{ line }}
              </div>
              <div v-if="showDemoCursor" class="demo-cursor">
                <span class="prompt">C:\&gt;</span>
                <span class="typing-demo">{{ currentDemoText }}</span>
                <span class="cursor-blink">█</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced FAQ Section -->
    <section class="relative z-10 py-20">
      <div class="container mx-auto px-6">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl md:text-6xl font-bold text-white text-center mb-16 gradient-text-animated">
            Frequently Asked Questions
          </h2>

          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" 
                 class="faq-item-enhanced" 
                 :class="{ 'open': faq.open }"
                 @click="toggleFaq(index)">
              <div class="faq-question">
                <h3 class="text-xl font-semibold text-white">{{ faq.question }}</h3>
                <svg class="faq-icon" :class="{ 'rotated': faq.open }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
              <div class="faq-answer" :class="{ 'expanded': faq.open }">
                <p class="text-blue-200">{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced CTA Section -->
    <section class="relative z-10 py-20 text-center">
      <div class="container mx-auto px-6">
        <div class="max-w-5xl mx-auto">
          <h2 class="text-4xl md:text-7xl font-bold text-white mb-8 gradient-text-mega">
            Ready to Optimize?
          </h2>
          <p class="text-2xl text-blue-200 mb-12">
            Transform your PC performance in seconds with our PowerShell command
          </p>

          <div class="cta-terminal">
            <div class="terminal-header">
              <div class="terminal-buttons">
                <div class="terminal-button red"></div>
                <div class="terminal-button yellow"></div>
                <div class="terminal-button green"></div>
              </div>
              <span class="terminal-title">Run as Administrator</span>
            </div>
            <div class="terminal-body">
              <div class="command-display">
                <span class="prompt-cta">PS C:\&gt;</span>
                <span class="command-text-cta">iex (iwr https://raw.githubusercontent.com/TheGameisYash/PCoptimizer/main/PC-Optimizer-Pro.ps1).Content</span>
              </div>
              <button @click="copyCommand" class="cta-button mega-button">
                <span class="button-text">Copy Command & Start Optimizing</span>
                <div class="button-particles">
                  <div v-for="i in 6" :key="i" class="particle-cta"></div>
                </div>
                <div class="button-glow-mega"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer with animations -->
    <footer class="relative z-10 bg-black/40 py-12 border-t border-white/20 backdrop-blur-sm">
      <div class="container mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-3 mb-4 md:mb-0 footer-logo">
            <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center logo-pulse">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <span class="text-xl font-bold text-white">PC Optimizer Pro</span>
          </div>
          <div class="text-blue-200 text-sm fade-in-text">
            © 2025 PC Optimizer Pro. Professional System Optimization Tool.
          </div>
        </div>
      </div>
    </footer>

    <!-- Notification Toast -->
    <div v-if="showNotification" class="notification-toast">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Command copied to clipboard!
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    // Reactive state
    const scrollY = ref(0)
    const logoHover = ref(false)
    const commandHover = ref(false)
    const stepHover = ref([false, false, false])
    const featureHover = ref([])
    const justCopied = ref(false)
    const showRipple = ref(false)
    const showNotification = ref(false)
    const showCommandCursor = ref(true)
    const showDemoCursor = ref(false)
    
    // Animated text states
    const currentTagline = ref('')
    const currentMorphingText = ref('')
    const displayCommand = ref('')
    const currentDemoText = ref('')
    const copyText = ref('Copy Command')
    
    // Animation data
    const taglines = [
      'One Command. Infinite Performance.',
      'Unleash Your PCs True Potential.',
      'Where Magic Meets Technology.',
      'Transform. Optimize. Dominate.'
    ]
    
    const morphingTexts = [
      'Professional-grade system optimization that transforms sluggish computers into performance powerhouses',
      'Advanced algorithms detect and eliminate system bottlenecks with surgical precision',
      'Intelligent automation handles complex optimization tasks while you sit back and watch the magic',
      'Enterprise-level tools now available with a single PowerShell command'
    ]
    
    const matrixTexts = [
      'SYSTEM_OPTIMIZE_01010', 'PERFORMANCE_BOOST_11001', 'REGISTRY_CLEAN_10110',
      'MEMORY_OPTIMIZE_01100', 'GAMING_MODE_11010', 'SECURITY_SCAN_10011',
      'DISK_CLEANUP_01011', 'STARTUP_BOOST_11100'
    ]
    
    const command = 'iex (iwr https://raw.githubusercontent.com/TheGameisYash/PCoptimizer/main/PC-Optimizer-Pro.ps1).Content'
    
    const floatingIcons = [
      { path: 'M13 10V3L4 14h7v7l9-11h-7z' }, // Lightning
      { path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' }, // Check
      { path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }, // Settings
      { path: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' }, // Trash
      { path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' } // Chart
    ]
    
    const techIcons = [
      { path: 'M13 10V3L4 14h7v7l9-11h-7z' }, // Lightning
      { path: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }, // Gear
      { path: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' }, // CPU
      { path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' } // Shield Check
    ]
    
    const steps = [
      {
        title: 'Open PowerShell as Admin',
        description: 'Right-click on Windows Start button and select "Windows PowerShell (Admin)" or "Terminal (Admin)"',
        icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
      },
      {
        title: 'Copy & Paste Command',
        description: 'Copy the PowerShell command above and paste it into your PowerShell window, then press Enter',
        icon: 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
      },
      {
        title: 'Let It Optimize',
        description: 'Sit back and watch as PC Optimizer Pro enhances your system performance automatically',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z'
      }
    ]
    
    const features = [
      {
        title: 'Deep System Cleaning',
        iconClass: 'bg-gradient-to-r from-red-500 to-pink-500',
        iconPath: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
        items: ['Temporary files cleanup', 'Browser cache removal', 'Windows update cache', 'System log cleanup', 'Prefetch optimization']
      },
      {
        title: 'Performance Optimization',
        iconClass: 'bg-gradient-to-r from-green-500 to-emerald-500',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
        items: ['Memory optimization', 'CPU priority adjustment', 'Startup program management', 'Visual effects optimization', 'Power plan optimization']
      },
      {
        title: 'Gaming Enhancement',
        iconClass: 'bg-gradient-to-r from-purple-500 to-indigo-500',
        iconPath: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z',
        items: ['Game Mode activation', 'FPS boost optimization', 'Game DVR disabling', 'Gaming priority settings', 'Notification blocking']
      },
      {
        title: 'System Analysis',
        iconClass: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        items: ['Hardware information', 'Disk space analysis', 'Network diagnostics', 'Performance monitoring', 'System health check']
      },
      {
        title: 'Registry Optimization',
        iconClass: 'bg-gradient-to-r from-orange-500 to-red-500',
        iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
        items: ['Registry scanning', 'Invalid entries cleanup', 'Registry defragmentation', 'Backup before changes', 'Safe optimization']
      },
      {
        title: 'Security & Privacy',
        iconClass: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z',
        items: ['Privacy cleaner', 'Secure file deletion', 'Browser privacy cleanup', 'Windows telemetry control', 'System restore points']
      }
    ]
    
    const stats = [
      {
        key: 'cleanup',
        target: 3.2,
        suffix: 'GB',
        label: 'Cleaned',
        description: 'Average junk removal',
        iconPath: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      },
      {
        key: 'performance',
        target: 55,
        suffix: '%',
        label: 'Faster Startup',
        description: 'Boot time improvement',
        iconPath: 'M13 10V3L4 14h7v7l9-11h-7z'
      },
      {
        key: 'fps',
        target: 25,
        suffix: '',
        label: 'FPS Boost',
        description: 'Gaming performance',
        iconPath: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z'
      },
      {
        key: 'memory',
        target: 40,
        suffix: '%',
        label: 'RAM Optimized',
        description: 'Memory efficiency',
        iconPath: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
      }
    ]
    
    const animatedStats = ref({
      cleanup: 0,
      performance: 0,
      fps: 0,
      memory: 0
    })
    
    const faqs = ref([
      {
        question: 'Is PC Optimizer Pro safe to use?',
        answer: 'Yes, PC Optimizer Pro is completely safe. It creates system restore points before making changes and only performs standard Windows optimization techniques.',
        open: false
      },
      {
        question: 'Do I need administrator privileges?',
        answer: 'Yes, administrator privileges are required to perform system-level optimizations like registry cleaning and service management.',
        open: false
      },
      {
        question: 'Will this work on Windows 11?',
        answer: 'PC Optimizer Pro works on Windows 10, Windows 11, and Windows Server versions. It automatically detects your system version.',
        open: false
      },
      {
        question: 'What happens if something goes wrong?',
        answer: 'The tool creates automatic backups and restore points. You can always revert changes using Windows System Restore.',
        open: false
      },
      {
        question: 'How often should I run PC Optimizer?',
        answer: 'For optimal performance, run PC Optimizer weekly or whenever you notice system slowdowns.',
        open: false
      }
    ])
    
    const demoLines = ref([])
    const demoCommands = [
      '[INIT] PC Optimizer Pro v2.1.0 Started',
      '[SCAN] Analyzing system performance...',
      '[OK] Found 2.3GB temporary files',
      '[CLEAN] Removing junk files...',
      '[OK] Registry optimization complete',
      '[BOOST] Gaming mode activated',
      '[OK] System optimization successful!'
    ]
    
    let intervals = []
    
    // Helper functions
    const getMatrixStyle = (index) => ({
      '--delay': `${index * 2}s`,
      '--duration': `${8 + Math.random() * 4}s`,
      left: `${(index * 100) / 8}%`
    })
    
    const getEnhancedParticleStyle = (index) => ({
      '--delay': `${index * 0.1}s`,
      '--duration': `${3 + Math.random() * 2}s`,
      '--x': `${Math.random() * 100}%`,
      '--y': `${Math.random() * 100}%`,
      '--size': `${2 + Math.random() * 4}px`
    })
    
    const getIconStyle = (index) => ({
      '--delay': `${index * 1.5}s`,
      '--duration': `${8 + Math.random() * 4}s`,
      top: `${10 + Math.random() * 80}%`,
      left: `${Math.random() * 100}%`
    })
    
    const getWordParticleStyle = (index) => ({
      '--delay': `${index * 0.5}s`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`
    })
    
    const getTechIconStyle = (index) => ({
      top: `${20 + Math.random() * 60}%`,
      left: `${10 + Math.random() * 80}%`,
      animationDelay: `${index * 1.5}s`
    })
    
    const getSparkleStyle = (index) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${index * 0.3}s`
    })
    
    const getDemoLineClass = (line) => {
      if (line.includes('[OK]')) return 'text-green-400'
      if (line.includes('[SCAN]') || line.includes('[CLEAN]') || line.includes('[BOOST]')) return 'text-blue-400'
      if (line.includes('[INIT]')) return 'text-yellow-400'
      return 'text-white'
    }
    
    // Animation functions
    const startTaglineTypewriter = () => {
      let taglineIndex = 0
      
      const typeTagline = (text) => {
        currentTagline.value = ''
        let charIndex = 0
        
        const interval = setInterval(() => {
          if (charIndex < text.length) {
            currentTagline.value += text[charIndex]
            charIndex++
          } else {
            clearInterval(interval)
            setTimeout(() => {
              taglineIndex = (taglineIndex + 1) % taglines.length
              typeTagline(taglines[taglineIndex])
            }, 3000)
          }
        }, 80)
        
        intervals.push(interval)
      }
      
      typeTagline(taglines[0])
    }
    
    const startMorphingText = () => {
      let textIndex = 0
      
      const morphText = () => {
        currentMorphingText.value = morphingTexts[textIndex]
        textIndex = (textIndex + 1) % morphingTexts.length
        
        setTimeout(morphText, 4000)
      }
      
      morphText()
    }
    
    const startCommandTypewriter = () => {
      let charIndex = 0
      
      const interval = setInterval(() => {
        if (charIndex < command.length) {
          displayCommand.value += command[charIndex]
          charIndex++
        } else {
          showCommandCursor.value = false
          clearInterval(interval)
        }
      }, 30)
      
      intervals.push(interval)
    }
    
    const animateCounters = () => {
      const duration = 2000
      const steps = 60
      const stepDuration = duration / steps
      
      let step = 0
      const interval = setInterval(() => {
        step++
        const progress = step / steps
        
        animatedStats.value.cleanup = Math.min(3.2 * progress, 3.2).toFixed(1)
        animatedStats.value.performance = Math.floor(Math.min(55 * progress, 55))
        animatedStats.value.fps = Math.floor(Math.min(25 * progress, 25))
        animatedStats.value.memory = Math.floor(Math.min(40 * progress, 40))
        
        if (step >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
      
      intervals.push(interval)
    }
    
    const startDemo = () => {
      showDemoCursor.value = true
      let lineIndex = 0
      
      const addLine = () => {
        if (lineIndex < demoCommands.length) {
          demoLines.value.push(demoCommands[lineIndex])
          lineIndex++
          setTimeout(addLine, 1000)
        } else {
          showDemoCursor.value = false
        }
      }
      
      setTimeout(addLine, 1000)
    }
    
    const copyCommand = async () => {
      const cmd = 'iex (iwr https://raw.githubusercontent.com/TheGameisYash/PCoptimizer/main/PC-Optimizer-Pro.ps1).Content'
      
      try {
        await navigator.clipboard.writeText(cmd)
        
        // Update button states
        justCopied.value = true
        showRipple.value = true
        copyText.value = 'Copied!'
        
        // Show toast notification
        showNotification.value = true
        
        // Reset button states after 2 seconds
        setTimeout(() => {
          justCopied.value = false
          showRipple.value = false
          copyText.value = 'Copy Command'
        }, 2000)
        
        // Hide toast after 3 seconds
        setTimeout(() => {
          showNotification.value = false
        }, 3000)
        
        console.log('✅ Command copied successfully!')
        
      } catch (err) {
        console.error('Failed to copy:', err)
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = cmd
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          
          // Same success flow as above
          justCopied.value = true
          showRipple.value = true
          copyText.value = 'Copied!'
          showNotification.value = true
          
          setTimeout(() => {
            justCopied.value = false
            showRipple.value = false
            copyText.value = 'Copy Command'
          }, 2000)
          
          setTimeout(() => {
            showNotification.value = false
          }, 3000)
          
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr)
        } finally {
          document.body.removeChild(textArea)
        }
      }
    }
    
    const toggleFaq = (index) => {
      faqs.value[index].open = !faqs.value[index].open
    }
    
    const handleScroll = () => {
      scrollY.value = window.scrollY
    }
    
    onMounted(() => {
      setTimeout(startTaglineTypewriter, 2000)
      setTimeout(startMorphingText, 3000)
      setTimeout(startCommandTypewriter, 4000)
      setTimeout(animateCounters, 5000)
      setTimeout(startDemo, 6000)
      
      window.addEventListener('scroll', handleScroll)
      
      // Initialize hover arrays
      featureHover.value = new Array(features.length).fill(false)
    })
    
    onUnmounted(() => {
      intervals.forEach(clearInterval)
      window.removeEventListener('scroll', handleScroll)
    })
    
    return {
      scrollY,
      logoHover,
      commandHover,
      stepHover,
      featureHover,
      justCopied,
      showRipple,
      showNotification,
      showCommandCursor,
      showDemoCursor,
      currentTagline,
      currentMorphingText,
      displayCommand,
      currentDemoText,
      copyText,
      matrixTexts,
      floatingIcons,
      techIcons,
      steps,
      features,
      stats,
      animatedStats,
      faqs,
      demoLines,
      getMatrixStyle,
      getEnhancedParticleStyle,
      getIconStyle,
      getWordParticleStyle,
      getTechIconStyle,
      getSparkleStyle,
      getDemoLineClass,
      copyCommand,
      toggleFaq,
      startDemo
    }
  }
}
</script>

<style scoped>
/* Enhanced Animations and Interactions */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

/* Accessibility: Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Matrix Background Text */
.matrix-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  opacity: 0.1;
}

.matrix-line {
  position: absolute;
  color: #00ff88;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: nowrap;
  animation: matrix-scroll var(--duration, 10s) linear infinite;
  animation-delay: var(--delay, 0s);
}

@keyframes matrix-scroll {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

/* Enhanced Floating Orbs */
.floating-orb.enhanced {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.4), rgba(147, 51, 234, 0.4), rgba(16, 185, 129, 0.3));
  filter: blur(3px);
  animation: enhanced-float 12s ease-in-out infinite, color-shift 8s ease-in-out infinite;
}

.orb-1 { width: 300px; height: 300px; top: 5%; left: 5%; animation-delay: 0s; }
.orb-2 { width: 200px; height: 200px; top: 60%; right: 10%; animation-delay: 2s; }
.orb-3 { width: 250px; height: 250px; bottom: 20%; left: 30%; animation-delay: 1s; }
.orb-4 { width: 180px; height: 180px; top: 30%; right: 40%; animation-delay: 3s; }
.orb-5 { width: 220px; height: 220px; bottom: 40%; right: 60%; animation-delay: 1.5s; }
.orb-6 { width: 160px; height: 160px; top: 70%; left: 60%; animation-delay: 4s; }

@keyframes enhanced-float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
  25% { transform: translateY(-40px) translateX(30px) rotate(90deg) scale(1.1); }
  50% { transform: translateY(20px) translateX(-20px) rotate(180deg) scale(0.9); }
  75% { transform: translateY(-30px) translateX(-40px) rotate(270deg) scale(1.05); }
}

@keyframes color-shift {
  0%, 100% { filter: blur(3px) hue-rotate(0deg); }
  33% { filter: blur(3px) hue-rotate(120deg); }
  66% { filter: blur(3px) hue-rotate(240deg); }
}

/* Parallax Grid */
.parallax-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-pulse 4s ease-in-out infinite;
  will-change: transform;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Enhanced Particles */
.particle.enhanced {
  position: absolute;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: enhanced-particle-float var(--duration, 4s) linear infinite, particle-glow 2s ease-in-out infinite alternate;
  animation-delay: var(--delay, 0s);
  width: var(--size, 4px);
  height: var(--size, 4px);
  left: var(--x, 50%);
  top: var(--y, 50%);
}

@keyframes enhanced-particle-float {
  0% { transform: translateY(100vh) translateX(-30px) scale(0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; transform: translateY(90vh) translateX(30px) scale(1) rotate(180deg); }
  90% { opacity: 1; transform: translateY(-10vh) translateX(-20px) scale(1) rotate(360deg); }
  100% { opacity: 0; transform: translateY(-20vh) translateX(40px) scale(0) rotate(540deg); }
}

@keyframes particle-glow {
  0% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
  100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(147, 51, 234, 0.4); }
}

/* Floating Icons */
.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  color: rgba(59, 130, 246, 0.6);
  animation: icon-float var(--duration, 10s) linear infinite;
  animation-delay: var(--delay, 0s);
}

@keyframes icon-float {
  0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  50% { transform: translateY(50vh) rotate(180deg); opacity: 1; }
  90% { opacity: 0.8; }
  100% { transform: translateY(-10vh) rotate(360deg); opacity: 0; }
}

/* Navigation Animations */
.nav-fade-in {
  animation: nav-slide-down 1s ease-out;
}

@keyframes nav-slide-down {
  0% { transform: translateY(-100px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

.logo-container {
  transition: all 0.3s ease;
}

.logo-bounce {
  animation: logo-float 3s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-hovered {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

@keyframes logo-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.logo-spin {
  animation: logo-spin 8s linear infinite;
}

@keyframes logo-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.glow-text {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  animation: text-glow 2s ease-in-out infinite alternate;
}

@keyframes text-glow {
  0% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
  100% { text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(147, 51, 234, 0.4); }
}

.glass-button {
  @apply px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.glass-button:hover .button-glow {
  transform: translateX(100%);
}

/* Revolutionary Hero Title Styles */
.hero-title-container {
  position: relative;
  margin-bottom: 3rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.perspective-1000 {
  perspective: 1000px;
}

.hero-title-3d {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  position: relative;
}

.word-container {
  position: relative;
  display: inline-block;
  margin: 0.5rem 0;
  opacity: 1 !important; /* ✅ Force visible */
  visibility: visible !important; /* ✅ Force visible */
}

.word-3d {
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  opacity: 1 !important; /* ✅ Force visible */
  visibility: visible !important; /* ✅ Force visible */
}

/* Optimize Word - Holographic Blue */
.optimize-word {
  background: linear-gradient(45deg, #00d4ff, #3b82f6, #8b5cf6, #00d4ff);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: currentcolor;

  background-clip: text;
  animation: holographic-flow 4s ease-in-out infinite;
  filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
}

/* Your Word - Elegant Purple */
.your-word {
  background: linear-gradient(45deg, #8b5cf6, #a855f7, #c084fc, #8b5cf6);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: currentcolor;

  background-clip: text;
  animation: elegant-glow 3s ease-in-out infinite;
  filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.6));
}

/* PC Word - Electric Gold */
.pc-word {
  background: linear-gradient(45deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: currentcolor;

  background-clip: text;
  animation: electric-pulse 2s ease-in-out infinite;
  filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.9));
}

.letter {
  display: inline-block;
  animation: letter-entrance 1s ease-out both;
  animation-delay: var(--delay);
  transform-origin: center;
  transition: all 0.3s ease;
  position: relative;
  opacity: 1; /* ✅ Force visible */
  visibility: visible; /* ✅ Force visible */
}

.letter:hover {
  transform: scale(1.2) rotateY(15deg);
  text-shadow: 0 0 30px currentColor;
}

@keyframes letter-entrance {
  0% {
    opacity: 0;
    transform: translateY(100px) rotateX(90deg) scale(0.5);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-20px) rotateX(-10deg) scale(1.1);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg) scale(1);
  }
}

@keyframes holographic-flow {
  0%, 100% { 
    background-position: 0% 50%;
    filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8)) hue-rotate(0deg);
  }
  25% { 
    background-position: 100% 0%;
    filter: drop-shadow(0 0 30px rgba(0, 212, 255, 1)) hue-rotate(90deg);
  }
  50% { 
    background-position: 100% 100%;
    filter: drop-shadow(0 0 25px rgba(139, 92, 246, 0.9)) hue-rotate(180deg);
  }
  75% { 
    background-position: 0% 100%;
    filter: drop-shadow(0 0 35px rgba(59, 130, 246, 1)) hue-rotate(270deg);
  }
}

@keyframes elegant-glow {
  0%, 100% { 
    background-position: 0% 50%;
    transform: scale(1) rotateY(0deg);
  }
  50% { 
    background-position: 100% 50%;
    transform: scale(1.05) rotateY(5deg);
  }
}

@keyframes electric-pulse {
  0%, 100% { 
    background-position: 0% 50%;
    transform: scale(1);
    filter: drop-shadow(0 0 25px rgba(251, 191, 36, 0.9));
  }
  50% { 
    background-position: 100% 50%;
    transform: scale(1.1);
    filter: drop-shadow(0 0 40px rgba(251, 191, 36, 1)) drop-shadow(0 0 60px rgba(251, 191, 36, 0.6));
  }
}

/* Word Particles */
.word-particles {
  position: absolute;
  inset: -20px;
  pointer-events: none;
}

.word-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #00d4ff, transparent);
  border-radius: 50%;
  animation: particle-orbit 8s linear infinite;
}

@keyframes particle-orbit {
  0% { 
    transform: rotate(0deg) translateX(80px) rotate(0deg); 
    opacity: 0;
  }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { 
    transform: rotate(360deg) translateX(80px) rotate(-360deg); 
    opacity: 0;
  }
}

/* Connection Line */
.connection-line {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
  animation: line-expand 2s ease-out 1.5s forwards;
}

@keyframes line-expand {
  0% { width: 0; }
  100% { width: 120%; }
}

/* Energy Rings around PC */
.energy-rings {
  position: absolute;
  inset: -40px;
  pointer-events: none;
}

.energy-ring {
  position: absolute;
  inset: 0;
  border: 2px solid;
  border-radius: 50%;
  animation: ring-pulse 3s ease-in-out infinite;
}

.ring-1 {
  border-color: rgba(251, 191, 36, 0.6);
  animation-delay: 0s;
}

.ring-2 {
  border-color: rgba(251, 191, 36, 0.4);
  animation-delay: 1s;
  inset: -20px;
}

.ring-3 {
  border-color: rgba(251, 191, 36, 0.2);
  animation-delay: 2s;
  inset: -40px;
}

@keyframes ring-pulse {
  0%, 100% { 
    transform: scale(0.8); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 1; 
  }
}

/* Holographic Effect */
.hologram-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(0, 212, 255, 0.1) 50%, transparent 70%);
  animation: hologram-scan 3s linear infinite;
  pointer-events: none;
}

@keyframes hologram-scan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}

/* Animated Tagline */
.hero-tagline {
  position: relative;
  margin: 2rem 0;
}

.tagline-container {
  font-size: 1.5rem;
  font-weight: 600;
  color: #e0e7ff;
  text-align: center;
  font-family: 'Courier New', monospace;
}

.tagline-cursor {
  color: #00d4ff;
  animation: cursor-glow 1s ease-in-out infinite alternate;
}

@keyframes cursor-glow {
  0% { 
    opacity: 1; 
    text-shadow: 0 0 10px #00d4ff; 
  }
  100% { 
    opacity: 0.3; 
    text-shadow: 0 0 20px #00d4ff, 0 0 30px #00d4ff; 
  }
}

.tagline-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, rgba(0, 212, 255, 0.1), transparent);
  animation: tagline-breathe 4s ease-in-out infinite;
}

@keyframes tagline-breathe {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

/* Floating Tech Icons */
.floating-tech-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-tech-icon {
  position: absolute;
  color: rgba(59, 130, 246, 0.6);
  animation: tech-icon-float 6s ease-in-out infinite;
}

@keyframes tech-icon-float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
    opacity: 0.6; 
  }
  50% { 
    transform: translateY(-20px) rotate(180deg); 
    opacity: 1; 
  }
}

/* Morphing Subtitle */
.subtitle-morphing {
  margin: 3rem 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.morphing-text {
  font-size: 1.25rem;
  color: #cbd5e1;
  text-align: center;
  max-width: 800px;
  opacity: 0;
  animation: text-morph-in 1s ease-out forwards;
}

@keyframes text-morph-in {
  0% {
    opacity: 0;
    transform: scale(0.8) blur(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) blur(0px);
  }
}

/* Spectacular CTA Section */
.cta-spectacular {
  margin: 4rem 0;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  position: relative;
  overflow: hidden;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #e0e7ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.before-after {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.state-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  min-width: 200px;
  transition: all 0.3s ease;
}

.state-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.before-state {
  border-color: rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
}

.after-state {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.05);
}

.state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: icon-bounce 2s ease-in-out infinite;
}

@keyframes icon-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.state-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.state-desc {
  color: #cbd5e1;
  font-size: 0.875rem;
}

.transformation-arrow {
  position: relative;
}

.arrow-container {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transformation-svg {
  width: 48px;
  height: 48px;
  color: #fbbf24;
  animation: arrow-pulse 2s ease-in-out infinite;
}

@keyframes arrow-pulse {
  0%, 100% { 
    transform: scale(1); 
    color: #fbbf24; 
  }
  50% { 
    transform: scale(1.2); 
    color: #f59e0b; 
  }
}

.magic-sparkles {
  position: absolute;
  inset: 0;
}

.sparkle {
  position: absolute;
  font-size: 0.75rem;
  animation: sparkle-dance 3s ease-in-out infinite;
}

@keyframes sparkle-dance {
  0%, 100% { 
    transform: scale(0) rotate(0deg); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1) rotate(180deg); 
    opacity: 1; 
  }
}

/* Hero Section Animations */
.hero-section {
  animation: hero-fade-in 1.5s ease-out;
}

@keyframes hero-fade-in {
  0% { opacity: 0; transform: translateY(50px); }
  100% { opacity: 1; transform: translateY(0); }
}

.slide-in-up {
  animation: slide-in-up 1s ease-out 1s both;
}

@keyframes slide-in-up {
  0% { transform: translateY(50px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

/* Enhanced Terminal */
.terminal-window {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 136, 0.3);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.terminal-glow {
  border-color: rgba(0, 255, 136, 0.6);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.3), 0 20px 40px rgba(0, 0, 0, 0.3);
}

.terminal-header {
  background: rgba(30, 30, 30, 0.9);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 255, 136, 0.2);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.terminal-button.red { background: #ff5f56; }
.terminal-button.yellow { background: #ffbd2e; }
.terminal-button.green { background: #27ca3f; }

.terminal-button.pulse {
  animation: button-pulse 2s ease-in-out infinite;
}

@keyframes button-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

.terminal-title {
  color: #00ff88;
  font-size: 14px;
  font-weight: 600;
}

.terminal-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #00ff88;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.terminal-body {
  padding: 20px;
  font-family: 'Courier New', monospace;
}

.command-line {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.prompt {
  color: #00ff88;
  margin-right: 10px;
  font-weight: bold;
}

.command-text {
  color: #ffffff;
  font-size: 14px;
  word-break: break-all;
}

.command-cursor {
  color: #00ff88;
  animation: cursor-blink 1s infinite;
  margin-left: 2px;
}

@keyframes cursor-blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.copy-button {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 15px;
}

.copy-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
}

.copy-button.copied {
  background: linear-gradient(135deg, #10b981, #059669);
}

.ripple-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ripple-effect.active {
  width: 300px;
  height: 300px;
  animation: ripple 0.6s ease-out;
}

@keyframes ripple {
  0% { width: 0; height: 0; opacity: 1; }
  100% { width: 300px; height: 300px; opacity: 0; }
}

/* Enhanced Step Cards */
.step-card.enhanced {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 50px 32px 40px 32px;
  text-align: center;
  position: relative;
  overflow: visible;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: step-fade-in 0.8s ease-out both;
  margin-top: 30px;
}

@keyframes step-fade-in {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.step-card.enhanced:hover {
  transform: translateY(-15px) scale(1.02);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(59, 130, 246, 0.4);
}

.step-number-3d {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  animation: number-bounce 2s ease-in-out infinite;
  z-index: 10;
}

@keyframes number-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5px); }
}

.step-icon {
  margin: 20px auto;
  width: 80px;
  height: 80px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  transition: all 0.3s ease;
}

.icon-bounce {
  animation: icon-bounce-hover 0.6s ease-in-out;
}

@keyframes icon-bounce-hover {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.card-glow.active {
  opacity: 1;
}

/* Scroll Indicator */
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
}

.bounce-arrow {
  animation: bounce-arrow 2s ease-in-out infinite;
}

@keyframes bounce-arrow {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* Section Fade In */
.section-fade-in {
  animation: section-slide-up 1s ease-out;
}

@keyframes section-slide-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

.gradient-text-pulse {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-pulse 4s ease-in-out infinite;
}

@keyframes gradient-pulse {
  0%, 100% { background-position: 0% 50%; }
  25% { background-position: 100% 0%; }
  50% { background-position: 100% 100%; }
  75% { background-position: 0% 100%; }
}

.gradient-text-animated {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Enhanced Feature Cards */
.feature-card-3d {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: feature-fade-in 0.8s ease-out both;
  transform-style: preserve-3d;
}

@keyframes feature-fade-in {
  0% { opacity: 0; transform: translateY(50px) rotateX(30deg); }
  100% { opacity: 1; transform: translateY(0) rotateX(0deg); }
}

.feature-card-3d:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(5deg);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-icon-3d {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: white;
  position: relative;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.icon-float {
  animation: icon-float-gentle 3s ease-in-out infinite;
}

@keyframes icon-float-gentle {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-5px) rotate(5deg); }
}

.feature-item {
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.feature-item:hover {
  transform: translateX(5px);
  color: #ffffff;
}

.bullet {
  color: #3b82f6;
  margin-right: 8px;
  font-weight: bold;
}

.feature-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), transparent);
  border-radius: 24px;
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: -1;
  animation: glow-rotate 4s linear infinite;
}

@keyframes glow-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.feature-glow.active {
  opacity: 1;
}

/* Enhanced Stats Cards */
.stat-card-enhanced {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  animation: stat-fade-in 1s ease-out both;
}

@keyframes stat-fade-in {
  0% { opacity: 0; transform: translateY(30px) scale(0.9); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.stat-card-enhanced:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  animation: stat-icon-pulse 2s ease-in-out infinite;
}

@keyframes stat-icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  animation: number-glow 2s ease-in-out infinite alternate;
}

@keyframes number-glow {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.2); }
}

.stat-label {
  color: white;
  font-weight: 700;
  font-size: 18px;
  margin-bottom: 8px;
}

.stat-desc {
  color: #93c5fd;
  font-size: 14px;
  margin-bottom: 16px;
}

.stat-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
  transition: width 2s ease-out;
  animation: progress-glow 2s ease-in-out infinite alternate;
}

@keyframes progress-glow {
  0% { box-shadow: none; }
  100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.6); }
}

/* Demo Terminal */
.demo-terminal {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 136, 0.4);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 800px;
  margin: 0 auto;
}

.demo-terminal:hover {
  border-color: rgba(0, 255, 136, 0.7);
  box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
}

.terminal-content {
  padding: 24px;
  font-family: 'Courier New', monospace;
  min-height: 200px;
}

.demo-line {
  margin-bottom: 8px;
  font-size: 14px;
  animation: demo-line-fade 0.5s ease-out both;
}

@keyframes demo-line-fade {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

.demo-cursor {
  margin-top: 16px;
  display: flex;
  align-items: center;
}

.typing-demo {
  color: white;
}

.cursor-blink {
  color: #00ff88;
  animation: cursor-blink 1s infinite;
  margin-left: 4px;
}

/* Enhanced FAQ */
.faq-item-enhanced {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.faq-item-enhanced:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
}

.faq-item-enhanced.open {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.4);
}

.faq-question {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  color: #3b82f6;
}

.faq-icon.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-answer.expanded {
  max-height: 200px;
  padding: 0 24px 24px;
}

/* Enhanced CTA */
.gradient-text-mega {
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ef4444);
  background-size: 600% 600%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: mega-gradient 6s ease-in-out infinite;
}

@keyframes mega-gradient {
  0%, 100% { background-position: 0% 50%; }
  16% { background-position: 100% 0%; }
  33% { background-position: 100% 100%; }
  50% { background-position: 50% 100%; }
  66% { background-position: 0% 100%; }
  83% { background-position: 0% 0%; }
}

.cta-terminal {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(0, 255, 136, 0.5);
  border-radius: 20px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
}

.command-display {
  padding: 20px;
  font-family: 'Courier New', monospace;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.prompt-cta {
  color: #00ff88;
  font-weight: bold;
}

.command-text-cta {
  color: white;
  font-size: 14px;
  word-break: break-all;
}

.cta-button.mega-button {
  width: 100%;
  padding: 20px 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4);
  background-size: 200% 200%;
  border: none;
  color: white;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  animation: mega-button-glow 3s ease-in-out infinite;
}

@keyframes mega-button-glow {
  0%, 100% { 
    background-position: 0% 50%;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
  }
  50% { 
    background-position: 100% 50%;
    box-shadow: 0 15px 40px rgba(139, 92, 246, 0.6);
  }
}

.cta-button.mega-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(59, 130, 246, 0.6);
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle-cta {
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  animation: particle-burst 2s ease-out infinite;
}

.particle-cta:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
.particle-cta:nth-child(2) { top: 80%; left: 20%; animation-delay: 0.3s; }
.particle-cta:nth-child(3) { top: 30%; right: 15%; animation-delay: 0.6s; }
.particle-cta:nth-child(4) { bottom: 20%; right: 10%; animation-delay: 0.9s; }
.particle-cta:nth-child(5) { top: 60%; left: 50%; animation-delay: 1.2s; }
.particle-cta:nth-child(6) { bottom: 40%; right: 40%; animation-delay: 1.5s; }

@keyframes particle-burst {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

.button-glow-mega {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 20px;
  animation: mega-glow-rotate 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-button.mega-button:hover .button-glow-mega {
  opacity: 1;
}

@keyframes mega-glow-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Footer Animations */
.footer-logo {
  animation: footer-slide-up 1s ease-out;
}

@keyframes footer-slide-up {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.logo-pulse {
  animation: logo-pulse 2s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.fade-in-text {
  animation: fade-in-text 1s ease-out 0.5s both;
}

@keyframes fade-in-text {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

/* Fixed Notification Toast */
.notification-toast {
  position: fixed;
  top: 30px;
  right: 30px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  z-index: 10000;
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
  animation: toast-slide-in 0.4s ease-out forwards;
}

@keyframes toast-slide-in {
  0% { 
    transform: translateX(300px); 
    opacity: 0; 
  }
  100% { 
    transform: translateX(0); 
    opacity: 1; 
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title-3d {
    font-size: clamp(2rem, 12vw, 4rem);
    gap: 0.5rem;
  }
  
  .before-after {
    flex-direction: column;
    gap: 2rem;
  }
  
  .transformation-arrow {
    transform: rotate(90deg);
  }
  
  .cta-spectacular {
    padding: 2rem 1rem;
  }
  
  .stat-number {
    font-size: 2.5rem;
  }
  
  .floating-orb {
    opacity: 0.4;
  }
  
  .step-card.enhanced,
  .feature-card-3d,
  .stat-card-enhanced {
    padding: 24px;
  }
  
  .terminal-window,
  .demo-terminal,
  .cta-terminal {
    margin: 0 16px;
  }
  
  .command-text,
  .command-text-cta {
    font-size: 12px;
  }
  
  .step-number-3d {
    width: 45px;
    height: 45px;
    font-size: 18px;
    top: -22px;
  }
  
  .gradient-text-mega {
    font-size: 2.5rem;
  }
}

/* Loading States */
.loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Performance Optimizations */
.floating-orb,
.particle,
.floating-icon {
  will-change: transform;
}

.gradient-text-animated,
.gradient-text-pulse,
.gradient-text-mega {
  will-change: background-position;
}



/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}
</style>
