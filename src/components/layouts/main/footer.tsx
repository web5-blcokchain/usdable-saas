import { useTranslation } from 'react-i18next'

export default function MainFooter() {
  const { t } = useTranslation()
  return (
    <footer>
      <div className="fyc justify-between bg-#0D1117 px-24 py-6 text-sm text-#9CA3AF max-md:flex-col">
        <div>{t('footer.copyright')}</div>
        <div className="fyc gap-5 [&>div]:cursor-pointer">
          <div>{t('footer.privacyPolicy')}</div>
          <div>{t('footer.termsOfUse')}</div>
          <div>{t('footer.contactUs')}</div>
        </div>
      </div>
    </footer>
  )
}
