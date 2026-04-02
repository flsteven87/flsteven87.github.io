# Personal Portfolio Redesign — From SaaS Landing Page to Personal Profile

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform flsteven87.github.io from a SaaS-style landing page into a professional personal portfolio that leads with identity and story, not product pitch.

**Architecture:** Same Astro 6 + Notion CMS stack. Restructure section order (Hero → About → Work → Contact), rewrite Hero to be identity-first (name + title + short intro), rewrite all copy from pitch tone to personal voice, and adjust component styling for a warmer, more human feel.

**Tech Stack:** Astro 6, Tailwind CSS v4, TypeScript, Notion API

---

## Diagnosis

Current page reads like a SaaS landing page:
- Hero has no name, no photo — just a product pitch ("I build AI systems that solve real business problems")
- "About" is buried below 3 project cards (user complaint: "我是誰放太下面")
- Copy uses investor/marketing language ("3 shipped products", "no prototypes, no demos")
- Project cards look like a product catalog, not personal case studies

Reference: Brittany Chiang, Jacek Hirsz — hero is NAME + one-line identity, about comes early, projects are case-study style.

---

## Task 1: Rewrite i18n copy — English (personal voice, not pitch)

**Files:**
- Modify: `src/i18n/en.ts`

**Step 1: Replace en.ts content**

```typescript
export const en = {
  meta: {
    title: "Steven Wu — AI Engineer & Product Builder",
    description:
      "Hi, I'm Steven. I design and build AI-native products — from LLM agents to full-stack SaaS.",
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
      "I started in psychology at NTU, fascinated by how people think and make decisions. That curiosity led me to data science — first at Appier, then at Novo Nordisk — where I spent years turning messy data into business insights.",
      "When LLMs arrived, I saw an opportunity to build products that actually understand context. Now I design and build AI-native SaaS products end-to-end: architecture, backend, frontend, deployment. Three products shipped, each solving a real problem in a different industry.",
      "I believe in building with taste — clean architecture, minimal UI, and systems that feel effortless to use.",
    ],
    skills_title: "What I Work With",
    skills: [
      "LLM Agent Architectures",
      "RAG & Retrieval Systems",
      "FastAPI / React / Flutter",
      "Supabase / PostgreSQL / GCP",
      "Shopify App Development",
      "LINE / Meta / Web Integrations",
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
```

Note: `hero` now has `greeting`, `name`, `title`, `intro` fields (replacing `headline`/`subheadline`). `contact` adds `github`. All copy shifted from pitch to personal voice.

**Step 2: Verify TypeScript compiles**

Run: `cd /Users/po-chi/Desktop/freelance/flsteven87.github.io && npx astro check 2>&1 | head -20`

Expected: Type errors in components that still expect old hero props — this is expected, fixed in Task 3.

**Step 3: Commit**

```bash
git add src/i18n/en.ts
git commit -m "content: rewrite English copy from SaaS pitch to personal voice"
```

---

## Task 2: Rewrite i18n copy — Chinese

**Files:**
- Modify: `src/i18n/zh.ts`

**Step 1: Replace zh.ts content**

```typescript
export const zh = {
  meta: {
    title: "Steven Wu — AI 工程師 & 產品打造者",
    description:
      "嗨，我是 Steven。我設計並打造 AI 原生產品 — 從 LLM Agent 到完整的 SaaS。",
  },
  hero: {
    greeting: "嗨，我是",
    name: "Steven Wu",
    title: "AI 工程師 & 產品打造者",
    intro:
      "我從零到一設計並交付 AI 原生產品。目前專注在 LLM、產品設計、與真實商業問題的交會點上。",
  },
  work: {
    title: "我做過的東西",
    cta: "閱讀案例",
  },
  about: {
    title: "關於我",
    bio: [
      "我在台大念心理系，對「人如何思考與決策」著迷。這份好奇心帶我走向資料科學 — 先在 Appier，後在 Novo Nordisk — 花了好幾年把混亂的數據變成商業洞察。",
      "當 LLM 出現時，我看到了一個機會：打造真正能理解語境的產品。現在我從零到一設計並交付 AI 原生 SaaS 產品：架構、後端、前端、部署一手包辦。三個產品已上線，各自解決不同產業的真實問題。",
      "我相信打造有品味的東西 — 乾淨的架構、極簡的 UI、用起來毫不費力的系統。",
    ],
    skills_title: "技術領域",
    skills: [
      "LLM Agent 架構設計",
      "RAG & 檢索系統",
      "FastAPI / React / Flutter",
      "Supabase / PostgreSQL / GCP",
      "Shopify App 開發",
      "LINE / Meta / Web 整合",
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
```

