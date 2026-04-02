# Portfolio Site Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a dark-mode, i18n (EN/ZH) portfolio site on flsteven87.github.io showcasing 3 AI/LLM SaaS products, optimized for freelance/job conversion.

**Architecture:** Astro static site with Notion Database as CMS. Custom Notion loader fetches project data at build time. i18n via Astro's built-in path-prefix routing (`/` = EN, `/zh/` = ZH). Tailwind CSS v4 for styling. GitHub Actions auto-deploys to GitHub Pages on push.

**Tech Stack:** Astro 5, Tailwind CSS v4 (`@tailwindcss/vite`), `@notionhq/client`, TypeScript, GitHub Actions (`withastro/action@v5`)

**Notion Database ID:** `336b0ea7-2ead-81ee-bbe7-e2bbed231d70`

**Design System:**
- BG: `#0A0A0A`, Surface: `#141414`, Border: `#262626`
- Text: `#FAFAFA` / `#A1A1AA`, Accent: `#3B82F6` / `#60A5FA`
- Font: Inter (headings 700, body 400), JetBrains Mono (code/tags)
- Motion: 200ms ease, scroll fade-in via IntersectionObserver, Astro View Transitions

---

## Task 1: Astro Project Scaffold

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.github/workflows/deploy.yml`
- Modify: `.gitignore`

**Step 1: Initialize Astro project**

Run:
```bash
cd /Users/po-chi/Desktop/freelance/flsteven87.github.io
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

If prompted about overwriting, accept. Then:
```bash
npm install
```

**Step 2: Install dependencies**

Run:
```bash
npm install @notionhq/client
npm install -D tailwindcss @tailwindcss/vite
```

**Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://flsteven87.github.io",

  i18n: {
    locales: ["en", "zh"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Step 4: Update .gitignore**

Append to `.gitignore`:
```
# Astro
dist/
.astro/
node_modules/

# Environment
.env
.env.*
.mcp.json
.DS_Store
```

**Step 5: Create GitHub Actions workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:
  schedule:
    - cron: "0 */12 * * *"

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build with Astro
        uses: withastro/action@v3
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 6: Verify build works**

Run:
```bash
npm run build
```
Expected: Build succeeds with default Astro minimal template output.

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Tailwind v4, i18n, and GH Pages workflow"
```

---

## Task 2: Design System + Layout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/LanguageSwitcher.astro`

**Step 1: Create global styles**

Create `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-bg: #0A0A0A;
  --color-surface: #141414;
  --color-border: #262626;
  --color-text: #FAFAFA;
  --color-text-secondary: #A1A1AA;
  --color-accent: #3B82F6;
  --color-accent-hover: #60A5FA;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

**Step 2: Create Layout component**

Create `src/layouts/Layout.astro`:

```astro
---
import { ClientRouter } from "astro:transitions";
import Header from "../components/Header.astro";
import Footer from "../components/Footer.astro";
import "../styles/global.css";

interface Props {
  title: string;
  description: string;
  lang?: "en" | "zh";
}

const { title, description, lang = "en" } = Astro.props;
---

<!doctype html>
<html lang={lang} class="bg-bg text-text">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <title>{title}</title>
    <ClientRouter />
  </head>
  <body class="min-h-screen font-sans antialiased">
    <Header lang={lang} />
    <main>
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

**Step 3: Create Header component**

Create `src/components/Header.astro`:

```astro
---
import LanguageSwitcher from "./LanguageSwitcher.astro";

interface Props {
  lang: "en" | "zh";
}

const { lang } = Astro.props;

const nav = {
  en: { work: "Work", about: "About", contact: "Contact" },
  zh: { work: "作品", about: "關於", contact: "聯絡" },
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
        href={`${prefix}/#work`}
        class="text-sm text-text-secondary transition-colors hover:text-text"
      >
        {t.work}
      </a>
      <a
        href={`${prefix}/#about`}
        class="text-sm text-text-secondary transition-colors hover:text-text"
      >
        {t.about}
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

**Step 4: Create LanguageSwitcher component**

Create `src/components/LanguageSwitcher.astro`:

```astro
---
interface Props {
  lang: "en" | "zh";
}

const { lang } = Astro.props;
const currentPath = Astro.url.pathname;

function getSwitchedPath(currentPath: string, currentLang: string): string {
  if (currentLang === "en") {
    return `/zh${currentPath}`;
  }
  return currentPath.replace(/^\/zh/, "") || "/";
}

const switchedPath = getSwitchedPath(currentPath, lang);
const switchLabel = lang === "en" ? "中文" : "EN";
---

<a
  href={switchedPath}
  class="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-accent hover:text-accent"
>
  {switchLabel}
</a>
```

**Step 5: Create Footer component**

Create `src/components/Footer.astro`:

```astro
---
interface Props {
  lang: "en" | "zh";
}

const { lang } = Astro.props;
const year = new Date().getFullYear();
const copy = lang === "zh" ? `${year} Steven Wu` : `${year} Steven Wu`;
---

<footer class="border-t border-border/50 py-8">
  <div class="mx-auto max-w-5xl px-6 text-center text-sm text-text-secondary">
    &copy; {copy}
  </div>
</footer>
```

**Step 6: Verify build**

Run:
```bash
npm run build
```
Expected: Build succeeds (no pages yet, but layout compiles).

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add design system, layout, header, footer, language switcher"
```

---

## Task 3: i18n Content System

**Files:**
- Create: `src/i18n/en.ts`
- Create: `src/i18n/zh.ts`
- Create: `src/i18n/index.ts`

**Step 1: Create English translations**

Create `src/i18n/en.ts`:

```typescript
export const en = {
  meta: {
    title: "Steven Wu — AI Systems Engineer",
    description:
      "I build AI systems that solve real business problems. From LLM agents to production SaaS.",
  },
  hero: {
    headline: "I build AI systems that solve real business problems.",
    subheadline:
      "From LLM agents to production SaaS — 3 shipped products, each solving a different industry challenge.",
  },
  work: {
    title: "Featured Work",
    cta: "View case study",
  },
  about: {
    title: "About",
    bio: [
      "I'm Steven — an AI/LLM systems engineer who ships production SaaS products.",
      "With a background spanning data science at Appier (Series C, $160M raised) and Novo Nordisk, I now focus on building AI-native products that solve real business problems.",
      "I specialize in LLM agent architectures, RAG pipelines, and multi-channel AI systems. Every product I build goes from zero to production — no prototypes, no demos, only shipped products with real users.",
    ],
    skills_title: "Core Expertise",
    skills: [
      "LLM Agent Design & Multi-Agent Systems",
      "RAG Pipelines & Vector Search",
      "FastAPI / React / Flutter",
      "Supabase / PostgreSQL / GCP",
      "Shopify App Development",
      "Multi-Channel Integration (LINE, Meta, Web)",
    ],
  },
  contact: {
    title: "Let's Work Together",
    description:
      "Available for freelance projects and consulting engagements in AI/LLM systems.",
    email: "flsteven87@gmail.com",
    linkedin: "https://www.linkedin.com/in/flsteven87/",
    cta: "Get in touch",
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

**Step 2: Create Chinese translations**

Create `src/i18n/zh.ts`:

```typescript
export const zh = {
  meta: {
    title: "Steven Wu — AI 系統工程師",
    description:
      "我打造解決真實商業問題的 AI 系統。從 LLM Agent 到上線的 SaaS 產品。",
  },
  hero: {
    headline: "打造解決真實商業問題的 AI 系統",
    subheadline:
      "從 LLM Agent 到上線 SaaS — 3 個已出貨的產品，各自解決不同產業的挑戰。",
  },
  work: {
    title: "精選作品",
    cta: "查看案例",
  },
  about: {
    title: "關於我",
    bio: [
      "我是 Steven — 一位專注於打造 production-grade AI/LLM 系統的工程師。",
      "曾任職於 Appier（C 輪，募資 $160M）與 Novo Nordisk 的數據團隊，現在專注於從零到一打造 AI 原生產品，解決真實的商業問題。",
      "擅長 LLM Agent 架構、RAG Pipeline、以及多通路 AI 系統。每一個產品都是從零建到上線 — 沒有原型、沒有 Demo，只有真正有用戶的產品。",
    ],
    skills_title: "核心專長",
    skills: [
      "LLM Agent 設計 & 多代理系統",
      "RAG Pipeline & 向量搜尋",
      "FastAPI / React / Flutter",
      "Supabase / PostgreSQL / GCP",
      "Shopify App 開發",
      "多通路整合（LINE、Meta、Web）",
    ],
  },
  contact: {
    title: "一起合作",
    description: "目前開放 AI/LLM 系統相關的接案與顧問合作。",
    email: "flsteven87@gmail.com",
    linkedin: "https://www.linkedin.com/in/flsteven87/",
    cta: "聯絡我",
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

**Step 3: Create i18n index**

Create `src/i18n/index.ts`:

```typescript
import { en } from "./en";
import { zh } from "./zh";

const translations = { en, zh } as const;

export type Locale = keyof typeof translations;

export function t(lang: Locale) {
  return translations[lang];
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split("/");
  if (lang === "zh") return "zh";
  return "en";
}
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add i18n translation system (EN + ZH)"
```

---

## Task 4: Notion Data Layer

**Files:**
- Create: `src/lib/notion.ts`
- Create: `src/lib/types.ts`

**Step 1: Create types**

Create `src/lib/types.ts`:

```typescript
export interface Project {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  taglineZh: string;
  domain: string;
  techStack: string[];
  category: string;
  status: string;
  order: number;
  published: boolean;
  content: Block[];
}

export interface Block {
  type: string;
  text: string;
  richText?: RichTextSpan[];
  children?: Block[];
}

export interface RichTextSpan {
  text: string;
  bold: boolean;
  link?: string;
}
```

**Step 2: Create Notion data fetcher**

Create `src/lib/notion.ts`:

```typescript
import { Client } from "@notionhq/client";
import type { Project, Block, RichTextSpan } from "./types";

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });
const databaseId = import.meta.env.NOTION_DATABASE_ID;

function extractPlainText(richText: any[]): string {
  return richText?.map((t: any) => t.plain_text).join("") ?? "";
}

function extractRichTextSpans(richText: any[]): RichTextSpan[] {
  return (
    richText?.map((t: any) => ({
      text: t.plain_text,
      bold: t.annotations?.bold ?? false,
      link: t.href ?? undefined,
    })) ?? []
  );
}

async function getBlocks(blockId: string): Promise<Block[]> {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 100,
  });

  const blocks: Block[] = [];

  for (const block of response.results as any[]) {
    const type = block.type;
    const content = block[type];

    const parsed: Block = {
      type,
      text: extractPlainText(content?.rich_text ?? []),
      richText: extractRichTextSpans(content?.rich_text ?? []),
    };

    if (block.has_children) {
      parsed.children = await getBlocks(block.id);
    }

    blocks.push(parsed);
  }

  return blocks;
}

