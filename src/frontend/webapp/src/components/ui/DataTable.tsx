import type { ReactNode } from 'react'

interface IColumn<T> {
  key: string
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface IDataTableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  rowKey: (item: T) => string
}

export function DataTable<T>({ columns, data, rowKey }: IDataTableProps<T>) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase ${col.className ?? ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={rowKey(item)}
              className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-6 py-4 ${col.className ?? ''}`}>
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export type { IColumn }
