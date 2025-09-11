"use client";

import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/app/login/actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";

// Tu componente ya está configurado correctamente para manejar el estado
const initialState = {
  message: "",
  errors: null,
};

export default function LoginForm() {
  const [formState, dispatch] = useFormState(authenticate, initialState);

  return (
    <Card className="flex-1 rounded-lg px-6 pb-4 pt-8">
      <CardHeader>
        <CardTitle>Please log in to continue.</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={dispatch}>
          {/* Tus inputs de email y password */}
          <label htmlFor="email">Email</label>
          <div className="relative">
            <Input placeholder="Email" name="email" className="peer block w-full rounded-md py-[9px] pl-10 text-sm outline-2" />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
            {formState?.message && (
              <span className="text-red-600 text-sm">{formState.message}</span>
            )}
          </div>
          <label htmlFor="password">Password</label>
          <div className="relative">
            <Input placeholder="Password" name="password" type="password" className="peer block w-full rounded-md py-[9px] pl-10 text-sm outline-2" />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
          </div>
          <LoginButton />
        </form>
      </CardContent>
    </Card>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      {pending ? "loading..." : "login"} <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}