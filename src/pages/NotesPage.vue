<script setup lang="ts">
import type { Note } from '../types'
import { ref } from 'vue'
import NoteList from '../components/NoteList.vue'
defineProps()

const noteList = ref<Note[]>([
  {
    id: '1',
    title: 'Note 1',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget fermentum aliquet, nisl nisl ultrices nunc, eget aliquam ni nisi quis nisl. Donec euismod, nisl eget fermentum aliquet, nisl nisl ultrices nunc, eget aliquam ni nisi quis nisl.',
    updatedAt: Date.now(),
  },
])
const activeNoteId = ref<string | null>(null)
function onChangeActiveNote(id: string) {
  activeNoteId.value = id
}
function onDeleteNote(id: string) {
  noteList.value = noteList.value.filter(note => note.id !== id)
  if (activeNoteId.value === id) {
    activeNoteId.value = null
  }
}
</script>

<template>
  <aside class="flex flex-col gap-2 p-2 w-60 h-screen border-r-2 border-neutral-300 dark:border-neutral-600 overflow-auto">
    <button
      type="button"
      class="py-1 px-2.5 border-2 border-neutral-300 rounded shadow-sm text-neutral-700 text-lg font-bold cursor-pointer hover:shadow-lg active:shadow-inner-md dark:text-white transition-shadow ease-in-out"
    >New Note</button>
    <NoteList
      :notes="noteList"
      :activeNoteId="activeNoteId"
      :onChangeActiveNote="onChangeActiveNote"
      :onDeleteNote="onDeleteNote"
    />
  </aside>
  <main class="grow h-screen font-sans overflow-hidden">
    <div v-if="activeNoteId"></div>
    <div v-else class="flex flex-col items-center justify-center gap-6 p-5 h-full">
      <h2 class="max-w-[20ch] text-5xl text-center font-title text-neutral-800 dark:text-white">
        Create a new note or select an existing one
      </h2>
      <img src="/add-note.png" alt="Women adding a note" width="384" class="w-96">
    </div>
  </main>
</template>
