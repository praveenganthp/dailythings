import type { TextareaHTMLAttributes } from 'react';

interface AtomInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  isSuccess?: boolean;
}

export const AtomInput = ({ isError, isSuccess, className = '', ...props }: AtomInputProps) => {
  // Dynamic tailwind borders
  let borderClass = 'border-[rgba(255,255,255,0.1)]';
  let focusRing = 'focus:ring-[rgba(99,102,241,0.4)] focus:border-[#818CF8]';

  if (isError) {
    borderClass = 'border-[#EF4444]';
    focusRing = 'focus:ring-[rgba(239,68,68,0.4)] focus:border-[#F87171]';
  } else if (isSuccess) {
    borderClass = 'border-[#22C55E]';
    focusRing = 'focus:ring-[rgba(34,197,94,0.4)] focus:border-[#4ADE80]';
  }

  return (
    <textarea
      className={`w-full bg-[rgba(15,23,42,0.4)] text-[#F8FAFC] placeholder-[#64748B] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 border ${borderClass} focus:ring-2 ${focusRing} resize-none no-scrollbar ${className}`}
      {...props}
    />
  );
};
