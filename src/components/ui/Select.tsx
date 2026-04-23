import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface Option<T> {
  label: string;
  value: T;
}

interface SelectProps<T> {
  label?: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Select<T extends string | number>({ label, options, value, onChange, className }: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(o => o.value === value)?.label;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("flex flex-col gap-2 w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="text-body font-medium text-ship-cove dark:text-selago">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white dark:bg-sidebar border rounded-[4px] px-5 py-4 text-heading-s flex justify-between items-center transition-all focus:outline-none",
          "text-vulcan dark:text-white border-selago dark:border-ebony-clay hover:border-primary",
          isOpen && "border-primary"
        )}
      >
        <span>{selectedLabel}</span>
        <ChevronDown 
          className={cn("w-4 h-4 text-primary transition-transform duration-200", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-ebony-clay rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] overflow-hidden z-[100] border border-selago dark:border-ebony-clay"
          >
            {options.map((option, index) => (
              <li key={option.value.toString()}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-6 py-4 text-heading-s transition-colors",
                    "text-vulcan dark:text-selago hover:text-primary dark:hover:text-primary",
                    index !== options.length - 1 && "border-bottom border-selago dark:border-ebony-clay border-b",
                    option.value === value && "text-primary dark:text-primary"
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
