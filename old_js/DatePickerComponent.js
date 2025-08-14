import React, {useEffect, useState} from 'react'
import { Picker } from '@react-native-picker/picker'
import {View, StyleSheet} from 'react-native'
import { supabase } from '../lib/supabase'
import { FlatList } from 'react-native-web';


export default function DatePickerComponent() {
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [events, setEvents] = useState([]);

    
    const [selectedYear, setSelectedYear] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {fetchYears();}, []);
    
    const fetchYears = async () => {
        const { data, error } = await supabase.rpc('get_unique_event_years');
        if (!error) {
            setYears(data);
            if (data.length > 0){
                setSelectedYear(data[0].year);
            }
        } else {
            console.error(error);
        }
    };

    useEffect(()=> {
        if (selectedYear) {
            fetchMonths(selectedYear);
        }
    }, [selectedYear]);

    const fetchMonths = async (year) => {
        const { data, error } = await supabase.rpc('get_unique_event_months', { selected_year: year});

        if (!error) {
            setMonths(data);
            setSelectedMonth(null);
            setEvents([]);
        } else {
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (selectedYear && selectedMonth) {
            fetchEvents(selectedYear, selectedMonth);
        }
    }, [selectedMonth]);

    const fetchEvents = async (year, month) => {
        const monthStr = month.toString().padStart(2, '0');
        const startDate = `${year}-${monthStr}-01`;
        year = Number(year)
        month = Number(month) +  1
        if (month>12) {
            month = 1
            year += 1
        }
        const endDate = `${year}-${(month).toString().padStart(2, '0')}-01`;

        const {data, error} = await supabase
            .from('events')
            .select('*')
            .gte('event_date', startDate)
            .lt('event_date', endDate);
        
        if (!error) {
            setEvents(data);
            console.info('Successfully fetched events:', data)
        } else {
            console.error(error);
        }
    };
    
    return (
        <View style={styles.container}>
            {/* <Text style={styles.heading}>Select Year and Month</Text> */}
            {/* Year Picker */}
            <Picker 
                selectedValue={selectedYear}
                onValueChange={(value) => setSelectedYear(value)}
                style={styles.picker}>
                
                {years.map((y) => (
                    <Picker.Item key={y.year} label={y.year.toString()} value={y.year} />
                ))}

            </Picker>
            
            {/* Month Picker */}
            <Picker 
                selectedValue={selectedMonth}
                onValueChange={(value) => setSelectedMonth(value)}
                style={styles.picker}>
                
                <Picker.Item label="Select Month" value={null} />
                {months.map((m)=> (
                    <Picker.Item 
                        key={m.month}
                        label={new Date(0, m.month - 1).toLocaleString('default', { month: 'long'})}
                        value={m.month}
                    />
                ))}
            </Picker>

            {/* Events List */}
            <FlatList 
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.eventItem}>
                        {item.event_name} - {item.event_date}
                    </Text>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 50 },
    heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    picker: { height: 50, width: '100%', marginBottom: 15 },
    eventItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});