"use client"

import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import InputContainer from "../InputContainer";
import Modal from "../Modal";
import { IJob } from "../../types";
import Button from "../Button";
import { Plus, Save } from "lucide-react";
import SelectContainer from "../SelectContainer";
import FormError from "../FormError";
import { createJob, updateJob } from "@/src/actions/job";
import { z } from "zod";

const jobStatus = [
    { text: 'Draft', value: 'draft' },
    { text: 'Pending', value: 'pending' },
    { text: 'In Progress', value: 'in-progress' },
    { text: 'Completed', value: 'completed' },
    { text: 'Payment Pending', value: 'payment-pending' },
    { text: 'Payment Completed', value: 'payment-completed' },
    { text: 'Finalized', value: 'finalized' }
]

const jobPriority = [
    { text: 'High', value: 'high' },
    { text: 'Medium', value: 'medium' },
    { text: 'Low', value: 'low' }
]

// Zod schema for job validation
const jobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(['draft', 'pending', 'in-progress', 'completed', 'payment-pending', 'payment-completed', 'finalized']),
    priority: z.enum(['high', 'medium', 'low']),
    client: z.object({
        name: z.string().min(1, "Client name is required"),
        email: z.string().email("Please enter a valid email address"),
        phoneNumber: z.string(),
        location: z.string().min(1, "Client location is required")
    }),
    due_date: z.string().min(1, "Due date is required")
});

export default function CreateJob({ open, setOpen, val }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, val?: IJob }) {
    const [job, setJob] = useState<IJob>(val || {
        title: '',
        description: '',
        client: {
            name: '',
            email: '',
            phoneNumber: '',
            location: ''
        },
        due_date: '',
        priority: 'low',
        status: 'draft'
    } as IJob);

    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize form with job data if editing
    useEffect(() => {
        if (val) {
            setJob(val);
            setStep(2); // If editing, show both steps
        } else {
            setJob({
                title: '',
                description: '',
                client: {
                    name: '',
                    email: '',
                    phoneNumber: '',
                    location: ''
                },
                due_date: '',
                priority: 'low',
                status: 'draft'
            });
            setStep(1);
        }
        setErrors({});
        setSuccessMessage(null);
    }, [val, open]);

    const validateStep1 = (): boolean => {
        try {
            jobSchema.pick({
                title: true,
                description: true,
                status: true,
                priority: true
            }).parse(job);
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

    const validateStep2 = (): boolean => {
        try {
            jobSchema.pick({
                client: true,
                due_date: true
            }).parse(job);
            setErrors({});
            return true;
            /* eslint-disable @typescript-eslint/no-unused-vars */
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err) => {
                    if (err.path[0]) {
                        const fieldName = err.path.join('.');
                        newErrors[fieldName] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (step === 1) {
            if (!validateStep1()) return;
            setStep(2);
            return;
        }

        if (!validateStep2()) return;

        setIsSubmitting(true);
        try {
            let response;
            if (val?.id) {
                // Update existing job
                response = await updateJob(val.id, job);
            } else {
                // Create new job
                response = await createJob(job);
            }

            if (response.success) {
                const message = val?.id ? "Job updated successfully!" : "Job created successfully!";
                setSuccessMessage(message);

                if (!val?.id) {
                    // Reset form only for new jobs
                    setJob({
                        title: '',
                        description: '',
                        client: {
                            name: '',
                            email: '',
                            phoneNumber: '',
                            location: ''
                        },
                        due_date: '',
                        priority: 'low',
                        status: 'draft'
                    });
                    setStep(1);
                }

                setTimeout(() => {
                    setSuccessMessage(null);
                    setOpen(false);
                }, 2000);
            } else {
                setErrors({ general: response.error || "Failed to save job" });
            }
        } catch (err) {
            setErrors({ general: "An unexpected error occurred" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setJob(prev => {
                const parentValue = prev[parent as keyof IJob];
                if (typeof parentValue === 'object' && parentValue !== null) {
                    return {
                        ...prev,
                        [parent]: {
                            ...parentValue,
                            [child]: value
                        }
                    };
                }
                return { ...prev, [field]: value };
            });
        } else {
            setJob(prev => ({ ...prev, [field]: value }));
        }

        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} title={step == 1 ? 'Create a New Repair Job' : 'Add Client Details'}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                {errors.general && <FormError err={errors.general} />}
                {successMessage && (
                    <div className="py-2 px-4 bg-green-50 text-green-500 border border-green-200 rounded-md transition-all duration-300">
                        {successMessage}
                    </div>
                )}

                {step == 1 ? (
                    <>
                        <InputContainer
                            label="Title"
                            value={job.title}
                            setValue={(text: string | number) => handleInputChange('title', text)}
                            placeholder="Repair my sink"
                            err={errors.title}
                        />
                        <InputContainer
                            label="Description"
                            value={job.description}
                            setValue={(text: string | number) => handleInputChange('description', text)}
                            placeholder="Job description"
                            large
                            err={errors.description}
                        />
                        <div className="flex md:flex-row flex-col gap-4 justify-between">
                            <SelectContainer
                                label="Status"
                                value={job.status}
                                setValue={(text: string | number) => handleInputChange('status', text)}
                                placeholder="Select the job's status"
                                options={jobStatus}
                            />
                            <SelectContainer
                                label="Priority"
                                value={job.priority}
                                setValue={(text: string | number) => handleInputChange('priority', text)}
                                placeholder="Select the job's priority"
                                options={jobPriority}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        <InputContainer
                            label="Name"
                            value={job.client.name}
                            setValue={(text: string | number) => handleInputChange('client.name', text)}
                            placeholder="Please enter the client's name"
                            err={errors['client.name']}
                        />
                        <InputContainer
                            label="Email"
                            value={job.client.email}
                            setValue={(text: string | number) => handleInputChange('client.email', text)}
                            placeholder="Please enter the client's email"
                            type="email"
                            err={errors['client.email']}
                        />
                        <InputContainer
                            label="Phone Number"
                            value={job.client.phoneNumber}
                            setValue={(text: string | number) => handleInputChange('client.phoneNumber', text)}
                            placeholder="Please enter the client's phone number"
                            err={errors['client.phoneNumber']}
                        />
                        <InputContainer
                            label="Location"
                            value={job.client.location}
                            setValue={(text: string | number) => handleInputChange('client.location', text)}
                            placeholder="Please enter the client's location"
                            err={errors['client.location']}
                        />
                        <InputContainer
                            label="Due Date"
                            value={job.due_date}
                            setValue={(text: string | number) => handleInputChange('due_date', text)}
                            placeholder="YYYY-MM-DD"
                            type="date"
                            err={errors.due_date}
                        />
                    </>
                )}
                <div className="flex gap-2">
                    {step === 2 && (
                        <Button
                            text="Back"
                            type="secondary"
                            event={() => setStep(1)}
                            classNames="flex-1"
                        />
                    )}
                    <Button
                        text={isSubmitting ? "Saving..." : step === 1 ? "Continue" : val ? "Update Job" : "Create Job"}
                        icon={isSubmitting ? undefined : step === 1 ? <Plus size={18} color="#fff" /> : val ? <Save size={18} color="#fff" /> : <Plus size={18} color="#fff" />}
                        type={isSubmitting ? "secondary" : "default"}
                        classNames={isSubmitting ? "opacity-50 cursor-not-allowed flex-1" : "flex-1"}
                    />
                </div>
            </form>
        </Modal>
    );
}
