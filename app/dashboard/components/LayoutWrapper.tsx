"use client";
import DefaultUserAvatarSrc from "@/assets/jpg/default-user-avatar.jpg";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import useColorModeValue from "@/hooks/useColorModeValue";
import { supabaseClient } from "@/lib/supabase";
import {
  AppShell,
  Avatar,
  Group,
  Header,
  Menu,
  Text,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
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
        <Header bg={useColorModeValue("gray.0", "dark.8")} height={70}>
          <Group align="center" position="apart" h="100%" px={20}>
            <Logo href="/dashboard" order={3} size={18} />
            <ProfileMenu />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.colors.gray[1],
        },
      })}
    >
      <UserProvider user={user}>
        <DeleteBlogProvider>{children}</DeleteBlogProvider>
      </UserProvider>
    </AppShell>
  );
}

function ProfileMenu() {
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

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
          <Avatar
            src={DefaultUserAvatarSrc.src}
            alt="Default user avatar"
            radius="xl"
            variant="filled"
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/dashboard/settings" icon={<Icon name="IconSettings" />}>
          Settings
        </Menu.Item>
        <Menu.Item onClick={handleLogout} icon={<Icon name="IconLogout" />}>
          Logout from PublishWise
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          onClick={() => toggleColorScheme()}
          rightSection={
            <Text size="xs" pl={16} color="dimmed">
              ⌘+/
            </Text>
          }
          icon={<Icon name={colorScheme === "dark" ? "IconSun" : "IconMoon"} />}
        >
          Switch to {colorScheme === "dark" ? "Light" : "Dark"} mode
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
