"use client";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useBaseEditor } from "@/lib/editor";
import { useBlogContext } from "../BlogProvider";

export default function BlogContent() {
  const { blog, form } = useBlogContext();
  const editor = useBaseEditor({
    content: blog.content,
    onUpdate({ editor }) {
      form.setFieldValue("content", editor.getHTML());
    },
  });
  return <MarkdownEditor editor={editor} />;
}
