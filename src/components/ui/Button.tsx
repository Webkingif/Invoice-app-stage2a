import { ReactNode, forwardRef } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils'; // I'll create this helper next

interface ButtonProps {
  children: ReactNode;
  variant: 1 | 2 | 3 | 4 | 5 | 6;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant, 
  onClick, 
  className, 
  type = 'button',
  disabled = false 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full text-heading-s-variant transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    1: "bg-primary text-white pl-2 pr-4 py-2 hover:bg-primary-light gap-4",
    2: "bg-primary text-white px-6 py-4 hover:bg-primary-light",
    3: "bg-ghost-white text-ship-cove hover:bg-selago dark:bg-white dark:text-ship-cove dark:hover:bg-white px-6 py-4",
    4: "bg-ebony-clay text-bali-hai hover:bg-vulcan dark:bg-[#373B53] dark:text-bali-hai dark:hover:bg-vulcan px-6 py-4",
    5: "bg-burnt-sienna text-white px-6 py-4 hover:bg-mona-lisa",
    6: "bg-ghost-white text-bali-hai hover:bg-selago dark:bg-ebony-clay dark:text-bali-hai dark:hover:bg-selago px-6 py-4 w-full",
  };

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
    >
      {variant === 1 && (
        <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <Plus className="w-4 h-4 text-primary" strokeWidth={4} />
        </span>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
