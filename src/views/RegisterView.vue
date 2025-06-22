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
          <h1 class="text-3xl font-bold text-foreground">Create an account</h1>
          <p class="text-muted-foreground">Enter your details to create your account</p>
        </div>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="space-y-2">
            <Label for="name" class="block text-sm font-medium text-foreground">Full Name</Label>
            <Input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Enter your full name"
              class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
              required
            />
          </div>

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
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="confirmPassword" class="block text-sm font-medium text-foreground"
              >Confirm Password</Label
            >
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-background"
              required
            />
          </div>

          <div class="flex items-center space-x-2">
            <Input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              class="w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary focus:ring-2"
              required
            />
            <Label for="terms" class="text-sm text-muted-foreground">
              I agree to the
              <Button
                variant="link"
                class="text-sm cursor-pointer text-primary hover:text-primary/90 transition-colors underline"
                size="sm"
                @click="handleTermsClick"
              >
                Terms of Service
              </Button>
              and
              <Button
                variant="link"
                class="text-sm cursor-pointer text-primary hover:text-primary/90 transition-colors underline"
                size="sm"
                @click="handlePrivacyClick"
              >
                Privacy Policy
              </Button>
            </Label>
          </div>

          <Button
            type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Create Account
          </Button>

          <div class="text-center">
            <span class="text-sm text-muted-foreground">Already have an account? </span>
            <router-link
              :to="{ name: 'auth.login' }"
              class="text-sm font-medium cursor-pointer text-primary hover:text-primary/90 underline decoration-primary decoration-2 underline-offset-2 transition-colors"
            >
              Sign in
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
import { useRouter } from 'vue-router'
import { register } from '@/api/auth'
import encryption from '@/utils/encryption'

const router = useRouter()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const handleSubmit = async () => {
  try {
    await register(form).then((res) => {
      router.push({
        name: 'auth.login',
        query: { email: encodeURIComponent(encryption.encrypt(res.data.email)) },
      })
    })
  } catch (error) {
    console.error('Registration error:', error)
  }
}

const handleTermsClick = () => {
  console.log('Terms of Service clicked')
}

const handlePrivacyClick = () => {
  console.log('Privacy Policy clicked')
}
</script>
