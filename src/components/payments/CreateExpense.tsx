"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import { IContractor, IExpense, IInvoice, IJobCard, IPayment, ISale, IStock, ISupplier } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";

export default function CreateExpense({ open, setOpen, card, stock, contractor }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, card?: IJobCard, stock?: IStock, contractor?: IContractor }) {
    const [contractors, setContractors] = useState<IContractor[]>([]);
    const [cards, setCards] = useState<IJobCard[]>([]);
    const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
    const [stocks, setStocks] = useState<IStock[]>([]);
    const [userType, setUserType] = useState('');
    const [payment, setPayment] = useState<IExpense>({
        jobCard: card || { id: '' } as IJobCard,
        amount: 0,
        ref: '',
        method: 'cash',
        stock: stock || { id: '' } as IStock,
        contractor: contractor || { id: '' } as IContractor
    } as IExpense);

    useEffect(() => {
        if (userType == 'contractors' && payment.contractor?.id) {

        }
    }, [userType, payment]);

    return (
        <Modal open={open} setOpen={setOpen} title="Add an Expense">
            <form className={`flex flex-col gap-4`}>
                {
                    userType == '' && (
                        <SelectContainer
                            label="Who would you like to pay?"
                            value={userType}
                            setValue={(txt: any) => setUserType(txt)}
                            options={[
                                { text: 'Contractor', value: 'contractor' },
                                { text: 'Supplier', value: 'supplier' }
                            ]}
                            placeholder="Choose an option"
                        />
                    )
                }
                {
                    userType == 'supplier' && (
                        <>
                            <SelectContainer
                                label="Supplier"
                                value={payment.supplier?.id}
                                setValue={(txt: any) => setPayment({ ...payment, supplier: txt })}
                                placeholder="Choose a supplier"
                                options={suppliers}
                            />
                            <SelectContainer
                                label="Which stock are you paying for?"
                                value={payment.stock?.id}
                                setValue={(txt: any) => setPayment({ ...payment, stock: txt })}
                                placeholder="Choose a stock batch"
                                options={stocks}
                            />
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
                        </>
                    )
                }
                {
                    userType == 'contractor' && (
                        <>
                            <SelectContainer
                                label="Contractor"
                                value={payment.contractor?.id}
                                setValue={(txt: any) => setPayment({ ...payment, contractor: txt })}
                                placeholder="Choose a contractor"
                                options={contractors}
                            />
                            <SelectContainer
                                label="Which job card are you paying for?"
                                value={payment.jobCard?.id}
                                setValue={(txt: any) => setPayment({ ...payment, jobCard: txt })}
                                placeholder="Choose a job card"
                                options={cards}
                            />
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
                        </>
                    )
                }
                {userType != '' && (<Button
                    text="Record Payment"
                    icon={(<Plus size={18} color='#fff' />)}
                />)}
            </form>
        </Modal>
    )
}