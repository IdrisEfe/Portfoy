export type Locale = "en" | "tr";

export const copy = {
  en: {
    nav: { home: "Home", work: "Work", lab: "Laboratory", now: "Now", skills: "Skills map", journey: "Journey", about: "About", contact: "Contact" },
    hero: ["I know what you want.", "Someone you’ll never forget."],
    descriptor: "Self-taught ambitious builder",
    intro: "I turn questions into working systems, experiments, and stories worth following.",
    cta: "Let’s start from here",
    status: "Building the next useful thing",
    recent: "Recently in motion",
    selected: "Selected signals",
    availability: "Open to thoughtful collaborations",
  },
  tr: {
    nav: { home: "Ana sayfa", work: "İşler", lab: "Laboratuvar", now: "Şimdi", skills: "Yetenek haritası", journey: "Yolculuk", about: "Hakkımda", contact: "İletişim" },
    hero: ["Neden burada olduğunu biliyorum.", "Asla unutamayacağın biriyim."],
    descriptor: "Kendi kendini yetiştiren, hırslı bir üretici",
    intro: "Soruları çalışan sistemlere, deneylere ve takip etmeye değer hikâyelere dönüştürüyorum.",
    cta: "Eee, ne duruyoruz?",
    status: "Sıradaki faydalı şeyi geliştiriyorum",
    recent: "Son hareketler",
    selected: "Seçili sinyaller",
    availability: "Özenli iş birliklerine açığım",
  },
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/IdrisEfe" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/i-efe-ye%C5%9Filda%C4%9F-0a6687313/" },
  { label: "Spotify", href: "https://open.spotify.com/user/315dpafnk4ltjujjxqc2gjzllor4?si=e6d06874ffa349bc" },
  { label: "Email", href: "mailto:i.efeyesildag@gmail.com" },
] as const;

export const skills = [
  { name: "Building", items: ["Product thinking", "Rapid prototyping", "Systems design"] },
  { name: "Engineering", items: ["Web applications", "APIs", "Automation"] },
  { name: "Exploring", items: ["Creative coding", "Agentic systems", "Interactive media"] },
];

export const milestones = [
  { year: "Now", title: "Building in public", body: "Turning active repositories, experiments, and learning into a living body of work." },
  { year: "Next", title: "A wider laboratory", body: "Small ideas become interactive systems, then useful products." },
  { year: "Always", title: "Self-taught by design", body: "Learning by making, documenting the process, and improving the next attempt." },
];
