"use client"

import { IProduct, IStock } from "@/src/types";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import { Plus } from "lucide-react";
import Button from "../Button";

export default function RestockProduct({ open, setOpen, prod }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, prod?: IProduct }) {
    const [products, setProducts] = useState<IProduct[]>([]);
    const [stock, setStock] = useState<IStock>({
        batch_number: '',
        quantity: 0,
        product: prod || { id: '' } as IProduct,
    });

    return (
        <Modal open={open} setOpen={setOpen} title="Restock a Product">
            <form className={`flex flex-col gap-4`}>
                <SelectContainer
                    value={stock.product}
                    setValue={(val: any) => setStock({ ...stock, product: { id: val } as IProduct })}
                    options={products}
                    label="Product"
                    placeholder="Select a product"
                />
                <InputContainer
                    label="Batch number"
                    value={stock.batch_number}
                    setValue={(val: any) => setStock({ ...stock, batch_number: val })}
                    placeholder="BS-9001"
                />
                <InputContainer
                    label="Quantity"
                    value={stock.quantity}
                    setValue={(text: string | number) => setStock({ ...stock, quantity: text as number })}
                    placeholder="quantity"
                    type="number"
                />
                <Button
                    text="Restock Product"
                    icon={(<Plus size={18} color="#fff" />)}
                />
            </form>
        </Modal>
    );
}