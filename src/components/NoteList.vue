<script setup lang="ts">
import type { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  activeNoteId: string | null
  onChangeActiveNote: (id: string) => void
  onDeleteNote: (id: string) => void
}
defineProps<NoteListProps>()
</script>

<template>
  <ul className="flex flex-col gap-1 py-2 overflow-auto">
    <li v-for="note in notes" role="button" tabindex="0"
      class="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-neutral-200 focus:bg-neutral-300 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700 transition-colors"
      :class="{
        'bg-neutral-200 dark:bg-neutral-600': activeNoteId === note.id
      }"
      @click="() => onChangeActiveNote(note.id)"
    >
      <span class="grow max-w-[20ch] text-ellipsis whitespace-nowrap overflow-hidden">
        {{ note.title }}
      </span>
      <button
        type="button"
        title="Delete note"
        class="justify-self-end p-1.5 text-neutral-500 hover:text-neutral-800 focus:text-neutral-800 dark:text-neutral-400 dark:hover:text-white dark:focus:text-white transition-colors"
        @click="() => onDeleteNote(note.id)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M4 7l16 0"></path>
          <path d="M10 11l0 6"></path>
          <path d="M14 11l0 6"></path>
          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
        </svg>
      </button>
    </li>
  </ul>
</template>
