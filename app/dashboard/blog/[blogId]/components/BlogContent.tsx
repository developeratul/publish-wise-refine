"use client";
import MarkdownEditor from "@/components/MarkdownEditor";
import React from "react";
import { useBlogContext } from "../BlogProvider";

export default function BlogContent() {
  const { isEditingMode, editor } = useBlogContext();
  React.useEffect(() => {
    if (editor) {
      editor.setOptions({ editable: isEditingMode });
    }
  }, [editor, isEditingMode]);
  return <MarkdownEditor isEditingMode={isEditingMode} editor={editor} />;
}
