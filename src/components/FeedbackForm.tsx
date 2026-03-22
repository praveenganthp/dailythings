import { useState } from 'react';
import { AtomInput } from './ui/AtomInput';
import { sanitizeInput, hasImproperContent } from '../utils/sanitize';

export const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const email = import.meta.env.VITE_FEEDBACK_EMAIL || 'test@example.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!feedback.trim()) return;

    if (hasImproperContent(feedback)) {
      setStatus('error');
      setErrorMsg('Improper content detected.');
      return;
    }

    const cleanText = sanitizeInput(feedback);
    if (!cleanText) {
      setStatus('error');
      setErrorMsg('Invalid input format.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: "New Premium User Feedback",
          message: cleanText
        })
      });

      if (res.ok) {
        setStatus('success');
        setFeedback('');
      } else {
        setStatus('error');
        setErrorMsg('Failed to send feedback.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error.');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full py-4 text-center border-t border-[rgba(255,255,255,0.05)] mt-4">
        <p className="text-sm font-bold text-[#4ADE80]">Thank you! 💙</p>
        <p className="text-xs text-[#94A3B8] mt-1">Your feedback has been sent safely.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col mt-4 border-t border-[rgba(255,255,255,0.05)] pt-4">
      <AtomInput
        placeholder="Any thoughts or feedback? (Max 1000 chars)"
        maxLength={1000}
        rows={2}
        value={feedback}
        onChange={(e) => {
          setFeedback(e.target.value);
          if (status === 'error') setStatus('idle');
        }}
        isError={status === 'error'}
        disabled={status === 'loading'}
      />
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-[#EF4444] font-medium min-h-[14px]">
          {errorMsg}
        </span>
        <button
          type="submit"
          disabled={!feedback.trim() || status === 'loading'}
          className="text-xs font-bold px-4 py-2 rounded-lg transition-all"
          style={{
            background: !feedback.trim() ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            color: !feedback.trim() ? '#64748B' : '#F8FAFC',
            boxShadow: !feedback.trim() ? 'none' : '0 4px 12px rgba(99,102,241,0.3)',
            opacity: status === 'loading' ? 0.7 : 1
          }}
        >
          {status === 'loading' ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
};
