export interface GreetingInfo {
  text: string;
  sub: string;
  dot: string;
}

export function getGreeting(): GreetingInfo {
  const h = new Date().getHours();
  if (h >= 0 && h < 5) {
    return {
      text: "Go to Sleep",
      sub: "don't be like this, be gentle on you. go - sleep like this",
      dot: "#64748B",
    };
  }
  if (h >= 5 && h < 12) {
    return {
      text: "Good Morning",
      sub: "Ready to win the day? ✨",
      dot: "#22C55E",
    };
  }
  if (h >= 12 && h < 17) {
    return {
      text: "Good Afternoon",
      sub: "Keep the momentum going 🚀",
      dot: "#6366F1",
    };
  }
  if (h >= 17 && h < 22) {
    return {
      text: "Good Evening",
      sub: "Wrapping up strong 💪",
      dot: "#F59E0B",
    };
  }
  return {
    text: "It's Late",
    sub: "Rest up for tomorrow 😴",
    dot: "#94A3B8",
  };
}
