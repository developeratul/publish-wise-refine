import { AppProps } from "@/types";
import AuthLayoutWrapper from "./components/LayoutWrapper";

export default async function AuthLayout(props: AppProps) {
  const { children } = props;
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
