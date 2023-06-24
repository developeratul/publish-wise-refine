"use client";
import Icon from "@/components/Icon";
import { AppProps } from "@/types";
import { Card, Flex, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";

export default function DashboardStats() {
  return (
    <SimpleGrid cols={3}>
      <StatCard>
        <Flex gap={30} justify="space-between" align="center">
          <ThemeIcon variant="light" color="orange" size={70}>
            <Icon size={40} name="IconCalendarEvent" stroke={1.5} />
          </ThemeIcon>
          <Stack w="100%">
            <Text>Scheduled</Text>
            <Title order={3}>4</Title>
          </Stack>
        </Flex>
      </StatCard>
      <StatCard>
        <Flex gap={30} justify="space-between" align="center">
          <ThemeIcon size={70} variant="light">
            <Icon size={40} name="IconNotes" stroke={1.5} />
          </ThemeIcon>
          <Stack w="100%">
            <Text>Drafts</Text>
            <Title order={3}>10</Title>
          </Stack>
        </Flex>
      </StatCard>
      <StatCard>
        <Flex gap={30} justify="space-between" align="center">
          <ThemeIcon size={70} color="green" variant="light">
            <Icon size={40} name="IconBookUpload" stroke={1.5} />
          </ThemeIcon>
          <Stack w="100%">
            <Text>Published</Text>
            <Title order={3}>20</Title>
          </Stack>
        </Flex>
      </StatCard>
    </SimpleGrid>
  );
}

function StatCard(props: AppProps) {
  const { children } = props;
  return (
    <Card radius="lg" withBorder>
      <Stack>{children}</Stack>
    </Card>
  );
}
