import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Input, Switch } from 'antd'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/user/setting/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }
  return (
    <div className="px-22 py-8 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('user.setting.title')}</div>
          <div className="text-base text-#9CA3AF font-400">{t('user.setting.description')}</div>
        </div>
        <div className="fyc gap-2">
          <Button className="h-9.5 b-#2D333B bg-#1E2328 px-4 text-sm" onClick={back}>{t('user.setting.back')}</Button>
          <Button className="h-9.5 b-#2D333B bg-#1E2328 px-4 text-sm text-#E5E7EB">{t('user.setting.saveChanges')}</Button>
        </div>
      </div>
      {/* TODO 登录二次验证 */}
      <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
        <div className="text-lg font-600">{t('user.setting.securitySetting')}</div>
        <div className="mt-9 fol gap-4">
          <div className="text-sm text-#D1D5DB">{t('user.setting.twoFactorAuth')}</div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.googleAuth')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.googleAuthDesc')}</div>
            </div>
            <div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.smsAuth')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.smsAuthDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
        <div className="text-lg font-600">{t('user.setting.walletSetting')}</div>
        <div className="mt-2.5 text-base text-#9CA3AF font-400">{t('user.setting.walletSettingDesc')}</div>
        <div className="mt-3.5 fol gap-4">
          <div>
            <div className="text-sm text-#D1D5DB">{t('user.setting.wallet')}</div>
            <Input className="mt-2 !b-#374151 !bg-#161B22" disabled />
          </div>
          <div>
            <div className="text-sm text-#D1D5DB">{t('user.setting.walletAddress')}</div>
            <div className="mt-2 fyc overflow-hidden b-1 b-#374151 rounded-1.5">
              <Input className="h-9.5 w-full rounded-0 text-sm text-#E5E7EB !b-0 !bg-#161B22" />
              <Button className="h-10.5 rounded-0 bg-#161B22 text-sm text-#00E5FF !b-0">
                <div className="i-fa-solid:copy bg-#9ea3ae text-base"></div>
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-6 fyc gap-2">
          <div className="text-base text-#D1D5DB font-400">{t('user.setting.bindingStatus')}</div>
          <div className="w-fit b-1 b-#374151 rounded-9999px bg-#1F2937 px-2 py-1 text-sm text-#9CA3AF">{t('user.setting.unbound')}</div>
        </div>
        <Button className="mt-4 h-12.5 fcc gap-2 b-#00E5FF80 bg-#00E2FF1A px-6 text-base text-#00E5FF">
          <div className="i-heroicons-solid:link text-xl text-primary"></div>
          <div className="text-base text-primary">{t('user.setting.connectWallet')}</div>
        </Button>
      </div>
      <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
        <div className="text-lg font-600">{t('user.setting.privacySetting')}</div>
        <div className="mt-6 fol gap-4">
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.personalInfoVisibility')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.personalInfoVisibilityDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.assetInfoProtection')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.assetInfoProtectionDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.receiveMarketingInfo')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.receiveMarketingInfoDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 b-1 b-#2D333B rounded-3 bg-#0D1117 p6">
        <div className="text-lg font-600">{t('user.setting.notificationSetting')}</div>
        <div className="mt-6 fol gap-4">
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.assetStatusUpdate')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.assetStatusUpdateDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.systemAnnouncement')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.systemAnnouncementDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
          <div className="fyc justify-between gap-4 b-1 b-#2D333B rounded-1.5 bg-#161B22 px-3 py-4">
            <div>
              <div className="text-sm text-#E5E7EB">{t('user.setting.accountActivityAlert')}</div>
              <div className="mt-1 text-xs text-#9CA3AF font-400">{t('user.setting.accountActivityAlertDesc')}</div>
            </div>
            <div>
              <Switch />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
