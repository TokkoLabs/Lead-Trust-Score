import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">Lead Trust</h1>
          <p className="text-xs text-gray-400 mt-1">Copilot</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <a
                href="/"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800 text-white font-medium text-sm"
              >
                <span>Leads</span>
              </a>
            </li>
            <li>
              <a
                href="/config"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white text-sm transition-colors"
              >
                <span>Config</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main area */}
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
