import { useState, useCallback, useMemo, useRef } from 'react';

export function useSchemaValidation(nameSchema) {
  let VALIDATION_RULES = {};
  switch (String(nameSchema).toLocaleLowerCase()) {
    case 'user':
      VALIDATION_RULES = {
        email: {
          required: true,
          email: true,
        },
        password: {
          required: true,
          min: 6,
          validate: (value) => {
            if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
              return 'Debe contener al menos una mayúscula y una minúscula';
            }
            return null;
          },
        },
        confirmPassword: {
          required: true,
          min: 6,
          validate: (value, formData) => {
            if (value !== formData.password) {
              return 'Las contraseñas no coinciden';
            }
            return null;
          },
        },
      };
      break;
    case 'useredit':
      VALIDATION_RULES = {
        user_name_full: {
          required: true,
          min: 5,
        },
        email: {
          required: true,
          email: true,
        },
        password: {
          min: 6,
          validate: (value) => {
            if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
              return 'Debe contener al menos una mayúscula y una minúscula';
            }
            return null;
          },
        },
        confirmPassword: {
          required: true,
          min: 6,
          validate: (value, formData) => {
            if (value !== formData.password) {
              return 'Las contraseñas no coinciden';
            }
            return null;
          },
        },
      };
      break;
    case 'location':
      VALIDATION_RULES = {
        location_name: {
          required: true,
          min: 3,
        },
        location_description: {
          required: true,
          min: 5,
        },
      };
      break;
    case 'form':
      VALIDATION_RULES = {
        form_name: {
          required: true,
          min: 5,
        },
        form_description: {
          required: true,
          min: 10,
        },
      };
      break;
    case 'category':
      VALIDATION_RULES = {
        category_name: {
          required: true,
          min: 5,
        },
        category_description: {
          required: true,
          min: 10,
        },
      };
      break;
  }

  if (!VALIDATION_RULES.length === 0) {
    console.log('No se encontraron validaciones para el formulario');
  }

  return VALIDATION_RULES;
}

// Hook mejorado useFormInput con soporte para submit status
export function useFormInput(initialValue = '', rules = {}, formData = {}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef(null);

  // Validación (igual que antes)
  const validate = useCallback(
    (val, allFormData = formData) => {
      if (!rules || Object.keys(rules).length === 0) return null;

      // Validaciones básicas
      if (rules.required && (!val || (typeof val === 'string' && val.trim() === ''))) {
        return 'Este campo es obligatorio';
      }

      if (rules.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Ingresa un email válido';
      }

      if (rules.min && val && val.length < rules.min) {
        return `Debe tener al menos ${rules.min} caracteres`;
      }

      if (rules.max && val && val.length > rules.max) {
        return `No puede tener más de ${rules.max} caracteres`;
      }

      if (rules.minValue !== undefined) {
        const num = parseFloat(val);
        if (!isNaN(num) && num < rules.minValue) {
          return `El valor mínimo es ${rules.minValue}`;
        }
      }

      if (rules.validate && typeof rules.validate === 'function') {
        const customError = rules.validate(val, allFormData);
        if (customError && customError !== true) {
          return customError;
        }
      }

      return null;
    },
    [rules, formData]
  );

  const onChange = useCallback(
    (e) => {
      const newValue = e.target.value;
      setValue(newValue);

      if (touched) {
        const errorMsg = validate(newValue, formData);
        setError(errorMsg || '');
      }
    },
    [touched, validate, formData]
  );

  const onBlur = useCallback(() => {
    setTouched(true);
    const errorMsg = validate(value, formData);
    setError(errorMsg || '');
  }, [value, validate, formData]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
    setIsSubmitting(false);
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }
  }, [initialValue]);

  const forceValidate = useCallback(
    (allFormData = formData) => {
      setTouched(true);
      const errorMsg = validate(value, allFormData);
      setError(errorMsg || '');
      return !errorMsg;
    },
    [value, validate, formData]
  );

  // Nuevas funciones para manejo de submit
  const startSubmitting = useCallback(() => {
    setIsSubmitting(true);
    // Auto-reset después de 30 segundos como medida de seguridad
    submitTimeoutRef.current = setTimeout(() => {
      setIsSubmitting(false);
    }, 30000);
  }, []);

  const stopSubmitting = useCallback(() => {
    setIsSubmitting(false);
    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
      submitTimeoutRef.current = null;
    }
  }, []);

  return {
    value,
    onChange,
    onBlur,
    error: touched ? error : '',
    setValue,
    setError,
    isValid: !error,
    touched,
    reset,
    forceValidate,
    // Nuevas propiedades para submit status
    isSubmitting,
    startSubmitting,
    stopSubmitting,
    isPending: isSubmitting, // Alias para compatibilidad con useFormStatus
  };
}

