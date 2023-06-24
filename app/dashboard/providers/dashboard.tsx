"use client";

import { AppProps, Blog } from "@/types";
import { Container, Stack } from "@mantine/core";
import { User } from "@supabase/supabase-js";
import React from "react";

export interface DashboardContextInitialState {
  user: User | null;
  blogs: Blog[];
}

const DashboardContext = React.createContext<DashboardContextInitialState | undefined>(undefined);

export default function DashboardProvider(
  props: AppProps & { user: DashboardContextInitialState["user"]; blogs: Blog[] }
) {
  const { children, user, blogs } = props;
  return (
    <DashboardContext.Provider value={{ user, blogs }}>
      <Container size="xl">
        <Stack spacing={50}>{children}</Stack>
      </Container>
    </DashboardContext.Provider>
  );
}

export function useDashboardContext() {
  const dashboardContext = React.useContext(DashboardContext);

  if (dashboardContext === undefined) {
    throw new Error("This hook must be used within specified context");
  }

  return dashboardContext;
}
