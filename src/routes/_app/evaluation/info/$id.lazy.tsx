import mustImg from '@/assets/test/test.png'
import { CommonDialog } from '@/components/common/dialog/common'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, Image, Input } from 'antd'
import dayjs from 'dayjs'
import { UploadReportDialog } from './-components/uploadReportDialog'

export const Route = createLazyFileRoute('/_app/evaluation/info/$id')({
  component: RouteComponent
})

function RouteComponent() {
  // const { id } = useParams({
  //   from: '/_app/evaluation/info/$id'
  // }) as { id: string }
  const back = () => {
    window.history.back()
  }
  const { t } = useTranslation()

  const typeList = [
    { id: 'CERT-001', title: t('evaluation.info.fileTypes.propertyCertificate'), isMust: 1, img: mustImg, updateTime: '2025-11-12', createTime: '2025-11-12' },
    { id: 'CERT-002', title: t('evaluation.info.fileTypes.purchaseContract'), isMust: 1, img: mustImg, updateTime: '2025-11-12', createTime: '2025-11-12' },
    { id: 'CERT-003', title: t('evaluation.info.fileTypes.landUseRightCertificate'), isMust: 1, img: mustImg, updateTime: '2025-11-12', createTime: '2025-11-12' },
    { id: 'CERT-004', title: t('evaluation.info.fileTypes.propertyPhotos'), isMust: 0, img: '', updateTime: '2025-11-12', createTime: '2025-11-12' },
    { id: 'CERT-005', title: t('evaluation.info.fileTypes.mortgageInfo'), isMust: 0, img: '', updateTime: '2025-11-12', createTime: '2025-11-12' }
  ]
  // 图片弹窗
  const [visible, setVisible] = useState(false)
  // 驳回弹窗
  const [rejectVisible, setRejectVisible] = useState(false)
  const rejectApplication = (_text: string) => {
    setRejectVisible(false)
  }
  // 上传评估报告弹窗
  const [uploadReportVisible, setUploadReportVisible] = useState(false)

  return (
    <div className="px-22 pb-13">
      <div className="mt-6">
        <div onClick={back} className="mb-8 w-fit fcc gap-1 clickable">
          <div className="i-ic:round-arrow-back text-6 text-white"></div>
          <div className="text-2xl font-600">{t('evaluation.info.back')}</div>
        </div>
        <div className="text-10">{t('evaluation.info.sampleProperty')}</div>
        <div className="mt-1 text-base text-#9CA3AF">
          {t('assete.info.assetCode')}
          ：
          <span className="text-white"> PROP-2023-0589</span>
          |
          {t('assete.info.address')}
          ：
          {t('evaluation.info.sampleAddress')}
        </div>
        <div className="mt-9 text-xl">{t('evaluation.info.assetInfo')}</div>
        <div className="grid cols-3 mt-6 gap-6">
          {typeList.map(item => (
            <div key={item.id} className="rounded-3 bg-#161B22 p-5 pb-10">
              <div className="flex justify-between gap-3">
                <div>
                  <div className="text-lg text-white">{item.title}</div>
                  <div className="text-sm text-#9CA3AF">
                    {item.isMust ? t('evaluation.info.required') : t('evaluation.info.optional')}
                    {t('evaluation.info.fileNumber')}
                    ：
                  </div>
                  <div className="text-sm text-#9CA3AF">{item.id}</div>
                </div>
                <div className={cn(
                  'px-3 py-1 rounded-9999px b-1 b-solid w-fit h-fit fyc gap-1',
                  item.img ? 'bg-#00FF8733 b-#00FF844D text-#00FF85 ' : 'bg-#EB45451A b-#EB45451A text-#F87171'
                )}
                >
                  <div className="i-ep:success-filled text-4"></div>
                  <div className="text-sm">
                    {' '}
                    {item.img ? t('evaluation.info.qualified') : t('evaluation.info.unqualified')}
                  </div>
                </div>
              </div>
              <div className="mt-4 min-h-48 b b-#374151 rounded-2 b-solid bg-#1F2937">
                {item.img
                  ? <img className="aspect-[5/3] w-full" src={item.img} alt="" />
                  : (
                      <div className="aspect-[5/3] size-full fccc gap-2 p-4">
                        <div className="i-tabler:camera-filled bg-#6d727f text-10"></div>
                        <div className="text-sm text-#9CA3AF">
                          {item.title}
                          {t('evaluation.info.missing')}
                        </div>
                        <div className="text-xs text-#6B7280">{t('evaluation.info.needProvide')}</div>
                      </div>
                    )}
              </div>
              <div className="mt-5 flex justify-between">
                <div className="text-sm text-#9CA3AF">
                  {t('evaluation.info.uploadDate')}
                  ：
                  {dayjs(item.updateTime).format('YYYY-MM-DD')}
                </div>
                <div className="fyc gap-2 [&>div]:clickable">
                  <div className="i-fa6-solid:eye text-sm text-#69e2fc" onClick={() => { setVisible(true) }}></div>
                  <div className="i-flowbite:download-solid text-lg text-#9ea3ae"></div>
                </div>
              </div>
            </div>
          ))}
          <div className="fccc b-2 b-#4B5563 rounded-2 border-dashed bg-#13171c px-4 clickable">
            <div className="size-16 fcc b-2 b-#4B5563 rounded-full border-dashed">
              <div className="i-uil:plus text-8 text-#6d727f"></div>
            </div>
            <div className="mt-4 text-lg">{t('evaluation.info.addSupplementaryFile')}</div>
            <div className="mt-1 text-center text-sm text-#9CA3AF">{t('evaluation.info.addSupplementaryFileDesc')}</div>
          </div>
        </div>
        <div className="mt-10 fyc justify-end gap-4 text-center [&>button]:h-12.5 [&>button]:min-w-46 [&>button]:px-8">
          <Button className="b-#374151 bg-#1E2328" onClick={() => { setRejectVisible(true) }}>{t('evaluation.info.rejectAsset')}</Button>
          <Button className="b-#00E5FF bg-#00E5FF text-black" onClick={() => { setUploadReportVisible(true) }}>{t('evaluation.info.uploadReport')}</Button>
        </div>
      </div>
      {/* 显示图片浮窗 */}
      <Image
        width={200}
        style={{ display: 'none' }}
        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
        preview={{
          visible,
          scaleStep: 0.5,
          src: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
          onVisibleChange: (value) => {
            setVisible(value)
          }
        }}
      />
      {/* 驳回弹窗 */}
      <RejectDialog visible={rejectVisible} setVisible={setRejectVisible} reject={rejectApplication} />
      {/* 上传评估报告弹窗 */}
      <UploadReportDialog visible={uploadReportVisible} setVisible={setUploadReportVisible} data={{}} />

    </div>
  )
}

