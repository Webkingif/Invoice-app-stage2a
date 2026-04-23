import { useInvoices } from '../../context/InvoiceContext';
import { ChevronLeft } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { motion } from 'motion/react';
import { useState } from 'react';
import {useTheme} from "../../context/ThemeContext";

export function InvoiceDetailView() {
  const {theme} = useTheme();
  const { selectedInvoice, setSelectedInvoiceId, deleteInvoice, markAsPaid, setIsInvoiceFormOpen, setIsEditing } = useInvoices();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!selectedInvoice) return null;

  const handleEdit = () => {
    setIsEditing(true);
    setIsInvoiceFormOpen(true);
  };

  const handleDelete = () => {
    deleteInvoice(selectedInvoice.id);
    setSelectedInvoiceId(null);
    setIsDeleteModalOpen(false);
  };

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
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="pb-32 md:pb-0"
    >
      {/* Back Button */}
      <button 
        onClick={() => setSelectedInvoiceId(null)}
        className="flex items-center gap-6 mb-8 group hover:text-primary transition-colors text-main font-bold text-heading-s"
      >
        <ChevronLeft className="w-4 h-4 text-primary group-hover:text-primary-light" strokeWidth={4} />
        Go back
      </button>

      {/* Action Bar */}
      <div className="bg-card p-6 md:px-8 py-5 rounded-lg shadow-sm flex items-center justify-between mb-6 border border-transparent">
        <div className="flex items-center justify-between w-full md:w-auto md:gap-4">
          <span className="text-body text-bali-hai">Status</span>
          <StatusBadge status={selectedInvoice.status} />
        </div>

        {/* Buttons - Hidden on Mobile, shown in fixed bottom bar on mobile */}
        <div className="hidden md:flex gap-2">
          <Button variant={3} onClick={handleEdit}>Edit</Button>
          <Button variant={5} onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
          {selectedInvoice.status === 'pending' && (
            <Button variant={2} onClick={() => markAsPaid(selectedInvoice.id)}>Mark as Paid</Button>
          )}
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-card p-6 md:p-12 rounded-lg shadow-sm border border-transparent">
        {/* Header Info */}
        <div className="flex flex-col md:flex-row justify-between mb-8 md:mb-12 gap-8 md:gap-0">
          <div>
            <h2 className="text-heading-s md:text-heading-m text-main mb-1">
              <span className="text-bali-hai">#</span>{selectedInvoice.id}
            </h2>
            <p className="text-body text-secondary">{selectedInvoice.description}</p>
          </div>
          <div className="text-body text-secondary md:text-right">
            <p>{selectedInvoice.senderAddress.street}</p>
            <p>{selectedInvoice.senderAddress.city}</p>
            <p>{selectedInvoice.senderAddress.postCode}</p>
            <p>{selectedInvoice.senderAddress.country}</p>
          </div>
        </div>

        {/* Mid Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 md:mb-12">
          {/* Column 1: Dates */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-body text-secondary mb-3">Invoice Date</p>
              <p className="text-heading-s md:text-heading-m text-main">{formatDate(selectedInvoice.createdAt)}</p>
            </div>
            <div>
              <p className="text-body text-secondary mb-3">Payment Due</p>
              <p className="text-heading-s md:text-heading-m text-main">{formatDate(selectedInvoice.paymentDue)}</p>
            </div>
          </div>

          {/* Column 2: Bill To */}
          <div>
            <p className="text-body text-secondary mb-3">Bill To</p>
            <p className="text-heading-s md:text-heading-m text-main mb-2 capitalize">{selectedInvoice.clientName}</p>
            <div className="text-body text-secondary mt-2">
              <p>{selectedInvoice.clientAddress.street}</p>
              <p>{selectedInvoice.clientAddress.city}</p>
              <p>{selectedInvoice.clientAddress.postCode}</p>
              <p>{selectedInvoice.clientAddress.country}</p>
            </div>
          </div>

          {/* Column 3: Sent To */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-body text-secondary mb-3">Sent to</p>
            <p className="text-heading-s md:text-heading-m text-main break-all">{selectedInvoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className={`${theme == "light"? "white-background": "dark-background"} rounded-t-lg overflow-hidden`}>
          {/* Desktop Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_80px_120px_120px] px-8 pt-8 pb-4 text-body text-secondary">
            <span>Item Name</span>
            <span className="text-center">QTY.</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
          </div>

          {/* Table Items */}
          <div className="p-6 md:p-8 space-y-6 md:space-y-8">
            {selectedInvoice.items.map((item, index) => (
              <div key={index} className="grid grid-cols-2 md:grid-cols-[1fr_80px_120px_120px] items-center">
                {/* Mobile: Name & (Qty x Price) | Total */}
                <div className="md:col-start-1 md:col-end-1 flex flex-col gap-2">
                  <span className="text-heading-s text-main capitalize">{item.name}</span>
                  <span className="md:hidden text-heading-s text-secondary">
                    {item.quantity} x {formatCurrency(item.price)}
                  </span>
                </div>

                <span className="hidden md:block text-heading-s text-secondary text-center">{item.quantity}</span>
                <span className="hidden md:block text-heading-s text-secondary text-right">{formatCurrency(item.price)}</span>
                <span className="text-heading-s text-main text-right">{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>

          {/* Grand Total Footer */}
          <div className={`bg-black p-6 md:px-8 py-8 flex items-center justify-between text-white border border-transparent`}>
            <span className="text-white text-body">
              {/* Grand Total on mobile, Amount Due on desktop (matching design variant) */}
              <span className="hidden md:inline">Amount Due</span>
              <span className="md:hidden">Grand Total</span>
            </span>
            <span className="text-heading-m md:text-heading-l">{formatCurrency(selectedInvoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Mobile Action Bar (Fixed at bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-card p-6 flex justify-center gap-2 shadow-2xl border-t border-border-color z-50">
        <Button variant={3} onClick={handleEdit}>Edit</Button>
        <Button variant={5} onClick={() => setIsDeleteModalOpen(true)}>Delete</Button>
        {selectedInvoice.status === 'pending' && (
          <Button variant={2} onClick={() => markAsPaid(selectedInvoice.id)}>Mark as Paid</Button>
        )}
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        description={`Are you sure you want to delete invoice #${selectedInvoice.id}? This action cannot be undone.`}
      />
    </motion.div>
  );
}
