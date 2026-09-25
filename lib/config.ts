import type { Pillar } from "@/types";

export const product = {
  name: "UNKILLABLE",
  domain: "unkillable.app",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://unkillable.app",
  title: "Unkillable — Become Harder to Break",
  description:
    "Build the habits, systems, and resilience that keep you moving when life gets difficult. Unkillable turns consistency into a system.",
  tagline: "Become harder to break.",
} as const;

export const marketingNav = [
  { label: "Method", href: "#method" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
] as const;

export const appNav = [
  { label: "Overview", href: "/app", icon: "grid" },
  { label: "Today", href: "/app/today", icon: "check" },
  { label: "Pillars", href: "/app/pillars", icon: "hex" },
  { label: "Analytics", href: "/app/analytics", icon: "chart" },
  { label: "Review", href: "/app/review", icon: "review" },
  { label: "Settings", href: "/app/settings", icon: "settings" },
] as const;

export const pillarDefinitions: Record<Pillar, {
  label: string;
  description: string;
  detail: string;
  sample: string;
  glyph: string;
}> = {
  body: {
    label: "BODY",
    description: "Strength, cardiovascular health, movement, nutrition.",
    detail: "Physical capacity that gives the rest of your system room to work.",
    sample: "Strength training",
    glyph: "B",
  },
  mind: {
    label: "MIND",
    description: "Focus, learning, emotional regulation, reflection.",
    detail: "Attention and perspective you can still access under pressure.",
    sample: "Read 20 pages",
    glyph: "M",
  },
  discipline: {
    label: "DISCIPLINE",
    description: "Keeping commitments regardless of mood.",
    detail: "Reliable follow-through when enthusiasm disappears.",
    sample: "Deep work",
    glyph: "D",
  },
  recovery: {
    label: "RECOVERY",
    description: "Sleep, rest, stress management, deliberate recovery.",
    detail: "The capacity to absorb load without slowly running yourself down.",
    sample: "Sleep before 23:00",
    glyph: "R",
  },
  relationships: {
    label: "RELATIONSHIPS",
    description: "Maintaining the people and connections that keep life meaningful.",
    detail: "The people you stay connected to, especially when life gets crowded.",
    sample: "Call family",
    glyph: "R",
  },
  purpose: {
    label: "PURPOSE",
    description: "Meaningful work, direction, contribution, long-term goals.",
    detail: "A reason to keep moving that survives a bad week.",
    sample: "Move one key project forward",
    glyph: "P",
  },
};

export const pricing = {
  free: {
    name: "FREE",
    price: "$0",
    cadence: "forever",
    features: [
      "Daily protocol",
      "Up to 5 active habits",
      "Basic streaks",
      "Minimum Day",
      "Weekly overview",
    ],
    cta: "Start free",
  },
  pro: {
    name: "UNKILLABLE PRO",
    monthly: "$9",
    yearly: "$79",
    yearlyNote: "Save $29 a year",
    features: [
      "Unlimited habits",
      "Full resilience score",
      "Six-pillar analytics",
      "Advanced insights",
      "90/365-day trends",
      "Custom protocols",
      "Unlimited history",
      "Weekly review",
      "Future premium features",
    ],
    cta: "Build your system →",
  },
} as const;

export const testimonials = [
  {
    quote: "The biggest change is what happens after I miss. I used to write off the week. Now I reset the next day.",
    person: "Sample user — product research placeholder",
    outcome: "Faster recovery after missed days",
  },
  {
    quote: "Minimum Day made travel stop being a loophole. I can keep the system alive without pretending every day is normal.",
    person: "Sample user — product research placeholder",
    outcome: "Consistency while traveling",
  },
  {
    quote: "It feels less like chasing streaks and more like proving I can rely on myself when things get messy.",
    person: "Sample user — product research placeholder",
    outcome: "Less all-or-nothing thinking",
  },
] as const;
