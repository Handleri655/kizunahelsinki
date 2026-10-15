import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const text = z.object({
  fi: z.string(),
  en: z.string(),
  ja: z.string(),
});

const allergen = z.enum(['G', 'V', 'VE', 'L']);

const extra = z.object({
  name: text,
  price: z.string(),
});

const option = z.object({
  name: text,
  price: z.string(),
  allergens: z.array(allergen).optional(),
});

const item = z.object({
  name: text,
  description: text.optional(),
  price: z.string().optional(),
  unit: text.optional(),
  allergens: z.array(allergen).optional(),
  veganOption: z.boolean().optional(),
  choices: text.optional(),
  extras: z.array(extra).optional(),
  options: z.array(option).optional(),
  featured: z.boolean().optional(),
});

const section = z.object({
  title: text,
  note: text.optional(),
  items: z.array(item),
});

const menu = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/menu' }),
  schema: z.object({
    order: z.number(),
    title: text,
    when: text.optional(),
    intro: text.optional(),
    sections: z.array(section),
  }),
});

export const collections = { menu };
