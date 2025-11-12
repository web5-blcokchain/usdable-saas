export function screenToTop(options?: ScrollToOptions) {
  const mainDom = document.querySelector('.app-content')
  if (options) {
    mainDom?.scrollTo(options)
  } else mainDom?.scrollTo(0, 0)
}
