import { Text, SafeAreaView, StyleSheet } from "react-native";
import Auth from "../components/Auth";
import { useTheme } from "../ThemeContext";


export default function SignIn() {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return <SafeAreaView style={styles.container}>
        <Text style={styles.headerText}>Sign in page</Text>
        <Auth />
    </SafeAreaView>
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 15, alignItems: 'center', backgroundColor: theme.background },
    headerText: { padding: 15, fontSize: 22, fontWeight: '700', margin: 15, color: theme.text }
})
