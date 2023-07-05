"use client";
import Icon from "@/components/Icon";
import { AppProps } from "@/types";
import { ActionIcon, Affix, Container, Stack, Transition, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

export default function BlogDetailsPageLayout(props: AppProps) {
  const { children } = props;
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Container p={0} size="xl">
      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition transition="fade" mounted={scroll.y > 500}>
          {(transitionStyles) => (
            <Stack style={transitionStyles} spacing={0}>
              <ActionIcon
                color="blue"
                variant="subtle"
                size="xl"
                onClick={() => scrollTo({ y: 0 })}
              >
                <Icon name="IconArrowUp" size={24} />
              </ActionIcon>
              <ActionIcon
                color="blue"
                variant="subtle"
                size="xl"
                onClick={() => scrollTo({ y: document.body.scrollHeight })}
              >
                <Icon name="IconArrowDown" size={24} />
              </ActionIcon>
            </Stack>
          )}
        </Transition>
      </Affix>
      {children}
    </Container>
  );
}
