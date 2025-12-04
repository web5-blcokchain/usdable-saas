import type { SearchParams } from '@/api/lawyerWorkbenchApi'
import type { Dayjs } from 'dayjs'
import type { Dispatch, SetStateAction } from 'react'
import { getLocation } from '@/api/common'
import { useQuery } from '@tanstack/react-query'
import { DatePicker, Select } from 'antd'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
export function HomeForm({
  filterParams,
  setFilterParams
}: {
  filterParams: SearchParams
  setFilterParams: Dispatch<SetStateAction<SearchParams>>
}) {
  const { t } = useTranslation()
  // 获取国家数据
  const { data: countryData, isFetching: locationDataLoading } = useQuery({
    queryKey: ['getLocation', 1],
    queryFn: async () => {
      const data = await getLocation({
        level: 2
      })
      // 处理数据
      return data.data || []
    },
    select: data =>
      data.map(item => ({
        value: item.id,
        label: (
          <div>{t(i18n.language === 'zh' ? item.name : item.name_en)}</div>
        ),
        labelZh: item.name,
        labelEn: item.name_en
      }))
  })

  const [searchCountry, setSearchCountry] = useState('')
  // 搜索国家
  const filteredCountryData = useMemo(() => {
    const search = searchCountry?.trim() || ''
    if (countryData && search) {
      return countryData.filter((item) => {
        return item.labelZh.includes(search) || item.labelEn.includes(search)
      })
    }
    return countryData || []
  }, [countryData, searchCountry])
  // 修改时间
  const changeDateRange = (
    dates: [start: Dayjs | null, end: Dayjs | null] | null
  ) => {
    const [start, end] = dates || [null, null]
    setFilterParams((pre) => {
      const startDate = start ? start.format('YYYY-MM-DD') : ''
      const endDate = end ? end.format('YYYY-MM-DD') : ''
      return {
        ...pre,
        startDate,
        endDate
      }
    })
  }

  return (
    <div
      className="grid cols-3 mt-4 gap-3 pb-4 [&>div>div:first-child]:mb-1"
      style={
        {
          '--input-border-color': '#334155',
          '--input-bg-color': '#1f2328'
        } as any
      }
    >
      <div>
        <div>{t('lawyerWorkbench.country')}</div>
        {/* 全部 */}
        <Select
          value={filterParams.country || undefined}
          showSearch
          onSearch={setSearchCountry}
          defaultActiveFirstOption={false}
          filterOption={false}
          options={filteredCountryData}
          loading={locationDataLoading}
          onChange={value =>
            setFilterParams(prev => ({ ...prev, country: value }))}
          className="[&>.ant-select-selector]:!b-#334155"
          placeholder={t('lawyerWorkbench.selectCountry')}
        />
      </div>
      <div>
        <div>{t('lawyerWorkbench.timeRange')}</div>
        {/* 全部时间 */}
        <RangePicker
          value={
            !filterParams.startDate || !filterParams.endDate
              ? [null, null]
              : [dayjs(filterParams.startDate), dayjs(filterParams.endDate)]
          }
          onChange={changeDateRange}
          className="!b-#334155 !bg-#1f2328"
        />
      </div>
      <div>
        <div>{t('lawyerWorkbench.caseStatus')}</div>
        {/* 全部状态 */}
        <Select
          value={filterParams.status || undefined}
          onChange={value =>
            setFilterParams(prev => ({ ...prev, status: value }))}
          className="[&>.ant-select-selector]:!b-#334155"
          placeholder={t('lawyerWorkbench.selectCaseStatus')}
        />
      </div>
    </div>
  )
}
