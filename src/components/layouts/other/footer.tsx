import { Link } from "@tanstack/react-router"
import { useTranslation } from 'react-i18next'

export function OtherFooter() {
  const { t } = useTranslation()

  const navList = [
    {
      title: t('layoutFooter.platformServices'),
      list: [
        { title: t('layoutFooter.assetOnChain'), url: '' },
        { title: t('layoutFooter.complianceReview'), url: '' },
        { title: t('layoutFooter.evaluationConfirmation'), url: '' },
        { title: t('layoutFooter.investmentSubscription'), url: '' },
        { title: t('layoutFooter.incomeDistribution'), url: '' }
      ]
    },
    {
      title: t('layoutFooter.institutionalCooperation'),
      list: [
        { title: t('layoutFooter.reviewInstitutionCooperation'), url: '' },
        { title: t('layoutFooter.nodeCooperation'), url: '' },
        { title: t('layoutFooter.evaluationInstitution'), url: '' },
        { title: t('layoutFooter.lawyerTeamCooperation'), url: '' },
        { title: t('layoutFooter.strategicPartners'), url: '' }
      ]
    },
    {
      title: t('layoutFooter.legalCompliance'),
      list: [
        { title: t('layoutFooter.complianceStatement'), url: '' },
        { title: t('layoutFooter.riskDisclosure'), url: '' },
        { title: t('layoutFooter.privacyPolicy'), url: '' },
        { title: t('layoutFooter.legalAgreement'), url: '' },
        { title: t('layoutFooter.contactUs'), url: '' }
      ]
    }
  ]

  return <footer className="bg-#161B22 pt-16 px-18 max-md:px-4 pb-8 max-md:bg-black">
    <div className="grid cols-4 max-md:cols-1 gap-12 max-md:gap-10">
      <div>
        <div className="hidden max-md:block text-xl font-600 text-white">{t('layoutFooter.platformIntroduction')}</div>
        <img className="h-12 max-md:hidden" src={(new URL("@/assets/images/logo.png", import.meta.url)).href} alt="" />
        <div className="text-base font-400 text-#8B949E mt-6 max-md:hidden">{t('layoutFooter.platformDescription1')}</div>
        <div className="mt-3.5 text-base font-400 text-#9CA3AF hidden max-md:block">{t('layoutFooter.platformDescription2')}</div>
        <div className="mt-5 fyc [&>div]:size-10 [&>div]:rounded-full [&>div]:fcc [&>div]:bg-#0D1117 max-md:[&>div]:bg-#1E293B
        [&>div>div]:text-4 [&>div>div]:bg-#8d949d gap-4 ">
          <div>
            <div className="i-ri:twitter-x-fill"></div>
          </div>
          <div>
            <div className="i-mdi:linkedin"></div>
          </div>
          <div>
            <div className="i-ic:round-telegram"></div>
          </div>
        </div>
      </div>
      {
        navList.map((nav) => (
          <div key={nav.title}>
            <div className="text-lg text-white font-600">{nav.title}</div>
            <div className="fol gap-3 mt-6 text-base font-400 text-#8B949E hover:[&>div]:text-primary">
              {
                nav.list.map((item) => (
                  <div key={item.title}>
                    {item.url.includes("http") ?
                      <a href={item.url} target="_blank">{item.title}</a> :
                      <Link to={item.url}>{item.title}</Link>
                    }
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
    <div className="fyc max-md:flex-col justify-between mt-12 pt-8 b-t-1 b-t-#1F2937 b-t-solid text-sm text-#8B949E
    max-md:text-#6B7280 font-400 gap-4  ">
      <div>{t('layoutFooter.copyright')}</div>
      <div className="fyc gap-6 [&>div]:cursor-pointer">
        <div>{t('layoutFooter.privacyPolicy')}</div>
        <div>{t('layoutFooter.termsOfService')}</div>
        <div>{t('layoutFooter.cookiePolicy')}</div>
      </div>
    </div>
  </footer>
}