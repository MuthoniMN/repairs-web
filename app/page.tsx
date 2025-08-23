"use client"

import { dmSans } from "@/src/assets/fonts";
import Button from "@/src/components/Button";
import InputContainer from "@/src/components/InputContainer";
import Logo from "@/src/components/Logo";
import { useState } from "react";

interface ILoginUser {
  email: string,
  password: string
}

export default function Home() {
  const [user, setUser] = useState<ILoginUser>({} as ILoginUser);

  const handleLogin = async () => {
    console.log('Logging in...');
  }

  return (
    <div className={`items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-white ${dmSans.className}`}>
      <div className="bg-white shadow-md w-2/5 h-2/5 max-w-3xl max-h-xl px-6 gap-4 py-10 flex flex-col items-center">
        <Logo />
        <h1 className={`${dmSans.className} text-xl font-bold text-black text-center`} >Log In</h1>
        <form className="flex flex-col gap-6 w-full">
          <InputContainer
            label="Email"
            value={user.email}
            setValue={(txt: string | number) => setUser({ ...user, email: txt as string })}
            placeholder="test@example.com"
          />

          <InputContainer
            label="Password"
            value={user.password}
            setValue={(txt: string | number) => setUser({ ...user, password: txt as string })}
            placeholder="Please enter your password..."
          />

          <Button
            text="Login"
            event={handleLogin}
          />
        </form>
      </div>
    </div>
  );
}
