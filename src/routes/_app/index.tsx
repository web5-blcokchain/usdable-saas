import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from "framer-motion";
import homeIcon from '@/assets/images/home.png'
import componyIcon from '@/assets/images/compony.png'
import balanceIcon from '@/assets/images/balance.png'
import { AsseteRgister } from '@/components/home/asseteRgister';
import './index.scss'
import { EvaluatorRegister } from '@/components/home/evaluatorRegister';
import { screenToTop } from '@/utils';
import { ConfigProvider } from 'antd';
import { LawOfficeRegister } from '@/components/home/lawOfficeRegister';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function AnimationComponent({ animKey, children, className }: { animKey: string, children: React.ReactNode, className?: string }) {
  return <motion.div key={animKey}
    initial={{ x: 100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -100, opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className={className}>
    {children}
  </motion.div>
}

function RouteComponent() {
  const { t, i18n } = useTranslation();

  const selectType = [
    {
      title: 'home.assetParty',
      description: 'home.assetPartyDesc',
      icon: homeIcon,
      feature: 'home.assetManagement',
      type: 'asset',
    },
    {
      title: 'home.evaluator',
      description: 'home.evaluatorDesc',
      icon: componyIcon,
      feature: 'home.verifyAssets',
      type: 'evaluator',
    },
    {
      title: 'home.lawOffice',
      description: 'home.lawOfficeDesc',
      icon: balanceIcon,
      feature: 'home.legalCompliance',
      type: 'law Firm',
    },
  ]

  const [selectStatus, setSelectStatus] = useState(0)

  useEffect(() => {
    screenToTop()
  }, [selectStatus])

  const selectComponent = useMemo(() => {
    switch (selectStatus) {
      case 0:
        return <AnimationComponent className='mt-41 max-md:mt-3 fcc px-66 max-xl:px-12% max-md:px-4 max-md:pb-30 ' animKey="frist">
          <div className='rounded-lg p-12 max-md:px-6 max-md:py-4 b-2 b-solid b-#31363c '>
            <div className='text-10 max-md:text-3xl leading-15 font-bold'>{t('home.selectIdentity')}</div>
            <div className='text-base text-#8B949E mt-2.5'>{t('home.selectIdentityDesc')}</div>
            <div className=' grid max-md:grid-cols-1 grid-cols-3 gap-6 mt-10'>
              {
                selectType.map((item, index) => (
                  <div key={item.title} onClick={() => setSelectStatus(index + 1)} className='flex flex-col rounded-3  border-1 b-solid b-#30363D p-6 clickable'>
                    <div className='flex-1'>
                      <div className='size-14 rounded-2 bg-#161B22 fcc'>
                        <img src={item.icon} className='h-8' alt="" />
                      </div>
                      <div className='mt-5 text-xl'>{t(item.title)}</div>
                      <div className='mt-3 text-#8B949E text-base'>{t(item.description)}</div>
                    </div>
                    <div className='mt-6 pt-4 b-t-1 b-solid b-#30363D text-#E5E7EB text-sm'>{t(item.feature)}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </AnimationComponent>
      case 1:
        return <AnimationComponent animKey="asset">
          <AsseteRgister back={() => setSelectStatus(0)} />
        </AnimationComponent>
      case 2:
        return <AnimationComponent animKey="evaluator">
          <EvaluatorRegister back={() => setSelectStatus(0)} />
        </AnimationComponent>
      default:
        return <AnimationComponent animKey="lawOffice">
          <LawOfficeRegister back={() => setSelectStatus(0)} />
        </AnimationComponent>
    }
  }, [selectStatus, i18n.language])

  return <div>
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            colorBgContainer: '#ffffff',
            colorPrimary: '#00e5ff', // 勾选时的主色
            borderRadiusSM: 4, // 小尺寸圆角
          },
        },
      }}
    >
      <AnimatePresence mode='wait'>
        {
          selectComponent
        }
      </AnimatePresence>
    </ConfigProvider>


  </div>
}
