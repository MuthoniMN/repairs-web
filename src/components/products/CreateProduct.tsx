"use client"

import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { IProduct, ISupplier } from "@/src/types";
import InputContainer from "../InputContainer";
import SelectContainer from "../SelectContainer";
import Button from "../Button";
import { Plus } from "lucide-react";

const suppliers: ISupplier[] = [
    {
        company: 'ABC International',
        description: "Plumbing manufacturer",
        leadTime: 5,
        location: 'Westlands'
    }
]

const categories = [
    { text: 'Plumbing', value: 'plumbing' }
]

export default function CreateProduct({ open, setOpen, val }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    val?: IProduct
}) {
    const [product, setProduct] = useState(val || {
        title: '',
        description: '',
        unitPrice: 0,
        category: '',
        pictures: [],
        supplier: [{ company: '', location: '', description: '' }] as ISupplier[],
        total: 0,
        sellingPrice: 0,
        batchNumber: '',
        brand: '',
        reorderLevel: 0,
        reorderQuantity: 0,
        sku: ''
    } as IProduct)
    return (
        <Modal open={open} setOpen={setOpen} title={val ? 'Edit Product Details' : 'Add a Product'}>
            <form className={`flex flex-col gap-4`}>
                <InputContainer
                    label="Title"
                    value={product.title}
                    setValue={(text: string | number) => setProduct({ ...product, title: text as string })}
                    placeholder="Laptop Screen"
                />
                <InputContainer
                    label="Description"
                    value={product.description}
                    setValue={(text: string | number) => setProduct({ ...product, description: text as string })}
                    placeholder="Please enter a description"
                />
                <div className="flex justify-between items-center">
                    <SelectContainer
                        label="Supplier"
                        value={product.supplier}
                        setValue={(txt: any) => setProduct({ ...product, supplier: txt })}
                        placeholder="ABC Corp"
                        options={suppliers}
                        multiSelect
                    />
                    <SelectContainer
                        label="Category"
                        value={product.category}
                        setValue={(txt: any) => setProduct({ ...product, category: txt })}
                        placeholder="Tech"
                        options={categories}
                        multiSelect
                    />
                </div>
                <div className="flex justify-between items-center">
                    <InputContainer
                        label="Brand"
                        value={product.brand}
                        setValue={(text: string | number) => setProduct({ ...product, brand: text as string })}
                        placeholder="Lenovo"
                    />
                    <InputContainer
                        label="SKU"
                        value={product.sku}
                        setValue={(text: string | number) => setProduct({ ...product, sku: text as string })}
                        placeholder="LS-900"
                        type="number"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Product Quantities</h3>
                    <InputContainer
                        label="Amount"
                        value={product.total}
                        setValue={(text: string | number) => setProduct({ ...product, total: text as number })}
                        placeholder="Stocked quantity"
                        type="number"
                    />
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Minimum Quantity"
                            value={product.reorderLevel}
                            setValue={(text: string | number) => setProduct({ ...product, reorderLevel: text as number })}
                            placeholder="Minimum quantity"
                            type="number"
                        />
                        <InputContainer
                            label="Restock Quantity"
                            value={product.reorderLevel}
                            setValue={(text: string | number) => setProduct({ ...product, reorderLevel: text as number })}
                            placeholder="Restock quantity"
                            type="number"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-bold my-4">Pricing Details</h3>
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Unit Price"
                            value={product.unitPrice}
                            setValue={(text: string | number) => setProduct({ ...product, unitPrice: text as number })}
                            placeholder="Add the price"
                            type="number"
                        />
                        <InputContainer
                            label="Selling Price"
                            value={product.sellingPrice}
                            setValue={(text: string | number) => setProduct({ ...product, sellingPrice: text as number })}
                            placeholder="Selling Price"
                            type="number"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2 text-black">
                    <label className={`font-medium`}>{"Upload product pictures"}</label>
                    <input
                        type="file"
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50
         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
         file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700
         hover:file:bg-cyan-100"
                    />
                </div>
                <Button
                    text="Create New Product"
                    icon={(<Plus size={18} color="#fff" />)}
                />
            </form>
        </Modal>
    )
}