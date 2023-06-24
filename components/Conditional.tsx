import React from "react";

export type ConditionalProps = {
  condition: boolean;
  component: React.ReactNode;
  fallback?: React.ReactNode;
};

export function Conditional(props: ConditionalProps) {
  const { condition, component, fallback } = props;
  return condition ? <>{component}</> : <>{fallback}</>;
}
