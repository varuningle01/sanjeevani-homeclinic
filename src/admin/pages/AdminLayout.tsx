import { useState, type ReactNode } from "react";
import AdminSideBar from "./AdminSideBar";
import labels from "../../locales/en-us.json";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4FAFB]">
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSideBar open={open} setOpen={setOpen} />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden mb-4 inline-flex items-center gap-2 bg-white shadow-sm border border-gray-200 px-4 py-2 rounded-lg"
        >
          <span className="text-xl">☰</span>
          <span className="text-sm font-medium text-gray-700">
            {labels.admin.common.menu}
          </span>
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