export async function getProjects(): Promise<Project[]> {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Published",
      checkbox: { equals: true },
    },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  const projects: Project[] = [];

  for (const page of response.results as any[]) {
    const props = page.properties;

    projects.push({
      id: page.id,
      name: extractPlainText(props.Name?.title ?? []),
      slug: extractPlainText(props.Slug?.rich_text ?? []),
      tagline: extractPlainText(props.Tagline?.rich_text ?? []),
      taglineZh: extractPlainText(props["Tagline ZH"]?.rich_text ?? []),
      domain: props.Domain?.url ?? "",
      techStack:
        props["Tech Stack"]?.multi_select?.map((s: any) => s.name) ?? [],
      category: props.Category?.select?.name ?? "",
      status: props.Status?.select?.name ?? "",
      order: props.Order?.number ?? 0,
      published: props.Published?.checkbox ?? false,
      content: await getBlocks(page.id),
    });
  }

  return projects;
}

export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
}
```

**Step 3: Add environment variables note**

Ensure `.env` contains:
```
NOTION_TOKEN=$NOTION_TOKEN
NOTION_DATABASE_ID=336b0ea7-2ead-81ee-bbe7-e2bbed231d70
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Notion data layer with typed project fetcher"
```

---

## Task 5: Homepage (EN + ZH)

**Files:**
- Create: `src/components/HeroSection.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/AboutSection.astro`
- Create: `src/components/ContactSection.astro`
- Create: `src/pages/index.astro`
- Create: `src/pages/zh/index.astro`

**Step 1: Create HeroSection component**

Create `src/components/HeroSection.astro`:

```astro
---
interface Props {
  headline: string;
  subheadline: string;
}

const { headline, subheadline } = Astro.props;
---

