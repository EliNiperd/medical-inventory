import { useFormState } from "react-dom";
import FormInput from "./form-input";
import { forwardRef, useState } from "react";

// Input para Email
export const EmailInput = forwardRef((props, ref) => (
  <FormInput
    ref={ref}
    type="email"
    icon="email"
    placeholder="ejemplo@correo.com"
    {...props}
  />
));
EmailInput.displayName = "EmailInput";

// Input para Contraseña con toggle de visibilidad
export const PasswordInput = forwardRef(({ showToggle = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = useFormState(false);
  
  return (
    <FormInput
      ref={ref}
      type={showPassword ? "text" : "password"}
      icon="password"
      placeholder="••••••••"
      {...props}
    >
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showPassword ? (
            <EyeSlashIcon className="h-4 w-4" />
          ) : (
            <EyeIcon className="h-4 w-4" />
          )}
        </button>
      )}
    </FormInput>
  );
});
PasswordInput.displayName = "PasswordInput";

// Input para Teléfono con formato
export const PhoneInput = forwardRef((props, ref) => (
  <FormInput
    ref={ref}
    type="tel"
    icon="phone"
    placeholder="(555) 123-4567"
    {...props}
  />
));
PhoneInput.displayName = "PhoneInput";

// Input para Dinero/Precios
export const CurrencyInput = forwardRef(({ currency = "MXN", ...props }, ref) => (
  <FormInput
    ref={ref}
    type="number"
    step="0.01"
    min="0"
    icon="currency"
    placeholder="0.00"
    {...props}
  >
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {currency}
    </span>
  </FormInput>
));
CurrencyInput.displayName = "CurrencyInput";

// Input para Fecha
export const DateInput = forwardRef((props, ref) => (
  <FormInput
    ref={ref}
    type="date"
    icon="date"
    {...props}
  />
));
DateInput.displayName = "DateInput";

// Input numérico
export const NumberInput = forwardRef(({ min = 0, step = 1, ...props }, ref) => (
  <FormInput
    ref={ref}
    type="number"
    min={min}
    step={step}
    icon="quantity"
    placeholder="0"
    {...props}
  />
));
NumberInput.displayName = "NumberInput";

// Textarea con contador de caracteres
export const TextareaInput = forwardRef(({ 
  maxLength,
  showCount = false,
  rows = 4,
  ...props 
}, ref) => {
  const [count, setCount] = useState(props.value?.length || 0);

  const handleChange = (e) => {
    setCount(e.target.value.length);
    props.onChange?.(e);
  };

  return (
    <div>
      <FormInput
        ref={ref}
        type="textarea"
        rows={rows}
        maxLength={maxLength}
        onChange={handleChange}
        {...props}
      />
      {(showCount || maxLength) && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {count}{maxLength && `/${maxLength}`}
          </span>
        </div>
      )}
    </div>
  );
});
TextareaInput.displayName = "TextareaInput";

// Select customizado
export const SelectInput = forwardRef(({
  options = [],
  placeholder = "Seleccionar...",
  label,
  name,
  error,
  required,
  span,
  containerClassName,
  labelClassName,
  icon,
  showIcon = true,
  ...props
}, ref) => {
  const IconComponent = showIcon ? getIcon('select', name, icon) : null;
  const inputId = props.id || name || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={cn("mb-4", span && `col-span-${span}`, containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId}
          className={cn("block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2", labelClassName)}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={inputId}
          name={name}
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100",
            "dark:focus:ring-blue-400",
            IconComponent && "pl-10",
            error && "border-red-300 focus:ring-red-500 dark:border-red-600"
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value || option.id} 
              value={option.value || option.id}
            >
              {option.label || option.name || option.text}
            </option>
          ))}
        </select>
        
        {IconComponent && (
          <IconComponent className={cn(
            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400",
            error && "text-red-400"
          )} />
        )}
        
        <ChevronDownIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});
SelectInput.displayName = "SelectInput";