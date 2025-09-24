// components/ui/form-input.jsx
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  AtSymbolIcon,
  UserIcon,
  PhoneIcon,
  KeyIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  HashtagIcon,
  ClockIcon,
  BeakerIcon,
  TagIcon,
  CalculatorIcon,
} from "@heroicons/react/24/outline";

// Mapeo de iconos por tipo de campo
const iconMap = {
  email: AtSymbolIcon,
  password: KeyIcon,
  text: UserIcon,
  tel: PhoneIcon,
  phone: PhoneIcon,
  description: DocumentTextIcon,
  textarea: DocumentTextIcon,
  number: CalculatorIcon,
  currency: CurrencyDollarIcon,
  price: CurrencyDollarIcon,
  date: CalendarDaysIcon,
  datetime: CalendarDaysIcon,
  time: ClockIcon,
  company: BuildingOfficeIcon,
  address: MapPinIcon,
  location: MapPinIcon,
  id: HashtagIcon,
  medicine: BeakerIcon,
  category: TagIcon,
  quantity: CalculatorIcon,
  default: UserIcon,
};

// Función para obtener el icono apropiado
const getIcon = (type, name, icon) => {
  if (icon) return icon;
  
  // Buscar por nombre del campo
  const nameKey = Object.keys(iconMap).find(key => 
    name?.toLowerCase().includes(key)
  );
  if (nameKey) return iconMap[nameKey];
  
  // Buscar por tipo
  return iconMap[type] || iconMap.default;
};

const FormInput = forwardRef(({
  className,
  type = "text",
  label,
  name,
  icon,
  error,
  helperText,
  required = false,
  span = 1, // Para grid responsive
  containerClassName,
  labelClassName,
  iconClassName,
  showIcon = true,
  children, // Para elementos adicionales como botones
  ...props
}, ref) => {
  const IconComponent = showIcon ? getIcon(type, name, icon) : null;
  const inputId = props.id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const spanClasses = {
    1: 'col-span-1',
    2: 'col-span-2', 
    3: 'col-span-3',
    4: 'col-span-4',
    'full': 'col-span-full',
  };

  const isTextarea = type === 'textarea';

  return (
    <div className={cn(
      "mb-4",
      span && spanClasses[span],
      containerClassName
    )}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",
            labelClassName
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {isTextarea ? (
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            className={cn(
              // Base styles
              "flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
              "dark:focus:ring-blue-400",
              
              // Icon padding
              IconComponent && "pl-10",
              
              // Error styles
              error && "border-red-300 focus:ring-red-500 dark:border-red-600",
              
              // Custom className
              className
            )}
            {...props}
          />
        ) : (
          <input
            ref={ref}
            type={type}
            id={inputId}
            name={name}
            className={cn(
              // Base styles
              "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500",
              "dark:focus:ring-blue-400",
              
              // Icon padding
              IconComponent && "pl-10",
              children && "pr-10", // Espacio para elementos adicionales
              
              // Error styles
              error && "border-red-300 focus:ring-red-500 dark:border-red-600",
              
              // Custom className
              className
            )}
            {...props}
          />
        )}
        
        {/* Icon */}
        {IconComponent && (
          <IconComponent 
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
              error && "text-red-400",
              iconClassName
            )} 
          />
        )}
        
        {/* Elementos adicionales (ej: botones) */}
        {children && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {children}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = "FormInput";

export default FormInput;

// Hook para manejar el estado del input - VERSIÓN CORREGIDA
export function useFormInput(initialValue = "", rules = {}, formData = {}) {
  const [value, setValue] = React.useState(initialValue);
  const [error, setError] = React.useState("");
  const [touched, setTouched] = React.useState(0);

  // Función de validación que maneja el objeto de reglas
  const validate = React.useCallback((val, allFormData = formData) => {
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

    if (rules.maxValue !== undefined) {
      const num = parseFloat(val);
      if (!isNaN(num) && num > rules.maxValue) {
        return `El valor máximo es ${rules.maxValue}`;
      }
    }

    if (rules.phone && val && !/^\+?[\d\s\-\(\)]{10,}$/.test(val.replace(/\s/g, ''))) {
      return 'Ingresa un número de teléfono válido';
    }

    if (rules.date && val && isNaN(Date.parse(val))) {
      return 'Ingresa una fecha válida';
    }

    if (rules.futureDate && val) {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (date <= today) {
        return 'La fecha debe ser futura';
      }
    }

    // Validación personalizada
    if (rules.validate && typeof rules.validate === 'function') {
      const customError = rules.validate(val, allFormData);
      if (customError && customError !== true) {
        return customError;
      }
    }

    return null;
  }, [rules, formData]);

  // Re-validar cuando cambie formData (para validaciones cruzadas)
  React.useEffect(() => {
    if (touched && value) {
      const errorMsg = validate(value, formData);
      setError(errorMsg || "");
    }
  }, [formData, touched, value, validate]);

  const onChange = React.useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    // Validar en tiempo real si ya se tocó el campo
    if (touched) {
      const errorMsg = validate(newValue, formData);
      setError(errorMsg || "");
    }
  }, [touched, validate, formData]);

  const onBlur = React.useCallback(() => {
    setTouched(1);
    const errorMsg = validate(value, formData);
    setError(errorMsg || "");
  }, [value, validate, formData]);

  const reset = React.useCallback(() => {
    setValue(initialValue);
    setError("");
    setTouched(0);
  }, [initialValue]);

  const forceValidate = React.useCallback((allFormData = formData) => {
    setTouched(1);
    const errorMsg = validate(value, allFormData);
    setError(errorMsg || "");
    return !errorMsg;
  }, [value, validate, formData]);

  return {
    value,
    onChange,
    onBlur,
    error: touched ? error : "",
    //setValue,
    //setError,
    isValid: !error,
    touched,
    //reset,
    //forceValidate
  };
}