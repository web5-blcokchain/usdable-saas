import { formatSmartTime } from '@/utils/date'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Divider } from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/user/message/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const messageType = [{
    name: t('message.allMessages'),
    icon: () => <div className="i-radix-icons:view-grid"></div>
  }, { name: t('message.systemNotifications'), icon: () => <div className="i-eva:radio-fill"></div> }, { name: t('message.lawyerNotifications'), icon: () => <div className="i-fa6-solid:gavel"></div> }, { name: t('message.nodeNotifications'), icon: () => <div className="i-heroicons-solid:link"></div> }, { name: t('message.unreadMessages'), icon: (color: string) => <div className={cn('size-3.5 rounded-full b-4.5  bg-transparent', !color ? ' b-#D1D5DB' : 'b-#75fb92')}></div> }]
  const [selectedType, setSelectedType] = useState(0)

  const unreadMessageList = [
    { type: 0, title: t('message.systemNotifications'), content: '任务编号 VAL-2025-00123 已通过律师审核', date: dayjs().format('YYYY-MM-DD HH:mm') },
    { type: 1, title: t('message.lawyerNotifications'), content: '房产证文件不清晰，请重新上传高清扫描件', date: dayjs().add(-1, 'day').format('YYYY-MM-DD HH:mm') },
    { type: 2, title: t('message.nodeNotifications'), content: '资产已上链，哈希：0x8d...F13', date: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm') }
  ]

  const messageTypeText = (type: number) => {
    switch (type) {
      case 0:
        return t('message.systemNotifications')
      case 1:
        return t('message.lawyerNotifications')
      default:
        return t('message.nodeNotifications')
    }
  }

  const messageTypeClass = (type: number) => {
    switch (type) {
      case 0:
        return 'bg-#00E2FF1A text-#00E5FF'
      case 1:
        return 'bg-#00FF891A text-#00FF85'
      default:
        return 'bg-#A758F51A text-#C084FC'
    }
  }

  return (
    <div className="px-22 py-13 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('message.messageCenter')}</div>
          <div className="text-base text-#9CA3AF font-400">{t('message.realTimeNotifications')}</div>
        </div>
        <div className="fcc gap-2">
          <Button className="h-10.5 fcc gap2 b-#1E2328 bg-#1E2328 px-4 text-sm text-#D1D5DB">
            <div className="i-ep:success-filled"></div>
            <div>{t('message.markAllAsRead')}</div>
          </Button>
          <Button className="h-10.5 b-#EF444480 bg-transparent px-4 text-sm text-#F87171">
            <div className="i-material-symbols:delete-outline"></div>
            <div>{t('message.clear')}</div>
          </Button>
        </div>
      </div>
      <div className="mt-8 flex gap-3 rounded-3 bg-#38424F4D p4">
        {messageType.map((type, index) => (
          <Button
            onClick={() => setSelectedType(index)}
            key={index}
            className={cn('px-4 h-9.5 rounded-9999px shadow-none', selectedType === index ? 'b-#00E5FF4D bg-#00E2FF1A text-#00E5FF' : 'bg-transparent b-transparent text-#D1D5DB')}
          >
            {type.icon(selectedType === index ? 'b-#00E5FF' : '')}
            <div className="text-sm">{type.name}</div>
          </Button>
        ))}
      </div>
      <div className="mt-6 fyc justify-between gap-4">
        <div className="fyc gap-2 text-base text-#00FF85">
          <div className="size-2 rounded-full bg-#00FF85"></div>
          <div>{t('message.unreadCount', { count: 3 })}</div>
        </div>
        <div className="text-xs text-#6B7280 font-400">{t('message.today')}</div>
      </div>
      {/* 未读消息 */}
      <div className="mt-4 fol gap-3">
        {
          unreadMessageList.map((item, index) => (
            <div key={index} className="gap-4 b-1 b-#00E6FF33 rounded-3 bg-#161B2199 p-4">
              <div className="flex justify-between">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className={cn('size-10 rounded-2 fcc text-5 b-1', messageTypeClass(item.type), item.type === 0 && 'b-#00E5FF4D', item.type === 1 && 'b-#00FF844D', item.type === 2 && 'b-#A956F84D')}>
                      {item.type === 0 && <div className="i-eva:radio-fill"></div>}
                      {item.type === 1 && <div className="i-fa6-solid:gavel"></div>}
                      {item.type === 2 && <div className="i-heroicons-solid:link"></div>}
                    </div>
                  </div>
                  <div className="fol gap-2">
                    <div className="text-base">{item.title}</div>
                    <div className="text-base text-#D1D5DB font-400">{item.content}</div>
                    <div className={cn('px-2 py-1 rounded-9999px w-fit text-xs', messageTypeClass(item.type))}>{messageTypeText(item.type)}</div>
                  </div>
                </div>
                <div className="text-xs text-#9CA3AF font-400">{formatSmartTime(item.date)}</div>
              </div>
              <div className="flex justify-end">
                <Button className="mt-2 h-8.5 fcc gap-2 b-#00FF8566 bg-#00FF891A px-3 text-sm text-#00FF85">
                  <div className="i-fa6-solid:eye"></div>
                  <div>{t('message.viewCase')}</div>
                </Button>
              </div>
            </div>
          ))
        }
      </div>
      <Divider className="[&:after]:bg-#374151 [&:before]:bg-#374151 !text-sm !text-#6B7280 !font-400">{t('message.readMessages')}</Divider>
      {/* 已读消息 */}
      <div className="mt-4 fol gap-3">
        {
          unreadMessageList.map((item, index) => (
            <div key={index} className="flex justify-between gap-4 b-1 b-#00E6FF33 rounded-3 bg-#161B2199 p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <div className={cn('size-10 rounded-2 fcc text-5 b-1 b-#374151 bg-#1F2937 text-#9ea3ae')}>
                    {item.type === 0 && <div className="i-eva:radio-fill"></div>}
                    {item.type === 1 && <div className="i-fa6-solid:gavel"></div>}
                    {item.type === 2 && <div className="i-heroicons-solid:link"></div>}
                  </div>
                </div>
                <div className="fol gap-2">
                  <div className="text-base text-#D1D5DB">{item.title}</div>
                  <div className="text-base text-#9CA3AF font-400">{item.content}</div>
                  <div className={cn('px-2 py-1 rounded-9999px w-fit text-xs bg-#394150 text-#9CA3AF')}>{messageTypeText(item.type)}</div>
                </div>
              </div>
              <div className="text-xs text-#9CA3AF font-400">{formatSmartTime(item.date)}</div>
            </div>
          ))
        }
      </div>
      <div className="mt-4 fcc">
        <Button className="h-12.5 fcc gap-2 b-#374151 rounded-2 bg-transparent px-6 text-base text-#9CA3AF clickable">
          <div className="i-ci:arrows-reload-01"></div>
          <div>{t('message.loadMore')}</div>
        </Button>
      </div>
    </div>
  )
}
