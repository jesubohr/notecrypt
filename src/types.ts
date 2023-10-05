import type { Content } from '@tiptap/vue-3'

export interface Note {
  id: string
  title: string
  content: Content
  updatedAt: number
}

export interface UserData {
  username: string
  passphrase: string
}
