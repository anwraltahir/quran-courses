import React, { ButtonHTMLAttributes, InputHTMLAttributes, useState } from 'react';
import { BookOpen, Settings } from 'lucide-react';

// --- LOGO COMPONENT ---
export const Logo: React.FC<{ className?: string, size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive' }> = ({ className = '', size = 'md' }) => {
  const [error, setError] = useState(false);

  const sizes = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
    // Requirement: max-height 50px on mobile, 70px on desktop
    responsive: 'h-[50px] md:h-[70px]',
  };
  
  // Default to md if invalid size passed
  const heightClass = sizes[size as keyof typeof sizes] || sizes.md;

  // Robustly resolve the logo path. 
  // 1. Try using import.meta.url (standard ESM) to resolve relative to this file.
  // 2. Fallback to a simple relative path 'assets/...' which works if the app root is served correctly.
  let logo = 'assets/logo_transparent.png';
  try {
    if (import.meta && import.meta.url) {
       logo = new URL('../assets/logo_transparent.png', import.meta.url).href;
    }
  } catch (e) {
    // Fallback silently if URL construction fails (e.g. invalid import.meta.url in some environments)
  }

  if (error) {
    return (
      <div className={`inline-flex items-center justify-center bg-primary-50 text-primary-700 font-bold rounded border border-primary-200 px-4 ${heightClass} ${className}`}>
        <span className="text-xs md:text-sm whitespace-nowrap">المنصة القرآنية</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${heightClass} ${className}`}>
      {/* 
         - Uses resolved URL or fallback path
         - h-full w-auto preserves aspect ratio.
         - object-contain ensures the image fits within the height constraints.
      */}
      <img 
        src={logo} 
        alt="المنصة القرآنية" 
        className="h-full w-auto object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
};

// --- BUTTON ---
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}
export const Button: React.FC<ButtonProps> = ({ className = '', variant = 'primary', size = 'md', ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary-700 text-white hover:bg-primary-800 shadow-sm",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "hover:bg-slate-100 text-slate-700",
    outline: "border border-slate-200 hover:bg-slate-100 text-slate-900"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg"
  };

  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

// --- INPUT ---
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input 
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props} 
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// --- SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
}
export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select 
      className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${className}`}
      {...props}
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// --- CARD ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; action?: React.ReactNode }> = ({ children, className = '', title, action }) => (
  <div className={`rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm ${className}`}>
    {(title || action) && (
      <div className="flex flex-col space-y-1.5 p-6 border-b border-slate-100">
        <div className="flex items-center justify-between">
          {title && <h3 className="font-semibold leading-none tracking-tight text-lg">{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      </div>
    )}
    <div className="p-6 pt-4">{children}</div>
  </div>
);

// --- BADGE ---
export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'primary' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    neutral: 'bg-slate-100 text-slate-700',
    primary: 'bg-primary-50 text-primary-700',
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[variant]}`}>{children}</span>;
}

// --- TABLE ---
export const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="w-full overflow-auto rounded-lg border border-slate-200">
    <table className="w-full text-sm text-right">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          {headers.map((h, i) => (
            <th key={i} className="h-12 px-4 align-middle font-medium text-slate-500">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {children}
      </tbody>
    </table>
  </div>
);