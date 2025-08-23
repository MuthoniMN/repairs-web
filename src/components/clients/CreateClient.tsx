import { IClient } from "@/src/types";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "../Modal";
import InputContainer from "../InputContainer";
import Button from "../Button";
import { Plus } from "lucide-react";

export default function CreateClient({ open, setOpen, user }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, user?: IClient }) {
    const [client, setClient] = useState({
        name: '',
        email: '',
        location: '',
        phoneNumber: ''
    } as IClient)
    return (
        <Modal open={open} setOpen={setOpen} title={user ? 'Edit Client Details' : 'Add New Client'}>
            <form className={`flex flex-col gap-4`}>
                <InputContainer
                    label="Name"
                    value={client.name}
                    setValue={(text: string | number) => setClient({ ...client, name: text as string })}
                    placeholder="John Doe"
                />
                <InputContainer
                    label="Location"
                    value={client.location}
                    setValue={(text: string | number) => setClient({ ...client, location: text as string })}
                    placeholder="Nairobi"
                />
                <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold">Contact Information</h3>
                    <div className="flex justify-between items-center">
                        <InputContainer
                            label="Email"
                            value={client.email}
                            setValue={(text: string | number) => setClient({ ...client, email: text as string })}
                            placeholder="johndoe@gmail.com"
                            type="email"
                        />
                        <InputContainer
                            label="Phone Number"
                            value={client.phoneNumber}
                            setValue={(text: string | number) => setClient({ ...client, phoneNumber: text as string })}
                            placeholder="+254768980967"
                            type="tel"
                        />
                    </div>
                </div>
                <Button
                    text="Add Client"
                    icon={(<Plus size={10} color="#fff" />)}
                />
            </form>
        </Modal>
    )
}