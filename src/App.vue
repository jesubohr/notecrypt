<script setup lang="ts">
import type { UserData } from './types'
import { ref } from 'vue'
import Storage from './utils/Storage'
import NotesPage from './pages/NotesPage.vue'
import LoginPage from './pages/LoginPage.vue'

const PASSPHRASE_STORAGE_KEY = 'passphrase'

const savedUserName = Storage.get<string>('current-username')
const userPassphrase = Storage.get<string>(`${savedUserName}-${PASSPHRASE_STORAGE_KEY}`, '')
const userData = ref<UserData | null>({ username: savedUserName, passphrase: userPassphrase })

function setUserData(updatedUserData: UserData) {
  userData.value = updatedUserData
}
</script>

<template>
  <NotesPage v-if="userData" :user-data="userData" />
  <LoginPage v-else :set-user-data="setUserData" />
</template>