**Step 2: Commit**

```bash
git add src/i18n/zh.ts
git commit -m "content: rewrite Chinese copy to personal voice"
```

---

## Task 3: Redesign HeroSection — identity-first, not pitch-first

**Files:**
- Modify: `src/components/HeroSection.astro`

**Step 1: Replace HeroSection with identity-first design**

The new hero leads with name (large), one-line title, short intro paragraph, and subtle scroll indicator. Inspired by Brittany Chiang's layout: left-aligned, generous whitespace, no aggressive CTA.

```astro
---
interface Props {
  greeting: string;
  name: string;
  title: string;
  intro: string;
}

const { greeting, name, title, intro } = Astro.props;
---

<section class="flex min-h-[85vh] items-center px-6 pt-20">
  <div class="mx-auto w-full max-w-3xl">
    <p class="text-lg text-accent font-mono" data-animate>
      {greeting}
    </p>
    <h1
      class="mt-3 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl"
      data-animate
    >
      {name}
    </h1>
    <h2
      class="mt-4 text-3xl font-bold leading-tight tracking-tight text-text-secondary sm:text-4xl md:text-5xl"
      data-animate
    >
      {title}
    </h2>
    <p
      class="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary"
      data-animate
    >
      {intro}
    </p>
  </div>
</section>
```

Key changes:
- Left-aligned (not centered) — feels more personal, less corporate
- Name is the largest element (5xl-7xl) — identity first
- Title in `text-text-secondary` — supporting role
- Greeting in accent color + mono font — subtle personality
- No CTA button — let the content below speak

**Step 2: Verify it renders**

Run: `cd /Users/po-chi/Desktop/freelance/flsteven87.github.io && npx astro build 2>&1 | tail -10`

Expected: Build succeeds (page templates updated in Task 5 will wire new props).

**Step 3: Commit**

```bash
git add src/components/HeroSection.astro
git commit -m "design: redesign hero to identity-first layout with name prominence"
```

---

## Task 4: Restyle AboutSection — warmer, more personal

**Files:**
- Modify: `src/components/AboutSection.astro`

**Step 1: Update AboutSection styling**

Add a subtle left accent border to the bio for visual warmth. Keep skills grid but make it feel less like a resume bullet list.

```astro
---
interface Props {
  title: string;
  bio: string[];
  skillsTitle: string;
  skills: string[];
}

const { title, bio, skillsTitle, skills } = Astro.props;
---

<section id="about" class="px-6 py-24" data-animate>
  <div class="mx-auto max-w-3xl">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    <div class="mt-8 space-y-4 border-l-2 border-accent/20 pl-6 text-lg leading-relaxed text-text-secondary">
      {bio.map((paragraph) => <p>{paragraph}</p>)}
    </div>
    <div class="mt-12">
      <h3 class="text-sm font-semibold uppercase tracking-wider text-text-secondary">{skillsTitle}</h3>
      <div class="mt-4 flex flex-wrap gap-2">
        {
          skills.map((skill) => (
            <span class="rounded-full border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-accent/40 hover:text-text">
              {skill}
            </span>
          ))
        }
      </div>
    </div>
  </div>
</section>
```

Changes:
- Bio gets `border-l-2 border-accent/20 pl-6` — subtle accent border, feels like a personal note
- Skills: from bullet list to pill tags (rounded-full border) — more modern, interactive feel
- Skills title: uppercase + tracking-wider — section label style, not heading

