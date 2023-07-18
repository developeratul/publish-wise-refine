"use client";
import { supabaseClient } from "@/lib/supabase";
import { absoluteUrl } from "@/lib/utils";
import { UserMetadata } from "@/types";
import {
  Anchor,
  Button,
  Group,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import { AuthError } from "@supabase/supabase-js";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-hot-toast";

const initialValues = { first_name: "", last_name: "", email: "", password: "" };

export default function SignUpPage() {
  const { getInputProps, onSubmit, reset } = useForm({
    initialValues,
    validate: {
      first_name: isNotEmpty("First name is required"),
      last_name: isNotEmpty("Last name is required"),
      email: isEmail("Invalid email"),
      password: hasLength({ min: 6 }, "Password must contain at least 6 chars"),
    },
  });
  const { mutateAsync, isLoading } = useMutation({
    mutationFn: async (values: typeof initialValues) => {
      const { email, password, first_name, last_name } = values;
      const res = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: absoluteUrl("/auth/callback"),
          data: {
            first_name,
            last_name,
          } satisfies UserMetadata,
        },
      });

      if (res.error) {
        throw res.error;
      }

      return res;
    },
  });

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      await mutateAsync(values);
      reset();
      toast.success(
        "We just sent you the confirmation mail. Please open the link and attempt to log in."
      );
    } catch (err) {
      if (err instanceof AuthError) {
        toast.error(err.message);
      }
    }
  };

  return (
    <Stack justify="center" spacing="xl">
      <Title order={2} weight={500} align="center">
        Sign up
      </Title>
      <form className="flex flex-col gap-4" onSubmit={onSubmit(handleSubmit)}>
        <Group grow>
          <TextInput required label="First name" {...getInputProps("first_name")} />
          <TextInput required label="Last name" {...getInputProps("last_name")} />
        </Group>
        <TextInput required label="Email" type="email" {...getInputProps("email")} />
        <PasswordInput required label="Password" {...getInputProps("password")} />
        <Button type="submit">Sign up</Button>
      </form>
      <Text align="center">
        Already have an account?{" "}
        <Anchor component={Link} href="/auth">
          Sign in
        </Anchor>
      </Text>
      <LoadingOverlay visible={isLoading} overlayBlur={2} />
    </Stack>
  );
}
