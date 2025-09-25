'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/app/login/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, AtSymbolIcon, HomeModernIcon, KeyIcon } from '@heroicons/react/24/outline';

// Tu componente ya está configurado correctamente para manejar el estado
const initialState = {
  message: '',
  errors: null,
};

export default function LoginForm() {
  const [formState, dispatch] = useFormState(authenticate, initialState);

  return (
    <div className="form-basic ">
      <div>
        <div className="flex m-4 items-end gap-2">
          <div>
            <HomeModernIcon className="w-6 " />
          </div>
          <div>
            <p>Please log in to continue.</p>
          </div>
        </div>
      </div>
      <div>
        <form action={dispatch} className="form-basic border-none">
          <div>
            {/* Tus inputs de email y password */}
            <label htmlFor="email">Email</label>
            <div className="relative mb-6">
              <input placeholder="Email" name="email" className="input-form" />
              <AtSymbolIcon className="icon-input" />
              {formState?.message && (
                <span className="text-red-600 text-sm">{formState.message}</span>
              )}
            </div>
            <label htmlFor="password">Password</label>
            <div className="relative mb-6">
              <input
                placeholder="Password"
                name="password"
                type="password"
                className="input-form"
              />
              <KeyIcon className="icon-input" />
            </div>
            <LoginButton />
          </div>
        </form>
      </div>

      <div></div>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-6 w-full" aria-disabled={pending}>
      {pending ? 'loading...' : 'login'} <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
