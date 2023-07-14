import EmptyIllusSrc from "@/assets/svg/empty.svg";
import { Center, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";

interface MessageProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyMessage(props: MessageProps) {
  const { title, description, action } = props;
  return (
    <Center py={50}>
      <Stack align="center" spacing={30}>
        <Image src={EmptyIllusSrc} alt="Empty illustration" width={250} />
        <Stack align="center">
          <Stack spacing={5} align="center">
            <Title align="center" order={3}>
              {title}
            </Title>
            {description && (
              <Text align="center" color="dimmed">
                {description}
              </Text>
            )}
          </Stack>
          {action}
        </Stack>
      </Stack>
    </Center>
  );
}
