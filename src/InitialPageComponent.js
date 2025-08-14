import { useState } from "react"
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from "react-native-web";
import ListHeaderComponent from "./ListHeaderComponent";
import ListFooterComponent from "./ListFooterComponent"


export default function InitialPageComponent() {
    const [emptyList, setEmptyList] = useState(true)
    const [events, setEvents] = useState(null)

    const handleEventsLoaded = (fetchedEvents) => {
        setEvents(fetchedEvents);
    }
    const renderEvent = ({ item }) => (
            <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDepartment}>{item.department}</Text>
                <Text style={styles.eventDate}>
                    {new Date(item.event_date).toLocaleDateString()}
                </Text>
                <Text style={styles.eventPhotos}>{item.photo_count || 0} photos</Text>
            </View>
        );

    const handleListIsEmpty = (listIsEmpty) => {
        setEmptyList(listIsEmpty);
        // a callback for changing state
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item => item.event_id.toString())}
                style={styles.eventList}
                ListEmptyComponent={emptyList ? //!loading && selectedYear && selectedMonth ?
                    <Text style={styles.noEvents}>No events found for this period</Text> :
                    <Text style={styles.noEvents}>Select year and month to view events</Text>}
                ListHeaderComponent={<ListHeaderComponent
                    handleListIsEmpty={handleListIsEmpty} // a boolean changer
                    loadEvents={handleEventsLoaded}
                />}
                ListFooterComponent={<ListFooterComponent />}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff', width: '450'
    },
    eventsList: {
        padding: 5,
        margin: 'auto',
    },
    eventItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,

    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventDepartment: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    eventDate: {
        fontSize: 12,
        color: '#007AFF',
        marginBottom: 3,
    },
    eventPhotos: {
        fontSize: 12,
        color: '#999',
    },
    noEvents: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        // marginTop: 20,
        padding: 20,
    },
})