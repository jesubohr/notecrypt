<script setup lang="ts">
import type { UserData } from '../types'
import { ref } from 'vue'
import { AES, enc } from 'crypto-js'
import Storage from '../utils/Storage'

const PASSPHRASE_STORAGE_KEY = 'passphrase'

interface LoginPageProps {
  setUserData: (userData: UserData) => void
}

const props = defineProps<LoginPageProps>()

const username = ref('')
const password = ref('')
const error = ref<string | null>(null)

function handleSubmit(event: Event) {
  event.preventDefault()
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields'
    return
  }
  const encryptedPassphrase = Storage.get<string | undefined>(`${username.value}-${PASSPHRASE_STORAGE_KEY}`)
  if (!encryptedPassphrase) {
    const passphrase = crypto.randomUUID()
    const encrypted = AES.encrypt(passphrase, password.value).toString()

    Storage.set(`${username.value}-${PASSPHRASE_STORAGE_KEY}`, encrypted)
    Storage.set(`current-username`, username.value)
    props.setUserData({
      username: username.value,
      passphrase
    })
    return
  }

  const passphrase = AES.decrypt(encryptedPassphrase, password.value).toString(enc.Utf8)
  if (!passphrase) {
    error.value = 'Invalid credentials'
    return
  }

  props.setUserData({
    username: username.value,
    passphrase
  })
}
</script>

<template>
  <div className="flex items-center justify-center w-full h-screen overflow-auto">
    <form @submit.prevent="handleSubmit" className="flex flex-col gap-4 max-w-sm w-full text-neutral-700 dark:text-white">
      <div v-if="error" className="py-2 px-3 bg-red-200 rounded-md text-red-900 font-medium">
        {{ error }}
      </div>
      <label htmlFor="username">
        <span className="mb-1 text-lg font-medium">Username</span>
        <input type="text" name="username" id="username" placeholder="johndoe"
          className="py-2 px-3 w-full border border-neutral-400 text-lg placeholder:text-neutral-500 focus:outline-none focus-visible:border-accent focus-visible:shadow-md shadow-accent transition-colors"
          v-model="username" />
      </label>
      <label htmlFor="password">
        <span className="mb-1 text-lg font-medium">Password</span>
        <input type="password" name="password" id="password" placeholder="********"
          className="py-2 px-3 w-full border border-neutral-400 text-lg placeholder:text-neutral-500 focus:outline-none focus-visible:border-accent focus-visible:shadow-md shadow-accent transition-colors"
          v-model="password" />
      </label>
      <button type="submit"
        className="py-2 px-5 bg-accent text-white text-lg hover:bg-dark-accent dark:bg-dark-accent dark:hover:bg-accent outline-2 outline-offset-2 outline-accent transition-colors ease-in-out">
        Login
      </button>
    </form>
  </div>
</template>
