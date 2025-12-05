// 消息存储,用zustand
import type { MessageList } from '@/api/messageApi'
import { getMessageList } from '@/api/messageApi'
import { create } from 'zustand'

interface MessageStore {
  messages: MessageList[]
  unReadCount: number
  setUnReadCount: (count: number) => void
  setMessage: (message: MessageList[]) => void
  getUnReadMessageCount: () => Promise<void>
}

export const useMessageStore = create<MessageStore>(set => ({
  messages: [],
  unReadCount: 0,
  setUnReadCount: count => set({ unReadCount: count }),
  setMessage: message => set(() => ({ messages: message })),
  getUnReadMessageCount: async () => {
    const res = await getMessageList({
      page: '1',
      pageSize: '10'
    })
    set({
      messages: res.data?.list || [],
      unReadCount: res.data?.unread || 0
    })
  }
}))
