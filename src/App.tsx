/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/layout/Sidebar';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { InvoiceList } from './components/dashboard/InvoiceList';
import { InvoiceDetailView } from './components/dashboard/InvoiceDetailView';
import { InvoiceForm } from './components/dashboard/InvoiceForm';
import { useInvoices } from './context/InvoiceContext';

export default function App() {
  const { selectedInvoice } = useInvoices();

  return (
    <div className="min-h-screen bg-bg-app transition-colors duration-300 flex flex-col lg:flex-row">
      <Sidebar />
      <InvoiceForm />
      
      <main className="flex-1 pt-[72px] lg:pt-0 lg:pl-[103px]">
        <div className="max-w-[730px] mx-auto py-8 md:py-14 lg:py-20 px-6 md:px-12 lg:px-0">
          {!selectedInvoice ? (
            <>
              <DashboardHeader />
              <InvoiceList />
            </>
          ) : (
            <InvoiceDetailView />
          )}
        </div>
      </main>
    </div>
  );
}




