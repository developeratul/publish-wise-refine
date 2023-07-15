import useColorModeValue from "@/hooks/useColorModeValue";
import { cn } from "@/lib/utils";
import { Title, TitleOrder, useMantineTheme } from "@mantine/core";
import Link from "next/link";

export default function Logo(props: {
  size?: number;
  order?: TitleOrder;
  href?: string;
  className?: string;
}) {
  const { order = 2, size = 35, href = "", className } = props;
  const theme = useMantineTheme();
  return (
    <Link
      className="no-underline"
      style={{ color: useColorModeValue(theme.black, theme.white) }}
      href={href}
    >
      <Title className={cn("select-none", className)} order={order} size={size}>
        PublishWise📝
      </Title>
    </Link>
  );
}
