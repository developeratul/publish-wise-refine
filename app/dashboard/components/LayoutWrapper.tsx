"use client";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import { supabaseClient } from "@/lib/supabase";
import { AppShell, Avatar, Group, Header, Menu, UnstyledButton } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import DeleteBlogProvider from "../providers/delete-blog";
import UserProvider, { UserProviderProps } from "../providers/user";

export default function DashboardLayoutWrapper(props: UserProviderProps) {
  const { children, user } = props;
  return (
    <AppShell
      header={
        <Header bg="dark.6" height={70}>
          <Group align="center" position="apart" h="100%" px={20}>
            <Logo order={3} size={18} />
            <ProfileMenu />
          </Group>
        </Header>
      }
    >
      <UserProvider user={user}>
        <DeleteBlogProvider>{children}</DeleteBlogProvider>
      </UserProvider>
    </AppShell>
  );
}

function ProfileMenu() {
  const router = useRouter();

  const handleLogout = async () => {
    await toast.promise(supabaseClient.auth.signOut(), {
      loading: "Logging out...",
      success: "Logged out",
      error: "Unexpected error",
    });
    router.push("/auth");
  };

  return (
    <Menu withArrow>
      <Menu.Target>
        <UnstyledButton>
          <Avatar radius="xl" variant="filled" />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/dashboard/settings" icon={<Icon name="IconSettings" />}>
          Settings
        </Menu.Item>
        <Menu.Item onClick={handleLogout} icon={<Icon name="IconLogout" />}>
          Logout from PublishWise
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
