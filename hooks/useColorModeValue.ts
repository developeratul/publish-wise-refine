import { useMantineColorScheme } from "@mantine/core";

export default function useColorModeValue(light: string, dark: string) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  return isDark ? dark : light;
}
