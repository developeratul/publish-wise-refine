import { useMantineTheme } from "@mantine/core";
import { useMediaQuery as useCoreMediaQuery } from "@mantine/hooks";

export default function useMediaQuery() {
  const { breakpoints } = useMantineTheme();

  const isOverXs = useCoreMediaQuery(`(min-width: ${breakpoints.xs})`);
  const isOverSm = useCoreMediaQuery(`(min-width: ${breakpoints.sm})`);
  const isOverMd = useCoreMediaQuery(`(min-width: ${breakpoints.md})`);
  const isOverLg = useCoreMediaQuery(`(min-width: ${breakpoints.lg})`);
  const isOverXl = useCoreMediaQuery(`(min-width: ${breakpoints.xl})`);

  const isBelowXs = useCoreMediaQuery(`(max-width: ${breakpoints.xs})`);
  const isBelowSm = useCoreMediaQuery(`(max-width: ${breakpoints.sm})`);
  const isBelowMd = useCoreMediaQuery(`(max-width: ${breakpoints.md})`);
  const isBelowLg = useCoreMediaQuery(`(max-width: ${breakpoints.lg})`);
  const isBelowXl = useCoreMediaQuery(`(max-width: ${breakpoints.xl})`);

  return {
    isOverSm,
    isOverMd,
    isOverLg,
    isOverXl,
    isOverXs,
    isBelowSm,
    isBelowMd,
    isBelowLg,
    isBelowXl,
    isBelowXs,
  };
}
