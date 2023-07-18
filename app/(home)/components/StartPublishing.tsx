"use client";
import GetStartedSrc from "@/assets/svg/get-started.svg";
import Icon from "@/components/Icon";
import { Badge, Center, Container, Divider, List, Stack, ThemeIcon, Title } from "@mantine/core";
import Image from "next/image";
import React from "react";
import CTA from "./CTA";

export default function StartPublishing() {
  return (
    <React.Fragment>
      <Divider />
      <Container py={100} size="xl">
        <Center>
          <Stack spacing={50} align="center">
            <Image width={300} src={GetStartedSrc} alt="Get started with PublishWise" />
            <Stack align="start">
              <Title size={30} weight={600} order={3}>
                Ready to start publishing?
              </Title>
              <List
                spacing="sm"
                icon={
                  <ThemeIcon color="green">
                    <Icon name="IconCheck" />
                  </ThemeIcon>
                }
              >
                <List.Item>Write, publish and edit your blogs from one place</List.Item>
                <List.Item>Cross-posting made simple</List.Item>
                <List.Item>Don&apos;t ever be repetitive while publishing</List.Item>
                <List.Item>Publish blogs on Dev.to and HashNode. More coming soon</List.Item>
                <List.Item>
                  Schedule blogs <Badge color="orange">Coming soon...</Badge>
                </List.Item>
              </List>
              <CTA />
            </Stack>
          </Stack>
        </Center>
      </Container>
    </React.Fragment>
  );
}
