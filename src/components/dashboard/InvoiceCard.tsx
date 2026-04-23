import { ChevronRight } from 'lucide-react';
import { Invoice } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { useInvoices } from '../../context/InvoiceContext';

export function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const { setSelectedInvoiceId } = useInvoices();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={() => setSelectedInvoiceId(invoice.id)}
      className="bg-card p-6 md:px-8 md:py-4 rounded-lg shadow-sm border border-transparent hover:border-[#7c5dfa] transition-all cursor-pointer grid grid-cols-2 md:grid-cols-[80px_130px_1fr_120px_104px_20px] items-center gap-4 group"
    >
      {/* ID */}
      <span className="text-heading-s text-main md:order-1">
        <span className="text-secondary">#</span>{invoice.id}
      </span>

      {/* Client Name (Mobile: top right, Desktop: order 3) */}
      <span className="text-body text-secondary md:text-main text-right md:text-left md:order-3 truncate capitalize">
        {invoice.clientName}
      </span>

      {/* Due Date */}
      <span className="text-body text-secondary md:order-2">
        Due {formatDate(invoice.paymentDue)}
      </span>

      {/* Total */}
      <span className="text-heading-s md:text-heading-m text-main md:order-4 text-left md:text-right">
        {formatCurrency(invoice.total)}
      </span>

      {/* Status Badge */}
      <div className="flex justify-end md:order-5">
        <StatusBadge status={invoice.status} />
      </div>

      {/* Arrow (Hidden on Mobile) */}
      <div className="hidden md:flex justify-end md:order-6">
        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
