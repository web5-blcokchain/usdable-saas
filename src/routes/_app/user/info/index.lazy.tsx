import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Form, Input } from 'antd'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/user/info/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()
  const back = () => {
    window.history.back()
  }
  const [form] = Form.useForm()
  return (
    <div className="px-22 py-8 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('user.info.title')}</div>
          <div className="text-base text-#9CA3AF font-400">{t('user.info.description')}</div>
        </div>
        <div>
          <Button className="h-9.5 b-#2D333B bg-#1E2328 text-sm" onClick={back}>{t('user.info.back')}</Button>
          <Button className="ml-2 h-9.5 b-#2D333B bg-#1E2328 text-sm text-#E5E7EB">{t('user.info.saveChanges')}</Button>
        </div>
      </div>
      <div className="mt-8 flex gap-6 rounded-3 bg-#0D1117 p-6 pb-38">
        <div className="fol" style={{ alignItems: 'center' }}>
          <div className="relative w-fit clickable">
            <UploadMultifileCard
              className={cn(
                'flex gap-3 [&>div>div>div>div]:b-0 b-2 b-#00E5FF rounded-full overflow-hidden'
              )}
              fileType="image/png,image/jpg"
              fileUrl={[]}
              maxLength={1}
              width="8rem"
              height="8rem"
              // loading={uploadFileLoading}
              removeFile={(_index) => {
                // setFileUrl(fileUrl.filter((_, i) => i !== index))
              }}
              beforeUpload={(_file) => {
                // beforeUpload(file)
              }}
            >
              <div className="relative">
                <img className="size-full" src={new URL('@/assets/test/avatar.png', import.meta.url).href} alt="" />

              </div>
            </UploadMultifileCard>
            <div
              style={{

              }}
              className="absolute bottom-0 right-0 size-11 fcc b-2 b-#2D333B rounded-full bg-#161B22"
            >
              <div className="i-material-symbols:photo-camera size-5 bg-primary"></div>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-#9CA3AF">
            <div>{t('user.info.avatarInstruction1')}</div>
            <div>{t('user.info.avatarInstruction2')}</div>
          </div>
        </div>
        <div className="flex-1">
          <Form form={form} layout="vertical">
            <div className="grid grid-cols-2 gap-x-6">
              <Form.Item label={t('user.info.username')} name="username" rules={[{ required: true, message: t('user.info.nicknamePlaceholder') }]}>
                <Input className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22" placeholder={t('user.info.usernamePlaceholder')} />
              </Form.Item>
              <Form.Item label={t('user.info.nickname')} name="nickname" rules={[{ required: true, message: t('user.info.nicknamePlaceholder') }]}>
                <Input className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22" placeholder={t('user.info.nicknamePlaceholder')} />
              </Form.Item>
              <Form.Item label={t('user.info.phone')} name="phone" rules={[{ required: true, message: t('user.info.phonePlaceholder') }]}>
                <div className="fyc overflow-hidden b-1 b-#2D333B rounded-1.5">
                  <Input className="h-9.5 w-full rounded-0 text-sm text-#E5E7EB !b-0 !bg-#161B22" placeholder={t('user.info.phonePlaceholder')} />
                  <Button className="h-10.5 rounded-0 bg-#2D333B text-sm text-#00E5FF !b-0">{t('user.info.modify')}</Button>
                </div>
              </Form.Item>
              <Form.Item label={t('user.info.email')} name="email" rules={[{ required: true, message: t('user.info.emailPlaceholder') }]}>
                <Input className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22" placeholder={t('user.info.emailPlaceholder')} />
              </Form.Item>
            </div>
            <Form.Item label={t('user.info.introduction')} name="introduction" rules={[{ required: true, message: t('user.info.introductionPlaceholder') }]}>
              <Input.TextArea
                className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22"
                placeholder={t('user.info.introductionPlaceholder')}
                autoSize={{ minRows: 5, maxRows: 5 }}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
