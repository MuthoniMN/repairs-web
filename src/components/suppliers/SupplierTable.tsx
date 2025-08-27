import { useEffect, useMemo, useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, Search, Package, MapPin, Clock, User, Calendar } from 'lucide-react';
import { IProduct, ISupplier, IUser } from '@/src/types';
import { getAllSuppliers } from '@/src/actions/supplier';
import useSupplierStore from '@/src/stores/supplierStore';
import useAuthStore from '@/src/stores/authStore';
import Button from '../Button';
import Loading from '@/app/loading';

const columnHelper = createColumnHelper<ISupplier>();

const SupplierTable = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { suppliers, setSuppliers } = useSupplierStore();
    const [loading, setLoading] = useState(true);

    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllSuppliers(accessToken);

            if (res.success) {
                setSuppliers(res.data);
            }
        }

        fetchData()
        setLoading(false);
    }, [accessToken, setSuppliers])

    const columns = useMemo(() => [
        columnHelper.accessor('company', {
            header: 'Company',
            cell: (info) => (
                <div className="font-medium text-gray-900">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('location', {
            header: 'Location',
            cell: (info) => (
                <div className="flex items-center text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor('products', {
            header: 'Products',
            cell: (info) => {
                const products = info.getValue() || [];
                return (
                    <div className="flex items-center text-sm">
                        <Package className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-700">{(products as IProduct[]).length} products</span>
                    </div>
                );
            },
        }),
        columnHelper.accessor('leadTime', {
            header: 'Lead Time',
            cell: (info) => (
                <div className="flex items-center text-sm">
                    <Clock className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-700">{info.getValue()} days</span>
                </div>
            ),
        }),
        columnHelper.accessor('added_by', {
            header: 'Added By',
            cell: (info) => {
                const user = info.getValue();
                return user ? (
                    <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-700">{(user as IUser).name}</span>
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
        data: suppliers,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="w-full p-6 bg-white">
            <div className="mb-6 flex justify-end">
                {/* Global Search */}
                <div className="relative max-w-xl w-2/5">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        value={globalFilter ?? ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search suppliers..."
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
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
                        {
                            table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                                            <Package className="w-12 h-12 text-gray-300" />
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {globalFilter || columnFilters.length > 0 ? 'No suppliers found' : 'No suppliers yet'}
                                            </h3>
                                            <p className="text-sm">
                                                {globalFilter || columnFilters.length > 0
                                                    ? 'Try adjusting your search or filter criteria'
                                                    : 'Get started by adding your first supplier'
                                                }
                                            </p>
                                            {(!globalFilter && columnFilters.length === 0) && (
                                                <Button
                                                    text='Add Supplier'
                                                />
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
                                )))
                        }
                    </tbody>
                </table>
            </div>

            {/* Table Info */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
                <div>
                    Showing {table.getRowModel().rows.length} of {suppliers.length} suppliers
                </div>
                <div className="text-gray-500">
                    {table.getState().globalFilter && (
                        <span>Filtered by: &quot;{table.getState().globalFilter}&quot;</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupplierTable;