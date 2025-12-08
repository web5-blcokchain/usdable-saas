import type { SubmitAssetInfo } from '@/api/assetsApi'
import type { FristFormData } from './-components/formDataType'
import assetsApi from '@/api/assetsApi'
import { INPUT_FORMAT_TYPE } from '@/enum/common'
import { extractFirstBraces, screenToTop } from '@/utils'
import { useMutation } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { AnimatePresence } from 'framer-motion'
import { AddAsseteFrist } from './-components/addAsseteFrist'
import { AddAsseteSecond } from './-components/addAsseteSecond'
import { SubmissionStatusStatus } from './-components/submissionStatusDialog'
import './index.lazy.scss'

export const Route = createLazyFileRoute('/_app/assete/addAssete/')({
  component: RouteComponent
})

function RouteComponent() {
  const [firstForm] = useForm()
  const [secondForm] = useForm()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<SubmitAssetInfo>({} as any)
  const [sumbitDialogVisible, setSumbitDialogVisible] = useState({
    visible: false,
    type: 1,
    asseteInfo: { code: '', createTime: '' },
    errorMessage: ''
  })
  useEffect(() => {
    return () => {
      setSumbitDialogVisible({
        visible: false,
        type: 0,
        asseteInfo: { code: '', createTime: '' },
        errorMessage: ''
      })
    }
  }, [])

  const { mutateAsync: saveAssetInfo } = useMutation({
    mutationKey: ['saveAssetInfo'],
    mutationFn: async (data: SubmitAssetInfo) => {
      const res = await assetsApi.saveAssetInfo(data)
      return res
    }
  })

  const onFinish = async (data: any, templateId?: number, status?: boolean) => {
    switch (step) {
      case 0: {
        const formData = data as FristFormData
        setFormData((res) => {
          return {
            ...res,
            asset_type_id: formData.asset_type_id,
            country_id: formData.country_id,
            basic_info: {
              ...res.basic_info,
              name: formData.name,
              property_type: formData.property_type,
              area: formData.area,
              address: formData.address,
              house_life: formData.house_life,
              bedrooms: formData.bedrooms,
              rent_day: formData.rent_day,
              chain_id: formData.chain_id,
              monthly_rent: formData.monthly_rent,
              expected_annual_return: formData.expected_annual_return,
              annual_return_min: formData.annual_return_min,
              annual_return_max: formData.annual_return_max,
              longitude: formData.longitude,
              latitude: formData.latitude,
              postcode: `${formData.postcode}`,
              city: formData.city,
              property_description: formData.property_description,
              location: formData.location
            }
          }
        })
        setStep(1)
        break
      }
      case 1: {
        // 处理数据
        const newData = {
          ...formData,
          files: {
            ...data
          },
          template_id: templateId || 2,
          status: (status || status === undefined) ? 1 : undefined
        }
        setFormData(newData)
        await saveAssetInfo(newData).then((res) => {
          if (res.code === 1) {
            localStorage.removeItem('draft')
            setSumbitDialogVisible({
              visible: true,
              type: 1,
              asseteInfo: { code: res.data?.submission_id || '', createTime: dayjs().format('YYYY-MM-DD HH:mm:ss') },
              errorMessage: ''
            })
          }
        })
        //
        break
      }
    }
  }

  const backStep = () => {
    setStep(step - 1)
  }

  const saveDraft = () => {
    localStorage.setItem('draft', JSON.stringify({
      firstForm: firstForm.getFieldsValue(),
      secondForm: secondForm.getFieldsValue()
    }))
    toast.success('保存草稿成功')
  }

  useEffect(() => {
    const draft = localStorage.getItem('draft')
    if (draft && firstForm && secondForm) {
      const draftData = JSON.parse(draft)
      const secondFormData = {} as { [key: string]: any }

      Object.keys(draftData.secondForm).forEach((key: string) => {
        const data = extractFirstBraces(key)
        if (Array.isArray(data) && [INPUT_FORMAT_TYPE.DATE, INPUT_FORMAT_TYPE.DATETIME].includes(data[1] as any)) {
          secondFormData[key] = dayjs(draftData.secondForm[key])
        }
        else {
          secondFormData[key] = draftData.secondForm[key]
        }
      })

      console.log(secondForm, secondForm?.setFieldsValue)

      firstForm?.setFieldsValue(draftData.firstForm)
      secondForm?.setFieldsValue(secondFormData)
    }
  }, [firstForm, secondForm])

  useEffect(() => {
    screenToTop({
      top: 0,
      behavior: 'smooth'
    })
  }, [step])

  return (
    <div className="addAssete">
      <AnimatePresence mode="wait">
        <div className={cn(step === 0 ? '' : 'hidden')}>
          <AddAsseteFrist form={firstForm} onFinish={onFinish} />
        </div>
        <div className={cn(step === 1 ? '' : 'hidden')}>
          <AddAsseteSecond form={secondForm} onFinish={onFinish} backStep={backStep} saveDraft={saveDraft} />
        </div>
      </AnimatePresence>
      {/* 提交成功弹窗口 */}
      <SubmissionStatusStatus
        visible={sumbitDialogVisible.visible}
        setVisible={visible => setSumbitDialogVisible({ ...sumbitDialogVisible, visible })}
        type={sumbitDialogVisible.type}
        asseteInfo={sumbitDialogVisible.asseteInfo}
        errorMessage={sumbitDialogVisible.errorMessage}
      />
    </div>
  )
}
