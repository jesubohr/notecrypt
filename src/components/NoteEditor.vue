<script setup lang="ts">
import type { Note } from '../types'
import type { JSONContent } from '@tiptap/vue-3'
import { useEditor, EditorContent, generateText } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { watch } from 'vue';

interface NoteEditorProps {
  activeNote: Note
  onChange: (content: JSONContent, title?: string) => void
}
const props = defineProps<NoteEditorProps>()

const extensions = [StarterKit]
const editor = useEditor({
  extensions,
  content: props.activeNote.content,
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const editorContent = editor.getJSON()
    const firstNodeContent = editorContent.content?.[0]
    props.onChange(
      editorContent,
      firstNodeContent && generateText(firstNodeContent, extensions)
    )
  }
})

watch(() => props.activeNote.content, (newContent, oldContent) => {
  if (newContent !== oldContent) {
    editor.value?.chain().setContent(newContent).run()
  }
})

function toggleBold() {
  editor.value?.chain().focus().toggleBold().run()
}
function toggleItalic() {
  editor.value?.chain().focus().toggleItalic().run()
}
function toggleStrike() {
  editor.value?.chain().focus().toggleStrike().run()
}
</script>

<template>
  <section class="flex flex-col h-full">
    <header class="flex items-center gap-2 p-2 border-b-2 border-neutral-300 dark:border-neutral-600 text-2xl">
      <button type="button" title="Bold" @click="toggleBold"
        class="py-1 px-2.5 text-neutral-800 border-none rounded cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-white"
        :class="{
          'bg-neutral-300 dark:bg-neutral-500': editor?.isActive('bold')
        }">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-bold" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z"></path>
          <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7"></path>
        </svg>
      </button>
      <button type="button" title="Italic" @click="toggleItalic"
        class="py-1 px-2.5 text-neutral-800 border-none rounded cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-white"
        :class="{
          'bg-neutral-300 dark:bg-neutral-500': editor?.isActive('italic')
        }">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-italic" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M11 5l6 0"></path>
          <path d="M7 19l6 0"></path>
          <path d="M14 5l-4 14"></path>
        </svg>
      </button>
      <button type="button" title="Strike" @click="toggleStrike"
        class="py-1 px-2.5 text-neutral-800 border-none rounded cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-500 dark:text-white"
        :class="{
          'bg-neutral-300 dark:bg-neutral-500': editor?.isActive('strike')
        }">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-strikethrough" width="24" height="24"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 12l14 0"></path>
        <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5"></path>
      </svg>
    </button>
  </header>
  <EditorContent :editor="editor" class="flex flex-col py-4 px-6 font-body overflow-y-auto" />
</section></template>
