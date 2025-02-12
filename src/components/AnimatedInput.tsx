import React from 'react';
import { clsx } from 'clsx';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  error?: string;
}

export function AnimatedInput({
  icon: Icon,
  label,
  error,
  className,
  ...props
}: AnimatedInputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-abbyy-gray-700 animate-fade-in-up">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-abbyy-gray-400 transition-transform duration-300 group-focus-within:scale-110">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          className={clsx(
            "w-full px-4 py-2 rounded-lg border border-abbyy-gray-200",
            "focus:ring-2 focus:ring-abbyy-primary focus:ring-opacity-50 focus:border-abbyy-primary",
            "transition-all duration-300 ease-in-out",
            "placeholder:text-abbyy-gray-400",
            Icon && "pl-10",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 animate-fade-in-up">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}