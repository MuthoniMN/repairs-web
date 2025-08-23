"use client"

import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import { IInvoice, IJobCard, IPayment, ISale } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";

export default function CreateRecord({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [invoices, setInvoices] = useState<IInvoice[]>([]);
    const [payment, setPayment] = useState<IPayment>({
        invoice: { id: '', cards: [] as IJobCard[], products: [] as ISale[] } as IInvoice,
        amount: 0,
        ref: '',
        method: 'cash'
    } as IPayment);
    return (
        <Modal open={open} setOpen={setOpen} title="Create Payment Record">
            <form className={`flex flex-col gap-4`}>
                <SelectContainer
                    label="Invoice"
                    value={payment.invoice?.id}
                    setValue={(txt: any) => setPayment({ ...payment, invoice: txt })}
                    placeholder="Choose an invoice"
                    options={invoices}
                />
                {
                    (payment.invoice?.cards as IJobCard[])?.length > 0 || (payment.invoice?.products as ISale[])?.length > 0
                        ? ([...(payment.invoice?.cards as IJobCard[]), ...(payment.invoice?.products as ISale[])].map((val: IJobCard | ISale) => (
                            <div className="flex justify-between items-center py-2 px-4 bg-cyan-50">
                                <div className="flex flex-col gap-2">
                                    <p className="font-medium text-lg">{val.product.title || val.title}</p>
                                    <p className="text-slate-600">{val.price}</p>
                                </div>
                            </div>
                        ))) : <div className="w-full h-20 flex justify-center items-center py-2 px-4 bg-cyan-50">
                            <p>Select an invoice to view the details</p>
                        </div>
                }
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <InputContainer
                        label="Amount"
                        value={payment.amount}
                        setValue={(text: string | number) => setPayment({ ...payment, amount: text as number })}
                        placeholder="0"
                    />
                    <SelectContainer
                        label="Payment Method"
                        value={payment.method}
                        setValue={(text: string | number) => setPayment({ ...payment, method: text as string })}
                        placeholder="Cash"
                        options={[
                            { text: "M-Pesa", value: 'mpesa' },
                            { text: "Cash", value: 'cash' },
                            { text: "Bank Transfer", value: 'bank-transfer' }
                        ]}
                    />
                    <InputContainer
                        label="Reference"
                        value={payment.ref}
                        setValue={(text: string | number) => setPayment({ ...payment, ref: text as string })}
                        placeholder="XDR-900078897"
                    />
                </div>
                <Button
                    text="Record Payment"
                    icon={(<Plus size={18} color='#fff' />)}
                />
            </form>
        </Modal>
    )
}