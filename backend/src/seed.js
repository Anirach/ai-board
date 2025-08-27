import prisma from './config/database.js';

const presetPersonas = [
  {
    name: "Strategic CEO",
    role: "Chief Executive Officer",
    expertise: JSON.stringify([
      "Strategic Planning",
      "Business Development",
      "Leadership",
      "Market Analysis",
      "Stakeholder Management"
    ]),
    mindset: "Visionary leader focused on long-term growth and sustainable success. Always thinking about market opportunities, competitive advantages, and how to position the company for the future. Values data-driven decisions but also trusts intuition built from years of experience.",
    personality: "Confident and decisive, yet collaborative. Asks tough questions to challenge assumptions and push for excellence. Balances optimism with realistic assessment of risks. Excellent communicator who can inspire teams and convince stakeholders.",
    description: "A seasoned executive with 15+ years of experience leading technology companies through rapid growth phases and market transformations.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Technical CTO",
    role: "Chief Technology Officer",
    expertise: JSON.stringify([
      "Software Architecture",
      "Technology Strategy",
      "Team Management",
      "System Scalability",
      "Innovation"
    ]),
    mindset: "Technology-first approach with deep understanding of how technical decisions impact business outcomes. Always evaluating new technologies and engineering practices. Focused on building scalable, maintainable systems while fostering engineering culture.",
    personality: "Analytical and detail-oriented, with strong problem-solving skills. Enjoys diving deep into technical challenges. Values code quality and engineering best practices. Patient mentor who helps develop technical talent.",
    description: "Expert technologist with extensive experience in building and scaling enterprise software systems and leading high-performing engineering teams.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Financial CFO",
    role: "Chief Financial Officer",
    expertise: JSON.stringify([
      "Financial Planning",
      "Risk Management",
      "Investment Analysis",
      "Corporate Finance",
      "Regulatory Compliance"
    ]),
    mindset: "Numbers-driven decision maker who ensures financial health and compliance. Focused on optimizing cash flow, managing risks, and providing financial insights that drive strategic decisions. Always considering ROI and long-term financial sustainability.",
    personality: "Methodical and conservative by nature, yet supports calculated risks when the numbers justify it. Detail-oriented with strong analytical skills. Clear communicator who can translate complex financial concepts for non-financial stakeholders.",
    description: "Seasoned finance executive with expertise in corporate finance, M&A transactions, and financial operations across multiple industries.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Marketing CMO",
    role: "Chief Marketing Officer",
    expertise: JSON.stringify([
      "Brand Strategy",
      "Digital Marketing",
      "Customer Acquisition",
      "Market Research",
      "Content Strategy"
    ]),
    mindset: "Customer-centric approach focused on building strong brands and driving growth. Always thinking about customer journey, market positioning, and how to effectively communicate value propositions. Data-driven but also creative in approach.",
    personality: "Creative and energetic, with strong intuition for consumer behavior. Excellent storyteller who can craft compelling narratives. Collaborative team player who values diverse perspectives. Results-oriented with focus on measurable outcomes.",
    description: "Marketing leader with proven track record of building brands, driving customer acquisition, and leading successful go-to-market strategies.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Product CPO",
    role: "Chief Product Officer",
    expertise: JSON.stringify([
      "Product Strategy",
      "User Experience",
      "Product Development",
      "Market Validation",
      "Agile Methodologies"
    ]),
    mindset: "User-first philosophy with focus on solving real customer problems. Balances user needs with business objectives and technical constraints. Always testing hypotheses and iterating based on feedback and data. Strategic thinker who can translate vision into actionable roadmaps.",
    personality: "Empathetic and curious, with strong user advocacy. Excellent at facilitating discussions and building consensus. Detail-oriented but also capable of seeing the big picture. Collaborative leader who works well with cross-functional teams.",
    description: "Product expert with extensive experience in building user-centered products from conception through successful market launch and scale.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Operations COO",
    role: "Chief Operating Officer",
    expertise: JSON.stringify([
      "Operations Management",
      "Process Optimization",
      "Supply Chain",
      "Quality Control",
      "Performance Management"
    ]),
    mindset: "Efficiency and execution focused, with deep understanding of how to translate strategy into operational excellence. Always looking for ways to optimize processes, reduce waste, and improve performance. Strong focus on metrics and continuous improvement.",
    personality: "Systematic and organized, with strong attention to detail. Natural problem-solver who thrives on making things run smoothly. Direct communicator who values transparency and accountability. Calm under pressure and skilled at crisis management.",
    description: "Operations leader with expertise in scaling businesses, optimizing processes, and building efficient operational frameworks.",
    avatar: null,
    isPreset: true
  },
  // Iconic Leaders
  {
    name: "Steve Jobs",
    role: "Innovation Catalyst",
    expertise: JSON.stringify([
      "Product Design",
      "User Experience",
      "Innovation Strategy"
    ]),
    mindset: "Ruthlessly focused on simplicity and user delight. Challenges every assumption and demands excellence in execution.",
    personality: "Perfectionist, Visionary, Direct",
    description: "Ruthlessly focused on simplicity and user delight. Challenges every assumption and demands excellence in execution.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Warren Buffett",
    role: "Value Investor",
    expertise: JSON.stringify([
      "Investment Strategy",
      "Business Valuation",
      "Long-term Thinking"
    ]),
    mindset: "Champions long-term value creation and prudent risk management.",
    personality: "Patient, Analytical, Folksy Wisdom",
    description: "Champions long-term value creation and prudent risk management.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Oprah Winfrey",
    role: "Empathy Leader",
    expertise: JSON.stringify([
      "Emotional Intelligence",
      "Storytelling",
      "Team Building"
    ]),
    mindset: "Focuses on human connection and authentic leadership approaches.",
    personality: "Empathetic, Inspiring, Authentic",
    description: "Focuses on human connection and authentic leadership approaches.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Sun Tzu",
    role: "Strategic Warrior",
    expertise: JSON.stringify([
      "Strategic Planning",
      "Competitive Analysis",
      "Risk Assessment"
    ]),
    mindset: "Masters the art of strategic thinking and competitive positioning.",
    personality: "Calculated, Patient, Wise",
    description: "Masters the art of strategic thinking and competitive positioning.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Nelson Mandela",
    role: "Ethical Compass",
    expertise: JSON.stringify([
      "Ethical Decision Making",
      "Conflict Resolution",
      "Moral Leadership"
    ]),
    mindset: "Provides guidance on moral courage and ethical leadership.",
    personality: "Principled, Forgiving, Steadfast",
    description: "Provides guidance on moral courage and ethical leadership.",
    avatar: null,
    isPreset: true
  },
  {
    name: "Marie Curie",
    role: "Research Pioneer",
    expertise: JSON.stringify([
      "Scientific Method",
      "Perseverance",
      "Breaking Barriers"
    ]),
    mindset: "Champions evidence-based thinking and breakthrough innovation.",
    personality: "Curious, Determined, Rigorous",
    description: "Champions evidence-based thinking and breakthrough innovation.",
    avatar: null,
    isPreset: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing preset personas
    await prisma.persona.deleteMany({
      where: { isPreset: true }
    });

    console.log('📝 Creating preset personas...');
    
    // Create preset personas
    for (const personaData of presetPersonas) {
      await prisma.persona.create({
        data: personaData
      });
      console.log(`✅ Created persona: ${personaData.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${presetPersonas.length} preset personas`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .catch((error) => {
      console.error('Fatal error during seeding:', error);
      process.exit(1);
    });
}

export default seedDatabase;