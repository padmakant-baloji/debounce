import React from 'react';
import { clsx } from 'clsx';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  isLoading?: boolean;
}

export function AnimatedButton({
  children,
  icon: Icon,
  variant = 'primary',
  isLoading,
  className,
  ...props
}: AnimatedButtonProps) {
  const baseStyles = "flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md";
  
  const variantStyles = {
    primary: "bg-abbyy-primary text-white hover:bg-abbyy-secondary",
    secondary: "bg-abbyy-gray-100 text-abbyy-gray-800 hover:bg-abbyy-gray-200",
    success: "bg-green-600 text-white hover:bg-green-700",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        isLoading && "opacity-75 cursor-not-allowed",
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
      ) : Icon && (
        <Icon className={clsx(
          "w-5 h-5",
          props.onClick && "group-hover:animate-bounce"
        )} />
      )}
      {children}
    </button>
  );
}