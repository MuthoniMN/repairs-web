"use client"

import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import InputContainer from "../InputContainer";
import Modal from "../Modal";
import { IJob } from "../../types";
import Button from "../Button";
import { Plus, X } from "lucide-react";
import SelectContainer from "../SelectContainer";

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

export default function CreateJob({ open, setOpen, val }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, val?: IJob }) {
    const [job, setJob] = useState<IJob>(val || {
        title: '',
        description: '',
        client: {
            name: '',
            email: '',
            location: ''
        },
        due_date: '',
        priority: 'low',
        status: 'draft'
    } as IJob);
    const [step, setStep] = useState(1);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        console.log("Current step before:", step);
        setStep(prev => {
            console.log("Updating to:", prev === 1 ? 2 : prev);
            return prev === 1 ? 2 : prev;
        });
    };


    return (
        <Modal open={open} setOpen={setOpen} title={step == 1 ? 'Create a New Repair Job' : 'Add Client Details'}>
            <form className={`flex flex-col gap-4`} onSubmit={handleSubmit}>
                {step == 1 ?
                    (<>
                        <InputContainer
                            label="Title"
                            value={job.title}
                            setValue={(text: string | number) => setJob({ ...job, title: text as string })}
                            placeholder="Repair my sink"
                        />
                        <InputContainer
                            label="Description"
                            value={job.description}
                            setValue={(text: string | number) => setJob({ ...job, description: text as string })}
                            placeholder="Job description"
                            large
                        />
                        <div className="flex md:flex-row flex-col gap-4 justify-between">
                            <SelectContainer
                                label="Status"
                                value={job.status}
                                setValue={(text: string | number) => setJob({ ...job, status: text as string })}
                                placeholder="Select the job's status"
                                options={jobStatus}
                            />
                            <SelectContainer
                                label="Priority"
                                value={job.priority}
                                setValue={(text: string | number) => setJob({ ...job, priority: text as string })}
                                placeholder="Select the job's priority"
                                options={jobPriority}
                            />
                        </div>
                    </>
                    ) :
                    (
                        <>
                            <InputContainer
                                label="Name"
                                value={job.client.name}
                                setValue={(text: string | number) => setJob({ ...job, client: { ...job.client, name: text as string } })}
                                placeholder="Please enter the client's name"
                            />
                            <InputContainer
                                label="Email"
                                value={job.client.email}
                                setValue={(text: string | number) => setJob({ ...job, client: { ...job.client, email: text as string } })}
                                placeholder="Please enter the client's email"
                            />
                            <InputContainer
                                label="Location"
                                value={job.client.location}
                                setValue={(text: string | number) => setJob({ ...job, client: { ...job.client, location: text as string } })}
                                placeholder="Please enter the client's location"
                            />
                        </>
                    )}
                <Button
                    icon={<Plus size={18} color="#fff" />}
                    text={step != 1 ? "Create New Job" : "Continue"}
                    classNames='self-center'
                />
            </form>
        </Modal>
    );
}