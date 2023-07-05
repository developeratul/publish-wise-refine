"use client";
import Icon from "@/components/Icon";
import { AppProps } from "@/types";
import { ActionIcon, Affix, Container, Transition, rem } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

export default function BlogDetailsPageLayout(props: AppProps) {
  const { children } = props;
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Container p={0} size="xl">
      <Affix position={{ bottom: rem(20), right: rem(20) }}>
        <Transition transition="slide-up" mounted={scroll.y > 500}>
          {(transitionStyles) => (
            <ActionIcon
              color="blue"
              variant="subtle"
              size="xl"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <Icon name="IconArrowUp" size={24} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
      {children}
    </Container>
  );
}
