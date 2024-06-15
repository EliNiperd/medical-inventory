"use client";

import { nunito } from "@/app/ui/fonts";
import { authenticate } from "@/app/login/actions";

//import { z } from 'zod';

//import { useForm } from 'react-hook-form';
//import { zodResolver } from '@hookform/resolvers/zod';
import { useFormState, useFormStatus } from 'react-dom';
//import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/20/solid";
import { AtSymbolIcon, KeyIcon } from "@heroicons/react/24/outline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
/*
const loginSchema = z.object({
  email: z.string().email('Email required'),
  password: z.string().min(8),
});
*/
/*
const formSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email('Please enter a valid email address'),
  password: z.string({
    required_error: 'Please enter your password',
  }),
});
*/

const initialState = {
  message: '',
  errors: null,
};

export default function LoginForm() {
  /*const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema)
  });*/
  //const [errorMessage, dispatch] = useFormState(authenticate, initialState);
  const [formState, dispatch] = useFormState(authenticate, initialState);

  console.log(formState);

  //  console.log(emailErrors, passwordErrors);
  //console.log('email:', formState.fieldErrors['email']?.[0]);

  //const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  /*
  const onSubmit = (data) => {
    console.log(data);
    dispatch(data);
  };
*/
  return (
    <>
      <Card className="flex-1 rounded-lg  px-6 pb-4 pt-8">
        <CardHeader>
          <CardTitle>Please log in to continue.</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={dispatch}  >
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <Input placeholder="Email" name="email" className="peer block w-full rounded-md  py-[9px] pl-10 text-sm outline-2 " />
              {/*errors.email && <p>{errors.email.message}</p>*/}
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              {formState?.errors?.email && (
                <span id="email-error" className="text-red-600 text-sm absolute pb-2">
                  {formState.errors.email.join(',')}
                </span>
              )}
            </div>
            <label
              className="mb-3 mt-5 block text-xs font-medium "
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <Input placeholder="Password" name="password" className="peer block w-full rounded-md  py-[9px] pl-10 text-sm outline-2 " />
              {/*errors.password && <p>{errors.password.message}</p>*/}
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 " />
              {formState?.errors?.password && (
                <span id="password-error" className="text-red-600 text-sm absolute ">
                  {formState.errors.password.join(',')}
                </span>
              )}
            </div>
            <LoginButton />
          </form>
        </CardContent>
      </Card>

    </>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  //
  return (
    <Button className="mt-6 w-full " aria-disabled={pending}>
      {pending ? 'loading...' : 'login'} <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}

/*
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
  
} from "@heroicons/react/24/outline";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/20/solid";


import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useFormState, useFormStatus} from "react-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
//import { Icons } from '../icons'

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";

const formSchema = z.object({
  email: z.string({ required_error: 'Please enter your email' }).email('Please enter a valid email address'),
  password: z.string({
    required_error: 'Please enter your password',
  }),
});

export default function LoginForm({ callbackUrl }) {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  

  const router = useRouter();

  const form = useForm({
    // validate inputs
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values) {
    try {
      setIsLoading(true);

      //const response = false;
      console.log(values);
      toast({
        title: "Valores de login",
        description: values?.email,
        variant: "destructive"
      });
      if (!response?.ok) {
        toast({
          title: "Something went wrong!",
          description: response?.error,
          variant: "destructive"
        });
        return
      }

      toast({
        title: "Welcome back! ",
        description: "Redirecting you to your dashboard!"
      });

      //router.push(callbackUrl ? callbackUrl : "/")
    } catch (error) {
      console.log({ error });
      toast({
        title: "Something went wrong!",
        description: "We couldn't create your account. Please try again later!: " + error.stack ,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false)
    }
    //onSubmit={form.handleSubmit(onSubmit)}
  }

  return (
    <>
    <Form {...form}>
      <form action={dispatch}  >
        <div className="grid gap-2">
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        placeholder="Your Email"
                        className={`${form.formState.errors.email &&
                          "border-destructive bg-destructive/30"}`}
                        {...field}
                      />
                      <AtSymbolIcon className={`pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 ${
                          form.formState.errors.email
                            ? "text-destructive"
                            : "text-muted-foreground"
                        } `} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-1">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <KeyIcon className={` pointer-events-none  left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 ${
                          form.formState.errors.password
                            ? "text-destructive"
                            : "text-muted-foreground"
                        } `} />
                      
                      <Input
                        type="password"
                        placeholder="Your Password"
                        className={`${form.formState.errors.password &&
                          "border-destructive bg-destructive/30"}`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <LoginButton />
            <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage && (
                <>
                
                  <ExclamationCircleIcon className="h-5 w-5  " />
                  <p className="text-sm ">{
                  errorMessage
                  }</p>
                </>
              )}
            </div>
            <div className="flex h-8 items-end space-x-1">
             
            </div>
        </div>
      </form>
    </Form>
    </>
  )
}


function LoginButton() {
  const { pending } = useFormStatus();
  //
  return (
    <Button className="mt-4 w-full " aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5" />
    </Button>
  );
}
*/