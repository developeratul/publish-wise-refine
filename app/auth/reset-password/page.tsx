"use client";
import { Button, LoadingOverlay, PasswordInput, Stack, Title } from "@mantine/core";
import { hasLength, matchesField, useForm } from "@mantine/form";
import { AuthError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const initialValues = { password: "", confirmPassword: "" };

export default function ForgotPasswordPage() {
  const { getInputProps, onSubmit, reset } = useForm({
    initialValues,
    validate: {
      password: hasLength({ min: 6 }, "Password must contain at least 6 chars"),
      confirmPassword: matchesField("password", "Passwords must match"),
    },
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      // const { email } = values;
      // const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      //   redirectTo: absoluteUrl("/auth/reset-password"),
      // });
      // if (error) throw error;
      // return data;
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await mutateAsync(values);
      reset();
      toast.success("We have sent email instructions to your email");
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Stack>
      <Title order={2} align="center">
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
