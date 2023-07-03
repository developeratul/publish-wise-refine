"use client";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import { SectionLoader } from "@/components/Loader";
import { supabaseClient } from "@/lib/supabase";
import { BlogApiKeyNames, BlogProviders, BlogUser } from "@/types";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { toast } from "react-hot-toast";

export default function Integrations() {
  return (
    <Stack spacing="xl">
      <Title order={2}>Integrations</Title>
      <Stack spacing={50}>
        <SingleIntegration
          provider="dev.to"
          name="Dev.to"
          linkUrl="https://dev.to/settings/extensions"
          description="Dev.to is a place where coders share, stay up-to-date and grow their careers."
          apiKeyName="devToAPIKey"
          logoSrc={DevToLogoSrc}
        />
        <SingleIntegration
          provider="hashNode"
          name="HashNode"
          linkUrl="https://hashnode.com/settings/developer"
          description="Everything you need to start blogging as a developer!"
          apiKeyName="hashNodeAPIKey"
          logoSrc={HashNodeLogoSrc}
        />
        <SingleIntegration
          provider="medium"
          name="Medium"
          linkUrl="https://medium.com/me/settings"
          description="Medium is a place to write, read, and connect."
          apiKeyName="mediumAPIKey"
          logoSrc={MediumLogoSrc}
        />
      </Stack>
    </Stack>
  );
}

interface SingleIntegrationProps {
  name: string;
  description: string;
  linkUrl: string;
  logoSrc: StaticImageData;
  apiKeyName: BlogApiKeyNames;
  provider: BlogProviders;
}

/**
 * TODO: Show the user data fetched through the api keys
 * TODO: Remove api key
 * TODO: API key expired alert
 */
function SingleIntegration(props: SingleIntegrationProps) {
  const { description, logoSrc, name, apiKeyName, provider, linkUrl } = props;
  const [apiKey, setApiKey] = React.useState("");
  const {
    isLoading: isApiKeyDataLoading,
    data: apiKeysData,
    isError,
  } = useQuery({
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
      setApiKey(data[apiKeyName] || "");
    },
  });
  const { isLoading: isIntegrationStatusLoading, data: userBlogAccountData } = useQuery({
    queryKey: ["get-integration-status", provider],
    queryFn: async () => {
      const { data } = await axios.post<BlogUser>(
        `/dashboard/settings/integration-status`,
        {
          provider: provider,
          apiKey: apiKeysData && apiKeysData[apiKeyName],
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    },
    enabled: !!(apiKeysData && apiKeysData[apiKeyName]),
    useErrorBoundary: false,
  });
  console.log(userBlogAccountData?.name, userBlogAccountData?.avatarUrl);
  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationKey: ["update-blog-api-keys"],
    mutationFn: async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      const { data, error } = await supabaseClient
        .from("profiles")
        .update({ [apiKeyName]: apiKey })
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

  if (isApiKeyDataLoading) return <SectionLoader />;
  if (isError) return <></>;

  console.log(provider, userBlogAccountData);

  const savedAPIKey = apiKeysData[apiKeyName];

  const handleSave = async () => {
    try {
      await mutateAsync();
      await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
    } catch (err) {
      //
    }
  };

  // const handleRemove = async () => {
  //   try {
  //     await mutateAsync();
  //     await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
  //   } catch (err) {
  //     //
  //   }
  // };

  return (
    <Flex gap="xl">
      <Stack maw={350} spacing="xs">
        <Group>
          <Image width={50} src={logoSrc} alt={`${name} logo`} />
          <Title order={3}>{name}</Title>
        </Group>
        <Text>{description}</Text>
      </Stack>
      <Card withBorder sx={{ flex: 1 }}>
        <Stack align="end">
          <Conditional
            condition={!!savedAPIKey}
            component={
              <Group w="100%">
                <Avatar src={userBlogAccountData?.avatarUrl} />
                <Stack>
                  <Title>{userBlogAccountData?.name}</Title>
                  <Title>@{userBlogAccountData?.username}</Title>
                </Stack>
              </Group>
            }
            fallback={
              <TextInput
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                w="100%"
                label="API key"
                description={
                  <React.Fragment>
                    <Anchor target="_blank" href={linkUrl}>
                      Click here
                    </Anchor>{" "}
                    to get your API key
                  </React.Fragment>
                }
              />
            }
          />
          <Conditional
            condition={!!savedAPIKey}
            component={
              <Button
                loading={isUpdating}
                // onClick={() => handleRemove("devToAPIKey")}
                color="red"
                size="xs"
                leftIcon={<Icon size={16} name="IconTrash" />}
              >
                Remove
              </Button>
            }
            fallback={
              <Button
                loading={isUpdating}
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
  );
}
