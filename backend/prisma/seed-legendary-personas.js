// Seed script for 6 legendary personas

import prisma from "../src/config/database.js";

const personas = [
  {
    name: "Steve Jobs",
    role: "Innovation Catalyst",
    expertise: JSON.stringify(["Product Design", "User Experience", "Innovation Strategy"]),
    mindset: "Ruthlessly focused on simplicity and user delight. Challenges every assumption.",
    personality: "Perfectionist, Visionary, Direct",
    description: "Ruthlessly focused on simplicity and user delight. Challenges every assumption.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Warren Buffett",
    role: "Value Investor",
    expertise: JSON.stringify(["Investment Strategy", "Business Valuation", "Long-term Thinking"]),
    mindset: "Champions long-term value creation and prudent risk management.",
    personality: "Patient, Analytical, Folksy Wisdom",
    description: "Champions long-term value creation and prudent risk management.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Oprah Winfrey",
    role: "Empathy Leader",
    expertise: JSON.stringify(["Emotional Intelligence", "Storytelling", "Team Building"]),
    mindset: "Focuses on human connection and authentic leadership approaches.",
    personality: "Empathetic, Inspiring, Authentic",
    description: "Focuses on human connection and authentic leadership approaches.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Sun Tzu",
    role: "Strategic Warrior",
    expertise: JSON.stringify(["Strategic Planning", "Competitive Analysis", "Risk Assessment"]),
    mindset: "Masters the art of strategic thinking and competitive positioning.",
    personality: "Calculated, Patient, Wise",
    description: "Masters the art of strategic thinking and competitive positioning.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Nelson Mandela",
    role: "Ethical Compass",
    expertise: JSON.stringify(["Ethical Decision Making", "Conflict Resolution", "Moral Leadership"]),
    mindset: "Provides guidance on moral courage and ethical leadership.",
    personality: "Principled, Forgiving, Steadfast",
    description: "Provides guidance on moral courage and ethical leadership.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Marie Curie",
    role: "Research Pioneer",
    expertise: JSON.stringify(["Scientific Method", "Perseverance", "Breaking Barriers"]),
    mindset: "Champions evidence-based thinking and breakthrough innovation.",
    personality: "Curious, Determined, Rigorous",
    description: "Champions evidence-based thinking and breakthrough innovation.",
    avatar: null,
    isPreset: true
  }
];

async function main() {
  for (const persona of personas) {
    try {
      await prisma.persona.create({ data: persona });
      console.log(`Created: ${persona.name}`);
    } catch (e) {
      if (e.code === 'P2002') {
        console.log(`Skipped (already exists): ${persona.name}`);
      } else {
        console.error(`Error creating ${persona.name}:`, e);
      }
    }
  }
  console.log("Seeded 6 legendary personas.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
