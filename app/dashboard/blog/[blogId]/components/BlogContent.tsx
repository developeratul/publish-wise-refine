"use client";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useBaseEditor } from "@/lib/editor";
import React from "react";
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
  React.useEffect(() => {
    if (editor) {
      editor.setOptions({ editable: isEditingMode });
    }
  }, [editor, isEditingMode]);
  return <MarkdownEditor isEditingMode={isEditingMode} editor={editor} />;
}
