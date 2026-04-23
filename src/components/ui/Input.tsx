import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/src/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, labelClassName, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          {label && (
            <label 
              htmlFor={id} 
              className={cn(
                "text-body font-medium transition-colors",
                error ? "text-burnt-sienna" : "text-color-main",
                labelClassName
              )}
            >
              {label}
            </label>
          )}
          {error && <span className="text-body-variant font-semibold text-burnt-sienna">{error}</span>}
        </div>
        <input
          id={id}
          ref={ref}
          className={cn(
            "w-full bg-white dark:bg-sidebar border rounded-[4px] px-5 py-4 text-heading-s transition-all focus:outline-none",
            "text-vulcan dark:text-white caret-primary focus:border-primary",
            error ? "border-burnt-sienna" : "border-selago dark:border-ebony-clay",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
