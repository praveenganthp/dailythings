# DailyThings ✨

> **A psychology-driven, gamified daily task planner built for momentum, focus, and positive reinforcement.**

DailyThings is designed to help you conquer each day with clarity and confidence. Rather than acting as a static checklist, it provides a supportive environment with daily resets, celebration animations, drag-and-drop prioritization, and motivational wisdom to keep you consistent.

---

## 🌟 Key Features

* **⚡ Daily Reset & Carry Forward (`useDailyReset`)**: Automatically detects local midnight shifts. Unfinished tasks can automatically carry forward into the next day, ensuring you always start with a clean slate without losing track of pending commitments.
* **🎯 Fluid Drag-and-Drop Reordering**: Prioritize pending tasks naturally using `@hello-pangea/dnd` with custom grab handles, tilt physics on drag, and drop indicators.
* **🎉 Positive Reinforcement & Delight Engine**:
  * Confetti celebrations (`canvas-confetti`) when completing tasks.
  * Category-aware motivational quotes and dynamic emoji badges.
  * **Surprise Delights & Future Self Messages**: Multi-category encouragement cards providing emotional support, achievement unlocks, and perspective.
* **🌅 Time-Aware Adaptive Greetings**: Smart context-aware greetings that change throughout the day (from morning inspiration to compassionate late-night rest reminders).
* **📚 Curated Motivational Philosophy (`STORIES`)**: Built-in library of 30+ motivational philosophies (*The Seed*, *Edison's Secret*, *Pressure Makes Diamonds*, *Momentum Rule*).
* **📊 Dashboard & Metrics**: Instant overview of your total, completed, and pending tasks with priority badges and hover glow effects.
* **🛡️ Client-Side Security & Sanitization**: Built-in input filtering (`sanitize.ts`, `SecureInput`, `SecureTextarea`) preventing HTML/script injections and XSS patterns.
* **💾 Local-First Persistence**: Powered by Zustand with `persist` middleware—your data stays private, fast, and accessible offline in your browser.

---

## 🛠️ Tech Stack

* **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS Custom Properties
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) with LocalStorage persistence
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Celebrations**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* **Date Utilities**: [date-fns](https://date-fns.org/)

---

## 🎨 Design System

DailyThings adheres to a **premium, dark-mode-first aesthetic** inspired by Linear, Vercel, and Raycast:

* **Typography**: Clean humanist geometric typography using **Outfit** (`@theme { --font-sans: 'Outfit' }`) with `tabular-nums` for crisp numeric stats.
* **Color Hierarchy**:
  * **Surfaces**: Deep slate/zinc navy (`#0F172A`, `#111827`, `#1E293B`, `#273449`)
  * **Brand Primary**: Indigo spectrum (`#6366F1`, hover `#4F46E5`)
  * **Priority Badges**:
    * 🔴 High: Red (`#EF4444`)
    * 🟡 Medium: Amber (`#F59E0B`)
    * 🟢 Low: Emerald (`#22C55E`)
  * **Category Badges**: Work (Indigo), Personal (Purple), Health (Green), Learning (Sky Blue), Other (Slate)
* **Micro-interactions**: Spring physics, ambient card border glows on hover, and smooth drawer/modal transitions.

---

## 📁 Project Structure

```
src/
├── components/          # UI components
│   ├── ui/              # AtomInput, SecureInput, SecureTextarea
│   ├── AppFooter.tsx    # Footer with links and modals
│   ├── CustomSelect.tsx # Generic custom dropdown component
│   ├── CustomTimePicker.tsx # Custom time selection picker
│   ├── Dashboard.tsx    # Stat cards and progress overview
│   ├── Layout.tsx       # Main page container and navigation shell
│   ├── LiveClock.tsx    # Animated live clock with seconds counter
│   ├── MessageModal.tsx # Popups for motivation and tired messages
│   ├── Onboarding.tsx   # First-time user greeting modal
│   ├── RewardPopup.tsx  # Floating celebration reward popups
│   ├── Settings.tsx     # User settings and data wipe controls
│   ├── TaskForm.tsx     # New / Edit task modal form
│   ├── TaskList.tsx     # Task list with drag-and-drop reordering
│   └── UserDelightPopup.tsx # Surprise motivational & emotional support
├── data/                # Static data & motivation libraries
│   ├── greetings.ts     # Time-aware greetings logic
│   └── motivation.ts    # Curated stories, quotes, and tired messages
├── hooks/               # Custom hooks (useDailyReset)
├── store/               # Zustand stores (useTaskStore, useNotificationStore)
├── types/               # TypeScript interfaces (Task, Subtask, Settings)
├── utils/               # Sanitization and helper utilities
├── App.tsx              # Main application orchestrator
├── index.css            # Tailwind v4 theme and design tokens
└── main.tsx             # React DOM root entrypoint
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ or 20+
* npm, pnpm, or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/praveenganthp/dailythings.git
   cd dailythings
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 👤 Author

Developed by **[Praveenganth](https://praveenganth-dev.netlify.app)**
* GitHub: [@praveenganthp](https://github.com/praveenganthp)
* Feedback: [vpraveenganth666@gmail.com](mailto:vpraveenganth666@gmail.com)
