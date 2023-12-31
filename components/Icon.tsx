import * as icons from "@tabler/icons-react";

export type IconNames = keyof Omit<typeof icons, "createReactComponent">;

const Icon = (props: {
  name: IconNames;
  color?: string;
  size?: number | string;
  stroke?: number;
}) => {
  const { name, color, size = 20, stroke = 2 } = props;

  const TablerIcon = icons[name];

  return <TablerIcon stroke={stroke} color={color} size={size} />;
};

export default Icon;
