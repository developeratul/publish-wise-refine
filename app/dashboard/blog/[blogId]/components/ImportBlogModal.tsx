import Icon from "@/components/Icon";
import { markdownToHtml } from "@/helpers/blog";
import { AppProps } from "@/types";
import { Button, Modal, Stack, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { useBlogContext } from "../BlogProvider";

type ImportFormat = "html" | "markdown";

interface InitialState {
  opened: boolean;
  open: (format: ImportFormat) => void;
  close: () => void;
}

const ImportBlogModalContext = React.createContext<InitialState | undefined>(undefined);

export default function ImportBlogModal(props: AppProps) {
  const { children } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const { editor } = useBlogContext();
  const [format, setFormat] = React.useState<ImportFormat | undefined>();
  const [content, setContent] = React.useState("");

  const openModal: InitialState["open"] = (format) => {
    setFormat(format);
    open();
  };

  const closeModal = () => {
    close();
    setFormat(undefined);
    setContent("");
  };

  const handleImport = () => {
    if (!editor) return;
    if (format === "html") {
      editor.chain().focus().setContent(content).run();
      closeModal();
    } else {
      const html = markdownToHtml(content);
      editor.chain().focus().setContent(html).run();
      closeModal();
    }
  };

  return (
    <ImportBlogModalContext.Provider value={{ opened, open: openModal, close: closeModal }}>
      {children}
      <Modal
        size="lg"
        title={format && `Import from ${format}`}
        opened={opened}
        onClose={closeModal}
      >
        <Stack align="end">
          <Textarea
            w="100%"
            value={content}
            styles={{ input: { fontFamily: "monospace" } }}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your content here..."
            label="Enter your content"
            minRows={10}
            autosize
          />
          <Button onClick={handleImport} leftIcon={<Icon name="IconFileImport" />}>
            Import
          </Button>
        </Stack>
      </Modal>
    </ImportBlogModalContext.Provider>
  );
}

export function useImportBlog() {
  const importBlogContext = React.useContext(ImportBlogModalContext);

  if (importBlogContext === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return importBlogContext;
}
