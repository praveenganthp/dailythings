import type { InputHTMLAttributes } from 'react';
import { containsHtml } from '../../utils/sanitize';
import { AlertCircle } from 'lucide-react';

interface SecureInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMsg?: string;
}

export const SecureInput = ({ errorMsg, className = '', onChange, ...props }: SecureInputProps) => {
  // Check if current value contains HTML
  const valueStr = String(props.value || '');
  const isInvalidHtml = containsHtml(valueStr);
  
  const displayError = errorMsg || (isInvalidHtml ? "HTML tags are not allowed." : undefined);
  const isError = !!displayError;

  let borderClass = 'border-[rgba(255,255,255,0.1)]';
  let focusRing = 'focus:ring-[rgba(99,102,241,0.4)] focus:border-[#818CF8]';

  if (isError) {
    borderClass = 'border-[#EF4444]';
    focusRing = 'focus:ring-[rgba(239,68,68,0.4)] focus:border-[#F87171]';
  }

  return (
    <div className="w-full relative">
      <input
        className={`w-full bg-[rgba(15,23,42,0.4)] text-[#F8FAFC] placeholder-[#64748B] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 border ${borderClass} focus:ring-2 ${focusRing} ${className}`}
        onChange={onChange}
        {...props}
      />
      {displayError && (
        <div className="flex items-center gap-1.5 mt-1.5 px-1 absolute -bottom-5 left-0">
          <AlertCircle size={12} className="text-[#EF4444]" />
          <span className="text-[10px] text-[#EF4444] font-semibold tracking-wide shadow-sm">
            {displayError}
          </span>
        </div>
      )}
    </div>
  );
};
