import { useState, useCallback, useEffect } from 'react';

// Funciones de validación reutilizables
const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Este campo es obligatorio';
    }
    return null;
  },

  email: (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Ingresa un email válido';
    }
    return null;
  },

  min: (value, minLength) => {
    if (value && value.length < minLength) {
      return `Debe tener al menos ${minLength} caracteres`;
    }
    return null;
  },

  max: (value, maxLength) => {
    if (value && value.length > maxLength) {
      return `No puede tener más de ${maxLength} caracteres`;
    }
    return null;
  },

  minValue: (value, min) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num < min) {
      return `El valor mínimo es ${min}`;
    }
    return null;
  },

  maxValue: (value, max) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > max) {
      return `El valor máximo es ${max}`;
    }
    return null;
  },

  pattern: (value, regex, message = 'Formato no válido') => {
    if (value && !regex.test(value)) {
      return message;
    }
    return null;
  },

  phone: (value) => {
    if (value && !/^\+?[\d\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
      return 'Ingresa un número de teléfono válido';
    }
    return null;
  },

  url: (value) => {
    if (value && !/^https?:\/\/.+\..+/.test(value)) {
      return 'Ingresa una URL válida';
    }
    return null;
  },

  date: (value) => {
    if (value && isNaN(Date.parse(value))) {
      return 'Ingresa una fecha válida';
    }
    return null;
  },

  futureDate: (value) => {
    if (value) {
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date <= today) {
        return 'La fecha debe ser futura';
      }
    }
    return null;
  }
};

// Hook mejorado useFormInput
export function useFormInput(initialValue = '', rules = {}, formData = {}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Función de validación
  const validate = useCallback((val, allFormData = formData) => {
    if (!rules || Object.keys(rules).length === 0) return null;

    // Ejecutar validaciones en orden
    for (const [rule, ruleConfig] of Object.entries(rules)) {
      let errorMessage = null;

      switch (rule) {
        case 'required':
          if (ruleConfig) errorMessage = validators.required(val);
          break;

        case 'email':
          if (ruleConfig) errorMessage = validators.email(val);
          break;

        case 'min':
          errorMessage = validators.min(val, ruleConfig);
          break;

        case 'max':
          errorMessage = validators.max(val, ruleConfig);
          break;

        case 'minValue':
          errorMessage = validators.minValue(val, ruleConfig);
          break;

        case 'maxValue':
          errorMessage = validators.maxValue(val, ruleConfig);
          break;

        case 'pattern':
          if (Array.isArray(ruleConfig)) {
            errorMessage = validators.pattern(val, ruleConfig[0], ruleConfig[1]);
          }
          break;

        case 'phone':
          if (ruleConfig) errorMessage = validators.phone(val);
          break;

        case 'url':
          if (ruleConfig) errorMessage = validators.url(val);
          break;

        case 'date':
          if (ruleConfig) errorMessage = validators.date(val);
          break;

        case 'futureDate':
          if (ruleConfig) errorMessage = validators.futureDate(val);
          break;

        case 'validate':
          // Validación personalizada
          if (typeof ruleConfig === 'function') {
            errorMessage = ruleConfig(val, allFormData);
          }
          break;

        default:
          break;
      }

      if (errorMessage) {
        setError(errorMessage);
        return errorMessage;
      }
    }

    setError('');
    return null;
  }, [rules, formData]);

  // Re-validar cuando cambie formData (para validaciones cruzadas)
  useEffect(() => {
    if (touched && value) {
      validate(value, formData);
    }
  }, [formData, touched, value, validate]);

  const onChange = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validar en tiempo real si ya se tocó el campo
    if (touched) {
      validate(newValue, formData);
    }
  }, [touched, validate, formData]);

  const onBlur = useCallback(() => {
    setTouched(true);
    validate(value, formData);
  }, [value, validate, formData]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError('');
    setTouched(false);
  }, [initialValue]);

  const forceValidate = useCallback((allFormData = formData) => {
    setTouched(true);
    return validate(value, allFormData);
  }, [value, validate, formData]);

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
    forceValidate
  };
}

// Hook para manejar múltiples campos
export function useForm(initialData = {}, validationRules = {}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Crear validadores para cada campo
  const fieldValidators = {};
  Object.keys(validationRules).forEach(fieldName => {
    fieldValidators[fieldName] = (value) => {
      const rules = validationRules[fieldName];
      
      for (const [rule, ruleConfig] of Object.entries(rules)) {
        let errorMessage = null;

        switch (rule) {
          case 'required':
            if (ruleConfig) errorMessage = validators.required(value);
            break;
          case 'email':
            if (ruleConfig) errorMessage = validators.email(value);
            break;
          case 'min':
            errorMessage = validators.min(value, ruleConfig);
            break;
          case 'max':
            errorMessage = validators.max(value, ruleConfig);
            break;
          case 'minValue':
            errorMessage = validators.minValue(value, ruleConfig);
            break;
          case 'maxValue':
            errorMessage = validators.maxValue(value, ruleConfig);
            break;
          case 'pattern':
            if (Array.isArray(ruleConfig)) {
              errorMessage = validators.pattern(value, ruleConfig[0], ruleConfig[1]);
            }
            break;
          case 'phone':
            if (ruleConfig) errorMessage = validators.phone(value);
            break;
          case 'url':
            if (ruleConfig) errorMessage = validators.url(value);
            break;
          case 'date':
            if (ruleConfig) errorMessage = validators.date(value);
            break;
          case 'futureDate':
            if (ruleConfig) errorMessage = validators.futureDate(value);
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

  const validateField = useCallback((fieldName, value) => {
    if (fieldValidators[fieldName]) {
      const error = fieldValidators[fieldName](value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error
      }));
      return !error;
    }
    return true;
  }, [fieldValidators, formData]);

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      if (fieldValidators[fieldName]) {
        const error = fieldValidators[fieldName](formData[fieldName]);
        newErrors[fieldName] = error;
        if (error) isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [formData, fieldValidators, validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar si el campo ya se tocó
    if (touched[name]) {
      validateField(name, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  }, [validateField]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
  }, [initialData]);

  const setFieldValue = useCallback((fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      validateField(fieldName, value);
    }
  }, [touched, validateField]);

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
    validateField,
    reset,
    setFieldValue,
    isValid: Object.keys(errors).length === 0 || Object.values(errors).every(error => !error)
  };
}