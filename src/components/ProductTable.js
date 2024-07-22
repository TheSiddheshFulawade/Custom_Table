import React, { useState, useMemo } from 'react';
import { useTable, useSortBy, useGlobalFilter, usePagination } from 'react-table';

const initialProducts = [
  {
    id: 1,
    productName: 'Laptop',
    category: 'Electronics',
    subcategory: 'Computers',
    createdAt: '2024-07-15',
    updatedAt: '2024-07-20',
    price: 999.99,
    salePrice: 899.99,
  },
];

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = e => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return <input value={value} onChange={onChange} onBlur={onBlur} className="w-full p-1 border rounded" />;
};

const defaultColumn = {
  Cell: EditableCell,
};

function AdvancedProductTable({ columns, data, updateMyData, deleteData, addData }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      updateMyData,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const [newRow, setNewRow] = useState({});

  const handleAddRow = () => {
    addData(newRow);
    setNewRow({});
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <input
          value={globalFilter || ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder="Search all columns..."
          className="p-2 border rounded"
        />
        <button
          onClick={handleAddRow}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Row
        </button>
      </div>
      <table {...getTableProps()} className="min-w-full bg-white border border-gray-300">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-4 py-2 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
              <th className="px-4 py-2 border-b border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} className="border-b border-gray-300 px-4 py-2">{cell.render('Cell')}</td>
                })}
                <td className="border-b border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteData(row.original.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination mt-4 flex justify-between items-center">
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded">{'<<'}</button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mr-2 px-2 py-1 border rounded">{'<'}</button>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="mr-2 px-2 py-1 border rounded">{'>'}</button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="mr-2 px-2 py-1 border rounded">{'>>'}</button>
        </div>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value));
          }}
          className="ml-2 border rounded"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function ProductTable() {
  const [data, setData] = useState(initialProducts);

  const columns = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Product Name',
        accessor: 'productName',
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Subcategory',
        accessor: 'subcategory',
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Sale Price',
        accessor: 'salePrice',
      },
    ],
    []
  );

  const updateMyData = (rowIndex, columnId, value) => {
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const deleteData = (id) => {
    setData(old => old.filter(row => row.id !== id));
  };

  const addData = (newRow) => {
    setData(old => [...old, { ...newRow, id: Math.max(...old.map(d => d.id)) + 1 }]);
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <AdvancedProductTable
          columns={columns}
          data={data}
          updateMyData={updateMyData}
          deleteData={deleteData}
          addData={addData}
        />
      </div>
    </div>
  );
}

export default ProductTable;
