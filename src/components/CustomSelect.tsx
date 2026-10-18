import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface CustomSelectProps<T extends string = string> {
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: SelectOption<T>[];
  onChange: (val: T) => void;
}

export const CustomSelect = <T extends string = string>({
  label,
  icon,
  value,
  options,
  onChange,
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selected = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <label
        className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
        style={{ color: 'var(--text-muted)' }}
      >
        {icon} {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer"
        style={{
          background: 'var(--bg-surface)',
          border: isOpen ? '1px solid var(--brand)' : '1px solid rgba(148,163,184,0.15)',
          color: 'var(--text-primary)',
          boxShadow: isOpen ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
        }}
      >
        <span>{selected?.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-xl overflow-hidden"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid rgba(148,163,184,0.15)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  background: value === opt.value ? 'rgba(99,102,241,0.15)' : 'transparent',
                  color: value === opt.value ? '#818CF8' : 'var(--text-secondary)',
                  borderLeft: value === opt.value ? '2px solid var(--brand)' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  if (value !== opt.value) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
