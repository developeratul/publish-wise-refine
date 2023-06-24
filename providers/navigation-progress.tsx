"use client";
import { NavigationProgress } from "@mantine/nprogress";

// TODO: MAKE IT WORK WITH APP ROUTER
export default function NavigationProgressProvider() {
  return <NavigationProgress autoReset size={3} color="violet" />;
}
