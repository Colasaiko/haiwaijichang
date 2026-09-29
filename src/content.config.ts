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

const brandsCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/brands" }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    title: z.any().optional(),
    description: z.any().optional(),
    featured: z.any().optional(),
    purchase: z.any().optional(),
    coupon: z.any().optional(),
    pricing: z.any().optional(),
    established: z.any().optional(),
    telegram: z.any().optional(),
    payment: z.any().optional(),
    protocols: z.any().optional(),
    nodes: z.any().optional()
  }).catchall(z.any())
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    keywords: z.string().optional()
  }).catchall(z.any())
});

const guidesCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }).catchall(z.any())
});

export const collections = {
  'help': helpCollection,
  'blog': blogCollection,
  'brands': brandsCollection,
  'pages': pagesCollection,
  'guides': guidesCollection
};
