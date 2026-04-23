import { useInvoices } from '../../context/InvoiceContext';
import { InvoiceCard } from './InvoiceCard';
import { motion, AnimatePresence } from 'motion/react';

export function InvoiceList() {
  const { filteredInvoices } = useInvoices();

  if (filteredInvoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <img 
          src="https://raw.githubusercontent.com/fems/invoice-app/main/src/assets/illustration-empty.svg" 
          alt="No invoices" 
          className="mb-10 w-[193px] md:w-[242px] h-auto"
          onError={(e) => {
            // Fallback if image fails - show a placeholder or hide
            e.currentTarget.style.display = 'none';
          }}
        />
        <h2 className="text-heading-m text-main mb-6">There is nothing here</h2>
        <p className="text-body text-secondary max-w-[220px] mx-auto leading-relaxed">
          Create an invoice by clicking the <br className="hidden md:block" />
          <strong className="font-bold">New Invoice</strong> button and get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {filteredInvoices.map((invoice) => (
          <motion.div
            key={invoice.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
          >
            <InvoiceCard invoice={invoice} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
