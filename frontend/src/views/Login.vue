<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4 overflow-hidden relative">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Floating Orbs -->
      <div class="floating-orb orb-1"></div>
      <div class="floating-orb orb-2"></div>
      <div class="floating-orb orb-3"></div>
      <div class="floating-orb orb-4"></div>
      <div class="floating-orb orb-5"></div>
      
      <!-- Animated Grid -->
      <div class="animated-grid"></div>
      
      <!-- Particle System -->
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- Main Login Container -->
    <div class="max-w-md w-full z-10 relative">
      <!-- Animated Logo Section -->
      <div class="text-center mb-8 login-header">
        <div class="mx-auto w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl logo-container">
          <svg class="w-10 h-10 text-blue-600 logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          <!-- Animated Ring -->
          <div class="absolute inset-0 rounded-3xl border-2 border-blue-400 ring-animation"></div>
        </div>
        <h1 class="text-4xl font-bold text-white mb-2 title-glow">PC Optimizer</h1>
        <p class="text-blue-200 subtitle-fade">Admin Dashboard</p>
        
        <!-- Typing Animation -->
        <div class="typing-animation mt-4">
          <span class="text-green-400 text-sm font-mono">{{ typedText }}</span>
          <span class="cursor">|</span>
        </div>
      </div>

      <!-- Login Form with Glass Effect -->
      <div class="login-form-container">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username Field -->
          <div class="input-group">
            <label class="block text-sm font-medium text-white mb-2 label-slide">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Username
            </label>
            <div class="relative">
              <input
                v-model="username"
                type="text"
                required
                class="input-field"
                placeholder="Enter your username"
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
              <div class="input-border"></div>
            </div>
          </div>

          <!-- Password Field -->
          <div class="input-group">
            <label class="block text-sm font-medium text-white mb-2 label-slide">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Password
            </label>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="input-field"
                placeholder="Enter your password"
                @focus="onInputFocus"
                @blur="onInputBlur"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 105.586 5.586m0 0L17.5 17.5M12.8 12.8l4.7 4.7"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </button>
              <div class="input-border"></div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="submit-button"
          >
            <span v-if="!loading" class="button-content">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Sign In
            </span>
            <span v-else class="button-loading">
              <div class="loading-spinner"></div>
              Signing in...
            </span>
          </button>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>
        </form>

        <!-- Role Information -->
        <div class="role-info">
          <h3 class="text-sm font-medium text-white mb-3 flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Access Levels:
          </h3>
          <div class="space-y-2 text-xs text-blue-200">
            <div class="flex items-center role-item">
              <span class="role-dot bg-red-400"></span>
              <span><strong>Admin:</strong> Full system access</span>
            </div>
            <div class="flex items-center role-item">
              <span class="role-dot bg-blue-400"></span>
              <span><strong>Operator:</strong> License management</span>
            </div>
            <div class="flex items-center role-item">
              <span class="role-dot bg-gray-400"></span>
              <span><strong>Viewer:</strong> Read-only access</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 footer-fade">
        <p class="text-blue-300/70 text-sm">
          © 2025 PC Optimizer. Secure License Management Platform.
        </p>
      </div>
    </div>

    <!-- Success Animation Overlay -->
    <div v-if="showSuccessAnimation" class="success-overlay">
      <div class="success-checkmark">
        <svg class="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

export default {
  setup() {
    const router = useRouter()
    const { login } = useAuth()
    
    const username = ref('')
    const password = ref('')
    const loading = ref(false)
    const error = ref('')
    const showPassword = ref(false)
    const showSuccessAnimation = ref(false)
    
    // Typing animation
    const typedText = ref('')
    const fullText = 'System.login() -> Authenticating...'
    let typingIndex = 0
    let typingInterval = null

    // Particle animation
    const getParticleStyle = (index) => {
      return {
        '--delay': `${index * 0.2}s`,
        '--duration': `${3 + Math.random() * 2}s`,
        '--x': `${Math.random() * 100}%`,
        '--y': `${Math.random() * 100}%`
      }
    }

    const startTypingAnimation = () => {
      typingInterval = setInterval(() => {
        if (typingIndex < fullText.length) {
          typedText.value += fullText[typingIndex]
          typingIndex++
        } else {
          // Reset and restart
          setTimeout(() => {
            typedText.value = ''
            typingIndex = 0
          }, 2000)
        }
      }, 100)
    }

    const togglePassword = () => {
      showPassword.value = !showPassword.value
    }

    const onInputFocus = (event) => {
      event.target.parentElement.classList.add('input-focused')
    }

    const onInputBlur = (event) => {
      event.target.parentElement.classList.remove('input-focused')
    }

    const handleLogin = async () => {
      loading.value = true
      error.value = ''

      try {
        const result = await login(username.value, password.value)
        
        if (result.success) {
          showSuccessAnimation.value = true
          
          // Wait for success animation then navigate
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          error.value = result.error || 'Login failed'
          // Shake animation for error
          document.querySelector('.login-form-container').classList.add('shake')
          setTimeout(() => {
            document.querySelector('.login-form-container').classList.remove('shake')
          }, 500)
        }
      } catch (err) {
        error.value = 'Network error. Please try again.'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      startTypingAnimation()
    })

    onUnmounted(() => {
      if (typingInterval) {
        clearInterval(typingInterval)
      }
    })

    return {
      username,
      password,
      loading,
      error,
      showPassword,
      showSuccessAnimation,
      typedText,
      getParticleStyle,
      togglePassword,
      onInputFocus,
      onInputBlur,
      handleLogin
    }
  }
}
</script>

