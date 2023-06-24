"use client";
import { Stack } from "@mantine/core";
import DashboardHeader from "./Header";
import DashboardStats from "./Stats";

export default function DashboardTopSection() {
  return (
    <Stack spacing="xl">
      <DashboardHeader />
      <DashboardStats />
    </Stack>
  );
}
