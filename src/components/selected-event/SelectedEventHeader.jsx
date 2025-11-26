import { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useTheme } from "../../ThemeContext";

export default function SelectedEventHeader({ event_id, handleImageFetching }) {
    const [images, setImages] = useState([]);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    useEffect(() => {
        fetchImages();
    }, [])

    const fetchImages = async () => {
        const { data, error } = await supabase
            .from('photos')
            .select('id, url')
            .eq('event_id', event_id)
            .limit(9);

        if (data) setImages(data);
        handleImageFetching(data);
    }



    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Images from selected event: </Text>
        </View>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, justifyContent: 'center' },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: theme.text,
    },
})
