import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { TaskList } from "./components/TaskList";
import { TaskForm } from "./components/TaskForm";
import { Onboarding } from "./components/Onboarding";
import { Settings } from "./components/Settings";
import { useDailyReset } from "./hooks/useDailyReset";
import { RewardPopup } from "./components/RewardPopup";
import { UserDelightPopup } from "./components/UserDelightPopup";
import { useTaskStore } from "./store/useTaskStore";
import { Settings as SettingsIcon, Plus, Sparkles, BatteryLow, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Greetings ─────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h >= 0 && h < 5) return { text: "Go to Sleep", sub: "don't be like this, be gentle on you. go - sleep like this", dot: "#64748B" };
  if (h >= 5 && h < 12) return { text: "Good Morning", sub: "Ready to win the day? ✨", dot: "#22C55E" };
  if (h >= 12 && h < 17) return { text: "Good Afternoon", sub: "Keep the momentum going 🚀", dot: "#6366F1" };
  if (h >= 17 && h < 22) return { text: "Good Evening", sub: "Wrapping up strong 💪", dot: "#F59E0B" };
  return { text: "It's Late", sub: "Rest up for tomorrow 😴", dot: "#94A3B8" };
}

/* ── Motivational Stories ──────────────────────────────────── */
const STORIES = [
  {
    emoji: "🌱",
    title: "The Seed",
    body: "A seed doesn't know it will become a tree. You don't need to see the whole staircase — just take the next step. The consistency you build today is quietly constructing someone remarkable.",
  },
  {
    emoji: "💡",
    title: "Edison's Secret",
    body: "Thomas Edison failed 10,000 times before the light bulb worked. He said: 'I found 10,000 ways that don't work.' Every struggle you face is narrowing you down to the one way that does.",
  },
  {
    emoji: "⛰️",
    title: "The Mountain Law",
    body: "The mountain doesn't get smaller the more you look at it — you get stronger. Every hard day you survive makes the next challenge smaller. You're already stronger than you were yesterday.",
  },
  {
    emoji: "🚀",
    title: "Resistance = Launch",
    body: "Rockets need resistance to launch. Without gravity's push-back, they'd go nowhere. The resistance you feel right now? That's exactly what's going to launch you forward. Lean into it.",
  },
  {
    emoji: "💎",
    title: "Pressure Makes Diamonds",
    body: "Diamonds are just coal that handled pressure incredibly well. You're in the pressure phase — the transformation phase. Don't run from it. Let it shape you into something brilliant.",
  },
  {
    emoji: "🏆",
    title: "Champions Aren't Made on Easy Days",
    body: "The easy days feel good, but the hard days are where legends are built. Champions are forged in moments when everything says 'stop' and they whisper 'one more.' That's today. One more.",
  },
  {
    emoji: "🌟",
    title: "Your Future Self",
    body: "One day you'll look back at today and feel incredibly proud that you didn't quit. Your future self is watching. They're cheering for you right now, knowing what you become if you hold on.",
  },
  {
    emoji: "🦋",
    title: "Trust the Process",
    body: "The caterpillar doesn't 'try' to become a butterfly. It surrenders to the process and trusts the transformation. You're in your chrysalis. Don't rush it. Something beautiful is being built inside you.",
  },
  {
    emoji: "⚡",
    title: "Your Season is Coming",
    body: "Your current situation is not your final destination. Every expert was once a beginner. Every legend was once unknown. Every master was once a disaster. Your time is coming — keep building.",
  },
  {
    emoji: "🌊",
    title: "Unshakeable",
    body: "The ocean doesn't apologize for its waves. Stop shrinking yourself to fit into spaces that were never meant for you. You were built for depth. Go deep. Go wide. The world needs all of you.",
  },
  {
    emoji: "🔥",
    title: "Start Before Ready",
    body: "You don’t need to feel ready to begin. Readiness is a myth created by fear. The truth? People who succeed start while doubting, while unsure, while imperfect. Action creates confidence — not the other way around. Start now.",
  },

  {
    emoji: "🚀",
    title: "Momentum Rule",
    body: "The hardest push is always the first one. After that, momentum takes over. You don’t need to finish everything today — just begin. Once you move, everything else starts aligning with you.",
  },

  {
    emoji: "💪",
    title: "Do It Anyway",
    body: "You won’t always feel motivated. You won’t always feel strong. But the difference between winners and everyone else is simple — they do it anyway. Especially when they don’t feel like it.",
  },

  {
    emoji: "⏳",
    title: "The Time Truth",
    body: "A year from now, you’ll wish you started today. Time will pass no matter what you do. The only question is — will it pass with progress or regret?",
  },

  {
    emoji: "🎯",
    title: "Focus Wins",
    body: "You don’t need to do everything. You just need to do the right thing, fully. One focused hour beats ten distracted ones. Lock in. Execute.",
  },

  {
    emoji: "🌱",
    title: "Small Steps Law",
    body: "Massive results are built from tiny, consistent actions. What feels small today compounds into something powerful tomorrow. Never underestimate one small step.",
  },

  {
    emoji: "⚡",
    title: "Energy Follows Action",
    body: "You’re waiting for energy to start — but energy comes after you begin. Start tired. Start slow. But start. Your energy will catch up.",
  },

  {
    emoji: "🏆",
    title: "Earn It Daily",
    body: "Confidence isn’t given. It’s earned — daily. Every task you complete builds it. Every promise you keep to yourself strengthens it. Earn your confidence today.",
  },

  {
    emoji: "🧠",
    title: "Mind vs You",
    body: "Your mind will tell you to stop. To rest. To delay. But your future is built when you choose action over comfort. Don’t listen to every thought — lead them.",
  },

  {
    emoji: "🌄",
    title: "New Day Power",
    body: "Every day is a reset. Yesterday doesn’t define you. Today does. You can change direction with one decision. Make it count.",
  },

  {
    emoji: "🔥",
    title: "One More",
    body: "When your body says stop, when your mind says later — that’s where growth lives. Do one more. One more step. One more task. That’s where transformation begins.",
  },

  {
    emoji: "💎",
    title: "Built Under Pressure",
    body: "Pressure isn’t here to break you. It’s here to shape you. Every challenge you face is refining you into something stronger, sharper, better.",
  },

  {
    emoji: "🚶‍♂️",
    title: "Keep Moving",
    body: "You don’t have to run. You don’t even have to walk fast. But don’t stop. Progress is simply movement — no matter how slow.",
  },

  {
    emoji: "🌊",
    title: "Flow State",
    body: "Stop overthinking. Start doing. When you move, clarity comes. When you act, direction appears. Action creates flow.",
  },

  {
    emoji: "🧗",
    title: "Climb Anyway",
    body: "The mountain doesn’t get easier. You get stronger. Every climb builds something inside you that nothing else can.",
  },

  {
    emoji: "⚔️",
    title: "Battle Mode",
    body: "This isn’t about motivation. This is about discipline. Show up. Fight your distractions. Win your day.",
  },

  {
    emoji: "🌟",
    title: "You Are Becoming",
    body: "Every task you complete is shaping your identity. You’re not just finishing work — you’re becoming someone who finishes.",
  },

  {
    emoji: "🔁",
    title: "Repeat Power",
    body: "Success isn’t one big action. It’s the same small actions repeated daily. Master repetition — and you master results.",
  },

  {
    emoji: "💥",
    title: "Break Limits",
    body: "Your limits are often imagined. Push a little further and you’ll see — you were capable all along.",
  },

  {
    emoji: "📈",
    title: "Growth Curve",
    body: "Progress is invisible at first. Then suddenly, everything changes. Stay consistent long enough to see it.",
  },

  {
    emoji: "🕶️",
    title: "Ignore Noise",
    body: "Doubt, fear, opinions — they’re noise. Focus on your path. Silence everything else.",
  },

  {
    emoji: "🧭",
    title: "Direction Matters",
    body: "You don’t need speed. You need direction. Move toward your goal — even slowly.",
  },

  {
    emoji: "🛠️",
    title: "Build Yourself",
    body: "You are your greatest project. Every action you take is shaping who you become. Build wisely.",
  },

  {
    emoji: "⚡",
    title: "Now > Later",
    body: "Later is a lie your mind tells you to stay comfortable. The only real time is now. Act in it.",
  },

  {
    emoji: "🔥",
    title: "No Excuses",
    body: "Excuses feel good in the moment. Results feel good forever. Choose wisely.",
  },

  { emoji: "🎯", title: "Lock In", body: "Distractions steal your future quietly. Focus is your weapon. Use it." },

  {
    emoji: "🌙",
    title: "Late Nights Matter",
    body: "The work you do when no one is watching builds the life everyone will notice.",
  },

  {
    emoji: "💡",
    title: "Clarity Through Action",
    body: "You don’t think your way into clarity. You act your way into it.",
  },

  { emoji: "🏁", title: "Finish Line", body: "Starting is good. Finishing is powerful. Be someone who completes." },

  {
    emoji: "💪",
    title: "Stronger Daily",
    body: "Every day you push, you become stronger than yesterday. That’s how transformation works.",
  },

  {
    emoji: "🌱",
    title: "Plant Today",
    body: "The effort you put today is the result you live tomorrow. Plant wisely.",
  },

  { emoji: "⚡", title: "Execution Mode", body: "Stop planning. Stop waiting. Execute. That’s where results live." },

  {
    emoji: "🚀",
    title: "Lift Off",
    body: "The beginning is heavy. But once you lift off, everything changes. Push through the start.",
  },

  { emoji: "💭", title: "Think Less, Do More", body: "Overthinking kills progress. Action creates it. Choose action." },

  { emoji: "🏆", title: "Win Today", body: "Forget tomorrow. Forget yesterday. Win today — that’s enough." },

  { emoji: "🧠", title: "Control Your Mind", body: "Your thoughts don’t control you. Your actions do. Act anyway." },

  {
    emoji: "🌟",
    title: "Show Up",
    body: "You don’t have to be perfect. You just have to show up. Consistency beats perfection.",
  },

  {
    emoji: "🔥",
    title: "Burn Distractions",
    body: "Everything you say yes to takes time from something important. Choose wisely.",
  },

  { emoji: "📍", title: "Start Here", body: "You don’t need the perfect plan. You just need to start where you are." },

  { emoji: "💎", title: "Earn Your Life", body: "The life you want is on the other side of effort. Earn it." },

  { emoji: "⚡", title: "Move Now", body: "Waiting doesn’t change anything. Movement does." },

  { emoji: "🚶", title: "Step Forward", body: "One step today is better than no steps for a week. Move." },

  { emoji: "🌊", title: "Keep Flowing", body: "Don’t stop because it’s hard. Flow through it." },

  { emoji: "🏹", title: "Aim and Shoot", body: "Clarity comes after action. Take the shot." },

  { emoji: "🔥", title: "You vs You", body: "The only competition is who you were yesterday. Beat that person." },

  { emoji: "💪", title: "Built Different", body: "You’re not average. Don’t live like you are." },

  { emoji: "🚀", title: "Rise Again", body: "Fall. Rest. Rise. Repeat. That’s how winners are built." },

  { emoji: "🌟", title: "Make It Count", body: "This moment matters more than you think. Use it well." },

  { emoji: "⚡", title: "Take Control", body: "You’re not stuck. You’re choosing comfort. Choose action instead." },

  { emoji: "🔥", title: "Go All In", body: "Half effort creates half results. Go all in — or don’t complain." },

  { emoji: "🏆", title: "Prove It", body: "Not to others. To yourself. Show what you’re capable of." },
];

