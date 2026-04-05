export const en = {
  meta: {
    title: "Steven Wu — AI/LLM Engineer & Product Builder",
    description:
      "I build production agent systems with LangGraph, custom memory, and eval frameworks. Three SaaS products shipped.",
  },
  hero: {
    greeting: "Hi, I'm",
    name: "Steven Wu",
    title: "AI Engineer & Product Builder",
    intro:
      "I design and ship AI-native products end-to-end. Currently building at the intersection of LLMs, product design, and real-world business problems.",
  },
  work: {
    title: "What I've Built",
    cta: "Read case study",
  },
  about: {
    title: "About Me",
    bio: [
      "I studied psychology at NTU. Ended up doing data work after graduation and kept going for eight years, from analyst dashboards to building entire products.",
      "At Novo Nordisk I rebuilt reporting on Snowflake and dbt. What used to take a week takes a day. At Appier I built anti-fraud detection that caught over $1M in fake ad spend, and wrote bidding algorithms that improved campaign ROI between 5% and 40%.",
      "I also build my own products, mostly outside work hours. Three are live: AI Commerce Ready (Shopify feed optimization for ChatGPT/Gemini shopping), NexRex (AI running coach with LangGraph agent, 3-tier memory, custom eval suite), and Replai (no-code chatbot builder with RAG).",
      "The psych degree helps more than I expected. How people read information, what they trust, where they get confused. I use that when I design prompts and data products.",
      "I've been using AI coding agents full-time for over a year. Eight months on Claude Code Max, before that Cursor. Not just prompting, but building the system around it: 15 custom commands, automated formatting hooks, a memory system that persists context across sessions, and a feedback loop where the agent plans, builds, tests, and reviews its own work in cycles. I open-sourced the whole setup.",
    ],
    skills_title: "What I Work With",
    skills: [
      "LangGraph / LangChain / LangMem / Mem0",
      "DeepEval / Langfuse / Custom G-Eval",
      "Context Engineering / RAG / ChromaDB",
      "FastAPI / React / Flutter / Astro",
      "Supabase / PostgreSQL / GCP / Cloudflare",
      "Shopify App / LINE / Meta Integrations",
    ],
  },
  contact: {
    title: "Get in Touch",
    description:
      "Open to freelance projects and consulting in AI/LLM systems. Let's talk.",
    email: "flsteven87@gmail.com",
    linkedin: "https://www.linkedin.com/in/flsteven87/",
    github: "https://github.com/flsteven87",
    cta: "Say hello",
  },
  project: {
    challenge: "Challenge",
    solution: "Solution",
    features: "Key Features",
    tech: "Tech Stack",
    visit: "Visit Site",
    back: "Back to home",
    details_available: "Production codebase — details available upon request.",
  },
} as const;
