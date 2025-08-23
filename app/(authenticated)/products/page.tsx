"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import EmptyState from "@/src/components/EmptyState";
import Header from "@/src/components/Header";
import CreateProduct from "@/src/components/products/CreateProduct";
import { IProduct } from "@/src/types";
import { FileSpreadsheet, Plus, Store } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<IProduct[]>([]);

    return (
        <main className={`w-full h-full text-black ${dmSans.className} px-6`}>
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
            {
                products.length > 0 ? (<></>) : (<EmptyState
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