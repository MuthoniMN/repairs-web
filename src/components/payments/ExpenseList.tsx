"use client";

import { useState } from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import Dropdown from "@/src/components/Dropdown";
import { IExpense } from "@/src/types";

// ✅ Define the table columns
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

// ✅ Main Table Component
export default function ExpenseTable({ data }: { data: IExpense[] }) {
    const [expenses] = useState<IExpense[]>(data);

    const table = useReactTable({
        data: expenses,
        columns: expenseColumns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
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
                    {table.getRowModel().rows.map((row) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
