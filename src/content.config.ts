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

export const collections = {
  'help': helpCollection,
};
