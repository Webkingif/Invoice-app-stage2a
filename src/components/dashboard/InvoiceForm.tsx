import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, ChevronLeft } from 'lucide-react';
import { useInvoices } from '../../context/InvoiceContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { DatePicker } from '../ui/DatePicker';
import { Invoice, InvoiceStatus, InvoiceItem } from '../../types';
import { cn } from '../../lib/utils';

export function InvoiceForm() {
  const { isInvoiceFormOpen, setIsInvoiceFormOpen, addInvoice, updateInvoice, isEditing, selectedInvoice } = useInvoices();
  const { theme } = useTheme();
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    senderStreet: '',
    senderCity: '',
    senderPostCode: '',
    senderCountry: '',
    clientName: '',
    clientEmail: '',
    clientStreet: '',
    clientCity: '',
    clientPostCode: '',
    clientCountry: '',
    createdAt: new Date(),
    paymentTerms: 30,
    description: '',
  });

  const formRef = useRef<HTMLDivElement>(null);

  // Populate form for editing
  useEffect(() => {
    setErrors({}); // Clear errors when form opens/toggles
    if (isEditing && selectedInvoice) {
      setFormData({
        senderStreet: selectedInvoice.senderAddress.street,
        senderCity: selectedInvoice.senderAddress.city,
        senderPostCode: selectedInvoice.senderAddress.postCode,
        senderCountry: selectedInvoice.senderAddress.country,
        clientName: selectedInvoice.clientName,
        clientEmail: selectedInvoice.clientEmail,
        clientStreet: selectedInvoice.clientAddress.street,
        clientCity: selectedInvoice.clientAddress.city,
        clientPostCode: selectedInvoice.clientAddress.postCode,
        clientCountry: selectedInvoice.clientAddress.country,
        createdAt: new Date(selectedInvoice.createdAt),
        paymentTerms: selectedInvoice.paymentTerms,
        description: selectedInvoice.description,
      });
      setItems(selectedInvoice.items);
    } else {
      // Reset to defaults for new invoice
      setFormData({
        senderStreet: '',
        senderCity: '',
        senderPostCode: '',
        senderCountry: '',
        clientName: '',
        clientEmail: '',
        clientStreet: '',
        clientCity: '',
        clientPostCode: '',
        clientCountry: '',
        createdAt: new Date(),
        paymentTerms: 30,
        description: '',
      });
      setItems([]);
    }
  }, [isEditing, selectedInvoice, isInvoiceFormOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInvoiceFormOpen(false);
    };
    if (isInvoiceFormOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isInvoiceFormOpen, setIsInvoiceFormOpen]);

  // Focus Trapping
  useEffect(() => {
    if (!isInvoiceFormOpen || !formRef.current) return;

    const focusableElements = formRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    // Initial focus
    if (firstElement) firstElement.focus();

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isInvoiceFormOpen]);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Auto-calculate total
    if (field === 'quantity' || field === 'price') {
      item.total = Number(item.quantity) * Number(item.price);
    }
    
    newItems[index] = item;
    setItems(newItems);
  };

  const generateId = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];
    const n = Math.floor(1000 + Math.random() * 9000);
    return `${l1}${l2}${n}`;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.senderStreet.trim()) newErrors.senderStreet = "can't be empty";
    if (!formData.senderCity.trim()) newErrors.senderCity = "can't be empty";
    if (!formData.senderPostCode.trim()) newErrors.senderPostCode = "can't be empty";
    if (!formData.senderCountry.trim()) newErrors.senderCountry = "can't be empty";
    if (!formData.clientName.trim()) newErrors.clientName = "can't be empty";
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "can't be empty";
    } else if (!emailRegex.test(formData.clientEmail)) {
      newErrors.clientEmail = "invalid format";
    }
    if (!formData.clientStreet.trim()) newErrors.clientStreet = "can't be empty";
    if (!formData.clientCity.trim()) newErrors.clientCity = "can't be empty";
    if (!formData.clientPostCode.trim()) newErrors.clientPostCode = "can't be empty";
    if (!formData.clientCountry.trim()) newErrors.clientCountry = "can't be empty";
    if (!formData.description.trim()) newErrors.description = "can't be empty";

    if (items.length === 0) {
      newErrors.items = "- An item must be added";
    } else {
      items.forEach((item, index) => {
        if (!item.name.trim()) newErrors[`item-${index}-name`] = "required";
        if (item.quantity <= 0) newErrors[`item-${index}-quantity`] = "!";
        if (item.price <= 0) newErrors[`item-${index}-price`] = "!";
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (status?: InvoiceStatus) => {
    // Skip validation for drafts
    if (status !== 'draft' && !validate()) {
      return;
    }
    
    const total = items.reduce((acc, item) => acc + item.total, 0);
    
    const invoiceData: Invoice = {
      id: isEditing && selectedInvoice ? selectedInvoice.id : generateId(),
      createdAt: formData.createdAt.toISOString().split('T')[0],
      paymentDue: new Date(formData.createdAt.getTime() + formData.paymentTerms * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      description: formData.description,
      paymentTerms: formData.paymentTerms,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      status: status || (isEditing && selectedInvoice?.status === 'draft' ? 'pending' : (selectedInvoice?.status || 'pending')),
      senderAddress: {
        street: formData.senderStreet,
        city: formData.senderCity,
        postCode: formData.senderPostCode,
        country: formData.senderCountry
      },
      clientAddress: {
        street: formData.clientStreet,
        city: formData.clientCity,
        postCode: formData.clientPostCode,
        country: formData.clientCountry
      },
      items: items,
      total: total
    };

    if (isEditing) {
      updateInvoice(invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    
    setIsInvoiceFormOpen(false);
  };
  return (
    <AnimatePresence>
      {isInvoiceFormOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInvoiceFormOpen(false)}
            className="fixed inset-0 bg-black/50 z-[70]"
          />

          {/* Drawer */}
          <motion.div
            ref={formRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-[72px] md:top-[80px] lg:top-0 left-0 lg:left-[103px] h-[calc(100vh-72px)] md:h-[calc(100vh-80px)] lg:h-screen w-full max-w-[719px] bg-white dark:bg-rich-black z-[80] shadow-2xl flex flex-col transition-colors duration-300 lg:rounded-r-[20px] overflow-hidden"
          >
            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto px-6 py-8 md:px-14 md:py-14 scrollbar-hide ${theme=='light'? "white-background": "dark-background"}`}>
              <button 
                onClick={() => setIsInvoiceFormOpen(false)}
                className="lg:hidden flex items-center gap-6 mb-6 text-main font-bold text-heading-s group hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-primary" strokeWidth={4} />
                Go back
              </button>

              <h1 className="text-heading-m md:text-heading-l text-main mb-12">
                {isEditing ? (
                  <>Edit <span className="text-[#888EB0]">#</span>{selectedInvoice?.id}</>
                ) : (
                  'New Invoice'
                )}
              </h1>

              <form className="space-y-12 pb-20">
                {/* Bill From */}
                <section>
                  <h3 className="text-heading-s text-primary mb-6">Bill From</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <Input 
                      label="Street Address" 
                      value={formData.senderStreet}
                      onChange={(e) => setFormData({...formData, senderStreet: e.target.value})}
                      error={errors.senderStreet}
                      className="col-span-full"
                    />
                    <Input 
                      label="City" 
                      value={formData.senderCity}
                      onChange={(e) => setFormData({...formData, senderCity: e.target.value})}
                      error={errors.senderCity}
                      className="col-span-1"
                    />
                    <Input 
                      label="Post Code" 
                      value={formData.senderPostCode}
                      onChange={(e) => setFormData({...formData, senderPostCode: e.target.value})}
                      error={errors.senderPostCode}
                      className="col-span-1"
                    />
                    <Input 
                      label="Country" 
                      value={formData.senderCountry}
                      onChange={(e) => setFormData({...formData, senderCountry: e.target.value})}
                      error={errors.senderCountry}
                      className="col-span-full md:col-span-1"
                    />
                  </div>
                </section>

                {/* Bill To */}
                <section>
                  <h3 className="text-heading-s text-primary mb-6">Bill To</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <Input 
                      label="Client's Name" 
                      value={formData.clientName}
                      onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                      error={errors.clientName}
                      className="col-span-full"
                    />
                    <Input 
                      label="Client's Email" 
                      placeholder="e.g. email@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                      error={errors.clientEmail}
                      className="col-span-full"
                    />
                    <Input 
                      label="Street Address" 
                      value={formData.clientStreet}
                      onChange={(e) => setFormData({...formData, clientStreet: e.target.value})}
                      error={errors.clientStreet}
                      className="col-span-full"
                    />
                    <Input 
                      label="City" 
                      value={formData.clientCity}
                      onChange={(e) => setFormData({...formData, clientCity: e.target.value})}
                      error={errors.clientCity}
                      className="col-span-1"
                    />
                    <Input 
                      label="Post Code" 
                      value={formData.clientPostCode}
                      onChange={(e) => setFormData({...formData, clientPostCode: e.target.value})}
                      error={errors.clientPostCode}
                      className="col-span-1"
                    />
                    <Input 
                      label="Country" 
                      value={formData.clientCountry}
                      onChange={(e) => setFormData({...formData, clientCountry: e.target.value})}
                      error={errors.clientCountry}
                      className="col-span-full md:col-span-1"
                    />
                  </div>
                </section>

                {/* Dates & Terms */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <DatePicker 
                    label="Invoice Date"
                    value={formData.createdAt}
                    onChange={(date) => setFormData({...formData, createdAt: date})}
                  />
                  <Select 
                    label="Payment Terms"
                    options={[
                      { label: 'Net 1 Day', value: 1 },
                      { label: 'Net 7 Days', value: 7 },
                      { label: 'Net 14 Days', value: 14 },
                      { label: 'Net 30 Days', value: 30 },
                    ]}
                    value={formData.paymentTerms}
                    onChange={(val) => setFormData({...formData, paymentTerms: val as number})}
                  />
                  <Input 
                    label="Project Description"
                    placeholder="e.g. Graphic Design Service"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    error={errors.description}
                    className="col-span-full"
                  />
                </section>

                {/* Item List */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[18px] font-bold text-[#777F98]">Item List</h2>
                    {errors.items && <span className="text-body-variant font-semibold text-burnt-sienna">{errors.items}</span>}
                  </div>
                  <div className="space-y-4">
                    {/* Desktop Headers */}
                    <div className="hidden md:grid grid-cols-[1fr_46px_100px_60px_20px] gap-4 mb-4 text-[#7E88C3] dark:text-selago">
                      <span className="text-body font-medium">Item Name</span>
                      <span className="text-body font-medium">Qty.</span>
                      <span className="text-body font-medium">Price</span>
                      <span className="text-body font-medium">Total</span>
                      <span></span>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="grid grid-cols-[64px_100px_1fr_40px] md:grid-cols-[1fr_46px_100px_60px_20px] gap-4 items-end">
                        <Input 
                          label="Item Name"
                          labelClassName="md:hidden"
                          value={item.name}
                          onChange={(e) => updateItem(index, 'name', e.target.value)}
                          error={errors[`item-${index}-name`]}
                          className="col-span-full md:col-span-1"
                        />
                        <Input 
                          label="Qty."
                          labelClassName="md:hidden"
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          error={errors[`item-${index}-quantity`]}
                          className="col-span-1"
                        />
                        <Input 
                          label="Price"
                          labelClassName="md:hidden"
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                          error={errors[`item-${index}-price`]}
                          className="col-span-1"
                        />
                        <div className="flex flex-col gap-2">
                          <label className="text-body font-medium text-ship-cove dark:text-selago md:hidden">Total</label>
                          <span className="text-heading-s text-secondary h-[48px] flex items-center md:h-auto md:py-4">
                            {item.total.toFixed(2)}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeItem(index)}
                          className="h-[48px] md:h-[56px] flex items-center justify-center text-secondary hover:text-burnt-sienna transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <Button 
                      variant={6} 
                      onClick={addItem}
                      className="w-full mt-4"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add New Item
                    </Button>
                  </div>
                </section>
              </form>
            </div>

            {/* Footer Actions */}
            <div className={cn(
              "p-6 md:px-14 py-8 bg-white dark:bg-rich-black flex items-center z-[80] transition-colors duration-300",
              isEditing ? "justify-end gap-2" : "justify-between"
            )}>
              {isEditing ? (
                <>
                  <Button 
                    variant={3} 
                    onClick={() => setIsInvoiceFormOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant={2} 
                    onClick={() => handleSubmit()}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant={3} 
                    onClick={() => setIsInvoiceFormOpen(false)}
                  >
                    Discard
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant={4} 
                      onClick={() => handleSubmit('draft')}
                    >
                      Save as Draft
                    </Button>
                    <Button 
                      variant={2} 
                      onClick={() => handleSubmit('pending')}
                    >
                      Save & Send
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
