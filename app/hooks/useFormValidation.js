import { useState, useCallback, useMemo, useRef } from 'react';

/**
 * Transforma el objeto de error de Zod a un objeto plano que el hook useForm puede usar.
 * @param {ZodError} zodError - El objeto de error de Zod.
 * @returns {Object} Un objeto donde las claves son los nombres de los campos y los valores son los mensajes de error.
 */
function formatZodErrors(zodError) {
  const formattedErrors = {};
  zodError.errors.forEach((err) => {
    if (err.path.length > 0) {
      formattedErrors[err.path[0]] = err.message;
    }
  });
  return formattedErrors;
}

// Hook useForm refactorizado para usar un esquema Zod
export function useForm(initialData = {}, zodSchema) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const submitTimeoutRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);

  const validateField = useCallback(
    (fieldName, value) => {
      if (!zodSchema) return true;

      // Clona el esquema para no modificar el original
      const fieldSchema = zodSchema.shape[fieldName];
      if (!fieldSchema) return true;

      const result = fieldSchema.safeParse(value);
      setErrors((prev) => ({
        ...prev,
        [fieldName]: result.success ? null : result.error.errors[0].message,
      }));

      return result.success;
    },
    [zodSchema]
  );

  const validateForm = useCallback(
    (options = {}) => {
      const { setTouchedFields = true } = options;
      if (!zodSchema) return true;

      const result = zodSchema.safeParse(formData);

      if (result.success) {
        setErrors({});
        return true;
      } else {
        const formatted = formatZodErrors(result.error);
        setErrors(formatted);
        if (setTouchedFields) {
          setTouched(
            Object.keys(formatted).reduce((acc, key) => {
              acc[key] = true;
              return acc;
            }, {})
          );
        }
        return false;
      }
    },
    [formData, zodSchema]
  );

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      // Medida defensiva: asegurar que nunca se guarde null o undefined en el estado.
      const safeValue = value === null || value === undefined ? '' : value;
      setFormData((prev) => ({ ...prev, [name]: safeValue }));

      if (touched[name]) {
        validateField(name, safeValue);
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, value);
    },
    [validateField]
  );

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
  }, [initialData]);

  const setFieldValue = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
      if (touched[fieldName]) {
        validateField(fieldName, value);
      }
    },
    [touched, validateField]
  );

  const handleSubmit = useCallback(
    async (submitFunction) => {
      // Prevenir múltiples submits
      if (isSubmitting) {
        return { success: false, error: 'Ya está siendo enviado' };
      }

      // Prevenir clicks muy rápidos
      const now = Date.now();
      if (now - lastSubmitTimeRef.current < 2000) {
        return { success: false, error: 'Envío muy rápido' };
      }

      lastSubmitTimeRef.current = now;

      // Validar antes de enviar
      const isFormValid = validateForm();
      if (!isFormValid) {
        return { success: false, error: 'Formulario inválido', errors };
      }

      setIsSubmitting(true);
      setSubmitCount((prev) => prev + 1);

      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
      }, 30000);

      try {
        const result = await submitFunction(formData);

        // Si el servidor devuelve errores de validación, actualizarlos
        if (result && !result.success && result.validationErrors) {
          const serverErrors = {};
          result.validationErrors.forEach((err) => {
            serverErrors[err.field] = err.message;
          });
          setErrors(serverErrors);
          return {
            success: false,
            error: 'Errores de validación del servidor',
            errors: serverErrors,
          };
        }

        return result; // Devuelve el resultado completo de la acción
      } catch (error) {
        return { success: false, error: error.message || 'Error desconocido' };
      } finally {
        setIsSubmitting(false);
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
          submitTimeoutRef.current = null;
        }
      }
    },
    [formData, errors, validateForm, isSubmitting]
  );

  const isValid = useMemo(() => {
    // Considera el formulario válido si no hay errores
    const hasErrors = Object.values(errors).some(
      (error) => error !== null && error !== undefined && error !== ''
    );
    return !hasErrors;
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    isValid,
    isSubmitting,
    isPending: isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    reset,
    setFieldValue,
    setErrors, // Exponer para poder setear errores desde fuera (ej. del servidor)
    handleSubmit,
  };
}
