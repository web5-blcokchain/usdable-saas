import type { SearchParams } from '@/api/lawyerWorkbenchApi'
import type { Dayjs } from 'dayjs'
import type { Dispatch, SetStateAction } from 'react'
import { getLocation } from '@/api/common'
import { useQuery } from '@tanstack/react-query'
import { DatePicker, Input, Select } from 'antd'
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
        label: item.name,
        zh_label: item.name,
        en_label: item.name_en,
        code: item.code
      })),
    refetchOnWindowFocus: false
  })

  // 搜索国家
  const countryList = useMemo(() => {
    return countryData?.map((val) => {
      return {
        value: val.value,
        zh_label: val.zh_label,
        en_label: val.en_label,
        code: val.code,
        label:
          i18n.language === 'zh' ? val.zh_label : val.en_label || val.zh_label
      }
    })
  }, [countryData, i18n.language])

  type LocationData = typeof countryList

  const selectCity = (
    value: string,
    option?: NonNullable<NonNullable<LocationData>[number]>
  ) => {
    return (
      (option?.label ?? '').toLowerCase().includes(value.toLowerCase())
      || (option?.code ?? '').toLowerCase().includes(value.toLowerCase())
    )
  }
  // 修改时间
  const changeDateRange = (
    dates: [start: Dayjs | null, end: Dayjs | null] | null
  ) => {
    const [start, end] = dates || [null, null]
    setFilterParams((pre) => {
      const start_date = start ? start.format('YYYY-MM-DD') : ''
      const end_date = end ? end.format('YYYY-MM-DD') : ''
      return {
        ...pre,
        start_date,
        end_date
      }
    })
  }
  const onSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilterParams(prev => ({ ...prev, keyword: e.currentTarget?.value }))
    }
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
          value={filterParams.country_id || undefined}
          showSearch
          allowClear
          defaultActiveFirstOption={false}
          options={countryList}
          loading={locationDataLoading}
          filterOption={selectCity}
          onChange={value =>
            setFilterParams(prev => ({ ...prev, country_id: value }))}
          className="[&>.ant-select-selector]:!b-#334155"
          placeholder={t('lawyerWorkbench.selectCountry')}
        />
      </div>
      <div>
        <div>{t('lawyerWorkbench.timeRange')}</div>
        {/* 全部时间 */}
        <RangePicker
          value={
            !filterParams.start_date || !filterParams.end_date
              ? [null, null]
              : [dayjs(filterParams.start_date), dayjs(filterParams.end_date)]
          }
          onChange={changeDateRange}
          className="!b-#334155 !bg-#1f2328"
        />
      </div>
      <div>
        <div>{t('lawyerWorkbench.search')}</div>
        <Input
          onKeyUp={onSearch}
          className="!b-#334155 !bg-#1f2328"
          placeholder={t('lawyerWorkbench.searchPlaceholder')}
        />
      </div>
    </div>
  )
}
