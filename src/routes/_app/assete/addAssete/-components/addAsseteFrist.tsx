import type { FormInstance } from 'antd'
import { Button, Form, Input, InputNumber, Select } from 'antd'
import { useWatch } from 'antd/es/form/Form'
import { useTranslation } from 'react-i18next'

export function AddAsseteFrist({ form, onFinish }: { form: FormInstance<any>, onFinish: () => void }) {
  const { t } = useTranslation()
  const assetTypeList = [
    {
      icon: (new URL('@/assets/images/compony.png', import.meta.url).href),
      title: t('assete.addAsset.assetType.property'),
      content: t('assete.addAsset.assetType.propertyDesc'),
      status: 1
    },
    {
      icon: (new URL('@/assets/icon/assete/creditor-rights.png', import.meta.url).href),
      title: t('assete.addAsset.assetType.creditor'),
      content: t('assete.addAsset.assetType.creditorDesc'),
      status: 0
    },
    {
      icon: (new URL('@/assets/icon/assete/box.png', import.meta.url).href),
      title: t('assete.addAsset.assetType.commodity'),
      content: t('assete.addAsset.assetType.commodityDesc'),
      status: 1
    },
    {
      icon: (new URL('@/assets/icon/assete/line-graph.png', import.meta.url).href),
      title: t('assete.addAsset.assetType.fund'),
      content: t('assete.addAsset.assetType.fundDesc'),
      status: 0
    }
  ]
  const propertyType = [
    {
      label: t('assete.addAsset.propertyType.residential'),
      value: 1
    },
    {
      label: t('assete.addAsset.propertyType.apartment'),
      value: 2
    },
    {
      label: t('assete.addAsset.propertyType.land'),
      value: 3
    }
  ]

  const assetType = useWatch('assetType', form)
  const back = () => {
    window.history.back()
  }

  useEffect(() => {
    if (!form.getFieldValue('assetType')) {
      form.setFieldsValue({ assetType: 0 })
    }
  }, [])

  return (
    <div className="bg-#000000 px-22 pb-15 pt-8 max-md:px-4">
      <div onClick={back} className="w-fit fcc gap-1 clickable">
        <div className="i-ic:round-arrow-back text-6 text-white"></div>
        <div className="text-2xl font-600">{t('assete.addAsset.uploadNewAsset')}</div>
      </div>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="assetType">
          <div className="mt-8 rounded-3 bg-#161B22 p-6">
            <div>{t('assete.addAsset.selectAssetType')}</div>
            <div className="grid cols-4 mt-6 gap-6 max-md:cols-1 max-md:gap-4">
              {
                assetTypeList.map((item, index) => (
                  <div
                    key={index}
                    className={cn(' fccc b-1 b-solid py-6 px-4 rounded-2 relative', assetType === index ? 'b-#00E5FF' : ' b-#374151', item.status === 1 ? 'clickable' : '  cursor-not-allowed')}
                    onClick={() => {
                      if (item.status === 1)
                        form.setFieldsValue({ assetType: index })
                    }}
                  >
                    <div className="size-16 fcc rounded-full bg-#0D1117">
                      <img className="h-8" src={item.icon} alt="" />
                    </div>
                    <div className="mt-4 text-base">{item.title}</div>
                    <div className="mt-2 text-center text-sm text-#9CA3AF">{item.content}</div>
                    <div className={cn(
                      'mt-4 px-3 py-1.5 rounded-9999px b-1 b-solid b-#00E5FF4D bg-#00E6FF33 text-xs fcc gap-1.5 transition-all-300',
                      assetType === index ? 'opacity-100' : ' opacity-0'
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
            <Form.Item name="assetName" label={t('assete.addAsset.assetName')} required rules={[{ required: true, message: t('assete.addAsset.assetNamePlaceholder') }]}>
              <Input placeholder={t('assete.addAsset.assetNamePlaceholder')} />
            </Form.Item>
            {/* 房产类型 */}
            <Form.Item name="propertyType" label={t('assete.addAsset.propertyTypeLabel')} required rules={[{ required: true, message: t('assete.addAsset.propertyTypePlaceholder') }]}>
              <Select options={propertyType} placeholder={t('assete.addAsset.propertyTypePlaceholder')} />
            </Form.Item>
            {/* 建筑面积 */}
            <Form.Item name="assetArea" label={t('assete.addAsset.buildingArea')} required rules={[{ required: true, message: t('assete.addAsset.buildingAreaPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.buildingAreaPlaceholder')} />
            </Form.Item>
            {/* 资产地址 */}
            <Form.Item name="assetAddress" label={t('assete.addAsset.assetAddress')} required rules={[{ required: true, message: t('assete.addAsset.assetAddressPlaceholder') }]}>
              <Input placeholder={t('assete.addAsset.assetAddressPlaceholder')} />
            </Form.Item>
            {/* 建筑年限 */}
            <Form.Item name="assetBuildYear" label={t('assete.addAsset.buildingYear')} required rules={[{ required: true, message: t('assete.addAsset.buildingYearPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.buildingYearPlaceholder')} />
            </Form.Item>
            {/* 资产估值 */}
            <Form.Item name="assetValuation" label={t('assete.addAsset.assetValuation')} required rules={[{ required: true, message: t('assete.addAsset.assetValuationPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.assetValuationPlaceholder')} />
            </Form.Item>
            {/* 卧室数量 */}
            <Form.Item name="assetBedroom" label={t('assete.addAsset.bedroomCount')} required rules={[{ required: true, message: t('assete.addAsset.bedroomCountPlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.bedroomCountPlaceholder')} />
            </Form.Item>
            {/* 缴租日期 */}
            <Form.Item name="assetRentDate" label={t('assete.addAsset.rentDate')} required rules={[{ required: true, message: t('assete.addAsset.rentDatePlaceholder') }]}>
              <Select
                placeholder={t('assete.addAsset.rentDatePlaceholder')}
                options={[...Array.from({ length: 31 }).keys()].map(i => ({ value: i + 1, label: i + 1 }))}
              />
            </Form.Item>
            {/* 链ID */}
            <Form.Item name="assetChainId" label={t('assete.addAsset.chainId')} required rules={[{ required: true, message: t('assete.addAsset.chainIdPlaceholder') }]}>
              <Input placeholder={t('assete.addAsset.chainIdPlaceholder')} />
            </Form.Item>
            {/* 月租金 */}
            <Form.Item name="assetMonthRent" label={t('assete.addAsset.monthlyRent')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.monthlyRentPlaceholder')} />
            </Form.Item>
            {/* 预计年回报率 */}
            <Form.Item name="assetYearRent" label={t('assete.addAsset.expectedAnnualReturn')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnPlaceholder')} />
            </Form.Item>
            {/* 预计年化收益下限 */}
            <Form.Item name="assetYearRentLower" label={t('assete.addAsset.expectedAnnualReturnLower')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnLowerPlaceholder')} />
            </Form.Item>
            {/* 预计年化收益上限 */}
            <Form.Item name="assetYearRentUpper" label={t('assete.addAsset.expectedAnnualReturnUpper')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.expectedAnnualReturnUpperPlaceholder')} />
            </Form.Item>
            {/* 经度 */}
            <Form.Item name="assetLongitude" label={t('assete.addAsset.longitude')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.longitudePlaceholder')} />
            </Form.Item>
            {/* 纬度 */}
            <Form.Item name="assetLatitude" label={t('assete.addAsset.latitude')}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.latitudePlaceholder')} />
            </Form.Item>
            {/* 邮编 */}
            <Form.Item name="assetZipCode" required label={t('assete.addAsset.zipCode')} rules={[{ required: true, message: t('assete.addAsset.zipCodePlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.zipCodePlaceholder')} />
            </Form.Item>
            {/* 国家编码 */}
            <Form.Item name="assetCountryCode" required label={t('assete.addAsset.countryCode')} rules={[{ required: true, message: t('assete.addAsset.countryCodePlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.countryCodePlaceholder')} />
            </Form.Item>
            {/* 城市编码 */}
            <Form.Item name="assetCityCode" required label={t('assete.addAsset.cityCode')} rules={[{ required: true, message: t('assete.addAsset.cityCodePlaceholder') }]}>
              <InputNumber controls={false} placeholder={t('assete.addAsset.cityCodePlaceholder')} />
            </Form.Item>
          </div>
          {/* 房产描述 */}
          <Form.Item name="assetDescription" label={t('assete.addAsset.propertyDescription')} required rules={[{ required: true, message: t('assete.addAsset.propertyDescriptionPlaceholder') }]}>
            <Input.TextArea placeholder={t('assete.addAsset.propertyDescriptionPlaceholder')} rows={3} />
          </Form.Item>
          {/* 位置描述 */}
          <Form.Item name="assetLocationDescription" label={t('assete.addAsset.locationDescription')}>
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
