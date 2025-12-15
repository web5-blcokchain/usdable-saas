import type { SaveUserModel } from '@/api/apiMyInfoApi'
import apiMyInfoApi from '@/api/apiMyInfoApi'
import { uploadFile } from '@/api/common'
import UploadMultifileCard from '@/components/common/upload/uploa-multifile-card'
import { useUserStore } from '@/stores/user'
import { addHttpsPrefix } from '@/utils/url'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Form, Input } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/user/info/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const { userData, getUserInfo, setUserData } = useUserStore()
  const [form] = Form.useForm()
  const mobile = useWatch('mobile', form)
  const [avatar, setAvatar] = useState('')

  // 文件上传
  const { mutateAsync: uploadIdCardFileMutate, isPending: uplodaFileLoading }
    = useMutation({
      mutationKey: ['uploadFile'],
      mutationFn: async (data: { file: File }) => {
        const formData = new FormData()
        formData.append('file', data.file)
        return uploadFile(formData)
      },
      onSuccess: (res) => {
        if (res.code === 1) {
          setAvatar(res.data?.file?.full_url || '')
        }
      }
    })

  const { mutateAsync: saveInfo, isPending: saveInfoLoading } = useMutation({
    mutationKey: ['saveInfo'],
    mutationFn: async (data: SaveUserModel) => {
      return await apiMyInfoApi.saveUserInfo(data)
    }
  })

  const [isChangeMobile, setIsChangeMobile] = useState(false)
  const saveUserInfo = useCallback(
    async (type?: number | React.MouseEvent<HTMLElement>) => {
      const data = {
        ...(form.getFieldsValue() || {}),
        avatar
      }

      const mobile = data.mobile

      // 验证Form表单
      const validateResult = await form.validateFields().catch((values) => {
        console.log(values)
        const { errorFields } = values
        const findPhoneError = (
          errorFields as { errors: string[], name: string, warning: string[] }[]
        ).find(res => res.name.includes('mobile'))
        if (type !== 1) {
          toast.error(t('common.formDataError'))
          return Promise.resolve(false)
        }
        else if (findPhoneError) {
          toast.error(findPhoneError.errors[0])
          return Promise.resolve(false)
        }
        return Promise.resolve(true)
      })
      if (!validateResult) {
        return
      }
      setIsChangeMobile(type === 1)
      saveInfo(
        type !== 1
          ? data
          : {
              mobile
            }
      )
        .then((res) => {
          if (res.code === 1) {
            toast.success(t('user.info.saveSuccess'))
            setUserData({
              ...userData,
              user: {
                ...userData.user,
                ...(type !== 1
                  ? {
                      mobile
                    }
                  : data)
              }
            })
          }
        })
        .finally(() => {
          setIsChangeMobile(false)
        })
    },
    [userData, avatar, form]
  )

  // 获取用户信息
  useEffect(() => {
    getUserInfo()
  }, [getUserInfo])
  const back = () => {
    window.history.back()
  }

  useEffect(() => {
    form.setFieldsValue({
      nickname: userData?.user?.nickname || '',
      petname: userData?.user?.petname || '',
      mobile: userData?.user?.mobile || '',
      email: userData?.user?.email || '',
      motto: userData?.user?.motto || ''
    })
    setAvatar(userData?.user?.avatar || '')
  }, [])
  return (
    <div className="px-22 py-8 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('user.info.title')}</div>
          <div className="text-base text-#9CA3AF font-400">
            {t('user.info.description')}
          </div>
        </div>
        <div>
          <Button className="h-9.5 b-#2D333B bg-#1E2328 text-sm" onClick={back}>
            {t('user.info.back')}
          </Button>
          <Button
            onClick={saveUserInfo}
            loading={saveInfoLoading && !isChangeMobile}
            className="ml-2 h-9.5 b-#2D333B bg-#1E2328 text-sm text-#E5E7EB"
          >
            {t('user.info.saveChanges')}
          </Button>
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
              loading={uplodaFileLoading}
              beforeUpload={(file) => {
                uploadIdCardFileMutate({ file })
              }}
            >
              <div className="relative">
                <img
                  className="size-full"
                  src={
                    addHttpsPrefix(avatar)
                    || new URL('@/assets/test/avatar.png', import.meta.url).href
                  }
                  alt=""
                />
              </div>
            </UploadMultifileCard>
            <div
              style={{}}
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
              <Form.Item
                label={t('user.info.username')}
                name="nickname"
                rules={[
                  {
                    required: true,
                    message: t('user.info.nicknamePlaceholder')
                  }
                ]}
              >
                <Input
                  className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22"
                  placeholder={t('user.info.usernamePlaceholder')}
                />
              </Form.Item>
              <Form.Item
                label={t('user.info.nickname')}
                name="petname"
                rules={[
                  {
                    required: true,
                    message: t('user.info.nicknamePlaceholder')
                  }
                ]}
              >
                <Input
                  className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22"
                  placeholder={t('user.info.nicknamePlaceholder')}
                />
              </Form.Item>
              <Form.Item
                label={t('user.info.phone')}
                name="mobile"
                rules={[
                  { required: true, message: t('user.info.phonePlaceholder') }
                ]}
              >
                <div className="fyc overflow-hidden b-1 b-#2D333B rounded-1.5">
                  <Input
                    value={mobile}
                    className="h-9.5 w-full rounded-0 text-sm text-#E5E7EB !b-0 !bg-#161B22"
                    placeholder={t('user.info.phonePlaceholder')}
                  />
                  <Button
                    disabled={saveInfoLoading}
                    onClick={() => saveUserInfo(1)}
                    loading={saveInfoLoading && isChangeMobile}
                    className="h-10.5 rounded-0 bg-#2D333B text-sm text-#00E5FF !b-0"
                  >
                    {t('user.info.modify')}
                  </Button>
                </div>
              </Form.Item>
              <Form.Item
                label={t('user.info.email')}
                name="email"
                rules={[
                  { required: true, message: t('user.info.emailPlaceholder') }
                ]}
              >
                <Input
                  className="h-9.5 w-full border-1 text-sm text-#E5E7EB !b-#2D333B !bg-#161B22"
                  placeholder={t('user.info.emailPlaceholder')}
                />
              </Form.Item>
            </div>
            <Form.Item
              label={t('user.info.introduction')}
              name="motto"
              rules={[
                {
                  required: true,
                  message: t('user.info.introductionPlaceholder')
                }
              ]}
            >
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
