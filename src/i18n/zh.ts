export const zh = {
  meta: {
    title: "Steven Wu — AI/LLM 工程師 & 產品打造者",
    description:
      "用 LangGraph、自建 memory 系統和 eval 框架打造 production agent 系統。三個 SaaS 產品已上線。",
  },
  hero: {
    greeting: "嗨，我是",
    name: "Steven Wu",
    title: "AI 工程師 & 產品打造者",
    intro:
      "從零到一設計並交付 AI 原生產品，專注在 LLM、產品設計與真實商業問題的交會點。",
  },
  work: {
    title: "我做過的東西",
    cta: "閱讀案例",
  },
  about: {
    title: "關於我",
    bio: [
      "台大心理系畢業，畢業後做了八年的數據工作，從分析 dashboard 做到自己建完整產品。",
      "在 Novo Nordisk 用 Snowflake 和 dbt 重建報表系統，原本一週的工作現在一天完成。在 Appier 建了反詐欺偵測系統，抓到超過 $1M 的假廣告流量，也寫了競價演算法讓 campaign ROI 提升 5% 到 40%。",
      "工作之餘自己造產品，三個已上線：AI Commerce Ready（Shopify 商品資料優化，對接 ChatGPT/Gemini 購物）、NexRex（AI 跑步教練，用 LangGraph agent、3 層記憶系統和自建 eval 指標）、Replai（no-code chatbot builder，有 RAG）。",
      "心理系的訓練比預期有用。人怎麼讀資訊、信任什麼、在哪裡卡住。我設計 prompt 和資料產品時都在用這些。",
      "用 AI coding agent 全職開發超過一年。Claude Code Max 八個月，之前是 Cursor。不只是下 prompt，而是建整套系統：15 個自訂命令、自動格式化 hook、跨 session 的記憶系統，還有一個讓 agent 自己規劃、實作、測試、review 然後循環的回饋迴路。整套配置已經開源。",
    ],
    skills_title: "技術領域",
    skills: [
      "LangGraph / LangChain / LangMem / Mem0",
      "DeepEval / Langfuse / 自建 G-Eval 指標",
      "Context Engineering / RAG / ChromaDB",
      "FastAPI / React / Flutter / Astro",
      "Supabase / PostgreSQL / GCP / Cloudflare",
      "Shopify App / LINE / Meta 整合",
    ],
  },
  contact: {
    title: "聯絡我",
    description: "目前開放 AI/LLM 系統相關的接案與顧問合作。聊聊吧。",
    email: "flsteven87@gmail.com",
    linkedin: "https://www.linkedin.com/in/flsteven87/",
    github: "https://github.com/flsteven87",
    cta: "打聲招呼",
  },
  project: {
    challenge: "挑戰",
    solution: "解決方案",
    features: "核心功能",
    tech: "技術棧",
    visit: "前往網站",
    back: "返回首頁",
    details_available: "Production 級程式碼 — 細節可另行提供。",
  },
} as const;
