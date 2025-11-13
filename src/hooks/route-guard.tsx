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
  const { code } = useUserStore()
  const { t } = useTranslation()
  const token = getToken()

  useEffect(() => {
    // 白名单路径列表，支持字符串和正则
    // const currentPath = location.pathname

    // 如果用户未登录，则只能访问首页
    // if (
    //   (!token || !userData.id) && currentPath !== '/'
    // ) {
    //   navigate({
    //     to: '/'
    //   })
    // }
    // TODO 权限检测

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
