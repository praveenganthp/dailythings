import type { TextareaHTMLAttributes } from 'react';
import { containsHtml } from '../../utils/sanitize';
import { AlertCircle } from 'lucide-react';

interface SecureTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  errorMsg?: string;
  isSuccess?: boolean;
}

export const SecureTextarea = ({ errorMsg, isSuccess, className = '', onChange, ...props }: SecureTextareaProps) => {
  const valueStr = String(props.value || '');
  const isInvalidHtml = containsHtml(valueStr);
  
  const displayError = errorMsg || (isInvalidHtml ? "HTML tags are not allowed." : undefined);
  const isError = !!displayError;

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
    <div className="w-full relative">
      <textarea
        className={`w-full bg-[rgba(15,23,42,0.4)] text-[#F8FAFC] placeholder-[#64748B] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 border ${borderClass} focus:ring-2 ${focusRing} resize-none no-scrollbar ${className}`}
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
