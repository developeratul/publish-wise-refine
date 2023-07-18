"use client";
import { supabaseClient } from "@/lib/supabase";
import {
  Anchor,
  Button,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { hasLength, isEmail, useForm } from "@mantine/form";
import { AuthError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-hot-toast";

const initialValues = { email: "", password: "" };

export default function LoginPage() {
  const { onSubmit, getInputProps } = useForm({
    initialValues,
    validate: {
      email: isEmail("Invalid Email"),
      password: hasLength({ min: 6 }, "Password must contain at least 6 chars"),
    },
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const { email, password } = values;
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const { user } = await mutateAsync(values);
      toast.success(`Welcome back, ${user.user_metadata.first_name}!`);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Stack justify="center" spacing="xl">
      <Title weight={500} order={2} align="center">
        Sign in
      </Title>
      <form className="flex flex-col gap-4" onSubmit={onSubmit(handleSubmit)}>
        <TextInput required label="Email" type="email" {...getInputProps("email")} />
        <PasswordInput required label="Password" {...getInputProps("password")} />
        <Button type="submit">Sign in</Button>
      </form>
      <Stack spacing="xs">
        <Text align="center">
          Don&apos;t have an account?{" "}
          <Anchor component={Link} href="/auth/sign-up">
            Sign up
          </Anchor>
        </Text>
        <Text align="center">
          <Anchor component={Link} href="/auth/forgot-password">
            Forgot password
          </Anchor>
        </Text>
      </Stack>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
    </Stack>
  );
}
