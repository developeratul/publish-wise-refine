import React from "react";
import { AppProps } from "next/app";
import type { NextPage } from "next";
import { Refine, GitHubBanner, } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
    import { notificationProvider
,ThemedLayoutV2
,RefineThemes} from '@refinedev/mantine';
import routerProvider, { UnsavedChangesNotifier, DocumentTitleHandler } from "@refinedev/nextjs-router";

import { dataProvider } from "@refinedev/supabase";
import { MantineProvider, Global, ColorScheme, ColorSchemeProvider} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorage } from "@mantine/hooks";
import { authProvider } from "src/authProvider";
import { supabaseClient } from "src/utility";
import { Header } from "@components/header"




export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
     noLayout?: boolean;
 };

 type AppPropsWithLayout = AppProps & {
     Component: NextPageWithLayout;
 };

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
    const renderComponent = () => {
        if (Component.noLayout) {
            return <Component {...pageProps} />;
        }

            return (
                <ThemedLayoutV2
                    Header={() => <Header sticky />}
                >
                    <Component {...pageProps} />
                </ThemedLayoutV2>
            );
    };

    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
                key: "mantine-color-scheme",
                defaultValue: "light",
                getInitialValueInEffect: true,
            });
    const toggleColorScheme = (value?: ColorScheme) =>
                setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    return (
        <>
        <GitHubBanner />
        <RefineKbarProvider>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
{/* You can change the theme colors here. example: theme={{ ...RefineThemes.Magenta, colorScheme:colorScheme }} */}
<MantineProvider theme={{ ...RefineThemes.Blue, colorScheme:colorScheme }} withNormalizeCSS withGlobalStyles>
<Global styles={{ body: { WebkitFontSmoothing: "auto" } }} />
<NotificationsProvider position="top-right">
            <Refine 
                routerProvider={routerProvider}
                dataProvider={dataProvider(supabaseClient)}
authProvider={authProvider}
notificationProvider={notificationProvider}
                options={{
                    syncWithLocation: true,
                    warnWhenUnsavedChanges: true,
                     
                }}
            >
                {renderComponent()}
                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
            </Refine>
            </NotificationsProvider>

</MantineProvider>

</ColorSchemeProvider>
        </RefineKbarProvider>
        </>
      );
};


export default MyApp;