// Hook useForm mejorado con submit status global
export function useForm(initialData = {}, validationRules = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const submitTimeoutRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);

  // Crear validadores para cada campo
  const fieldValidators = useMemo(() => {
    const validators = {};
    Object.keys(validationRules).forEach((fieldName) => {
      validators[fieldName] = (value) => {
        const rules = validationRules[fieldName];

        for (const [rule, ruleConfig] of Object.entries(rules)) {
          let errorMessage = null;

          switch (rule) {
            case 'required':
              if (ruleConfig && (!value || (typeof value === 'string' && value.trim() === ''))) {
                errorMessage = 'Este campo es obligatorio';
              }
              break;
            case 'email':
              if (ruleConfig && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Ingresa un email válido';
              }
              break;
            case 'min':
              if (value && value.length < ruleConfig) {
                errorMessage = `Debe tener al menos ${ruleConfig} caracteres`;
              }
              break;
            case 'max':
              if (value && value.length > ruleConfig) {
                errorMessage = `No puede tener más de ${ruleConfig} caracteres`;
              }
              break;
            case 'minValue':
              const num = parseFloat(value);
              if (!isNaN(num) && num < ruleConfig) {
                errorMessage = `El valor mínimo es ${ruleConfig}`;
              }
              break;
            case 'validate':
              if (typeof ruleConfig === 'function') {
                errorMessage = ruleConfig(value, formData);
              }
              break;
          }

          if (errorMessage) return errorMessage;
        }
        return null;
      };
    });
    return validators;
  }, [validationRules, formData]);

  const validateField = useCallback(
    (fieldName, value) => {
      if (fieldValidators[fieldName]) {
        const error = fieldValidators[fieldName](value);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: error,
        }));
        return !error;
      }
      return true;
    },
    [fieldValidators]
  );

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach((fieldName) => {
      if (fieldValidators[fieldName]) {
        const error = fieldValidators[fieldName](formData[fieldName]);
        newErrors[fieldName] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    return isValid;
  }, [formData, fieldValidators, validationRules]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        validateField(name, value);
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

  // Función de submit con protección contra múltiples envíos
  const handleSubmit = useCallback(
    async (submitFunction, options = {}) => {
      const {
        preventDuplicates = true,
        duplicateWindow = 2000, // 2 segundos por defecto
        onStart,
        onSuccess,
        onError,
        onFinish,
      } = options;

      // Prevenir múltiples submits
      if (isSubmitting) {
        // console.warn('Formulario ya está siendo enviado...'); // 🔍 Solo para Debuggear
        return { success: false, error: 'Ya está siendo enviado' };
      }

      // Prevenir clicks muy rápidos
      const now = Date.now();
      if (preventDuplicates && now - lastSubmitTimeRef.current < duplicateWindow) {
        //console.warn('Envío muy rápido, espera un momento...'); // 🔍 Solo para Debuggear
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

      // Auto-reset después de 30 segundos como medida de seguridad
      submitTimeoutRef.current = setTimeout(() => {
        setIsSubmitting(false);
        // console.warn('Submit timeout - reseteando estado'); // 🔍 Solo para Debuggear
      }, 30000);

      try {
        onStart?.(formData);

        const result = await submitFunction(formData);

        onSuccess?.(result, formData);
        return { success: true, data: result };
      } catch (error) {
        // console.error('Error en submit:', error); // 🔍 Solo para Debuggear
        onError?.(error, formData);
        return { success: false, error: error.message || 'Error desconocido' };
      } finally {
        setIsSubmitting(false);
        if (submitTimeoutRef.current) {
          clearTimeout(submitTimeoutRef.current);
          submitTimeoutRef.current = null;
        }
        onFinish?.(formData);
      }
    },
    [formData, errors, validateForm, isSubmitting]
  );

  // Función simplificada para usar con Server Actions
  const handleServerAction = useCallback(
    async (serverAction, options = {}) => {
      return handleSubmit(async (data) => {
        const formDataToSubmit = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          formDataToSubmit.append(key, value);
        });
        return await serverAction(formDataToSubmit);
      }, options);
    },
    [handleSubmit]
  );

  return {
    // Datos
    formData,
    errors,
    touched,

    // Estados
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every((error) => !error),
    isSubmitting,
    isPending: isSubmitting, // Alias para compatibilidad con useFormStatus
    submitCount,

    // Funciones
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    reset,
    setFieldValue,
    handleSubmit,
    handleServerAction,

    // Utilidades
    clearFilters: () => {
      setFormData(initialData);
      setErrors({});
      setTouched({});
    },
  };
}

// Hook personalizado que combina validación con submit status
export function useFormWithStatus(initialData = {}, validationRules = {}) {
  const form = useForm(initialData, validationRules);

  // Crear un objeto que simule useFormStatus
  const formStatus = useMemo(
    () => ({
      pending: form.isSubmitting,
      data: form.isSubmitting ? new FormData() : null,
      method: form.isSubmitting ? 'POST' : null,
      action: form.isSubmitting ? 'submitting' : null,
    }),
    [form.isSubmitting]
  );

  return {
    ...form,
    formStatus,
    // Función helper para componentes que esperan useFormStatus
    useFormStatus: () => formStatus,
  };
}
