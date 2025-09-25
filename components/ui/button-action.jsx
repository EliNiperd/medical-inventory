"use client";
import Button from '@/app/ui/button';
import { useFormStatus } from 'react-dom';

export function ButtonActionGuardar() {
    const { pending } = useFormStatus();
    console.log("pending:", pending);
    return (
        <Button type="submit" className="btn-form-submit" aria-disabled={pending} >
            {pending ? 'guardando...' : 'Guardar información'}
        </Button>
    );
}