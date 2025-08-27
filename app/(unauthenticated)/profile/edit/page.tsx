"use client"

import { updateProfile } from "@/src/actions/user";
import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import FileInput from "@/src/components/FileInput";
import FormError from "@/src/components/FormError";
import InputContainer from "@/src/components/InputContainer";
import Logo from "@/src/components/Logo";
import Modal from "@/src/components/ResponseModal";
import useAuthStore from "@/src/stores/authStore";
import { IUser } from "@/src/types";
import { FormEvent, useState, useTransition } from "react";
import z from "zod";

interface IError extends IUser {
    api?: string
}

export default function ProfileEdit() {
    const { user } = useAuthStore();
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const [isPending, startTransition] = useTransition();
    const [updated, setUpdated] = useState<IUser>(user as IUser);
    const [errors, setErrors] = useState<IError | null>(null);
    const [success, setSuccess] = useState(false);

    const schema = z.object({
        name: z.string('Please enter your name'),
        email: z.string('Please enter your email').email(),
        phoneNumber: z.string('Please enter your phone number'),
        profilePicture: z.string('Please upload a profile picture')
    })

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const handleEditProfile = async (e: FormEvent) => {
        const validator = schema.safeParse(updated);

        if (!validator.success) {
            setErrors({
                name: validator.error.issues.filter(i => i.path.includes('name')).map(i => i.message).join(', '),
                email: validator.error.issues.filter(i => i.path.includes('name')).map(i => i.message).join(', '),
                phoneNumber: validator.error.issues.filter(i => i.path.includes('name')).map(i => i.message).join(', '),
                profilePicture: validator.error.issues.filter(i => i.path.includes('name')).map(i => i.message).join(', '),
            });
            return;
        }

        const res = await updateProfile(updated);

        if (!res.success) {
            setErrors({
                ...errors,
                api: res.error
            } as IError);
            return;
        }

        setSuccess(true);
    }

    return (
        <div className="bg-white shadow-md w-9/10 md:w-3/5 lg:w-2/5 max-w-3xl px-6 gap-4 py-10 flex flex-col items-center rounded-lg">
            <Logo />
            <h1 className={`${dmSans.className} text-xl font-bold text-black text-center`} >Edit your Profile</h1>
            <form className="flex flex-col gap-6 w-full" onSubmit={(formData) => {
                startTransition(() => handleEditProfile(formData))
            }}>

                <InputContainer
                    label="Name"
                    value={updated.name}
                    setValue={(txt: string | number) => setUpdated({ ...updated, name: txt as string })}
                    placeholder="John Doe"
                    err={errors?.password}
                />

                <InputContainer
                    label="Email"
                    value={updated.email}
                    setValue={(txt: string | number) => setUpdated({ ...updated, email: txt as string })}
                    placeholder="test@example.com"
                    type="email"
                    err={errors?.email}
                />

                <InputContainer
                    label="Phone Number"
                    value={updated.phoneNumber}
                    setValue={(txt: string | number) => setUpdated({ ...updated, phoneNumber: txt as string })}
                    placeholder="+254768980789"
                    type="tel"
                    err={errors?.phoneNumber}
                    helperText="Preferrably your M-Pesa number"
                />

                <FileInput label="Add your profile picture" />

                {errors?.api && <FormError err={errors?.api} />}
                <Button
                    text="Edit Profile"
                />
            </form>
            <Modal type="success" message="We encoutered an issue while updating your profile. Please try again!" title="Failed to update profile" isOpen={success} onClose={() => setSuccess(false)} />
        </div>
    )
}