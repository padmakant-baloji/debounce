import React from 'react';
import { clsx } from 'clsx';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface AnimatedCardProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

export function AnimatedCard({
  title,
  icon: Icon,
  children,
  className,
  variant = 'default'
}: AnimatedCardProps) {
  const variantStyles = {
    default: "bg-white hover:shadow-abbyy",
    success: "bg-green-50 hover:shadow-green-lg",
    warning: "bg-yellow-50 hover:shadow-yellow-lg",
    error: "bg-red-50 hover:shadow-red-lg"
  };

  return (
    <div 
      className={clsx(
        "rounded-lg p-6 transition-all duration-300",
        "transform hover:-translate-y-1",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className="relative">
            <Icon className={clsx(
              "w-6 h-6",
              variant === 'success' && "text-green-600",
              variant === 'warning' && "text-yellow-600",
              variant === 'error' && "text-red-600",
              variant === 'default' && "text-abbyy-primary"
            )} />
            <div className="absolute inset-0 animate-pulse-ring rounded-full bg-current opacity-25" />
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="animate-fade-in-up">
        {children}
      </div>
    </div>
  );
}