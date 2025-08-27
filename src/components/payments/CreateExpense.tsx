"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import { IContractor, IExpense, IJobCard, IStock, ISupplier } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";
import { z } from "zod";
import { getAllContractors } from "@/src/actions/contractor";
import { getAllSuppliers } from "@/src/actions/supplier";
import { getAllStocks } from "@/src/actions/stock";
import { getAllJobCards } from "@/src/actions/jobCard";
import { createExpense } from "@/src/actions/expense";
import useAuthStore from '@/src/stores/authStore';

// Zod schema for expense validation
const expenseSchema = z.object({
    jobCard: z.object({
        id: z.string().min(1, "Job card is required")
    }),
    amount: z.number().min(0, "Amount must be greater than 0"),
    ref: z.string().min(1, "Reference is required"),
    method: z.enum(['cash', 'mpesa', 'bank-transfer']),
    stock: z.object({
        id: z.string().min(1, "Stock is required")
    }),
    contractor: z.object({
        id: z.string().min(1, "Contractor is required")
    })
});

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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;

        const fetchData = async () => {
            const res = await getAllContractors(accessToken);
            const result = await getAllSuppliers(accessToken);
            const res2 = await getAllStocks(accessToken);
            const result2 = await getAllJobCards(accessToken);

            if (res.success) {
                setContractors(res.data);
            }

            if (result.success) {
                setSuppliers(result.data);
            }

            if (res2.success) {
                setStocks(res2.data);
            }

            if (result2.success) {
                setCards(result2.data);
            }
        }

        fetchData()
    }, [accessToken])

    useEffect(() => {
        if (userType == 'contractors' && payment.contractor?.id) {
            setCards((prev) => prev.filter(card => card.contractor.id == payment.contractor?.id))
        }
        if (userType == 'suppliers' && payment.supplier?.id) {
            setSuppliers((prev) => prev.filter(card => card.id == payment.supplier?.id))
        }
    }, [userType, payment]);

    const validateInput = (): boolean => {
        try {
            expenseSchema.parse(payment);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0] as string] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateInput()) return;

        setIsSubmitting(true);
        try {
            // TODO: Implement actual API call to create expense
            const response = await createExpense(payment, accessToken);
            if (response.success) {
                setSuccessMessage("Expense recorded successfully!");
                setPayment({
                    jobCard: { id: '' } as IJobCard,
                    amount: 0,
                    ref: '',
                    method: 'cash',
                    stock: { id: '' } as IStock,
                    contractor: { id: '' } as IContractor
                } as IExpense);
                setUserType('');
            } else {
                setErrors({ general: response.error || "Failed to record expense" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title="Add an Expense">
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
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
                                options={suppliers.map(supp => ({ value: supp.id, text: supp.company }))}
                            />
                            <SelectContainer
                                label="Which stock are you paying for?"
                                value={payment.stock?.id}
                                setValue={(txt: any) => setPayment({ ...payment, stock: txt })}
                                placeholder="Choose a stock batch"
                                options={stocks.map((stk => ({ value: stk.id, text: stk.batch_number })))}
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
                                    setValue={(text: string | number) => setPayment({ ...payment, method: text as 'cash' | 'mpesa' | 'bank-transfer' })}
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
                                    setValue={(text: string | number) => setPayment({ ...payment, method: text as 'cash' | 'mpesa' | 'bank-transfer' })}
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
                {userType != '' && (
                    <>
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
                            text={isSubmitting ? "Recording..." : "Record Payment"}
                            icon={(<Plus size={18} color='#fff' />)}
                            classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                        />
                    </>
                )}
            </form>
        </Modal>
    )
}