<section class="flex min-h-[80vh] items-center justify-center px-6 pt-20">
  <div class="mx-auto max-w-3xl text-center">
    <h1
      class="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl"
    >
      {headline}
    </h1>
    <p class="mt-6 text-lg leading-relaxed text-text-secondary sm:text-xl">
      {subheadline}
    </p>
  </div>
</section>
```

**Step 2: Create ProjectCard component**

Create `src/components/ProjectCard.astro`:

```astro
---
interface Props {
  name: string;
  tagline: string;
  domain: string;
  techStack: string[];
  category: string;
  slug: string;
  cta: string;
  lang: "en" | "zh";
}

const { name, tagline, domain, techStack, category, slug, cta, lang } =
  Astro.props;
const prefix = lang === "zh" ? "/zh" : "";
const href = `${prefix}/projects/${slug}`;
---

<a href={href} class="group block">
  <article
    class="rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 sm:p-8"
  >
    <div class="flex items-center gap-3 text-sm text-text-secondary">
      <span
        class="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium"
      >
        {category}
      </span>
      <span class="font-mono text-xs">{new URL(domain).hostname}</span>
    </div>

    <h3
      class="mt-4 text-xl font-semibold tracking-tight transition-colors group-hover:text-accent sm:text-2xl"
    >
      {name}
    </h3>

    <p class="mt-3 leading-relaxed text-text-secondary">
      {tagline}
    </p>

    <div class="mt-5 flex flex-wrap gap-2">
      {
        techStack.slice(0, 6).map((tech) => (
          <span class="rounded-md bg-bg px-2 py-1 font-mono text-xs text-text-secondary">
            {tech}
          </span>
        ))
      }
      {
        techStack.length > 6 && (
          <span class="rounded-md bg-bg px-2 py-1 font-mono text-xs text-text-secondary">
            +{techStack.length - 6}
          </span>
        )
      }
    </div>

    <div class="mt-6 flex items-center gap-1 text-sm font-medium text-accent">
      {cta}
      <svg
        class="h-4 w-4 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
      </svg>
    </div>
  </article>
</a>
```

**Step 3: Create AboutSection component**

Create `src/components/AboutSection.astro`:

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

<section id="about" class="px-6 py-24">
  <div class="mx-auto max-w-3xl">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    <div class="mt-8 space-y-4 text-lg leading-relaxed text-text-secondary">
      {bio.map((paragraph) => <p>{paragraph}</p>)}
    </div>
    <div class="mt-12">
      <h3 class="text-lg font-semibold">{skillsTitle}</h3>
      <ul class="mt-4 grid gap-2 sm:grid-cols-2">
        {
          skills.map((skill) => (
            <li class="flex items-center gap-2 text-text-secondary">
              <span class="h-1.5 w-1.5 rounded-full bg-accent" />
              {skill}
            </li>
          ))
        }
      </ul>
    </div>
  </div>
</section>
```

**Step 4: Create ContactSection component**

Create `src/components/ContactSection.astro`:

```astro
---
interface Props {
  title: string;
  description: string;
  email: string;
  linkedin: string;
  cta: string;
}

const { title, description, email, linkedin, cta } = Astro.props;
---

<section id="contact" class="px-6 py-24">
  <div class="mx-auto max-w-3xl text-center">
    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    <p class="mt-4 text-lg text-text-secondary">{description}</p>
    <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
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
    </div>
  </div>
</section>
```

**Step 5: Create EN homepage**

Create `src/pages/index.astro`:

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
  <HeroSection headline={i.hero.headline} subheadline={i.hero.subheadline} />

  <section id="work" class="px-6 py-24">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {i.work.title}
      </h2>
      <div class="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
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

  <AboutSection
    title={i.about.title}
    bio={i.about.bio}
    skillsTitle={i.about.skills_title}
    skills={i.about.skills}
  />

  <ContactSection
    title={i.contact.title}
    description={i.contact.description}
    email={i.contact.email}
    linkedin={i.contact.linkedin}
    cta={i.contact.cta}
  />
