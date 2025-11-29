import { useState, type ReactNode } from "react";
import AdminSideBar from "./AdminSideBar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSideBar open={open} setOpen={setOpen} />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        {/* Mobile top bar */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden mb-4 inline-flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg shadow"
        >
          <span className="text-xl">☰</span>
          <span className="text-sm font-medium">Menu</span>
        </button>

        {children}
      </main>
    </div>
  );
}
