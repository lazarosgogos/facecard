import { Stack } from "expo-router"

export default function RootLayout() {

    return <Stack>
        <Stack.Screen name="index" options={{ headerTitle:"Home", headerShown: false,  }} />
        <Stack.Screen name="selected_event/[event_id]" options={{ headerTitle: 'Selected event', headerShown: true,  }} />
    </Stack>

}