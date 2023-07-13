import { getFileExtension } from "@/helpers/file";
import { supabaseClient } from "@/lib/supabase";
import { FileWithPath } from "@mantine/dropzone";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { v4 as uuid } from "uuid";

export function useUploadFile(props: {
  mutationKey: string[];
  folderName: string;
  bucketName: string;
}) {
  const { mutationKey, folderName, bucketName } = props;

  const mutation = useMutation({
    mutationKey,
    mutationFn: async (variables: { file: FileWithPath }) => {
      const { file } = variables;

      const FOLDER_NAME = folderName;
      const FILE_NAME = `${uuid()}.${getFileExtension(file.name)}`;

      const { data, error } = await supabaseClient.storage
        .from("blog-covers")
        .upload(`${FOLDER_NAME}/${FILE_NAME}`, file);

      if (error) {
        toast.error(error.message);
        throw error;
      }

      const {
        data: { publicUrl },
      } = supabaseClient.storage.from(bucketName).getPublicUrl(data.path);

      return { publicUrl, filePath: data.path };
    },
  });

  return mutation;
}

export function useDeleteFile(props: { mutationKey: string[]; bucketName: string }) {
  const { mutationKey, bucketName } = props;

  const mutation = useMutation({
    mutationKey,
    mutationFn: async (input: { filePaths: string[] }) => {
      const { filePaths } = input;
      await supabaseClient.storage.from(bucketName).remove(filePaths);
    },
  });

  return mutation;
}
