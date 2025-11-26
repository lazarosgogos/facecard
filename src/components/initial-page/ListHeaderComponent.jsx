import { useEffect, useState } from "react"
import {
    View,
    StyleSheet,
} from 'react-native';
import YearMonthEventPicker from "./YearMonthEventPicker";
import { useTheme } from "../../ThemeContext";

export default function ListHeaderComponent({ handleListIsEmpty, loadEvents }) {
    const [fetchedEvents, setFetchedEvents] = useState([]);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    const handleEventsLoaded = (events) => {
        setFetchedEvents(events);
    }

    useEffect(() => { loadEvents(fetchedEvents) }, [fetchedEvents])

    return (
        <View style={styles.container}>
            <YearMonthEventPicker onEventsLoaded={handleEventsLoaded}
                handleEmptyList={handleListIsEmpty} />
        </View>
    )
}

const BOX_SIZE = 180;

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: theme.background, },
    header: { fontSize: 22, fontWeight: '700', marginVertical: 24, color: theme.text },
    imageWrapper: { width: '100%', height: '100%', position: 'relative', alignContent: 'center' },
    imagePreview: { flex: 1, width: '100%', height: '100%' },
    imageBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: theme.border,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    clearButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: theme.background,
        borderRadius: 12,
    },
    placeholder: { justifyContent: 'center', alignItems: 'center' },
    placeholderText: { marginTop: 8, color: theme.tertiary },
})
