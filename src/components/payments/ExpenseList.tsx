"use client";

import { useEffect, useState } from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import Dropdown from "@/src/components/Dropdown";
import { IExpense } from "@/src/types";
import { getAllExpenses } from "@/src/actions/expense";
import useAuthStore from '@/src/stores/authStore';
import { PiggyBank } from "lucide-react";
import Button from "../Button";

const expenseColumns: ColumnDef<IExpense>[] = [
    {
        accessorKey: "ref",
        header: "Reference",
        cell: (info) => info.getValue(),
    },
    {
        accessorKey: "user_type",
        header: "Type",
        cell: (info) => (
            <span className="capitalize">{info.getValue<string>()}</span>
        ),
    },
    {
        id: "jobOrBatch",
        header: "Job Card / Batch",
        cell: ({ row }) => {
            const expense = row.original;
            return (
                <span>
                    {expense.jobCard?.title || expense.stock?.batch_number || "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: (info) => (
            <span className="font-medium text-gray-800">
                KES {Number(info.getValue()).toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Date",
        cell: (info) =>
            info.getValue()
                ? new Date(info.getValue() as string).toLocaleDateString()
                : "—",
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const expense = row.original;

            const actions = [];
            if (expense.jobCard) {
                actions.push({
                    label: "View Job Card",
                    onClick: () => console.log("View JobCard", expense.jobCard?.id),
                });
            }
            if (expense.stock) {
                actions.push({
                    label: "View Stock Batch",
                    onClick: () => console.log("View Stock", expense.stock?.id),
                });
            }

            return <Dropdown actions={actions} />;
        },
    },
];

export default function ExpenseTable() {
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllExpenses(accessToken);

            if (res.success) {
                setExpenses(res.data);
            }
        }

        fetchData()
    }, [accessToken])

    const table = useReactTable({
        data: expenses,
        columns: expenseColumns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="overflow-x-auto rounded-lg grow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 ">
                    {
                        table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={expenseColumns.length} className="px-6 py-12 text-center h-full">
                                <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                                    <PiggyBank className="w-12 h-12 text-gray-300" />
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {globalFilter || columnFilters.length > 0 ? 'No expenses found' : 'No expenses yet'}
                                    </h3>
                                    <p className="text-sm">
                                        {globalFilter || columnFilters.length > 0
                                            ? 'Try adjusting your search or filter criteria'
                                            : 'Get started by adding your first expense'
                                        }
                                    </p>
                                    {(!globalFilter && columnFilters.length === 0) && (
                                        <Button
                                            text='Add Expense'
                                        />
                                    )}
                                </div>
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-4 py-2 text-sm text-gray-700"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        )))}
                </tbody>
            </table>
        </div>
    );
}
