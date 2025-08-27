"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import { IInvoice, IJob, IJobCard, IPayment, ISale } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";
import { z } from "zod";
import { getAllJobs, getJobById } from "@/src/actions/job";
import { createInvoice } from "@/src/actions/invoice";
import useAuthStore from '@/src/stores/authStore';

// Zod schema for invoice validation
const invoiceSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    cards: z.array(z.object({
        id: z.string().min(1, "Job card is required")
    })).min(1, "At least one job card is required"),
    products: z.array(z.object({
        id: z.string().min(1, "Product is required")
    })),
    job: z.object({
        id: z.string().min(1, "Job is required")
    }),
    tax: z.number().min(0, "Tax must be greater than or equal to 0"),
    total: z.number().min(0, "Total must be greater than or equal to 0")
});

export default function CreateInvoice({ open, setOpen, job }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, job?: IJob }) {
    const [jobs, setJobs] = useState<IJob[]>([]);
    const [unpaidCards, setUnpaidCards] = useState<IJobCard[]>([]);
    const [unpaidProducts, setUnpaidProducts] = useState<ISale[]>([]);
    const [invoice, setInvoice] = useState<IInvoice>({
        title: '',
        slug: '',
        cards: [],
        products: [],
        job: job || { id: '' } as IJob,
        tax: 16,
        total: 0
    } as IInvoice);
    const [markUp, setMarkUp] = useState(25);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { accessToken } = useAuthStore();

    useEffect(() => {
        if (!accessToken) return;

        const fetchData = async () => {
            const res = await getAllJobs(accessToken)

            if (res.success) {
                setJobs(res.data)
            }
        }

        fetchData()
    }, [accessToken])

    useEffect(() => {
        const calculated = unpaidCards.reduce((acc, card) => acc + card.price, 0) + unpaidProducts.reduce((acc, prod) => acc + prod.price, 0);
        const tax = Math.round((invoice.tax * calculated) / 100);
        const profit = Math.round((markUp * calculated) / 100);

        setInvoice({ ...invoice, total: calculated + tax + profit })
    }, [unpaidCards, unpaidProducts, invoice]);

    const validateInput = (): boolean => {
        try {
            invoiceSchema.parse(invoice);
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
            // TODO: Implement actual API call to create invoice
            const response = await createInvoice(invoice, accessToken);
            if (response.success) {
                setSuccessMessage("Invoice created successfully!");
                setInvoice({
                    title: '',
                    slug: '',
                    cards: [],
                    products: [],
                    job: { id: '' } as IJob,
                    tax: 16,
                    total: 0
                } as IInvoice);
                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to create invoice" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IInvoice, value: any) => {
        setInvoice(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title="Create Invoice">
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                <SelectContainer
                    label="Job"
                    value={invoice.job?.id}
                    setValue={(txt: any) => setInvoice({ ...invoice, job: txt })}
                    placeholder="Choose an job"
                    options={jobs}
                />
                {
                    unpaidCards?.length > 0 || unpaidProducts?.length > 0
                        ? ([...unpaidCards, ...unpaidProducts].map((val: IJobCard | ISale) => (
                            <div className="flex justify-between items-center py-2 px-4 bg-cyan-50">
                                <div className="flex flex-col gap-2">
                                    <p className="font-medium text-lg">{'product' in val ? val.product.title : val.title}</p>
                                    <p className="text-slate-600">{val.price}</p>
                                </div>
                            </div>
                        ))) : <div className="w-full h-20 flex justify-center items-center py-2 px-4 bg-cyan-50">
                            <p>Select a job to view the pending Invoices</p>
                        </div>
                }
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <InputContainer
                        label="Tax"
                        value={invoice.tax}
                        setValue={(text: string | number) => setInvoice({ ...invoice, tax: text as number })}
                        placeholder="Cash"
                        helperText="add as a %"
                    />
                    <InputContainer
                        label="Mark-up"
                        value={markUp}
                        setValue={(text: string | number) => setMarkUp(text as number)}
                        placeholder="10"
                        helperText="add as a %"
                    />
                    <InputContainer
                        label="Total"
                        value={invoice.total}
                        setValue={(text: string | number) => setInvoice({ ...invoice, total: text as number })}
                        placeholder="0"
                        disabled
                    />
                </div>
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
                    text={isSubmitting ? "Recording..." : "Record Invoice"}
                    icon={(<Plus size={18} color='#fff' />)}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                    event={handleSubmit}
                />
            </form>
        </Modal>
    )
}
