import { ConfigProvider, theme } from 'antd'

const { darkAlgorithm } = theme

export const AntdProvider: FC = ({ children }) => {
  return (
    <ConfigProvider theme={{
      token: {
        colorPrimary: '#00E5FF'
      },
      algorithm: [darkAlgorithm]
    }}
    >
      {children}
    </ConfigProvider>
  )
}
