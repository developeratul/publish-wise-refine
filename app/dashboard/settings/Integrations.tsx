"use client";
import DevLogoSrc from "@/assets/logos/dev-to.png";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import { FullPageRelativeLoader } from "@/components/Loader";
import { supabaseClient } from "@/lib/supabase";
import { Anchor, Button, Card, Flex, Group, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import { toast } from "react-hot-toast";

interface IntegrationsForm {
  devToAPIKey: string | null;
  mediumAPIKey: string | null;
  hashnodeAPIKey: string | null;
}

export default function Integrations() {
  const { getInputProps, values, setValues, setFieldValue } = useForm<IntegrationsForm>({
    initialValues: {
      devToAPIKey: "",
      hashnodeAPIKey: "",
      mediumAPIKey: "",
    },
  });
  const { isLoading, data } = useQuery({
    queryKey: ["get-blog-api-keys"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("userId", user?.id)
        .single();

      if (error) {
        toast.error(error.message);
        throw error;
      }

      return data;
    },
    onSuccess(data) {
      setValues({
        devToAPIKey: data.devToAPIKey,
        hashnodeAPIKey: data.hashnodeAPIKey,
        mediumAPIKey: data.mediumAPIKey,
      });
    },
  });
  const { mutateAsync, isLoading: isUpdatingAPIKeys } = useMutation({
    mutationKey: ["update-blog-api-keys"],
    mutationFn: async (values: IntegrationsForm) => {
      const { devToAPIKey, hashnodeAPIKey, mediumAPIKey } = values;
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ devToAPIKey, hashnodeAPIKey, mediumAPIKey })
        .eq("userId", user?.id)
        .select("*")
        .single();
      if (error) {
        toast.error(error.message);
        throw error;
      }
      return data;
    },
  });
  const queryClient = useQueryClient();

  if (isLoading) return <FullPageRelativeLoader />;

  const handleSave = async () => {
    try {
      await mutateAsync(values);
      await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
    } catch (err) {
      //
    }
  };

  const handleRemove = async (field: keyof IntegrationsForm) => {
    try {
      setFieldValue(field, "");
      await mutateAsync({ ...values, [field]: "" });
      await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
    } catch (err) {
      //
    }
  };

  return (
    <Stack spacing="xl">
      <Title order={2}>Integrations</Title>
      <Flex gap="xl">
        <Stack maw={300} spacing="xs">
          <Group>
            <Image width={50} src={DevLogoSrc} alt="DEV.to logo" />
            <Title order={3}>DEV.to</Title>
          </Group>
          <Text>Dev.to is a place where coders share, stay up-to-date and grow their careers.</Text>
        </Stack>
        <Card withBorder sx={{ flex: 1 }}>
          <Stack align="end">
            <Conditional
              condition={!!data?.devToAPIKey}
              component={<Text w="100%">{data?.devToAPIKey}</Text>}
              fallback={
                <TextInput
                  {...getInputProps("devToAPIKey")}
                  w="100%"
                  label="API key"
                  description={
                    <React.Fragment>
                      <Anchor target="_blank" href="https://dev.to/settings/extensions">
                        Click here
                      </Anchor>{" "}
                      to get your API key
                    </React.Fragment>
                  }
                />
              }
            />
            <Conditional
              condition={!!data?.devToAPIKey}
              component={
                <Button
                  loading={isUpdatingAPIKeys}
                  onClick={() => handleRemove("devToAPIKey")}
                  color="red"
                  size="xs"
                  leftIcon={<Icon name="IconTrash" />}
                >
                  Remove
                </Button>
              }
              fallback={
                <Button
                  loading={isUpdatingAPIKeys}
                  onClick={handleSave}
                  size="xs"
                  leftIcon={<Icon size={16} name="IconDeviceFloppy" />}
                >
                  Save
                </Button>
              }
            />
          </Stack>
        </Card>
      </Flex>
    </Stack>
  );
}
