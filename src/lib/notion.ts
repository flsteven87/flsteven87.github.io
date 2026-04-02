import type { Project, Block, RichTextSpan } from "./types";

const NOTION_TOKEN = import.meta.env.NOTION_TOKEN;
const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

const headers = {
  Authorization: `Bearer ${NOTION_TOKEN}`,
  "Notion-Version": NOTION_VERSION,
  "Content-Type": "application/json",
};

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
  const res = await fetch(
    `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`,
    { headers },
  );
  const data = await res.json();

  const blocks: Block[] = [];

  for (const block of data.results ?? []) {
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
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        filter: {
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Order", direction: "ascending" }],
      }),
    },
  );
  const data = await res.json();

  const projects: Project[] = [];

  for (const page of data.results ?? []) {
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
