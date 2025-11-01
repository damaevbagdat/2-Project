import { z, defineCollection } from 'astro:content';

// Supported locales
const localeEnum = z.enum(['ru', 'kz', 'en']);

// Services collection schema
const serviceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  draft: z.boolean().optional(),
  order: z.number().optional(),
  locale: localeEnum.optional(),
});

// Blog collection schema
const blogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  // Accept either a string or a Date (frontmatter may be parsed as Date)
  pubDate: z.union([z.string(), z.date()]).optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
  locale: localeEnum.optional(),
});

export const collections = {
  services: defineCollection({ schema: serviceSchema }),
  blog: defineCollection({ schema: blogSchema }),
  pages: defineCollection({
    schema: z.object({
      title: z.string(),
      locale: localeEnum.optional(),
    }),
  }),
};

export type Locale = 'ru' | 'kz' | 'en';