**Step 2: Commit**

```bash
git add src/components/AboutSection.astro
git commit -m "design: restyle about section with accent border and pill tags"
```

---

## Task 5: Restructure page order — About before Work

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/zh/index.astro`

**Step 1: Update English index.astro**

Move AboutSection above the Work section and wire new Hero props.

```astro
---
import Layout from "../layouts/Layout.astro";
import HeroSection from "../components/HeroSection.astro";
import ProjectCard from "../components/ProjectCard.astro";
import AboutSection from "../components/AboutSection.astro";
import ContactSection from "../components/ContactSection.astro";
import { t } from "../i18n";
import { getProjects } from "../lib/notion";

const lang = "en";
const i = t(lang);
const projects = await getProjects();
---

<Layout title={i.meta.title} description={i.meta.description} lang={lang}>
  <HeroSection
    greeting={i.hero.greeting}
    name={i.hero.name}
    title={i.hero.title}
    intro={i.hero.intro}
  />

  <AboutSection
    title={i.about.title}
    bio={i.about.bio}
    skillsTitle={i.about.skills_title}
    skills={i.about.skills}
  />

  <section id="work" class="px-6 py-24">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {i.work.title}
      </h2>
      <div class="mt-12 grid gap-6">
        {
          projects.map((project) => (
            <ProjectCard
              name={project.name}
              tagline={project.tagline}
              domain={project.domain}
              techStack={project.techStack}
              category={project.category}
              slug={project.slug}
              cta={i.work.cta}
              lang={lang}
            />
          ))
        }
      </div>
    </div>
  </section>

  <ContactSection
    title={i.contact.title}
    description={i.contact.description}
    email={i.contact.email}
    linkedin={i.contact.linkedin}
    cta={i.contact.cta}
  />
</Layout>
```

**Step 2: Update Chinese zh/index.astro**

Same restructure — About before Work, new Hero props.

```astro
---
import Layout from "../../layouts/Layout.astro";
import HeroSection from "../../components/HeroSection.astro";
import ProjectCard from "../../components/ProjectCard.astro";
import AboutSection from "../../components/AboutSection.astro";
import ContactSection from "../../components/ContactSection.astro";
import { t } from "../../i18n";
import { getProjects } from "../../lib/notion";

const lang = "zh";
const i = t(lang);
const projects = await getProjects();
---

<Layout title={i.meta.title} description={i.meta.description} lang={lang}>
  <HeroSection
    greeting={i.hero.greeting}
    name={i.hero.name}
    title={i.hero.title}
    intro={i.hero.intro}
  />

  <AboutSection
    title={i.about.title}
    bio={i.about.bio}
    skillsTitle={i.about.skills_title}
    skills={i.about.skills}
  />

  <section id="work" class="px-6 py-24">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {i.work.title}
      </h2>
      <div class="mt-12 grid gap-6">
        {
          projects.map((project) => (
            <ProjectCard
              name={project.name}
              tagline={project.taglineZh || project.tagline}
              domain={project.domain}
              techStack={project.techStack}
              category={project.category}
              slug={project.slug}
              cta={i.work.cta}
              lang={lang}
            />
          ))
        }
      </div>
    </div>
  </section>

  <ContactSection
    title={i.contact.title}
    description={i.contact.description}
    email={i.contact.email}
    linkedin={i.contact.linkedin}
    cta={i.contact.cta}
  />
</Layout>
```

**Step 3: Build and verify**

Run: `cd /Users/po-chi/Desktop/freelance/flsteven87.github.io && npx astro build 2>&1 | tail -15`

Expected: Clean build, all pages generated.

**Step 4: Commit**

```bash
git add src/pages/index.astro src/pages/zh/index.astro
git commit -m "layout: move about section above work, wire new hero props"
```

---

## Task 6: Update ContactSection — add GitHub link, softer tone

**Files:**
- Modify: `src/components/ContactSection.astro`

**Step 1: Add GitHub link prop and refine layout**

```astro
---
interface Props {
  title: string;
  description: string;
  email: string;
  linkedin: string;
  github?: string;
  cta: string;
}

