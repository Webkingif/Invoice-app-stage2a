import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { useInvoices } from '../../context/InvoiceContext';
import { InvoiceStatus } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
// import {useContext} from "react";
import {useTheme} from "../../context/ThemeContext";

export function DashboardHeader() {
  const { filteredInvoices, filterStatus, setFilterStatus, setIsInvoiceFormOpen, setIsEditing } = useInvoices();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleStatus = (status: InvoiceStatus) => {
    if (filterStatus.includes(status)) {
      setFilterStatus(filterStatus.filter(s => s !== status));
    } else {
      setFilterStatus([...filterStatus, status]);
    }
  };

  const statuses: InvoiceStatus[] = ['draft', 'pending', 'paid'];
  const themes = useTheme();

  return (
    <header className="flex justify-between items-center mb-8 lg:mb-16">
      <div>
        <h1 className="text-heading-m md:text-heading-l text-main">Invoices</h1>
        <p className="text-body text-secondary mt-1">
          {filteredInvoices.length === 0 ? (
            "No invoices"
          ) : (
            <>
              <span className="hidden md:inline">There are </span>
              {filteredInvoices.length} 
              <span className="hidden md:inline"> total</span> invoices
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-10">
        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-3 md:gap-4 group"
          >
            <span className="text-heading-s text-main">
              Filter <span className="hidden md:inline">by status</span>
            </span>
            <ChevronDown 
              className={cn(
                "w-3 h-3 text-primary transition-transform duration-200",
                isFilterOpen && "rotate-180"
              )} 
            />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute top-full right-1/2 translate-x-1/2 mt-6 p-6 ${themes.theme=='light'? "white-background": "dark-background"} border border-transparent rounded-lg shadow-xl w-[192px] z-50 transition-colors`}
              >
                <div className="space-y-4">
                  {statuses.map(status => (
                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox"
                          className="sr-only"
                          checked={filterStatus.includes(status)}
                          onChange={() => toggleStatus(status)}
                        />
                        <div className={cn(
                          "w-4 h-4 rounded-sm border border-primary transition-all group-hover:border-primary-light flex items-center justify-center",
                          filterStatus.includes(status) ? "bg-primary" : "bg-selago dark:bg-sidebar"
                        )}>
                          {filterStatus.includes(status) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4.5L3.5 6.5L8.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-heading-s text-main capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New Invoice Button */}
        <button 
          onClick={() => {
            setIsEditing(false);
            setIsInvoiceFormOpen(true);
          }}
          className="bg-primary hover:bg-[#9277ff] transition-colors text-white pl-2 pr-4 py-2 rounded-full flex items-center gap-2 md:gap-4 group"
        >
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-white/90 transition-colors">
            <Plus className="w-4 h-4 text-primary" strokeWidth={4} />
          </span>
          <span className="text-heading-s text-white">
            New <span className="hidden md:inline">Invoice</span>
          </span>
        </button>
      </div>
    </header>
  );
}
