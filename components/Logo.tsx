import { Title, TitleOrder } from "@mantine/core";
import Link from "next/link";

export default function Logo(props: { size?: number; order?: TitleOrder; href?: string }) {
  const { order = 2, size = 35, href = "" } = props;
  return (
    <Link className="text-white no-underline" href={href}>
      <Title className="select-none" order={order} size={size}>
        PublishWise📝
      </Title>
    </Link>
  );
}
