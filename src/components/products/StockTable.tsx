import { useEffect, useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
    PaginationState,
} from '@tanstack/react-table';
import {
    ChevronUp,
    ChevronDown,
    Search,
    Package,
    AlertTriangle,
    CheckCircle,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Hash,
    DollarSign,
    Building,
    Tag
} from 'lucide-react';
import { IStock } from '@/src/types';
import { getAllStocks } from '@/src/actions/stock';
import Loading from '@/app/loading';
import useAuthStore from '@/src/stores/authStore';


const columnHelper = createColumnHelper<IStock>();

const StockTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [stock, setStock] = useState<IStock[]>([]);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllStocks(accessToken);

            if (res.success) {
                setStock(res.data);
            }
        }

        fetchData()
        setLoading(false)
    }, [accessToken])

    // Stock status helper
    const getStockStatus = (quantity: number, reorderLevel: number) => {
        if (quantity === 0) return 'out-of-stock';
        if (quantity <= reorderLevel) return 'low-stock';
        return 'in-stock';
    };

    const columns = useMemo(() => [
        columnHelper.accessor('product.title', {
            header: 'Product',
            cell: (info) => {
                const product = info.row.original.product;
                const status = getStockStatus(info.row.original.quantity, product.reorderLevel);

                return (
                    <div className="flex items-center space-x-3">
                        <div className="flex-1">
                            <div className="font-medium text-gray-900">{info.getValue()}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.sku}
                            </div>
                        </div>
                        {status === 'out-of-stock' && (
                            <div className='bg-red-50 p-2 text-red-500 flex gap-2 rounded-full items-center justify-center'>
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <p className='text-md'>Out of stock</p>
                            </div>
                        )}
                        {status === 'low-stock' && (
                            <div className='bg-red-50 p-2 text-red-500 flex gap-2 rounded-full items-center justify-center'>
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <p className='text-md'>Low stock</p>
                            </div>
                        )}
                        {status === 'in-stock' && (
                            <div className='bg-emerald-50 p-2 text-green-500 flex gap-2 rounded-full items-center justify-center'>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <p className='text-md'>Low stock</p>
                            </div>
                        )}
                    </div>
                );
            },
        }),
        columnHelper.accessor('product.category', {
            header: 'Category',
            cell: (info) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {info.getValue()}
                </span>
            ),
        }),
        columnHelper.accessor('product.brand', {
            header: 'Brand',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <Building className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-700">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('quantity', {
            header: 'Stock Qty',
            cell: (info) => {
                const quantity = info.getValue();
                const reorderLevel = info.row.original.product.reorderLevel;
                const status = getStockStatus(quantity, reorderLevel);

                return (
                    <div className="flex items-center text-sm">
                        <Package className="w-4 h-4 mr-1 text-gray-400" />
                        <span className={`font-medium ${status === 'out-of-stock' ? 'text-red-600' :
                            status === 'low-stock' ? 'text-yellow-600' :
                                'text-gray-900'
                            }`}>
                            {quantity}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('batch_number', {
            header: 'Batch Number',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <Hash className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-700 font-mono">{info.getValue()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('product.unitPrice', {
            header: 'Unit Price',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-700 font-medium">${info.getValue().toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('product.sellingPrice', {
            header: 'Selling Price',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                    <span className="text-gray-700 font-medium">${info.getValue().toLocaleString()}</span>
                </div>
            ),
        }),
        columnHelper.accessor('logged_by', {
            header: 'Logged By',
            cell: (info) => {
                const user = info.getValue();
                return user ? (
                    <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-700">{user.name}</span>
                    </div>
                ) : null;
            },
        }),
        columnHelper.accessor('created_at', {
            header: 'Created',
            cell: (info) => {
                const date = info.getValue();
                return date ? (
                    <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                        {new Date(date).toLocaleDateString()}
                    </div>
                ) : null;
            },
        }),
    ], []);

    const table = useReactTable({
        data: stock,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: false,
    });

    return (
        <div className="w-full bg-white">
            <div className="mb-6 flex flex-col justify-between items-end">
                {/* Global Search */}
                <div className="relative w-2/5 max-w-lg">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search stock items..."
                    />
                </div>
            </div>

            {/* Table */}
            {loading ? (<Loading />) : (<div className="overflow-x-auto shadow md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center justify-between">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            <div className="flex flex-col">
                                                {header.column.getCanSort() && (
                                                    <div className="flex items-center ml-2">
                                                        <ChevronUp
                                                            className={`w-3 h-3 ${header.column.getIsSorted() === 'asc'
                                                                ? 'text-blue-600'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                        <ChevronDown
                                                            className={`w-3 h-3 ${header.column.getIsSorted() === 'desc'
                                                                ? 'text-blue-600'
                                                                : 'text-gray-300'
                                                                }`}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Package className="w-12 h-12 mb-4 text-gray-300" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                                            {globalFilter || columnFilters.length > 0 ? 'No stock items found' : 'No stock items yet'}
                                        </h3>
                                        <p className="text-sm">
                                            {globalFilter || columnFilters.length > 0
                                                ? 'Try adjusting your search or filter criteria'
                                                : 'Get started by adding your first stock item'
                                            }
                                        </p>
                                        {(!globalFilter && columnFilters.length === 0) && (
                                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Add Stock Item
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>)}

            {/* Pagination Controls */}
            {table.getRowModel().rows.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Table Info and Page Size */}
                    <div className="flex items-center gap-4">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => {
                                table.setPageSize(Number(e.target.value));
                            }}
                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {[5, 10, 20, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize}
                                </option>
                            ))}
                        </select>

                        <div className="text-sm text-gray-700">
                            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                table.getFilteredRowModel().rows.length
                            )}{' '}
                            of {table.getFilteredRowModel().rows.length} stock items
                            {table.getState().globalFilter && (
                                <span className="text-gray-500 ml-2">
                                    (filtered from {stock.length} total)
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="First page"
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Previous page"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <span className="text-sm text-gray-700 px-3">
                            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </span>

                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Next page"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <button
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Last page"
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Go to page */}
                    <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-700">Go to:</span>
                        <input
                            type="number"
                            min="1"
                            max={table.getPageCount()}
                            defaultValue={table.getState().pagination.pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                                table.setPageIndex(page);
                            }}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockTable;
