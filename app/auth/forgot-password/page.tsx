"use client";
import { supabaseClient } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/utils";
import { Button, LoadingOverlay, Stack, TextInput, Title } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { AuthError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const initialValues = { email: "" };

export default function ForgotPasswordPage() {
  const { getInputProps, onSubmit, reset } = useForm({
    initialValues,
    validate: {
      email: isEmail("Invalid Email"),
    },
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const { email } = values;
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: absoluteUrl("/auth/callback?next=/auth/reset-password"),
      });
      if (error) throw error;
      return data;
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
        Forgot password
      </Title>
      <form className="flex flex-col gap-4" onSubmit={onSubmit(handleSubmit)}>
        <TextInput required label="Email" type="email" {...getInputProps("email")} />
        <Button type="submit">Submit</Button>
      </form>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
    </Stack>
  );
}
