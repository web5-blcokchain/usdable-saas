import type { FormInstance } from 'antd'
import assetsApi from '@/api/assetsApi'
import { getLocation } from '@/api/common'
import { useQuery } from '@tanstack/react-query'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'

export function AddAsseteFrist({ form, onFinish }: { form: FormInstance<any>, onFinish: (data: any) => void }) {
  const { t, i18n } = useTranslation()

  // 获取资产类型数据
  const { data: assetTypeData } = useQuery({
    queryKey: ['getAssetType'],
    queryFn: async () => {
      const res = await assetsApi.getAssetType()
      return res.data
    }
  })
  const assetTypeList = useMemo(() => {
    const iconLisy = [
      (new URL('@/assets/images/compony.png', import.meta.url).href),
      (new URL('@/assets/icon/assete/creditor-rights.png', import.meta.url).href),
      (new URL('@/assets/icon/assete/box.png', import.meta.url).href),
      (new URL('@/assets/icon/assete/line-graph.png', import.meta.url).href)
    ]
    return assetTypeData?.map((item, index) => {
      return {
        icon: iconLisy[index > iconLisy.length - 1 ? 0 : index],
        title: i18n.language === 'zh'
          ? item.name_zh_cn
          : (i18n.language === 'en' ? item.name_en : item.name_ja),
        content: item.description,
        status: item.status,
        id: item.id
      }
    }) || []
  }, [assetTypeData])

  // 获取资产房屋类型数据
  const { data: assetHouseTypeData } = useQuery({
    queryKey: ['getAssetHouseType'],
    queryFn: async () => {
      const res = await assetsApi.getAssetHouseType()
      return res.data
    },
    select: (data) => {
      return data?.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  })

  const [selectPid, setSelectPid] = useState({
    country: 0,
    selectedLocation: 0
  })
  const [locationData, setLocationData] = useState({
    country: [] as LocationData[],
    province: [] as LocationData[]
  })

  interface LocationData {
    value: number
    label: string
  }
  // 获取地区数据
  const { isFetching: locationDataLoading } = useQuery({
    queryKey: ['getLocation', selectPid],
    queryFn: async () => {
      const data = await getLocation({
        level: selectPid.selectedLocation + 2,
        parent_id: selectPid.selectedLocation === 1
          ? selectPid.country
          : undefined
      })
      // 处理数据,
      const newData = data?.data?.map(item => ({
        value: item.id,
        label: item.name
      })) || [] as LocationData[]

      setLocationData((pre) => {
        if (selectPid.selectedLocation === 0) {
          return {
            ...pre,
            country: newData
          }
        }
        else {
          return {
            ...pre,
            province: newData
          }
        }
      })
      return data.data
    }
  })

  const provinceData = useWatch('province', form)
  // 修改地区
  const changeCity = (val: number, index: number) => {
    if (index === 0) {
      setSelectPid(pre => ({
        ...pre,
        country: val,
        selectedLocation: 1
      }))
      !provinceData && form.setFieldValue('province', '')
      form.setFieldValue('city', '')
    }
  }

  // 当读取草稿时候，获取城市列表
  useEffect(() => {
    if (provinceData)
      changeCity(provinceData, 1)
  }, [provinceData])

  const assetType = useWatch('asset_type_id', form)
  const back = () => {
    window.history.back()
  }

  useEffect(() => {
    if (!assetTypeData)
      return
    for (let i = 0; i < assetTypeData?.length; i++) {
      if (assetTypeData[i].status === 1) {
        form.setFieldsValue({ asset_type_id: assetTypeData[i].id })
        break
      }
    }
  }, [assetTypeData])

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div onClick={back} className="w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.addAsset.uploadNewAsset')}</div>
      </div>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="asset_type_id">
          <div className="mt-8 rounded-3 bg-#161B22 p-6">
            <div>{t('assete.addAsset.selectAssetType')}</div>
            <div className="grid cols-4 mt-6 gap-6 max-md:cols-1 max-md:gap-4">
              {
                assetTypeList.map((item, index) => (
                  <div
                    key={index}
                    className={cn(' fccc b-1 b-solid py-6 px-4 rounded-2 relative', assetType === item.id ? 'b-#00E5FF' : ' b-#374151', item.status === 1 ? 'clickable' : '  cursor-not-allowed')}
                    onClick={() => {
                      if (item.status === 1)
                        form.setFieldsValue({ asset_type_id: item.id })
                    }}
                  >
                    <div className="size-16 fcc rounded-full bg-#0D1117">
                      <img className="h-8" src={item.icon} alt="" />
                    </div>
                    <div className="mt-4 text-base">{item.title}</div>
                    <div className="mt-2 text-center text-sm text-#9CA3AF">{item.content}</div>
                    <div className={cn(
                      'mt-4 px-3 py-1.5 rounded-9999px b-1 b-solid b-#00E5FF4D bg-#00E6FF33 text-xs fcc gap-1.5 transition-all-300',
                      assetType === item.id ? 'opacity-100' : ' opacity-0'
                    )}
                    >
                      <img className="h-3" src={(new URL('@/assets/images/register/success.png', import.meta.url).href)} alt="" />
                      <div>{t('assete.addAsset.selected')}</div>
                    </div>
                    {
                      item.status === 0 && (
                        <div className="absolute right-4 top-4 rounded-2.5 bg-#9CA3AF px-1 py-0.5 text-sm">
                          {t('assete.addAsset.notOpen')}
                        </div>
                      )
                    }
                  </div>
                ))
              }
            </div>
          </div>
        </Form.Item>
        <div className="mt-10 rounded-3 bg-#161B22 px-6 py-7.5 pb-10">
          <div className="fyc gap-1 text-lg">
            <div className="i-akar-icons:info-fill text-4.5 text-#68e2fb"></div>
            <div>{t('assete.addAsset.assetBasicInfo')}</div>
          </div>
          <div className="grid cols-2 mt-6 gap-6">
            {/* 资产名称 */}
            <Form.Item name="name" label={t('assete.addAsset.assetName')} required rules={[{ required: true, message: t('assete.addAsset.assetNamePlaceholder') }]}>
              <Input placeholder={t('assete.addAsset.assetNamePlaceholder')} />
            </Form.Item>
            {/* 房产类型 */}
            <Form.Item name="property_type" label={t('assete.addAsset.propertyTypeLabel')} required rules={[{ required: true, message: t('assete.addAsset.propertyTypePlaceholder') }]}>
              <Select options={assetHouseTypeData} placeholder={t('assete.addAsset.propertyTypePlaceholder')} />
            </Form.Item>
            {/* 建筑面积 */}
            <Form.Item name="area" label={t('assete.addAsset.buildingArea')} required rules={[{ required: true, message: t('assete.addAsset.buildingAreaPlaceholder') }]}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.buildingAreaPlaceholder')} />
            </Form.Item>
            {/* 资产地址 */}
            <Form.Item name="address" label={t('assete.addAsset.assetAddress')} required rules={[{ required: true, message: t('assete.addAsset.assetAddressPlaceholder') }]}>
              <Input placeholder={t('assete.addAsset.assetAddressPlaceholder')} />
            </Form.Item>
            {/* 建筑年限 */}
            <Form.Item name="house_life" label={t('assete.addAsset.buildingYear')} required rules={[{ required: true, message: t('assete.addAsset.buildingYearPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.buildingYearPlaceholder')} />
            </Form.Item>
            {/* 资产估值 */}
            {/* <Form.Item name="assetValuation" label={t('assete.addAsset.assetValuation')} required rules={[{ required: true, message: t('assete.addAsset.assetValuationPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.assetValuationPlaceholder')} />
            </Form.Item> */}
            {/* 卧室数量 */}
            <Form.Item name="bedrooms" label={t('assete.addAsset.bedroomCount')} required rules={[{ required: true, message: t('assete.addAsset.bedroomCountPlaceholder') }]}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.bedroomCountPlaceholder')} />
            </Form.Item>
            {/* 缴租日期 */}
            <Form.Item name="rent_day" label={t('assete.addAsset.rentDate')} required rules={[{ required: true, message: t('assete.addAsset.rentDatePlaceholder') }]}>
              <Select
                placeholder={t('assete.addAsset.rentDatePlaceholder')}
                options={[...Array.from({ length: 31 }).keys()].map(i => ({ value: i + 1, label: i + 1 }))}
              />
            </Form.Item>
            {/* 链ID */}
            <Form.Item name="chain_id" label={t('assete.addAsset.chainId')} required rules={[{ required: true, message: t('assete.addAsset.chainIdPlaceholder') }]}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.chainIdPlaceholder')} />
            </Form.Item>
            {/* 月租金 */}
            <Form.Item name="monthly_rent" label={t('assete.addAsset.monthlyRent')}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.monthlyRentPlaceholder')} />
            </Form.Item>
            {/* 预计年回报率 */}
            <Form.Item name="expected_annual_return" label={t('assete.addAsset.expectedAnnualReturn')}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnPlaceholder')} />
            </Form.Item>
            {/* 预计年化收益下限 */}
            <Form.Item name="annual_return_min" label={t('assete.addAsset.expectedAnnualReturnLower')}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnLowerPlaceholder')} />
            </Form.Item>
            {/* 预计年化收益上限 */}
            <Form.Item name="annual_return_max" label={t('assete.addAsset.expectedAnnualReturnUpper')}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnUpperPlaceholder')} />
            </Form.Item>
            {/* 经度 */}
            <Form.Item name="longitude" label={t('assete.addAsset.longitude')}>
              <InputNumber min={-180} max={180} controls={false} placeholder={t('assete.addAsset.longitudePlaceholder')} />
            </Form.Item>
            {/* 纬度 */}
            <Form.Item name="latitude" label={t('assete.addAsset.latitude')}>
              <InputNumber min={-90} max={90} controls={false} placeholder={t('assete.addAsset.latitudePlaceholder')} />
            </Form.Item>
            {/* 邮编 */}
            <Form.Item name="postcode" required label={t('assete.addAsset.zipCode')} rules={[{ required: true, message: t('assete.addAsset.zipCodePlaceholder') }]}>
              <InputNumber min={1} controls={false} placeholder={t('assete.addAsset.zipCodePlaceholder')} />
            </Form.Item>
            {/* 国家编码 */}
            <Form.Item name="country_id" required label={t('assete.addAsset.countryCode')} rules={[{ required: true, message: t('register.evaluator.selectCountryPlaceholder') }]}>
              <Select
                placeholder={t('register.evaluator.country')}
                loading={locationDataLoading && selectPid.selectedLocation === 0}
                onChange={val => changeCity(val, 0)}
                options={locationData.country}
              />
            </Form.Item>
            {/* 城市编码 */}
            <Form.Item name="city" required label={t('assete.addAsset.cityCode')} rules={[{ required: true, message: t('register.evaluator.selectProvincePlaceholder') }]}>
              <Select
                placeholder={t('register.evaluator.province')}
                loading={locationDataLoading && selectPid.selectedLocation === 1}
                onChange={val => changeCity(val, 1)}
                options={locationData.province}
              />
            </Form.Item>
          </div>
          {/* 房产描述 */}
          <Form.Item name="property_description" label={t('assete.addAsset.propertyDescription')} required rules={[{ required: true, message: t('assete.addAsset.propertyDescriptionPlaceholder') }]}>
            <Input.TextArea placeholder={t('assete.addAsset.propertyDescriptionPlaceholder')} autoSize={{ minRows: 6, maxRows: 6 }} />
          </Form.Item>
          {/* 位置描述 */}
          <Form.Item name="location" label={t('assete.addAsset.locationDescription')}>
            <Input placeholder={t('assete.addAsset.locationDescriptionPlaceholder')} />
          </Form.Item>
        </div>
        <Form.Item>
          <div className="mt-13 text-end">
            <Button type="primary" htmlType="submit" className="h-10.5 px-4 text-base text-black">
              {t('assete.addAsset.nextStep')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  )
}
