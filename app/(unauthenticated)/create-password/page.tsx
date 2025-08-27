"use client"

import { createPassword } from "@/src/actions/auth";
import useAuthStore from "@/src/stores/authStore";
import useInviteStore from "@/src/stores/inviteStore";
import { CheckCircle, EyeOff, Eye } from "lucide-react";
import { useState, useTransition } from "react";
import z from "zod";
import { useRouter } from 'next/navigation';
import { $ZodIssue } from "zod/v4/core";
import Link from "next/link";

interface ICreatePassword {
    email: string,
    password: string,
    confirmPassword: string
}

export default function CreatePassword() {
    const [user, setUser] = useState<ICreatePassword>({} as ICreatePassword);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { accessToken } = useAuthStore();
    const { invite } = useInviteStore();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const schema = z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string()
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"]
    });

    const handleCreatePassword = async () => {
        try {
            setErrors({});

            schema.parse({ ...user, email: invite?.email });

            console.log('Creating password...', user);

            const res = await createPassword({ email: user.email, password: user.password, token: accessToken })

            if (!res.success) throw new Error(res.error);

            router.replace('/invite/success');
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach((err: $ZodIssue) => {
                    if (err.path) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            }
        }
    }

    const handleInputChange = (field: keyof ICreatePassword, value: string) => {
        setUser({ ...user, [field]: value });
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    }

    return (
        <div className="shadow-md p-6 rounded-lg">
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Password</h1>
                <p className="text-gray-600">
                    Almost done! Create a secure password for your account.
                </p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={user.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 ${errors.password ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={user.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12 ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className={`flex items-center gap-2 ${user && user.password && user.password.length >= 8 ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${user && user.password && user.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            At least 8 characters
                        </li>
                        <li className={`flex items-center gap-2 ${/[A-Z]/.test(user && user.password && user.password) ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(user && user.password && user.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            One uppercase letter
                        </li>
                        <li className={`flex items-center gap-2 ${/[0-9]/.test(user && user.password && user.password) ? 'text-green-600' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${/[0-9]/.test(user && user.password && user.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            One number
                        </li>
                    </ul>
                </div>

                <div className="flex gap-3">
                    <Link href={`/invite/${invite?.id}`}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 text-center"
                    >
                        Back
                    </Link>
                    <button
                        onClick={() => startTransition(async () => await handleCreatePassword())}
                        disabled={isPending || !user.password || !user.confirmPassword}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Create Account
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}