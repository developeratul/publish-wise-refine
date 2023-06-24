"use client"; // Error components must be Client Components

import { Button, Center, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Center maw={500} mx="auto" w="100%" py={60}>
      <Stack>
        <Title order={2} color="red">
          Something went wrong!
        </Title>
        <Text>
          <pre className="whitespace-pre-wrap">
            <code>{error.message}</code>
          </pre>
        </Text>
        <Button onClick={reset}>Try again</Button>
      </Stack>
    </Center>
  );
}