</Layout>
```

**Step 6: Create ZH homepage**

Create `src/pages/zh/index.astro`:

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
  <HeroSection headline={i.hero.headline} subheadline={i.hero.subheadline} />

  <section id="work" class="px-6 py-24">
    <div class="mx-auto max-w-5xl">
      <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {i.work.title}
      </h2>
      <div class="mt-12 grid gap-6 sm:grid-cols-1 lg:grid-cols-1">
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

  <AboutSection
    title={i.about.title}
    bio={i.about.bio}
    skillsTitle={i.about.skills_title}
    skills={i.about.skills}
  />

  <ContactSection
    title={i.contact.title}
    description={i.contact.description}
    email={i.contact.email}
    linkedin={i.contact.linkedin}
    cta={i.contact.cta}
  />
</Layout>
```

**Step 7: Delete default Astro page**

Run:
```bash
rm src/pages/index.astro  # Will be replaced by our version
```

(Note: our `src/pages/index.astro` from Step 5 replaces the default.)

**Step 8: Verify build**

Run:
```bash
npm run dev
```
Expected: Site loads at localhost:4321 with hero, project cards (from Notion), about, and contact sections. Navigate to `/zh/` to see Chinese version.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: add homepage with hero, project cards, about, contact (EN + ZH)"
```

---

## Task 6: Project Detail Pages (EN + ZH)

**Files:**
- Create: `src/components/BlockRenderer.astro`
- Create: `src/pages/projects/[slug].astro`
- Create: `src/pages/zh/projects/[slug].astro`

**Step 1: Create BlockRenderer component**

Create `src/components/BlockRenderer.astro`:

```astro
---
import type { Block } from "../lib/types";

interface Props {
  blocks: Block[];
}

const { blocks } = Astro.props;
---

{
  blocks.map((block) => {
    if (block.type === "heading_2") {
      return (
        <h2 class="mt-12 text-2xl font-bold tracking-tight first:mt-0">
          {block.text}
        </h2>
      );
    }

    if (block.type === "heading_3") {
      return <h3 class="mt-8 text-xl font-semibold">{block.text}</h3>;
    }

    if (block.type === "paragraph") {
      if (!block.text) return null;
      return (
        <p class="mt-4 leading-relaxed text-text-secondary">{block.text}</p>
      );
    }

    if (block.type === "bulleted_list_item") {
      return (
        <li class="mt-2 flex gap-2 text-text-secondary">
          <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span>
            {block.richText?.map((span) =>
              span.bold ? (
                <strong class="font-semibold text-text">{span.text}</strong>
              ) : span.link ? (
                <a
                  href={span.link}
                  class="text-accent underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {span.text}
                </a>
              ) : (
                span.text
              ),
            )}
          </span>
        </li>
      );
    }

    if (block.type === "divider") {
      return <hr class="my-8 border-border" />;
    }

    return null;
  })
}
```

**Step 2: Create EN detail page**

Create `src/pages/projects/[slug].astro`:

```astro
---
import Layout from "../../layouts/Layout.astro";
import BlockRenderer from "../../components/BlockRenderer.astro";
import { t } from "../../i18n";
import { getProjects, getProjectBySlug } from "../../lib/notion";

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
  }));
}

const { slug } = Astro.params;
const project = await getProjectBySlug(slug!);
if (!project) return Astro.redirect("/");

const lang = "en";
const i = t(lang);
---

<Layout
  title={`${project.name} — Steven Wu`}
  description={project.tagline}
  lang={lang}
>
  <article class="px-6 pb-24 pt-32">
    <div class="mx-auto max-w-3xl">
      <a
        href="/#work"
        class="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
        </svg>
        {i.project.back}
      </a>

      <header class="mt-8">
        <div class="flex items-center gap-3 text-sm text-text-secondary">
          <span
            class="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium"
          >
            {project.category}
          </span>
          <span class="rounded-full border border-green-800 bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
            {project.status}
          </span>
        </div>
        <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {project.name}
        </h1>
        <p class="mt-4 text-xl leading-relaxed text-text-secondary">
          {project.tagline}
        </p>
        <div class="mt-6 flex items-center gap-4">
          {
            project.domain && (
              <a
                href={project.domain}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                {i.project.visit}
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )
          }
        </div>
      </header>

      <div class="mt-12">
        <ul class="list-none space-y-0">
          <BlockRenderer blocks={project.content} />
        </ul>
      </div>

      <div class="mt-12">
        <h3 class="text-lg font-semibold">{i.project.tech}</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          {
            project.techStack.map((tech) => (
              <span class="rounded-md border border-border bg-surface px-3 py-1 font-mono text-sm text-text-secondary">
                {tech}
              </span>
            ))
          }
        </div>
      </div>

      <p class="mt-12 text-sm italic text-text-secondary">
        {i.project.details_available}
      </p>
    </div>
  </article>
