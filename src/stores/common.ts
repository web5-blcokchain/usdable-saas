import type { CaseListData } from '@/api/lawyerWorkbenchApi'
import { create } from 'zustand'

export interface CommonStore {
  caseListData: CaseListData | null
  setCaseListData: (data: CaseListData | null) => void
}

export const useCommonStore = create<CommonStore>(set => ({
  caseListData: null,
  setCaseListData: data => set({ caseListData: data })
}))
