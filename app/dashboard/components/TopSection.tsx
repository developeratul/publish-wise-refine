"use client";
import { Stack } from "@mantine/core";
import DashboardHeader from "./Header";
import DashboardStats from "./Stats";

export default function DashboardTopSection() {
  return (
    <Stack>
      <DashboardHeader />
      <DashboardStats />
    </Stack>
  );
}
