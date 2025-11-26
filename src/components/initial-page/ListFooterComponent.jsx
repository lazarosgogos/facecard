
import {
    View,
    Text,
    Button,
    StyleSheet,
} from 'react-native';
import { useSession } from "../ctx";
import { useTheme } from '../../ThemeContext';

export default function ListFooterComponent() {
    const { signOut } = useSession();
    const { theme } = useTheme();
    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Footer text</Text>
            <Button
                onPress={() => {
                    signOut()
                }}
                title="Log out"
                color={theme.primary}
            />
        </View>
    )
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    text: {
        color: theme.text,
        marginBottom: 16,
    },
});
