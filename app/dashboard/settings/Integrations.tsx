"use client";
import { GetIntegrationStatusResponse } from "@/app/api/get-integrated-blogs/route";
import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import { BlockLoader } from "@/components/Loader";
import useMediaQuery from "@/hooks/useMediaQuery";
import { BlogApiKeyNames, BlogApiKeys, BlogProviders } from "@/types";
import {
  ActionIcon,
  Alert,
  Anchor,
  Avatar,
  Button,
  Card,
  CopyButton,
  Flex,
  Group,
  Indicator,
  Popover,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image, { StaticImageData } from "next/image";
import React from "react";
import superjson from "superjson";

export default function Integrations() {
  return (
    <Stack spacing={50}>
      <Stack spacing="xs">
        <Title order={2}>Integrations</Title>
        <Text>Your API keys are stored locally for security concerns</Text>
      </Stack>
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
          linkUrl="https://medium.com/me/settings/security"
          description="Medium is a place to write, read, and connect."
          apiKeyName="mediumAPIKey"
          logoSrc={MediumLogoSrc}
        />
      </Stack>
    </Stack>
  );
}

export function useGetIntegratedBlogsQuery() {
  const { apiKeys, hasMounted } = useLocalApiKeys();

  return useQuery({
    queryKey: ["get-integrated-blogs"],
    queryFn: async () => {
      const { accounts, apiKeys: blogApiKeys } = (
        await axios.post<GetIntegrationStatusResponse>(
          `/api/get-integrated-blogs`,
          { ...apiKeys },
          { headers: { "Content-Type": "application/json" } }
        )
      ).data;

      return { accounts, apiKeys: blogApiKeys };
    },
    enabled: hasMounted,
    useErrorBoundary: false,
  });
}

interface UserBlogAccountDetailsProps {
  apiKey: string | null;
  provider: BlogProviders;
}

function UserBlogAccountDetails(props: UserBlogAccountDetailsProps) {
  const { apiKey, provider } = props;
  const { isLoading, isError, data, isFetchedAfterMount } = useGetIntegratedBlogsQuery();

  if (isLoading || !isFetchedAfterMount) return <BlockLoader />;
  if (isError) return <></>;

  const user = data.accounts[provider];

  if (!user)
    return (
      <Alert w="100%" icon={<Icon name="IconAlertTriangle" />} color="red">
        Your API key was invalid or expired
      </Alert>
    );

  return (
    <Group w="100%" align="center" noWrap>
      <Indicator position="bottom-end" offset={10} size={15} color="green">
        <Avatar size="xl" radius="100%" src={user.avatarUrl} />
      </Indicator>
      <Stack spacing="xs">
        <Title lineClamp={1} order={3}>
          {user.name}
        </Title>
        <Text lineClamp={1}>@{user.username}</Text>
        <Group spacing="xs" noWrap>
          <Text
            w="100%"
            maw={150}
            sx={{ whiteSpace: "normal" }}
            lineClamp={1}
            size="xs"
            color="dimmed"
          >
            {apiKey}
          </Text>
          <CopyButton value={apiKey as string} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
                <ActionIcon size="sm" color={copied ? "blue" : "gray"} onClick={copy}>
                  {copied ? (
                    <Icon name="IconCheck" size="1rem" />
                  ) : (
                    <Icon name="IconCopy" size="1rem" />
                  )}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </Group>
      </Stack>
    </Group>
  );
}

export function useLocalApiKeys() {
  const [hasMounted, setMounted] = React.useState(false);

  const defaultValue = {
    devToAPIKey: null,
    hashNodeAPIKey: null,
    hashNodeUsername: null,
    mediumAPIKey: null,
  };

  const [apiKeys, setApiKeys] = useLocalStorage<BlogApiKeys>({
    serialize: superjson.stringify,
    deserialize: (str) => (str === undefined ? defaultValue : superjson.parse(str)),
    key: "api-keys",
    defaultValue,
  });

  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, [setMounted]);

  return { apiKeys, setApiKeys, hasMounted };
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

function SingleIntegration(props: SingleIntegrationProps) {
  const { description, logoSrc, name, apiKeyName, provider, linkUrl, secondaryLinkUrl } = props;

  const [apiKeyInput, setApiKeyInput] = React.useState("");
  const [hashNodeUserNameInput, setHashNodeUsernameInput] = React.useState("");

  const { apiKeys, setApiKeys } = useLocalApiKeys();

  const { mutateAsync, isLoading: isUpdating } = useMutation({
    mutationKey: ["update-blog-api-keys"],
    mutationFn: async (input: { removeAPIKey?: boolean; removeHashNodeUsername?: boolean }) => {
      const { removeAPIKey = false, removeHashNodeUsername = false } = input;
      setApiKeys((prevState) => ({
        ...prevState,
        [apiKeyName]: removeAPIKey ? null : apiKeyInput,
        ...(provider === "hashNode"
          ? { hashNodeUsername: removeHashNodeUsername ? null : hashNodeUserNameInput }
          : {}),
      }));
    },
  });

  const [opened, { open, close }] = useDisclosure(false);
  const { isOverSm } = useMediaQuery();
  const queryClient = useQueryClient();

  const apiKey = apiKeys[apiKeyName];
  const hashNodeUsername = apiKeys["hashNodeUsername"];
  const hasAllCredentialsToShowDetails =
    provider === "hashNode" ? !!hashNodeUsername && !!apiKey : !!apiKey;

  const handleSave = async () => {
    try {
      await mutateAsync({});
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
          <Title order={3} weight={500}>
            {name}
          </Title>
        </Group>
        <Text color="dimmed">{description}</Text>
      </Stack>
      <Card withBorder sx={{ flex: 1 }}>
        <Stack align="end">
          <Conditional
            condition={hasAllCredentialsToShowDetails}
            component={<UserBlogAccountDetails apiKey={apiKey} provider={provider} />}
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
                    <Title order={3}>Are you sure?</Title>
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
