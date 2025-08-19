import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { SafeAreaView, Text, FlatList, StyleSheet, Image } from "react-native";
import SelectedEventHeader from "../../components/selected-event/SelectedEventHeader";
import { supabase } from "../../../lib/supabase";


export default function SelectedEvent() {
    const { event_id } = useLocalSearchParams();
    const [images, setImages] = useState([]);

    function handleImageFetching(fetchedImages) {
        setImages(fetchedImages)
    }

    const renderImage = ({item}) => {
        return <Image source={{ uri: item.url }} style={styles.image} />
    }
    

    return <SafeAreaView style={styles.container}>
        {/* <Text>Selected Event page {event_id}</Text> */}
        <FlatList 
            data={images}
            renderItem={renderImage}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            style={styles.container}
            columnWrapperStyle={styles.contentContainerStyle}
            ListHeaderComponent={<SelectedEventHeader event_id={event_id} handleImageFetching={handleImageFetching}/>
            }
        />
    </SafeAreaView>
    
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10,},
    image: {width:100, height:100, margin:5,},
    contentContainerStyle: {justifyContent:'center', alignItems: 'center',},

})