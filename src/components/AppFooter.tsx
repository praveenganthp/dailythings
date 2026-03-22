import { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';
import { ContactUsModal } from './ContactUsModal';
import { PrivacyPolicyModal } from './PrivacyPolicyModal';

export const AppFooter = () => {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const authorUrl = import.meta.env.VITE_AUTHOR_URL || '#';

  return (
    <>
      <footer className="w-full mt-auto shrink-0 border-t border-[rgba(148,163,184,0.12)] bg-[#0F172A]/80 backdrop-blur-md">
        <div className="max-w-full mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
           <div className="text-[12px] text-[#94A3B8] font-medium tracking-wide text-center sm:text-left">
            
            <span className="ml-1 sm:ml-2">Built with care, for your better days 💙</span>
          </div>
          <div className="text-[12px] text-[#94A3B8] font-medium tracking-wide text-center sm:text-left">
            <span>© {new Date().getFullYear()} Daily Things.</span>
            <span className="ml-1 sm:ml-2">crafted by <a href={authorUrl} target="_blank" rel="noopener noreferrer" className="text-[#818CF8] hover:text-[#C084FC] transition-colors focus:outline-none">praveen</a></span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium">
            <button 
              onClick={() => setFeedbackOpen(true)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors focus:outline-none"
            >
              Feedback
            </button>
            <span className="text-[#334155]">|</span>
            <button 
              onClick={() => setPrivacyOpen(true)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors focus:outline-none"
            >
              Privacy Policy
            </button>
            <span className="text-[#334155]">|</span>
            <button 
              onClick={() => setContactOpen(true)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors focus:outline-none"
            >
              Contact Us
            </button>
          </div>
        </div>
      </footer>

      <FeedbackModal isOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ContactUsModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <PrivacyPolicyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
};