const { title, description, email, linkedin, github, cta } = Astro.props;
---

<section id="contact" class="px-6 py-24" data-animate>
  <div class="mx-auto max-w-3xl">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    <p class="mt-4 text-lg text-text-secondary">{description}</p>
    <div class="mt-8 flex flex-wrap items-center gap-4">
      <a
        href={`mailto:${email}`}
        class="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        {cta}
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
      >
        LinkedIn
      </a>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
        >
          GitHub
        </a>
      )}
    </div>
  </div>
</section>
```

Changes:
- Left-aligned (removed `text-center`) — consistent with hero
- Added optional `github` prop
- `flex-wrap` for mobile responsiveness

**Step 2: Wire github prop in both index pages**

In `src/pages/index.astro` and `src/pages/zh/index.astro`, update `<ContactSection>`:

```astro
<ContactSection
  title={i.contact.title}
  description={i.contact.description}
  email={i.contact.email}
  linkedin={i.contact.linkedin}
  github={i.contact.github}
  cta={i.contact.cta}
/>
```

**Step 3: Commit**

```bash
git add src/components/ContactSection.astro src/pages/index.astro src/pages/zh/index.astro
git commit -m "design: add GitHub link to contact, left-align layout"
```

---

## Task 7: Update Header nav order to match page structure

**Files:**
- Modify: `src/components/Header.astro`

**Step 1: Reorder nav links to About → Work → Contact**

```astro
---
import LanguageSwitcher from "./LanguageSwitcher.astro";

interface Props {
  lang: "en" | "zh";
}

const { lang } = Astro.props;

const nav = {
  en: { about: "About", work: "Work", contact: "Contact" },
  zh: { about: "關於", work: "作品", contact: "聯絡" },
};

const t = nav[lang];
const prefix = lang === "zh" ? "/zh" : "";
---

<header
  class="fixed top-0 z-50 w-full border-b border-border/50 bg-bg/80 backdrop-blur-md"
>
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a
      href={`${prefix}/`}
      class="text-lg font-semibold tracking-tight text-text"
    >
      Steven Wu
    </a>
    <div class="flex items-center gap-6">
      <a
        href={`${prefix}/#about`}
        class="text-sm text-text-secondary transition-colors hover:text-text"
      >
        {t.about}
      </a>
      <a
        href={`${prefix}/#work`}
        class="text-sm text-text-secondary transition-colors hover:text-text"
      >
        {t.work}
      </a>
      <a
        href={`${prefix}/#contact`}
        class="text-sm text-text-secondary transition-colors hover:text-text"
      >
        {t.contact}
      </a>
      <LanguageSwitcher lang={lang} />
    </div>
  </nav>
</header>
```

**Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "nav: reorder links to match page structure (about → work → contact)"
```

---

## Task 8: Final build verification & deploy

**Step 1: Full build**

Run: `cd /Users/po-chi/Desktop/freelance/flsteven87.github.io && npx astro build 2>&1`

Expected: Clean build, all 8 pages generated (en: index, 3 project pages; zh: index, 3 project pages).

**Step 2: Local preview**

Run: `cd /Users/po-chi/Desktop/freelance/flsteven87.github.io && npx astro preview`

User manually checks: hero shows name prominently, about is second section, projects third.

**Step 3: Push to deploy**

```bash
git push origin main
```

GitHub Actions will auto-deploy to flsteven87.github.io.

---

## Summary of Changes

| Before (SaaS style) | After (Personal portfolio) |
|---|---|
| Hero: "I build AI systems..." (no name) | Hero: "Hi, I'm **Steven Wu**" + title + intro |
| Center-aligned hero | Left-aligned hero |
| Section order: Hero → Work → About → Contact | Section order: Hero → About → Work → Contact |
| Pitch copy ("no prototypes, no demos") | Personal narrative (psychology → data → AI) |
| Skills as bullet list | Skills as pill tags |
| No GitHub link | GitHub in contact section |
| Nav: Work → About → Contact | Nav: About → Work → Contact |
