import { IContractor } from "@/src/types";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import InputContainer from "../InputContainer";
import { Plus, X } from "lucide-react";
import Button from "../Button";

export default function CreateContractor({ open, setOpen, contract }: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    contract?: IContractor
}) {
    const [contractor, setContractor] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        expertise: '',
        specialties: [],
        location: '',
        rating: 0,
    } as IContractor);
    const [specialty, setSpecialty] = useState('');

    const removeSpecialty = (spec: string) => {
        setContractor({
            ...contractor,
            specialties: contractor.specialties.filter(s => s !== spec)
        })
    }
    return (
        <Modal open={open} setOpen={setOpen} title={contract ? "Edit Contractor Details" : "Create a Contractor"}>
            <form className={`flex flex-col gap-4`}>
                <InputContainer
                    label="Name"
                    value={contractor.name}
                    setValue={(text: string | number) => setContractor({ ...contractor, name: text as string })}
                    placeholder="John Doe"
                />
                <InputContainer
                    label="Location"
                    value={contractor.location}
                    setValue={(text: string | number) => setContractor({ ...contractor, location: text as string })}
                    placeholder="Nairobi"
                />
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Skills</h3>
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Expertise"
                            value={contractor.expertise}
                            setValue={(text: string | number) => setContractor({ ...contractor, expertise: text as string })}
                            placeholder="Plumbing"
                        />
                        <InputContainer
                            label="Specialities"
                            value={specialty}
                            setValue={(text: string | number) => {
                                setContractor({ ...contractor, specialties: (text as string).split(',').map(skill => skill.length > 0 ? skill.replace(skill[0], skill[0].toUpperCase()) : '') });
                                setSpecialty(text as string)
                            }}
                            placeholder="Electrical"
                        />
                    </div>
                    <div className="flex flex-col divide-2 divide-black gap-2">
                        {contractor.specialties.map(s => (
                            s.length > 0 && (<div className="flex justify-between items-center py-2 px-4 bg-cyan-50">
                                <p>{s}</p>
                                <X size={18} color="#000" onClick={() => removeSpecialty(s)} />
                            </div>)
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Contact Information</h3>
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Email"
                            value={contractor.email}
                            setValue={(text: string | number) => setContractor({ ...contractor, email: text as string })}
                            placeholder="johndoe@gmail.com"
                            type="email"
                        />
                        <InputContainer
                            label="Phone Number"
                            value={contractor.phoneNumber}
                            setValue={(text: string | number) => setContractor({ ...contractor, phoneNumber: text as string })}
                            placeholder="+254768980967"
                            type="tel"
                        />
                    </div>
                </div>
                <Button
                    icon={(<Plus size={18} color="#fff" />)}
                    text="Add a Contractor"
                />
            </form>
        </Modal>
    )
}