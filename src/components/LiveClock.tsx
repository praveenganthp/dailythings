import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const LiveClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-end select-none"
    >
      <div className="flex items-baseline gap-1">
        <span
          className="text-xl md:text-2xl font-bold tabular-nums"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
        >
          {h12}:{m}
        </span>
        <div className="flex flex-col items-start ml-0.5">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={s}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="text-[10px] font-bold tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              {s}
            </motion.span>
          </AnimatePresence>
          <span className="text-[10px] font-bold tracking-wider" style={{ color: "var(--brand)" }}>
            {ampm}
          </span>
        </div>
      </div>
      <p className="text-[10px] font-medium" style={{ color: "var(--text-disabled)" }}>
        {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
      </p>
    </motion.div>
  );
};
