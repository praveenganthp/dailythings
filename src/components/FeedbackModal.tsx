import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SecureInput } from './ui/SecureInput';
import { SecureTextarea } from './ui/SecureTextarea';
import { hasImproperContent, sanitizeInput, isValidEmail } from '../utils/sanitize';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Suggestion');
  const [message, setMessage] = useState('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [submitError, setSubmitError] = useState('');

  const destEmail = import.meta.env.VITE_FEEDBACK_EMAIL || 'test@example.com';

  const isInvalid = 
    !name.trim() || 
    !email.trim() || 
    !isValidEmail(email) || 
    !message.trim() ||
    hasImproperContent(name) ||
    hasImproperContent(email) ||
    hasImproperContent(message);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (isInvalid) {
      setSubmitError('Please fix validation errors before submitting.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${destEmail}`, {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Feedback: ${category}`,
          Name: sanitizeInput(name),
          Email: sanitizeInput(email),
          Category: category,
          Message: sanitizeInput(message)
        })
      });

      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        setSubmitError('Failed to send feedback. Please try again.');
      }
    } catch {
      setStatus('idle');
      setSubmitError('Network error. Please try again.');
    }
  };

  const resetAndClose = () => {
    setName('');
    setEmail('');
    setCategory('Suggestion');
    setMessage('');
    setStatus('idle');
    setSubmitError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: 'rgba(15, 23, 42, 0.72)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={resetAndClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#1E293B] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: '1px solid rgba(148,163,184,0.18)',
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-[rgba(148,163,184,0.1)]" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}>
              <div>
                <h2 className="text-lg font-bold text-[#F8FAFC]">Provide Feedback</h2>
                <p className="text-xs text-[#94A3B8] mt-0.5">Help us improve your experience.</p>
              </div>
              <button onClick={resetAndClose} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] focus:outline-none">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="py-10 flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 bg-[#22C55E]/10 flex items-center justify-center rounded-full mb-4">
                    <span className="text-3xl">💙</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">Thank you for your feedback!</h3>
                  <p className="text-[#94A3B8] text-sm">Your feedback helps us improve and build a better product.</p>
                  <button
                    onClick={resetAndClose}
                    className="mt-6 px-6 py-2.5 rounded-xl text-sm font-bold text-[#F8FAFC] transition-all"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5 z-20">
                    <label className="text-xs font-semibold text-[#CBD5E1] ml-1">Name</label>
                    <SecureInput 
                      placeholder="Your name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 z-10">
                    <label className="text-xs font-semibold text-[#CBD5E1] ml-1">Email <span className="text-[#94A3B8] font-normal">(for follow-up)</span></label>
                    <SecureInput 
                      type="email"
                      placeholder="you@example.com" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-xs font-semibold text-[#CBD5E1] ml-1">Category</label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      disabled={status === 'loading'}
                      className="w-full bg-[rgba(15,23,42,0.4)] text-[#F8FAFC] rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all duration-300 border border-[rgba(255,255,255,0.1)] focus:ring-2 focus:ring-[rgba(99,102,241,0.4)] focus:border-[#818CF8] appearance-none cursor-pointer"
                    >
                      <option value="Suggestion">Suggestion</option>
                      <option value="Bug Report">Bug Report</option>
                      <option value="Feature Request">Feature Request</option>
                      <option value="Experience">Experience</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute right-4 top-[34px] pointer-events-none text-[#94A3B8]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 z-0">
                    <label className="text-xs font-semibold text-[#CBD5E1] ml-1">Message</label>
                    <SecureTextarea 
                      placeholder="How can we improve?" 
                      rows={4}
                      value={message} 
                      onChange={e => setMessage(e.target.value)} 
                      disabled={status === 'loading'}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[11px] text-[#EF4444] font-medium min-h-[16px] max-w-[200px] leading-tight break-words">
                      {submitError}
                    </span>
                    <button
                      type="submit"
                      disabled={isInvalid || status === 'loading'}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg"
                      style={{
                        background: isInvalid ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        color: isInvalid ? '#64748B' : '#F8FAFC',
                        boxShadow: isInvalid ? 'none' : '0 10px 25px -5px rgba(99,102,241,0.4)',
                        opacity: status === 'loading' ? 0.7 : 1,
                        cursor: isInvalid ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {status === 'loading' ? 'Sending...' : 'Send Feedback'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
