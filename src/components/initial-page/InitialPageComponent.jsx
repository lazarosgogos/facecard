import { useState } from "react"
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListHeaderComponent from "./ListHeaderComponent";
import ListFooterComponent from "./ListFooterComponent"
import { useRouter } from "expo-router";
import { useTheme } from "../../ThemeContext";


export default function InitialPageComponent() {
    const [emptyList, setEmptyList] = useState(true);
    const [events, setEvents] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null);
    const router = useRouter();
    const { theme } = useTheme();
    const styles = getStyles(theme);

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
            <Ionicons name='chevron-forward-outline' style={styles.eventRightArrow} />
        </TouchableOpacity>
    );

    const handleListIsEmpty = (listIsEmpty) => {
        setEmptyList(listIsEmpty);
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item => item.event_id.toString())}
                style={styles.eventsList}
                ListEmptyComponent={emptyList ?
                    <Text style={styles.noEvents}>No events found for this period</Text> :
                    <Text style={styles.noEvents}>Select year and month to view events</Text>}
                ListHeaderComponent={<ListHeaderComponent
                    handleListIsEmpty={handleListIsEmpty}
                    loadEvents={handleEventsLoaded}
                />}
                ListFooterComponent={<ListFooterComponent />}
            />

        </SafeAreaView>
    );
}

const getStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1, padding: 16, alignItems: 'center', backgroundColor: theme.background, width: '100%'
    },
    eventsList: {
        padding: 5,
        margin: 'auto',
    },
    eventItem: {
        backgroundColor: theme.card,
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: theme.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: theme.text,
    },
    eventDepartment: {
        fontSize: 14,
        color: theme.secondary,
        marginBottom: 3,
    },
    eventDate: {
        fontSize: 12,
        color: theme.primary,
        marginBottom: 3,
    },
    eventPhotos: {
        fontSize: 12,
        color: theme.tertiary,
    },
    noEvents: {
        textAlign: 'center',
        fontSize: 14,
        color: theme.secondary,
        fontStyle: 'italic',
        padding: 20,
    },
    eventRightArrow: {
        color: theme.primary,
        fontSize: 24,
        position: 'absolute',
        right: '1%',
        top: '50%',
        transform: [{ translateY: -12 }],

    }
})