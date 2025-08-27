"use client"

import { login } from "@/src/actions/auth";
import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import InputContainer from "@/src/components/InputContainer";
import Logo from "@/src/components/Logo";
import { useState, useTransition } from "react";
import z from "zod";
import FormError from "@/src/components/FormError"
import { useRouter } from "next/navigation";
import useAuthStore from "@/src/stores/authStore";

interface ILoginUser {
  email: string,
  password: string,
  api?: string
}

export default function Home() {
  const [user, setUser] = useState<ILoginUser>({} as ILoginUser);
  const [errors, setErrors] = useState<ILoginUser>({} as ILoginUser);
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { setAuthenticated } = useAuthStore();

  const schema = z.object({
    email: z.string('Please provide your email').email('Please enter a valid email'),
    password: z.string('Please provide your password').min(6)
  })

  const handleLogin = async (e: FormData) => {
    console.log('Logging in...', e);

    const res = schema.safeParse(user);

    if (!res.success) {
      setErrors({
        email: res.error.issues.filter(e => e.path.includes('email')).map(e => e.message).join(', '),
        password: res.error.issues.filter(e => e.path.includes('password')).map(e => e.message).join(', '),
      });
      return;
    }

    const results = await login(user);
    if (!results.success) {
      setErrors({
        ...errors,
        api: "Failed to login! Please try again"
      })
      return;
    }

    setAuthenticated(results.data.accessToken, results.data.refreshToken, results.data.user, results.data.user.role)
    router.push('/dashboard')
  }

  return (
    <div className={`items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white ${dmSans.className}`}>
      <div className="bg-white shadow-md w-9/10 md:w-3/5 lg:w-2/5 h-2/5 max-w-3xl max-h-xl px-6 gap-4 py-10 flex flex-col items-center">
        <Logo />
        <h1 className={`${dmSans.className} text-xl font-bold text-black text-center`} >Log In</h1>
        <form className="flex flex-col gap-6 w-full" action={(formData: FormData) => startTransition(() => handleLogin(formData))}>
          <InputContainer
            label="Email"
            value={user.email}
            setValue={(txt: string | number) => setUser({ ...user, email: txt as string })}
            placeholder="test@example.com"
            type="email"
            err={errors.email}
          />

          <InputContainer
            label="Password"
            value={user.password}
            setValue={(txt: string | number) => setUser({ ...user, password: txt as string })}
            placeholder="Please enter your password..."
            err={errors.password}
          />

          {errors.api && <FormError err={errors.api} />}
          <Button
            text="Login"
          />
        </form>
      </div>
    </div>
  );
}
