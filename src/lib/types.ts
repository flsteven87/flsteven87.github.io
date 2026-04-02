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
