"use client";
import Button from '@/app/ui/button';
import { useFormStatus } from 'react-dom';

export function ButtonActionGuardar() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" className="pr-4" aria-disabled={pending} >
            {pending ? 'guardando...' : 'Guardar información'}
        </Button>
    );
}