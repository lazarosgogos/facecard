import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from '../lib/supabase'; // Adjust import path

const DatePickerComponent = ({ onEventsLoaded }) => {
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;

        // For mobile, hide picker after selection
        if (Platform.OS !== 'web') {
            setShow(false);
        }

        setDate(currentDate);
        fetchEventsByDate(currentDate);
    };

    const onWebDateChange = (event) => {
        const selectedDate = new Date(event.target.value);
        setDate(selectedDate);
        fetchEventsByDate(selectedDate);
    };

    const fetchEventsByDate = async (selectedDate) => {
        setLoading(true);

        try {
            // Format date to YYYY-MM-DD for SQL query
            const formattedDate = selectedDate.toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('events')
                .select('*, photos(count)')
                .eq('event_date', formattedDate)
                .order('event_id', { ascending: false });

            if (error) {
                console.error('Error fetching events:', error);
                return;
            }

            setEvents(data || []);

            // Pass events to parent component if callback provided
            if (onEventsLoaded) {
                onEventsLoaded(data || []);
            }

        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const renderEvent = ({ item }) => (
        <View style={styles.eventItem}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventDepartment}>{item.department}</Text>
            <Text style={styles.eventPhotos}>{item.photo_count} photos</Text>
        </View>
    );

    const renderDatePicker = () => {
        if (Platform.OS === 'web') {
            return (
                <input
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={onWebDateChange}
                    style={styles.webDateInput}
                />
            );
        }

        return (
            <>
                <TouchableOpacity style={styles.dateButton} onPress={showDatepicker}>
                    <Text style={styles.dateButtonText}>
                        Select Date: {date.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode="date"
                        display="default"
                        onChange={onChange}
                    />
                )}
            </>
        );
    };

    return (
        <View style={styles.container}>
            {renderDatePicker()}

            {loading && <Text style={styles.loading}>Loading events...</Text>}

            <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.event_id.toString()}
                style={styles.eventsList}
                ListEmptyComponent={
                    !loading ? <Text style={styles.noEvents}>No events found for this date</Text> : null
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginBottom: '0 auto',
        minHeight: '100vh',
    },
    dateButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: '20 auto',
    },
    dateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    webDateInput: {
        padding: 15,
        fontSize: 16,
        borderRadius: 8,
        border: '2px solid #007AFF',
        marginBottom: 20,
        width: '100%',
        boxSizing: 'border-box',
    },
    loading: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    eventsList: {
        minHeight: 150,
        maxHeight: 400,
        flex: 1,
        margin: '10 auto', 
        marginBottom: 50,
    },
    eventItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        maring:10, 
        borderRadius: 8,
        marginBottom: 20,
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
    eventPhotos: {
        fontSize: 12,
        color: '#999',
    },
    noEvents: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default DatePickerComponent;