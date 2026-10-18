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
      <footer
        className="w-full mt-auto shrink-0 border-t transition-colors duration-200"
        style={{
          borderColor: 'var(--border-default)',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span>Built with care, for your better days 💙</span>
          </div>

          <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            <span>© {new Date().getFullYear()} Daily Things · </span>
            <span>
              crafted by{' '}
              <a
                href={authorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors focus:outline-none"
              >
                praveen
              </a>
            </span>
          </div>

          <div className="flex items-center gap-3.5 text-xs font-medium">
            <button
              onClick={() => setFeedbackOpen(true)}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
              style={{ color: 'var(--text-muted)' }}
            >
              Feedback
            </button>
            <span style={{ color: 'var(--text-disabled)' }}>·</span>
            <button
              onClick={() => setPrivacyOpen(true)}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
              style={{ color: 'var(--text-muted)' }}
            >
              Privacy
            </button>
            <span style={{ color: 'var(--text-disabled)' }}>·</span>
            <button
              onClick={() => setContactOpen(true)}
              className="hover:text-white transition-colors cursor-pointer focus:outline-none"
              style={{ color: 'var(--text-muted)' }}
            >
              Contact
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
