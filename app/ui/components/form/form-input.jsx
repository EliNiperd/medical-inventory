// components/ui/form-input.jsx
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
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
  ChevronDownIcon,
  QueueListIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';

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
  select: QueueListIcon,
  dropdown: ChevronDownIcon,
  options: Squares2X2Icon,
  default: UserIcon,
};

// Función para obtener el icono apropiado
const getIcon = (type, name, icon) => {
  if (icon) return icon;

  // Buscar por nombre del campo
  const nameKey = Object.keys(iconMap).find((key) => name?.toLowerCase().includes(key));
  if (nameKey) return iconMap[nameKey];

  // Buscar por tipo
  return iconMap[type] || iconMap.default;
};

const FormInput = forwardRef(
  (
    {
      className,
      type = 'text',
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

      // Props específicos para select
      options = [], // Array de opciones para select
      placeholder = '', // Placeholder para todos los tipos
      multiple = false, // Para select múltiple
      optionValueKey = 'value', // Key para el valor en objetos
      optionLabelKey = 'label', // Key para el label en objetos
      optionDisabledKey = 'disabled', // Key para disabled en objetos
      showEmptyOption = true, // Mostrar opción vacía en select
      emptyOptionLabel = '-- Seleccione una opción --', // Label para opción vacía

      ...props
    },
    ref
  ) => {
    const IconComponent = showIcon ? getIcon(type, name, icon) : null;
    const inputId = props.id || name || `input-${Math.random().toString(36).substr(2, 9)}`;

    const spanClasses = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      full: 'col-span-full',
    };

    const isTextarea = type === 'textarea';
    const isSelect = type === 'select';

    // Función para normalizar opciones
    const normalizeOption = (option) => {
      if (typeof option === 'string' || typeof option === 'number') {
        return {
          value: option,
          label: option,
          disabled: false,
        };
      }
      return {
        value: option[optionValueKey],
        label: option[optionLabelKey],
        disabled: option[optionDisabledKey] || false,
      };
    };

    // Renderizar el campo de entrada
    const renderField = () => {
      const baseStyles = cn(
        // Base styles
        'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
        'dark:focus:ring-blue-400',

        // Icon padding
        IconComponent && 'pl-10',

        // Error styles
        error && 'border-red-300 focus:ring-red-500 dark:border-red-600'
      );

      if (isSelect) {
        return (
          <div className="relative">
            <select
              ref={ref}
              id={inputId}
              name={name}
              multiple={multiple}
              className={cn(
                baseStyles,
                'h-10', // Altura consistente con inputs
                !multiple && 'appearance-none pr-10', // Espacio para el icono del dropdown
                multiple && 'h-auto min-h-[80px] py-2', // Altura automática para select múltiple
                className
              )}
              {...props}
            >
              {/* Opción vacía para select simple */}
              {!multiple && showEmptyOption && (
                <option value="" disabled={required}>
                  {placeholder || emptyOptionLabel}
                </option>
              )}

              {/* Renderizar opciones */}
              {options.map((option, index) => {
                const normalizedOption = normalizeOption(option);
                return (
                  <option
                    key={normalizedOption.value || index}
                    value={normalizedOption.value}
                    disabled={normalizedOption.disabled}
                  >
                    {normalizedOption.label}
                  </option>
                );
              })}
            </select>

            {/* Icono de dropdown personalizado (solo para select simple) */}
            {!multiple && (
              <ChevronDownIcon
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
            )}
          </div>
        );
      }

      if (isTextarea) {
        return (
          <textarea
            ref={ref}
            id={inputId}
            name={name}
            placeholder={placeholder}
            className={cn(
              baseStyles,
              children && 'pr-10', // Espacio para elementos adicionales
              className
            )}
            {...props}
          />
        );
      }

      // Input normal
      return (
        <input
          ref={ref}
          type={type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          required={required}
          className={cn(
            baseStyles,
            'h-10', // Altura consistente
            children && 'pr-10', // Espacio para elementos adicionales
            className
          )}
          {...props}
        />
      );
    };

    return (
      <div className={cn('mb-4', span && spanClasses[span], containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2',
              labelClassName
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {renderField()}

          {/* Icon (solo para inputs y textareas, no para select) */}
          {/*IconComponent && !isSelect && (  Opción para no select*/}
          {IconComponent && (
            <IconComponent
              className={cn(
                'absolute left-3',
                isTextarea ? 'top-3' : 'top-1/2 -translate-y-1/2',
                'h-4 w-4 text-gray-400',
                error && 'text-red-400',
                iconClassName
              )}
            />
          )}

          {/* Elementos adicionales (ej: botones) - no para select */}
          {children && !isSelect && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{children}</div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}

        {/* Helper text */}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
