import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
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
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#1E293B] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
            style={{
              border: '1px solid rgba(148,163,184,0.18)',
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-[rgba(148,163,184,0.1)] shrink-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#818CF8]">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#F8FAFC]">Privacy Policy</h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Your data and security transparency.</p>
                </div>
              </div>
              <button onClick={onClose} className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded-md hover:bg-[rgba(255,255,255,0.05)] focus:outline-none">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto no-scrollbar text-[13px] leading-relaxed text-[#CBD5E1] space-y-7">
              
              <div className="text-[14px] text-[#F8FAFC] font-medium text-center italic">
                "Your data, your control, and full transparency."
              </div>

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">1. Data Collection & Storage</h3>
                <p className="mb-2">We prioritize your privacy.</p>
                <p className="mb-2">All of your daily tasks, settings, and preferences are stored locally in your browser using <code className="text-[#F8FAFC] bg-[rgba(255,255,255,0.05)] px-1 py-0.5 rounded">localStorage</code>. We do not transmit, store, or process your task data on external servers.</p>
                <p className="mb-1">This means:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>Your data stays on your device</li>
                  <li>Your workflow is private</li>
                  <li>No tracking or hidden data collection</li>
                </ul>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">2. Daily Data Behavior</h3>
                <p className="mb-2">This application is designed around a daily productivity cycle.</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>Completed tasks are automatically marked and removed/faded after the day ends</li>
                  <li>Uncompleted tasks may be carried forward to the next day</li>
                  <li>Each day starts as a fresh experience, helping you stay focused and organized</li>
                </ul>
                <p className="mt-2 text-[#94A3B8]">This behavior is part of the core experience and happens locally on your device.</p>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">3. Your Data Control</h3>
                <p className="mb-2">You have full control over your data.</p>
                <p className="mb-1">You can:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-[#94A3B8]">
                  <li>Clear your data manually via browser settings</li>
                  <li>Use the “Delete All My Data” option inside the app settings</li>
                </ul>
                <p className="mb-1">When you choose to delete your data:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>All stored tasks and preferences are permanently removed</li>
                  <li>The application resets to its initial fresh state</li>
                  <li>This action cannot be undone</li>
                </ul>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">4. Feedback & Contact Forms</h3>
                <p className="mb-1">When you use <strong>Feedback</strong> or <strong>Contact Us</strong>, the information you provide:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-[#94A3B8]">
                  <li>Name</li>
                  <li>Email</li>
                  <li>Message</li>
                </ul>
                <p className="mb-2">is securely sent via <code className="text-[#F8FAFC] bg-[rgba(255,255,255,0.05)] px-1 py-0.5 rounded">formsubmit.co</code> to our support email.</p>
                <p className="mb-1">We use this data only to:</p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-[#94A3B8]">
                  <li>Respond to your queries</li>
                  <li>Improve the application</li>
                </ul>
                <p className="font-semibold text-[#F8FAFC]">We do not sell, share, or misuse your data.</p>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">5. Third-Party Services</h3>
                <p className="mb-2">Form submissions are processed through a third-party service: <code className="text-[#F8FAFC] bg-[rgba(255,255,255,0.05)] px-1 py-0.5 rounded">formsubmit.co</code>.</p>
                <p className="mb-2 text-[#94A3B8]">While we trust this service, we recommend users avoid submitting sensitive or confidential information.</p>
                <p className="mt-4 italic text-[#818CF8]">✨ For our users' better future and privacy, we are going to build our own email service in upcoming updates. Stay tuned!</p>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">6. Security Measures</h3>
                <p className="mb-2">We take security seriously.</p>
                <ul className="list-disc pl-5 space-y-1 mb-2 text-[#94A3B8]">
                  <li>All inputs are treated as untrusted data</li>
                  <li>HTML tags, scripts, and unsafe inputs are strictly blocked</li>
                  <li>All data is stored and handled as plain text only</li>
                  <li>No dynamic HTML rendering (prevents script injection)</li>
                </ul>
                <p className="font-semibold text-[#F8FAFC]">This ensures a safe and controlled environment for all users.</p>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">7. Data Retention</h3>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>Your task data remains only in your browser</li>
                  <li>Feedback/contact submissions remain in our email inbox</li>
                  <li>You may request deletion of submitted data at any time</li>
                </ul>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">8. Limitations</h3>
                <p className="mb-1">While we implement strong security practices:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>No system can guarantee 100% security</li>
                  <li>Data stored in your browser depends on your device security</li>
                  <li>Clearing browser data will permanently erase your stored tasks</li>
                </ul>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">9. Your Rights</h3>
                <p className="mb-1">You have full control over your data:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li><strong>Access</strong> &rarr; always available in your app</li>
                  <li><strong>Delete</strong> &rarr; via settings or browser</li>
                  <li><strong>Contact</strong> &rarr; request deletion of submitted messages</li>
                </ul>
              </section>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgba(148,163,184,0.1)] to-transparent" />

              <section>
                <h3 className="text-[15px] font-bold text-[#F8FAFC] mb-2 tracking-wide">10. Contact Us</h3>
                <p className="mb-1">If you have any concerns, requests, or questions:</p>
                <ul className="list-disc pl-5 space-y-1 text-[#94A3B8]">
                  <li>Please use the Contact Us form within the app.</li>
                  <li>We’ll respond to you directly via email.</li>
                </ul>
              </section>

            </div>

            {/* Footer shadow/overlay fade */}
            <div className="p-4 border-t border-[rgba(148,163,184,0.1)] shrink-0 flex justify-end" style={{ background: 'rgba(15,23,42,0.2)' }}>
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-sm font-bold transition-all text-[#F8FAFC] bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-[#818CF8]"
              >
                Understood
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
