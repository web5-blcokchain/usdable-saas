import balanceIcon from '@/assets/images/balance.png'
import componyIcon from '@/assets/images/compony.png'
import homeIcon from '@/assets/images/home.png'
import { USER_AUDIT_STATUS, USER_TYPE } from '@/enum/user'
import { useUserStore } from '@/stores/user'
import { screenToTop } from '@/utils'
import { usePrivy } from '@privy-io/react-auth'
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { ConfigProvider } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AsseteRgister } from './-components/asseteRgister'
import { EvaluatorRegister } from './-components/evaluatorRegister'
import { LawOfficeRegister } from './-components/lawOfficeRegister'
import { RegisterStatus } from './-components/registerStatus'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/register/')({
  component: RouteComponent
})

function AnimationComponent({
  animKey,
  children,
  className
}: {
  animKey: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      key={animKey}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function RouteComponent() {
  const { t, i18n } = useTranslation()
  const { userData } = useUserStore()
  const [isSuccess, setIsSuccess] = useState(false)
  const [registerStatus, setRegisterStatus] = useState(0)
  const [errorMessage, setErrorMessage] = useState('Error')

  const selectType = [
    {
      title: 'home.assetParty',
      description: 'home.assetPartyDesc',
      icon: homeIcon,
      feature: 'home.assetManagement',
      type: 'asset'
    },
    {
      title: 'home.evaluator',
      description: 'home.evaluatorDesc',
      icon: componyIcon,
      feature: 'home.verifyAssets',
      type: 'evaluator'
    },
    {
      title: 'home.lawOffice',
      description: 'home.lawOfficeDesc',
      icon: balanceIcon,
      feature: 'home.legalCompliance',
      type: 'law Firm'
    }
  ]

  const [selectStatus, setSelectStatus] = useState(0)
  const navigate = useNavigate()

  const { authenticated } = usePrivy()

  // 切换注册页面，未登录显示提示
  function changeSelectStatus(index: number) {
    setSelectStatus(index)
  }

  // 监听认证状态变化，如果未登录则返回表单首页
  useEffect(() => {
    if (!authenticated) {
      setSelectStatus(0)
    }
  }, [authenticated])

  // 监听用户数据变化，如果用户未审核通过，则返回表单首页，并显示弹窗
  const [lastDialog, setLastDialog] = useState(0)
  const [dialogButton, setDialogButton] = useState({
    text: '',
    onClick: () => {}
  })

  useEffect(() => {
    if (authenticated) {
      if (!userData?.user?.id) {
        // 用户未登录
        setIsSuccess(false)
      }
      else if (
        userData
        && userData?.user?.audit_status === USER_AUDIT_STATUS.REJECT
      ) {
        setSelectStatus(0)
        // 弹出间隔不能少于5s
        if (Date.now() - lastDialog > 5000) {
          setIsSuccess(true)
        }
        setRegisterStatus(2)
        setLastDialog(Date.now())
        setErrorMessage(userData.user?.review_remark)
      }
      else if (
        userData
        && userData?.user?.audit_status === USER_AUDIT_STATUS.PASS
      ) {
        if (Date.now() - lastDialog > 5000) {
          setIsSuccess(true)
        }

        // 根据用户类型设置按钮文本和点击事件
        let buttonConfig
        switch (userData.user?.type) {
          case USER_TYPE.ASSET:
            buttonConfig = {
              text: t('register.asset.enterAssetCenter'),
              onClick: () => {
                navigate({ to: '/assete' })
              }
            }
            break
          case USER_TYPE.ASSESS:
            buttonConfig = {
              text: t('register.asset.enterEvaluationTaskCenter'),
              onClick: () => {
                navigate({ to: '/evaluation' })
              }
            }
            break
          default:
            buttonConfig = {
              text: t('register.asset.enterLawyerTaskCenter'),
              onClick: () => {
                navigate({ to: '/lawyerWorkbench' })
              }
            }
        }

        setDialogButton(buttonConfig)
        setRegisterStatus(1)
        setLastDialog(Date.now())
        setErrorMessage(userData.user?.review_remark)
      }
    }
  }, [userData, t, navigate, authenticated])

  useEffect(() => {
    screenToTop()
  }, [selectStatus])

  const changeType = (index: number) => {
    const isRegister
      = !!userData?.user?.id
        && userData?.user?.audit_status === USER_AUDIT_STATUS.PASS
    if (!isRegister) {
      changeSelectStatus(index)
    }
    else {
      toast.warning(t('common.hasRegistered'))
    }
  }

  let lastStatus = 0
  const selectComponent = useMemo(() => {
    let status = selectStatus
    // 如果未登录则返回表单首页
    if (!authenticated && selectStatus > 0 && lastStatus !== status) {
      toast.error(t('login.pleaseLogin'))
      setSelectStatus(0)
      status = 0
    }
    else if (
      userData?.user?.audit_status === USER_AUDIT_STATUS.PASS
      && selectStatus > 0
      && lastStatus !== status
    ) {
      toast.info(t('login.userRegistered'))
      setSelectStatus(0)
      status = 0
    }
    lastStatus = selectStatus
    switch (status) {
      case 0:
        return (
          <AnimationComponent
            className="mt-41 fcc px-66 max-md:mt-3 max-md:px-4 max-xl:px-12% max-md:pb-30"
            animKey="frist"
          >
            <div className="b-2 b-#31363c rounded-lg b-solid p-12 max-md:px-6 max-md:py-4">
              <div className="text-10 font-bold leading-15 max-md:text-3xl">
                {t('home.selectIdentity')}
              </div>
              <div className="mt-2.5 text-base text-#8B949E">
                {t('home.selectIdentityDesc')}
              </div>
              <div className="grid grid-cols-3 mt-10 gap-6 max-md:grid-cols-1">
                {selectType.map((item, index) => (
                  <div
                    key={item.title}
                    onClick={() => {
                      changeType(index + 1)
                    }}
                    className="flex flex-col border-1 b-#30363D rounded-3 b-solid p-6 clickable"
                  >
                    <div className="flex-1">
                      <div className="size-14 fcc rounded-2 bg-#161B22">
                        <img src={item.icon} className="h-8" alt="" />
                      </div>
                      <div className="mt-5 text-xl">{t(item.title)}</div>
                      <div className="mt-3 text-base text-#8B949E">
                        {t(item.description)}
                      </div>
                    </div>
                    <div className="mt-6 b-t-1 b-#30363D b-solid pt-4 text-sm text-#E5E7EB">
                      {t(item.feature)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimationComponent>
        )
      case 1:
        return (
          <AnimationComponent animKey="asset">
            <AsseteRgister back={() => setSelectStatus(0)} />
          </AnimationComponent>
        )
      case 2:
        return (
          <AnimationComponent animKey="evaluator">
            <EvaluatorRegister back={() => setSelectStatus(0)} />
          </AnimationComponent>
        )
      default:
        return (
          <AnimationComponent animKey="lawOffice">
            <LawOfficeRegister back={() => setSelectStatus(0)} />
          </AnimationComponent>
        )
    }
  }, [selectStatus, i18n.language])

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Checkbox: {
              colorBgContainer: '#ffffff',
              colorPrimary: '#00e5ff', // 勾选时的主色
              borderRadiusSM: 4 // 小尺寸圆角
            }
          }
        }}
      >
        <AnimatePresence mode="wait">{selectComponent}</AnimatePresence>
      </ConfigProvider>
      <RegisterStatus
        visible={isSuccess}
        setVisible={setIsSuccess}
        type={registerStatus}
        errorMessage={errorMessage}
        back={() => {
          setIsSuccess(false)
        }}
        successButton={dialogButton}
      />
    </div>
  )
}
