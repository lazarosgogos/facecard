import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../../../lib/supabase';
import { useTheme } from '../../ThemeContext';

const YearMonthEventPicker = ({ onEventsLoaded, handleEmptyList }) => {
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [monthsLoading, setMonthsLoading] = useState(false);
    const { theme } = useTheme();
    const styles = getStyles(theme);

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
            setSelectedMonth('');
            setEvents([]);
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

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Select Year and Month</Text>

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

            {loading && <Text style={styles.loading}>Loading events...</Text>}
        </View>
    );
};

const getStyles = (theme) => StyleSheet.create({
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
        color: theme.text,
    },
    pickerContainer: {
        marginBottom: 20,
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: theme.text,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: theme.border,
        borderRadius: 8,
        backgroundColor: theme.card,
    },
    picker: {
        ...Platform.select({
            android: {
                color: theme.text,
            },
            ios: {
                height: 200,
                justifyContent: 'center',
                color: theme.text,
            },
            web: {
                height: 30,
                color: theme.text,
            },
        }),
    },
    loadingText: {
        padding: 15,
        textAlign: 'center',
        color: theme.secondary,
        fontStyle: 'italic',
    },
    selectionText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
        color: theme.primary,
        backgroundColor: theme.card,
        padding: 10,
        borderRadius: 8,
        margin: 'auto'
    },
    loading: {
        textAlign: 'center',
        fontSize: 16,
        color: theme.secondary,
        marginBottom: 20,
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
});

export default YearMonthEventPicker;