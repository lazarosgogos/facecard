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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import InitialPageComponent from "../components/initial-page/InitialPageComponent";
import { Session } from "@supabase/supabase-js"
import { useSession } from "../components/ctx";
import { supabase } from "../../lib/supabase";
import { useLocalSearchParams } from "expo-router";

export default function App() {
    // const session = useSession();

    return (
        <SafeAreaView style={ styles.container }>
            <InitialPageComponent />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            padding: 16,
            alignItems: 'center',
            backgroundColor: '#ddd',
        }
    }
)