</Layout>
```

**Step 3: Create ZH detail page**

Create `src/pages/zh/projects/[slug].astro`:

```astro
---
import Layout from "../../../layouts/Layout.astro";
import BlockRenderer from "../../../components/BlockRenderer.astro";
import { t } from "../../../i18n";
import { getProjects, getProjectBySlug } from "../../../lib/notion";

export async function getStaticPaths() {
  const projects = await getProjects();
  return projects.map((project) => ({
    params: { slug: project.slug },
  }));
}

const { slug } = Astro.params;
const project = await getProjectBySlug(slug!);
if (!project) return Astro.redirect("/zh/");

const lang = "zh";
const i = t(lang);
---

<Layout
  title={`${project.name} — Steven Wu`}
  description={project.taglineZh || project.tagline}
  lang={lang}
>
  <article class="px-6 pb-24 pt-32">
    <div class="mx-auto max-w-3xl">
      <a
        href="/zh/#work"
        class="inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-accent"
      >
        <svg
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11 17l-5-5m0 0l5-5m-5 5h12"></path>
        </svg>
        {i.project.back}
      </a>

      <header class="mt-8">
        <div class="flex items-center gap-3 text-sm text-text-secondary">
          <span
            class="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium"
          >
            {project.category}
          </span>
          <span class="rounded-full border border-green-800 bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-400">
            {project.status}
          </span>
        </div>
        <h1 class="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
          {project.name}
        </h1>
        <p class="mt-4 text-xl leading-relaxed text-text-secondary">
          {project.taglineZh || project.tagline}
        </p>
        <div class="mt-6 flex items-center gap-4">
          {
            project.domain && (
              <a
                href={project.domain}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                {i.project.visit}
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )
          }
        </div>
      </header>

      <div class="mt-12">
        <ul class="list-none space-y-0">
          <BlockRenderer blocks={project.content} />
        </ul>
      </div>

      <div class="mt-12">
        <h3 class="text-lg font-semibold">{i.project.tech}</h3>
        <div class="mt-4 flex flex-wrap gap-2">
          {
            project.techStack.map((tech) => (
              <span class="rounded-md border border-border bg-surface px-3 py-1 font-mono text-sm text-text-secondary">
                {tech}
              </span>
            ))
          }
        </div>
      </div>

      <p class="mt-12 text-sm italic text-text-secondary">
        {i.project.details_available}
      </p>
    </div>
  </article>
</Layout>
```

**Step 4: Verify build + test navigation**

Run:
```bash
npm run dev
```
Expected:
- `/` → EN homepage with 3 project cards
- `/zh/` → ZH homepage
- Click any card → `/projects/nexrex` detail page
- `/zh/projects/nexrex` → ZH detail page
- Language switcher toggles between EN/ZH
- View transitions animate between pages

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add project detail pages with Notion block renderer (EN + ZH)"
```

---

## Task 7: Scroll Animations + Polish

**Files:**
- Create: `src/scripts/animations.ts`
- Modify: `src/layouts/Layout.astro` (add script)
- Modify: `src/components/ProjectCard.astro` (add data attributes)

**Step 1: Create scroll animation script**

Create `src/scripts/animations.ts`:

```typescript
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });
}

// Run on initial load
initScrollAnimations();

// Re-run after View Transitions navigation
document.addEventListener("astro:after-swap", initScrollAnimations);
```

**Step 2: Add animation styles to global.css**

Append to `src/styles/global.css`:

```css
[data-animate] {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

[data-animate].animate-in {
  opacity: 1;
  transform: translateY(0);
}

[data-animate]:nth-child(2) {
  transition-delay: 0.1s;
}

[data-animate]:nth-child(3) {
  transition-delay: 0.2s;
}
```

**Step 3: Add script to Layout**

In `src/layouts/Layout.astro`, add before `</body>`:

```astro
<script src="../scripts/animations.ts"></script>
```

**Step 4: Add `data-animate` to key elements**

