//button component from ui.shadcn
import Button from '@/app/ui/button';

// 📌Botón para Submit para uso junto con el hook personalizado useFormValidation (useForm)
export function SubmitButton({ children, isPending, disabled, loadingText }) {
  return (
    <Button type="submit" disabled={disabled} className="btn-form-submit">
      {isPending ? loadingText : children}
    </Button>
  );
}
