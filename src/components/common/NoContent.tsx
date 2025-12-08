export function NoContent({ content, icon, ...props }: React.HTMLAttributes<HTMLDivElement> & {
  content?: string
  icon?: React.ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div {...props} className={cn('fccc gap-2', props.className)}>
      {icon || <div className="i-mingcute:empty-box-line text-5xl text-#9CA3AF"></div>}
      <div className="text-base text-#9CA3AF font-400">
        {content || t('common.noContent')}
      </div>
    </div>
  )
}
