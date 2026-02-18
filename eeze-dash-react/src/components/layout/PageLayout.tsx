import type { ReactNode } from 'react';

interface PageLayoutProps {
  sidebarOpen: boolean;
  children: ReactNode;
}

export default function PageLayout({ sidebarOpen, children }: PageLayoutProps) {
  return (
    <div
      className="transition-all duration-400 ease-in-out min-h-screen"
      style={{ paddingLeft: sidebarOpen ? 250 : 70 }}
    >
      <div className="p-4">{children}</div>
    </div>
  );
}