const TIRED_MESSAGES = [
  "Hey… I know you're tired. 💙\n\nNot just physically — but mentally, emotionally… everything.\n\nAnd that's okay. You're allowed to feel this. You're allowed to pause.\n\nYou've been carrying more than people see.\n\nPut things down for a moment. Breathe. You don't have to be strong every second.\n\nEven the strongest people rest.\n\nAnd you? You're still standing. That matters more than you think. 🌿",

  "I see you trying… even when you're exhausted. 🤍\n\nThat quiet effort? That unseen fight?\n\nThat's strength.\n\nYou don’t need to prove anything today. Not to anyone.\n\nJust exist. Just breathe. Just be.\n\nYou’re doing better than you feel right now. 💫",

  "It’s okay to feel drained. 💜\n\nYou’ve been pouring from your cup for so long.\n\nMaybe today… it’s time to refill it.\n\nRest without guilt.\n\nYou’re not falling behind — you’re recovering.\n\nAnd recovery is part of growth. 🌱",

  "Hey… pause for a second. 🫶\n\nYou’ve been pushing so hard.\n\nBut even engines overheat.\n\nRest doesn’t mean you’re weak.\n\nIt means you’re human.\n\nAnd humans need care too — especially from themselves. 💙",

  "You don’t have to carry everything today. 🌙\n\nSome days are for progress.\n\nSome days are for survival.\n\nAnd today? Surviving is enough.\n\nYou’re still here. That’s not small.\n\nThat’s everything. 🤍",

  "I know it feels heavy. 💭\n\nLike everything is sitting on your shoulders at once.\n\nBut listen… you don’t have to solve your whole life today.\n\nJust take one small step.\n\nThat’s enough.\n\nYou’re allowed to move slowly. 🌿",

  "You're tired… and still trying. 💪\n\nDo you realize how strong that is?\n\nNot loud strength. Not flashy strength.\n\nBut quiet, persistent strength.\n\nThat’s the kind that builds real resilience.\n\nAnd you have it. ✨",

  "Take a deep breath. In… and out. 🌬️\n\nYou’ve been holding so much inside.\n\nYou don’t need to fix everything right now.\n\nJust be here.\n\nJust exist.\n\nThat is enough for this moment. 🤍",

  "You’re not weak for feeling tired. 💙\n\nYou’re human.\n\nAnd humans get overwhelmed.\n\nBut even now… you’re still here.\n\nStill showing up.\n\nStill fighting quietly.\n\nThat’s strength. 🌟",

  "Hey… slow down. 🫶\n\nYou’ve been running for so long.\n\nLet yourself walk today.\n\nOr even sit.\n\nYou’re not losing progress.\n\nYou’re protecting yourself. 🌱",

  "I know you're exhausted. 💜\n\nBut exhaustion doesn’t erase your progress.\n\nIt just means you’ve been trying.\n\nAnd trying matters.\n\nEven when it feels like it doesn’t. 🤍",

  "You don’t have to be okay all the time. 🌙\n\nYou don’t have to smile through everything.\n\nYou’re allowed to feel tired, lost, unsure.\n\nThat doesn’t make you weak.\n\nIt makes you real. 💫",

  "Hey… you’ve made it this far. 💙\n\nThrough everything.\n\nEvery hard day.\n\nEvery moment you thought you couldn’t continue.\n\nAnd yet… you did.\n\nYou’re stronger than your thoughts tell you. 🌿",

  "Rest isn’t quitting. 🛑\n\nIt’s preparing.\n\nIt’s healing.\n\nIt’s necessary.\n\nGive yourself permission to pause.\n\nYou deserve that. 🤍",

  "You’ve been carrying invisible weight. 💭\n\nAnd that kind of tired is different.\n\nIt’s deeper.\n\nHeavier.\n\nSo be gentle with yourself today.\n\nYou need kindness too. 💜",

  "You are not behind. 🌱\n\nYou are not failing.\n\nYou are just tired.\n\nAnd that changes everything.\n\nRest… then continue when you're ready. 💙",

  "Hey… it’s okay to step back. 🫶\n\nNot everything needs your energy today.\n\nChoose yourself.\n\nChoose rest.\n\nYou’re allowed to. 🤍",

  "Even the sun sets every day. 🌅\n\nNot because it failed.\n\nBut because rest is part of the cycle.\n\nSo rest.\n\nYou’ll rise again. 💫",

  "You don’t have to push through everything. 💙\n\nSome things need softness.\n\nSome days need stillness.\n\nListen to your body.\n\nIt’s not your enemy. 🌿",

  "You’re allowed to feel overwhelmed. 💭\n\nIt doesn’t mean you’re incapable.\n\nIt means you care.\n\nAnd caring deeply takes energy.\n\nBe kind to yourself. 🤍",

  "You’ve done enough for today. 🫶\n\nEven if it doesn’t feel like it.\n\nEven if the list isn’t complete.\n\nYou tried.\n\nAnd that counts. 💙",

  "I know you're tired… but you're not alone. 🤍\n\nEven in silence, even in your thoughts — you're not alone.\n\nYou're seen.\n\nYou're understood.\n\nYou're supported. 💫",

  "Hey… breathe again. 🌬️\n\nYou’ve been holding tension for too long.\n\nLet it go for a moment.\n\nJust exist.\n\nThat’s enough right now. 💙",

  "You’re doing your best with what you have. 💜\n\nAnd your best changes day to day.\n\nToday’s best might be rest.\n\nAnd that’s okay. 🌿",

  "You don’t need to earn rest. 🛑\n\nYou don’t need to prove you deserve it.\n\nRest is a basic need.\n\nTake it. 🤍",

  "You’ve been strong for too long. 💙\n\nMaybe today… you can just be soft.\n\nThat’s not weakness.\n\nThat’s healing. 🌱",

  "Hey… you matter beyond your productivity. 🌟\n\nYou are not your output.\n\nYou are not your checklist.\n\nYou are a person.\n\nAnd that’s enough. 🤍",

  "It’s okay to not have everything figured out. 💭\n\nYou’re still learning.\n\nStill growing.\n\nStill becoming.\n\nAnd that takes time. 💜",

  "You’re allowed to rest without guilt. 💙\n\nGuilt doesn’t make you stronger.\n\nRest does.\n\nChoose rest. 🌿",

  "Even small steps are progress. 👣\n\nEven breathing through a hard moment is progress.\n\nDon’t underestimate what you’re doing. 💫",

  "You’ve survived every hard day so far. 💪\n\nThat’s not luck.\n\nThat’s strength.\n\nAnd it’s still in you. 💙",

  "Hey… it’s okay to not feel okay. 🤍\n\nYou don’t have to fix it immediately.\n\nJust sit with it.\n\nYou’ll move through it. 🌿",

  "You don’t need to rush your healing. 💜\n\nYou don’t need to rush your life.\n\nGo at your pace.\n\nIt’s valid. 💙",

  "You’re tired because you’ve been trying. 💭\n\nAnd trying is never wasted.\n\nEven if it feels like it. 🌱",

  "Some days are heavy. 🌧️\n\nAnd today might be one of them.\n\nThat doesn’t mean tomorrow will be.\n\nHold on. 💙",

  "You don’t have to do everything today. 🫶\n\nJust one thing.\n\nOr even nothing.\n\nThat’s okay too. 🤍",

  "You’ve been giving so much to others. 💜\n\nDon’t forget to give something to yourself.\n\nEven if it’s just rest. 🌿",

  "You are not alone in this feeling. 💙\n\nSo many people feel this quietly.\n\nAnd like them… you will get through it. 🤍",

  "You don’t have to be perfect. 🌟\n\nYou don’t have to be strong all the time.\n\nYou just have to be you.\n\nAnd that’s enough. 💙",

  "Hey… you’re allowed to pause your life for a moment. 🛑\n\nNot everything needs immediate attention.\n\nTake care of yourself first. 🤍",

  "You’re not failing. 💭\n\nYou’re just tired.\n\nAnd tired people need rest, not pressure. 💙",

  "You’ve come too far to be this hard on yourself. 💜\n\nGive yourself the same kindness you give others. 🌿",

  "Even if today feels slow… you’re still moving. 🐢\n\nAnd that matters.\n\nSpeed doesn’t define progress. 💙",

  "You’re allowed to cry, rest, pause. 🤍\n\nNone of that erases your strength.\n\nIt shows your humanity. 💫",

  "Hey… don’t forget how far you’ve come. 🌱\n\nEven if today feels like a step back.\n\nIt’s not.\n\nIt’s part of the journey. 💙",

  "You are enough. Just as you are. 🤍\n\nNot after success.\n\nNot after achievement.\n\nRight now. 💜",

  "This feeling won’t last forever. 🌙\n\nEven if it feels like it will.\n\nEverything changes.\n\nThis will too. 💙",

  "You’ve handled so much already. 💪\n\nGive yourself credit.\n\nEven if no one else does. 🤍",

  "Hey… rest today. 🌿\n\nCome back tomorrow.\n\nYou don’t have to win every day.\n\nJust don’t quit. 💙",
];

