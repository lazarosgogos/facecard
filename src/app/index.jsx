import {
    SafeAreaView,
    StyleSheet,
} from 'react-native';
import InitialPageComponent from "../components/initial-page/InitialPageComponent";
import { useTheme } from '../ThemeContext';

export default function App() {
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <SafeAreaView style={styles.container}>
            <InitialPageComponent />
        </SafeAreaView>
    )
}

const getStyles = (theme) => StyleSheet.create(
    {
        container: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            backgroundColor: theme.background,
        }
    }
)
