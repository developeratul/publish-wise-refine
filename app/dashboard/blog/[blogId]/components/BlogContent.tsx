"use client";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useBaseEditor } from "@/lib/editor";
import { useBlogContext } from "../BlogProvider";

export default function BlogContent() {
  const { blog, form, isEditingMode } = useBlogContext();
  const editor = useBaseEditor({
    content: blog.content,
    editable: isEditingMode,
    onUpdate({ editor }) {
      form.setFieldValue("content", editor.getHTML());
    },
  });
  return <MarkdownEditor isEditingMode={isEditingMode} editor={editor} />;
}
