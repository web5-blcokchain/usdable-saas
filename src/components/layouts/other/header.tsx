import logo from '@/assets/images/logo.png'
import { Link } from '@tanstack/react-router'
import { Button } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSelect } from '../main/header'

export function OtherHeader() {
  const { t } = useTranslation()

  const navList = [
    t('header.nav.home'),
    t('header.nav.coreValue'),
    t('header.nav.chainProcess'),
    t('header.nav.chainTransparency'),
    t('header.nav.platformAdvantages')
  ]

  const [selectNav, setSelectNav] = useState(0)
  const changeSelectNav = (index: number) => {
    setSelectNav(index)
    const mainDom = document.querySelector('.app-content')
    const headerDom = document.querySelector('#other-header')
    const moveDom = document.querySelector(`.move-content-${index}`)
    if (index === 0) {
      mainDom?.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    if (mainDom && moveDom && headerDom) {
      mainDom?.scrollTo({
        top:
          moveDom?.getBoundingClientRect().top
          - headerDom?.getBoundingClientRect().height
          + mainDom.scrollTop || 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <header
      className="sticky top-0 z-99 w-full fyc justify-between bg-black px-22 py-3 max-md:px-4 max-md:py-2"
      id="other-header"
    >
      <div className="fyc gap-14">
        <img
          onClick={() => changeSelectNav(0)}
          className="h-14 cursor-pointer max-md:h-12"
          src={logo}
          alt=""
        />
        <div className="fcc gap-12 text-base font-400 max-md:hidden">
          {navList.map((item, index) => (
            <div
              onClick={() => changeSelectNav(index)}
              key={item}
              className={cn(
                'clickable',
                selectNav === index ? 'text-primary' : 'text-white'
              )}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div className="fyc gap-4">
        <LanguageSelect />
        <MenuContent />
        <Link to="/register" className="max-md:hidden">
          <Button className="h-10 b-#00E5FF rounded-1.5 bg-#00E5FF px-4 text-base text-#0A0A0A font-400 max-md:h-8 max-md:text-sm">
            {t('header.startUsing')}
          </Button>
        </Link>
      </div>
    </header>
  )
}

function MenuContent() {
  const { t } = useTranslation()

  const [headerHeight, setHeaderHeight] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  useEffect(() => {
    const header = document.getElementById('other-header')
    if (header) {
      setHeaderHeight(header.offsetHeight)
    }
    const body = document.querySelector('.app-content') as HTMLElement | null
    if (!body)
      return
    if (isMenuOpen) {
      body.style.overflow = 'hidden'
    }
    else {
      body.style.overflow = 'auto'
    }
  }, [isMenuOpen])
  const navList = [
    t('header.nav.home'),
    t('header.nav.coreValue'),
    t('header.nav.chainProcess'),
    t('header.nav.chainTransparency'),
    t('header.nav.platformAdvantages')
  ]

  const changeSelectNav = (index: number) => {
    const mainDom = document.querySelector('.app-content')
    const headerDom = document.querySelector('#other-header')
    const moveDom = document.querySelector(`.move-content-${index}`)
    if (index === 0) {
      mainDom?.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
    if (mainDom && moveDom && headerDom) {
      mainDom?.scrollTo({
        top:
          moveDom?.getBoundingClientRect().top
          - headerDom?.getBoundingClientRect().height
          + mainDom.scrollTop || 0,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div>
      <div
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="i-mingcute:menu-line hidden text-4 max-md:block"
      >
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {isMenuOpen
          ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-999 bg-black"
                style={{
                  top: `${headerHeight}px`,
                  height: `calc(100vh - ${headerHeight}px)`
                }}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsMenuOpen(false)
                  }}
                  className="h-full w-full px-4"
                >
                  <div className="fol items-end text-xl">
                    {navList.map((item, index) => (
                      <div
                        onClick={() => changeSelectNav(index)}
                        key={index}
                        className="mt-4 w-fit font-400 clickable"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          : null}
      </AnimatePresence>
    </div>
  )
}
