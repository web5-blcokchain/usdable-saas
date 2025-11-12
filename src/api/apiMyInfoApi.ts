import type { AccountType } from '@/enums/create-account.ts'
import apiClient from './client'

export interface RegisterParams {
  mobile?: string
  email?: string
  password?: string
  wallet_address?: string
  type: AccountType
  id_card_front_url?: string
  id_card_back_url?: string
  address_url?: string
  photo_url?: string
  business_registration_document?: string
  shareholder_structure_url?: string
  legal_representative_documents_url?: string
  financial_documents_url?: string
  token?: string
  username?: string
  id_number?: string
  property_type?: number
  area?: number
  appraisement?: number
  prove_url?: string
}
export interface UserResponse {
  id: number
  nickname: string
  email: string
  mobile: string
  avatar: string
  gender: number
  address: string
  audit_status: number
  audit_date: number
  type: number
  wallet_address: string
  last_login_time: number
  last_login_ip: number
  property_type: number
  area: number
  appraisement: number
  id_number: string
}