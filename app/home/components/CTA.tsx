"use client";
import Icon from "@/components/Icon";
import useMediaQuery from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@mantine/core";
import Link from "next/link";

export default function CTA(props: { className?: string }) {
  const { className } = props;
  const { isOverXs } = useMediaQuery();
  return (
    <Button
      rightIcon={isOverXs && <Icon name="IconBookUpload" />}
      className={cn(className)}
      component={Link}
      href="/dashboard"
    >
      Start publishing
    </Button>
  );
}
