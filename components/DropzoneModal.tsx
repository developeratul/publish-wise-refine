import { Group, Modal, Text, rem, useMantineTheme } from "@mantine/core";
import { Dropzone, DropzoneProps, FileRejection, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { toast } from "react-hot-toast";
import Icon from "./Icon";

interface CustomDropzoneProps extends Partial<DropzoneProps> {
  dropzoneTitle?: string;
  dropzoneDescription?: string;
}

export function CustomDropzone(props: CustomDropzoneProps) {
  const {
    dropzoneTitle = "Drag your image here or click to select the file",
    dropzoneDescription = "Your image file size should not exceed 1mb",
    onDrop = () => undefined,
    onReject,
    maxSize = 1 * 1024 ** 2, // 1mb
    maxFiles = 1,
    accept = IMAGE_MIME_TYPE,
  } = props;
  const theme = useMantineTheme();

  const handleReject = (rejections: FileRejection[]) => {
    const rejection = rejections[0];
    toast.error(rejection.errors[0].message);
  };

  return (
    <Dropzone
      onDrop={onDrop}
      onReject={onReject || handleReject}
      maxSize={maxSize}
      accept={accept}
      maxFiles={maxFiles}
      {...props}
    >
      <Group position="center" spacing="xl" style={{ minHeight: rem(220), pointerEvents: "none" }}>
        <Dropzone.Accept>
          <Icon
            name="IconUpload"
            size="3.2rem"
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <Icon
            name="IconX"
            size="3.2rem"
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <Icon name="IconPhoto" size="3.2rem" />
        </Dropzone.Idle>
        <div>
          <Text size="xl" inline>
            {dropzoneTitle}
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            {dropzoneDescription}
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

interface DropzoneModalProps extends CustomDropzoneProps {
  children: React.ReactElement;
  modalTitle?: string;
}

export default function DropzoneModal(props: DropzoneModalProps) {
  const { children, modalTitle = "Insert image", ...dropzoneProps } = props;
  const [opened, { open, close }] = useDisclosure(false);
  const clickableChildren = React.cloneElement(children, { onClick: open });
  return (
    <React.Fragment>
      {clickableChildren}
      <Modal centered size="lg" title={modalTitle} opened={opened} onClose={close}>
        <CustomDropzone {...dropzoneProps} />
      </Modal>
    </React.Fragment>
  );
}
