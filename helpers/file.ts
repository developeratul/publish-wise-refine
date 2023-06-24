export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return "";
}
