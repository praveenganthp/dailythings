import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  body: string;
  accentGradient: string;
}

export const MessageModal = ({
  isOpen,
  onClose,
  title,
  emoji,
  body,
  accentGradient,
}: MessageModalProps) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(148,163,184,0.12)",
            boxShadow: "0 32px 72px rgba(0,0,0,0.5)",
          }}
        >
          {/* Accent top strip */}
          <div className="h-1" style={{ background: accentGradient }} />

          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl"
                style={{ display: "inline-block" }}
              >
                {emoji}
              </motion.span>
              <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                {title}
              </h2>
            </div>
            <button
              onClick={onClose}
              title="Close"
              className="p-1.5 rounded-lg transition-colors cursor-pointer"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
              {body}
            </p>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);
