import { IClient } from "@/src/types";
import FormError from "../FormError";
import { createClient, updateClient } from "@/src/actions/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal from "../Modal";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus, Save } from "lucide-react";
import { z } from "zod";
import { $ZodIssue } from "zod/v4/core";

// Zod schema for client validation
const clientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Please enter a valid email address"),
    location: z.string().min(1, "Location is required"),
    phoneNumber: z.string().min(1, "Phone number is required")
});

export default function CreateClient({ open, setOpen, user }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, user?: IClient }) {
    const [client, setClient] = useState<IClient>({
        name: '',
        email: '',
        location: '',
        phoneNumber: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with user data if editing
    useEffect(() => {
        if (user) {
            setClient(user);
        } else {
            setClient({ name: '', email: '', location: '', phoneNumber: '' });
        }
        setErrors({});
        setSuccessMessage(null);
    }, [user, open]);

    const validateInput = (): boolean => {
        try {
            clientSchema.parse(client);
            setErrors({});
            return true;
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err: $ZodIssue) => {
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
            if (user?.id) {
                // Update existing client
                response = await updateClient(user.id, client);
            } else {
                // Create new client
                response = await createClient(client);
            }

            if (response.success) {
                const message = user?.id ? "Client updated successfully!" : "Client created successfully!";
                setSuccessMessage(message);

                if (!user?.id) {
                    // Reset form only for new clients
                    setClient({ name: '', email: '', location: '', phoneNumber: '' });
                }

                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to save client" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof IClient, value: string | number) => {
        setClient(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title={user ? 'Edit Client Details' : 'Add New Client'}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                {errors.general && <FormError err={errors.general} />}
                {successMessage && (
                    <div className="py-2 px-4 bg-green-50 text-green-500 border border-green-200 rounded-md transition-all duration-300">
                        {successMessage}
                    </div>
                )}

                <InputContainer
                    label="Name"
                    value={client.name}
                    setValue={(text: string | number) => handleInputChange('name', text)}
                    placeholder="John Doe"
                    err={errors.name}
                />
                <InputContainer
                    label="Location"
                    value={client.location}
                    setValue={(text: string | number) => handleInputChange('location', text)}
                    placeholder="Nairobi"
                    err={errors.location}
                />
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Contact Information</h3>
                    <div className="flex justify-between items-center gap-6">
                        <InputContainer
                            label="Email"
                            value={client.email}
                            setValue={(text: string | number) => handleInputChange('email', text)}
                            placeholder="johndoe@gmail.com"
                            type="email"
                            err={errors.email}
                        />
                        <InputContainer
                            label="Phone Number"
                            value={client.phoneNumber}
                            setValue={(text: string | number) => handleInputChange('phoneNumber', text)}
                            placeholder="+254768980967"
                            type="tel"
                            err={errors.phoneNumber}
                        />
                    </div>
                </div>
                <Button
                    text={isSubmitting ? "Saving..." : user ? "Update Client" : "Add Client"}
                    icon={isSubmitting ? <Plus size={10} color="#fff" /> : user ? <Save size={10} color="#fff" /> : <Plus size={10} color="#fff" />}
                    type={isSubmitting ? "secondary" : "default"}
                    classNames={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                />
            </form>
        </Modal>
    )
}
