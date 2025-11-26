import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView, FlatList, StyleSheet, Image } from "react-native";
import SelectedEventHeader from "../../components/selected-event/SelectedEventHeader";
import SelectEventFooter from "../../components/selected-event/SelectEventFooter";
import { useTheme } from "../../ThemeContext";


export default function SelectedEvent() {
    const { event_id } = useLocalSearchParams();
    const [images, setImages] = useState([]);
    const { theme } = useTheme();
    const styles = getStyles(theme);

    function handleImageFetching(fetchedImages) {
        setImages(fetchedImages)
    }

    const renderImage = ({ item }) => {
        return <Image source={{ uri: item.url }} style={styles.image} />
    }


    return <SafeAreaView style={styles.container}>
        <FlatList
            data={images}
            renderItem={renderImage}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            style={styles.container}
            columnWrapperStyle={styles.columnWrapperStyle}
            ListHeaderComponent={<SelectedEventHeader event_id={event_id} handleImageFetching={handleImageFetching} />}
            ListFooterComponent={<SelectEventFooter />}
        />
    </SafeAreaView>
}

const getStyles = (theme) => StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: theme.background },
    image: { width: 100, height: 100, margin: 5, },
    columnWrapperStyle: { justifyContent: 'center', alignItems: 'center', },

})
