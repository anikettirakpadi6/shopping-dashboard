import { ReactNode } from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  onSort: (key: keyof T) => void;
}

export default function DataTable<T> ({
  data,
  columns,
  loading,
  onSort,
}: Props<T>) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead className="border-b">
        <tr className="text-center bg-black text-white font-semibold">
          {columns.map((col, i) => (
            <th
              key={i}
              onClick={() => col.sortable && onSort(col.key)}
              className="py-2 px-3 border-r border-gray-500 cursor-pointer last:border-r-0"
            >
              {col.label}
            </th>
          ))}
          <th className="py-2 px-3">Actions</th>
        </tr>
      </thead>

      <tbody className="text-center">
        {loading ? (
          <tr>
            <td colSpan={columns.length + 1} className="py-3">
              Loading...
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="py-3">
              No data available
            </td>
          </tr>
        ) : (
          data.map((item: any) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              {columns.map((col, i) => (
                <td key={i} className="py-2 px-3 border-r last:border-r-0">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              <td className="py-2 px-3">{item.actions}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}