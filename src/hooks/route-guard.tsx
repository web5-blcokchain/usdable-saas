import type { User } from '@/api/apiMyInfoApi'
import { USER_AUDIT_STATUS, USER_TYPE } from '@/enums/user'
import { useUserStore } from '@/stores/user'
import { screenToTop } from '@/utils'
import { getToken } from '@/utils/user.ts'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * 路由守卫Hook，用于全局路由拦截
 * 当用户不存在(isExist为false)时，除了白名单路径外，其他路径都会被重定向到/account/create
 */
export function useRouteGuard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { code, userData } = useUserStore()
  const { t } = useTranslation()
  const token = getToken()

  useEffect(() => {
    // 白名单路径列表，支持字符串和正则
    const currentPath = location.pathname
    const isRegister
      = !!userData?.user?.id
        && userData?.user?.audit_status === USER_AUDIT_STATUS.PASS

    // 如果用户未登录或者未审核，则只能访问首页和注册页面
    if (
      !['/', '/register'].includes(currentPath)
      && (!userData?.user?.id
        || userData?.user?.audit_status !== USER_AUDIT_STATUS.PASS)
    ) {
      navigate({
        to: '/register'
      })
    }
    // 校验用户身份访问的页面是否匹配
    if (isRegister && !['/', '/register'].includes(currentPath)) {
      const userCheck = checkUserIdentity(userData.user, currentPath)
      if (!userCheck.value) {
        navigate({
          to: userCheck.url
        })
      }
    }

    // 跳转路由后，返回页面顶部
    setTimeout(() => {
      screenToTop()
    }, 100)
  }, [
    code,
    location.pathname, // 使用location.pathname替换router.latestLocation.pathname
    navigate,
    t,
    token
  ])
}

const commonPaths = ['/', '/register', '/user', '/user/']
function checkUserIdentity(userData: User, path: string) {
  const userChenck = {
    value: true,
    url: '/register'
  }
  const isCommonPath = commonPaths.some(item => path.includes(item))
  if (isCommonPath) {
    return userChenck
  }
  if (userData.type === USER_TYPE.ASSET && !path.includes('/assete')) {
    // 如果是资产方
    userChenck.value = false
    userChenck.url = '/assete'
  }
  else if (
    userData.type === USER_TYPE.ASSESS
    && !path.includes('/evaluation')
  ) {
    // 如果是评估方
    userChenck.value = false
    userChenck.url = '/evaluation'
  }
  else if (
    userData.type === USER_TYPE.LAWYER
    && path.includes('/lawyerWorkbench')
  ) {
    // 如果是律师方
    userChenck.value = false
    userChenck.url = '/lawyerWorkbench'
  }
  else {
    userChenck.value = true
  }
  return userChenck
}