function RejectDialog({ visible, setVisible, reject }: {
  visible: boolean
  setVisible: (visible: boolean) => void
  reject: (text: string) => void
}) {
  const { t } = useTranslation()

  return (
    <CommonDialog
      open={visible}
      onCancel={() => setVisible(false)}
      maskClosable={false}
      width={446}
      className={cn('login-dialog [&>div>.ant-modal-content]:!bg-#171b21 b-1 b-solid  b-#1E293B', 'rounded-2 ')}
      centered
      closable
      title={(
        <div className=" ">
          <div className="text-600 text-xl">{t('evaluation.info.rejectDialogTitle')}</div>
          <div className="mt-1.5 text-base text-#9CA3AF">{t('evaluation.info.rejectDialogDesc')}</div>
        </div>
      )}
      footer={false}
    >
      <div className="mt-6 text-base">
        <div className="fyc gap-3">
          <div className="text-#9CA3AF">{t('evaluation.info.assetNumber')}</div>
          <div>ASSET-9876</div>
        </div>
        <div className="mt-3 text-#D1D5DB">{t('evaluation.info.detailedExplanation')}</div>
        <div className="mt-3">
          <Input.TextArea
            rows={4}
            style={{ resize: 'none' }}
            placeholder={t('evaluation.info.rejectDialogPlaceholder')}
          />
        </div>
        <div className="grid cols-2 gap-3 pb-6 pt-33 [&>button]:h-12.5">
          <Button onClick={() => setVisible(false)} className="b-#30363D bg-transparent text-#D1D5DB">{t('common.cancel')}</Button>
          <Button onClick={() => reject('')} className="b-#EF4444 bg-#EF4444">{t('evaluation.info.reject')}</Button>
        </div>
      </div>
    </CommonDialog>
  )
}
