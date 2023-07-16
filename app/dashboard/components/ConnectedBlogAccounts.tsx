"use client";

import DevToLogoSrc from "@/assets/logos/dev-to.png";
import HashNodeLogoSrc from "@/assets/logos/hashnode.png";
import MediumLogoSrc from "@/assets/logos/medium.png";
import { Conditional } from "@/components/Conditional";
import Icon from "@/components/Icon";
import { BlockLoader } from "@/components/Loader";
import useColorModeValue from "@/hooks/useColorModeValue";
import useMediaQuery from "@/hooks/useMediaQuery";
import { BlogUser } from "@/types";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useGetIntegratedBlogsQuery } from "../settings/Integrations";

function SingleBlogAccount(props: {
  title: string;
  description: string;
  iconSrc: StaticImageData;
  isConnected: boolean;
  user?: BlogUser;
}) {
  const { title, description, iconSrc, isConnected, user } = props;
  return (
    <Card withBorder p="lg">
      <Stack spacing="xl">
        <Image src={iconSrc} alt={title} width={50} />
        <Stack spacing="xs">
          <Title order={3}>{title}</Title>
          <Conditional
            condition={isConnected && !!user}
            component={
              <Group noWrap spacing="xs">
                <Avatar size="sm" radius="100%" src={user?.avatarUrl} alt={user?.name} />
                <Text lineClamp={1}>
                  Connected as <b>@{user?.username}</b>
                </Text>
              </Group>
            }
            fallback={<Text color="dimmed">{description}</Text>}
          />
        </Stack>
        <Conditional
          condition={isConnected}
          component={
            <Badge color="green" className="self-start" size="lg" variant="dot">
              Connected
            </Badge>
          }
          fallback={
            <Button component={Link} href="/dashboard/settings" leftIcon={<Icon name="IconPlus" />}>
              Connect
            </Button>
          }
        />
      </Stack>
    </Card>
  );
}

export default function ConnectedBlogAccounts() {
  const { isLoading, isError, data } = useGetIntegratedBlogsQuery();
  const theme = useMantineTheme();
  const { isOverXs, isOverSm, isOverXl } = useMediaQuery();

  const titleColor = useColorModeValue(theme.black, theme.white);

  if (isLoading)
    return (
      <Card withBorder>
        <BlockLoader />
      </Card>
    );
  if (isError) return <></>;

  const { accounts } = data;

  return (
    <Stack>
      <Title weight={500} color={titleColor} order={2}>
        Blog accounts
      </Title>
      <SimpleGrid cols={isOverSm ? 3 : 1}>
        <SingleBlogAccount
          title="Dev.to"
          description="Dev.to is a place where coders share, stay up-to-date and grow their careers."
          iconSrc={DevToLogoSrc}
          isConnected={!!accounts["dev.to"]}
          user={accounts["dev.to"]}
        />
        <SingleBlogAccount
          title="HashNode"
          description="Everything you need to start blogging as a developer!"
          iconSrc={HashNodeLogoSrc}
          isConnected={!!accounts["hashNode"]}
          user={accounts["hashNode"]}
        />
        <SingleBlogAccount
          title="Medium"
          description="Medium is a place to write, read, and connect."
          iconSrc={MediumLogoSrc}
          isConnected={!!accounts["medium"]}
          user={accounts["medium"]}
        />
      </SimpleGrid>
    </Stack>
  );
}
