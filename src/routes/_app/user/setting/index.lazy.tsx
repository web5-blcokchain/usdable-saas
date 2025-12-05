import type { SaveUserModel } from '@/api/apiMyInfoApi'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { useUserStore } from '@/stores/user'
import { envConfig } from '@/utils/envConfig'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Form, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'

interface UserSettingFormValues {
  ga_2fa_enabled: boolean
  sms_2fa_enabled: boolean
  wallet_address: string
  notify_asset_status: boolean
  notify_system_announcement: boolean
  notify_account_activity: boolean
}

export const Route = createLazyFileRoute('/_app/user/setting/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }

  const [form] = Form.useForm<UserSettingFormValues>()
  const { userData, setUserData, getUserInfo } = useUserStore()
  const wallet_address = Form.useWatch('wallet_address', form)

  const { mutateAsync: saveInfo, isPending: saveInfoLoading } = useMutation({
    mutationKey: ['saveInfo'],
    mutationFn: async (data: SaveUserModel) => {
      return await apiMyInfoApi.saveUserInfo(data)
    }
  })
  const { connectWallet } = usePrivy()
  const { wallets } = useWallets()

  useEffect(() => {
    const userWallet = wallets.find(
      wallet => wallet.walletClientType !== 'privy'
    )
    if (userWallet && userWallet.address && !wallet_address) {
      form.setFieldValue('wallet_address', userWallet.address)
    }
  }, [wallets])
  function saveUserSetting() {
    const formData = form.getFieldsValue()
    const sumbitData = {
      ga_2fa_enabled: formData?.ga_2fa_enabled ? '1' : '0',
      sms_2fa_enabled: formData?.sms_2fa_enabled ? '1' : '0',
      wallet_address: formData?.wallet_address || '',
      notify_asset_status: formData?.notify_asset_status ? '1' : '0',
      notify_system_announcement: formData?.notify_system_announcement
        ? '1'
        : '0',
      notify_account_activity: formData?.notify_account_activity ? '1' : '0'
    }
    saveInfo(sumbitData).then((res) => {
      if (res.code === 1) {
        setUserData({
          ...userData,
          user: {
            ...userData?.user,
            ...sumbitData
          }
        })
        toast.success(t('user.setting.saveSuccess'))
      }
    })
  }
  function copyWalletAddress() {
    if (wallet_address) {
      navigator.clipboard.writeText(wallet_address)
      toast.success(t('common.copySuccess'))
    }
  }
  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        ga_2fa_enabled: !!Number(userData?.user?.ga_2fa_enabled),
        sms_2fa_enabled: !!Number(userData?.user?.sms_2fa_enabled),
        wallet_address: userData?.user?.wallet_address || '',
        notify_asset_status: !!Number(userData?.user?.notify_asset_status),
        notify_system_announcement: !!Number(
          userData?.user?.notify_system_announcement
        ),
        notify_account_activity: !!Number(
          userData?.user?.notify_account_activity
        )
      })
    }
  }, [userData])
  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])
  return (
    <div className="px-22 py-8 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('user.setting.title')}</div>
          <div className="text-base text-#9CA3AF font-400">
            {t('user.setting.description')}
          </div>
        </div>
        <div className="fyc gap-2">
          <Button
            className="h-9.5 b-#2D333B bg-#1E2328 px-4 text-sm"
            onClick={back}
          >
            {t('user.setting.back')}
          </Button>
          <Button
            onClick={saveUserSetting}
            loading={saveInfoLoading}
            className="h-9.5 b-#2D333B bg-#1E2328 px-4 text-sm text-#E5E7EB"
          >
            {t('user.setting.saveChanges')}
          </Button>
        </div>
      </div>
      {/* TODO 登录二次验证 */}
      <Form form={form}>
        <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
          <div className="text-lg font-600">
            {t('user.setting.securitySetting')}
          </div>
          <div className="mt-9 fol gap-4">
            <div className="text-sm text-#D1D5DB">
              {t('user.setting.twoFactorAuth')}
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.googleAuth')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.googleAuthDesc')}
                </div>
              </div>
              <div>
                {/* 开启Google认证 */}
                <Form.Item name="ga_2fa_enabled" className="my-0">
                  <Switch />
                </Form.Item>
              </div>
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.smsAuth')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.smsAuthDesc')}
                </div>
              </div>
              <div>
                {/* 开启短信认证 */}
                <Form.Item name="sms_2fa_enabled" className="my-0">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
          <div className="text-lg font-600">
            {t('user.setting.walletSetting')}
          </div>
          <div className="mt-2.5 text-base text-#9CA3AF font-400">
            {t('user.setting.walletSettingDesc')}
          </div>
          <div className="mt-3.5 fol gap-4">
            <div>
              <div className="text-sm text-#D1D5DB">
                {t('user.setting.wallet')}
              </div>
              <Input
                value={envConfig.chainNameShort}
                className="mt-2 !b-#374151 !bg-#161B22"
                disabled
              />
            </div>
            <div>
              <div className="text-sm text-#D1D5DB">
                {t('user.setting.walletAddress')}
              </div>
              <div className="mt-2 fyc overflow-hidden b-1 b-#374151 rounded-1.5">
                {/* 钱包地址 */}
                <Form.Item name="wallet_address" className="my-0 flex-1">
                  <Input
                    disabled
                    className="h-9.5 w-full rounded-0 text-sm text-#E5E7EB !b-0 !bg-#161B22"
                  />
                </Form.Item>
                <Button
                  onClick={copyWalletAddress}
                  className="h-10.5 rounded-0 bg-#161B22 text-sm text-#00E5FF !b-0"
                >
                  <div className="i-fa-solid:copy bg-#9ea3ae text-base"></div>
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 fyc gap-2">
            <div className="text-base text-#D1D5DB font-400">
              {t('user.setting.bindingStatus')}
            </div>
            <div
              className={cn(
                'w-fit b-1  rounded-9999px  px-2 py-1 text-sm ',
                !wallet_address
                  ? 'text-primary b-primary bg-#00E6FF33'
                  : 'b-#374151 bg-#1F2937 text-#9CA3AF'
              )}
            >
              {t('user.setting.unbound')}
            </div>
          </div>
          {!wallet_address && (
            <Button
              onClick={connectWallet}
              className="mt-4 h-12.5 fcc gap-2 b-#00E5FF80 bg-#00E2FF1A px-6 text-base text-#00E5FF"
            >
              <div className="i-heroicons-solid:link text-xl text-primary"></div>
              <div className="text-base text-primary">
                {t('user.setting.connectWallet')}
              </div>
            </Button>
          )}
        </div>
        {/* <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
          <div className="text-lg font-600">
            {t('user.setting.privacySetting')}
          </div>
          <div className="mt-6 fol gap-4">
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.personalInfoVisibility')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.personalInfoVisibilityDesc')}
                </div>
              </div>
              <div>
                <Switch />
              </div>
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.assetInfoProtection')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.assetInfoProtectionDesc')}
                </div>
              </div>
              <div>
                <Switch />
              </div>
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.receiveMarketingInfo')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.receiveMarketingInfoDesc')}
                </div>
              </div>
              <div>
                <Switch />
              </div>
            </div>
          </div>
        </div> */}
        <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
          <div className="text-lg font-600">
            {t('user.setting.notificationSetting')}
          </div>
          <div className="mt-6 fol gap-4">
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.assetStatusUpdate')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.assetStatusUpdateDesc')}
                </div>
              </div>
              <div>
                {/* 资产状态更新通知 */}
                <Form.Item name="notify_asset_status" className="my-0">
                  <Switch />
                </Form.Item>
              </div>
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.systemAnnouncement')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.systemAnnouncementDesc')}
                </div>
              </div>
              <div>
                {/* 系统公告通知 */}
                <Form.Item name="notify_system_announcement" className="my-0">
                  <Switch />
                </Form.Item>
              </div>
            </div>
            <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
              <div>
                <div className="text-sm text-#E5E7EB">
                  {t('user.setting.accountActivityAlert')}
                </div>
                <div className="mt-1 text-xs text-#9CA3AF font-400">
                  {t('user.setting.accountActivityAlertDesc')}
                </div>
              </div>
              <div>
                {/* 账户活动通知 */}
                <Form.Item name="notify_account_activity" className="my-0">
                  <Switch />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  )
}
