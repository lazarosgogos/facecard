import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../lib/supabase'; // Adjust import path
import { ScrollView } from 'react-native';

const YearMonthEventPicker = ({ onEventsLoaded, handleEmptyList }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [monthsLoading, setMonthsLoading] = useState(false);

    const monthNames = [
        '', 'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        fetchAvailableYears();
    }, []);

    useEffect(() => {
        if (selectedYear) {
            fetchAvailableMonths(selectedYear);
            setSelectedMonth(''); // Reset month selection
            setEvents([]); // Clear events
        }
    }, [selectedYear]);

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            fetchEventsByYearMonth(selectedYear, selectedMonth);
        }
    }, [selectedMonth]);

    const fetchAvailableYears = async () => {
        try {
            const { data, error } = await supabase.rpc('get_unique_event_years');

            if (error) {
                console.error('Error fetching years:', error);
                return;
            }

            setAvailableYears(data || []);
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const fetchAvailableMonths = async (year) => {
        setMonthsLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_unique_event_months', {
                selected_year: parseInt(year)
            });

            if (error) {
                console.error('Error fetching months:', error);
                return;
            }

            setAvailableMonths(data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setMonthsLoading(false);
        }
    };

    

    const fetchEventsByYearMonth = async (year, month) => {
        setLoading(true);

        try {
            const monthStr = month.toString().padStart(2, '0');
            const startDate = `${year}-${monthStr}-01`;
            year = Number(year)
            month = Number(month) + 1
            if (month > 12) {
                month = 1
                year += 1
            }
            const endDate = `${year}-${(month).toString().padStart(2, '0')}-01`;

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('event_date', startDate)
                .lt('event_date', endDate)
                .order('event_date', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
                return;
            }

            setEvents(data || []);

            if (onEventsLoaded) {
                onEventsLoaded(data || []);
            }

        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
            handleEmptyList(!loading && selectedYear && selectedMonth)
        }
    };

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

    return (
        // <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
            <Text style={styles.headerText}>Select Year and Month</Text>

            {/* Year Picker */}
            <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Year:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={selectedYear}
                        onValueChange={setSelectedYear}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select a year" value="" />
                        {availableYears.map((yearData) => (
                            <Picker.Item
                                key={yearData.year}
                                label={yearData.year.toString()}
                                value={yearData.year.toString()}
                            />
                        ))}
                    </Picker>
                </View>
            </View>

            {/* Month Picker */}
            {selectedYear && (
                <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Month:</Text>
                    <View style={styles.pickerWrapper}>
                        {monthsLoading ? (
                            <Text style={styles.loadingText}>Loading months...</Text>
                        ) : (
                            <Picker
                                selectedValue={selectedMonth}
                                onValueChange={setSelectedMonth}
                                style={styles.picker}
                                enabled={availableMonths.length > 0}
                            >
                                <Picker.Item label="Select a month" value="" />
                                {availableMonths.map((monthData) => (
                                    <Picker.Item
                                        key={monthData.month}
                                        label={monthNames[monthData.month]}
                                        value={monthData.month.toString()}
                                    />
                                ))}
                            </Picker>
                        )}
                    </View>
                </View>
            )}

            {/* Selection Summary */}
            {/* {selectedYear && selectedMonth && (
                <Text style={styles.selectionText}>
                    Showing events for {monthNames[parseInt(selectedMonth)]} {selectedYear}
                </Text>
            )} */}

            {/* Loading */}
            {loading && <Text style={styles.loading}>Loading events...</Text>}
            {/* <FlatList
                data={events}
                renderItem={renderEvent}
                keyExtractor={(item) => item.event_id.toString()}
                style={styles.eventsList}
                // contentContainerStyle={{ flexGrow: 1 }}
                ListEmptyComponent={
                    !loading && selectedYear && selectedMonth ?
                        <Text style={styles.noEvents}>No events found for this period</Text> :
                        <Text style={styles.noEvents}>Select year and month to view events</Text>
                }
            /> */}
        </View>
        // </ScrollView>



    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        minHeight: 150,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        // ...Platform.select({
        //     web: {
        //         minHeight: 50,
        //     },
        // }),
    },
    picker: {
        ...Platform.select({
            android: {
                color: '#333',
            },
            ios: {
                height: 30,
            },
            web: {
                height: 30,
            },
        }),
    },
    loadingText: {
        padding: 15,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
    },
    selectionText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: '#007AFF',
        backgroundColor: '#f0f8ff',
        padding: 10,
        borderRadius: 8,
        margin: 'auto'
    },
    loading: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
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
});

export default YearMonthEventPicker;