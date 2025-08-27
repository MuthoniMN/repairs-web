"use client"

import { IContractor } from "@/src/types";
import FormError from "../FormError";
import { createContractor, updateContractor } from "@/src/actions/contractor";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import InputContainer from "../InputContainer";
import { Plus, X, Save } from "lucide-react";
import Button from "../Button";
import { set, z } from "zod";

// Zod schema for contractor validation
const contractorSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z.string().min(1, "Phone number is required"),
    expertise: z.string().min(1, "Expertise is required"),
    location: z.string().min(1, "Location is required"),
    rating: z.number().min(0, "Rating must be greater than or equal to 0").max(5, "Rating cannot exceed 5"),
});

export default function CreateContractor({ open, setOpen, contract }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    contract?: IContractor
}) {
    const [contractor, setContractor] = useState<IContractor>({
        name: '',
        email: '',
        phoneNumber: '',
        expertise: '',
        specialties: '',
        location: '',
        rating: 0,
    });

    const [specialty, setSpecialty] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with contractor data if editing
    useEffect(() => {
        if (contract) {
            setContractor(contract);
        } else {
            setContractor({
                name: '',
                email: '',
                phoneNumber: '',
                expertise: '',
                specialties: '',
                location: '',
                rating: 0,
            });
        }
        setSpecialty('');
        setErrors({});
        setSuccessMessage(null);
    }, [contract, open]);

    const validateInput = (): boolean => {
        try {
            contractorSchema.parse(contractor);
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
            let response;
            if (contract?.id) {
                // Update existing contractor
                response = await updateContractor(contract.id, contractor);
            } else {
                // Create new contractor
                response = await createContractor(contractor);
            }

            if (response.success) {
                const message = contract?.id ? "Contractor updated successfully!" : "Contractor created successfully!";
                setSuccessMessage(message);

                if (!contract?.id) {
                    // Reset form only for new contractors
                    setContractor({
                        name: '',
                        email: '',
                        phoneNumber: '',
                        expertise: '',
                        specialties: '',
                        location: '',
                        rating: 0,
                    });
                    setSpecialty('');
                }

                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to save contractor" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IContractor, value: string | number) => {
        setContractor(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };
    const addSpecialty = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (specialty.trim()) {
                setContractor(prev => ({
                    ...prev,
                    specialties: prev.specialties
                        ? `${prev.specialties}, ${specialty}`
                        : specialty,
                }));
                setSpecialty("");
            }
        }
    };


    const removeSpecialty = (spec: string) => {
        setContractor(prev => ({
            ...prev,
            specialties: prev.specialties.split(', ').filter(s => s !== spec).join(', ')
        }));
    };

    return (
        <Modal open={open} setOpen={setOpen} title={contract ? "Edit Contractor Details" : "Create a Contractor"}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                {errors.general && <FormError err={errors.general} />}
                {successMessage && (
                    <div className="py-2 px-4 bg-green-50 text-green-500 border border-green-200 rounded-md transition-all duration-300">
                        {successMessage}
                    </div>
                )}

                <InputContainer
                    label="Name"
                    value={contractor.name}
                    setValue={(text: string | number) => handleInputChange('name', text)}
                    placeholder="John Doe"
                    err={errors.name}
                />
                <InputContainer
                    label="Location"
                    value={contractor.location}
                    setValue={(text: string | number) => handleInputChange('location', text)}
                    placeholder="Nairobi"
                    err={errors.location}
                />
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Skills</h3>
                    <InputContainer
                        label="Expertise"
                        value={contractor.expertise}
                        setValue={(text: string | number) => handleInputChange('expertise', text)}
                        placeholder="Plumbing"
                        err={errors.expertise}
                    />
                    <div className="flex gap-2">
                        <InputContainer
                            label="Add Specialty"
                            value={specialty}
                            setValue={(text: string | number) => setSpecialty(text as string)}
                            placeholder="Electrical"
                            onEnter={addSpecialty}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {contractor.specialties.split(', ').map((s, index) => (
                            s.length > 0 && (
                                <div key={index} className="flex items-center gap-2 py-1 px-3 bg-cyan-50 rounded-full">
                                    <span>{s}</span>
                                    <X size={14} color="#000" onClick={() => removeSpecialty(s)} className="cursor-pointer" />
                                </div>
                            )
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Contact Information</h3>
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Email"
                            value={contractor.email}
                            setValue={(text: string | number) => handleInputChange('email', text)}
                            placeholder="johndoe@gmail.com"
                            type="email"
                            err={errors.email}
                        />
                        <InputContainer
                            label="Phone Number"
                            value={contractor.phoneNumber}
                            setValue={(text: string | number) => handleInputChange('phoneNumber', text)}
                            placeholder="+254768980967"
                            type="tel"
                            err={errors.phoneNumber}
                        />
                    </div>
                </div>
                <InputContainer
                    label="Rating"
                    value={contractor.rating}
                    setValue={(text: string | number) => handleInputChange('rating', Number(text))}
                    placeholder="0-5"
                    type="number"
                    err={errors.rating}
                />
                <Button
                    text={isSubmitting ? "Saving..." : contract ? "Update Contractor" : "Add Contractor"}
                    icon={isSubmitting ? <Plus size={10} color="#fff" /> : contract ? <Save size={10} color="#fff" /> : <Plus size={10} color="#fff" />}
                    type={isSubmitting ? "secondary" : "default"}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    )
}
