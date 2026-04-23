import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Invoice, InvoiceStatus } from '../types';
import mockData from '../data/mockData.json';

interface InvoiceContextType {
  invoices: Invoice[];
  filteredInvoices: Invoice[];
  selectedInvoice: Invoice | null;
  setSelectedInvoiceId: (id: string | null) => void;
  isInvoiceFormOpen: boolean;
  setIsInvoiceFormOpen: (isOpen: boolean) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  filterStatus: InvoiceStatus[];
  setFilterStatus: (status: InvoiceStatus[]) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('invoice-app-data');
    return saved ? JSON.parse(saved) : (mockData as Invoice[]);
  });

  const [filterStatus, setFilterStatus] = useState<InvoiceStatus[]>(() => {
    const saved = localStorage.getItem('invoice-app-filters');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(() => {
    return localStorage.getItem('invoice-app-selected-id');
  });

  const [isInvoiceFormOpen, setIsInvoiceFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('invoice-app-data', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('invoice-app-filters', JSON.stringify(filterStatus));
  }, [filterStatus]);

  useEffect(() => {
    if (selectedInvoiceId) {
      localStorage.setItem('invoice-app-selected-id', selectedInvoiceId);
    } else {
      localStorage.removeItem('invoice-app-selected-id');
    }
  }, [selectedInvoiceId]);

  const selectedInvoice = useMemo(() => {
    return invoices.find(inv => inv.id === selectedInvoiceId) || null;
  }, [invoices, selectedInvoiceId]);

  const filteredInvoices = useMemo(() => {
    if (filterStatus.length === 0) return invoices;
    return invoices.filter(invoice => filterStatus.includes(invoice.status));
  }, [invoices, filterStatus]);

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  };

  const markAsPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === id ? { ...inv, status: 'paid' as InvoiceStatus } : inv
    ));
  };

  return (
    <InvoiceContext.Provider value={{ 
      invoices, 
      filteredInvoices, 
      selectedInvoice,
      setSelectedInvoiceId,
      isInvoiceFormOpen,
      setIsInvoiceFormOpen,
      isEditing,
      setIsEditing,
      filterStatus, 
      setFilterStatus,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      markAsPaid
    }}>
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
