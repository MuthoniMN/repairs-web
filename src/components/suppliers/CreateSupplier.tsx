import { ISupplier } from "@/src/types"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Modal from "../Modal"
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus, Save } from "lucide-react";
import { z } from "zod";
import { validateInput } from "@/src/utils";
import { createSupplier, updateSupplier } from "@/src/actions/supplier";

// Zod schema for supplier validation
const supplierSchema = z.object({
    company: z.string().min(1, "Company name is required"),
    description: z.string().min(1, "Description is required"),
    location: z.string().min(1, "Location is required"),
    leadTime: z.number().min(0, "Lead time must be greater than or equal to 0"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
});

export default function CreateSupplier({ open, setOpen, sup }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    sup?: ISupplier
}) {
    const [supplier, setSupplier] = useState<ISupplier>({
        company: '',
        location: '',
        leadTime: 0,
        phoneNumber: '',
        email: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Initialize form with supplier data if editing
    useEffect(() => {
        if (sup) {
            setSupplier(sup);
        } else {
            setSupplier({
                company: '',
                location: '',
                leadTime: 0,
                phoneNumber: '',
                email: ''
            });
        }
        setErrors({});
        setSuccessMessage(null);
    }, [sup, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { isValid, errors: validationErrors } = validateInput(supplierSchema, supplier);
        if (!isValid) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = sup?.id
                ? await updateSupplier(sup.id, supplier)
                : await createSupplier(supplier);

            if (response.success) {
                const message = sup?.id ? "Supplier updated successfully!" : "Supplier created successfully!";
                setSuccessMessage(message);

                if (!sup?.id) {
                    // Reset form only for new suppliers
                    setSupplier({
                        company: '',
                        location: '',
                        leadTime: 0,
                        phoneNumber: '',
                        email: ''
                    });
                }

                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to save supplier" });
            }
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof ISupplier, value: string | number) => {
        setSupplier(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title={sup ? "Edit supplier details" : "Create a Supplier"}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
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

                <InputContainer
                    label="Company"
                    value={supplier.company}
                    setValue={(val: string | number) => handleInputChange('company', val)}
                    placeholder="ABC Corp"
                    err={errors.company}
                />
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Email"
                            value={supplier.email}
                            setValue={(text: string | number) => handleInputChange('email', text)}
                            placeholder="johndoe@gmail.com"
                            type="email"
                            err={errors.email}
                        />
                        <InputContainer
                            label="Phone Number"
                            value={supplier.phoneNumber}
                            setValue={(text: string | number) => handleInputChange('phoneNumber', text)}
                            placeholder="+254768980967"
                            type="tel"
                            err={errors.phoneNumber}
                        />
                    </div>
                </div>
                <InputContainer
                    label="Location"
                    value={supplier.location}
                    setValue={(val: string | number) => handleInputChange('location', val)}
                    placeholder="Langata"
                    err={errors.location}
                />
                <InputContainer
                    label="How long does it take them to deliver?"
                    value={supplier.leadTime}
                    setValue={(val: string | number) => handleInputChange('leadTime', Number(val))}
                    placeholder="Enter the lead time in days"
                    type="number"
                    err={errors.leadTime}
                    helperText="Enter the number of days"
                />
                <Button
                    text={isSubmitting ? "Saving..." : sup ? "Update Supplier" : "Add Supplier"}
                    icon={isSubmitting ? <Plus size={10} color="#fff" /> : sup ? <Save size={10} color="#fff" /> : <Plus size={10} color="#fff" />}
                    type={isSubmitting ? "secondary" : "default"}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    )
}