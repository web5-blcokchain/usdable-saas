import type { ModalProps } from 'antd'
import { Modal } from 'antd'
import './index.scss'

export function CommonDialog({
  ...props
}: ModalProps) {
  useEffect(() => {
    const dialogContent = document.querySelector('.common-dialog')?.querySelector('.ant-modal')
    if (!dialogContent || props.open)
      return
    setTimeout(() => {
      dialogContent.scrollTo(0, 0)
    }, 100)
  }, [props.open])

  return (
    <Modal
      {...props}
      className={cn(props.className, `common-dialog`, !props.footer && `[&.common-dialog>div>.ant-modal-content>.ant-modal-footer]:py-0 
        [&.common-dialog>div>.ant-modal-content>.ant-modal-footer]:b-0`)}
      closable={false}
      title={(
        <div className="fyc justify-between gap-4">
          {props.title}
          {props.closable && (props.closeIcon || (
            <div onClick={e => props.onCancel?.(e as any)} className="size-8 fcc rounded-6px transition-all-300 clickable hover:bg-#35373c">
              <div className="i-lsicon:close-small-filled text-6 text-#818285"></div>
            </div>
          ))}
        </div>
      )}
    >
      {props.children}
    </Modal>
  )
}
