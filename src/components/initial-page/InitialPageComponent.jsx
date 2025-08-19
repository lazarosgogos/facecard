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
import { FlatList } from "react-native";
import ListHeaderComponent from "./ListHeaderComponent";
import ListFooterComponent from "./ListFooterComponent"
import { useRouter } from "expo-router";


export default function InitialPageComponent() {
    const [emptyList, setEmptyList] = useState(true);
    const [events, setEvents] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null);
    const router = useRouter();

    const handleEventsLoaded = (fetchedEvents) => {
        setEvents(fetchedEvents);
    }
    const renderEvent = ({ item }) => (
        <TouchableOpacity 
            style={styles.eventItem} 
            activeOpacity={0.4}
            onPress={() => {
                setSelectedEvent(item.event_id)
                router.push({
                    pathname: '/selected_event/[event_id]',
                    params: { event_id: item.event_id }
                });
            }}
        >
            <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventDepartment}>{item.department}</Text>
                <Text style={styles.eventDate}>
                    {new Date(item.event_date).toLocaleDateString()}
                </Text>
                <Text style={styles.eventPhotos}>{item.photo_count || 0} photos</Text>
                <Ionicons name='chevron-forward-outline' style={styles.eventRightArrow}/>
        </TouchableOpacity>
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
                style={styles.eventsList}
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
        flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#fff', width: '100%'
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
        shadowColor: 'black',
        // shadow effects: 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // for Android
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
    eventRightArrow: {
        color: '#2d50ffff',
        fontSize: 24,
        position: 'absolute',
        right: '1%',
        top: '50%',
        transform: [{ translateY: -12 }],

    }
})