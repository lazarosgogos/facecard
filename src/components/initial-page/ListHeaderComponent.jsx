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
import YearMonthEventPicker from "./YearMonthEventPicker";

export default function ListHeaderComponent({ handleListIsEmpty, loadEvents }) {
    const [fetchedEvents, setFetchedEvents] = useState([]);

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