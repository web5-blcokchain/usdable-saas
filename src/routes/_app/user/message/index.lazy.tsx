import type { MessageList } from '@/api/messageApi'
import {
  deleteMessage,
  getMessageList,
  markMessageRead
} from '@/api/messageApi'
import { MESSAGE_STATUS, MESSAGE_TYPE } from '@/enums/message'
import { useMessageStore } from '@/stores/message'
import { formatSmartTime } from '@/utils/date'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Divider, Spin } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/_app/user/message/')({
  component: RouteComponent
})

function RouteComponent() {
  const { t } = useTranslation()

  const DEFAULT_PAGE_SIZE = 10
  const { setUnReadCount, setMessage } = useMessageStore(state => state)
  const [pageInfo, setPageInfo] = useState({
    type: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    isReload: false
  })
  const messageCount = useRef(0)
  const [messageList, setMessageList] = useState({
    unReadMessage: [] as MessageList[],
    readMessage: [] as MessageList[]
  })
  const messageTotal = useRef(0)
  // 标记消息为已读
  const { mutateAsync: markMessageReadMutate, isPending: readLoading }
    = useMutation({
      mutationKey: ['markMessageRead'],
      mutationFn: async () => {
        const list = [...messageList.unReadMessage, ...messageList.readMessage]
        const ids = list.map(item => item.id).join(',')
        return await markMessageRead({ ids })
      },
      onSuccess() {
        setPageInfo(pre => ({
          ...pre,
          pageSize: pre.page * DEFAULT_PAGE_SIZE,
          isReload: true
        }))
      }
    })
  // 删除消息
  const { mutateAsync: deleteMessageMutate, isPending: deleteLoading }
    = useMutation({
      mutationKey: ['deleteMessage'],
      mutationFn: async () => {
        const list = [...messageList.unReadMessage, ...messageList.readMessage]
        const ids = list.map(item => item.id).join(',') || ''
        return await deleteMessage({ ids })
      },
      onSuccess() {
        setPageInfo(pre => ({
          ...pre,
          pageSize: pre.page * DEFAULT_PAGE_SIZE,
          isReload: true
        }))
      }
    })

  // 获取消息列表
  const {
    data: messageData,
    isLoading,
    isFetching
  } = useQuery({
    queryKey: [
      'getMessageList',
      pageInfo.page,
      pageInfo.pageSize,
      pageInfo.isReload,
      pageInfo.type,
      DEFAULT_PAGE_SIZE
    ],
    queryFn: async () => {
      const res = await getMessageList({
        page: pageInfo.isReload ? 1 : pageInfo.page,
        pageSize: pageInfo.isReload ? pageInfo.pageSize : DEFAULT_PAGE_SIZE,
        type: pageInfo.type === 0 ? undefined : (pageInfo.type as any)
      })
      return res.data
    }
  })

  useEffect(() => {
    const data = messageData
    if (!data)
      return
    messageCount.current++
    const unReadMessage
      = data?.list?.filter(item => item.status === MESSAGE_STATUS.UNREAD) || []
    const readMessage
      = data?.list?.filter(item => item.status === MESSAGE_STATUS.READ) || []
    if (data?.unread) {
      setUnReadCount(data.unread)
      setMessage(data?.list || ([] as any[]))
      messageTotal.current = data?.count || 0
      console.log('messageTotal', messageTotal.current)
    }
    if (pageInfo.page > 1 && pageInfo.pageSize === DEFAULT_PAGE_SIZE) {
      setMessageList(pre => ({
        unReadMessage: [...pre.unReadMessage, ...(unReadMessage || [])],
        readMessage: [...pre.readMessage, ...(readMessage || [])]
      }))
    }
    else {
      setMessageList({
        unReadMessage: unReadMessage || [],
        readMessage: readMessage || []
      })
    }
  }, [messageData])
  // 切换分页
  const switchPage = useCallback(
    (type: number) => {
      setPageInfo({
        ...pageInfo,
        type,
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE
      })
    },
    [pageInfo]
  )
  const loadMore = useCallback(() => {
    if (
      (messageData?.count || 0)
      <= (messageData?.pageSize || 0) * (messageData?.page || 0)
    ) {
      return
    }
    setPageInfo({
      ...pageInfo,
      page: pageInfo.page + 1,
      pageSize: DEFAULT_PAGE_SIZE,
      isReload: false
    })
  }, [pageInfo, messageData])

  const messageType = [
    {
      name: t('message.allMessages'),
      icon: () => <div className="i-radix-icons:view-grid"></div>,
      type: 0 as any
    },
    {
      name: t('message.userAudit'),
      icon: () => <div className="i-eva:radio-fill"></div>,
      type: MESSAGE_TYPE.USER_AUDIT
    },
    {
      name: t('message.assetOnchainSuccess'),
      icon: () => <div className="i-heroicons-solid:link"></div>,
      type: MESSAGE_TYPE.ASSET_ONCHAIN_SUCCESS
    },
    {
      name: t('message.propertyDefault'),
      icon: () => <div className="i-fa6-solid:gavel"></div>,
      type: MESSAGE_TYPE.PROPERTY_DEFAULT
    },
    {
      name: t('message.announcement'),
      icon: (color: string) => (
        <div
          className={cn(
            'size-3.5 rounded-full b-4.5  bg-transparent',
            !color ? ' b-#D1D5DB' : 'b-#75fb92'
          )}
        >
        </div>
      ),
      type: MESSAGE_TYPE.ANNOUNCEMENT
    }
  ]

  const messageTypeText = (type: MESSAGE_TYPE | undefined) => {
    switch (type) {
      case MESSAGE_TYPE.USER_AUDIT:
        return t('message.userAudit')
      case MESSAGE_TYPE.ASSET_ONCHAIN_SUCCESS:
        return t('message.assetOnchainSuccess')
      case MESSAGE_TYPE.PROPERTY_DEFAULT:
        return t('message.propertyDefault')
      default:
        return t('message.announcement')
    }
  }

  const messageTypeClass = (type: MESSAGE_TYPE | undefined) => {
    switch (type) {
      case MESSAGE_TYPE.USER_AUDIT:
        return 'bg-#00E2FF1A text-#00E5FF'
      case MESSAGE_TYPE.ASSET_ONCHAIN_SUCCESS:
        return 'bg-#00FF891A text-#00FF85'
      default:
        return 'bg-#A758F51A text-#C084FC'
    }
  }
  const messageIcon = (type: MESSAGE_TYPE | undefined) => {
    switch (type) {
      case MESSAGE_TYPE.USER_AUDIT:
        return <div className="i-eva:radio-fill"></div>
      case MESSAGE_TYPE.ASSET_ONCHAIN_SUCCESS:
        return <div className="i-fa6-solid:gavel"></div>
      case MESSAGE_TYPE.PROPERTY_DEFAULT:
        return <div className="i-heroicons-solid:link"></div>
      default:
        return (
          <div
            className={cn(
              'size-3.5 rounded-full b-4.5  bg-transparent',
              'b-#75fb92'
            )}
          >
          </div>
        )
    }
  }

  return (
    <div className="px-22 py-13 text-white">
      <div className="fyc justify-between">
        <div>
          <div className="text-10 font-600">{t('message.messageCenter')}</div>
          <div className="text-base text-#9CA3AF font-400">
            {t('message.realTimeNotifications')}
          </div>
        </div>
        <div className="fcc gap-2">
          <Button
            loading={readLoading}
            onClick={() => markMessageReadMutate()}
            className="h-10.5 fcc gap2 b-#1E2328 bg-#1E2328 px-4 text-sm text-#D1D5DB"
          >
            {!readLoading && <div className="i-ep:success-filled"></div>}
            <div>{t('message.markAllAsRead')}</div>
          </Button>
          <Button
            loading={deleteLoading}
            onClick={() => deleteMessageMutate()}
            className="h-10.5 b-#EF444480 bg-transparent px-4 text-sm text-#F87171"
          >
            {!deleteLoading && (
              <div className="i-material-symbols:delete-outline"></div>
            )}
            <div>{t('message.clear')}</div>
          </Button>
        </div>
      </div>

      <div className="mt-8 flex gap-3 rounded-3 bg-#38424F4D p4">
        {messageType.map((type, index) => (
          <Button
            onClick={() => switchPage(type.type)}
            key={index}
            className={cn(
              'px-4 h-9.5 rounded-9999px shadow-none',
              pageInfo.type === type.type
                ? 'b-#00E5FF4D bg-#00E2FF1A text-#00E5FF'
                : 'bg-transparent b-transparent text-#D1D5DB'
            )}
          >
            {type.icon(pageInfo.type === type.type ? 'b-#00E5FF' : '')}
            <div className="text-sm">{type.name}</div>
          </Button>
        ))}
      </div>
      <Waiting
        className="h-120 w-full fcc"
        for={!(isLoading && messageCount.current === 0)}
      >
        <Spin spinning={isFetching}>
          <div className="mt-6 fyc justify-between gap-4">
            <div className="fyc gap-2 text-base text-#00FF85">
              <div className="size-2 rounded-full bg-#00FF85"></div>
              <div>
                {t('message.unreadCount', { count: messageData?.unread || 0 })}
              </div>
            </div>
            <div className="text-xs text-#6B7280 font-400">
              {t('message.today')}
            </div>
          </div>
          {/* 未读消息 */}
          <div className="mt-4 fol gap-3">
            {messageList?.unReadMessage?.map((item, index) => (
              <div
                key={index}
                className="gap-4 b-1 b-#00E6FF33 rounded-3 bg-#161B2199 p-4"
              >
                <div className="flex justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <div
                        className={cn(
                          'size-10 rounded-2 fcc text-5 b-1',
                          messageTypeClass(item.type),
                          item.type === MESSAGE_TYPE.USER_AUDIT
                            ? 'b-#00E5FF4D'
                            : item.type === MESSAGE_TYPE.ASSET_ONCHAIN_SUCCESS
                              ? 'b-#00FF844D'
                              : item.type === MESSAGE_TYPE.PROPERTY_DEFAULT
                                && 'b-#A956F84D'
                        )}
                      >
                        {messageIcon(item.type)}
                      </div>
                    </div>
                    <div className="fol gap-2">
                      <div className="text-base">{item.title}</div>
                      <div className="text-base text-#D1D5DB font-400">
                        {item.content}
                      </div>
                      <div
                        className={cn(
                          'px-2 py-1 rounded-9999px w-fit text-xs',
                          messageTypeClass(item.type)
                        )}
                      >
                        {messageTypeText(item.type)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-#9CA3AF font-400">
                    {formatSmartTime(item.create_time, t)}
                  </div>
                </div>
                {/* <div className="flex justify-end">
                  <Button className="mt-2 h-8.5 fcc gap-2 b-#00FF8566 bg-#00FF891A px-3 text-sm text-#00FF85">
                    <div className="i-fa6-solid:eye"></div>
                    <div>{t('message.viewCase')}</div>
                  </Button>
                </div> */}
              </div>
            ))}
            {messageList?.unReadMessage?.length === 0
              && messageList?.readMessage?.length !== 0 && <NoContent />}
          </div>
          {messageList?.unReadMessage?.length !== 0
            || (messageList?.readMessage?.length !== 0 && (
              <Divider className="[&:after]:bg-#374151 [&:before]:bg-#374151 !text-sm !text-#6B7280 !font-400">
                {t('message.readMessages')}
              </Divider>
            ))}
          {/* 已读消息 */}
          <div className="mt-4 fol gap-3">
            {messageList?.readMessage?.map(item => (
              <div
                key={item.id}
                className="flex justify-between gap-4 b-1 b-#00E6FF33 rounded-3 bg-#161B2199 p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <div
                      className={cn(
                        'size-10 rounded-2 fcc text-5 b-1 b-#374151 bg-#1F2937 text-#9ea3ae'
                      )}
                    >
                      {messageIcon(item.type)}
                    </div>
                  </div>
                  <div className="fol gap-2">
                    <div className="text-base text-#D1D5DB">{item.title}</div>
                    <div className="text-base text-#9CA3AF font-400">
                      {item.content}
                    </div>
                    <div
                      className={cn(
                        'px-2 py-1 rounded-9999px w-fit text-xs bg-#394150 text-#9CA3AF'
                      )}
                    >
                      {messageTypeText(item.type)}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-#9CA3AF font-400">
                  {formatSmartTime(item.create_time, t)}
                </div>
              </div>
            ))}
            {messageList?.readMessage?.length === 0 && (
              <NoContent className="mb-4" />
            )}
          </div>
        </Spin>
        {(messageData?.count || 0)
          > (messageData?.pageSize || 0) * (messageData?.page || 0) && (
          <div className="mt-4 fcc">
            <Button
              onClick={loadMore}
              disabled={isFetching}
              loading={isFetching && pageInfo.page > 1}
              className="h-12.5 fcc gap-2 b-#374151 rounded-2 bg-transparent px-6 text-base text-#9CA3AF clickable"
            >
              {!(isFetching && pageInfo.page > 1) && (
                <div className="i-ci:arrows-reload-01"></div>
              )}
              <div>{t('message.loadMore')}</div>
            </Button>
          </div>
        )}
      </Waiting>
    </div>
  )
}

function NoContent({ className }: { className?: string }) {
  const { t } = useTranslation()
  return (
    <div className={cn('fccc gap-2', className)}>
      <div className="i-mingcute:empty-box-line text-5xl text-#9CA3AF"></div>
      <div className="text-base text-#9CA3AF font-400">
        {t('common.noContent')}
      </div>
    </div>
  )
}
