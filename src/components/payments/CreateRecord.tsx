"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import { IInvoice, IJobCard, IPayment, ISale } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";
import { z } from "zod";
import { validateInput } from "@/src/utils";
import { getAllInvoices } from "@/src/actions/invoice";
import useAuthStore from "@/src/stores/authStore";
import { createPayment } from "@/src/actions/payment";

// Zod schema for payment validation
const paymentSchema = z.object({
    invoice: z.object({
        id: z.string().min(1, "Invoice is required"),
        cards: z.array(z.object({
            id: z.string().min(1, "Job card is required")
        })).optional(),
        products: z.array(z.object({
            id: z.string().min(1, "Product is required")
        })).optional()
    }),
    amount: z.number().min(0, "Amount must be greater than or equal to 0"),
    ref: z.string().min(1, "Reference is required"),
    method: z.enum(['cash', 'mpesa', 'bank-transfer'])
});

export default function CreateRecord({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) {
    const [invoices, setInvoices] = useState<IInvoice[]>([]);
    const [payment, setPayment] = useState<IPayment>({
        invoice: { id: '', cards: [] as IJobCard[], products: [] as ISale[] } as IInvoice,
        amount: 0,
        ref: '',
        method: 'cash'
    } as IPayment);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        const fetchData = async () => {
            const res = await getAllInvoices(accessToken);

            if (res.success) {
                setInvoices(res.data);
            }
        }

        fetchData()
    }, [accessToken])

    const validateFormInput = (): boolean => {
        const { isValid, errors: validationErrors } = validateInput<IPayment>(paymentSchema, payment);
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
            // TODO: Implement actual API call to create payment
            const response = await createPayment(payment);
            if (response.success) {
                setSuccessMessage("Payment recorded successfully!");
                setPayment({
                    invoice: { id: '', cards: [] as IJobCard[], products: [] as ISale[] } as IInvoice,
                    amount: 0,
                    ref: '',
                    method: 'cash'
                });
            } else {
                setErrors({ general: response.error || "Failed to record payment" });
            }
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IPayment, value: string | number | IInvoice) => {
        setPayment(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title="Create Payment Record">
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                <SelectContainer
                    label="Invoice"
                    value={payment.invoice?.id as string}
                    setValue={(txt: string) => handleInputChange('invoice', { id: txt } as IInvoice)}
                    placeholder="Choose an invoice"
                    options={invoices}
                />
                {errors.invoice && (
                    <div className="text-red-500 text-sm">{errors.invoice}</div>
                )}
                <InputContainer
                    label="Amount"
                    value={payment.amount}
                    setValue={(text: string | number) => handleInputChange('amount', Number(text))}
                    placeholder="0"
                />
                {errors.amount && (
                    <div className="text-red-500 text-sm">{errors.amount}</div>
                )}
                <SelectContainer
                    label="Payment Method"
                    value={payment.method}
                    setValue={(text: string | number) => handleInputChange('method', text as string)}
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
                    setValue={(text: string | number) => handleInputChange('ref', text as string)}
                    placeholder="XDR-900078897"
                />
                {errors.ref && (
                    <div className="text-red-500 text-sm">{errors.ref}</div>
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
                    text={isSubmitting ? "Recording..." : "Record Payment"}
                    icon={(<Plus size={18} color="#fff" />)}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    );
}
