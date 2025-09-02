import { Stack } from "expo-router"
import { SessionProvider, useSession } from "../components/ctx";
import { SplashScreenController } from '../components/splash';


export default function RootLayout() {

    return (
        <SessionProvider>
            <SplashScreenController />
            <RootNavigator />
        </SessionProvider>
    )
}

function RootNavigator() {
    const { session } = useSession();

    return <Stack>
        <Stack.Protected guard={session}>
            <Stack.Screen name="index" options={{ headerTitle: "Home", headerShown: false, }} />
            <Stack.Screen name="selected_event/[event_id]" options={{ headerTitle: 'Selected event', headerShown: true, }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
            <Stack.Screen name='sign-in' options={{ headerTitle: "Sign in" }} />
        </Stack.Protected>
    </Stack>
}