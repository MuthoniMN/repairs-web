"use client"

import { IProduct, IStock, ISupplier } from "@/src/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import { Plus } from "lucide-react";
import Button from "../Button";
import { z } from "zod";
import { validateInput } from "@/src/utils";
import { getAllProducts } from "@/src/actions/product";
import { createStock } from "@/src/actions/stock";
import { getAllSuppliers } from "@/src/actions/supplier";
import useAuthStore from '@/src/stores/authStore';

// Zod schema for stock validation
const stockSchema = z.object({
    product: z.object({
        id: z.string().min(1, "Product is required")
    }),
    supplier: z.object({
        id: z.string().min(1, "Supplier is required")
    }),
    batch_number: z.string().min(1, "Batch number is required"),
    quantity: z.number().min(1, "Quantity must be greater than 0")
});

export default function RestockProduct({ open, setOpen, prod, supplier }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, prod?: IProduct, supplier?: ISupplier }) {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [stock, setStock] = useState<IStock>({
        batch_number: '',
        quantity: 0,
        product: prod || { id: '' } as IProduct,
        supplier: supplier || { id: '' } as ISupplier
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllProducts(accessToken);
            const result = await getAllSuppliers(accessToken);

            if (res.success) {
                setProducts(res.data);
            }

            if (result.success) {
                setSuppliers(result.data);
            }
        }

        fetchData()
    }, [accessToken])

    const validateFormInput = (): boolean => {
        const { isValid, errors: validationErrors } = validateInput<IStock>(stockSchema, stock);
        if (!isValid) {
            setErrors(validationErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateFormInput()) return;

        setIsSubmitting(true);
        try {
            // TODO: Implement actual API call to restock product
            const response = await createStock(stock, accessToken);
            if (response.success) {
                setSuccessMessage("Product restocked successfully!");
                setStock({
                    batch_number: '',
                    quantity: 0,
                    product: { id: '' } as IProduct,
                    supplier: { id: '' } as ISupplier
                });
            } else {
                setErrors({ general: response.error || "Failed to restock product" });
            }
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IStock, value: string | number | IProduct | ISupplier) => {
        setStock(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title="Restock a Product">
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                <SelectContainer
                    value={stock.product.id as string}
                    setValue={(val: string) => handleInputChange('product', { id: val } as IProduct)}
                    options={products}
                    label="Product"
                    placeholder="Select a product"
                />
                {errors.product && (
                    <div className="text-red-500 text-sm">{errors.product}</div>
                )}
                <SelectContainer
                    value={stock.supplier.id as string}
                    setValue={(val: string) => handleInputChange('supplier', { id: val } as ISupplier)}
                    options={suppliers}
                    label="Supplier"
                    placeholder="Select a supplier"
                />
                {errors.supplier && (
                    <div className="text-red-500 text-sm">{errors.supplier}</div>
                )}
                <InputContainer
                    label="Batch number"
                    value={stock.batch_number}
                    setValue={(val: string | number) => handleInputChange('batch_number', val)}
                    placeholder="BS-9001"
                />
                {errors.batch_number && (
                    <div className="text-red-500 text-sm">{errors.batch_number}</div>
                )}
                <InputContainer
                    label="Quantity"
                    value={stock.quantity}
                    setValue={(text: string | number) => handleInputChange('quantity', Number(text))}
                    placeholder="quantity"
                    type="number"
                />
                {errors.quantity && (
                    <div className="text-red-500 text-sm">{errors.quantity}</div>
                )}
                {errors.general && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {errors.general}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {successMessage}
                    </div>
                )}
                <Button
                    text={isSubmitting ? "Restocking..." : "Restock Product"}
                    icon={(<Plus size={18} color="#fff" />)}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    );
}
