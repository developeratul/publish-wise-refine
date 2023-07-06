import { InsertImage } from "@/lib/editor";
import { RichTextEditor } from "@mantine/tiptap";
import { Editor } from "@tiptap/react";

export default function MarkdownEditor(props: { editor: Editor | null; isEditingMode?: boolean }) {
  const { editor, isEditingMode = true } = props;
  if (!editor) return <></>;
  return (
    <RichTextEditor w="100%" mih="70vh" editor={editor}>
      {isEditingMode && (
        <RichTextEditor.Toolbar sticky stickyOffset={70}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
            <RichTextEditor.CodeBlock />
            <InsertImage editor={editor} />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>
      )}
      <RichTextEditor.Content h="100%" />
    </RichTextEditor>
  );
}
