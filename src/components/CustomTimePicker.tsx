import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown } from 'lucide-react';

interface CustomTimePickerProps {
  label: string;
  value?: string;
  onChange: (val: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i === 0 ? 12 : i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const PERIODS = ['AM', 'PM'];

export const CustomTimePicker = ({ label, value, onChange }: CustomTimePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const defaultH = String(now.getHours() % 12 || 12).padStart(2, '0');
  const defaultM = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
  const defaultP = now.getHours() >= 12 ? 'PM' : 'AM';

  const parts = value ? value.split(/[: ]/) : [defaultH, defaultM, defaultP];
  const hour = parts[0] || defaultH;
  const minute = parts[1] || defaultM;
  const period = parts[2] || defaultP;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const apply = (h: string, m: string, p: string) => onChange(`${h}:${m} ${p}`);

  return (
    <div className="relative space-y-1.5" ref={containerRef}>
      <label
        className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
        style={{ color: 'var(--text-muted)' }}
      >
        <Clock size={10} /> {label}
      </label>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200 cursor-pointer"
        style={{
          background: 'var(--bg-surface)',
          border: isOpen ? '1px solid var(--brand)' : '1px solid var(--border-default)',
          color: value ? 'var(--text-primary)' : 'var(--text-disabled)',
          boxShadow: isOpen ? '0 0 0 3px rgba(99,102,241,0.2)' : 'none',
        }}
      >
        <span>{value || 'Select time'}</span>
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
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--border-hover)',
              boxShadow: '0 20px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex">
              {/* Hours */}
              <div className="flex-1 overflow-y-auto no-scrollbar max-h-44 py-1">
                {HOURS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => apply(h, minute, period)}
                    className="w-full text-center py-2 text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      background: hour === h ? 'rgba(99,102,241,0.2)' : 'transparent',
                      color: hour === h ? '#818CF8' : 'var(--text-secondary)',
                      fontWeight: hour === h ? '700' : '500',
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ borderLeft: '1px solid var(--border-default)' }} />

              {/* Minutes */}
              <div className="flex-1 overflow-y-auto no-scrollbar max-h-44 py-1">
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => apply(hour, m, period)}
                    className="w-full text-center py-2 text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      background: minute === m ? 'rgba(99,102,241,0.2)' : 'transparent',
                      color: minute === m ? '#818CF8' : 'var(--text-secondary)',
                      fontWeight: minute === m ? '700' : '500',
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div style={{ borderLeft: '1px solid var(--border-default)' }} />

              {/* AM/PM */}
              <div className="flex flex-col py-1 min-w-[52px]">
                {PERIODS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      apply(hour, minute, p);
                      setIsOpen(false);
                    }}
                    className="flex-1 text-center text-xs font-bold transition-colors cursor-pointer"
                    style={{
                      background: period === p ? 'rgba(99,102,241,0.25)' : 'transparent',
                      color: period === p ? '#818CF8' : 'var(--text-muted)',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
