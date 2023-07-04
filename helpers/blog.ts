export function generateSlug(blogTitle: string): string {
  const slug = blogTitle
    .toLowerCase() // Convert to lowercase
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters and hyphens
    .replace(/--+/g, "-"); // Replace consecutive hyphens with a single hyphen

  return slug;
}