In `ProjectCard.astro`, add `data-animate` to the outer `<a>` tag:

```astro
<a href={href} class="group block" data-animate>
```

In `AboutSection.astro`, add `data-animate` to the section:

```astro
<section id="about" class="px-6 py-24" data-animate>
```

In `ContactSection.astro`, add `data-animate` to the section:

```astro
<section id="contact" class="px-6 py-24" data-animate>
```

**Step 5: Verify animations**

Run:
```bash
npm run dev
```
Expected: Project cards and sections fade in as you scroll down.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add scroll-triggered fade-in animations"
```

---

## Task 8: Notion ZH Tagline + Database Property

**Files:** (Notion API only, no code files)

**Step 1: Add "Tagline ZH" property to Notion Database**

Run:
```bash
curl -s -X PATCH "https://api.notion.com/v1/databases/336b0ea7-2ead-81ee-bbe7-e2bbed231d70" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{ "properties": { "Tagline ZH": { "rich_text": {} } } }'
```

**Step 2: Update each entry with Chinese taglines**

NexRex:
```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/336b0ea7-2ead-81de-a7e9-cb9e67a62859" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{ "properties": { "Tagline ZH": { "rich_text": [{ "text": { "content": "AI 驅動的運動教練平台 — 即時對話式 AI 教練、多通路運動員互動、智慧訓練追蹤。" } }] } } }'
```

AI Commerce Ready:
```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/336b0ea7-2ead-81ff-98b9-e5f0595fae5d" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{ "properties": { "Tagline ZH": { "rich_text": [{ "text": { "content": "Shopify App — 幫助商家優化商品資料，提升在 ChatGPT、Gemini 等 AI 購物平台的曝光。" } }] } } }'
```

Replai:
```bash
curl -s -X PATCH "https://api.notion.com/v1/pages/336b0ea7-2ead-811a-8d29-e33ab278ddf6" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Notion-Version: 2022-06-28" \
  -d '{ "properties": { "Tagline ZH": { "rich_text": [{ "text": { "content": "No-code AI 客服機器人建置平台 — 幾分鐘內部署到 LINE、Web、Meta 的智慧客服。" } }] } } }'
```

**Step 3: No commit needed** (Notion data only)

---

## Task 9: GitHub Repo Setup + First Deploy

**Files:** (Git/GitHub operations only)

**Step 1: Create GitHub repo**

Run:
```bash
cd /Users/po-chi/Desktop/freelance/flsteven87.github.io
gh repo create flsteven87.github.io --public --source=. --remote=origin
```

**Step 2: Set GitHub Secrets**

Run:
```bash
gh secret set NOTION_TOKEN --body "$NOTION_TOKEN"
gh secret set NOTION_DATABASE_ID --body "336b0ea7-2ead-81ee-bbe7-e2bbed231d70"
```

**Step 3: Enable GitHub Pages**

Run:
```bash
gh api repos/flsteven87/flsteven87.github.io/pages \
  --method POST \
  --field build_type=workflow
```

If it errors (pages already exists), ignore.

**Step 4: Push to trigger deploy**

Run:
```bash
git push -u origin main
```

**Step 5: Verify deployment**

Run:
```bash
gh run list --limit 1
```
Wait for the action to complete, then visit `https://flsteven87.github.io`.

**Step 6: Final commit (if any fixups needed)**

```bash
git add -A
git commit -m "fix: deployment adjustments"
git push
```

---

## Summary

| Task | Description | Key Files |
|------|------------|-----------|
| 1 | Astro scaffold + Tailwind + GH Actions | `astro.config.mjs`, `.github/workflows/deploy.yml` |
| 2 | Design system + Layout + Header/Footer | `global.css`, `Layout.astro`, `Header.astro` |
| 3 | i18n translations (EN + ZH) | `src/i18n/en.ts`, `src/i18n/zh.ts` |
| 4 | Notion data layer | `src/lib/notion.ts`, `src/lib/types.ts` |
| 5 | Homepage (EN + ZH) | `src/pages/index.astro`, `src/pages/zh/index.astro` |
| 6 | Project detail pages | `src/pages/projects/[slug].astro` |
| 7 | Scroll animations | `src/scripts/animations.ts` |
| 8 | Notion ZH taglines | (API calls only) |
| 9 | GitHub deploy | `gh` CLI commands |
