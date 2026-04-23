import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface DatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({ label, value, onChange, className, disabled }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [viewDate, setViewDate] = useState(new Date(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, ' ');
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  
  const days = [];
  // Dummy days for padding
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
  }

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="text-body font-medium text-ship-cove dark:text-selago">
          {label}
        </label>
      )}
      
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-white dark:bg-sidebar border rounded-[4px] px-5 py-4 text-heading-s flex justify-between items-center transition-all focus:outline-none",
          "text-vulcan dark:text-white border-selago dark:border-ebony-clay hover:border-primary disabled:opacity-50",
          isOpen && "border-primary"
        )}
      >
        <span>{formatDate(value)}</span>
        <CalendarIcon className="w-4 h-4 text-ship-cove" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 p-6 bg-white dark:bg-ebony-clay rounded-lg shadow-[0_10px_20px_rgba(72,84,159,0.25)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.25)] z-[100] border border-selago dark:border-ebony-clay"
          >
            <div className="flex justify-between items-center mb-8">
              <button onClick={() => changeMonth(-1)} type="button">
                <ChevronLeft className="w-4 h-4 text-primary hover:opacity-70" />
              </button>
              <span className="text-heading-s text-vulcan dark:text-white capitalize">
                {viewDate.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
              </span>
              <button onClick={() => changeMonth(1)} type="button">
                <ChevronRight className="w-4 h-4 text-primary hover:opacity-70" />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-y-4">
              {days.map((date, index) => (
                <div key={index} className="flex justify-center">
                  {date ? (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(date);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-5 h-5 flex items-center justify-center text-heading-s transition-colors rounded-sm",
                        date.toDateString() === value.toDateString() ? "text-primary" : "text-vulcan dark:text-white hover:text-primary dark:hover:text-primary",
                        date.toDateString() === new Date().toDateString() && ! (date.toDateString() === value.toDateString()) && "font-bold"
                      )}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <div className="w-5 h-5" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
