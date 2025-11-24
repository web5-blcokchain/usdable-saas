import type { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import type { ComponentToken } from 'antd/es/table/style'
import { ConfigProvider, Table } from 'antd'
import { useTranslation } from 'react-i18next'
import './common-table.scss'

export function CommonTable({
  columns,
  data,
  pagination,
  tableConfig,
  className,
  tableProps
}: {
  data: any
  columns: ColumnsType<any>
  pagination?: false | TablePaginationConfig
  tableConfig?: ComponentToken
  className?: string
  tableProps?: TableProps
}) {
  const { t } = useTranslation()
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            ...tableConfig,
            headerBg: tableConfig?.headerBg || '#161B22', // 表头背景色
            borderColor: tableConfig?.borderColor || '#394150',
            footerBg: tableConfig?.footerBg || '#161B22',
            headerBorderRadius: tableConfig?.headerBorderRadius || 12
          },
          Pagination: {
            itemBg: '#161B22'
          }
        }
      }}
    >

      <Table
        {...tableProps}
        tableLayout="fixed"
        key={(`${Date.now() + Math.random()}`)}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data}
        className={cn('b-t b-#394150 b-t-solid bg-transparent bg-#161B22 rounded-3', className)}
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
