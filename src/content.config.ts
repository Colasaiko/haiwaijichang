import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const helpCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/help" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    order: z.number(),
    related: z.array(z.string()).optional(),
    keywords: z.string().optional()
  })
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().or(z.date()).optional(),
  })
});

export const collections = {
  'help': helpCollection,
  'blog': blogCollection,
};
