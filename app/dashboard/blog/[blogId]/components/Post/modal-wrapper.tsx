"use client";
import { Modal } from "@mantine/core";
import React from "react";

export interface ModalProps {
  opened: boolean;
  close: () => void;
}

export interface PublishModalWrapperProps extends ModalProps {
  title: string;
  isPublishing: boolean;
  children: React.ReactNode;
}

export default function PublishModalWrapper(props: PublishModalWrapperProps) {
  const { opened, close, title, children, isPublishing } = props;
  return (
    <Modal
      withinPortal
      opened={opened}
      onClose={close}
      size="lg"
      title={`${isPublishing ? "Publish" : "Republish"} on ${title}`}
    >
      {children}
    </Modal>
  );
}
