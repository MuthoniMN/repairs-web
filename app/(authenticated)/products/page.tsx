"use client"

import Loading from "@/app/loading";
import { getAllProducts } from "@/src/actions/product";
import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import CreateProduct from "@/src/components/products/CreateProduct";
import ProductCard from "@/src/components/products/ProductCard";
import useAuthStore from "@/src/stores/authStore";
import { IProduct } from "@/src/types";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FileSpreadsheet, Plus, Store } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllProducts(accessToken);

            if (res.success) {
                setProducts(res.data);
            }
        }

        fetchData();
        setLoading(false)
    }, [open, accessToken])

    // Pagination calculations
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return products.slice(startIndex, endIndex);
    }, [products, currentPage, itemsPerPage]);

    // Pagination handlers
    const goToFirstPage = () => setCurrentPage(1);
    const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const goToLastPage = () => setCurrentPage(totalPages);
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Reset to first page when items per page changes
    const handleItemsPerPageChange = (newItemsPerPage: number) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    // Calculate display range
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6 flex flex-col gap-8`}>
            <Header
                title="Products"
                description="Track your products and inventory"
                action={
                    <div className="flex gap-6">
                        <Button
                            icon={(<FileSpreadsheet size={18} color="#1E96FC" />)}
                            text="Import from Excel"
                            type="secondary"
                        />
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Product"
                            event={() => setOpen(true)}
                        />
                    </div>
                }
            />
            {loading ? (<Loading />) :
                products.length > 0 ? (
                    <div className="space-y-6 pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                            {
                                paginatedProducts.map(prod => (<ProductCard product={prod} key={prod.id} />))
                            }
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
                                {/* Items per page and info */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-700">Show:</span>
                                        <select
                                            value={itemsPerPage}
                                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                            className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {[5, 10, 20, 50].map((size) => (
                                                <option key={size} value={size}>
                                                    {size}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        Showing {startItem} to {endItem} of {totalItems} jobs
                                    </div>
                                </div>

                                {/* Pagination buttons */}
                                <div className="flex items-center space-x-1">
                                    {/* First page */}
                                    <button
                                        onClick={goToFirstPage}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="First page"
                                    >
                                        <ChevronsLeft size={16} />
                                    </button>

                                    {/* Previous page */}
                                    <button
                                        onClick={goToPreviousPage}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Previous page"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center space-x-1">
                                        {/* Show page numbers with ellipsis logic */}
                                        {(() => {
                                            const pages = [];
                                            const showEllipsis = totalPages > 7;

                                            if (!showEllipsis) {
                                                // Show all pages if total is 7 or less
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pages.push(
                                                        <button
                                                            key={i}
                                                            onClick={() => goToPage(i)}
                                                            className={`px-3 py-1 text-sm border rounded transition-colors ${currentPage === i
                                                                ? 'bg-blue-500 text-white border-blue-500'
                                                                : 'border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {i}
                                                        </button>
                                                    );
                                                }
                                            } else {
                                                // Show ellipsis logic for many pages
                                                if (currentPage <= 4) {
                                                    // Show first 5 pages, ellipsis, last page
                                                    for (let i = 1; i <= 5; i++) {
                                                        pages.push(
                                                            <button
                                                                key={i}
                                                                onClick={() => goToPage(i)}
                                                                className={`px-3 py-1 text-sm border rounded transition-colors ${currentPage === i
                                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                                    : 'border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {i}
                                                            </button>
                                                        );
                                                    }
                                                    pages.push(<span key="ellipsis1" className="px-2">...</span>);
                                                    pages.push(
                                                        <button
                                                            key={totalPages}
                                                            onClick={() => goToPage(totalPages)}
                                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                        >
                                                            {totalPages}
                                                        </button>
                                                    );
                                                } else if (currentPage >= totalPages - 3) {
                                                    // Show first page, ellipsis, last 5 pages
                                                    pages.push(
                                                        <button
                                                            key={1}
                                                            onClick={() => goToPage(1)}
                                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                        >
                                                            1
                                                        </button>
                                                    );
                                                    pages.push(<span key="ellipsis2" className="px-2">...</span>);
                                                    for (let i = totalPages - 4; i <= totalPages; i++) {
                                                        pages.push(
                                                            <button
                                                                key={i}
                                                                onClick={() => goToPage(i)}
                                                                className={`px-3 py-1 text-sm border rounded transition-colors ${currentPage === i
                                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                                    : 'border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {i}
                                                            </button>
                                                        );
                                                    }
                                                } else {
                                                    // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
                                                    pages.push(
                                                        <button
                                                            key={1}
                                                            onClick={() => goToPage(1)}
                                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                        >
                                                            1
                                                        </button>
                                                    );
                                                    pages.push(<span key="ellipsis3" className="px-2">...</span>);
                                                    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                                                        pages.push(
                                                            <button
                                                                key={i}
                                                                onClick={() => goToPage(i)}
                                                                className={`px-3 py-1 text-sm border rounded transition-colors ${currentPage === i
                                                                    ? 'bg-blue-500 text-white border-blue-500'
                                                                    : 'border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                {i}
                                                            </button>
                                                        );
                                                    }
                                                    pages.push(<span key="ellipsis4" className="px-2">...</span>);
                                                    pages.push(
                                                        <button
                                                            key={totalPages}
                                                            onClick={() => goToPage(totalPages)}
                                                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                                        >
                                                            {totalPages}
                                                        </button>
                                                    );
                                                }
                                            }

                                            return pages;
                                        })()}
                                    </div>

                                    {/* Next page */}
                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Next page"
                                    >
                                        <ChevronRight size={16} />
                                    </button>

                                    {/* Last page */}
                                    <button
                                        onClick={goToLastPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        title="Last page"
                                    >
                                        <ChevronsRight size={16} />
                                    </button>
                                </div>

                                {/* Go to page input - mobile friendly */}
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">Go to:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const page = parseInt(e.target.value);
                                            if (!isNaN(page)) {
                                                goToPage(page);
                                            }
                                        }}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <span className="text-sm text-gray-500">of {totalPages}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (<EmptyState
                    title="No Products found"
                    description="You haven't added any products yet"
                    icon={(<Store size={64} color="#1E96FC" />)}
                    actions={
                        <Button
                            icon={(<Plus size={18} color="#fff" />)}
                            text="Add New Product"
                            event={() => setOpen(true)}
                        />}
                />)
            }
            <CreateProduct
                open={open}
                setOpen={setOpen}
            />
        </main>
    )
}