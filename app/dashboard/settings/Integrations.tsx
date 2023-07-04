"use client";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import { BlockLoader, SectionLoader } from "@/components/Loader";
import useMediaQuery from "@/hooks/useMediaQuery";
import { supabaseClient } from "@/lib/supabase";
import { BlogApiKeyNames, BlogProviders, BlogUser } from "@/types";
import {
  Alert,
  Anchor,
  Avatar,
  Button,
  Card,
  Flex,
  Group,
  Indicator,
  Popover,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
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
          secondaryLinkUrl="https://hashnode.com/settings"
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

interface UserBlogAccountDetailsProps {
  apiKey: string | null;
  provider: BlogProviders;
  hashNodeUsername?: string;
}

function UserBlogAccountDetails(props: UserBlogAccountDetailsProps) {
  const { apiKey, provider, hashNodeUsername } = props;
  const { isLoading, data, isError, error } = useQuery({
    queryKey: ["get-integration-status", provider],
    queryFn: async () => {
      const {
        data: { user },
      } = await axios.post<{ user: BlogUser }>(
        `/dashboard/settings/integration-status`,
        { provider: provider, apiKey, hashNodeUsername },
        { headers: { "Content-Type": "application/json" } }
      );
      return user;
    },
    enabled: !!apiKey,
    useErrorBoundary: false,
  });

  if (isLoading) return <BlockLoader />;
  if (isError && error instanceof AxiosError && error.response?.status === 401)
    return (
      <Alert w="100%" icon={<Icon name="IconAlertTriangle" />} color="red">
        {error.response.data.message}
      </Alert>
    );
  if (isError) return <></>;

  const user = data;

  return (
    <Group w="100%" align="center" noWrap>
      <Indicator position="bottom-end" offset={10} size={15} color="green">
        <Avatar size="xl" radius="xl" src={user.avatarUrl} />
      </Indicator>
      <Stack spacing="xs">
        <Title lineClamp={1} order={3} color="white">
          {user.name}
        </Title>
        <Text lineClamp={1}>@{user.username}</Text>
      </Stack>
    </Group>
  );
}

interface SingleIntegrationProps {
  name: string;
  description: string;
  linkUrl: string;
  secondaryLinkUrl?: string;
  logoSrc: StaticImageData;
  apiKeyName: BlogApiKeyNames;
  provider: BlogProviders;
}

/**
 * // TODO: Show the user data fetched through the api keys
 * TODO: Remove api key
 * // TODO: API key expired alert
 */
function SingleIntegration(props: SingleIntegrationProps) {
  const { description, logoSrc, name, apiKeyName, provider, linkUrl, secondaryLinkUrl } = props;
  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [hashNodeUserNameInput, setHashNodeUsernameInput] = React.useState("");
  const { isLoading, data, isError } = useQuery({
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
      setApiKeyInput(data[apiKeyName] || "");
    },
  });
  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationKey: ["update-blog-api-keys"],
    mutationFn: async (input: { removeAPIKey?: boolean; removeHashNodeUsername?: boolean }) => {
      const { removeAPIKey = false, removeHashNodeUsername = false } = input;

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      const { data, error } = await supabaseClient
        .from("profiles")
        .update({
          [apiKeyName]: removeAPIKey ? null : apiKeyInput,
          ...(provider === "hashNode"
            ? { hashNodeUsername: removeHashNodeUsername ? null : hashNodeUserNameInput }
            : {}),
        })
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
  const [opened, { open, close }] = useDisclosure(false);
  const { isOverSm } = useMediaQuery();
  const queryClient = useQueryClient();

  if (isLoading) return <SectionLoader />;
  if (isError) return <></>;

  const apiKey = data[apiKeyName];
  const hashNodeUsername = data["hashNodeUsername"];
  const hasAllCredentialsToShowDetails =
    provider === "hashNode" ? !!hashNodeUsername && !!apiKey : !!apiKey;

  const handleSave = async () => {
    try {
      await mutateAsync({});
      await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
      await queryClient.invalidateQueries({ queryKey: ["get-integration-status", provider] });
    } catch (err) {
      //
    }
  };

  const handleRemove = async () => {
    try {
      await mutateAsync({
        removeAPIKey: true,
        removeHashNodeUsername: provider === "hashNode",
      });
      await queryClient.invalidateQueries({ queryKey: ["get-blog-api-keys"] });
      await queryClient.invalidateQueries({ queryKey: ["get-integration-status", provider] });
      close();
    } catch (err) {
      //
    }
  };

  return (
    <Flex direction={isOverSm ? "row" : "column"} gap="xl">
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
            condition={hasAllCredentialsToShowDetails}
            component={
              <UserBlogAccountDetails
                hashNodeUsername={hashNodeUsername || undefined}
                apiKey={apiKey}
                provider={provider}
              />
            }
            fallback={
              <Stack w="100%">
                <TextInput
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
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
                {provider === "hashNode" && (
                  <TextInput
                    label="Username"
                    onChange={(e) => setHashNodeUsernameInput(e.target.value)}
                    value={hashNodeUserNameInput}
                    icon={<Icon name="IconAt" size={18} />}
                    description={
                      <React.Fragment>
                        <Anchor target="_blank" href={secondaryLinkUrl}>
                          Click here
                        </Anchor>{" "}
                        to get your Hashnode Username. You can find it under the &quot;Personal
                        Identity&quot; section.
                      </React.Fragment>
                    }
                  />
                )}
              </Stack>
            }
          />
          <Conditional
            condition={hasAllCredentialsToShowDetails}
            component={
              <Popover withinPortal withArrow opened={opened} onClose={close}>
                <Popover.Target>
                  <Button
                    onClick={open}
                    loading={isUpdating}
                    color="red"
                    size="xs"
                    leftIcon={<Icon size={16} name="IconTrash" />}
                  >
                    Remove
                  </Button>
                </Popover.Target>
                <Popover.Dropdown w="100%" maw={400}>
                  <Stack>
                    <Title order={3} color="white">
                      Are you sure?
                    </Title>
                    <Text>
                      Your account will get disconnected from PublishWise and will require a
                      reconnection
                    </Text>
                    <Group>
                      <Button loading={isUpdating} onClick={handleRemove} color="red">
                        Yes
                      </Button>
                      <Button onClick={close} loading={isUpdating} variant="subtle">
                        No
                      </Button>
                    </Group>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
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
