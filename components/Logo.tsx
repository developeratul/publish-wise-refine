import useColorModeValue from "@/hooks/useColorModeValue";
import { Title, TitleOrder, useMantineTheme } from "@mantine/core";
import Link from "next/link";

export default function Logo(props: { size?: number; order?: TitleOrder; href?: string }) {
  const { order = 2, size = 35, href = "" } = props;
  const theme = useMantineTheme();
  return (
    <Link
      className="no-underline"
      style={{ color: useColorModeValue(theme.black, theme.white) }}
      href={href}
    >
      <Title className="select-none" order={order} size={size}>
        PublishWise📝
      </Title>
    </Link>
  );
}