/* ── Live Clock ─────────────────────────────────────────────── */
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const LiveClock = () => {
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

/* ── Motivation Modal ───────────────────────────────────────── */
const Modal = ({
  isOpen,
  onClose,
  title,
  emoji,
  body,
  accentGradient,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  emoji: string;
  body: string;
  accentGradient: string;
}) => (
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
              className="p-1.5 rounded-lg transition-colors"
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

/* ── App ────────────────────────────────────────────────────── */
function App() {
  useDailyReset();
  const tasks = useTaskStore((state) => state.tasks);
  const settings = useTaskStore((state) => state.settings);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [motivateModal, setMotivateModal] = useState<(typeof STORIES)[0] | null>(null);
  const [tiredModal, setTiredModal] = useState<string | null>(null);
  const [isUserDelightOpen, setIsUserDelightOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDarkOS = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark =
      settings.theme === "dark" || (settings.theme === "system" && isDarkOS);

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [settings.theme]);

  const greeting = getGreeting();

  const handleEditTask = (id: string) => {
    setEditTaskId(id);
    setIsTaskFormOpen(true);
  };
  const handleOpenNewTask = () => {
    setEditTaskId(null);
    setIsTaskFormOpen(true);
  };
  const handleMotivate = () => setMotivateModal(STORIES[Math.floor(Math.random() * STORIES.length)]);
  const handleTired = () => setTiredModal(TIRED_MESSAGES[Math.floor(Math.random() * TIRED_MESSAGES.length)]);

  const handleNameClick = () => {
    setIsUserDelightOpen(true);
  };

  if (!settings.isOnboarded) return <Onboarding />;

  return (
    <Layout>
      {/* ── Header ──────────────────────────────────────── */}
      <header className="mb-8">
        {/* Row 1: greeting (left) | clock (right) — these two never compete */}
        <div className="flex items-start justify-between gap-3">
          {/* LEFT: full greeting — allowed to grow */}
          <div className="min-w-0 flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-0.5 flex items-center gap-1.5"
              style={{ color: "var(--text-disabled)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse" style={{ background: greeting.dot }} />
              Dashboard
            </p>
            <h1
              className="font-bold tracking-tight leading-tight"
              style={{ color: "var(--text-primary)", fontSize: "clamp(1.15rem, 5vw, 2.25rem)" }}
            >
              {greeting.text},{" "}
              <button
                onClick={handleNameClick}
                className="text-gradient cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                title="Tap for a surprise"
              >
                {settings.name}
              </button>
            </h1>
            <p className="text-xs mt-1 font-medium" style={{ color: "var(--text-muted)" }}>
              {greeting.sub}
            </p>
          </div>

          {/* RIGHT: clock only — compact, never clips the name */}
          <div className="shrink-0">
            <LiveClock />
          </div>
        </div>

        {/* Row 2: action buttons — their own line, right-aligned */}
        <div className="mt-3 flex items-center justify-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSettingsOpen(true)}
              title="Settings"
              aria-label="Open Settings"
              className="btn-ghost p-2 rounded-xl"
            >
              <SettingsIcon size={16} style={{ color: "var(--text-muted)" }} />
            </button>

            <button
              onClick={handleMotivate}
              title="Motivate Me"
              aria-label="Get a motivational story"
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all"
              style={{
                background: "rgba(99,102,241,0.1)",
                color: "#818CF8",
                border: "1px solid rgba(99,102,241,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.2)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(99,102,241,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Sparkles size={13} />
              <span className="hidden sm:inline">Motivate</span>
            </button>

            <button
              onClick={handleTired}
              title="I'm Tired"
              aria-label="I'm feeling tired"
              className="flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs font-semibold transition-all"
              style={{
                background: "rgba(245,158,11,0.08)",
                color: "#FBBF24",
                border: "1px solid rgba(245,158,11,0.2)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.16)";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(245,158,11,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <BatteryLow size={13} />
              <span className="hidden sm:inline">Tired</span>
            </button>

            <button
              onClick={handleOpenNewTask}
              title="Add New Task"
              aria-label="Add a new task"
              className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2"
            >
              <Plus size={14} />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mt-5 h-px w-full"
          style={{ background: "linear-gradient(to right, rgba(99,102,241,0.3), transparent)" }}
        />
      </header>

      {/* ── Content ─────────────────────────────────────── */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <Dashboard />
        </div>

        <div className="lg:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-disabled)" }}>
            Tasks · {tasks.length}
          </p>

          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 flex flex-col items-center justify-center text-center min-h-[320px]"
            >
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                No tasks yet
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text-muted)" }}>
                Start building your day — add your first task.
              </p>
              <button onClick={handleOpenNewTask} className="btn-primary">
                + Add First Task
              </button>
            </motion.div>
          ) : (
            <TaskList onEditTask={handleEditTask} />
          )}
        </div>
      </main>

      {/* ── Modals & Overlays ────────────────────────────── */}
      <TaskForm isOpen={isTaskFormOpen} onClose={() => setIsTaskFormOpen(false)} editTaskId={editTaskId} />
      <Settings isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <RewardPopup />

      {/* Motivate Me modal */}
      {motivateModal && (
        <Modal
          isOpen={!!motivateModal}
          onClose={() => setMotivateModal(null)}
          emoji={motivateModal.emoji}
          title={motivateModal.title}
          body={motivateModal.body}
          accentGradient="linear-gradient(90deg, #6366F1, #8B5CF6, #C084FC)"
        />
      )}

      {/* I'm Tired modal */}
      {tiredModal && (
        <Modal
          isOpen={!!tiredModal}
          onClose={() => setTiredModal(null)}
          emoji="💙"
          title="I hear you."
          body={tiredModal}
          accentGradient="linear-gradient(90deg, #F59E0B, #FBBF24)"
        />
      )}

      {/* Premium User Delight Modal */}
      <UserDelightPopup
        isOpen={isUserDelightOpen}
        onClose={() => setIsUserDelightOpen(false)}
        userName={settings.name}
      />
    </Layout>
  );
}

export default App;
