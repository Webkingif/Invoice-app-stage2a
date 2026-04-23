import { InvoiceStatus } from '../../types';
import { cn } from '../../lib/utils';

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const styles = {
    paid: "bg-[#33d69f]/10 text-[#33d69f]",
    pending: "bg-[#ff8f00]/10 text-[#ff8f00]",
    draft: "bg-ebony-clay/10 text-ebony-clay dark:bg-selago/10 dark:text-selago"
  };

  const dotStyles = {
    paid: "bg-[#33d69f]",
    pending: "bg-[#ff8f00]",
    draft: "bg-ebony-clay dark:bg-selago"
  };

  return (
    <div className={cn(
      "w-[104px] py-3 rounded-md flex items-center justify-center gap-2",
      styles[status]
    )}>
      <div className={cn("w-2 h-2 rounded-full", dotStyles[status])} />
      <span className="text-heading-s capitalize">{status}</span>
    </div>
  );
}
