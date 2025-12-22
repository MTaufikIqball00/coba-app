import React from "react";

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageHeader({ children, className = "" }: PageHeaderProps) {
  return (
    <div
      className={`w-full rounded-md shadow-md bg-gradient-to-r from-brand-primary to-brand-secondary px-8 py-5 flex items-center justify-between ${className}`}
    >
      {children}
    </div>
  );
}
