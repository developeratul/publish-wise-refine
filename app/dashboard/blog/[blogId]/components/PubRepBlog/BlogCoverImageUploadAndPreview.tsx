import { useUserContext } from "@/app/dashboard/providers/user";
import { CustomDropzone } from "@/components/DropzoneModal";
import Icon from "@/components/Icon";
import { getFileUrl } from "@/helpers/file";
import { useDeleteFile, useUploadFile } from "@/hooks/file";
import { BlogProviders } from "@/types";
import { ActionIcon, Image as MantineImage, Tooltip } from "@mantine/core";
import { FileWithPath } from "@mantine/dropzone";
import { useBlogContext } from "../../BlogProvider";
import { usePubRepBlog } from "./provider";

export default function BlogCoverImage(props: {
  coverImagePath: string | null;
  provider: BlogProviders;
  field: string;
}) {
  const { coverImagePath, provider, field } = props;
  const user = useUserContext();
  const { blog } = useBlogContext();
  const { form } = usePubRepBlog();

  const { mutateAsync: uploadFile, isLoading: isFileUploading } = useUploadFile({
    mutationKey: [`upload-${provider}-cover-image`],
    folderName: `${user.id}/${blog.id}`,
    bucketName: "blog-covers",
  });

  const { mutateAsync: deleteFile, isLoading: isFileDeleting } = useDeleteFile({
    mutationKey: [`delete-${provider}-cover-image`],
    bucketName: "blog-covers",
  });

  const handleDeleteImage = async () => {
    if (!coverImagePath) return;
    const confirmed = window.confirm(
      "Are you sure, you want to delete this permanently? This action cannot be undone!"
    );
    if (!confirmed) return;
    try {
      await deleteFile({ filePaths: [coverImagePath] });
      form.setFieldValue(field, null);
    } catch (err) {
      //
    }
  };

  if (!coverImagePath) {
    const handleDrop = async (files: FileWithPath[]) => {
      try {
        const file = files[0];
        const { filePath } = await uploadFile({ file });
        form.setFieldValue(field, filePath);
      } catch (err) {
        //
      }
    };

    return (
      <CustomDropzone
        loading={isFileUploading}
        dropzoneTitle="Drop your cover image here or click to select"
        dropzoneDescription="Use a ratio of 160:84 for best results (1600x840)"
        onDrop={handleDrop}
      />
    );
  }

  return (
    <div className="relative">
      <MantineImage
        src={getFileUrl("blog-covers", coverImagePath)}
        radius="md"
        withPlaceholder
        mih={100}
        alt={coverImagePath}
      />
      <Tooltip position="left" withArrow label="Remove cover image">
        <ActionIcon
          loading={isFileDeleting}
          onClick={handleDeleteImage}
          variant="filled"
          size="lg"
          color="red"
          className="absolute top-0 right-0 m-4"
        >
          <Icon name="IconTrash" />
        </ActionIcon>
      </Tooltip>
    </div>
  );
}
