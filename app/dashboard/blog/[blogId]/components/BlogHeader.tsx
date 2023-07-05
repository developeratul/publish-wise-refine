"use client";

import { useDeleteBlogContext } from "@/app/dashboard/providers/delete-blog";
import Icon from "@/components/Icon";
import { generateSlug, htmlToMarkdown } from "@/helpers/blog";
import { ActionIcon, Anchor, Badge, Breadcrumbs, Group, Menu, Text } from "@mantine/core";
import { saveAs } from "file-saver";
import Link from "next/link";
import React from "react";
import { useBlogContext } from "../BlogProvider";

export default function BlogHeader() {
  const { blog, isEditingMode } = useBlogContext();
  const { openDeleteBlogModal } = useDeleteBlogContext();

  const handleDeleteDraft = () => {
    openDeleteBlogModal(blog.id);
  };

  return (
    <Group display="flex" spacing="xl" noWrap position="apart" mb="xl">
      <Breadcrumbs>
        <Anchor component={Link} href="/dashboard">
          Blogs
        </Anchor>
        <Text sx={{ whiteSpace: "normal" }} lineClamp={1}>
          {blog.title}
        </Text>
      </Breadcrumbs>
      <Group noWrap spacing="xl">
        <BlogSavingStatus />
        <Menu withArrow>
          <Menu.Target>
            <ActionIcon size="md">
              <Icon name="IconDots" />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {isEditingMode ? (
              <Menu.Item
                icon={<Icon name="IconBook" />}
                component={Link}
                href={`/dashboard/blog/${blog.id}`}
              >
                Reading mode
              </Menu.Item>
            ) : (
              <Menu.Item
                icon={<Icon name="IconEdit" />}
                component={Link}
                href={{ pathname: `/dashboard/blog/${blog.id}`, search: "type=edit" }}
              >
                Edit
              </Menu.Item>
            )}
            <Menu.Item onClick={handleDeleteDraft} color="red" icon={<Icon name="IconTrash" />}>
              Delete draft
            </Menu.Item>
            <Menu.Divider />
            <Menu.Label>Export</Menu.Label>
            <ExportBlog format="html">
              <Menu.Item icon={<Icon name="IconHtml" />}>Export as HTML</Menu.Item>
            </ExportBlog>
            <ExportBlog format="markdown">
              <Menu.Item icon={<Icon name="IconMarkdown" />}>Export as Markdown</Menu.Item>
            </ExportBlog>
            <Menu.Divider />
            <Menu.Label>Import</Menu.Label>
            <ImportBlogContent>
              <Menu.Item icon={<Icon name="IconHtml" />}>Import from HTML</Menu.Item>
            </ImportBlogContent>
            <ImportBlogContent>
              <Menu.Item icon={<Icon name="IconMarkdown" />}>Import from Markdown</Menu.Item>
            </ImportBlogContent>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}

function ImportBlogContent(props: { children: React.ReactElement }) {
  const { children } = props;
  const { editor, blog } = useBlogContext();
  const handleImport = () => {
    if (!editor) return;
  };
  const triggeredChildren = React.cloneElement(children, { onClick: handleImport });
  return triggeredChildren;
}

function ExportBlog(props: { children: React.ReactElement; format: "html" | "markdown" }) {
  const { children, format } = props;
  const { editor, blog } = useBlogContext();
  const handleExport = () => {
    if (!editor) return;

    const mimeTypes: Record<"html" | "markdown", string> = {
      html: "text/html;charset=utf-8;",
      markdown: "text/markdown;charset=utf-8;",
    };
    const fileExtensions = {
      html: "",
      markdown: ".md",
    };
    const fileExtension = fileExtensions[format];
    const mimeType = mimeTypes[format];

    const html = editor.getHTML();

    let content;

    if (format === "markdown") {
      const markdown = htmlToMarkdown(html);
      content = markdown;
    } else {
      content = html;
    }

    const blob = new Blob([content], { type: mimeType });
    saveAs(blob, `${generateSlug(blog.title)}${fileExtension}`);
  };
  const triggeredChildren = React.cloneElement(children, { onClick: handleExport });
  return triggeredChildren;
}

function BlogSavingStatus() {
  const { isSaving, isSavingSuccess } = useBlogContext();
  if (isSaving) {
    return (
      <Badge color="blue" size="lg" variant="dot">
        Saving...
      </Badge>
    );
  }
  if (isSavingSuccess) {
    return (
      <Badge color="green" size="lg" variant="dot">
        Saved
      </Badge>
    );
  }
  return <></>;
}
