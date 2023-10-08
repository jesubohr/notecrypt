<script setup lang="ts">
import type { UserData } from '../types'
import { computed } from 'vue'
import NoteList from '../components/NoteList.vue'
import NoteEditor from '../components/NoteEditor.vue'
import { useNote } from '../hooks/useNote'

const props = defineProps<{ userData: UserData }>()
const {
  notes,
  activeNote,
  activeNoteId,
  onCreateNote,
  onDeleteNote,
  onChangeActiveNote,
  onChangeContent,
} = useNote(props.userData)

const noteList = computed(() => {
  return Object.values(notes.value)
    .sort((a, b) => b.updatedAt - a.updatedAt)
})
</script>

<template>
  <aside
    class="flex flex-col gap-2 p-2 min-h-[134px] md:min-w-[15rem] md:h-screen border-b-2 md:border-b-0 md:border-r-2 border-neutral-300 dark:border-neutral-600 overflow-auto">
    <button type="button"
      class="py-1 px-2.5 border-2 border-neutral-300 rounded shadow-sm text-neutral-700 text-lg font-bold cursor-pointer hover:shadow-lg active:shadow-inner-md dark:text-white transition-shadow ease-in-out"
      @click="onCreateNote">New Note</button>
    <NoteList
      :notes="noteList"
      :activeNoteId="activeNoteId"
      :onChangeActiveNote="onChangeActiveNote"
      :onDeleteNote="onDeleteNote"
    />
  </aside>
  <main class="grow md:h-screen font-sans overflow-hidden">
    <NoteEditor
      v-if="activeNote != null"
      :activeNote="activeNote"
      :onChange="(content, title) => onChangeContent(activeNoteId as string, content, title)"
    />
    <div v-else class="flex flex-col items-center justify-center gap-6 p-5 w-full h-full">
      <h2 class="max-w-[20ch] text-5xl text-center font-title text-neutral-800 dark:text-white">
        Create a new note or select an existing one
      </h2>
      <img src="/add-note.png" alt="Women adding a note" width="384" class="w-96">
    </div>
  </main>
</template>
