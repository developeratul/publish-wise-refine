import { Converter } from "showdown";

export function generateSlug(blogTitle: string): string {
  const slug = blogTitle
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters and hyphens
    .replace(/--+/g, "-"); // Replace consecutive hyphens with a single hyphen

  return slug;
}

export function htmlToMarkdown(html: string) {
  const converter = new Converter();
  const markdown = converter.makeMarkdown(html);
  return markdown;
}

export function markdownToHtml(markdown: string) {
  const converter = new Converter();
  return converter.makeHtml(markdown);
}
