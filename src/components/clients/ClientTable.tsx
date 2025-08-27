import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    createColumnHelper,
    flexRender,
    ColumnDef,
    SortingState,
    ColumnFiltersState,
} from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    Mail,
    Phone,
    MapPin,
    User,
    Calendar,
    Edit,
    Trash2,
    Eye,
    ContactRound
} from 'lucide-react';
import { IClient } from '@/src/types';
import useClientStore from '@/src/stores/clientStore';
import { getAllClients } from '@/src/actions/client';
import Loading from '@/app/loading';
import useAuthStore from '@/src/stores/authStore';

interface ClientsTableProps {
    refresh?: boolean;
    onEdit?: (client: IClient) => void;
    onDelete?: (client: IClient) => void;
    onView?: (client: IClient) => void;
}

const columnHelper = createColumnHelper<IClient>();

const ClientsTable: React.FC<ClientsTableProps> = ({
    refresh,
    onEdit,
    onDelete,
    onView
}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { clients, setClients } = useClientStore();
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllClients(accessToken);

            if (res.success) {
                setClients(res.data);
            }
        }

        fetchData()
        setLoading(false)
    }, [refresh])

    const formatDate = useCallback((dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }, []);

    const columns = useMemo<ColumnDef<IClient, any>[]>(() => [
        {
            accessorKey: 'name',
            header: 'Client Name',
            cell: (info) => (
                <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {info.getValue()}
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableColumnFilter: true,
        },
        columnHelper.accessor('email', {
            header: 'Email',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{info.getValue()}</span>
                </div>
            ),
            enableSorting: true,
        }),

        columnHelper.accessor('phoneNumber', {
            header: 'Phone',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{info.getValue()}</span>
                </div>
            ),
            enableSorting: true,
        }),

        columnHelper.accessor('location', {
            header: 'Location',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{info.getValue()}</span>
                </div>
            ),
            enableSorting: true,
        }),

        columnHelper.accessor('added_by', {
            header: 'Added By',
            cell: (info) => {
                const addedBy = info.getValue();
                return addedBy ? (
                    <span className="text-sm text-gray-600">{addedBy.name}</span>
                ) : (
                    <span className="text-sm text-gray-400">-</span>
                );
            },
            enableSorting: false,
        }),

        columnHelper.accessor('created_at', {
            header: 'Created',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                        {formatDate(info.getValue())}
                    </span>
                </div>
            ),
            enableSorting: true,
        }),

        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: (info) => (
                <div className="flex items-center space-x-2">
                    {onView && (
                        <button
                            onClick={() => onView(info.row.original)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="View details"
                        >
                            <Eye className="h-4 w-4" />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            onClick={() => onEdit(info.row.original)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Edit client"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(info.row.original)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete client"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ),
        }),
    ], [onEdit, onDelete, onView, formatDate]);

    const table = useReactTable({
        data: clients,
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
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });


    if (loading) {
        return (<Loading />)
    }

    return (
        <div className="w-full pt-8">
            {/* Header with Search */}
            <div className="mb-6 w-full">
                <div className="flex justify-end items-center">
                    <div className='w-2/5'>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                            placeholder="Search clients..."
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            <div className="flex items-center space-x-1">
                                                <span>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                                </span>
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        {header.column.getIsSorted() === 'asc' ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : header.column.getIsSorted() === 'desc' ? (
                                                            <ChevronDown className="h-4 w-4" />
                                                        ) : (
                                                            <div className="h-4 w-4" />
                                                        )}
                                                    </div>
                                                )}
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
                                            <ContactRound className="w-12 h-12 mb-4 text-gray-300" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                {globalFilter || columnFilters.length > 0 ? 'No clients found' : 'No clients yet'}
                                            </h3>
                                            <p className="text-sm">
                                                {globalFilter || columnFilters.length > 0
                                                    ? 'Try adjusting your search or filter criteria'
                                                    : 'Get started by adding your first client'
                                                }
                                            </p>
                                            {(!globalFilter && columnFilters.length === 0) && (
                                                <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                    Add Client
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) :
                                (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    )))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {table.getPageCount() > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg border">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>

                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing{' '}
                                <span className="font-medium">
                                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                                </span>{' '}
                                to{' '}
                                <span className="font-medium">
                                    {Math.min(
                                        (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                        table.getFilteredRowModel().rows.length
                                    )}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium">{table.getFilteredRowModel().rows.length}</span> results
                            </p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>

                            <span className="text-sm text-gray-700">
                                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                            </span>

                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>

                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsTable;