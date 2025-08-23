"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import { IInvoice, IJob, IJobCard, IPayment, ISale } from "@/src/types";
import SelectContainer from "../SelectContainer";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";

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

    useEffect(() => {
        const calculated = unpaidCards.reduce((acc, card) => acc + card.price, 0) + unpaidProducts.reduce((acc, prod) => acc + prod.price, 0);
        const tax = Math.round((invoice.tax * calculated) / 100);
        const profit = Math.round((markUp * calculated) / 100);

        setInvoice({ ...invoice, total: calculated + tax + profit })
    }, [unpaidCards, unpaidProducts, invoice]);

    return (
        <Modal open={open} setOpen={setOpen} title="Create Payment Record">
            <form className={`flex flex-col gap-4`}>
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
                                    <p className="font-medium text-lg">{val.product.title || val.title}</p>
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
                <Button
                    text="Record Invoice"
                    icon={(<Plus size={18} color='#fff' />)}
                />
            </form>
        </Modal>
    )
}