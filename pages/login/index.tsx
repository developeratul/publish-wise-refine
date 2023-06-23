    import { AuthPage, ThemedTitleV2 } from "@refinedev/mantine";

import { GetServerSideProps } from "next";

import { authProvider } from "src/authProvider";

export default function Login() {
    return (
        <AuthPage
            type="login"
            formProps={{ initialValues:{ email: "info@refine.dev", password: "refine-supabase" } }}
        />
    );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
    const { authenticated } = await authProvider.check(context);


    if (authenticated) {
        return {
            props: {},
            redirect: {
                destination: `/`,
                permanent: false,
            },
        };
    }

    return {
        props: {
        }
    }
};

