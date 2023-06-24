"use client";
import { useBlogContext } from "@/app/dashboard/blog/[blogId]/BlogProvider";
import { useUserContext } from "@/app/dashboard/providers/user";
import DropzoneModal from "@/components/DropzoneModal";
import Icon from "@/components/Icon";
import { getFileExtension } from "@/helpers/file";
import { Select } from "@mantine/core";
import { FileRejection, FileWithPath } from "@mantine/dropzone";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useMutation } from "@tanstack/react-query";
import CodeBlockLowlight, { CodeBlockLowlightOptions } from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import {
  Editor,
  EditorOptions,
  Node,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { lowlight } from "lowlight";
import React from "react";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";
import { supabaseClient } from "./supabase";

import js from "highlight.js/lib/languages/javascript";
import kotlin from "highlight.js/lib/languages/kotlin";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";

// Registering them individually for renaming the keys
lowlight.registerLanguage("ts", ts);
lowlight.registerLanguage("js", js);
lowlight.registerLanguage("html", html);
lowlight.registerLanguage("py", python);
lowlight.registerLanguage("kt", kotlin);
lowlight.registerLanguage("md", markdown);
lowlight.registerLanguage("sql", sql);
lowlight.registerLanguage("rs", rust);

interface CodeBlockComponentProps extends NodeViewProps {
  extension: Node<CodeBlockLowlightOptions, any>;
}

const CodeBlockComponent: React.FC<CodeBlockComponentProps> = (props) => {
  const {
    node: {
      attrs: { language },
    },
    updateAttributes,
    extension,
  } = props;
  return (
    <NodeViewWrapper className="code-block">
      <Select
        searchable
        size="xs"
        data={extension.options.lowlight.listLanguages().map((langName: string) => ({
          label: langName,
          value: langName,
        }))}
        contentEditable={false}
        defaultValue={language || "plaintext"}
        pos="absolute"
        top={0}
        right={0}
        m="md"
        w={120}
        variant="filled"
        color="red"
        onChange={(value) => updateAttributes({ language: value })}
      />
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export function useBaseEditor(props?: Omit<Partial<EditorOptions>, "extensions">) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight, defaultLanguage: "plaintext" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    ...props,
  });
  return editor;
}

export function InsertImage(props: { editor: Editor }) {
  const { editor } = props;
  const user = useUserContext();
  const { blog } = useBlogContext();

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (variables: { file: FileWithPath }) => {
      const { file } = variables;

      const FOLDER_NAME = `${user.id}/${blog.id}`;
      const FILE_NAME = `${uuid()}.${getFileExtension(file.name)}`;

      const { data, error } = await supabaseClient.storage
        .from("blog-images")
        .upload(`${FOLDER_NAME}/${FILE_NAME}`, file);

      if (error) {
        toast.error(error.message);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from("blog-images").getPublicUrl(data.path);

      return { publicUrl };
    },
  });

  const handleDrop = async (files: FileWithPath[]) => {
    try {
      const file = files[0];
      const { publicUrl } = await mutateAsync({ file });
      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (err) {
      //
    }
  };

  const handleReject = (rejections: FileRejection[]) => {
    const rejection = rejections[0];
    toast.error(rejection.errors[0].message);
  };

  return (
    <DropzoneModal onReject={handleReject} loading={isLoading} onDrop={handleDrop}>
      <RichTextEditor.Control aria-label="Insert image" title="Insert image">
        <Icon name="IconPhoto" size={16} />
      </RichTextEditor.Control>
    </DropzoneModal>
  );
}
