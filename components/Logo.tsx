import { Title, TitleOrder } from "@mantine/core";

export default function Logo(props: { size?: number; order?: TitleOrder }) {
  const { order = 2, size = 35 } = props;
  return (
    <Title className="select-none" order={order} size={size}>
      PublishWise📝
    </Title>
  );
}