<style scoped>
/* Floating Orbs Animation */
.floating-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3));
  filter: blur(1px);
  animation: float 6s ease-in-out infinite;
}

.orb-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.orb-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 10%;
  animation-delay: 2s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

.orb-4 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 30%;
  animation-delay: 3s;
}

.orb-5 {
  width: 120px;
  height: 120px;
  bottom: 40%;
  right: 50%;
  animation-delay: 1.5s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
  33% { transform: translateY(-30px) translateX(20px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(20px) translateX(-15px) rotate(240deg) scale(0.9); }
}

/* Animated Grid Background */
.animated-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* Particle System */
.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: particle-float var(--duration, 4s) linear infinite;
  animation-delay: var(--delay, 0s);
  left: var(--x, 50%);
  top: var(--y, 50%);
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(-10px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(10px) scale(1);
  }
  90% {
    opacity: 1;
    transform: translateY(-10vh) translateX(-5px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20vh) translateX(5px) scale(0);
  }
}

/* Login Header Animations */
.login-header {
  animation: slideDown 1s ease-out;
}

.logo-container {
  animation: logoFloat 3s ease-in-out infinite;
  position: relative;
}

.logo-icon {
  animation: logoRotate 4s linear infinite;
}

.ring-animation {
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes logoRotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes ringPulse {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.7;
  }
  50% { 
    transform: scale(1.1);
    opacity: 0.3;
  }
}

.title-glow {
  animation: textGlow 2s ease-in-out infinite alternate;
}

@keyframes textGlow {
  0% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  100% { text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 40px rgba(147, 51, 234, 0.4); }
}

.subtitle-fade {
  animation: fadeInUp 1s ease-out 0.5s both;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Typing Animation */
.typing-animation {
  animation: fadeInUp 1s ease-out 1s both;
}

.cursor {
  animation: blink 1s linear infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Form Container */
.login-form-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: formSlideIn 1s ease-out 0.3s both;
}

@keyframes formSlideIn {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Input Styles */
.input-group {
  position: relative;
}

.label-slide {
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.input-field {
  width: 100%;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-field:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.8);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.input-focused .input-border {
  width: 100%;
}

/* Submit Button */
.submit-button {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 16px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.submit-button:hover::before {
  left: 100%;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error Message */
.error-message {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  padding: 12px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  animation: errorSlideIn 0.3s ease-out;
}

@keyframes errorSlideIn {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Role Information */
.role-info {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  animation: fadeInUp 1s ease-out 0.8s both;
}

.role-item {
  animation: slideInRight 0.6s ease-out;
  transition: transform 0.2s ease;
}

.role-item:hover {
  transform: translateX(5px);
}

.role-item:nth-child(1) { animation-delay: 0.1s; }
.role-item:nth-child(2) { animation-delay: 0.2s; }
.role-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.role-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* Footer */
.footer-fade {
  animation: fadeInUp 1s ease-out 1.2s both;
}

/* Success Animation */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.success-checkmark {
  background: rgba(34, 197, 94, 0.2);
  border: 2px solid #22c55e;
  border-radius: 50%;
  padding: 20px;
  animation: successBounce 0.6s ease-out;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes successBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .login-form-container {
    margin: 16px;
    padding: 24px;
  }
  
  .floating-orb {
    opacity: 0.5;
  }
  
  .orb-1, .orb-2 {
    width: 120px;
    height: 120px;
  }
}
</style>
