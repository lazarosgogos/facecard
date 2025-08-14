import { useEffect, useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    Button
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import YearMonthEventPicker from "../old_js/YearMonthEventPicker";

export default function ListHeaderComponent({ handleListIsEmpty, loadEvents }) {
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [fetchedEvents, setFetchedEvents] = useState([]);

    const handleEventsLoaded = (events) => {
        setFetchedEvents(events);
        // Now you can use selectedEvents elsewhere in your app
        
    }

    useEffect(() => { loadEvents(fetchedEvents) }, [fetchedEvents])
    const pickImage = async () => {
        
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload your image here!</Text>
            
            {/* Image box */}
            <View style={styles.imageBox} >
                {image ? (
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setImage(null)}>
                            <Ionicons name="close-circle" size={24} color="red"/>
                        </TouchableOpacity>
                    </View>
                ) 
                : 
                (
                    <View>
                        <TouchableOpacity onPress={pickImage} style={styles.placeholder}>
                            <Ionicons name="person-circle-outline" size={80} color="#888" />
                                <Text style={styles.placeholderText}>Tap or drag an image here</Text>
                        </TouchableOpacity>
                    </View>
                )}                
            </View>
            <YearMonthEventPicker onEventsLoaded={handleEventsLoaded}
            handleEmptyList={handleListIsEmpty} />
        </View>
    )
}

const BOX_SIZE = 180;

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff', },
    header: { fontSize: 22, fontWeight: '700', marginVertical: 24 },
    imageWrapper: {width: '100%', height: '100%', position: 'relative', alignContent: 'center'},
    imagePreview: {flex:1, width: '100%', height: '100%'},
    imageBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        // overflow: 'hidden',
    },
    clearButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    placeholder: {justifyContent: 'center', alignItems: 'center'},
    placeholderText: {marginTop: 8, color: '#888'},
})