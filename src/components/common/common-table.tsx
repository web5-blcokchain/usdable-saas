import type { ColumnsType, TablePaginationConfig } from 'antd/es/table'
import type { ComponentToken } from 'antd/es/table/style'
import { ConfigProvider, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import './common-table.scss'

export function CommonTable({
  columns,
  data,
  pagination,
  tableConfig,
  className
}: {
  data: any
  columns: ColumnsType<any>
  pagination?: false | TablePaginationConfig
  tableConfig?: ComponentToken
  className?: string
}) {
  const { t } = useTranslation()
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            ...tableConfig,
            headerBg: tableConfig?.headerBg || '#161B22', // 表头背景色
            borderColor: tableConfig?.borderColor || '#394150'
          }
        }
      }}
    >

      <Table
        tableLayout="fixed"
        key={(`${Date.now() + Math.random()}`)}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data}
        className={cn('b-t b-#394150 b-t-solid bg-transparent', className)}
        pagination={typeof pagination === 'boolean'
          ? pagination
          : {
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) => (
                <div className="flex-1 text-#9CA3AF">
                  {t('common.table.showTotal', { start: range[0], end: range[1], total })}
                </div>
              ),
              ...pagination
            }}
      >

      </Table>
    </ConfigProvider>
  )
}
