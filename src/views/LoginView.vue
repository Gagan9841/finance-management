<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="flex-1 flex items-center justify-center p-8 bg-background">
      <div class="w-full max-w-md space-y-8">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span class="text-primary-foreground font-bold text-sm">m</span>
          </div>
          <span class="text-xl font-semibold text-foreground">Maglo.</span>
        </div>

        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-foreground">Welcome back</h1>
          <p class="text-muted-foreground">Welcome back! Please enter your details</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="email" class="block text-sm font-medium text-foreground">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Enter your email"
              class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="block text-sm font-medium text-foreground">Password</Label>
            <Input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="*****"
              class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <Checkbox
                id="remember"
                v-model="form.rememberMe"
                class="w-4 h-4 bg-background leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              />
              <Label for="remember" class="text-sm text-muted-foreground"
                >Remember for 30 Days</Label
              >
            </div>
            <Button
              variant="link"
              class="text-sm cursor-pointer text-muted-foreground hover:text-foreground transition-colors underline"
              size="sm"
              @click="handleForgotPassword"
            >
              Forgot password
            </Button>
          </div>

          <Button
            type="submit"
            class="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Sign in
          </Button>

          <div class="text-center">
            <span class="text-sm text-muted-foreground">Don't have an account? </span>
            <router-link
              :to="{ name: 'auth.register' }"
              class="text-sm font-medium cursor-pointer text-primary hover:text-primary/90 underline decoration-primary decoration-2 underline-offset-2 transition-colors"
            >
              Sign up for free
            </router-link>
          </div>
        </form>
      </div>
    </div>

    <div
      class="hidden lg:flex items-center justify-center overflow-hidden h-screen flex-1 bg-muted"
    >
      <img
        alt="Hand holding clock"
        src="../assets/images/login-overlay.png"
        class="h-full w-full object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { login } from '@/api/auth'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import encryption from '@/utils/encryption'

const { setUser, setToken } = useAuthStore()

const router = useRouter()
const route = useRoute()

const form = reactive({
  email: route.query.email ? encryption.decrypt(decodeURIComponent(route.query.email)) : '',
  password: '',
  rememberMe: false,
})

const handleSubmit = async () => {
  try {
    const response = await login(form)
    setUser(response.data.user)
    setToken(response.data.token)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const redirect = route.query.redirect || { name: 'home' }
    await router.push(redirect)
  } catch (error) {
    console.error('Login error:', error)
  }
}

const handleForgotPassword = () => {
  console.log('Forgot password clicked')
}
</script>
