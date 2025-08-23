import { ISupplier } from "@/src/types"
import { Dispatch, SetStateAction, useState } from "react"
import Modal from "../Modal"
import InputContainer from "../InputContainer";
import Button from "../Button";

export default function CreateSupplier({ open, setOpen, sup }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    sup?: ISupplier
}) {
    const [supplier, setSupplier] = useState<ISupplier>(sup || {
        company: '',
        location: '',
        leadTime: 0,
        description: ''
    });
    return (
        <Modal open={open} setOpen={setOpen} title={supplier ? "Edit supplier details" : "Create a Supplier"}>
            <form className={`flex flex-col gap-4`}>
                <InputContainer
                    label="Company"
                    value={supplier.company}
                    setValue={(val: any) => setSupplier({ ...supplier, company: val })}
                    placeholder="ABC Corp"
                />
                <InputContainer
                    label="Description"
                    value={supplier.description}
                    setValue={(val: any) => setSupplier({ ...supplier, description: val })}
                    placeholder="Enter the description"
                    large
                />
                <InputContainer
                    label="Location"
                    value={supplier.location}
                    setValue={(val: any) => setSupplier({ ...supplier, location: val })}
                    placeholder="Langata"
                />
                <InputContainer
                    label="How long does it take them to deliver?"
                    value={supplier.leadTime}
                    setValue={(val: any) => setSupplier({ ...supplier, leadTime: val })}
                    placeholder="Enter the lead time in days"
                    type="number"
                />
                <Button
                    text="Add Supplier"
                />
            </form>
        </Modal>
    )
}