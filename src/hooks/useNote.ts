import type { Note, UserData } from '../types'
import type { JSONContent } from '@tiptap/vue-3'
import type { Ref } from 'vue'
import { computed, ref } from 'vue'
import { AES, enc } from 'crypto-js'
import { debounce } from '../utils/debounce'
import Storage from '../utils/Storage'

const STORAGE_KEY = 'notecrypt_notes'
function LoadNotes ({ username, passphrase }: UserData) {
  const accessId = `${username}:${STORAGE_KEY}`
  const noteIds = Storage.get<string[]>(accessId, [])
  const notes: Record<string, Note> = {}
  for (const noteId of noteIds) {
    const encryptedNote = Storage.get<string>(`${accessId}:${noteId}`)
    const note: Note = JSON.parse(AES.decrypt(encryptedNote, passphrase).toString(enc.Utf8))
    notes[noteId] = {
      ...note,
      updatedAt: new Date(note.updatedAt).getTime()
    }
  }
  return notes
}

const SaveNote = debounce((note: Note, { username, passphrase }: UserData) => {
  const accessId = `${username}:${STORAGE_KEY}`
  const noteIds = Storage.get<string[]>(accessId, [])
    .filter(noteId => noteId !== note.id)
  noteIds.push(note.id)
  Storage.set(accessId, noteIds)

  const encryptedNote = AES.encrypt(JSON.stringify(note), passphrase).toString()
  Storage.set(`${accessId}:${note.id}`, encryptedNote)
}, 800)

function RemoveNote (id: string, { username }: UserData) {
  const accessId = `${username}:${STORAGE_KEY}`
  const noteIds = Storage.get<string[]>(accessId, [])
    .filter((noteId) => noteId !== id)

  Storage.set(accessId, noteIds)
  Storage.remove(`${accessId}:${id}`)
}

interface useNoteResponse {
  notes: Ref<Record<string, Note>>
  activeNote: Ref<Note | null>
  activeNoteId: Ref<string | null>
  onCreateNote: () => void
  onDeleteNote: (id: string) => void
  onChangeActiveNote: (id: string) => void
  onChangeContent: (id: string, content: JSONContent, title?: string) => void
}
export function useNote (userData: UserData): useNoteResponse {
  const notes = ref<Record<string, Note>>(LoadNotes(userData))
  const activeNoteId = ref<string | null>(null)
  const activeNote = computed(() => {
    return (activeNoteId.value != null)
      ? notes.value[activeNoteId.value]
      : null
  })

  function createNote () {
    const note = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      content: 'Untitled',
      updatedAt: Date.now()
    }
    notes.value[note.id] = note
    activeNoteId.value = note.id
    SaveNote(note, userData)
  }

  function deleteNote (id: string) {
    if (activeNoteId.value === id) {
      activeNoteId.value = null
    }
    // remove note from notes without mutating the original notes
    const { [id]: _, ...newNotes } = notes.value
    notes.value = newNotes
    RemoveNote(id, userData)
  }

  function changeActiveNote (id: string) {
    activeNoteId.value = id
  }

  function changeNoteContent (id: string, content: JSONContent, title = 'Untitled') {
    const updatedNote = {
      ...notes.value[id],
      title,
      content,
      updatedAt: Date.now()
    }
    notes.value[id] = updatedNote
    SaveNote(updatedNote, userData)
  }

  return {
    notes,
    activeNote,
    activeNoteId,
    onCreateNote: createNote,
    onDeleteNote: deleteNote,
    onChangeActiveNote: changeActiveNote,
    onChangeContent: changeNoteContent
  }
}
