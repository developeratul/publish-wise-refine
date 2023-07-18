"use client";
import { supabaseClient } from "@/lib/supabase";
import { Button, LoadingOverlay, PasswordInput, Stack, Title } from "@mantine/core";
import { hasLength, matchesField, useForm } from "@mantine/form";
import { AuthError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const initialValues = { password: "", confirmPassword: "" };

export default function ResetPasswordPage() {
  const { getInputProps, onSubmit, reset } = useForm({
    initialValues,
    validate: {
      password: hasLength({ min: 6 }, "Password must contain at least 6 chars"),
      confirmPassword: matchesField("password", "Passwords must match"),
    },
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const { password } = values;
      const { data, error } = await supabaseClient.auth.updateUser({ password });
      if (error) throw error;
      return data;
    },
  });
  const router = useRouter();

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await mutateAsync(values);
      reset();
      router.push("/dashboard");
      toast.success("Your password has successfully been updated");
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Stack>
      <Title order={2} weight={500} align="center">
        Reset password
      </Title>
      <form className="flex flex-col gap-4" onSubmit={onSubmit(handleSubmit)}>
        <PasswordInput required label="New password" {...getInputProps("password")} />
        <PasswordInput required label="Confirm password" {...getInputProps("confirmPassword")} />
        <Button type="submit">Reset password</Button>
      </form>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
    </Stack>
  );
}
