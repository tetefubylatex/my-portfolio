import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

const works = defineCollection({
	// Load Markdown files in the `src/content/works/` directory.
	loader: glob({ base: './src/content/works', pattern: '**/*.md' }),
	// Type-check frontmatter using a schema
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		author: z.string().optional(),
		charName: z.string().optional(),
		date: z.coerce.date(),
		image: z.string(),
		software: z.string().optional(),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { blog, works };
